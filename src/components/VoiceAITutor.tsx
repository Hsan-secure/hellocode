import { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bot, Volume2, VolumeX, Sparkles, Loader2, Mic, MicOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Type definition for SpeechRecognition
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInterface {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInterface;
    webkitSpeechRecognition: new () => SpeechRecognitionInterface;
  }
}

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`;

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

export function VoiceAITutor() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setCurrentStatus('processing');
        handleSend(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setCurrentStatus('idle');
        toast({
          title: "Voice error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (currentStatus === 'listening') {
          setCurrentStatus('idle');
        }
      };
    }
  }, []);

  // Pulse animation for listening
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setPulseIntensity(prev => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(interval);
    } else {
      setPulseIntensity(0);
    }
  }, [isListening]);

  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

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

  const toggleListening = () => {
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
      setCurrentStatus('idle');
    } else {
      // Stop any ongoing speech
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      recognitionRef.current.start();
      setIsListening(true);
      setCurrentStatus('listening');
    }
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentStatus('idle');
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
      },
      onDone: () => {
        setIsLoading(false);
        setChatHistory(prev => [...prev, { role: 'assistant', content: assistantContent }]);
        if (voiceEnabled && assistantContent) {
          speakText(assistantContent);
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
        return "I'm listening...";
      case 'processing':
        return "Processing your question...";
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
    <Card variant="glow" className="flex flex-col h-[600px] items-center justify-center p-8">
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
      <div className="flex flex-col items-center gap-8">
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
          <p className="text-muted-foreground flex items-center gap-2 justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
            {getStatusText()}
          </p>
        </div>

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