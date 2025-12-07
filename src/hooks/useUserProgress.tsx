import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  total_xp: number;
  current_level: number;
  streak_days: number;
  last_activity_date: string | null;
}

interface LevelProgress {
  id: string;
  user_id: string;
  level_id: number;
  is_completed: boolean;
  best_score: number | null;
  completed_at: string | null;
  attempts: number;
}

interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

interface GameSession {
  id: string;
  user_id: string;
  level_id: number;
  score: number;
  correct_answers: number;
  total_questions: number;
  hints_used: number;
  xp_earned: number;
  completed_at: string;
}

export function useUserProfile() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!user,
  });
}

export function useUserLevelProgress() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['levelProgress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_level_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as LevelProgress[];
    },
    enabled: !!user,
  });
}

export function useUserBadges() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userBadges', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as UserBadge[];
    },
    enabled: !!user,
  });
}

export function useGameSessions() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['gameSessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as GameSession[];
    },
    enabled: !!user,
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as Profile[];
    },
  });
}

export function useSaveGameSession() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (session: {
      level_id: number;
      score: number;
      correct_answers: number;
      total_questions: number;
      hints_used: number;
      xp_earned: number;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      // Save game session
      const { error: sessionError } = await supabase
        .from('game_sessions')
        .insert({
          user_id: user.id,
          ...session,
        });
      
      if (sessionError) throw sessionError;
      
      // Update or insert level progress
      const passedLevel = session.correct_answers >= Math.ceil(session.total_questions * 0.6);
      
      const { data: existingProgress } = await supabase
        .from('user_level_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('level_id', session.level_id)
        .maybeSingle();
      
      if (existingProgress) {
        const updates: any = {
          attempts: existingProgress.attempts + 1,
        };
        
        if (passedLevel && (!existingProgress.best_score || session.score > existingProgress.best_score)) {
          updates.best_score = session.score;
          updates.is_completed = true;
          updates.completed_at = new Date().toISOString();
        }
        
        await supabase
          .from('user_level_progress')
          .update(updates)
          .eq('id', existingProgress.id);
      } else {
        await supabase
          .from('user_level_progress')
          .insert({
            user_id: user.id,
            level_id: session.level_id,
            is_completed: passedLevel,
            best_score: session.score,
            completed_at: passedLevel ? new Date().toISOString() : null,
            attempts: 1,
          });
      }
      
      // Update profile XP
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_xp, current_level, streak_days, last_activity_date')
        .eq('user_id', user.id)
        .single();
      
      if (profile) {
        const newXp = profile.total_xp + session.xp_earned;
        const newLevel = Math.floor(newXp / 1000) + 1;
        
        // Check streak
        const today = new Date().toISOString().split('T')[0];
        const lastActivity = profile.last_activity_date;
        let newStreak = profile.streak_days;
        
        if (lastActivity) {
          const lastDate = new Date(lastActivity);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            newStreak = profile.streak_days + 1;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }
        
        await supabase
          .from('profiles')
          .update({
            total_xp: newXp,
            current_level: newLevel,
            streak_days: newStreak,
            last_activity_date: today,
          })
          .eq('user_id', user.id);
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['levelProgress'] });
      queryClient.invalidateQueries({ queryKey: ['gameSessions'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}

export function useAwardBadge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (badgeId: string) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: user.id,
          badge_id: badgeId,
        });
      
      // Ignore duplicate errors
      if (error && !error.message.includes('duplicate')) throw error;
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBadges'] });
    },
  });
}
