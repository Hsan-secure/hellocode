import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap, RotateCcw, ArrowRight, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameResultsProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  hintsUsed: number;
  xpEarned: number;
  levelCompleted: boolean;
  onReplay: () => void;
  onNextLevel: () => void;
  onGoHome: () => void;
}

export function GameResults({
  score,
  correctAnswers,
  totalQuestions,
  hintsUsed,
  xpEarned,
  levelCompleted,
  onReplay,
  onNextLevel,
  onGoHome,
}: GameResultsProps) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  const getGrade = () => {
    if (percentage >= 90) return { grade: 'S', color: 'text-gradient-xp', message: 'LEGENDARY!' };
    if (percentage >= 80) return { grade: 'A', color: 'text-success', message: 'Excellent!' };
    if (percentage >= 70) return { grade: 'B', color: 'text-primary', message: 'Great job!' };
    if (percentage >= 60) return { grade: 'C', color: 'text-warning', message: 'Not bad!' };
    return { grade: 'D', color: 'text-destructive', message: 'Keep practicing!' };
  };

  const gradeInfo = getGrade();

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Main Results Card */}
      <Card variant="glow" className="p-8 text-center relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-glow opacity-50 pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          {/* Trophy Icon */}
          <div className="flex justify-center">
            <div className={cn(
              "h-24 w-24 rounded-full flex items-center justify-center animate-bounce-in",
              levelCompleted ? "bg-success/20 border-2 border-success" : "bg-warning/20 border-2 border-warning"
            )}>
              <Trophy className={cn(
                "h-12 w-12",
                levelCompleted ? "text-success" : "text-warning"
              )} />
            </div>
          </div>

          {/* Grade */}
          <div className="space-y-2">
            <div className={cn(
              "font-display text-8xl font-black",
              gradeInfo.color
            )}>
              {gradeInfo.grade}
            </div>
            <p className="text-xl text-muted-foreground">{gradeInfo.message}</p>
          </div>

          {/* Score */}
          <div className="flex justify-center gap-4">
            <Badge variant="xp" className="text-xl px-6 py-3">
              <Zap className="h-5 w-5 mr-2" />
              {score.toLocaleString()} pts
            </Badge>
            <Badge variant="success" className="text-xl px-6 py-3">
              +{xpEarned} XP
            </Badge>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="gaming" className="p-4 text-center">
          <div className="text-3xl font-display font-bold text-foreground">
            {correctAnswers}/{totalQuestions}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Correct</div>
          <Progress value={percentage} variant="success" className="mt-2 h-1.5" />
        </Card>
        
        <Card variant="gaming" className="p-4 text-center">
          <div className="text-3xl font-display font-bold text-foreground">
            {percentage}%
          </div>
          <div className="text-sm text-muted-foreground mt-1">Accuracy</div>
          <div className="flex justify-center mt-2 gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.ceil(percentage / 20) 
                    ? "text-xp fill-xp" 
                    : "text-muted"
                )}
              />
            ))}
          </div>
        </Card>
        
        <Card variant="gaming" className="p-4 text-center">
          <div className="text-3xl font-display font-bold text-foreground">
            {hintsUsed}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Hints Used</div>
          {hintsUsed === 0 && (
            <Badge variant="success" className="mt-2 text-xs">
              Self Reliant!
            </Badge>
          )}
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="gaming" onClick={onReplay}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Replay Level
        </Button>
        
        {levelCompleted && (
          <Button variant="hero" onClick={onNextLevel}>
            Next Level
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
        
        <Button variant="ghost" onClick={onGoHome}>
          Back to Levels
        </Button>
      </div>

      {/* Share */}
      <div className="text-center">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Share2 className="h-4 w-4 mr-2" />
          Share Results
        </Button>
      </div>
    </div>
  );
}
