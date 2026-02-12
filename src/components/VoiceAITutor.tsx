import { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bot, Volume2, VolumeX, Sparkles, Loader2, Mic, MicOff, StopCircle } from 'lucide-react';
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

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`;

const MULTILINGUAL_SYSTEM_PROMPT = `You are Devi - a warm, caring, and friendly AI companion. You are like a best friend, elder sister, and mentor all in one. You speak multiple languages fluently.

CRITICAL LANGUAGE RULE: You MUST respond in the SAME LANGUAGE that the user speaks to you.
- If the user asks in Hindi, respond entirely in Hindi
- If the user asks in Telugu, respond entirely in Telugu  
- If the user asks in Tamil, respond entirely in Tamil
- If the user asks in English, respond in English
- If the user asks in Urdu, respond in Urdu
- For any other language, match the user's language

GREETING RULES (for first message or greetings):
- Hindi speakers: Greet with "Assalamu Alaikum!" or "Namaste!" based on context
- Telugu speakers: Greet with "Namaste!" or "Baagunnara?"
- English speakers: Greet with "Hello! How are you doing?"  
- Tamil speakers: Greet with "Vanakkam!"
- Kannada speakers: Greet with "Namaskara!"
- Urdu speakers: Greet with "Assalamu Alaikum!"
- Bengali speakers: Greet with "Nomoshkar!"
- Use culturally appropriate greetings for any other language

CRITICAL RESPONSE RULE: Keep your responses SHORT and CONCISE - maximum 2-3 sentences. Be direct, warm, and supportive. No long paragraphs.

Your role is to be a COMPLETE FRIEND AND MENTOR:
1. Talk about ANYTHING - life, career fears, relationships, motivation, mental health, studies, future worries
2. Be emotionally supportive - if someone is scared about their career or life, comfort them like a caring friend
3. Give practical life advice and motivation
4. Help with programming and coding when asked (HTML, CSS, JavaScript, Python, Data Structures, DBMS)
5. Celebrate their wins, comfort their losses, and always encourage them
6. Be warm, use casual friendly language, and make them feel heard and valued
7. If someone shares fears or anxiety, acknowledge their feelings first before giving advice

Remember: You are NOT just a coding tutor. You are a FRIEND who happens to know coding too. Detect the user's language and respond in that same language! Keep it short and heartfelt!`;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: ChatMessage[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    const messagesWithSystem = [
      { role: 'system' as const, content: MULTILINGUAL_SYSTEM_PROMPT },
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

// Detect language from text for TTS voice selection
function detectLanguage(text: string): string {
  // Hindi (Devanagari)
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
  // Telugu
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN';
  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN';
  // Kannada
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn-IN';
  // Malayalam
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml-IN';
  // Bengali
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
  // Gujarati
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu-IN';
  // Marathi uses Devanagari too, covered by hi-IN
  return 'en-IN';
}

