import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FighterService } from '@/services/FighterService';
import { Fighter } from '@/types/fighter';

export const FIGHTERS_QUERY_KEY = ['fighters'];
export const FIGHTER_QUERY_KEY = ['fighter'];

/**
 * Hook to get all fighters with real-time updates
 */
export function useFighters() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: FIGHTERS_QUERY_KEY,
    queryFn: FighterService.getAllFighters,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Set up real-time subscription
  useEffect(() => {
    const unsubscribe = FighterService.subscribeToFighterChanges((payload) => {
      console.log('Fighter data changed:', payload);
      // Invalidate and refetch fighter data
      queryClient.invalidateQueries({ queryKey: FIGHTERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: FIGHTER_QUERY_KEY });
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return query;
}

/**
 * Hook to get a specific fighter by ID
 */
export function useFighter(id: string) {
  return useQuery({
    queryKey: [...FIGHTER_QUERY_KEY, id],
    queryFn: () => FighterService.getFighterById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get fighters by world
 */
export function useFightersByWorld(world: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...FIGHTERS_QUERY_KEY, 'world', world],
    queryFn: () => FighterService.getFightersByWorld(world),
    enabled: !!world,
    staleTime: 5 * 60 * 1000,
  });

  // Set up real-time subscription
  useEffect(() => {
    const unsubscribe = FighterService.subscribeToFighterChanges((payload) => {
      // Invalidate world-specific queries
      queryClient.invalidateQueries({ 
        queryKey: [...FIGHTERS_QUERY_KEY, 'world', world] 
      });
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, world]);

  return query;
}

/**
 * Hook to get top fighters for leaderboard
 */
export function useTopFighters(limit: number = 10) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...FIGHTERS_QUERY_KEY, 'top', limit],
    queryFn: () => FighterService.getTopFighters(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes for leaderboard
  });

  // Set up real-time subscription
  useEffect(() => {
    const unsubscribe = FighterService.subscribeToFighterChanges((payload) => {
      // Invalidate top fighters queries
      queryClient.invalidateQueries({ 
        queryKey: [...FIGHTERS_QUERY_KEY, 'top'] 
      });
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return query;
}

/**
 * Get fighters with calculated stats (win rate, etc.)
 */
export function useFightersWithStats() {
  const { data: fighters, ...query } = useFighters();

  const fightersWithStats = fighters?.map(fighter => ({
    ...fighter,
    winRate: fighter.wins / (fighter.wins + fighter.losses) || 0,
    totalFights: fighter.wins + fighter.losses,
  }));

  return {
    ...query,
    data: fightersWithStats,
  };
}