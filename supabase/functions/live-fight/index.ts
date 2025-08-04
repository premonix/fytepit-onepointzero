import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

console.log("Live Fight Edge Function starting...");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Combat Engine interfaces
interface Fighter {
  id: string;
  name: string;
  world: string;
  stats: {
    attack: number;
    defense: number;
    speed: number;
    health: number;
  };
}

interface CombatState {
  fighter1: Fighter;
  fighter2: Fighter;
  fighter1Health: number;
  fighter2Health: number;
  fighter1Energy: number;
  fighter2Energy: number;
  round: number;
  momentum: number;
  activeEffects: StatusEffect[];
}

interface StatusEffect {
  id: string;
  type: 'buff' | 'debuff' | 'damage_over_time' | 'stun';
  target: 1 | 2;
  duration: number;
  value: number;
  description: string;
}

interface CombatAction {
  type: 'attack' | 'special' | 'ultimate' | 'defend' | 'recover';
  attacker: 1 | 2;
  damage?: number;
  energyCost: number;
  effects?: StatusEffect[];
  description: string;
  critical: boolean;
  blocked: boolean;
}

// Simple Combat Engine for Edge Function
class SimpleCombatEngine {
  private state: CombatState;
  private combatLog: CombatAction[] = [];

  constructor(fighter1: Fighter, fighter2: Fighter) {
    this.state = {
      fighter1,
      fighter2,
      fighter1Health: fighter1.stats.health,
      fighter2Health: fighter2.stats.health,
      fighter1Energy: 100,
      fighter2Energy: 100,
      round: 1,
      momentum: 0,
      activeEffects: [],
    };
  }

  public getState(): CombatState {
    return { ...this.state };
  }

  public getCombatLog(): CombatAction[] {
    return [...this.combatLog];
  }

  public executeRound(): CombatAction[] {
    const roundActions: CombatAction[] = [];
    
    // Determine turn order based on speed
    const fighter1Speed = this.state.fighter1.stats.speed;
    const fighter2Speed = this.state.fighter2.stats.speed;
    const turnOrder = fighter1Speed >= fighter2Speed ? [1, 2] : [2, 1];
    
    for (const attackerId of turnOrder as (1 | 2)[]) {
      const action = this.generateAction(attackerId);
      if (action) {
        this.processAction(action);
        roundActions.push(action);
        this.combatLog.push(action);
        
        if (this.isKnockout()) {
          break;
        }
      }
    }
    
    this.state.round++;
    return roundActions;
  }

  private generateAction(attackerId: 1 | 2): CombatAction | null {
    const attacker = attackerId === 1 ? this.state.fighter1 : this.state.fighter2;
    const defender = attackerId === 1 ? this.state.fighter2 : this.state.fighter1;
    const attackerHealth = attackerId === 1 ? this.state.fighter1Health : this.state.fighter2Health;
    const attackerEnergy = attackerId === 1 ? this.state.fighter1Energy : this.state.fighter2Energy;
    
    const healthPercent = attackerHealth / attacker.stats.health;
    const energyPercent = attackerEnergy / 100;
    
    // Simple AI decision making
    if (attackerEnergy >= 30 && Math.random() < 0.3) {
      return this.generateSpecialAttack(attackerId, attacker, defender);
    }
    
    return this.generateBasicAttack(attackerId, attacker, defender);
  }

  private generateBasicAttack(attackerId: 1 | 2, attacker: Fighter, defender: Fighter): CombatAction {
    const baseDamage = attacker.stats.attack;
    const defense = defender.stats.defense;
    const critical = Math.random() < 0.2;
    
    let damage = Math.max(1, baseDamage - defense * 0.5);
    if (critical) damage *= 1.5;
    
    return {
      type: 'attack',
      attacker: attackerId,
      damage: Math.round(damage),
      energyCost: 5,
      description: `${attacker.name} delivers a ${critical ? 'critical' : 'solid'} strike!`,
      critical,
      blocked: false
    };
  }

  private generateSpecialAttack(attackerId: 1 | 2, attacker: Fighter, defender: Fighter): CombatAction {
    const baseDamage = attacker.stats.attack * 1.5;
    const defense = defender.stats.defense;
    const critical = Math.random() < 0.3;
    
    let damage = Math.max(1, baseDamage - defense * 0.3);
    if (critical) damage *= 1.3;
    
    return {
      type: 'special',
      attacker: attackerId,
      damage: Math.round(damage),
      energyCost: 30,
      description: `${attacker.name} unleashes a devastating special attack!`,
      critical,
      blocked: false
    };
  }

  private processAction(action: CombatAction): void {
    const attackerId = action.attacker;
    const defenderId = attackerId === 1 ? 2 : 1;
    
    // Apply energy cost
    if (attackerId === 1) {
      this.state.fighter1Energy = Math.max(0, this.state.fighter1Energy - action.energyCost);
    } else {
      this.state.fighter2Energy = Math.max(0, this.state.fighter2Energy - action.energyCost);
    }
    
    // Apply damage
    if (action.damage) {
      if (defenderId === 1) {
        this.state.fighter1Health = Math.max(0, this.state.fighter1Health - action.damage);
      } else {
        this.state.fighter2Health = Math.max(0, this.state.fighter2Health - action.damage);
      }
    }
  }

