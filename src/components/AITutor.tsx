import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TutorMessage } from '@/types/game';
import { cn } from '@/lib/utils';
import { Bot, Send, Volume2, VolumeX, Sparkles, Loader2 } from 'lucide-react';

interface AITutorProps {
  initialContext?: string;
  isFloating?: boolean;
  onClose?: () => void;
}

export function AITutor({ initialContext, isFloating = false, onClose }: AITutorProps) {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: '1',
      role: 'tutor',
      content: "Hey there, coder! 👋 I'm your AI tutor. I'm here to help you understand programming concepts, explain your mistakes, and guide you through challenges. What would you like to learn about?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (initialContext) {
      handleSend(initialContext);
    }
  }, [initialContext]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: TutorMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (replace with actual AI call when connected to Lovable Cloud)
    setTimeout(() => {
      const responses = [
        "Great question! Let me explain this concept step by step...\n\nIn programming, we break down complex problems into smaller, manageable pieces. This is called 'decomposition' and it's a fundamental skill every developer needs.",
        "I can see you're working hard on this! 💪\n\nThe key here is to understand the underlying logic. Think of variables like labeled boxes - you can put values inside them and use the label to find them later.",
        "That's a really insightful observation!\n\nWhen you encounter an error like this, always read the error message carefully. It usually tells you exactly what went wrong and where to look.",
        "Let me help you with that!\n\nRemember: practice makes perfect. The more code you write, the more patterns you'll recognize. Don't be afraid to experiment and make mistakes - that's how we learn!",
      ];
      
      const tutorMessage: TutorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'tutor',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, tutorMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card 
      variant="glow" 
      className={cn(
        "flex flex-col",
        isFloating 
          ? "fixed bottom-4 right-4 w-96 h-[500px] z-50 shadow-2xl animate-scale-in" 
          : "h-[600px]"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">AI Tutor</h3>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
          >
            {voiceEnabled ? (
              <Volume2 className="h-4 w-4 text-primary" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          {isFloating && onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 animate-fade-in",
              message.role === 'user' ? "flex-row-reverse" : ""
            )}
          >
            {message.role === 'tutor' && (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <div
              className={cn(
                "rounded-2xl px-4 py-3 max-w-[80%]",
                message.role === 'user'
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-muted text-foreground rounded-tl-none"
              )}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              <span className="text-xs opacity-60 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Explain the concept', 'Show an example', 'Why is this wrong?', 'Give me a hint'].map((action) => (
            <Badge 
              key={action}
              variant="outline" 
              className="cursor-pointer hover:bg-muted whitespace-nowrap flex-shrink-0"
              onClick={() => handleSend(action)}
            >
              {action}
            </Badge>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            variant="hero" 
            size="icon" 
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
