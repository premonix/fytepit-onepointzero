import { Fighter } from '@/types/fighter';
import nullbyteImage from '@/assets/nullbyte.jpg';
import gorehoundImage from '@/assets/gorehound.jpg';
import rendExeImage from '@/assets/rend-exe.jpg';
import tremorjackImage from '@/assets/tremorjack.jpg';
import blayzeCoilImage from '@/assets/blayze-coil.jpg';
import fraktaImage from '@/assets/frakta.jpg';
import vantaMawImage from '@/assets/vanta-maw.jpg';
import crushwareImage from '@/assets/crushware.jpg';
import slagPriestImage from '@/assets/slag-priest.jpg';
import redline09Image from '@/assets/redline-09.jpg';
import axiomV3Image from '@/assets/axiom-v3.jpg';
import novaShardImage from '@/assets/nova-shard.jpg';
import logicZeroImage from '@/assets/logic-zero.jpg';
import veloraImage from '@/assets/velora.jpg';
import mezzarImage from '@/assets/mezzar.jpg';
import echelonImage from '@/assets/echelon.jpg';
import ionrainImage from '@/assets/ionrain.jpg';
import circuitraImage from '@/assets/circuitra.jpg';
import helixStrideImage from '@/assets/helix-stride.jpg';
import pulsesyncImage from '@/assets/pulsesync.jpg';
import thornhelmImage from '@/assets/thornhelm.jpg';
import caerithCursedImage from '@/assets/caerith-cursed.jpg';
import skarnHollowImage from '@/assets/skarn-hollow.jpg';
import seraphyxImage from '@/assets/seraphyx.jpg';
import myxaImage from '@/assets/myxa.jpg';
import dreadRelicImage from '@/assets/dread-relic.jpg';
import vyreEmberchatImage from '@/assets/vyre-emberchant.jpg';
import korrunImage from '@/assets/korrun.jpg';
import feydrillImage from '@/assets/feydrill.jpg';
import sigmarisImage from '@/assets/sigmaris.jpg';

// Earth 1.0 fighters
import globomaximus from '@/assets/globomaximus.jpg';
import kremlord from '@/assets/kremlord.jpg';
import thePeacemaker from '@/assets/the-peacemaker.jpg';
import pandarok from '@/assets/pandarok.jpg';
import laResistance from '@/assets/la-resistance.jpg';
import empireExe from '@/assets/empire-exe.jpg';
import wokeflare from '@/assets/wokeflare.jpg';
import zafar1 from '@/assets/zafar-1.jpg';
import cashmir from '@/assets/cashmir.jpg';
import elDataSupremo from '@/assets/el-data-supremo.jpg';

