import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  requirements: Record<string, any>;
  is_active: boolean;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  progress: Record<string, any>;
  achievement: Achievement;
}

/**
 * Hook to get all available achievements
 */
export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      return data as Achievement[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get user's earned achievements
 */
export function useUserAchievements() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements (*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data as UserAchievement[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Set up real-time subscription for new achievements
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('user-achievements-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New achievement earned:', payload);
          queryClient.invalidateQueries({ queryKey: ['user-achievements', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return query;
}

/**
 * Hook to check and award achievements
 */
export function useCheckAchievements() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Call the check_user_achievements function
      const { data, error } = await supabase
        .rpc('check_user_achievements', { _user_id: user.id });

      if (error) throw error;
      return data;
    },
    onSuccess: (newAchievements) => {
      if (newAchievements && newAchievements.length > 0) {
        newAchievements.forEach((achievement: any) => {
          toast({
            title: "🏆 Achievement Unlocked!",
            description: `You earned: ${achievement.achievement_name}`,
            duration: 5000,
          });
        });
      }
      
      // Refresh achievements
      queryClient.invalidateQueries({ queryKey: ['user-achievements', user?.id] });
    },
  });
}

/**
 * Hook to get achievement progress for current user
 */
export function useAchievementProgress() {
  const { user } = useAuth();
  const { data: achievements } = useAchievements();
  const { data: userAchievements } = useUserAchievements();

  const progress = achievements?.map(achievement => {
    const userAchievement = userAchievements?.find(ua => ua.achievement_id === achievement.id);
    
    return {
      achievement,
      isEarned: !!userAchievement,
      earnedAt: userAchievement?.earned_at,
      progress: userAchievement?.progress || {},
    };
  });

  return progress || [];
}