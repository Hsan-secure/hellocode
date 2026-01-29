import { Navbar } from '@/components/Navbar';
import { VoiceAITutor } from '@/components/VoiceAITutor';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Mic, Volume2, Gamepad2, Zap, Target, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Tutor = () => {
  const navigate = useNavigate();

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
      icon: <Mic className="h-6 w-6" />,
      title: "Voice Input",
      description: "Just speak your questions naturally",
    },
    {
      icon: <Volume2 className="h-6 w-6" />,
      title: "Voice Output",
      description: "Listen to explanations with text-to-speech",
    },
  ];

  const gamingOptions = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Quiz Battle",
      description: "Test your knowledge with timed MCQs and compete for high scores",
      color: "from-primary to-secondary",
      action: () => navigate('/levels'),
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Code Runner",
      description: "Dodge wrong answers and collect correct syntax in this interactive game",
      color: "from-xp to-xp/70",
      action: () => navigate('/levels'),
    },
    {
      icon: <Gamepad2 className="h-8 w-8" />,
      title: "Code Puzzle",
      description: "Solve fill-in-the-blanks, drag-and-drop, and bug-fix challenges",
      color: "from-success to-success/70",
      action: () => navigate('/levels'),
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Leaderboard",
      description: "See how you rank against other coders and climb to the top",
      color: "from-secondary to-primary",
      action: () => navigate('/leaderboard'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid lg:grid-cols-[1fr,450px] gap-8">
          {/* Left Column - Info & Gaming */}
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
                Get instant help with any programming concept using just your voice. 
                Ask questions naturally and learn at your own pace.
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

            {/* Gaming Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-6 w-6 text-primary" />
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Learn by Playing
                </h2>
              </div>
              <p className="text-muted-foreground">
                Make learning fun! Choose from different game modes to practice your coding skills.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {gamingOptions.map((game) => (
                  <Card 
                    key={game.title} 
                    variant="gaming" 
                    className="p-5 cursor-pointer hover:scale-[1.02] transition-all duration-300 group"
                    onClick={game.action}
                  >
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <div className="text-primary-foreground">{game.icon}</div>
                    </div>
                    <h3 className="font-display font-bold text-foreground mb-1">{game.title}</h3>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                    <Button variant="ghost" size="sm" className="mt-3 p-0 h-auto text-primary hover:text-primary/80">
                      Play Now →
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Voice Tutor */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-120px)]">
            <VoiceAITutor />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tutor;