  public isKnockout(): boolean {
    return this.state.fighter1Health <= 0 || this.state.fighter2Health <= 0;
  }

  public getWinner(): Fighter | null {
    if (this.state.fighter1Health <= 0) return this.state.fighter2;
    if (this.state.fighter2Health <= 0) return this.state.fighter1;
    return null;
  }

  public isComplete(): boolean {
    return this.isKnockout() || this.state.round > 20;
  }
}

// WebSocket connection manager
class FightManager {
  private fights = new Map<string, {
    engine: SimpleCombatEngine;
    clients: Set<WebSocket>;
    intervalId?: number;
    countdownId?: number;
    status: 'upcoming' | 'live' | 'completed';
    isStarting: boolean;
  }>();

  private supabase = createClient(
    'https://fuifvbppttshpodpuqgf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1aWZ2YnBwdHRzaHBvZHB1cWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzcyOTUsImV4cCI6MjA2OTkxMzI5NX0.hCQ8zWWtOyuOlMlXirhM4J1H1FxxR2002hpMB5ESqhY'
  );

  async initializeFight(fightId: string): Promise<boolean> {
    try {
      // Fetch fight data from database
      const { data: fightData, error } = await this.supabase
        .from('fights')
        .select(`
          *,
          fighter1:fighters!fighter1_id(*),
          fighter2:fighters!fighter2_id(*)
        `)
        .eq('id', fightId)
        .single();

      if (error || !fightData) {
        console.error('Failed to fetch fight:', error);
        return false;
      }

      // Transform database fighters to engine format
      const fighter1: Fighter = {
        id: fightData.fighter1.id,
        name: fightData.fighter1.name,
        world: fightData.fighter1.world,
        stats: {
          attack: fightData.fighter1.attack,
          defense: fightData.fighter1.defense,
          speed: fightData.fighter1.speed,
          health: fightData.fighter1.health
        }
      };

      const fighter2: Fighter = {
        id: fightData.fighter2.id,
        name: fightData.fighter2.name,
        world: fightData.fighter2.world,
        stats: {
          attack: fightData.fighter2.attack,
          defense: fightData.fighter2.defense,
          speed: fightData.fighter2.speed,
          health: fightData.fighter2.health
        }
      };

      const engine = new SimpleCombatEngine(fighter1, fighter2);
      
      this.fights.set(fightId, {
        engine,
        clients: new Set(),
        status: fightData.status as 'upcoming' | 'live' | 'completed',
        isStarting: false
      });

      console.log(`Fight ${fightId} initialized with ${fighter1.name} vs ${fighter2.name}`);
      return true;
    } catch (error) {
      console.error('Error initializing fight:', error);
      return false;
    }
  }

  addClient(fightId: string, ws: WebSocket) {
    const fight = this.fights.get(fightId);
    if (fight) {
      fight.clients.add(ws);
      console.log(`Client connected to fight ${fightId}. Total clients: ${fight.clients.size}`);
      
      // Send current state to new client
      this.sendToClient(ws, {
        type: 'state_update',
        data: {
          state: fight.engine.getState(),
          status: fight.status
        },
        timestamp: new Date()
      });

      this.sendToClient(ws, {
        type: 'spectator_update',
        data: { count: fight.clients.size },
        timestamp: new Date()
      });

      // Broadcast spectator count update to all clients
      this.broadcastToFight(fightId, {
        type: 'spectator_update',
        data: { count: fight.clients.size },
        timestamp: new Date()
      });
    }
  }

  removeClient(fightId: string, ws: WebSocket) {
    const fight = this.fights.get(fightId);
    if (fight) {
      fight.clients.delete(ws);
      console.log(`Client disconnected from fight ${fightId}. Total clients: ${fight.clients.size}`);
      
      // Broadcast spectator count update
      this.broadcastToFight(fightId, {
        type: 'spectator_update',
        data: { count: fight.clients.size },
        timestamp: new Date()
      });
    }
  }

  startFight(fightId: string) {
    const fight = this.fights.get(fightId);
    if (!fight) {
      console.error(`Fight ${fightId} not found when trying to start`);
      return;
    }
    
    if (fight.status !== 'upcoming') {
      console.error(`Fight ${fightId} status is ${fight.status}, expected 'upcoming'`);
      return;
    }

    console.log(`Starting fight ${fightId} - current status: ${fight.status}, isStarting: ${fight.isStarting}`);
    
    fight.status = 'live';
    fight.isStarting = false;

    // Update database
    this.supabase
      .from('fights')
      .update({ 
        status: 'live', 
        started_at: new Date().toISOString() 
      })
      .eq('id', fightId)
      .then(({ error }) => {
        if (error) console.error('Failed to update fight status:', error);
      });

    // Broadcast fight start
    this.broadcastToFight(fightId, {
      type: 'fight_started',
      data: { status: 'live' },
      timestamp: new Date()
    });

    // Start combat simulation
    fight.intervalId = setInterval(() => {
      this.processFightRound(fightId);
    }, 3000); // 3 second rounds
  }

