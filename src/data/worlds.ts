import { World } from '@/types/fighter';

export const worlds: World[] = [
  {
    id: 'dark-arena',
    name: 'BRUTALIS PRIME',
    description: 'You don\'t just watch. You own the war.',
    powerSource: 'Raw energy, glitches',
    visualStyle: 'Dirty neon, sparks',
    combatFlavor: 'Brutal, direct',
    theme: {
      primary: 'hsl(0, 85%, 50%)', // Red
      accent: 'hsl(30, 100%, 50%)', // Orange
      gradient: 'linear-gradient(135deg, hsl(0, 85%, 50%), hsl(30, 100%, 50%))'
    }
  },
  {
    id: 'sci-fi-ai',
    name: 'VIRELIA CONSTLL',
    description: 'Own the mind. Train the warrior. Bet the future.',
    powerSource: 'Neural sync, precision',
    visualStyle: 'Clean lines, HUD overlays',
    combatFlavor: 'Fast, predictive, tactical',
    theme: {
      primary: 'hsl(220, 90%, 60%)', // Blue
      accent: 'hsl(180, 80%, 50%)', // Cyan
      gradient: 'linear-gradient(135deg, hsl(220, 90%, 60%), hsl(180, 80%, 50%))'
    }
  },
  {
    id: 'fantasy-tech',
    name: 'MYTHRENDAHL',
    description: 'The arena remembers its champions.',
    powerSource: 'Bio-sigils, relic code',
    visualStyle: 'Ancient runes + tech artifacts',
    combatFlavor: 'Elemental, cursed, otherworldly',
    theme: {
      primary: 'hsl(280, 80%, 60%)', // Purple
      accent: 'hsl(120, 70%, 50%)', // Green
      gradient: 'linear-gradient(135deg, hsl(280, 80%, 60%), hsl(120, 70%, 50%))'
    }
  },
  {
    id: 'earth-1-0',
    name: 'EARTH 1.0',
    description: 'They weren\'t ready. But the Pit doesn\'t care.',
    powerSource: 'Media hype, viral surges',
    visualStyle: 'Political propaganda + post-apocalyptic landmarks',
    combatFlavor: 'Unpredictable, ego-driven, satirical',
    theme: {
      primary: 'hsl(200, 80%, 50%)', // Earth Blue
      accent: 'hsl(25, 85%, 55%)', // Earth Orange/Brown
      gradient: 'linear-gradient(135deg, hsl(200, 80%, 50%), hsl(25, 85%, 55%))'
    }
  }
];