import { useState } from 'react';
import { Level, LANGUAGE_LEVELS } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Check, Play, Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelCardProps {
  level: Level;
  onClick: () => void;
}

export function LevelCard({ level, onClick }: LevelCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const languageInfo = LANGUAGE_LEVELS[level.language];
  
  const difficultyStars = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 4,
  };

  return (
    <Card 
      variant={level.isUnlocked ? "glow" : "gaming"}
      className={cn(
        "relative overflow-hidden transition-all duration-500 group cursor-pointer",
        level.isUnlocked 
          ? "hover:scale-[1.03] hover:shadow-[0_0_40px_hsl(185_100%_50%/0.3)]" 
          : "opacity-60 cursor-not-allowed",
        isHovered && level.isUnlocked && "border-primary"
      )}
      onClick={level.isUnlocked ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      {level.isUnlocked && (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 transition-opacity duration-500",
          isHovered && "opacity-100"
        )} />
      )}
      
      {/* Shimmer effect on hover */}
      {level.isUnlocked && isHovered && (
        <div className="absolute inset-0 animate-shimmer pointer-events-none" />
      )}

      {/* Language Color Strip with animation */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r transition-all duration-500",
        languageInfo.color,
        isHovered && level.isUnlocked && "h-1.5"
      )} />

      {/* Completion Check with animation */}
      {level.isCompleted && (
        <div className={cn(
          "absolute top-4 right-4 h-8 w-8 rounded-full bg-success flex items-center justify-center glow-success transition-transform duration-300",
          isHovered && "scale-110 animate-pulse"
        )}>
          <Check className="h-5 w-5 text-success-foreground" />
        </div>
      )}

      {/* Perfect score indicator */}
      {level.bestScore === 100 && (
        <div className="absolute top-4 right-14 animate-float">
          <Sparkles className="h-5 w-5 text-xp" />
        </div>
      )}

      {/* Lock Overlay with animation */}
      {!level.isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Lock className="h-8 w-8 text-muted-foreground" />
              <div className="absolute inset-0 animate-pulse">
                <Lock className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Complete previous level</span>
          </div>
        </div>
      )}

      <div className="p-6 space-y-4 relative z-10">
        {/* Level Number & Language */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "level-badge h-10 w-10 rounded-lg flex items-center justify-center text-lg transition-all duration-300",
            `bg-gradient-to-br ${languageInfo.color}`,
            isHovered && level.isUnlocked && "scale-110 rotate-3"
          )}>
            {level.id}
          </div>
          <div>
            <Badge 
              variant="level" 
              className={cn(
                "text-xs transition-all duration-300",
                isHovered && level.isUnlocked && "scale-105"
              )}
            >
              {languageInfo.name}
            </Badge>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className={cn(
            "font-display text-lg font-semibold text-foreground transition-all duration-300",
            isHovered && level.isUnlocked && "text-primary text-glow-primary"
          )}>
            {level.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {level.description}
          </p>
        </div>

        {/* Difficulty & XP */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Star 
                key={i} 
                className={cn(
                  "h-4 w-4 transition-all duration-300",
                  i < difficultyStars[level.difficulty] 
                    ? "text-xp fill-xp" 
                    : "text-muted",
                  isHovered && i < difficultyStars[level.difficulty] && "scale-110"
                )}
                style={{
                  transitionDelay: `${i * 50}ms`
                }}
              />
            ))}
          </div>
          <Badge 
            variant="xp" 
            className={cn(
              "text-xs transition-all duration-300",
              isHovered && level.isUnlocked && "scale-105 animate-pulse"
            )}
          >
            +{level.xpReward} XP
          </Badge>
        </div>

        {/* Best Score with animation */}
        {level.bestScore !== undefined && (
          <div className={cn(
            "text-xs text-muted-foreground flex items-center gap-1 transition-all duration-300",
            level.bestScore === 100 && "text-xp"
          )}>
            <span>Best: {level.bestScore}%</span>
            {level.bestScore === 100 && (
              <Sparkles className="h-3 w-3 text-xp animate-pulse" />
            )}
          </div>
        )}

        {/* Play Button with enhanced animation */}
        {level.isUnlocked && (
          <Button 
            variant={level.isCompleted ? "gaming" : "hero"} 
            className={cn(
              "w-full mt-2 transition-all duration-300 group/btn overflow-hidden relative",
              isHovered && "shadow-lg scale-[1.02]"
            )}
          >
            {/* Button shimmer effect */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700",
              isHovered && "translate-x-full"
            )} />
            
            <Play className={cn(
              "h-4 w-4 mr-2 transition-transform duration-300 relative z-10",
              isHovered && "scale-110"
            )} />
            <span className="relative z-10">
              {level.isCompleted ? 'Replay' : 'Start'}
            </span>
          </Button>
        )}
      </div>
    </Card>
  );
}
