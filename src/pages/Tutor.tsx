import { Navbar } from '@/components/Navbar';
import { AITutor } from '@/components/AITutor';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, MessageCircle, Volume2 } from 'lucide-react';

const Tutor = () => {
  const tutorFeatures = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Context-Aware",
      description: "Understands your current level and learning progress",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Personalized",
      description: "Adapts explanations to your learning style",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Interactive",
      description: "Ask questions and get instant responses",
    },
    {
      icon: <Volume2 className="h-6 w-6" />,
      title: "Voice Support",
      description: "Listen to explanations with text-to-speech",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar xp={850} level={3} isLoggedIn={true} />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid lg:grid-cols-[1fr,450px] gap-8">
          {/* Left Column - Info */}
          <div className="space-y-8">
            <div>
              <Badge variant="level" className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by AI
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-4">
                Your Personal <span className="text-gradient-primary">AI Tutor</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Get instant help with any programming concept. Ask questions, request explanations, 
                and learn at your own pace.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {tutorFeatures.map((feature) => (
                <Card key={feature.title} variant="gaming" className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-primary">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Suggested Topics */}
            <Card variant="gaming" className="p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                Suggested Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'HTML basics',
                  'CSS flexbox',
                  'JavaScript arrays',
                  'DOM manipulation',
                  'Data structures',
                  'SQL queries',
                  'Python functions',
                  'OOP concepts',
                ].map((topic) => (
                  <Badge 
                    key={topic} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-muted transition-colors"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Tutor */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-120px)]">
            <AITutor />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tutor;
