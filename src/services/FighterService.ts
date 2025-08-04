import { supabase } from '@/integrations/supabase/client';
import { Fighter } from '@/types/fighter';

export class FighterService {
  /**
   * Get all fighters from the database with their current stats
   */
  static async getAllFighters(): Promise<Fighter[]> {
    const { data, error } = await supabase
      .from('fighters')
      .select('*')
      .order('wins', { ascending: false });

    if (error) {
      console.error('Error fetching fighters:', error);
      throw error;
    }

    return data.map(this.mapDatabaseToFighter);
  }

  /**
   * Get a specific fighter by ID
   */
  static async getFighterById(id: string): Promise<Fighter | null> {
    const { data, error } = await supabase
      .from('fighters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Fighter not found
      }
      console.error('Error fetching fighter:', error);
      throw error;
    }

    return this.mapDatabaseToFighter(data);
  }

  /**
   * Get fighters by world
   */
  static async getFightersByWorld(world: string): Promise<Fighter[]> {
    const { data, error } = await supabase
      .from('fighters')
      .select('*')
      .eq('world', world)
      .order('wins', { ascending: false });

    if (error) {
      console.error('Error fetching fighters by world:', error);
      throw error;
    }

    return data.map(this.mapDatabaseToFighter);
  }

  /**
   * Get top fighters (leaderboard)
   */
  static async getTopFighters(limit: number = 10): Promise<Fighter[]> {
    const { data, error } = await supabase
      .from('fighters')
      .select('*')
      .order('wins', { ascending: false })
      .order('losses', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching top fighters:', error);
      throw error;
    }

    return data.map(this.mapDatabaseToFighter);
  }

  /**
   * Subscribe to fighter changes in real-time
   */
  static subscribeToFighterChanges(callback: (payload: any) => void) {
    const channel = supabase
      .channel('fighters-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fighters'
        },
        callback
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }

  /**
   * Map database fighter to our Fighter type
   */
  private static mapDatabaseToFighter(dbFighter: any): Fighter {
    return {
      id: dbFighter.id,
      name: dbFighter.name,
      image: dbFighter.image,
      world: dbFighter.world,
      stats: {
        attack: dbFighter.attack,
        defense: dbFighter.defense,
        speed: dbFighter.speed,
        health: dbFighter.health,
      },
      wins: dbFighter.wins || 0,
      losses: dbFighter.losses || 0,
      totalShares: dbFighter.total_shares || 1000,
      valuePerShare: dbFighter.value_per_share || 100,
      specialMove: dbFighter.special_move || 'Unknown Move',
      backstory: dbFighter.backstory || 'A mysterious fighter...',
      description: dbFighter.description || '',
      abilities: dbFighter.abilities || [],
    };
  }
}