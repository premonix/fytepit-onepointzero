export interface Fighter {
  id: string;
  name: string;
  image: string;
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