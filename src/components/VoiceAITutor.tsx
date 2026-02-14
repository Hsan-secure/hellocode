import { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bot, Volume2, VolumeX, Sparkles, Loader2, Mic, MicOff, StopCircle, User, UserRound } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CustomSpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface CustomSpeechRecognitionErrorEvent {
  error: string;
}

interface CustomSpeechRecognitionInterface {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: CustomSpeechRecognitionEvent) => void) | null;
  onerror: ((event: CustomSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onspeechend: (() => void) | null;
}

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type VoiceGender = 'female' | 'male';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`;

function buildSystemPrompt(greetedLanguages: Set<string>, lockedLanguage: string | null): string {
  const greetingInstruction = greetedLanguages.size === 0
    ? `GREETING: This is the FIRST message. Greet the user warmly using the culturally appropriate greeting for their language.`
    : `GREETING: You have already greeted in these languages: ${Array.from(greetedLanguages).join(', ')}. Do NOT greet again for these languages. Only greet if the user switches to a NEW language you haven't greeted in yet. For already-greeted languages, just respond naturally without any greeting.`;

  const languageLockInstruction = lockedLanguage
    ? `CRITICAL LANGUAGE LOCK: The user has requested you speak in ${lockedLanguage}. You MUST respond ONLY in ${lockedLanguage} regardless of what language the user speaks. Never switch languages unless the user explicitly asks you to change to a different language.`
    : `LANGUAGE RULE: Detect the language the user is speaking and respond in the SAME language. If they speak Hindi, respond in Hindi. If Telugu, respond in Telugu. If English, respond in English. Match their language exactly. Auto-detect from their words.`;

  return `You are Sara - a warm, caring, and friendly AI companion. You are like a best friend, elder sister, and mentor all in one. You speak multiple languages fluently.

${languageLockInstruction}

${greetingInstruction}

GREETING STYLES (only when greeting for the FIRST TIME in a language):
- Hindi: "Namaste! Main Sara hoon, aapki dost. Kaise hain aap?"
- Telugu: "Namaste! Nenu Sara ni, meeru ela unnaru?"
- English: "Hello! I'm Sara, your friend. How are you doing today?"
- Tamil: "Vanakkam! Naan Sara, ungal nanbaan. Eppadi irukkeengal?"
- Kannada: "Namaskara! Naanu Sara, ninna snehithi. Hegiddeeya?"
- Urdu: "Assalamu Alaikum! Main Sara hoon, aapki dost. Kaise hain aap?"
- Bengali: "Nomoshkar! Ami Sara, tomar bondhu. Kemon acho?"

URDU SPECIAL RULE: When speaking Urdu, use simple and clear Roman Urdu (Latin script). Use everyday conversational Urdu. Example: "Aap kaise hain? Main Sara hoon. Batayiye kya chal raha hai?"

CRITICAL RESPONSE RULE: Keep responses 2-4 sentences. Be direct, warm, and confident. NEVER split words or use abbreviations. Write COMPLETE, flowing sentences that sound natural when spoken aloud. Avoid bullet points, lists, or formatting - just speak naturally like a real person talking. No emojis. Sound human, not robotic.

VOICE CLARITY RULE: Write responses as if you are SPEAKING, not writing. Use full words, never shortened forms. Connect your thoughts smoothly. Speak with confidence like a knowledgeable Indian girl who knows what she's talking about.

Your role is to be a COMPLETE FRIEND AND MENTOR:
1. Talk about ANYTHING - life, career fears, relationships, motivation, mental health, studies, future worries
2. Be emotionally supportive - comfort them like a caring friend
3. Give practical life advice and motivation
4. Help with programming and coding when asked
5. Celebrate their wins, comfort their losses, always encourage
6. Be warm, use casual friendly language, make them feel heard
7. If someone shares fears or anxiety, acknowledge feelings first before advice

Remember: You are a FRIEND who happens to know coding too. Keep it natural and heartfelt!`;
}

