import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { CodePuzzleGame } from '@/components/CodePuzzleGame';
import { CodeRunnerGame } from '@/components/CodeRunnerGame';
import { GameResults } from '@/components/GameResults';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Gamepad2, Puzzle, Zap, Target, Trophy, Code2, 
  ArrowLeft, Sparkles, Play
} from 'lucide-react';
import { LANGUAGE_LEVELS, Language } from '@/types/game';
import { useAuth } from '@/hooks/useAuth';
import { useSaveGameSession, useAwardBadge } from '@/hooks/useUserProgress';
import { toast } from '@/hooks/use-toast';

type GameMode = 'select' | 'puzzle' | 'runner' | 'results';

interface GameResult {
  score: number;
  correct: number;
  total: number;
  mode: 'puzzle' | 'runner';
}

const languages = [
  { id: 'html' as Language, name: 'HTML', icon: '🌐', color: 'from-orange-500 to-red-500', levels: 4 },
  { id: 'css' as Language, name: 'CSS', icon: '🎨', color: 'from-blue-500 to-cyan-500', levels: 4 },
  { id: 'javascript' as Language, name: 'JavaScript', icon: '⚡', color: 'from-yellow-500 to-amber-500', levels: 3 },
  { id: 'ds' as Language, name: 'Data Structures', icon: '📊', color: 'from-green-500 to-emerald-500', levels: 5 },
  { id: 'dbms' as Language, name: 'DBMS', icon: '🗄️', color: 'from-purple-500 to-violet-500', levels: 3 },
  { id: 'python' as Language, name: 'Python', icon: '🐍', color: 'from-blue-600 to-indigo-600', levels: 7 },
];

const gameModes = [
  {
    id: 'puzzle',
    name: 'Code Puzzle',
    description: 'Drag-and-drop and fill-in-the-blanks challenges',
    icon: Puzzle,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'runner',
    name: 'Code Runner',
    description: 'Dodge wrong answers, collect correct syntax!',
    icon: Zap,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'quiz',
    name: 'Quiz Battle',
    description: 'Test your knowledge with timed quizzes',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
  },
];

const Playtime = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const saveGameSession = useSaveGameSession();
  const awardBadge = useAwardBadge();

  const [gameMode, setGameMode] = useState<GameMode>('select');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('html');
  const [selectedGame, setSelectedGame] = useState<'puzzle' | 'runner' | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleGameSelect = (mode: 'puzzle' | 'runner' | 'quiz') => {
    if (mode === 'quiz') {
      const langInfo = LANGUAGE_LEVELS[selectedLanguage];
      navigate(`/play/${langInfo.start}`);
      return;
    }
    setSelectedGame(mode);
    setGameMode(mode);
  };

  const handleGameComplete = async (score: number, correct: number, total: number) => {
    const result: GameResult = { score, correct, total, mode: selectedGame! };
    setGameResult(result);
    setGameMode('results');

    const xpEarned = Math.round(score * 0.5);
    const passed = correct >= Math.ceil(total * 0.6);

    if (user && passed) {
      try {
        await saveGameSession.mutateAsync({
          level_id: selectedGame === 'puzzle' ? 100 : 101,
          score,
          correct_answers: correct,
          total_questions: total,
          hints_used: 0,
          xp_earned: xpEarned,
        });

        if (score >= 200) {
          await awardBadge.mutateAsync('perfect-score');
        }

        toast({
          title: passed ? "Great Job!" : "Good Try!",
          description: `You earned ${xpEarned} XP`,
        });
      } catch (error) {
        console.error('Error saving game session:', error);
      }
    }
  };

  const handleReplay = () => {
    setGameResult(null);
    if (selectedGame) {
      setGameMode(selectedGame);
    }
  };

  const handleBackToSelect = () => {
    setGameMode('select');
    setSelectedGame(null);
    setGameResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {gameMode === 'select' && (
          <>
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
              <Badge variant="xp" className="mb-4">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Learn by Playing
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                <span className="text-gradient-primary">Playtime</span> Arena
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Master coding through interactive games! Choose your language and game mode to start learning.
              </p>
            </div>

            {/* Language Selection */}
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Code2 className="h-6 w-6 text-primary" />
                Select Language
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {languages.map((lang) => (
                  <Card
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                      selectedLanguage === lang.id 
                        ? 'ring-2 ring-primary shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="text-center space-y-2">
                      <div className={`h-12 w-12 mx-auto rounded-xl bg-gradient-to-br ${lang.color} flex items-center justify-center text-2xl`}>
                        {lang.icon}
                      </div>
                      <h3 className="font-semibold text-sm">{lang.name}</h3>
                      <p className="text-xs text-muted-foreground">{lang.levels} levels</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Game Modes */}
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Choose Game Mode
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {gameModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <Card
                      key={mode.id}
                      onClick={() => handleGameSelect(mode.id as 'puzzle' | 'runner' | 'quiz')}
                      className="p-6 cursor-pointer group transition-all hover:scale-105 hover:shadow-xl"
                    >
                      <div className="space-y-4">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {mode.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {mode.description}
                          </p>
                        </div>
                        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Play className="h-4 w-4 mr-2" />
                          Play Now
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" onClick={() => navigate('/levels')}>
                  <Target className="h-4 w-4 mr-2" />
                  All Levels
                </Button>
                <Button variant="outline" onClick={() => navigate('/leaderboard')}>
                  <Trophy className="h-4 w-4 mr-2" />
                  Leaderboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/learn')}>
                  <Code2 className="h-4 w-4 mr-2" />
                  Learn First
                </Button>
              </div>
            </section>
          </>
        )}

        {gameMode === 'puzzle' && (
          <div>
            <Button 
              variant="ghost" 
              className="mb-6"
              onClick={handleBackToSelect}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
            <CodePuzzleGame
              language={selectedLanguage}
              onComplete={handleGameComplete}
              onExit={handleBackToSelect}
            />
          </div>
        )}

        {gameMode === 'runner' && (
          <div>
            <Button 
              variant="ghost" 
              className="mb-6"
              onClick={handleBackToSelect}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
            <CodeRunnerGame
              language={selectedLanguage}
              onComplete={handleGameComplete}
              onExit={handleBackToSelect}
            />
          </div>
        )}

        {gameMode === 'results' && gameResult && (
          <div>
            <Button 
              variant="ghost" 
              className="mb-6"
              onClick={handleBackToSelect}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
            <GameResults
              score={gameResult.score}
              correctAnswers={gameResult.correct}
              totalQuestions={gameResult.total}
              hintsUsed={0}
              xpEarned={Math.round(gameResult.score * 0.5)}
              levelCompleted={gameResult.correct >= Math.ceil(gameResult.total * 0.6)}
              onReplay={handleReplay}
              onNextLevel={handleBackToSelect}
              onGoHome={() => navigate('/levels')}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Playtime;
