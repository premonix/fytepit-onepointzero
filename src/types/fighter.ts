export type WorldType = 'dark-arena' | 'sci-fi-ai' | 'fantasy-tech' | 'earth-1-0';

export interface World {
  id: WorldType;
  name: string;
  description: string;
  powerSource: string;
  visualStyle: string;
  combatFlavor: string;
  theme: {
    primary: string;
    accent: string;
    gradient: string;
  };
}

export interface Fighter {
  id: string;
  name: string;
  image: string;
  world: WorldType;
  stats: {
    attack: number;
    defense: number;
    speed: number;
    health: number;
  };
  wins: number;
  losses: number;
  totalShares: number;
  valuePerShare: number;
  specialMove: string;
  backstory: string;
  description: string;
  abilities: string[];
}

export interface Ownership {
  fighterId: string;
  shares: number;
  totalInvestment: number;
}

export interface Bet {
  id: string;
  fighterId: string;
  amount: number;
  odds: number;
  potentialPayout: number;
}

export interface Fight {
  id: string;
  fighter1: Fighter;
  fighter2: Fighter;
  status: 'upcoming' | 'in-progress' | 'completed';
  winner?: string;
  bets: Bet[];
  totalPot: number;
}