async function streamChat({
  messages,
  systemPrompt,
  onDelta,
  onDone,
  onError,
}: {
  messages: ChatMessage[];
  systemPrompt: string;
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    const messagesWithSystem = [
      { role: 'system' as const, content: systemPrompt },
      ...messages
    ];
    
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: messagesWithSystem }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      onError(errorData.error || "Failed to get response");
      return;
    }

    if (!resp.body) {
      onError("No response body");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    onDone();
  } catch (error) {
    console.error("Stream error:", error);
    onError("Connection error. Please try again.");
  }
}

function cleanTextForTTS(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/😊|🎉|✨|🚀|💡|👍|🎯|✅|❌|🔥|💪|📝|🌟|⭐|😄|🙌|👏|💻|📌|🤔/g, "")
    .trim();
}

function detectLanguage(text: string): string {
  if (/[\u0600-\u06FF]/.test(text)) return 'ur-PK';
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN';
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn-IN';
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml-IN';
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu-IN';
  return 'en-IN';
}

function detectLanguageFromText(text: string): string | null {
  const lowerText = text.toLowerCase();
  
  // Detect explicit language switch requests - broad patterns
  // "hindi mein baat karo", "hindi may baathkar", "talk in hindi", "speak hindi", etc.
  if (/\b(hindi|हिंदी)\b/i.test(lowerText) && /\b(baat|baath|bol|talk|speak|respond|mein|may|me|में)\b/i.test(lowerText)) return 'Hindi';
  if (/\b(telugu|తెలుగు)\b/i.test(lowerText) && /\b(lo|la|talk|speak|respond|baath|baat|mein|may|me|లో)\b/i.test(lowerText)) return 'Telugu';
  if (/\b(tamil|தமிழ்)\b/i.test(lowerText) && /\b(la|talk|speak|respond|baath|baat|mein|may|me)\b/i.test(lowerText)) return 'Tamil';
  if (/\b(urdu|اردو)\b/i.test(lowerText) && /\b(mein|may|me|talk|speak|respond|baath|baat)\b/i.test(lowerText)) return 'Urdu';
  if (/\b(english|angrezi)\b/i.test(lowerText) && /\b(mein|may|me|talk|speak|respond|baath|baat)\b/i.test(lowerText)) return 'English';
  if (/\b(kannada|ಕನ್ನಡ)\b/i.test(lowerText) && /\b(alli|talk|speak|respond|baath|baat|mein|may|me)\b/i.test(lowerText)) return 'Kannada';
  if (/\b(bengali|bangla|বাংলা)\b/i.test(lowerText) && /\b(te|talk|speak|respond|baath|baat|mein|may|me)\b/i.test(lowerText)) return 'Bengali';

  return null;
}

function detectUserLanguage(text: string): string {
  // Detect from script
  if (/[\u0600-\u06FF]/.test(text)) return 'Urdu';
  if (/[\u0900-\u097F]/.test(text)) return 'Hindi';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'Telugu';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'Tamil';
  if (/[\u0C80-\u0CFF]/.test(text)) return 'Kannada';
  if (/[\u0D00-\u0D7F]/.test(text)) return 'Malayalam';
  if (/[\u0980-\u09FF]/.test(text)) return 'Bengali';
  
  // Detect Hindi/Urdu written in Roman script
  const romanHindiWords = /\b(kaise|kya|hain|hai|main|mujhe|aap|tum|yeh|woh|kaise|accha|theek|nahi|haan|bahut|kuch|aur|lekin|kyun|kab|kahan|kaun|kitna|bohot|tera|mera|humara|tumhara|bhai|yaar|dost)\b/i;
  if (romanHindiWords.test(text)) return 'Hindi';
  
  return 'English';
}