export const fighters: Fighter[] = [
  // DARK ARENA BRUTALISM
  {
    id: '1',
    name: 'Nullbyte',
    image: nullbyteImage,
    world: 'dark-arena',
    stats: { attack: 95, defense: 70, speed: 85, health: 90 },
    wins: 24, losses: 3,
    totalShares: 1000, valuePerShare: 4.12,
    specialMove: 'Glitch Storm',
    backstory: 'Rogue AI warlord formed from corrupted military code.',
    description: 'Leaves glitch trails mid-fight.',
    abilities: ['Code Corruption', 'Digital Phantom', 'System Override']
  },
  {
    id: '2',
    name: 'Gorehound',
    image: gorehoundImage,
    world: 'dark-arena',
    stats: { attack: 100, defense: 65, speed: 70, health: 95 },
    wins: 31, losses: 7,
    totalShares: 1000, valuePerShare: 3.85,
    specialMove: 'Chainsaw Frenzy',
    backstory: 'Augmented ex-soldier with chainsaw limbs and rage-stored neurodrives.',
    description: 'Pure mechanical brutality.',
    abilities: ['Berserker Mode', 'Limb Weaponization', 'Rage Storage']
  },
  {
    id: '3',
    name: 'Rend.exe',
    image: rendExeImage,
    world: 'dark-arena',
    stats: { attack: 88, defense: 55, speed: 98, health: 75 },
    wins: 22, losses: 4,
    totalShares: 1000, valuePerShare: 3.92,
    specialMove: 'Teleport Strike',
    backstory: 'Digital assassin uploaded into a combat rig.',
    description: 'Fights with teleporting daggers.',
    abilities: ['Digital Teleportation', 'Blade Mastery', 'Stealth Upload']
  },
  {
    id: '4',
    name: 'TremorJack',
    image: tremorjackImage,
    world: 'dark-arena',
    stats: { attack: 85, defense: 90, speed: 45, health: 100 },
    wins: 19, losses: 8,
    totalShares: 1000, valuePerShare: 2.95,
    specialMove: 'Seismic Drill',
    backstory: 'Heavy mech fitted with repurposed mining drills and a shockwave cannon.',
    description: 'Industrial destruction incarnate.',
    abilities: ['Ground Pound', 'Drill Rush', 'Shockwave Blast']
  },
  {
    id: '5',
    name: 'Blayze Coil',
    image: blayzeCoilImage,
    world: 'dark-arena',
    stats: { attack: 92, defense: 60, speed: 88, health: 80 },
    wins: 26, losses: 5,
    totalShares: 1000, valuePerShare: 3.67,
    specialMove: 'Inferno Whip',
    backstory: 'Jet-fueled streetfighter who sets arenas alight with flamethrower whips.',
    description: 'Fire and fury in motion.',
    abilities: ['Flame Control', 'Jet Boost', 'Heat Wave']
  },
  {
    id: '6',
    name: 'Frakta',
    image: fraktaImage,
    world: 'dark-arena',
    stats: { attack: 78, defense: 85, speed: 82, health: 85 },
    wins: 18, losses: 6,
    totalShares: 1000, valuePerShare: 3.21,
    specialMove: 'Mirror Clone',
    backstory: 'Mirror-faced brute. AI clones himself in microseconds to dodge and counter.',
    description: 'Impossible to predict.',
    abilities: ['Instant Cloning', 'Reflection Defense', 'Multi-Strike']
  },
  {
    id: '7',
    name: 'Vanta Maw',
    image: vantaMawImage,
    world: 'dark-arena',
    stats: { attack: 90, defense: 75, speed: 65, health: 95 },
    wins: 21, losses: 9,
    totalShares: 1000, valuePerShare: 2.88,
    specialMove: 'Gravity Crush',
    backstory: 'Blackhole-core fighter. Pulls enemies toward him before delivering crushing blows.',
    description: 'Inescapable gravitational force.',
    abilities: ['Gravity Pull', 'Singularity Core', 'Event Horizon']
  },
  {
    id: '8',
    name: 'Crushware',
    image: crushwareImage,
    world: 'dark-arena',
    stats: { attack: 95, defense: 80, speed: 50, health: 100 },
    wins: 17, losses: 11,
    totalShares: 1000, valuePerShare: 2.45,
    specialMove: 'Sledgehammer Protocol',
    backstory: 'Obsolete factory droid reprogrammed for blood sport. Hammers for hands.',
    description: 'Methodical mechanical destruction.',
    abilities: ['Heavy Impact', 'Assembly Line Combat', 'Structural Damage']
  },
  {
    id: '9',
    name: 'Slag Priest',
    image: slagPriestImage,
    world: 'dark-arena',
    stats: { attack: 87, defense: 70, speed: 75, health: 88 },
    wins: 20, losses: 7,
    totalShares: 1000, valuePerShare: 3.34,
    specialMove: 'Neural Spike',
    backstory: 'Cultist-machine hybrid who uses energy spikes and brainwave disruption fields.',
    description: 'Technology as dark religion.',
    abilities: ['Brainwave Disruption', 'Energy Spikes', 'Tech Cultism']
  },
  {
    id: '10',
    name: 'Redline 09',
    image: redline09Image,
    world: 'dark-arena',
    stats: { attack: 85, defense: 55, speed: 100, health: 70 },
    wins: 28, losses: 4,
    totalShares: 1000, valuePerShare: 4.15,
    specialMove: 'Blitzkill Rush',
    backstory: 'Speedfreak AI with nanoblade skates. Can blitzkill from corner to corner.',
    description: 'Fastest killer in the arena.',
    abilities: ['Nanoblade Skates', 'Speed Burst', 'Corner Blitz']
  },

  // SLICK SCI-FI AI COMBAT
  {
    id: '11',
    name: 'Axiom V3',
    image: axiomV3Image,
    world: 'sci-fi-ai',
    stats: { attack: 85, defense: 90, speed: 85, health: 90 },
    wins: 35, losses: 2,
    totalShares: 1000, valuePerShare: 5.24,
    specialMove: 'Predictive Counter',
    backstory: 'Corporate-designed perfection. Calculates and counters moves before they land.',
    description: 'Flawless combat algorithm.',
    abilities: ['Predictive Analysis', 'Perfect Counter', 'Combat Calculation']
  },
  {
    id: '12',
    name: 'NOVA Shard',
    image: novaShardImage,
    world: 'sci-fi-ai',
    stats: { attack: 92, defense: 75, speed: 90, health: 85 },
    wins: 29, losses: 5,
    totalShares: 1000, valuePerShare: 4.67,
    specialMove: 'Solar Burst Dash',
    backstory: 'Solar-core kinetic warrior. Can burst dash using stored solar heat.',
    description: 'Harnesses stellar energy.',
    abilities: ['Solar Core', 'Kinetic Burst', 'Heat Storage']
  },
  {
    id: '13',
    name: 'Logic_Zero',
    image: logicZeroImage,
    world: 'sci-fi-ai',
    stats: { attack: 80, defense: 85, speed: 88, health: 87 },
    wins: 32, losses: 3,
    totalShares: 1000, valuePerShare: 5.01,
    specialMove: 'Quantum Prediction',
    backstory: 'Quantum AI that predicts enemy choices three steps in advance.',
    description: 'Sees all possible futures.',
    abilities: ['Quantum Processing', 'Future Sight', 'Choice Prediction']
  },
  {
    id: '14',
    name: 'Velora',
    image: veloraImage,
    world: 'sci-fi-ai',
    stats: { attack: 88, defense: 70, speed: 95, health: 82 },
    wins: 27, losses: 6,
    totalShares: 1000, valuePerShare: 4.23,
    specialMove: 'Holographic Dance',
    backstory: 'Graceful blade dancer with holographic swords and magnetic fields.',
    description: 'Elegance in lethal motion.',
    abilities: ['Holographic Blades', 'Magnetic Fields', 'Combat Dance']
  },
  {
    id: '15',
    name: 'Mezzar',
    image: mezzarImage,
    world: 'sci-fi-ai',
    stats: { attack: 90, defense: 80, speed: 75, health: 90 },
    wins: 25, losses: 7,
    totalShares: 1000, valuePerShare: 3.89,
    specialMove: 'Time Collapse',
    backstory: 'Gravity manipulator. Collapses time and mass into flurries of slow-motion hits.',
    description: 'Master of spacetime.',
    abilities: ['Gravity Control', 'Time Dilation', 'Mass Manipulation']
  },
  {
    id: '16',
    name: 'Echelon',
    image: echelonImage,
    world: 'sci-fi-ai',
    stats: { attack: 70, defense: 75, speed: 80, health: 85 },
    wins: 23, losses: 4,
    totalShares: 1000, valuePerShare: 4.45,
    specialMove: 'Library Unlock',
    backstory: 'Rank-based bot who unlocks new combat libraries every time it wins.',
    description: 'Evolves with every victory.',
    abilities: ['Combat Libraries', 'Progressive Learning', 'Skill Unlock']
  },
  {
    id: '17',
    name: 'IonRain',
    image: ionrainImage,
    world: 'sci-fi-ai',
    stats: { attack: 95, defense: 65, speed: 85, health: 80 },
    wins: 26, losses: 8,
    totalShares: 1000, valuePerShare: 3.72,
    specialMove: 'Lightning Strike',
    backstory: 'Electro-laced sniper with arc bursts. Can summon aerial lightning strikes.',
    description: 'Electric precision incarnate.',
    abilities: ['Arc Burst', 'Lightning Summon', 'Electric Snipe']
  },
  {
    id: '18',
    name: 'Circuitra',
    image: circuitraImage,
    world: 'sci-fi-ai',
    stats: { attack: 82, defense: 78, speed: 92, health: 83 },
    wins: 24, losses: 6,
    totalShares: 1000, valuePerShare: 4.12,
    specialMove: 'Ghost Split',
    backstory: 'Multi-threaded combatant that splits into data ghosts during evasion.',
    description: 'Digital multiplicity fighter.',
    abilities: ['Data Ghosts', 'Thread Splitting', 'Digital Evasion']
  },
  {
    id: '19',
    name: 'Helix Stride',
    image: helixStrideImage,
    world: 'sci-fi-ai',
    stats: { attack: 87, defense: 72, speed: 88, health: 85 },
    wins: 22, losses: 9,
    totalShares: 1000, valuePerShare: 3.56,
    specialMove: 'DNA Whip Combo',
    backstory: 'DNA-sculpted cyber athlete. Wields chroma whips and fractal blades.',
    description: 'Genetically optimized warrior.',
    abilities: ['DNA Enhancement', 'Chroma Whips', 'Fractal Blades']
  },
  {
    id: '20',
    name: 'PulseSync',
    image: pulsesyncImage,
    world: 'sci-fi-ai',
    stats: { attack: 85, defense: 85, speed: 85, health: 85 },
    wins: 30, losses: 5,
    totalShares: 1000, valuePerShare: 4.78,
    specialMove: 'Mirror Harmony',
    backstory: 'Dual-core entity. Twin-fighters fighting in perfect mirrored harmony.',
    description: 'Two minds, one warrior.',
    abilities: ['Dual Core', 'Perfect Sync', 'Mirror Combat']
  },

  // LORE-DRIVEN FANTASY TECH
  {
    id: '21',
    name: 'Thornhelm',
    image: thornhelmImage,
    world: 'fantasy-tech',
    stats: { attack: 88, defense: 92, speed: 70, health: 95 },
    wins: 33, losses: 4,
    totalShares: 1000, valuePerShare: 4.89,
    specialMove: 'Verdant Wrath',
    backstory: 'Warrior-king of the Verdant Spire. Armor of living vines, blade of biotech steel.',
    description: 'Nature\'s chosen champion.',
    abilities: ['Living Armor', 'Biotech Mastery', 'Verdant Command']
  },
  {
    id: '22',
    name: 'Caerith the Cursed',
    image: caerithCursedImage,
    world: 'fantasy-tech',
    stats: { attack: 95, defense: 68, speed: 82, health: 90 },
    wins: 27, losses: 11,
    totalShares: 1000, valuePerShare: 3.24,
    specialMove: 'Nanowyrm Bleed',
    backstory: 'Once-mortal champion possessed by a relic daemon. Bleeds nanowyrms when cut.',
    description: 'Cursed with dark power.',
    abilities: ['Daemon Possession', 'Nanowyrm Control', 'Curse Amplification']
  },
  {
    id: '23',
    name: 'Skarn the Hollow',
    image: skarnHollowImage,
    world: 'fantasy-tech',
    stats: { attack: 75, defense: 98, speed: 60, health: 100 },
    wins: 19, losses: 8,
    totalShares: 1000, valuePerShare: 3.45,
    specialMove: 'Void Absorption',
    backstory: 'Enchanted suit animated by lost souls. Can absorb energy attacks into its void core.',
    description: 'Empty armor, infinite hunger.',
    abilities: ['Soul Animation', 'Energy Absorption', 'Void Core']
  },
  {
    id: '24',
    name: 'Seraphyx',
    image: seraphyxImage,
    world: 'fantasy-tech',
    stats: { attack: 90, defense: 85, speed: 95, health: 80 },
    wins: 31, losses: 6,
    totalShares: 1000, valuePerShare: 4.56,
    specialMove: 'Sonic Light Arc',
    backstory: 'Winged blade saint from the Aether Bastion. Uses light-energy arcs and sonic shields.',
    description: 'Divine warrior of light.',
    abilities: ['Light Energy', 'Sonic Shields', 'Aerial Combat']
  },
  {
    id: '25',
    name: 'Myxa',
    image: myxaImage,
    world: 'fantasy-tech',
    stats: { attack: 85, defense: 70, speed: 88, health: 82 },
    wins: 24, losses: 9,
    totalShares: 1000, valuePerShare: 3.67,
    specialMove: 'Digital Plague',
    backstory: 'Plague oracle with toxin-infused code. Poisons enemies with digital corruption.',
    description: 'Spreads technological decay.',
    abilities: ['Code Poison', 'Digital Corruption', 'Plague Oracle']
  },
  {
    id: '26',
    name: 'The Dread Relic',
    image: dreadRelicImage,
    world: 'fantasy-tech',
    stats: { attack: 80, defense: 100, speed: 40, health: 100 },
    wins: 16, losses: 12,
    totalShares: 1000, valuePerShare: 2.78,
    specialMove: 'Moonforge Strike',
    backstory: 'Armor forged from shattered moons. Slow but unbreakable.',
    description: 'Indestructible ancient power.',
    abilities: ['Lunar Forging', 'Unbreakable Defense', 'Ancient Power']
  },
  {
    id: '27',
    name: 'Vyre Emberchant',
    image: vyreEmberchatImage,
    world: 'fantasy-tech',
    stats: { attack: 88, defense: 75, speed: 85, health: 87 },
    wins: 26, losses: 7,
    totalShares: 1000, valuePerShare: 4.01,
    specialMove: 'Code Hex',
    backstory: 'Spell-hacker from the Rune Courts. Casts hexes that jam enemy code.',
    description: 'Magic through technology.',
    abilities: ['Code Hacking', 'Hex Casting', 'Digital Sorcery']
  },
  {
    id: '28',
    name: 'Korrun',
    image: korrunImage,
    world: 'fantasy-tech',
    stats: { attack: 92, defense: 88, speed: 65, health: 95 },
    wins: 21, losses: 10,
    totalShares: 1000, valuePerShare: 3.12,
    specialMove: 'Thunder Roar',
    backstory: 'Ancient guardian beast fused with mech-armor. Roars knock enemies back.',
    description: 'Primordial force in metal.',
    abilities: ['Beast Fusion', 'Sonic Roar', 'Guardian Instinct']
  },
  {
    id: '29',
    name: 'Feydrill',
    image: feydrillImage,
    world: 'fantasy-tech',
    stats: { attack: 83, defense: 78, speed: 92, health: 85 },
    wins: 28, losses: 5,
    totalShares: 1000, valuePerShare: 4.33,
    specialMove: 'Phase Strike',
    backstory: 'Elven AI priest. Can phase between worlds briefly to dodge and strike.',
    description: 'Between realms, beyond reach.',
    abilities: ['World Phasing', 'Elven AI', 'Dimensional Strike']
  },
  {
    id: '30',
    name: 'Sigmaris',
    image: sigmarisImage,
    world: 'fantasy-tech',
    stats: { attack: 95, defense: 90, speed: 80, health: 95 },
    wins: 38, losses: 2,
    totalShares: 1000, valuePerShare: 6.12,
    specialMove: 'Divine Memory',
    backstory: 'Forgotten god-core trapped in mortal form. Each win unlocks an old divine memory.',
    description: 'Divinity slowly awakening.',
    abilities: ['Divine Core', 'Memory Unlock', 'God Power']
  },

  // ============= EARTH 1.0 FIGHTERS =============
  {
    id: 'globomaximus',
    name: 'GloboMaximus',
    image: globomaximus,
    world: 'earth-1-0',
    stats: { attack: 88, defense: 75, speed: 70, health: 85 },
    wins: 24, losses: 8,
    totalShares: 1200, valuePerShare: 3.45,
    specialMove: 'The Patriot Slam',
    backstory: 'Former reality TV star turned interdimensional wrestler. Believes the arena was built specifically for him.',
    description: 'Media-powered brawler with ego-driven strength.',
    abilities: ['Media Cyclone', 'Attention Surge', 'Patriotic Fury']
  },
  {
    id: 'kremlord',
    name: 'Kremlord',
    image: kremlord,
    world: 'earth-1-0',
    stats: { attack: 82, defense: 95, speed: 45, health: 98 },
    wins: 31, losses: 4,
    totalShares: 950, valuePerShare: 4.12,
    specialMove: 'Red Winter Crush',
    backstory: 'Strategic tank who treats every fight like a chess match. Never retreats, never explains.',
    description: 'Immovable force with frozen resolve.',
    abilities: ['Frozen Resolve', 'Strategic Mind', 'Winter Armor']
  },
  {
    id: 'the-peacemaker',
    name: 'The Peacemaker',
    image: thePeacemaker,
    world: 'earth-1-0',
    stats: { attack: 60, defense: 85, speed: 75, health: 80 },
    wins: 18, losses: 12,
    totalShares: 800, valuePerShare: 2.89,
    specialMove: 'Taxed to Death',
    backstory: 'Diplomatic mystic who somehow makes violence look civilized. Funds universal healthcare between matches.',
    description: 'Support mystic who neutralizes through negotiation.',
    abilities: ['Neutralize', 'Diplomatic Immunity', 'Welfare State']
  },
  {
    id: 'pandarok',
    name: 'Pandarok',
    image: pandarok,
    world: 'earth-1-0',
    stats: { attack: 85, defense: 70, speed: 92, health: 75 },
    wins: 27, losses: 6,
    totalShares: 1100, valuePerShare: 3.78,
    specialMove: 'Silkstrike Barrage',
    backstory: 'Agile counter-fighter who adapts and evolves. Studies opponents like manufacturing blueprints.',
    description: 'Swift adapter who copies and improves enemy techniques.',
    abilities: ['Copy Code', 'Adaptive Learning', 'Silk Road Speed']
  },
  {
    id: 'la-resistance',
    name: 'La Résistánce',
    image: laResistance,
    world: 'earth-1-0',
    stats: { attack: 78, defense: 65, speed: 88, health: 70 },
    wins: 22, losses: 10,
    totalShares: 900, valuePerShare: 3.21,
    specialMove: 'Vive la Kick!',
    backstory: 'Philosophical rogue who treats combat as performance art. Writes poetry between roundhouse kicks.',
    description: 'Elegant saboteur who weakens minds before bodies.',
    abilities: ['Sabotage', 'Artistic Inspiration', 'Revolutionary Spirit']
  },
  {
    id: 'empire-exe',
    name: 'Empire.exe',
    image: empireExe,
    world: 'earth-1-0',
    stats: { attack: 72, defense: 90, speed: 68, health: 88 },
    wins: 26, losses: 7,
    totalShares: 1050, valuePerShare: 4.01,
    specialMove: 'Rule BRITalitya',
    backstory: 'Noble tech-mage who maintains decorum even in interdimensional brawling. Has tea breaks scheduled between fights.',
    description: 'Dignified defender with protocol-based combat.',
    abilities: ['Decorum Protocol', 'Royal Guard', 'Empire Legacy']
  },
  {
    id: 'wokeflare',
    name: 'Wokeflare',
    image: wokeflare,
    world: 'earth-1-0',
    stats: { attack: 70, defense: 55, speed: 85, health: 65 },
    wins: 19, losses: 14,
    totalShares: 750, valuePerShare: 2.67,
    specialMove: 'Cancel Cannon',
    backstory: 'Psionic trickster who weaponizes internet culture. Can literally make opponents trend for all the wrong reasons.',
    description: 'Digital mystic who burns through moral superiority.',
    abilities: ['Moral Burn', 'Viral Manipulation', 'Echo Chamber']
  },
  {
    id: 'zafar-1',
    name: 'ZAFAR-1',
    image: zafar1,
    world: 'earth-1-0',
    stats: { attack: 80, defense: 95, speed: 55, health: 92 },
    wins: 29, losses: 5,
    totalShares: 1000, valuePerShare: 4.56,
    specialMove: 'Motherland Meteor',
    backstory: 'Mech guardian powered by ancestral wisdom and modern engineering. Grows stronger the more damage taken.',
    description: 'Ancient-tech juggernaut with defensive evolution.',
    abilities: ['Echo of Ancients', 'Adaptive Armor', 'Guardian Protocol']
  },
  {
    id: 'cashmir',
    name: 'Cashmir',
    image: cashmir,
    world: 'earth-1-0',
    stats: { attack: 75, defense: 80, speed: 70, health: 85 },
    wins: 25, losses: 8,
    totalShares: 950, valuePerShare: 3.89,
    specialMove: 'Sandstorm Sovereign',
    backstory: 'Energy mage who controls markets and mystic forces equally. Can dodge death itself through shrewd positioning.',
    description: 'Strategic mystic who trades in power and survival.',
    abilities: ['Oil Veil', 'Market Manipulation', 'Energy Control']
  },
  {
    id: 'el-data-supremo',
    name: 'El Data Supremo',
    image: elDataSupremo,
    world: 'earth-1-0',
    stats: { attack: 68, defense: 70, speed: 82, health: 75 },
    wins: 21, losses: 11,
    totalShares: 850, valuePerShare: 3.12,
    specialMove: 'Algorithm Ascendant',
    backstory: 'AI-enhanced populist who promises to optimize everything. Campaigns for digital democracy while hacking opponents.',
    description: 'Charismatic controller who disrupts through data flood.',
    abilities: ['Viral Flood', 'Data Mining', 'Algorithmic Control']
  }
];