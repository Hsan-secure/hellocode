import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gamepad2, Trophy, MessageCircle, User, Zap, LogOut, Award, BookOpen, Play, Code2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProgress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: profile } = useUserProfile();

  const xp = profile?.total_xp || 0;
  const level = profile?.current_level || 1;
  const xpToNextLevel = 1000;
  const currentLevelXP = xp % xpToNextLevel;
  const progress = (currentLevelXP / xpToNextLevel) * 100;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="relative">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success animate-pulse" />
            </div>
            <span className="font-display text-xl font-bold text-gradient-primary">
              CodeQuest
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/levels" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/levels' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Zap className="h-4 w-4" />
              Levels
            </Link>
            <Link 
              to="/leaderboard" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/leaderboard' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Link>
            <Link 
              to="/tutor" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/tutor' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              AI Tutor
            </Link>
            <Link 
              to="/learn" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/learn' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              LearnFirst
            </Link>
            <Link 
              to="/playtime" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/playtime' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Play className="h-4 w-4" />
              Playtime
            </Link>
            <Link 
              to="/tryout" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/tryout' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Code2 className="h-4 w-4" />
              Tryout
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* XP Progress */}
                <div className="hidden sm:flex items-center gap-3">
                  <Badge variant="xp" className="gap-1">
                    <Zap className="h-3 w-3" />
                    {xp.toLocaleString()} XP
                  </Badge>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Level {level}</span>
                    <Progress value={progress} variant="xp" className="w-20 h-1.5" />
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {profile?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/certificates')}>
                      <Award className="h-4 w-4 mr-2" />
                      Certificates
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="hero" size="sm">
                    Start Learning
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