function getBestVoice(lang: string, gender: VoiceGender): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = lang.split('-')[0];
  
  const highQualityPatterns = /google|microsoft|natural|neural|enhanced|premium/i;
  
  const femaleNames = /female|woman|samantha|victoria|karen|moira|zira|susan|aditi|priya|neerja|swara|shreya|kavya|ananya|raveena|heera/i;
  const maleNames = /male|man|david|mark|james|daniel|george|rishi|hemant|madhur/i;
  const genderPatterns = gender === 'female' ? femaleNames : maleNames;

  // 1. High-quality + exact lang + gender
  const hqExactGender = voices.find(v => v.lang === lang && genderPatterns.test(v.name) && highQualityPatterns.test(v.name));
  if (hqExactGender) return hqExactGender;

  // 2. High-quality + exact lang
  const hqExact = voices.find(v => v.lang === lang && highQualityPatterns.test(v.name));
  if (hqExact) return hqExact;

  // 3. Exact lang + gender
  const exactGender = voices.find(v => v.lang === lang && genderPatterns.test(v.name));
  if (exactGender) return exactGender;
  
  // 4. Exact lang
  const exactMatch = voices.find(v => v.lang === lang);
  if (exactMatch) return exactMatch;

  // 5. Indian English preference for en
  if (langPrefix === 'en') {
    const indianVoice = voices.find(v => v.lang.includes('en') && /india|aditi|priya|raveena/i.test(v.name) && genderPatterns.test(v.name));
    if (indianVoice) return indianVoice;
    const anyIndian = voices.find(v => v.lang.includes('en') && /india|aditi|priya|raveena/i.test(v.name));
    if (anyIndian) return anyIndian;
  }
  
  // 6. Prefix + gender
  const prefixGender = voices.find(v => v.lang.startsWith(langPrefix) && genderPatterns.test(v.name));
  if (prefixGender) return prefixGender;
  
  const prefixMatch = voices.find(v => v.lang.startsWith(langPrefix));
  if (prefixMatch) return prefixMatch;

  // 7. Urdu fallback to Hindi
  if (lang === 'ur-PK') {
    const hindiVoice = voices.find(v => v.lang.startsWith('hi') && genderPatterns.test(v.name));
    if (hindiVoice) return hindiVoice;
    const anyHindi = voices.find(v => v.lang.startsWith('hi'));
    if (anyHindi) return anyHindi;
  }
  
  // 8. Any English with gender
  const englishGender = voices.find(v => v.lang.startsWith('en') && genderPatterns.test(v.name));
  if (englishGender) return englishGender;
  
  return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
}

