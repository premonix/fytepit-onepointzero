import { Fighter } from '@/types/fighter';
import fighter1Image from '@/assets/fighter-1.jpg';
import fighter2Image from '@/assets/fighter-2.jpg';
import fighter3Image from '@/assets/fighter-3.jpg';

export const fighters: Fighter[] = [
  {
    id: '1',
    name: 'Neon Destroyer',
    image: fighter1Image,
    stats: {
      attack: 85,
      defense: 70,
      speed: 75,
      health: 90
    },
    wins: 12,
    losses: 3,
    totalShares: 1000,
    valuePerShare: 2.45,
    specialMove: 'Plasma Punch',
    backstory: 'A cybernetic warrior enhanced with military-grade implants. Known for devastating close-combat abilities.'
  },
  {
    id: '2',
    name: 'Shadow Blade',
    image: fighter2Image,
    stats: {
      attack: 90,
      defense: 60,
      speed: 95,
      health: 75
    },
    wins: 18,
    losses: 2,
    totalShares: 1000,
    valuePerShare: 3.72,
    specialMove: 'Void Strike',
    backstory: 'Elite assassin turned arena fighter. Masters stealth technology and energy weapons.'
  },
  {
    id: '3',
    name: 'Chrome Titan',
    image: fighter3Image,
    stats: {
      attack: 80,
      defense: 95,
      speed: 60,
      health: 100
    },
    wins: 15,
    losses: 5,
    totalShares: 1000,
    valuePerShare: 2.98,
    specialMove: 'Steel Storm',
    backstory: 'Experimental combat robot with adaptive armor systems. Nearly indestructible in prolonged battles.'
  }
];