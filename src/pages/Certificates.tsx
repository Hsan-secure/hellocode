import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Certificate } from '@/components/Certificate';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, useUserLevelProgress } from '@/hooks/useUserProgress';
import { levels } from '@/data/levels';
import { LANGUAGE_LEVELS } from '@/types/game';
import { Award, Lock, CheckCircle2, Sparkles, Gamepad2, Zap, Target, Trophy, Code2 } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import type { Language } from '@/types/game';

const Certificates = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: profile } = useUserProfile();
  const { data: levelProgress } = useUserLevelProgress();
  const [selectedCertificate, setSelectedCertificate] = useState<Language | null>(null);
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Sparkles className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const completedLevelIds = new Set(
    levelProgress?.filter(p => p.is_completed).map(p => p.level_id) || []
  );

  const languageCertificates = Object.entries(LANGUAGE_LEVELS).map(([key, lang]) => {
    const languageLevels = levels.filter(l => l.id >= lang.start && l.id <= lang.end);
    const completedCount = languageLevels.filter(l => completedLevelIds.has(l.id)).length;
    const totalCount = languageLevels.length;
    const isCompleted = completedCount === totalCount;
    const progress = Math.round((completedCount / totalCount) * 100);

    return {
      language: key as Language,
      name: lang.name,
      color: lang.color,
      completedCount,
      totalCount,
      isCompleted,
      progress,
    };
  });

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

  const languageGameCards = Object.entries(LANGUAGE_LEVELS).map(([key, lang]) => ({
    language: key as Language,
    name: lang.name,
    color: lang.color,
    levelsCount: levels.filter(l => l.id >= lang.start && l.id <= lang.end).length,
    startLevel: lang.start,
  }));

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="level" className="mb-4">
            <Award className="h-3 w-3 mr-1" />
            Achievements
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-4">
            Your <span className="text-gradient-primary">Certificates</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete all levels of a language to earn your certificate. Signed by HSAN, CEO of CodeQuest.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languageCertificates.map((cert) => (
            <Card 
              key={cert.language}
              variant="gaming" 
              className={`p-6 relative overflow-hidden transition-all duration-300 ${
                cert.isCompleted ? 'hover:scale-[1.02] cursor-pointer' : 'opacity-80'
              }`}
              onClick={() => cert.isCompleted && setSelectedCertificate(cert.language)}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-10`} />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${cert.color}`}>
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  {cert.isCompleted ? (
                    <Badge variant="level" className="bg-success/20 text-success border-success/30">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Earned
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      <Lock className="h-3 w-3 mr-1" />
                      Locked
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {cert.name} Certificate
                </h3>

                {/* Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-medium">
                      {cert.completedCount}/{cert.totalCount} levels
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${cert.color} transition-all duration-500`}
                      style={{ width: `${cert.progress}%` }}
                    />
                  </div>
                </div>

                {/* Action */}
                {cert.isCompleted ? (
                  <Button 
                    variant="hero" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCertificate(cert.language);
                    }}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    View Certificate
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    <Lock className="h-4 w-4 mr-2" />
                    Complete {cert.totalCount - cert.completedCount} more levels
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card variant="gaming" className="mt-8 p-6 text-center">
          <div className="max-w-xl mx-auto">
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              How to Earn Certificates
            </h3>
            <p className="text-muted-foreground">
              Complete all levels within a programming language or topic to unlock your official CodeQuest certificate. 
              Each certificate is personally signed by HSAN, CEO of CodeQuest, and can be downloaded or shared.
            </p>
          </div>
        </Card>

        {/* Gaming Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <Badge variant="level" className="mb-4">
              <Gamepad2 className="h-3 w-3 mr-1" />
              Learn by Playing
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-black text-foreground mb-4">
              Master Coding Through <span className="text-gradient-primary">Games</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Make learning fun! Choose from different game modes and programming languages to practice your coding skills.
            </p>
          </div>

          {/* Game Modes */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Language Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <h3 className="font-display text-xl font-bold text-foreground">
                Choose Your Language
              </h3>
            </div>
            <p className="text-center text-muted-foreground">
              Select a programming language to start learning with interactive games
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {languageGameCards.map((lang) => (
                <Card 
                  key={lang.language}
                  variant="gaming" 
                  className="p-5 cursor-pointer hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden"
                  onClick={() => navigate(`/play?level=${lang.startLevel}`)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${lang.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  <div className="relative z-10 flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${lang.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Code2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display font-bold text-foreground">{lang.name}</h4>
                      <p className="text-sm text-muted-foreground">{lang.levelsCount} levels available</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Start →
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <Certificate
          userName={profile?.username || 'Coder'}
          language={selectedCertificate}
          completionDate={new Date()}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
};

export default Certificates;
