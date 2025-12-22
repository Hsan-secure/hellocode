import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap, RotateCcw, ArrowRight, Share2, Sparkles, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';

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

// Animated counter hook with sound
function useAnimatedCounter(end: number, duration: number = 1000, playSound?: () => void) {
  const [count, setCount] = useState(0);
  const lastSoundRef = useRef(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newCount = Math.floor(easeOut * end);
      setCount(newCount);
      
      // Play count-up sound at intervals
      if (playSound && newCount - lastSoundRef.current >= Math.max(end / 10, 1)) {
        playSound();
        lastSoundRef.current = newCount;
      }
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, playSound]);
  
  return count;
}

// Confetti burst effect
function ConfettiBurst() {
  const colors = ['#00ffff', '#ff00ff', '#00ff88', '#ffaa00', '#ff4444', '#00ff00'];
  const particles = 50;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: particles }).map((_, i) => {
        const angle = (i / particles) * 360;
        const velocity = 100 + Math.random() * 150;
        const size = 5 + Math.random() * 10;
        
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              width: size,
              height: size,
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              animation: `confetti-burst 1.5s ease-out forwards`,
              animationDelay: `${Math.random() * 0.3}s`,
              '--angle': `${angle}deg`,
              '--velocity': `${velocity}px`,
            } as React.CSSProperties}
          />
        );
      })}
      <style>{`
        @keyframes confetti-burst {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(-50% + cos(var(--angle)) * var(--velocity)), 
              calc(-50% + sin(var(--angle)) * var(--velocity) + 100px)
            ) rotate(720deg) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// Flying stars animation
function FlyingStars({ count = 5 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "absolute text-xp fill-xp animate-float",
            "opacity-60"
          )}
          style={{
            left: `${10 + i * 20}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${i * 0.2}s`,
            transform: `scale(${0.5 + Math.random() * 0.5})`,
          }}
        />
      ))}
    </div>
  );
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
  const [showConfetti, setShowConfetti] = useState(false);
  const { playLevelComplete, playCountUp } = useSoundEffects();
  const hasPlayedRef = useRef(false);
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const animatedScore = useAnimatedCounter(score, 1500, playCountUp);
  const animatedXP = useAnimatedCounter(xpEarned, 1200);
  const animatedPercentage = useAnimatedCounter(percentage, 1000);
  
  useEffect(() => {
    if ((levelCompleted || percentage >= 70) && !hasPlayedRef.current) {
      setShowConfetti(true);
      hasPlayedRef.current = true;
      
      // Play celebration sound
      setTimeout(() => playLevelComplete(), 300);
      
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [levelCompleted, percentage, playLevelComplete]);
  
  const getGrade = () => {
    if (percentage >= 90) return { grade: 'S', color: 'text-gradient-xp', message: 'LEGENDARY!', icon: PartyPopper };
    if (percentage >= 80) return { grade: 'A', color: 'text-success', message: 'Excellent!', icon: Sparkles };
    if (percentage >= 70) return { grade: 'B', color: 'text-primary', message: 'Great job!', icon: Trophy };
    if (percentage >= 60) return { grade: 'C', color: 'text-warning', message: 'Not bad!', icon: Star };
    return { grade: 'D', color: 'text-destructive', message: 'Keep practicing!', icon: RotateCcw };
  };

  const gradeInfo = getGrade();
  const GradeIcon = gradeInfo.icon;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Confetti Effect */}
      {showConfetti && <ConfettiBurst />}
      
      {/* Main Results Card */}
      <Card variant="glow" className="p-8 text-center relative overflow-hidden animate-scale-in">
        {/* Flying Stars */}
        {percentage >= 70 && <FlyingStars />}
        
        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-glow opacity-50 pointer-events-none" />
        <div className="absolute inset-0 animate-shimmer opacity-30" />
        
        <div className="relative z-10 space-y-6">
          {/* Trophy Icon */}
          <div className="flex justify-center">
            <div className={cn(
              "h-24 w-24 rounded-full flex items-center justify-center animate-celebration-spin",
              levelCompleted ? "bg-success/20 border-2 border-success glow-success" : "bg-warning/20 border-2 border-warning"
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
              "font-display text-8xl font-black animate-bounce-in",
              gradeInfo.color,
              percentage >= 90 && "text-glow-xp"
            )}>
              {gradeInfo.grade}
            </div>
            <div className="flex items-center justify-center gap-2">
              <GradeIcon className={cn(
                "h-5 w-5",
                percentage >= 80 ? "text-success animate-pulse" : "text-muted-foreground"
              )} />
              <p className="text-xl text-muted-foreground">{gradeInfo.message}</p>
            </div>
          </div>

          {/* Score */}
          <div className="flex justify-center gap-4">
            <Badge variant="xp" className="text-xl px-6 py-3 animate-fade-in stagger-1 hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 mr-2" />
              {animatedScore.toLocaleString()} pts
            </Badge>
            <Badge variant="success" className="text-xl px-6 py-3 animate-fade-in stagger-2 hover:scale-105 transition-transform">
              +{animatedXP} XP
            </Badge>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="gaming" className="p-4 text-center animate-fade-in stagger-1 hover:scale-105 transition-all duration-300 group">
          <div className="text-3xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
            {correctAnswers}/{totalQuestions}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Correct</div>
          <Progress value={(correctAnswers / totalQuestions) * 100} variant="success" className="mt-2 h-1.5" />
        </Card>
        
        <Card variant="gaming" className="p-4 text-center animate-fade-in stagger-2 hover:scale-105 transition-all duration-300 group">
          <div className="text-3xl font-display font-bold text-foreground group-hover:text-xp transition-colors">
            {animatedPercentage}%
          </div>
          <div className="text-sm text-muted-foreground mt-1">Accuracy</div>
          <div className="flex justify-center mt-2 gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i}
                className={cn(
                  "h-4 w-4 transition-all duration-300",
                  i < Math.ceil(percentage / 20) 
                    ? "text-xp fill-xp scale-110" 
                    : "text-muted"
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </Card>
        
        <Card variant="gaming" className="p-4 text-center animate-fade-in stagger-3 hover:scale-105 transition-all duration-300 group">
          <div className="text-3xl font-display font-bold text-foreground group-hover:text-warning transition-colors">
            {hintsUsed}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Hints Used</div>
          {hintsUsed === 0 && (
            <Badge variant="success" className="mt-2 text-xs animate-bounce-in">
              Self Reliant!
            </Badge>
          )}
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in stagger-4">
        <Button 
          variant="gaming" 
          onClick={onReplay}
          className="hover:scale-105 transition-transform"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Replay Level
        </Button>
        
        {levelCompleted && (
          <Button 
            variant="hero" 
            onClick={onNextLevel}
            className="hover:scale-105 transition-transform animate-pulse-glow"
          >
            Next Level
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          onClick={onGoHome}
          className="hover:scale-105 transition-transform"
        >
          Back to Levels
        </Button>
      </div>

      {/* Share */}
      <div className="text-center animate-fade-in stagger-5">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:scale-105 transition-transform hover:text-primary"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Results
        </Button>
      </div>
    </div>
  );
}
