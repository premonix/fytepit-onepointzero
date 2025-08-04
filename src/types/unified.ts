// Unified types that bridge static data and database models
import { Fighter as StaticFighter, WorldType } from './fighter';

/**
 * Enhanced Fighter type that includes both static and database fields
 */
export interface UnifiedFighter extends StaticFighter {
  // Database-specific fields
  created_at?: string;
  updated_at?: string;
  
  // Computed fields
  winRate?: number;
  totalFights?: number;
  
  // Market data
  current_price?: number;
  price_change?: number;
  market_cap?: number;
}

/**
 * Database fighter response type (raw from Supabase)
 */
export interface DatabaseFighter {
  id: string;
  name: string;
  image: string;
  world: string;
  attack: number;
  defense: number;
  speed: number;
  health: number;
  wins: number;
  losses: number;
  total_shares: number;
  value_per_share: number;
  special_move?: string;
  backstory?: string;
  description?: string;
  abilities?: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Fight states for real-time updates
 */
export type FightStatus = 'upcoming' | 'live' | 'completed';

/**
 * Unified fight type that works with both static and database data
 */
export interface UnifiedFight {
  id: string;
  fighter1: UnifiedFighter;
  fighter2: UnifiedFighter;
  status: FightStatus;
  winner?: UnifiedFighter;
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  total_pot: number;
  spectator_count: number;
  venue?: string;
  fight_type: string;
  rules?: Record<string, any>;
}

/**
 * User profile with all related data
 */
export interface UnifiedUserProfile {
  user_id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  total_balance: number;
  is_active: boolean;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
  
  // Computed fields
  total_winnings?: number;
  total_bets?: number;
  win_rate?: number;
  favorite_world?: WorldType;
}

/**
 * Transaction types for consistency
 */
export type TransactionType = 
  | 'buy_shares'
  | 'sell_shares'
  | 'bet_placed'
  | 'bet_payout'
  | 'bet_winnings'
  | 'deposit'
  | 'withdrawal';

/**
 * Bet status types
 */
export type BetStatus = 'pending' | 'won' | 'lost' | 'cancelled';

/**
 * Enhanced bet type with fight details
 */
export interface UnifiedBet {
  id: string;
  user_id: string;
  fight_id: string;
  fighter_id: string;
  amount: number;
  odds: number;
  potential_payout: number;
  payout?: number;
  status: BetStatus;
  created_at: string;
  updated_at: string;
  
  // Related data
  fighter?: UnifiedFighter;
  fight?: UnifiedFight;
}

/**
 * Real-time event types for WebSocket communication
 */
export type RealtimeEventType = 
  | 'fighter_updated'
  | 'fight_created'
  | 'fight_started'
  | 'fight_completed'
  | 'bet_placed'
  | 'bet_resolved'
  | 'user_balance_updated'
  | 'spectator_joined'
  | 'spectator_left';

/**
 * Generic real-time event structure
 */
export interface RealtimeEvent<T = any> {
  type: RealtimeEventType;
  data: T;
  timestamp: string;
  user_id?: string;
}

/**
 * Leaderboard entry with computed stats
 */
export interface LeaderboardEntry {
  fighter: UnifiedFighter;
  rank: number;
  stats: {
    wins: number;
    losses: number;
    winRate: number;
    totalFights: number;
    averageDamage: number;
    lastFightDate?: string;
  };
  market: {
    currentPrice: number;
    priceChange24h: number;
    marketCap: number;
    volume24h: number;
  };
}

/**
 * World statistics and rankings
 */
export interface WorldStats {
  world: WorldType;
  totalFighters: number;
  totalFights: number;
  averageWinRate: number;
  topFighter: UnifiedFighter;
  recentFights: UnifiedFight[];
  marketCap: number;
}

/**
 * System-wide statistics
 */
export interface SystemStats {
  totalUsers: number;
  totalFighters: number;
  totalFights: number;
  totalBetsPlaced: number;
  totalVolumeTraded: number;
  activeFights: number;
  onlineUsers: number;
  topWorlds: WorldStats[];
}