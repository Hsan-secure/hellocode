import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Timer, Lightbulb, Check, X, Zap, MessageCircle, Sparkles } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface QuizGameProps {
  questions: Question[];
  levelId: number;
  onComplete: (score: number, correctAnswers: number, hintsUsed: number) => void;
  onAskTutor: (question: Question, userAnswer?: number) => void;
}

// Confetti component
function Confetti({ count = 30 }: { count?: number }) {
  const colors = ['#00ffff', '#ff00ff', '#00ff88', '#ffaa00', '#ff4444'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="confetti-particle"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 0.5}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// Floating XP indicator
function FloatingXP({ points, show }: { points: number; show: boolean }) {
  if (!show) return null;
  
  return (
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-xp-fly">
      <Badge variant="xp" className="text-lg font-bold">
        +{points}
      </Badge>
    </div>
  );
}

export function QuizGame({ questions, levelId, onComplete, onAskTutor }: QuizGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);
  const [showFloatingXP, setShowFloatingXP] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);
  const [scorePop, setScorePop] = useState(false);

  const { playCorrect, playWrong, playStreak } = useSoundEffects();
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Timer
  useEffect(() => {
    if (isAnswered || !currentQuestion) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit(-1); // Time's up
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered]);

  const handleSubmit = useCallback((answer: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const basePoints = 100;
      const timeBonus = Math.floor(timeLeft * 2);
      const streakBonus = streak * 10;
      const hintPenalty = showHint ? 30 : 0;
      const points = Math.max(basePoints + timeBonus + streakBonus - hintPenalty, 10);
      
      setLastPoints(points);
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
      setShowConfetti(true);
      setShowFloatingXP(true);
      setScorePop(true);
      
      // Play sound effects
      playCorrect();
      if (streak >= 2) {
        setTimeout(() => playStreak(), 300);
      }
      
      // Clear effects
      setTimeout(() => {
        setShowConfetti(false);
        setShowFloatingXP(false);
        setScorePop(false);
      }, 1500);
    } else {
      setStreak(0);
      setShakeCard(true);
      playWrong();
      setTimeout(() => setShakeCard(false), 500);
    }
  }, [isAnswered, currentQuestion, timeLeft, streak, showHint]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowHint(false);
      setTimeLeft(30);
    } else {
      onComplete(score, correctCount, hintsUsed);
    }
  };

  const handleHint = () => {
    if (!showHint) {
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
    }
  };

  if (!currentQuestion) return null;

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Confetti Effect */}
      {showConfetti && <Confetti />}
      
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 relative">
          <Badge 
            variant="xp" 
            className={cn(
              "text-lg px-4 py-2 transition-all duration-300",
              scorePop && "animate-score-pop"
            )}
          >
            <Zap className="h-4 w-4 mr-1" />
            {score} pts
          </Badge>
          <FloatingXP points={lastPoints} show={showFloatingXP} />
          {streak > 1 && (
            <Badge variant="success" className="animate-bounce-in">
              <span className={cn(streak >= 3 && "animate-streak-fire inline-block")}>🔥</span>
              {' '}{streak}x Streak!
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Timer className={cn(
            "h-5 w-5 transition-all",
            timeLeft <= 10 && "text-destructive animate-pulse"
          )} />
          <span className={cn(
            "font-display text-xl font-bold transition-all",
            timeLeft <= 10 ? "animate-timer-warning" : "text-foreground",
            timeLeft <= 5 && "text-glow-success"
          )}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="relative">
          <Progress value={progress} variant="xp" className="h-2" />
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card 
        variant="glow" 
        className={cn(
          "p-8 transition-all duration-300",
          shakeCard && "animate-shake",
          isAnswered && isCorrect && "animate-correct-pulse border-success",
          isAnswered && !isCorrect && "animate-wrong-flash border-destructive"
        )}
      >
        <div className="space-y-6">
          {/* Question Type Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="level" className="capitalize">
              {currentQuestion.type.replace('-', ' ')}
            </Badge>
            {streak >= 3 && (
              <Badge variant="success" className="bg-gradient-to-r from-success to-primary">
                <Sparkles className="h-3 w-3 mr-1" />
                On Fire!
              </Badge>
            )}
          </div>

          {/* Question Text */}
          <h2 className="font-display text-2xl font-bold text-foreground">
            {currentQuestion.question}
          </h2>

          {/* Code Block (if any) */}
          {currentQuestion.code && (
            <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              <pre className="text-foreground whitespace-pre-wrap relative z-10">{currentQuestion.code}</pre>
            </div>
          )}

          {/* Options */}
          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !isAnswered && handleSubmit(index)}
                disabled={isAnswered}
                className={cn(
                  "p-4 rounded-lg border text-left transition-all duration-300 relative overflow-hidden group",
                  "hover:border-primary/50 hover:bg-muted/50 hover:scale-[1.01] hover:shadow-lg",
                  selectedAnswer === index && isCorrect && "border-success bg-success/10 scale-[1.02] shadow-[0_0_20px_hsl(145_80%_50%/0.3)]",
                  selectedAnswer === index && !isCorrect && "border-destructive bg-destructive/10",
                  isAnswered && index === currentQuestion.correctAnswer && selectedAnswer !== index && "border-success bg-success/10",
                  !isAnswered && "border-border bg-card cursor-pointer",
                  isAnswered && "cursor-default"
                )}
              >
                {/* Hover effect overlay */}
                {!isAnswered && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                )}
                
                <div className="flex items-center gap-3 relative z-10">
                  <span className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold transition-all duration-300",
                    selectedAnswer === index && isCorrect && "bg-success text-success-foreground scale-110",
                    selectedAnswer === index && !isCorrect && "bg-destructive text-destructive-foreground",
                    isAnswered && index === currentQuestion.correctAnswer && selectedAnswer !== index && "bg-success text-success-foreground",
                    (!isAnswered || (isAnswered && selectedAnswer !== index && index !== currentQuestion.correctAnswer)) && "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                  )}>
                    {isAnswered && index === currentQuestion.correctAnswer ? (
                      <Check className="h-4 w-4 animate-bounce-in" />
                    ) : isAnswered && selectedAnswer === index && !isCorrect ? (
                      <X className="h-4 w-4 animate-shake" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>
                  <span className="text-foreground">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Hint Section */}
          {showHint && (
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 animate-fade-in">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-warning flex-shrink-0 mt-0.5 animate-pulse" />
                <p className="text-sm text-foreground">{currentQuestion.hint}</p>
              </div>
            </div>
          )}

          {/* Explanation (after answer) */}
          {isAnswered && (
            <div className={cn(
              "p-4 rounded-lg border animate-fade-in",
              isCorrect 
                ? "bg-success/10 border-success/30" 
                : "bg-destructive/10 border-destructive/30"
            )}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <div className="relative">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div className="absolute inset-0 animate-ping">
                      <Check className="h-5 w-5 text-success opacity-50" />
                    </div>
                  </div>
                ) : (
                  <X className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={cn(
                    "font-semibold mb-1",
                    isCorrect ? "text-success text-glow-success" : "text-destructive"
                  )}>
                    {isCorrect ? (
                      streak >= 3 ? "🔥 Incredible!" : streak >= 2 ? "Amazing!" : "Correct!"
                    ) : "Not quite right"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {!isAnswered && !showHint && (
            <Button 
              variant="outline" 
              onClick={handleHint}
              className="hover:scale-105 transition-transform"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Show Hint (-30 pts)
            </Button>
          )}
          <Button 
            variant="ghost" 
            onClick={() => onAskTutor(currentQuestion, selectedAnswer ?? undefined)}
            className="hover:scale-105 transition-transform"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Ask AI Tutor
          </Button>
        </div>
        
        {isAnswered && (
          <Button 
            variant="hero" 
            onClick={handleNext}
            className="animate-bounce-in hover:scale-105 transition-transform"
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
          </Button>
        )}
      </div>
    </div>
  );
}
