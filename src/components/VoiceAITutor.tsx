import { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bot, Volume2, VolumeX, Sparkles, Loader2, Mic, MicOff, StopCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Type definition for SpeechRecognition
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
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;

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
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
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

// Clean text for TTS - remove markdown, emojis, code blocks
function cleanTextForTTS(text: string): string {
  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "I've included some code in my response.")
    // Remove inline code
    .replace(/`[^`]+`/g, "code snippet")
    // Remove markdown links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove markdown bold/italic
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
    // Remove headers
    .replace(/^#{1,6}\s*/gm, "")
    // Clean up excessive whitespace
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function VoiceAITutor() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  
  const recognitionRef = useRef<CustomSpeechRecognitionInterface | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioGainRef = useRef<GainNode | null>(null);

  const transcriptRef = useRef<string>('');
  const isListeningRef = useRef<boolean>(false);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');

  // Update refs when state changes
  useEffect(() => {
    transcriptRef.current = currentTranscript;
  }, [currentTranscript]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Check microphone permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setMicPermission(result.state as 'granted' | 'denied' | 'prompt');
        result.onchange = () => {
          setMicPermission(result.state as 'granted' | 'denied' | 'prompt');
        };
      } catch {
        // Permissions API not supported, will check on first use
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
      recognition.lang = 'en-US';

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
          toast({
            title: "Microphone access denied",
            description: "Please allow microphone access in your browser settings to use voice features.",
            variant: "destructive",
          });
        } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
          toast({
            title: "Voice error",
            description: "Could not recognize speech. Please try again.",
            variant: "destructive",
          });
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

    return () => {
      // Stop any playing audio
      try {
        audioRef.current?.pause();
      } catch {
        // ignore
      }

      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch {
          // ignore
        }
        try {
          audioSourceRef.current.disconnect();
        } catch {
          // ignore
        }
        audioSourceRef.current = null;
      }

      if (audioGainRef.current) {
        try {
          audioGainRef.current.disconnect();
        } catch {
          // ignore
        }
        audioGainRef.current = null;
      }

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }

      if (audioContextRef.current) {
        void audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, []);

  // Pulse animation for listening/speaking
  useEffect(() => {
    if (isListening || isSpeaking) {
      const interval = setInterval(() => {
        setPulseIntensity(prev => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(interval);
    } else {
      setPulseIntensity(0);
    }
  }, [isListening, isSpeaking]);

  const ensureAudioContextReady = useCallback(async (): Promise<AudioContext | null> => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }, []);

  const stopWebAudio = useCallback(() => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.onended = null;
        audioSourceRef.current.stop();
      } catch {
        // ignore
      }
      try {
        audioSourceRef.current.disconnect();
      } catch {
        // ignore
      }
      audioSourceRef.current = null;
    }

    if (audioGainRef.current) {
      try {
        audioGainRef.current.disconnect();
      } catch {
        // ignore
      }
      audioGainRef.current = null;
    }
  }, []);

  // ElevenLabs TTS
  const speakTextWithElevenLabs = useCallback(async (text: string) => {
    if (!voiceEnabled) return;

    const cleanedText = cleanTextForTTS(text);
    if (!cleanedText) return;

    try {
      setIsSpeaking(true);
      setCurrentStatus('speaking');

      // Stop anything already playing
      stopWebAudio();
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } catch {
          // ignore
        }
        audioRef.current = null;
      }

      const response = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: cleanedText }),
      });

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      // Prefer WebAudio playback (more reliable vs autoplay policies)
      const audioBytes = await response.arrayBuffer();
      const audioContext = await ensureAudioContextReady();
      if (audioContext) {
        const decoded = await audioContext.decodeAudioData(audioBytes.slice(0));

        const source = audioContext.createBufferSource();
        const gain = audioContext.createGain();
        gain.gain.value = 1;

        source.buffer = decoded;
        source.connect(gain);
        gain.connect(audioContext.destination);

        audioSourceRef.current = source;
        audioGainRef.current = gain;

        source.onended = () => {
          setIsSpeaking(false);
          setCurrentStatus('idle');
          audioSourceRef.current = null;
        };

        source.start(0);
        return;
      }

      // Fallback: HTMLAudioElement
      const audioBlob = new Blob([audioBytes], { type: 'audio/mpeg' });

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audio.volume = 1;
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        setCurrentStatus('idle');
      };

      audio.onerror = () => {
        console.error('Audio playback error');
        setIsSpeaking(false);
        setCurrentStatus('idle');
      };

      try {
        await audio.play();
      } catch (err) {
        console.error('Audio play blocked:', err);
        setIsSpeaking(false);
        setCurrentStatus('idle');
        toast({
          title: 'Audio blocked by browser',
          description: 'Tap the microphone once, then try again (some browsers block auto-play audio).',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      setIsSpeaking(false);
      setCurrentStatus('idle');
      toast({
        title: "Voice error",
        description: "Could not play the voice response. Please try again.",
        variant: "destructive",
      });
    }
  }, [ensureAudioContextReady, stopWebAudio, voiceEnabled]);

  const stopSpeaking = useCallback(() => {
    stopWebAudio();

    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {
        // ignore
      }
      audioRef.current = null;
    }

    setIsSpeaking(false);
    setCurrentStatus('idle');
  }, [stopWebAudio]);

  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately, we just needed permission
      stream.getTracks().forEach(track => track.stop());
      setMicPermission('granted');
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      setMicPermission('denied');
      toast({
        title: "Microphone access required",
        description: "Please allow microphone access to use voice features. Check your browser settings.",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice not supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
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
      // Request microphone permission first
      if (micPermission !== 'granted') {
        const granted = await requestMicrophonePermission();
        if (!granted) return;
      }

      // Unlock audio early (helps with strict mobile autoplay policies)
      try {
        await ensureAudioContextReady();
      } catch {
        // ignore
      }

      // Stop any ongoing speech
      if (isSpeaking) {
        stopSpeaking();
      }
      
      setCurrentTranscript('');
      transcriptRef.current = '';
      
      try {
        recognitionRef.current.start();
        setIsListening(true);
        isListeningRef.current = true;
        setCurrentStatus('listening');
      } catch (error) {
        console.error('Failed to start recognition:', error);
        toast({
          title: "Voice error",
          description: "Could not start voice recognition. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
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
          speakTextWithElevenLabs(assistantContent);
        } else {
          setCurrentStatus('idle');
        }
      },
      onError: (error) => {
        setIsLoading(false);
        setCurrentStatus('idle');
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      },
    });
  };

  const getStatusText = () => {
    switch (currentStatus) {
      case 'listening':
        return currentTranscript || "I'm listening...";
      case 'processing':
        return "Thinking...";
      case 'speaking':
        return "Speaking...";
      default:
        return "Tap the microphone to ask a question";
    }
  };

  const getStatusColor = () => {
    switch (currentStatus) {
      case 'listening':
        return 'from-destructive to-destructive/70';
      case 'processing':
        return 'from-primary to-secondary';
      case 'speaking':
        return 'from-success to-success/70';
      default:
        return 'from-primary to-secondary';
    }
  };

  return (
    <Card variant="glow" className="flex flex-col h-[600px] items-center justify-center p-8 relative">
      {/* Voice Toggle */}
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleVoice}
          className={cn(voiceEnabled && "bg-primary/10")}
        >
          {voiceEnabled ? (
            <Volume2 className="h-5 w-5 text-primary" />
          ) : (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </div>

      {/* Central Voice Interface */}
      <div className="flex flex-col items-center gap-6">
        {/* AI Avatar with Pulse Effect */}
        <div className="relative">
          {/* Outer pulse rings */}
          <div className={cn(
            "absolute inset-0 rounded-full transition-all duration-300",
            currentStatus === 'listening' && "animate-ping bg-destructive/20",
            currentStatus === 'speaking' && "animate-pulse bg-success/20",
            currentStatus === 'processing' && "animate-pulse bg-primary/20"
          )} style={{ transform: 'scale(1.5)' }} />
          <div className={cn(
            "absolute inset-0 rounded-full transition-all duration-300",
            currentStatus === 'listening' && "animate-ping bg-destructive/30 animation-delay-150",
            currentStatus === 'speaking' && "animate-pulse bg-success/30",
            currentStatus === 'processing' && "animate-pulse bg-primary/30"
          )} style={{ transform: 'scale(1.3)', animationDelay: '0.15s' }} />
          
          {/* Main avatar */}
          <div className={cn(
            "relative h-32 w-32 rounded-full flex items-center justify-center transition-all duration-500 bg-gradient-to-br",
            getStatusColor(),
            currentStatus !== 'idle' && "shadow-2xl"
          )}>
            {isLoading ? (
              <Loader2 className="h-12 w-12 text-primary-foreground animate-spin" />
            ) : (
              <Bot className="h-12 w-12 text-primary-foreground" />
            )}
          </div>

          {/* Status indicator */}
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
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Voice AI Tutor
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 justify-center max-w-xs">
            <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="truncate">{getStatusText()}</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          {/* Stop Button (when speaking) */}
          {isSpeaking && (
            <Button
              variant="outline"
              size="lg"
              onClick={stopSpeaking}
              className="h-14 w-14 rounded-full"
            >
              <StopCircle className="h-6 w-6 text-destructive" />
            </Button>
          )}

          {/* Microphone Button */}
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
            {isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>
        </div>

        {/* Live Transcript (when listening) */}
        {isListening && currentTranscript && (
          <div className="bg-muted/50 rounded-lg px-4 py-2 max-w-xs animate-fade-in">
            <p className="text-sm text-foreground italic">"{currentTranscript}"</p>
          </div>
        )}

        {/* Quick Tips */}
        <div className="text-center max-w-xs">
          <p className="text-xs text-muted-foreground">
            Ask about any programming topic: HTML, CSS, JavaScript, Python, Data Structures, and more!
          </p>
        </div>
      </div>
    </Card>
  );
}