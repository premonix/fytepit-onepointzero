import { Fighter } from '@/types/fighter';

export interface CombatState {
  fighter1: Fighter;
  fighter2: Fighter;
  fighter1Health: number;
  fighter2Health: number;
  fighter1Energy: number;
  fighter2Energy: number;
  round: number;
  momentum: number; // -100 to 100, negative favors fighter2, positive favors fighter1
  environmentEffect?: EnvironmentEffect;
  activeEffects: StatusEffect[];
}

export interface StatusEffect {
  id: string;
  type: 'buff' | 'debuff' | 'damage_over_time' | 'stun';
  target: 1 | 2;
  duration: number;
  value: number;
  description: string;
}

export interface EnvironmentEffect {
  type: 'arena_boost' | 'crowd_pressure' | 'world_synergy';
  description: string;
  effect: (state: CombatState) => CombatState;
}

export interface CombatAction {
  type: 'attack' | 'special' | 'ultimate' | 'defend' | 'recover';
  attacker: 1 | 2;
  damage?: number;
  energyCost: number;
  effects?: StatusEffect[];
  description: string;
  critical: boolean;
  blocked: boolean;
}

export class CombatEngine {
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
    
    this.applyEnvironmentEffects();
  }

  public getState(): CombatState {
    return { ...this.state };
  }

  public getCombatLog(): CombatAction[] {
    return [...this.combatLog];
  }

  public executeRound(): CombatAction[] {
    const roundActions: CombatAction[] = [];
    
    // Determine turn order based on speed and momentum
    const fighter1Speed = this.getEffectiveSpeed(1);
    const fighter2Speed = this.getEffectiveSpeed(2);
    
    const turnOrder = fighter1Speed >= fighter2Speed ? [1, 2] : [2, 1];
    
    for (const attackerId of turnOrder as (1 | 2)[]) {
      const action = this.generateAction(attackerId);
      if (action) {
        this.processAction(action);
        roundActions.push(action);
        this.combatLog.push(action);
        
        // Check for knockout
        if (this.isKnockout()) {
          break;
        }
      }
    }
    
    // Process status effects and environment
    this.processStatusEffects();
    this.updateMomentum(roundActions);
    this.state.round++;
    
    return roundActions;
  }

  private generateAction(attackerId: 1 | 2): CombatAction | null {
    const attacker = attackerId === 1 ? this.state.fighter1 : this.state.fighter2;
    const defender = attackerId === 1 ? this.state.fighter2 : this.state.fighter1;
    const attackerHealth = attackerId === 1 ? this.state.fighter1Health : this.state.fighter2Health;
    const attackerEnergy = attackerId === 1 ? this.state.fighter1Energy : this.state.fighter2Energy;
    
    // AI decision making based on current state
    const healthPercent = attackerHealth / attacker.stats.health;
    const energyPercent = attackerEnergy / 100;
    
    // Determine combat style based on world and current state
    const combatStyle = this.determineCombatStyle(attacker, healthPercent, energyPercent);
    
    switch (combatStyle) {
      case 'aggressive':
        return this.generateAggressiveAction(attackerId, attacker, defender);
      case 'defensive':
        return this.generateDefensiveAction(attackerId, attacker);
      case 'opportunistic':
        return this.generateOpportunisticAction(attackerId, attacker, defender);
      case 'desperate':
        return this.generateDesperateAction(attackerId, attacker, defender);
      default:
        return this.generateBasicAttack(attackerId, attacker, defender);
    }
  }

  private determineCombatStyle(fighter: Fighter, healthPercent: number, energyPercent: number): string {
    // World-specific AI behavior
    const worldStyles = {
      'dark-arena': healthPercent < 0.3 ? 'desperate' : 'aggressive',
      'sci-fi-ai': energyPercent > 0.7 ? 'opportunistic' : 'defensive',
      'fantasy-tech': healthPercent > 0.5 && energyPercent > 0.5 ? 'aggressive' : 'defensive',
      'earth-1-0': 'opportunistic'
    };

    return worldStyles[fighter.world as keyof typeof worldStyles] || 'aggressive';
  }

  private generateAggressiveAction(attackerId: 1 | 2, attacker: Fighter, defender: Fighter): CombatAction {
    const attackerEnergy = attackerId === 1 ? this.state.fighter1Energy : this.state.fighter2Energy;
    
    // Try special move if enough energy
    if (attackerEnergy >= 30 && Math.random() < 0.4) {
      return this.generateSpecialAttack(attackerId, attacker, defender);
    }
    
    return this.generateBasicAttack(attackerId, attacker, defender);
  }

  private generateDefensiveAction(attackerId: 1 | 2, attacker: Fighter): CombatAction {
    const attackerEnergy = attackerId === 1 ? this.state.fighter1Energy : this.state.fighter2Energy;
    
    if (attackerEnergy < 20) {
      return {
        type: 'recover',
        attacker: attackerId,
        energyCost: 0,
        description: `${attacker.name} focuses on recovery, regaining energy and composure`,
        critical: false,
        blocked: false
      };
    }
    
    return {
      type: 'defend',
      attacker: attackerId,
      energyCost: 10,
      description: `${attacker.name} takes a defensive stance, preparing for the next exchange`,
      critical: false,
      blocked: false
    };
  }

  private generateOpportunisticAction(attackerId: 1 | 2, attacker: Fighter, defender: Fighter): CombatAction {
    const defenderHealth = attackerId === 1 ? this.state.fighter2Health : this.state.fighter1Health;
    const defenderHealthPercent = defenderHealth / defender.stats.health;
    
    // If opponent is weak, go for finishing move
    if (defenderHealthPercent < 0.25) {
      return this.generateSpecialAttack(attackerId, attacker, defender);
    }
    
    return this.generateBasicAttack(attackerId, attacker, defender);
  }

  private generateDesperateAction(attackerId: 1 | 2, attacker: Fighter, defender: Fighter): CombatAction {
    const attackerEnergy = attackerId === 1 ? this.state.fighter1Energy : this.state.fighter2Energy;
    
    // All-or-nothing ultimate move
    if (attackerEnergy >= 50 && Math.random() < 0.7) {
      return this.generateUltimateAttack(attackerId, attacker, defender);
    }
    
    return this.generateSpecialAttack(attackerId, attacker, defender);
  }

  private generateBasicAttack(attackerId: 1 | 2, attacker: Fighter, defender: Fighter): CombatAction {
    const baseDamage = attacker.stats.attack;
    const defense = defender.stats.defense;
    const critical = Math.random() < (attacker.stats.speed / 500); // Speed affects crit chance
    
    let damage = Math.max(1, baseDamage - defense * 0.5);
    if (critical) damage *= 1.5;
    
    // Apply momentum
    if (attackerId === 1 && this.state.momentum > 0) {
      damage *= 1 + (this.state.momentum / 200);
    } else if (attackerId === 2 && this.state.momentum < 0) {
      damage *= 1 + (Math.abs(this.state.momentum) / 200);
    }
    
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
    
    const effects: StatusEffect[] = [];
    
    // World-specific special effects
    switch (attacker.world) {
      case 'dark-arena':
        effects.push({
          id: `bleed_${Date.now()}`,
          type: 'damage_over_time',
          target: attackerId === 1 ? 2 : 1,
          duration: 3,
          value: 5,
          description: 'Bleeding'
        });
        break;
      case 'sci-fi-ai':
        effects.push({
          id: `system_overload_${Date.now()}`,
          type: 'debuff',
          target: attackerId === 1 ? 2 : 1,
          duration: 2,
          value: 20,
          description: 'System Overload - Reduced Speed'
        });
        break;
      case 'fantasy-tech':
        effects.push({
          id: `mana_burn_${Date.now()}`,
          type: 'damage_over_time',
          target: attackerId === 1 ? 2 : 1,
          duration: 2,
          value: 8,
          description: 'Mana Burn'
        });
        break;
    }
    
    return {
      type: 'special',
      attacker: attackerId,
      damage: Math.round(damage),
      energyCost: 30,
      effects,
      description: `${attacker.name} unleashes ${attacker.specialMove || 'a devastating special attack'}!`,
      critical,
      blocked: false
    };
  }

  private generateUltimateAttack(attackerId: 1 | 2, attacker: Fighter, defender: Fighter): CombatAction {
    const baseDamage = attacker.stats.attack * 2.5;
    const defense = defender.stats.defense;
    const critical = Math.random() < 0.5;
    
    let damage = Math.max(1, baseDamage - defense * 0.1);
    if (critical) damage *= 1.5;
    
    return {
      type: 'ultimate',
      attacker: attackerId,
      damage: Math.round(damage),
      energyCost: 50,
      description: `${attacker.name} channels everything into an ULTIMATE ATTACK!`,
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
    
    // Process action effects
    switch (action.type) {
      case 'attack':
      case 'special':
      case 'ultimate':
        if (action.damage) {
          this.applyDamage(defenderId, action.damage);
        }
        if (action.effects) {
          this.state.activeEffects.push(...action.effects);
        }
        break;
      case 'recover':
        if (attackerId === 1) {
          this.state.fighter1Energy = Math.min(100, this.state.fighter1Energy + 25);
        } else {
          this.state.fighter2Energy = Math.min(100, this.state.fighter2Energy + 25);
        }
        break;
      case 'defend':
        // Defending reduces incoming damage for next action
        // This would be handled in damage calculation
        break;
    }
  }

  private applyDamage(targetId: 1 | 2, damage: number): void {
    if (targetId === 1) {
      this.state.fighter1Health = Math.max(0, this.state.fighter1Health - damage);
    } else {
      this.state.fighter2Health = Math.max(0, this.state.fighter2Health - damage);
    }
  }

  private processStatusEffects(): void {
    this.state.activeEffects = this.state.activeEffects.filter(effect => {
      if (effect.type === 'damage_over_time') {
        this.applyDamage(effect.target, effect.value);
      }
      
      effect.duration--;
      return effect.duration > 0;
    });
  }

  private updateMomentum(actions: CombatAction[]): void {
    for (const action of actions) {
      if (action.type === 'attack' || action.type === 'special' || action.type === 'ultimate') {
        const momentumChange = action.critical ? 15 : 10;
        if (action.attacker === 1) {
          this.state.momentum = Math.min(100, this.state.momentum + momentumChange);
        } else {
          this.state.momentum = Math.max(-100, this.state.momentum - momentumChange);
        }
      }
    }
    
    // Momentum decay
    this.state.momentum *= 0.9;
  }

  private getEffectiveSpeed(fighterId: 1 | 2): number {
    const fighter = fighterId === 1 ? this.state.fighter1 : this.state.fighter2;
    let speed = fighter.stats.speed;
    
    // Apply status effect modifiers
    for (const effect of this.state.activeEffects) {
      if (effect.target === fighterId && effect.type === 'debuff') {
        speed *= 0.8; // Reduce speed by 20%
      }
    }
    
    return speed;
  }

  private applyEnvironmentEffects(): void {
    const fighter1World = this.state.fighter1.world;
    const fighter2World = this.state.fighter2.world;
    
    // Same world fighters get slight boost
    if (fighter1World === fighter2World) {
      this.state.environmentEffect = {
        type: 'world_synergy',
        description: `Both fighters feel at home in the ${fighter1World} environment`,
        effect: (state) => {
          // Slight stat boost for both fighters
          return state;
        }
      };
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
    return this.isKnockout() || this.state.round > 20; // Max 20 rounds
  }
}