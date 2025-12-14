import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CertificateProps {
  userName: string;
  language: string;
  completionDate: Date;
  onClose?: () => void;
}

const languageNames: Record<string, string> = {
  html: 'HTML',
  css: 'CSS',
  javascript: 'JavaScript',
  python: 'Python',
  ds: 'Data Structures',
  dbms: 'Database Management',
};

export function Certificate({ userName, language, completionDate, onClose }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      // Create a canvas from the certificate
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#0a0e1a',
      });
      
      const link = document.createElement('a');
      link.download = `CodeQuest-${languageNames[language]}-Certificate.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "Certificate Downloaded!",
        description: "Your certificate has been saved.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again or take a screenshot.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'CodeQuest Certificate',
      text: `I just completed ${languageNames[language]} on CodeQuest! 🎉`,
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `I just completed ${languageNames[language]} on CodeQuest! Check it out: ${window.location.origin}`
        );
        toast({
          title: "Link Copied!",
          description: "Share link copied to clipboard.",
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl space-y-4">
        {/* Certificate */}
        <div
          ref={certificateRef}
          className="relative bg-gradient-to-br from-[#0a0e1a] via-[#0f1629] to-[#1a0f29] rounded-xl p-8 border-4 border-primary/30 overflow-hidden"
        >
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          
          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-primary/50 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-primary/50 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-primary/50 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-primary/50 rounded-br-xl" />

          <div className="relative z-10 text-center space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Award className="h-8 w-8 text-xp" />
                <span className="font-display text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  Certificate of Achievement
                </span>
                <Award className="h-8 w-8 text-xp" />
              </div>
            </div>

            {/* Logo */}
            <div className="py-4">
              <h1 
                className="text-5xl font-black tracking-wider"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  background: 'linear-gradient(135deg, hsl(185 100% 50%), hsl(200 100% 60%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 40px hsl(185 100% 50% / 0.3)',
                }}
              >
                CODEQUEST
              </h1>
            </div>

            {/* Recipient */}
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm uppercase tracking-wider">
                This is to certify that
              </p>
              <h2 
                className="text-4xl font-bold text-foreground py-2"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                }}
              >
                {userName}
              </h2>
            </div>

            {/* Achievement */}
            <div className="space-y-3">
              <p className="text-muted-foreground">
                has successfully completed all levels and demonstrated proficiency in
              </p>
              <div className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
                <span 
                  className="text-3xl font-bold"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    background: 'linear-gradient(135deg, hsl(45 100% 55%), hsl(35 100% 50%))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {languageNames[language]}
                </span>
              </div>
            </div>

            {/* Date & Signature */}
            <div className="pt-8 flex items-end justify-between px-8">
              <div className="text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Date of Completion
                </p>
                <p className="text-sm text-foreground font-medium">
                  {completionDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="text-center">
                <div 
                  className="text-3xl mb-1"
                  style={{
                    fontFamily: "'Dancing Script', cursive, 'Orbitron', sans-serif",
                    background: 'linear-gradient(135deg, hsl(270 60% 50%), hsl(300 70% 50%))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  HSAN
                </div>
                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-1" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  CEO & Founder
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Certificate ID
                </p>
                <p className="text-sm text-foreground font-mono">
                  CQ-{language.toUpperCase()}-{Date.now().toString(36).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Seal */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-2 border-xp/50 flex items-center justify-center bg-background/50">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-xp to-warning flex items-center justify-center">
                <span className="text-xs font-bold text-xp-foreground font-display">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <Card variant="gaming" className="p-4 flex items-center justify-between">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="hero" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
