import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Trophy, 
  Target, 
  Flame, 
  Calendar,
  TrendingUp,
  Award,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LANGUAGE_LEVELS } from '@/types/game';

const Dashboard = () => {
  // Mock user data - in real app, comes from backend
  const userData = {
    name: 'Alex',
    xp: 2850,
    level: 5,
    streak: 7,
    completedLevels: 4,
    totalLevels: 26,
    weakTopics: ['CSS Grid', 'JavaScript Closures'],
    strongTopics: ['HTML Tags', 'CSS Flexbox'],
    badges: [
      { id: 'first-blood', name: 'First Blood', icon: '🎯' },
      { id: 'streak-7', name: 'Week Warrior', icon: '🔥' },
      { id: 'perfect-score', name: 'Perfect Score', icon: '💯' },
    ],
    recentActivity: [
      { level: 3, title: 'Semantic HTML', score: 85, date: 'Today' },
      { level: 2, title: 'HTML Forms', score: 92, date: 'Yesterday' },
      { level: 1, title: 'HTML Tags', score: 100, date: '2 days ago' },
    ],
    languageProgress: [
      { language: 'html', completed: 3, total: 4, name: 'HTML', color: 'from-orange-500 to-red-500' },
      { language: 'css', completed: 1, total: 4, name: 'CSS', color: 'from-blue-500 to-cyan-500' },
      { language: 'javascript', completed: 0, total: 3, name: 'JavaScript', color: 'from-yellow-500 to-amber-500' },
    ],
  };

  const xpToNextLevel = 1000;
  const currentLevelXP = userData.xp % xpToNextLevel;
  const progress = (currentLevelXP / xpToNextLevel) * 100;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar xp={userData.xp} level={userData.level} isLoggedIn={true} />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, <span className="text-gradient-primary">{userData.name}</span>!
          </h1>
          <p className="text-muted-foreground">Keep up the great work. You're on a roll!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card variant="glow" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="font-display text-3xl font-bold text-gradient-xp">
                  {userData.xp.toLocaleString()}
                </p>
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
                <p className="font-display text-3xl font-bold text-foreground">
                  {userData.streak} days
                </p>
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
                <p className="font-display text-3xl font-bold text-foreground">
                  {userData.completedLevels}/{userData.totalLevels}
                </p>
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
                <p className="font-display text-3xl font-bold text-foreground">
                  {userData.badges.length}
                </p>
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
                  Level {userData.level} Progress
                </h2>
                <Badge variant="xp">
                  {currentLevelXP}/{xpToNextLevel} XP
                </Badge>
              </div>
              <Progress value={progress} variant="xp" className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">
                {xpToNextLevel - currentLevelXP} XP to Level {userData.level + 1}
              </p>
            </Card>

            {/* Language Progress */}
            <Card variant="gaming" className="p-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Language Progress
              </h2>
              <div className="space-y-6">
                {userData.languageProgress.map((lang) => (
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
                {userData.recentActivity.map((activity, index) => (
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
                ))}
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
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <span className="font-display font-bold text-white">4</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Semantic HTML</p>
                    <p className="text-sm text-muted-foreground">HTML - In Progress</p>
                  </div>
                </div>
                <Link to="/play/3">
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
              <div className="grid grid-cols-3 gap-3">
                {userData.badges.map((badge) => (
                  <div 
                    key={badge.id}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50 text-center"
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-xs text-muted-foreground">{badge.name}</span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4" size="sm">
                View All Badges
              </Button>
            </Card>

            {/* Areas to Improve */}
            <Card variant="gaming" className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                <TrendingUp className="h-5 w-5 inline mr-2 text-warning" />
                Areas to Improve
              </h2>
              <div className="space-y-2">
                {userData.weakTopics.map((topic) => (
                  <div 
                    key={topic}
                    className="flex items-center gap-2 p-2 rounded-lg bg-warning/10 border border-warning/20"
                  >
                    <Target className="h-4 w-4 text-warning" />
                    <span className="text-sm text-foreground">{topic}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Strengths */}
            <Card variant="gaming" className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                <Award className="h-5 w-5 inline mr-2 text-success" />
                Your Strengths
              </h2>
              <div className="space-y-2">
                {userData.strongTopics.map((topic) => (
                  <div 
                    key={topic}
                    className="flex items-center gap-2 p-2 rounded-lg bg-success/10 border border-success/20"
                  >
                    <Award className="h-4 w-4 text-success" />
                    <span className="text-sm text-foreground">{topic}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
