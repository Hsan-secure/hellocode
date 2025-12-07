import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Zap, 
  Trophy, 
  Target, 
  Flame, 
  TrendingUp,
  Award,
  Play,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, useUserLevelProgress, useUserBadges, useGameSessions } from '@/hooks/useUserProgress';
import { levels } from '@/data/levels';
import { badges as allBadges } from '@/data/levels';
import { LANGUAGE_LEVELS } from '@/types/game';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: levelProgress, isLoading: progressLoading } = useUserLevelProgress();
  const { data: userBadges, isLoading: badgesLoading } = useUserBadges();
  const { data: gameSessions, isLoading: sessionsLoading } = useGameSessions();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const isLoading = authLoading || profileLoading || progressLoading || badgesLoading || sessionsLoading;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Sparkles className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const completedLevelIds = levelProgress?.filter(p => p.is_completed).map(p => p.level_id) || [];
  const totalCompleted = completedLevelIds.length;

  const xpToNextLevel = 1000;
  const currentLevelXP = (profile?.total_xp || 0) % xpToNextLevel;
  const progress = (currentLevelXP / xpToNextLevel) * 100;

  // Get next level to play
  const nextLevel = levels.find(l => !completedLevelIds.includes(l.id)) || levels[0];

  // Calculate language progress
  const languageProgressData = Object.entries(LANGUAGE_LEVELS).slice(0, 3).map(([lang, info]) => {
    const langLevels = levels.filter(l => l.language === lang);
    const completed = langLevels.filter(l => completedLevelIds.includes(l.id)).length;
    return {
      language: lang,
      completed,
      total: langLevels.length,
      name: info.name,
      color: info.color,
    };
  });

  // Get earned badges with details
  const earnedBadges = userBadges?.map(ub => {
    const badge = allBadges.find(b => b.id === ub.badge_id);
    return badge ? { ...badge, earnedAt: ub.earned_at } : null;
  }).filter(Boolean).slice(0, 3) || [];

  // Get recent activity from game sessions
  const recentActivity = gameSessions?.slice(0, 3).map(session => {
    const level = levels.find(l => l.id === session.level_id);
    const completedDate = new Date(session.completed_at);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let dateLabel = 'Today';
    if (diffDays === 1) dateLabel = 'Yesterday';
    else if (diffDays > 1) dateLabel = `${diffDays} days ago`;
    
    return {
      level: session.level_id,
      title: level?.title || 'Unknown Level',
      score: session.total_questions > 0 
        ? Math.round((session.correct_answers / session.total_questions) * 100) 
        : 0,
      date: dateLabel,
    };
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, <span className="text-gradient-primary">{profile?.username || 'Player'}</span>!
          </h1>
          <p className="text-muted-foreground">Keep up the great work. You're on a roll!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card variant="glow" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                {isLoading ? (
                  <Skeleton className="h-9 w-24 mt-1" />
                ) : (
                  <p className="font-display text-3xl font-bold text-gradient-xp">
                    {(profile?.total_xp || 0).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-xl bg-xp/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-xp" />
              </div>
            </div>
          </Card>

          <Card variant="glow" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                {isLoading ? (
                  <Skeleton className="h-9 w-20 mt-1" />
                ) : (
                  <p className="font-display text-3xl font-bold text-foreground">
                    {profile?.streak_days || 0} days
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <Flame className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </Card>

          <Card variant="glow" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Levels Complete</p>
                {isLoading ? (
                  <Skeleton className="h-9 w-16 mt-1" />
                ) : (
                  <p className="font-display text-3xl font-bold text-foreground">
                    {totalCompleted}/{levels.length}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-success" />
              </div>
            </div>
          </Card>

          <Card variant="glow" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                {isLoading ? (
                  <Skeleton className="h-9 w-12 mt-1" />
                ) : (
                  <p className="font-display text-3xl font-bold text-foreground">
                    {userBadges?.length || 0}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Level Progress */}
            <Card variant="gaming" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Level {profile?.current_level || 1} Progress
                </h2>
                <Badge variant="xp">
                  {currentLevelXP}/{xpToNextLevel} XP
                </Badge>
              </div>
              <Progress value={progress} variant="xp" className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">
                {xpToNextLevel - currentLevelXP} XP to Level {(profile?.current_level || 1) + 1}
              </p>
            </Card>

            {/* Language Progress */}
            <Card variant="gaming" className="p-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Language Progress
              </h2>
              <div className="space-y-6">
                {languageProgressData.map((lang) => (
                  <div key={lang.language}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${lang.color} flex items-center justify-center`}>
                          <span className="text-sm font-bold text-white">{lang.name[0]}</span>
                        </div>
                        <span className="font-medium text-foreground">{lang.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {lang.completed}/{lang.total} levels
                      </span>
                    </div>
                    <Progress 
                      value={(lang.completed / lang.total) * 100} 
                      variant="success" 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card variant="gaming" className="p-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <span className="font-display font-bold text-primary">{activity.level}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      <Badge variant={activity.score >= 90 ? 'success' : activity.score >= 70 ? 'level' : 'outline'}>
                        {activity.score}%
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activity. Start playing to see your progress!
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Continue Learning */}
            <Card variant="glow" className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Continue Learning
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${LANGUAGE_LEVELS[nextLevel.language].color} flex items-center justify-center`}>
                    <span className="font-display font-bold text-white">{nextLevel.id}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{nextLevel.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {LANGUAGE_LEVELS[nextLevel.language].name}
                    </p>
                  </div>
                </div>
                <Link to={`/play/${nextLevel.id}`}>
                  <Button variant="hero" className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Badges */}
            <Card variant="gaming" className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Recent Badges
              </h2>
              {earnedBadges.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {earnedBadges.map((badge: any) => (
                    <div 
                      key={badge.id}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50 text-center"
                    >
                      <span className="text-2xl">{badge.icon}</span>
                      <span className="text-xs text-muted-foreground">{badge.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No badges yet. Complete levels to earn badges!
                </p>
              )}
              <Link to="/levels">
                <Button variant="ghost" className="w-full mt-4" size="sm">
                  View All Badges
                </Button>
              </Link>
            </Card>

            {/* Leaderboard Position */}
            <Card variant="gaming" className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                <TrendingUp className="h-5 w-5 inline mr-2 text-primary" />
                Leaderboard
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                See how you rank against other players!
              </p>
              <Link to="/leaderboard">
                <Button variant="outline" className="w-full">
                  <Trophy className="h-4 w-4 mr-2" />
                  View Leaderboard
                </Button>
              </Link>
            </Card>

            {/* AI Tutor */}
            <Card variant="gaming" className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                <Award className="h-5 w-5 inline mr-2 text-success" />
                Need Help?
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Get personalized help from our AI tutor anytime!
              </p>
              <Link to="/tutor">
                <Button variant="outline" className="w-full">
                  Ask AI Tutor
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