  private processFightRound(fightId: string) {
    const fight = this.fights.get(fightId);
    if (!fight || fight.status !== 'live') return;

    const actions = fight.engine.executeRound();
    
    // Broadcast each action
    for (const action of actions) {
      this.broadcastToFight(fightId, {
        type: 'action',
        data: { action },
        timestamp: new Date()
      });
    }

    // Broadcast state update
    this.broadcastToFight(fightId, {
      type: 'state_update',
      data: {
        state: fight.engine.getState(),
        status: fight.status
      },
      timestamp: new Date()
    });

    // Check if fight is complete
    if (fight.engine.isComplete()) {
      this.completeFight(fightId);
    }
  }

  private completeFight(fightId: string) {
    const fight = this.fights.get(fightId);
    if (!fight) return;

    fight.status = 'completed';
    const winner = fight.engine.getWinner();

    console.log(`Fight ${fightId} completed. Winner: ${winner?.name || 'Draw'}`);

    // Clear intervals
    if (fight.intervalId) {
      clearInterval(fight.intervalId);
      fight.intervalId = undefined;
    }
    if (fight.countdownId) {
      clearInterval(fight.countdownId);
      fight.countdownId = undefined;
    }

    // Update database
    this.supabase
      .from('fights')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString(),
        winner_id: winner?.id || null
      })
      .eq('id', fightId)
      .then(({ error }) => {
        if (error) console.error('Failed to update fight completion:', error);
      });

    // Broadcast completion
    this.broadcastToFight(fightId, {
      type: 'fight_complete',
      data: { winner },
      timestamp: new Date()
    });
  }

  private sendToClient(ws: WebSocket, event: any) {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(event));
      }
    } catch (error) {
      console.error('Error sending message to client:', error);
    }
  }

  private broadcastToFight(fightId: string, event: any) {
    const fight = this.fights.get(fightId);
    if (!fight) return;

    fight.clients.forEach(ws => {
      this.sendToClient(ws, event);
    });
  }

  handleMessage(fightId: string, ws: WebSocket, message: any) {
    const fight = this.fights.get(fightId);
    if (!fight) return;

    switch (message.type) {
      case 'start_fight':
        if (fight.status === 'upcoming' && !fight.isStarting) {
          fight.isStarting = true;
          
          // Clear any existing countdown
          if (fight.countdownId) {
            clearInterval(fight.countdownId);
          }
          
          console.log(`Starting countdown for fight ${fightId}`);
          
          // Start with a 10 second countdown
          this.broadcastToFight(fightId, {
            type: 'fight_countdown',
            data: { countdown: 10 },
            timestamp: new Date()
          });
          
          let countdown = 9;
          fight.countdownId = setInterval(() => {
            if (countdown > 0) {
              this.broadcastToFight(fightId, {
                type: 'fight_countdown',
                data: { countdown },
                timestamp: new Date()
              });
              countdown--;
            } else {
              clearInterval(fight.countdownId!);
              fight.countdownId = undefined;
              this.startFight(fightId);
            }
          }, 1000);
        }
        break;
      
      case 'place_bet':
        // Handle betting logic here
        console.log('Bet placed:', message.data);
        this.broadcastToFight(fightId, {
          type: 'bet_update',
          data: { totalBets: 0 }, // Would calculate actual total
          timestamp: new Date()
        });
        break;
      
      case 'reaction':
        // Broadcast reaction to all clients
        this.broadcastToFight(fightId, {
          type: 'reaction',
          data: message.data,
          timestamp: new Date()
        });
        break;
    }
  }
}

const fightManager = new FightManager();

serve(async (req) => {
  console.log(`Live Fight Function: ${req.method} ${req.url}`);
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  const url = new URL(req.url);
  const fightId = url.searchParams.get('fight_id');
  
  if (!fightId) {
    return new Response("Missing fight_id parameter", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  // Initialize fight if not exists
  let fightExists = false;
  try {
    fightExists = await fightManager.initializeFight(fightId);
  } catch (error) {
    console.error('Failed to initialize fight:', error);
  }
  
  if (!fightExists) {
    return new Response("Fight not found", { 
      status: 404,
      headers: corsHeaders 
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  socket.onopen = () => {
    console.log(`WebSocket connection opened for fight ${fightId}`);
    fightManager.addClient(fightId, socket);
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log(`Received message for fight ${fightId}:`, message.type);
      fightManager.handleMessage(fightId, socket, message);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };

  socket.onclose = () => {
    console.log(`WebSocket connection closed for fight ${fightId}`);
    fightManager.removeClient(fightId, socket);
  };

  socket.onerror = (error) => {
    console.error(`WebSocket error for fight ${fightId}:`, error);
    fightManager.removeClient(fightId, socket);
  };

  return response;
});