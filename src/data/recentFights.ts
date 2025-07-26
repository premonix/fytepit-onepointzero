import { fighters } from './fighters';

export interface RecentFight {
  id: string;
  fighter1: typeof fighters[0];
  fighter2: typeof fighters[0];
  winner: typeof fighters[0];
  timestamp: string;
  duration: string;
  method: string;
  round: number;
}

// Generate mock recent fights
const generateRecentFights = (): RecentFight[] => {
  const fights: RecentFight[] = [];
  const methods = [
    'KO', 'TKO', 'Submission', 'Decision', 'Technical Decision',
    'Special Move', 'Ring Out', 'Time Limit', 'Disqualification'
  ];

  // Generate 20 recent fights
  for (let i = 0; i < 20; i++) {
    const fighter1 = fighters[Math.floor(Math.random() * fighters.length)];
    let fighter2 = fighters[Math.floor(Math.random() * fighters.length)];
    
    // Ensure different fighters
    while (fighter2.id === fighter1.id) {
      fighter2 = fighters[Math.floor(Math.random() * fighters.length)];
    }

    const winner = Math.random() > 0.5 ? fighter1 : fighter2;
    const method = methods[Math.floor(Math.random() * methods.length)];
    const round = Math.floor(Math.random() * 5) + 1;
    const duration = `${Math.floor(Math.random() * 4) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
    
    // Generate timestamp for last 7 days
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(Date.now() - (daysAgo * 24 + hoursAgo) * 60 * 60 * 1000).toISOString();

    fights.push({
      id: `fight-${i + 1}`,
      fighter1,
      fighter2,
      winner,
      timestamp,
      duration,
      method,
      round
    });
  }

  // Sort by timestamp (most recent first)
  return fights.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const recentFights = generateRecentFights();