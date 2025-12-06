import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Gamepad2, 
  Zap, 
  Trophy, 
  MessageCircle, 
  Brain, 
  Target,
  Code2,
  Sparkles,
  ChevronRight,
  Play
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: <Gamepad2 className="h-8 w-8" />,
      title: "Learn by Playing",
      description: "Master coding through interactive games - not boring lectures. Every level is a new challenge.",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "AI Tutor 24/7",
      description: "Get personalized help whenever you're stuck. Our AI tutor explains concepts your way.",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Adaptive Learning",
      description: "The system learns from your mistakes and adjusts difficulty to maximize your growth.",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Earn Certificates",
      description: "Complete language tracks and earn verifiable certificates to showcase your skills.",
    },
  ];

  const languages = [
    { name: 'HTML', levels: '0-3', color: 'from-orange-500 to-red-500', icon: '📄' },
    { name: 'CSS', levels: '4-7', color: 'from-blue-500 to-cyan-500', icon: '🎨' },
    { name: 'JavaScript', levels: '8-10', color: 'from-yellow-500 to-amber-500', icon: '⚡' },
    { name: 'Data Structures', levels: '11-15', color: 'from-green-500 to-emerald-500', icon: '🔢' },
    { name: 'DBMS', levels: '16-18', color: 'from-purple-500 to-violet-500', icon: '🗄️' },
    { name: 'Python', levels: '19-25', color: 'from-blue-600 to-indigo-600', icon: '🐍' },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <Badge variant="outline" className="px-4 py-2 text-sm animate-fade-in">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              Now with AI-Powered Tutoring
            </Badge>

            {/* Main Heading */}
            <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span className="text-foreground">Level Up Your</span>
              <br />
              <span className="text-gradient-primary text-shadow-neon">Coding Skills</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Learn HTML, CSS, JavaScript, Data Structures, DBMS, and Python through 
              <span className="text-primary font-semibold"> immersive gaming experiences</span>. 
              No boring tutorials—just pure, addictive learning.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/signup">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <Play className="h-5 w-5 mr-2" />
                  Start Your Quest
                </Button>
              </Link>
              <Link to="/levels">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Explore Levels
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-gradient-primary">26</div>
                <div className="text-sm text-muted-foreground">Levels</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-gradient-xp">6</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-success">3</div>
                <div className="text-sm text-muted-foreground">Game Modes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why CodeQuest?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Traditional learning is broken. We fixed it with games, AI, and a whole lot of fun.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                variant="gaming" 
                className="p-6 hover:neon-border transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Learning Path
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Progress through 26 levels across 6 technologies. Each language builds on the previous.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {languages.map((lang, index) => (
              <Card 
                key={lang.name}
                variant="gaming"
                className="p-6 group hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${lang.color} flex items-center justify-center text-2xl`}>
                    {lang.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {lang.name}
                    </h3>
                    <Badge variant="level" className="mt-1">
                      Levels {lang.levels}
                    </Badge>
                  </div>
                </div>
                <div className={`h-1 w-full rounded-full bg-gradient-to-r ${lang.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three Epic Game Modes
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Different challenges, same goal: make you an amazing coder.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="glow" className="p-8 text-center">
              <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                Runner Game
              </h3>
              <p className="text-muted-foreground">
                Dodge wrong answers, collect correct syntax. Speed increases as you level up!
              </p>
            </Card>

            <Card variant="glow" className="p-8 text-center">
              <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-secondary to-purple-500 flex items-center justify-center">
                <Target className="h-10 w-10 text-secondary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                Quiz Battle
              </h3>
              <p className="text-muted-foreground">
                Test your knowledge with timed MCQs and code challenges. Build streaks for bonus points!
              </p>
            </Card>

            <Card variant="glow" className="p-8 text-center">
              <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-success to-emerald-500 flex items-center justify-center">
                <Code2 className="h-10 w-10 text-success-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                Code Puzzle
              </h3>
              <p className="text-muted-foreground">
                Fill in the blanks, fix bugs, and arrange code. Learn by doing, not just reading.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card variant="glow" className="p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-5xl font-black text-foreground mb-4">
                Ready to Start Your
                <span className="text-gradient-primary"> Coding Journey</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are leveling up their skills through play.
              </p>
              <Link to="/signup">
                <Button variant="hero" size="xl">
                  <Gamepad2 className="h-5 w-5 mr-2" />
                  Begin Your Quest — It's Free
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold text-gradient-primary">CodeQuest</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 CodeQuest. Learn to code through play.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
