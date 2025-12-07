import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Zap, Crown, User } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useUserProgress';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProgress';

const Leaderboard = () => {
  const { user } = useAuth();
  const { data: profile } = useUserProfile();
  const { data: leaderboard, isLoading } = useLeaderboard();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="font-display text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBgClass = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30';
      default:
        return 'bg-muted/50';
    }
  };

  // Find current user's rank
  const currentUserRank = leaderboard?.findIndex(p => p.user_id === user?.id) ?? -1;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 mb-6">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-4">
            <span className="text-gradient-primary">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            See how you stack up against other CodeQuest players. Climb the ranks by earning XP!
          </p>
        </div>

        {/* Current User Rank Card */}
        {user && profile && currentUserRank >= 0 && (
          <Card variant="glow" className="p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-foreground">
                    Your Rank: #{currentUserRank + 1}
                  </p>
                  <p className="text-muted-foreground">{profile.username}</p>
                </div>
              </div>
              <Badge variant="xp" className="text-lg px-4 py-2">
                <Zap className="h-4 w-4 mr-1" />
                {profile.total_xp.toLocaleString()} XP
              </Badge>
            </div>
          </Card>
        )}

        {/* Leaderboard List */}
        <Card variant="gaming" className="max-w-2xl mx-auto overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Top Players
            </h2>
          </div>

          <div className="divide-y divide-border">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))
            ) : leaderboard && leaderboard.length > 0 ? (
              leaderboard.map((player, index) => {
                const rank = index + 1;
                const isCurrentUser = player.user_id === user?.id;
                
                return (
                  <div 
                    key={player.id}
                    className={`flex items-center gap-4 p-4 transition-colors ${
                      isCurrentUser ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                    } ${rank <= 3 ? getRankBgClass(rank) : 'hover:bg-muted/30'}`}
                  >
                    {/* Rank */}
                    <div className="w-12 flex justify-center">
                      {getRankIcon(rank)}
                    </div>
                    
                    {/* Avatar & Name */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
                        rank === 1 ? 'bg-gradient-to-br from-yellow-500 to-amber-600' :
                        rank === 2 ? 'bg-gradient-to-br from-gray-400 to-slate-500' :
                        rank === 3 ? 'bg-gradient-to-br from-amber-600 to-orange-600' :
                        'bg-gradient-to-br from-primary to-accent'
                      }`}>
                        {player.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-medium ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                          {player.username}
                          {isCurrentUser && <span className="text-xs ml-2 text-primary">(You)</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Level {player.current_level}
                        </p>
                      </div>
                    </div>
                    
                    {/* XP */}
                    <Badge variant={rank <= 3 ? 'xp' : 'outline'} className="gap-1">
                      <Zap className="h-3 w-3" />
                      {player.total_xp.toLocaleString()}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No players yet. Be the first to join!</p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Leaderboard;
