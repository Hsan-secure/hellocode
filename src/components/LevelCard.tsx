import { Level, LANGUAGE_LEVELS } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Check, Play, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelCardProps {
  level: Level;
  onClick: () => void;
}

export function LevelCard({ level, onClick }: LevelCardProps) {
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
        "relative overflow-hidden transition-all duration-300 group cursor-pointer",
        level.isUnlocked ? "hover:scale-[1.02]" : "opacity-60 cursor-not-allowed"
      )}
      onClick={level.isUnlocked ? onClick : undefined}
    >
      {/* Language Color Strip */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
        languageInfo.color
      )} />

      {/* Completion Check */}
      {level.isCompleted && (
        <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-success flex items-center justify-center glow-success">
          <Check className="h-5 w-5 text-success-foreground" />
        </div>
      )}

      {/* Lock Overlay */}
      {!level.isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2">
            <Lock className="h-8 w-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Complete previous level</span>
          </div>
        </div>
      )}

      <div className="p-6 space-y-4">
        {/* Level Number & Language */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "level-badge h-10 w-10 rounded-lg flex items-center justify-center text-lg",
            `bg-gradient-to-br ${languageInfo.color}`
          )}>
            {level.id}
          </div>
          <div>
            <Badge variant="level" className="text-xs">
              {languageInfo.name}
            </Badge>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {level.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
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
                  "h-4 w-4",
                  i < difficultyStars[level.difficulty] 
                    ? "text-xp fill-xp" 
                    : "text-muted"
                )}
              />
            ))}
          </div>
          <Badge variant="xp" className="text-xs">
            +{level.xpReward} XP
          </Badge>
        </div>

        {/* Best Score */}
        {level.bestScore !== undefined && (
          <div className="text-xs text-muted-foreground">
            Best: {level.bestScore}%
          </div>
        )}

        {/* Play Button */}
        {level.isUnlocked && (
          <Button 
            variant={level.isCompleted ? "gaming" : "hero"} 
            className="w-full mt-2 group-hover:shadow-lg"
          >
            <Play className="h-4 w-4 mr-2" />
            {level.isCompleted ? 'Replay' : 'Start'}
          </Button>
        )}
      </div>
    </Card>
  );
}