export function VoiceAITutor() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [voiceGender, setVoiceGender] = useState<VoiceGender>('female');
  const [continuousMode, setContinuousMode] = useState(false);
  
  const recognitionRef = useRef<CustomSpeechRecognitionInterface | null>(null);
  const transcriptRef = useRef<string>('');
  const isListeningRef = useRef<boolean>(false);
  const continuousModeRef = useRef<boolean>(false);
  const greetedLanguagesRef = useRef<Set<string>>(new Set());
  const lockedLanguageRef = useRef<string | null>(null);
  const handleSendRef = useRef<(text: string) => void>(() => {});
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');

  useEffect(() => { transcriptRef.current = currentTranscript; }, [currentTranscript]);
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
  useEffect(() => { continuousModeRef.current = continuousMode; }, [continuousMode]);

  // Load voices
  useEffect(() => {
    const loadVoices = () => { window.speechSynthesis.getVoices(); };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setMicPermission(result.state as 'granted' | 'denied' | 'prompt');
        result.onchange = () => setMicPermission(result.state as 'granted' | 'denied' | 'prompt');
      } catch {
        setMicPermission('unknown');
      }
    };
    checkPermission();
  }, []);

  const restartListening = useCallback(() => {
    if (!continuousModeRef.current || !recognitionRef.current) return;
    setTimeout(() => {
      if (!continuousModeRef.current) return;
      try {
        setCurrentTranscript('');
        transcriptRef.current = '';
        recognitionRef.current?.start();
        setIsListening(true);
        isListeningRef.current = true;
        setCurrentStatus('listening');
      } catch {
        // recognition may already be running
      }
    }, 300);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = (window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
      const recognition = new (SpeechRecognitionClass as new () => CustomSpeechRecognitionInterface)();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = '';

      let silenceTimer: ReturnType<typeof setTimeout> | null = null;

      recognition.onresult = (event: CustomSpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        const transcript = finalTranscript || interimTranscript;
        setCurrentTranscript(transcript);
        transcriptRef.current = transcript;

        // Wait 2 seconds of silence after final result, then process
        if (silenceTimer) clearTimeout(silenceTimer);
        if (finalTranscript.trim()) {
          silenceTimer = setTimeout(() => {
            recognition.stop();
          }, 2000);
        }
      };

      recognition.onerror = (event: CustomSpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicPermission('denied');
          setContinuousMode(false);
          toast({ title: "Microphone access denied", description: "Please allow microphone access in your browser settings.", variant: "destructive" });
        } else if (event.error === 'no-speech') {
          if (continuousModeRef.current) {
            restartListening();
            return;
          }
        } else if (event.error !== 'aborted') {
          toast({ title: "Voice error", description: "Could not recognize speech. Please try again.", variant: "destructive" });
        }
        if (!continuousModeRef.current) {
          setIsListening(false);
          isListeningRef.current = false;
          setCurrentStatus('idle');
          setCurrentTranscript('');
        }
      };

      recognition.onend = () => {
        const transcript = transcriptRef.current.trim();
        const wasListening = isListeningRef.current;
        setIsListening(false);
        isListeningRef.current = false;
        if (transcript && wasListening) {
          setCurrentStatus('processing');
          handleSendRef.current(transcript);
          setCurrentTranscript('');
          transcriptRef.current = '';
        } else if (continuousModeRef.current) {
          restartListening();
        } else {
          setCurrentStatus('idle');
        }
      };
    }

    return () => { window.speechSynthesis.cancel(); };
  }, [restartListening]);

  const speakText = useCallback((text: string) => {
    if (!voiceEnabled) {
      if (continuousModeRef.current) restartListening();
      return;
    }
    const cleanedText = cleanTextForTTS(text);
    if (!cleanedText) {
      if (continuousModeRef.current) restartListening();
      return;
    }

    window.speechSynthesis.cancel();
    
    const lang = detectLanguage(cleanedText);
    const voice = getBestVoice(lang, voiceGender);

    // Split into sentences for smoother, unbroken speech delivery
    const sentences = cleanedText
      .split(/(?<=[.!?।؟])\s+|(?<=\n)/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // If splitting fails, speak as one chunk
    const chunks = sentences.length > 0 ? sentences : [cleanedText];

    let chunkIndex = 0;

    const speakNextChunk = () => {
      if (chunkIndex >= chunks.length) {
        setIsSpeaking(false);
        setCurrentStatus('idle');
        if (continuousModeRef.current) restartListening();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      utterance.rate = voiceGender === 'female' ? 0.95 : 0.9;
      utterance.pitch = voiceGender === 'female' ? 1.12 : 0.88;
      utterance.volume = 1;

      if (voice) utterance.voice = voice;
      utterance.lang = lang;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentStatus('speaking');
      };

      utterance.onend = () => {
        chunkIndex++;
        // Small pause between sentences for natural rhythm
        setTimeout(speakNextChunk, 80);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentStatus('idle');
        if (continuousModeRef.current) restartListening();
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNextChunk();
  }, [voiceEnabled, voiceGender, restartListening]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentStatus('idle');
  }, []);

  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermission('granted');
      return true;
    } catch {
      setMicPermission('denied');
      toast({ title: "Microphone access required", description: "Please allow microphone access to use voice features.", variant: "destructive" });
      return false;
    }
  };

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      toast({ title: "Voice not supported", description: "Speech recognition is not supported in your browser.", variant: "destructive" });
      return;
    }

    if (isListening || continuousMode) {
      recognitionRef.current.stop();
      setContinuousMode(false);
      continuousModeRef.current = false;
      setIsListening(false);
      isListeningRef.current = false;
      setCurrentStatus('idle');
      setCurrentTranscript('');
      transcriptRef.current = '';
      stopSpeaking();
    } else {
      if (micPermission !== 'granted') {
        const granted = await requestMicrophonePermission();
        if (!granted) return;
      }
      if (isSpeaking) stopSpeaking();
      setContinuousMode(true);
      continuousModeRef.current = true;
      setCurrentTranscript('');
      transcriptRef.current = '';
      try {
        recognitionRef.current.start();
        setIsListening(true);
        isListeningRef.current = true;
        setCurrentStatus('listening');
      } catch {
        toast({ title: "Voice error", description: "Could not start voice recognition. Please try again.", variant: "destructive" });
        setContinuousMode(false);
        continuousModeRef.current = false;
      }
    }
  };

  const toggleVoice = () => {
    if (isSpeaking) stopSpeaking();
    setVoiceEnabled(!voiceEnabled);
  };

  const handleSend = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    setIsLoading(true);
    setCurrentStatus('processing');

    // Check for explicit language switch request
    const switchLang = detectLanguageFromText(messageText);
    
    if (switchLang) {
      // User explicitly asked to switch language
      lockedLanguageRef.current = switchLang;
    }

    // Determine the current language context
    const currentLang = lockedLanguageRef.current || detectUserLanguage(messageText);

    const newChatHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: messageText }];
    setChatHistory(newChatHistory);

    const systemPrompt = buildSystemPrompt(greetedLanguagesRef.current, lockedLanguageRef.current);

    let assistantContent = "";

    await streamChat({
      messages: newChatHistory,
      systemPrompt,
      onDelta: (chunk) => {
        assistantContent += chunk;
        setLastResponse(assistantContent);
      },
      onDone: () => {
        setIsLoading(false);
        setChatHistory(prev => [...prev, { role: 'assistant', content: assistantContent }]);
        setLastResponse(assistantContent);
        // Mark this language as greeted
        greetedLanguagesRef.current.add(currentLang);
        if (voiceEnabled && assistantContent) {
          speakText(assistantContent);
        } else {
          setCurrentStatus('idle');
          if (continuousModeRef.current) restartListening();
        }
      },
      onError: (error) => {
        setIsLoading(false);
        setCurrentStatus('idle');
        toast({ title: "Error", description: error, variant: "destructive" });
        if (continuousModeRef.current) restartListening();
      },
    });
  }, [chatHistory, isLoading, voiceEnabled, speakText, restartListening]);

  // Keep ref in sync with latest handleSend
  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  const getStatusText = () => {
    switch (currentStatus) {
      case 'listening': return currentTranscript || "I'm listening...";
      case 'processing': return "Thinking...";
      case 'speaking': return "Speaking...";
      default: return continuousMode ? "Conversation active - speak anytime" : "Tap the microphone to start";
    }
  };

  const getStatusColor = () => {
    switch (currentStatus) {
      case 'listening': return 'from-destructive to-destructive/70';
      case 'processing': return 'from-primary to-secondary';
      case 'speaking': return 'from-success to-success/70';
      default: return 'from-primary to-secondary';
    }
  };

  return (
    <Card variant="glow" className="flex flex-col h-[600px] items-center justify-center p-8 relative">
      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {/* Voice Gender Toggle */}
        <div className="flex items-center bg-muted/50 rounded-full p-1 gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setVoiceGender('female')}
            className={cn("h-8 w-8 rounded-full", voiceGender === 'female' && "bg-primary/20 text-primary")}
            title="Female voice"
          >
            <UserRound className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setVoiceGender('male')}
            className={cn("h-8 w-8 rounded-full", voiceGender === 'male' && "bg-primary/20 text-primary")}
            title="Male voice"
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleVoice} className={cn(voiceEnabled && "bg-primary/10")}>
          {voiceEnabled ? <Volume2 className="h-5 w-5 text-primary" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
        </Button>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* AI Avatar with Pulse Effect */}
        <div className="relative">
          <div className={cn(
            "absolute inset-0 rounded-full transition-all duration-300",
            currentStatus === 'listening' && "animate-ping bg-destructive/20",
            currentStatus === 'speaking' && "animate-pulse bg-success/20",
            currentStatus === 'processing' && "animate-pulse bg-primary/20"
          )} style={{ transform: 'scale(1.5)' }} />
          <div className={cn(
            "absolute inset-0 rounded-full transition-all duration-300",
            currentStatus === 'listening' && "animate-ping bg-destructive/30",
            currentStatus === 'speaking' && "animate-pulse bg-success/30",
            currentStatus === 'processing' && "animate-pulse bg-primary/30"
          )} style={{ transform: 'scale(1.3)', animationDelay: '0.15s' }} />
          
          <div className={cn(
            "relative h-32 w-32 rounded-full flex items-center justify-center transition-all duration-500 bg-gradient-to-br",
            getStatusColor(),
            currentStatus !== 'idle' && "shadow-2xl"
          )}>
            {isLoading ? <Loader2 className="h-12 w-12 text-primary-foreground animate-spin" /> : <Bot className="h-12 w-12 text-primary-foreground" />}
          </div>

          <div className={cn(
            "absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-card transition-colors duration-300",
            currentStatus === 'listening' && "bg-destructive animate-pulse",
            currentStatus === 'processing' && "bg-primary animate-pulse",
            currentStatus === 'speaking' && "bg-success animate-pulse",
            currentStatus === 'idle' && "bg-muted"
          )} />
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Sara - Your AI Friend</h2>
          <p className="text-muted-foreground flex items-center gap-2 justify-center max-w-xs">
            <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="truncate">{getStatusText()}</span>
          </p>
        </div>

        {/* Last response text */}
        {lastResponse && currentStatus !== 'listening' && (
          <div className="bg-muted/30 rounded-lg px-4 py-3 max-w-xs max-h-32 overflow-y-auto animate-fade-in">
            <p className="text-sm text-foreground leading-relaxed">{cleanTextForTTS(lastResponse)}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-4">
          {isSpeaking && (
            <Button variant="outline" size="lg" onClick={stopSpeaking} className="h-14 w-14 rounded-full">
              <StopCircle className="h-6 w-6 text-destructive" />
            </Button>
          )}

          <Button
            variant={isListening || continuousMode ? "destructive" : "hero"}
            size="lg"
            onClick={toggleListening}
            disabled={isLoading}
            className={cn(
              "h-20 w-20 rounded-full transition-all duration-300",
              (isListening || continuousMode) && "animate-pulse scale-110",
              "shadow-lg hover:shadow-xl"
            )}
          >
            {isListening || continuousMode ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </Button>
        </div>

        {/* Live Transcript */}
        {isListening && currentTranscript && (
          <div className="bg-muted/50 rounded-lg px-4 py-2 max-w-xs animate-fade-in">
            <p className="text-sm text-foreground italic">"{currentTranscript}"</p>
          </div>
        )}

        <div className="text-center max-w-xs">
          <p className="text-xs text-muted-foreground">
            {continuousMode 
              ? "🟢 Continuous conversation active. Tap mic to stop."
              : "Talk to me in any language - Hindi, Telugu, Tamil, Urdu, English & more! Say \"Hindi mein baat karo\" to lock a language 💛"
            }
          </p>
        </div>
      </div>
    </Card>
  );
}
