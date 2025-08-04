import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Fighter } from '@/types/fighter';
import { CombatState, CombatAction } from '@/engine/CombatEngine';
import { supabase } from '@/integrations/supabase/client';

export interface LiveFight {
  id: string;
  fighter1: Fighter;
  fighter2: Fighter;
  status: 'upcoming' | 'live' | 'completed';
  spectators: number;
  totalBets: number;
  startTime?: Date;
  currentState?: CombatState;
  combatLog: CombatAction[];
  winner?: Fighter;
}

export interface FightEvent {
  type: 'state_update' | 'action' | 'spectator_update' | 'bet_update' | 'fight_complete' | 'fight_countdown' | 'fight_started' | 'fight_complete_with_stats';
  data: any;
  timestamp: Date;
}

interface UseLiveFightReturn {
  fight: LiveFight | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  spectators: number;
  placeBet: (fighterId: string, amount: number) => Promise<void>;
  reactToFight: (reaction: string) => void;
  startFight: () => void;
}

export function useLiveFight(fightId: string): UseLiveFightReturn {
  const queryClient = useQueryClient();
  const [fight, setFight] = useState<LiveFight | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spectators, setSpectators] = useState(0);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!fightId) return;

    const connectWebSocket = () => {
      try {
        // Use the correct WebSocket URL for the edge function
        const wsUrl = `wss://fuifvbppttshpodpuqgf.functions.supabase.co/live-fight?fight_id=${fightId}`;
        console.log('Connecting to WebSocket:', wsUrl);
        const websocket = new WebSocket(wsUrl);

        websocket.onopen = () => {
          console.log('Connected to live fight:', fightId);
          setIsConnected(true);
          setError(null);
          setIsLoading(false);
        };

        websocket.onmessage = (event) => {
          try {
            const fightEvent: FightEvent = JSON.parse(event.data);
            handleFightEvent(fightEvent);
          } catch (err) {
            console.error('Error parsing fight event:', err);
          }
        };

        websocket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError('Connection error occurred - trying fallback mode');
          setIsConnected(false);
          setIsLoading(false);
        };

        websocket.onclose = (event) => {
          console.log('WebSocket connection closed:', event.code, event.reason);
          setIsConnected(false);
          
          // Don't attempt reconnect if it was a manual close or auth error
          if (event.code !== 1000 && event.code !== 1001 && event.code !== 1006) {
            // Attempt to reconnect after 3 seconds
            setTimeout(() => {
              if (!websocket || websocket.readyState === WebSocket.CLOSED) {
                console.log('Attempting to reconnect...');
                connectWebSocket();
              }
            }, 3000);
          }
        };

        setWs(websocket);
      } catch (err) {
        console.error('Failed to create WebSocket connection:', err);
        setError('Failed to connect to live fight - using offline mode');
        setIsLoading(false);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [fightId]);

  const handleFightEvent = useCallback((event: FightEvent) => {
    switch (event.type) {
      case 'state_update':
        setFight(prev => prev ? {
          ...prev,
          currentState: event.data.state,
          status: event.data.status || prev.status
        } : null);
        setIsLoading(false);
        break;

      case 'action':
        setFight(prev => prev ? {
          ...prev,
          combatLog: [...prev.combatLog, event.data.action]
        } : null);
        break;

      case 'spectator_update':
        setSpectators(event.data.count);
        setFight(prev => prev ? {
          ...prev,
          spectators: event.data.count
        } : null);
        break;

      case 'bet_update':
        setFight(prev => prev ? {
          ...prev,
          totalBets: event.data.totalBets
        } : null);
        break;

      case 'fight_complete':
        setFight(prev => prev ? {
          ...prev,
          status: 'completed',
          winner: event.data.winner
        } : null);
        break;

      case 'fight_complete_with_stats':
        setFight(prev => prev ? {
          ...prev,
          status: 'completed',
          winner: event.data.winner
        } : null);
        
        // Invalidate all fight-related queries to refresh data across the app
        console.log('Fight completed with stats updated - refreshing all data');
        queryClient.invalidateQueries({ queryKey: ['fights'] });
        queryClient.invalidateQueries({ queryKey: ['fighters'] });
        queryClient.invalidateQueries({ queryKey: ['bets'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        break;

      case 'fight_countdown':
        // Handle countdown events
        console.log('Fight countdown:', event.data.countdown);
        if ((window as any).setCountdown) {
          (window as any).setCountdown({ isActive: true, count: event.data.countdown });
        }
        break;

      case 'fight_started':
        setFight(prev => prev ? {
          ...prev,
          status: 'live'
        } : null);
        if ((window as any).setCountdown) {
          (window as any).setCountdown({ isActive: false, count: 0 });
        }
        break;

      default:
        console.log('Unknown fight event type:', event.type);
    }
  }, [queryClient]);

  const placeBet = useCallback(async (fighterId: string, amount: number) => {
    if (!fight || !isConnected || !ws) {
      throw new Error('Cannot place bet: not connected to live fight');
    }

    try {
      // Send bet through WebSocket
      ws.send(JSON.stringify({
        type: 'place_bet',
        data: {
          fighterId,
          amount,
          fightId: fight.id
        }
      }));

        // Also store in database  
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
          .from('bets')
          .insert({
            fight_id: fight.id,
            fighter_id: fighterId,
            user_id: user.id,
            amount,
            odds: 2.0, // This would be calculated dynamically
            potential_payout: amount * 2.0
          });

      if (error) {
        console.error('Failed to store bet in database:', error);
        throw error;
      }
    } catch (err) {
      console.error('Failed to place bet:', err);
      throw err;
    }
  }, [fight, isConnected, ws]);

  const reactToFight = useCallback((reaction: string) => {
    if (!isConnected || !ws) return;

    ws.send(JSON.stringify({
      type: 'reaction',
      data: {
        reaction,
        fightId: fight?.id
      }
    }));
  }, [isConnected, ws, fight?.id]);

  const startFight = useCallback(() => {
    if (!isConnected || !ws) return;

    ws.send(JSON.stringify({
      type: 'start_fight'
    }));
  }, [isConnected, ws]);

  // Load initial fight data
  useEffect(() => {
    if (!fightId) return;

    const loadFightData = async () => {
      try {
        const { data: fightData, error: fightError } = await supabase
          .from('fights')
          .select(`
            *,
            fighter1:fighters!fighter1_id(*),
            fighter2:fighters!fighter2_id(*)
          `)
          .eq('id', fightId)
          .single();

        if (fightError) {
          throw fightError;
        }

        // Transform database fighter data to match Fighter interface
        const transformFighter = (dbFighter: any): Fighter => ({
          id: dbFighter.id,
          name: dbFighter.name,
          image: dbFighter.image,
          world: dbFighter.world,
          stats: {
            attack: dbFighter.attack,
            defense: dbFighter.defense,
            speed: dbFighter.speed,
            health: dbFighter.health
          },
          wins: dbFighter.wins || 0,
          losses: dbFighter.losses || 0,
          totalShares: dbFighter.total_shares || 1000,
          valuePerShare: dbFighter.value_per_share || 100,
          specialMove: dbFighter.special_move || 'Special Attack',
          backstory: dbFighter.backstory || '',
          description: dbFighter.description || '',
          abilities: dbFighter.abilities || []
        });

        const liveFight: LiveFight = {
          id: fightData.id,
          fighter1: transformFighter(fightData.fighter1),
          fighter2: transformFighter(fightData.fighter2),
          status: fightData.status as 'upcoming' | 'live' | 'completed',
          spectators: 0,
          totalBets: fightData.total_pot || 0,
          combatLog: [],
          startTime: fightData.scheduled_at ? new Date(fightData.scheduled_at) : undefined,
          winner: fightData.winner_id ? 
            (fightData.winner_id === fightData.fighter1_id ? transformFighter(fightData.fighter1) : transformFighter(fightData.fighter2)) 
            : undefined
        };

        setFight(liveFight);
      } catch (err) {
        console.error('Failed to load fight data:', err);
        setError('Failed to load fight data');
      } finally {
        setIsLoading(false);
      }
    };

    loadFightData();
  }, [fightId]);

  return {
    fight,
    isConnected,
    isLoading,
    error,
    spectators,
    placeBet,
    reactToFight,
    startFight
  };
}