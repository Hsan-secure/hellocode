import { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, FileImage, FileText, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateId = `CQ-${language.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  const generateCanvas = async () => {
    if (!certificateRef.current) return null;
    
    const html2canvasModule = await import('html2canvas');
    const html2canvas = html2canvasModule.default;
    
    return await html2canvas(certificateRef.current, {
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
  };

  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) return;
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `CodeQuest-${languageNames[language]}-Certificate.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          toast({
            title: "PNG Downloaded!",
            description: "Your certificate has been saved.",
          });
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) return;
      
      const { jsPDF } = await import('jspdf');
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [imgWidth / 3, imgHeight / 3],
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth / 3, imgHeight / 3);
      pdf.save(`CodeQuest-${languageNames[language]}-Certificate.pdf`);
      
      toast({
        title: "PDF Downloaded!",
        description: "Your certificate has been saved.",
      });
    } catch (error) {
      console.error('PDF Download error:', error);
      toast({
        title: "Download failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-auto">
      <div className="w-full max-w-4xl space-y-4 my-8">
        {/* Professional Certificate - MNC Style */}
        <div
          ref={certificateRef}
          className="relative bg-white aspect-[1.414/1] w-full overflow-hidden"
          style={{ 
            fontFamily: "'Times New Roman', Georgia, serif",
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          {/* Outer Border */}
          <div className="absolute inset-3 border-2 border-[#1a365d]" />
          <div className="absolute inset-5 border border-[#c9a227]" />
          
          {/* Corner Ornaments */}
          <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-[#1a365d]" />
          <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-[#1a365d]" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l-4 border-b-4 border-[#1a365d]" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-[#1a365d]" />

          {/* Watermark Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #1a365d 0, #1a365d 1px, transparent 0, transparent 50%)`,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-between py-10 px-12">
            {/* Header Section */}
            <div className="text-center space-y-2">
              <h1 
                className="text-4xl md:text-5xl font-bold tracking-wider text-[#1a365d]"
                style={{ fontFamily: "'Georgia', serif", letterSpacing: '0.15em' }}
              >
                CODEQUEST
              </h1>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-xs uppercase tracking-[0.3em] text-[#666] font-semibold">
                  Academy of Excellence
                </span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center -mt-4">
              <h2 
                className="text-2xl md:text-3xl uppercase tracking-[0.2em] text-[#1a365d] font-normal"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Certificate of Completion
              </h2>
              <div className="mt-2 h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-[#c9a227] to-transparent" />
            </div>

            {/* Main Content */}
            <div className="text-center space-y-4 max-w-2xl">
              <p className="text-sm text-[#555] italic">
                This is to certify that
              </p>
              
              {/* Recipient Name */}
              <div className="relative py-2">
                <h3 
                  className="text-3xl md:text-4xl font-bold text-[#1a365d]"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {userName}
                </h3>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-px bg-[#1a365d]" />
              </div>

              <p className="text-sm text-[#555] leading-relaxed">
                has successfully completed the comprehensive training program and demonstrated
                <br />outstanding proficiency in
              </p>

              {/* Course Name */}
              <div className="inline-block px-8 py-3 border-2 border-[#c9a227] bg-[#faf8f0]">
                <span 
                  className="text-2xl md:text-3xl font-bold text-[#1a365d] uppercase tracking-wider"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {languageNames[language]}
                </span>
              </div>

              <p className="text-xs text-[#666] max-w-lg mx-auto leading-relaxed">
                This certification is awarded in recognition of exceptional dedication, 
                skill mastery, and commitment to professional development.
              </p>
            </div>

            {/* Footer Section - Signatures */}
            <div className="w-full">
              <div className="flex items-end justify-between px-8">
                {/* Date */}
                <div className="text-center">
                  <p className="text-sm text-[#1a365d] font-medium mb-1">
                    {completionDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <div className="w-32 h-px bg-[#1a365d] mb-1" />
                  <p className="text-xs uppercase tracking-wider text-[#666]">
                    Date of Issue
                  </p>
                </div>

                {/* Seal */}
                <div className="flex flex-col items-center -mt-4">
                  <div 
                    className="w-20 h-20 rounded-full border-4 border-[#c9a227] flex items-center justify-center bg-white"
                    style={{ boxShadow: '0 4px 15px rgba(201, 162, 39, 0.3)' }}
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-[#1a365d] flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-[10px] font-bold text-[#1a365d] uppercase tracking-wider block">Verified</span>
                        <span className="text-[8px] text-[#666]">Official</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[8px] text-[#999] mt-1 font-mono">{certificateId}</p>
                </div>

                {/* Signature */}
                <div className="text-center">
                  <p 
                    className="text-3xl text-[#1a365d] mb-1"
                    style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
                  >
                    HSAN
                  </p>
                  <div className="w-32 h-px bg-[#1a365d] mb-1" />
                  <p className="text-xs uppercase tracking-wider text-[#666]">
                    CEO & Founder
                  </p>
                </div>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="hero" disabled={isDownloading}>
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloading ? 'Downloading...' : 'Download'}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadPNG}>
                  <FileImage className="h-4 w-4 mr-2" />
                  Download as PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  Download as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      </div>
    </div>
  );
}