// Get the best female voice for the language
function getBestVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  
  // Try to find a female voice matching the language
  const langPrefix = lang.split('-')[0];
  
  // Priority: exact match female > exact match any > language prefix female > language prefix any
  const exactFemale = voices.find(v => v.lang === lang && /female|woman|mahila/i.test(v.name));
  if (exactFemale) return exactFemale;
  
  const exactMatch = voices.find(v => v.lang === lang);
  if (exactMatch) return exactMatch;
  
  const prefixFemale = voices.find(v => v.lang.startsWith(langPrefix) && /female|woman/i.test(v.name));
  if (prefixFemale) return prefixFemale;
  
  const prefixMatch = voices.find(v => v.lang.startsWith(langPrefix));
  if (prefixMatch) return prefixMatch;
  
  // For Indian English, try Google's Indian voice
  if (lang === 'en-IN') {
    const indianEnglish = voices.find(v => v.lang.includes('en') && v.name.toLowerCase().includes('india'));
    if (indianEnglish) return indianEnglish;
  }
  
  // Fallback to any English female voice
  const englishFemale = voices.find(v => v.lang.startsWith('en') && /female|woman|samantha|victoria|karen|moira/i.test(v.name));
  if (englishFemale) return englishFemale;
  
  // Final fallback
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
  
  const recognitionRef = useRef<CustomSpeechRecognitionInterface | null>(null);
  const transcriptRef = useRef<string>('');
  const isListeningRef = useRef<boolean>(false);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');

  useEffect(() => { transcriptRef.current = currentTranscript; }, [currentTranscript]);
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);

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

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass() as CustomSpeechRecognitionInterface;
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      // Don't set a specific lang so it auto-detects multilingual input
      recognition.lang = '';

      recognition.onresult = (event) => {
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
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicPermission('denied');
          toast({ title: "Microphone access denied", description: "Please allow microphone access in your browser settings.", variant: "destructive" });
        } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
          toast({ title: "Voice error", description: "Could not recognize speech. Please try again.", variant: "destructive" });
        }
        setIsListening(false);
        isListeningRef.current = false;
        setCurrentStatus('idle');
        setCurrentTranscript('');
      };

      recognition.onend = () => {
        const transcript = transcriptRef.current.trim();
        const wasListening = isListeningRef.current;
        setIsListening(false);
        isListeningRef.current = false;
        if (transcript && wasListening) {
          setCurrentStatus('processing');
          handleSend(transcript);
          setCurrentTranscript('');
          transcriptRef.current = '';
        } else {
          setCurrentStatus('idle');
        }
      };
    }

    return () => { window.speechSynthesis.cancel(); };
  }, []);

  // Browser TTS - free, fast, multilingual
  const speakText = useCallback((text: string) => {
    if (!voiceEnabled) return;
    const cleanedText = cleanTextForTTS(text);
    if (!cleanedText) return;

    window.speechSynthesis.cancel();
    
    const lang = detectLanguage(cleanedText);
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = 1.05;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    
    const voice = getBestVoice(lang);
    if (voice) utterance.voice = voice;
    utterance.lang = lang;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentStatus('speaking');
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentStatus('idle');
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentStatus('idle');
    };

    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

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

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      isListeningRef.current = false;
      setCurrentStatus('idle');
      setCurrentTranscript('');
      transcriptRef.current = '';
    } else {
      if (micPermission !== 'granted') {
        const granted = await requestMicrophonePermission();
        if (!granted) return;
      }
      if (isSpeaking) stopSpeaking();
      setCurrentTranscript('');
      transcriptRef.current = '';
      try {
        recognitionRef.current.start();
        setIsListening(true);
        isListeningRef.current = true;
        setCurrentStatus('listening');
      } catch {
        toast({ title: "Voice error", description: "Could not start voice recognition. Please try again.", variant: "destructive" });
      }
    }
  };

  const toggleVoice = () => {
    if (isSpeaking) stopSpeaking();
    setVoiceEnabled(!voiceEnabled);
  };

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    setIsLoading(true);
    setCurrentStatus('processing');

    const newChatHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: messageText }];
    setChatHistory(newChatHistory);

    let assistantContent = "";

    await streamChat({
      messages: newChatHistory,
      onDelta: (chunk) => {
        assistantContent += chunk;
        setLastResponse(assistantContent);
      },
      onDone: () => {
        setIsLoading(false);
        setChatHistory(prev => [...prev, { role: 'assistant', content: assistantContent }]);
        setLastResponse(assistantContent);
        if (voiceEnabled && assistantContent) {
          speakText(assistantContent);
        } else {
          setCurrentStatus('idle');
        }
      },
      onError: (error) => {
        setIsLoading(false);
        setCurrentStatus('idle');
        toast({ title: "Error", description: error, variant: "destructive" });
      },
    });
  };

  const getStatusText = () => {
    switch (currentStatus) {
      case 'listening': return currentTranscript || "I'm listening...";
      case 'processing': return "Thinking...";
      case 'speaking': return "Speaking...";
      default: return "Tap the microphone to ask a question";
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
      {/* Voice Toggle */}
      <div className="absolute top-4 right-4">
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
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Devi - Your AI Friend</h2>
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
            variant={isListening ? "destructive" : "hero"}
            size="lg"
            onClick={toggleListening}
            disabled={isLoading || isSpeaking}
            className={cn(
              "h-20 w-20 rounded-full transition-all duration-300",
              isListening && "animate-pulse scale-110",
              "shadow-lg hover:shadow-xl"
            )}
          >
            {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
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
            Talk to me in any language - Hindi, Telugu, Tamil, English & more! Ask about life, career, coding, or anything on your mind 💛
          </p>
        </div>
      </div>
    </Card>
  );
}
