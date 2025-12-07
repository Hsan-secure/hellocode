import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { LevelCard } from '@/components/LevelCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { levels } from '@/data/levels';
import { LANGUAGE_LEVELS, Language } from '@/types/game';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useUserLevelProgress } from '@/hooks/useUserProgress';

const Levels = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: levelProgress, isLoading } = useUserLevelProgress();
  const [activeFilter, setActiveFilter] = useState<Language | 'all'>('all');

  const languageFilters: { key: Language | 'all'; label: string; color?: string }[] = [
    { key: 'all', label: 'All Levels' },
    { key: 'html', label: 'HTML', color: 'from-orange-500 to-red-500' },
    { key: 'css', label: 'CSS', color: 'from-blue-500 to-cyan-500' },
    { key: 'javascript', label: 'JavaScript', color: 'from-yellow-500 to-amber-500' },
    { key: 'ds', label: 'Data Structures', color: 'from-green-500 to-emerald-500' },
    { key: 'dbms', label: 'DBMS', color: 'from-purple-500 to-violet-500' },
    { key: 'python', label: 'Python', color: 'from-blue-600 to-indigo-600' },
  ];

  const filteredLevels = activeFilter === 'all' 
    ? levels 
    : levels.filter(level => level.language === activeFilter);

  // Get completed level IDs
  const completedLevelIds = levelProgress?.filter(p => p.is_completed).map(p => p.level_id) || [];
  
  // Calculate which levels are unlocked
  // First level is always unlocked, subsequent levels unlock when previous is completed
  const getUnlockedLevels = () => {
    const unlocked = new Set<number>();
    unlocked.add(0); // First level always unlocked
    
    for (const levelId of completedLevelIds) {
      unlocked.add(levelId);
      unlocked.add(levelId + 1); // Unlock next level
    }
    
    return unlocked;
  };
  
  const unlockedLevels = getUnlockedLevels();

  // Map levels with user progress
  const userLevels = levels.map((level) => {
    const progress = levelProgress?.find(p => p.level_id === level.id);
    return {
      ...level,
      isUnlocked: !user || unlockedLevels.has(level.id), // All unlocked if not logged in
      isCompleted: progress?.is_completed || false,
      bestScore: progress?.best_score ?? undefined,
    };
  });

  const handleLevelClick = (levelId: number) => {
    navigate(`/play/${levelId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-4">
            Choose Your <span className="text-gradient-primary">Challenge</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Progress through 26 levels across 6 technologies. Complete each level to unlock the next.
          </p>
        </div>

        {/* Language Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {languageFilters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? 'hero' : 'gaming'}
              size="sm"
              onClick={() => setActiveFilter(filter.key)}
              className={cn(
                "transition-all",
                filter.color && activeFilter === filter.key && `bg-gradient-to-r ${filter.color}`
              )}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Level Groups by Language */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : activeFilter === 'all' ? (
          Object.entries(LANGUAGE_LEVELS).map(([lang, info]) => {
            const langLevels = userLevels.filter(l => l.language === lang);
            const completedCount = langLevels.filter(l => l.isCompleted).length;
            
            return (
              <section key={lang} className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center`}>
                      <span className="text-lg font-bold text-white">{info.name[0]}</span>
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-foreground">
                        {info.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Levels {info.start} - {info.end}
                      </p>
                    </div>
                  </div>
                  <Badge variant="level">
                    {completedCount}/{langLevels.length} Complete
                  </Badge>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {langLevels.map((level) => (
                    <LevelCard 
                      key={level.id} 
                      level={level} 
                      onClick={() => handleLevelClick(level.id)} 
                    />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredLevels.map((level) => {
              const userLevel = userLevels.find(l => l.id === level.id)!;
              return (
                <LevelCard 
                  key={level.id} 
                  level={userLevel} 
                  onClick={() => handleLevelClick(level.id)} 
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Levels;
