import { useState, useEffect } from 'react';
import { Question } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Timer, Lightbulb, Check, X, Zap, MessageCircle } from 'lucide-react';

interface QuizGameProps {
  questions: Question[];
  levelId: number;
  onComplete: (score: number, correctAnswers: number, hintsUsed: number) => void;
  onAskTutor: (question: Question, userAnswer?: number) => void;
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

  const handleSubmit = (answer: number) => {
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
      
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

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
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="xp" className="text-lg px-4 py-2">
            <Zap className="h-4 w-4 mr-1" />
            {score} pts
          </Badge>
          {streak > 1 && (
            <Badge variant="success" className="animate-bounce-in">
              🔥 {streak}x Streak!
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Timer className={cn("h-5 w-5", timeLeft <= 10 && "text-destructive animate-pulse")} />
          <span className={cn(
            "font-display text-xl font-bold",
            timeLeft <= 10 ? "text-destructive" : "text-foreground"
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
        <Progress value={progress} variant="xp" className="h-2" />
      </div>

      {/* Question Card */}
      <Card variant="glow" className="p-8">
        <div className="space-y-6">
          {/* Question Type Badge */}
          <Badge variant="level" className="capitalize">
            {currentQuestion.type.replace('-', ' ')}
          </Badge>

          {/* Question Text */}
          <h2 className="font-display text-2xl font-bold text-foreground">
            {currentQuestion.question}
          </h2>

          {/* Code Block (if any) */}
          {currentQuestion.code && (
            <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-foreground whitespace-pre-wrap">{currentQuestion.code}</pre>
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
                  "p-4 rounded-lg border text-left transition-all duration-200",
                  "hover:border-primary/50 hover:bg-muted/50",
                  selectedAnswer === index && isCorrect && "border-success bg-success/10",
                  selectedAnswer === index && !isCorrect && "border-destructive bg-destructive/10",
                  isAnswered && index === currentQuestion.correctAnswer && "border-success bg-success/10",
                  !isAnswered && "border-border bg-card cursor-pointer",
                  isAnswered && "cursor-default"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold",
                    selectedAnswer === index && isCorrect && "bg-success text-success-foreground",
                    selectedAnswer === index && !isCorrect && "bg-destructive text-destructive-foreground",
                    isAnswered && index === currentQuestion.correctAnswer && selectedAnswer !== index && "bg-success text-success-foreground",
                    (!isAnswered || (isAnswered && selectedAnswer !== index && index !== currentQuestion.correctAnswer)) && "bg-muted text-muted-foreground"
                  )}>
                    {isAnswered && index === currentQuestion.correctAnswer ? (
                      <Check className="h-4 w-4" />
                    ) : isAnswered && selectedAnswer === index && !isCorrect ? (
                      <X className="h-4 w-4" />
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
                <Lightbulb className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
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
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                ) : (
                  <X className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={cn(
                    "font-semibold mb-1",
                    isCorrect ? "text-success" : "text-destructive"
                  )}>
                    {isCorrect ? "Correct!" : "Not quite right"}
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
            <Button variant="outline" onClick={handleHint}>
              <Lightbulb className="h-4 w-4 mr-2" />
              Show Hint (-30 pts)
            </Button>
          )}
          <Button 
            variant="ghost" 
            onClick={() => onAskTutor(currentQuestion, selectedAnswer ?? undefined)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Ask AI Tutor
          </Button>
        </div>
        
        {isAnswered && (
          <Button variant="hero" onClick={handleNext}>
            {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
          </Button>
        )}
      </div>
    </div>
  );
}
