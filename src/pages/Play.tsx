import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { QuizGame } from '@/components/QuizGame';
import { GameResults } from '@/components/GameResults';
import { AITutor } from '@/components/AITutor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { levels, sampleQuestions } from '@/data/levels';
import { Question, LANGUAGE_LEVELS } from '@/types/game';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSaveGameSession, useAwardBadge } from '@/hooks/useUserProgress';
import { toast } from '@/hooks/use-toast';

type GameState = 'intro' | 'playing' | 'results';

const Play = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const saveGameSession = useSaveGameSession();
  const awardBadge = useAwardBadge();
  
  const [gameState, setGameState] = useState<GameState>('intro');
  const [showTutor, setShowTutor] = useState(false);
  const [tutorContext, setTutorContext] = useState<string | undefined>();
  const [results, setResults] = useState<{
    score: number;
    correctAnswers: number;
    hintsUsed: number;
  } | null>(null);

  const level = levels.find(l => l.id === parseInt(levelId || '0'));
  const questions: Question[] = sampleQuestions[level?.id || 0] || sampleQuestions[0];
  const languageInfo = level ? LANGUAGE_LEVELS[level.language] : null;

  useEffect(() => {
    // Reset game state when level changes
    setGameState('intro');
    setResults(null);
    setShowTutor(false);
  }, [levelId]);

  if (!level || !languageInfo) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Level Not Found</h1>
          <Button variant="hero" onClick={() => navigate('/levels')}>
            Back to Levels
          </Button>
        </div>
      </div>
    );
  }

  const handleGameComplete = async (score: number, correctAnswers: number, hintsUsed: number) => {
    setResults({ score, correctAnswers, hintsUsed });
    setGameState('results');
    
    const xpEarned = Math.round(level.xpReward * (correctAnswers / questions.length));
    const passedLevel = correctAnswers >= Math.ceil(questions.length * 0.6);
    
    // Save game session if user is logged in
    if (user) {
      try {
        await saveGameSession.mutateAsync({
          level_id: level.id,
          score,
          correct_answers: correctAnswers,
          total_questions: questions.length,
          hints_used: hintsUsed,
          xp_earned: xpEarned,
        });

        // Award badges based on achievements
        if (level.id === 0 && passedLevel) {
          await awardBadge.mutateAsync('first-blood');
        }
        
        if (score === 100) {
          await awardBadge.mutateAsync('perfect-score');
        }
        
        if (hintsUsed === 0 && passedLevel) {
          await awardBadge.mutateAsync('no-hints');
        }

        toast({
          title: passedLevel ? "Level Complete!" : "Good Try!",
          description: `You earned ${xpEarned} XP`,
        });
      } catch (error) {
        console.error('Error saving game session:', error);
      }
    }
  };

  const handleAskTutor = (question: Question, userAnswer?: number) => {
    const context = userAnswer !== undefined
      ? `Help me understand this question: "${question.question}". I answered "${question.options[userAnswer]}" but the correct answer was "${question.options[question.correctAnswer]}". Why was my answer wrong?`
      : `Can you explain this concept to me? "${question.question}"`;
    
    setTutorContext(context);
    setShowTutor(true);
  };

  const handleReplay = () => {
    setGameState('intro');
    setResults(null);
  };

  const handleNextLevel = () => {
    const nextLevel = levels.find(l => l.id === level.id + 1);
    if (nextLevel) {
      navigate(`/play/${nextLevel.id}`);
    } else {
      navigate('/levels');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/levels')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Levels
        </Button>

        {/* Level Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${languageInfo.color} flex items-center justify-center`}>
              <span className="font-display text-2xl font-bold text-white">{level.id}</span>
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">{level.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="level">{languageInfo.name}</Badge>
                <Badge variant="xp">+{level.xpReward} XP</Badge>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline"
            onClick={() => setShowTutor(!showTutor)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {showTutor ? 'Hide' : 'Show'} AI Tutor
          </Button>
        </div>

        {/* Game Content */}
        <div className={showTutor ? 'grid lg:grid-cols-[1fr,400px] gap-8' : ''}>
          <div>
            {gameState === 'intro' && (
              <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
                <div className={`h-32 w-32 mx-auto rounded-3xl bg-gradient-to-br ${languageInfo.color} flex items-center justify-center animate-float`}>
                  <span className="font-display text-5xl font-black text-white">{level.id}</span>
                </div>
                
                <div className="space-y-4">
                  <h2 className="font-display text-4xl font-bold text-foreground">
                    {level.title}
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    {level.description}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <Badge variant="level" className="text-lg px-4 py-2">
                    {questions.length} Questions
                  </Badge>
                  <Badge variant="xp" className="text-lg px-4 py-2">
                    +{level.xpReward} XP
                  </Badge>
                  <Badge variant="outline" className="text-lg px-4 py-2 capitalize">
                    {level.difficulty}
                  </Badge>
                </div>

                <Button 
                  variant="hero" 
                  size="xl"
                  onClick={() => setGameState('playing')}
                  className="animate-pulse-glow"
                >
                  Start Quiz Battle
                </Button>
              </div>
            )}

            {gameState === 'playing' && (
              <QuizGame
                questions={questions}
                levelId={level.id}
                onComplete={handleGameComplete}
                onAskTutor={handleAskTutor}
              />
            )}

            {gameState === 'results' && results && (
              <GameResults
                score={results.score}
                correctAnswers={results.correctAnswers}
                totalQuestions={questions.length}
                hintsUsed={results.hintsUsed}
                xpEarned={Math.round(level.xpReward * (results.correctAnswers / questions.length))}
                levelCompleted={results.correctAnswers >= Math.ceil(questions.length * 0.6)}
                onReplay={handleReplay}
                onNextLevel={handleNextLevel}
                onGoHome={() => navigate('/levels')}
              />
            )}
          </div>

          {/* AI Tutor Panel */}
          {showTutor && (
            <div className="hidden lg:block">
              <AITutor initialContext={tutorContext} />
            </div>
          )}
        </div>
      </main>

      {/* Floating Tutor for mobile */}
      {showTutor && (
        <div className="lg:hidden">
          <AITutor 
            isFloating 
            initialContext={tutorContext}
            onClose={() => setShowTutor(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default Play;
