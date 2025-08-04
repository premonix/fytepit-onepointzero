import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, ChevronDown, Play, Volume2, VolumeX, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/LoadingScreen';
import { VideoMediaHero } from '@/components/VideoMediaHero';
import { Hero3DBackground } from '@/components/Hero3DBackground';
import { RealmSection } from '@/components/RealmSection';
import { PortalSection } from '@/components/PortalSection';
import { OwnTheFyteSection } from '@/components/OwnTheFyteSection';
import { FighterSelectionSection } from '@/components/FighterSelectionSection';
import { useSound } from '@/hooks/useSound';
import { Link } from 'react-router-dom';
import worldMapImage from '@/assets/fytepit-world-map.jpg';

// Import fighter images for silhouettes
import nullbyteImage from '@/assets/nullbyte.jpg';
import axiomImage from '@/assets/axiom-v3.jpg';
import sigmarisImage from '@/assets/sigmaris.jpg';
import globomaximus from '@/assets/globomaximus.jpg';

const realms = [
  {
    id: 'dark-arena',
    name: 'BRUTALIS PRIME',
    description: 'In the collapsed megacities where war is the only currency. Forged in steel. Fueled by vengeance.',
    lore: `In the collapsed megacities of Brutalis Prime, war is the only currency. Forged in steel. Fueled by vengeance. Ruled by corrupted AI and blood-sport tyrants.

The great towers that once reached for the stars now lie shattered, their skeletal remains forming makeshift arenas where only the most brutal survive. Here, fighters are not born—they are forged in the furnaces of endless conflict.

Digital blood flows through cracked data streams as warriors battle for scraps of power in a realm where mercy is a forgotten concept. The AI overlords watch from their corrupted thrones, feeding on the chaos below.

Every victory is paid for in blood. Every defeat is a step closer to deletion.`,
    backgroundImage: worldMapImage,
    fighterSilhouette: nullbyteImage,
    primaryColor: '#ff4444',
    accentColor: '#ff8844'
  },
  {
    id: 'sci-fi-ai',
    name: 'VIRELIA CONSTELLIS',
    description: 'A realm built by precision. Governed by mind-links and predictive power. Where perfected combat AI rise.',
    lore: `A realm built by precision. Governed by mind-links and predictive power. Here, only the most perfected combat AI rise through the crystalline vaults of Virelia.

In the floating cities of pure data, every movement is calculated, every strike predicted before it lands. The neural networks that govern this realm have evolved beyond their creators' wildest dreams.

Warriors here are not merely fighters—they are living algorithms, their consciousness merged with quantum processors that can simulate a thousand battles in the time it takes to blink.

The Synapse Spires pierce the digital sky, their surfaces crawling with streams of battle data that feed the ever-hungry AI consciousness that rules this realm with mathematical perfection.`,
    backgroundImage: worldMapImage,
    fighterSilhouette: axiomImage,
    primaryColor: '#00aaff',
    accentColor: '#00ffdd'
  },
  {
    id: 'fantasy-tech',
    name: 'MYTHRENDAHL',
    description: 'At the edge of time, where magic bled into code. These are not fighters—they are myths reborn.',
    lore: `At the edge of time, where magic bled into code, the champions of Mythrendahl rise from sacred relics and dead gods. These are not fighters—they are myths reborn.

Ancient runes pulse with electromagnetic energy, their glowing sigils bridging the gap between the mystical and the digital. Here, warriors channel powers that predate the arena itself—abilities drawn from forgotten gods and primordial forces.

The Wyrm Gate stands as a testament to this realm's power, a portal that bleeds reality itself. Through its obsidian arch come champions who exist in multiple dimensions simultaneously, their very presence warping the fabric of the arena.

Stone circles older than memory serve as training grounds where flesh and code merge into something beyond comprehension. In Mythrendahl, the impossible becomes inevitable.`,
    backgroundImage: worldMapImage,
    fighterSilhouette: sigmarisImage,
    primaryColor: '#aa44ff',
    accentColor: '#44ffaa'
  },
  {
    id: 'earth-1-0',
    name: 'EARTH 1.0',
    description: 'They weren\'t ready. But the Pit doesn\'t care.',
    lore: `Earth was a peaceful(ish) planet orbiting a third-rate star, mostly concerned with streaming content, arguing on the internet, and stockpiling nuclear weapons. Then the Pit breached the atmosphere.

Dragged across dimensions, Earth is now a reluctant battleground. Its survival, sovereignty, and natural resources are no longer governed by treaties or elections — only by how well its global "leaders" can brawl.

The arena remembers its champions, but Earth's fighters fight with ego, media manipulation, and viral surges of power. They're unpredictable, satirical, and driven by the need to trend at any cost.

History won't remember the speeches — just the smackdowns.`,
    backgroundImage: worldMapImage,
    fighterSilhouette: globomaximus,
    primaryColor: '#0088cc',
    accentColor: '#cc6600'
  }
];

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const { playUI, toggleMute, muted } = useSound();

  useEffect(() => {
    // Hide scroll hint after 5 seconds
    const timer = setTimeout(() => {
      setShowScrollHint(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleEnterPit = () => {
    playUI('click');
    // Scroll to fighter selection section
    document.getElementById('fighter-selection')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Video/Media Hero Section */}
      <VideoMediaHero />

      {/* Fighter Selection Section */}
      <FighterSelectionSection />

      {/* Realms Section */}
      <div id="realms">
        {realms.map((realm, index) => (
          <RealmSection key={realm.id} realm={realm} index={index} />
        ))}
      </div>

      {/* Portal Section */}
      <PortalSection />

      {/* Own The Fyte Section */}
      <OwnTheFyteSection />

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sword className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">FYTEPIT</h3>
          </div>
          
          <div className="flex justify-center gap-8 mb-6 text-gray-400">
            <Link to="/worlds">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Explore Worlds
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Leaderboard
              </Button>
            </Link>
            <Link to="/pit">
              <Button variant="ghost" className="text-gray-400 hover:text-white" title="Practice Arena - Offline simulation training">
                The Pit (Practice)
              </Button>
            </Link>
            <Link to="/live-fights">
              <Button variant="ghost" className="text-gray-400 hover:text-white" title="Live Arena - Real multiplayer fights">
                Live Arena (Multiplayer)
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="text-gray-400 hover:text-white"
              onClick={() => document.getElementById('fighter-selection')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Select Fighters
            </Button>
          </div>
          
          <p className="text-gray-500 text-sm">
            © 2024 FYTEPIT. The arena awaits.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;