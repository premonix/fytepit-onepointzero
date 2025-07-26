import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, ChevronDown, Play, Volume2, VolumeX, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/LoadingScreen';
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
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <Hero3DBackground />
        
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sword className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">FYTEPIT</h1>
                <p className="text-sm text-gray-400">Interdimensional Combat Arena</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/worlds">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-primary"
                  onMouseEnter={() => playUI('hover')}
                  onClick={() => playUI('click')}
                >
                  Explore Worlds
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary"
                onMouseEnter={() => playUI('hover')}
                onClick={() => {
                  playUI('click');
                  document.getElementById('fighter-selection')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Select Fighters
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleMute}
                onMouseEnter={() => playUI('hover')}
                className="text-white hover:text-primary"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6"
              animate={{
                textShadow: [
                  '0 0 20px #ff4444',
                  '0 0 30px #00aaff',
                  '0 0 20px #44ffaa',
                  '0 0 30px #ff4444'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                FYTEPIT
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              Own the Warrior. Bet the Blood.
            </motion.p>

            <motion.div
              className="flex gap-4 justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <Button
                onClick={handleEnterPit}
                className="bg-gradient-primary hover:opacity-90 text-white px-12 py-6 text-xl font-bold"
                onMouseEnter={() => playUI('hover')}
              >
                <Play className="w-6 h-6 mr-3" />
                Enter The Pit
              </Button>
              
              <Link to="/worlds">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white px-12 py-6 text-xl font-bold"
                  onMouseEnter={() => playUI('hover')}
                  onClick={() => playUI('click')}
                >
                  <Zap className="w-6 h-6 mr-3" />
                  Explore Worlds
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <AnimatePresence>
          {showScrollHint && (
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1, delay: 2 }}
            >
              <p className="text-gray-400 mb-2">Reveal the Realms</p>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronDown className="w-8 h-8 text-primary mx-auto" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

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
            <Button 
              variant="ghost" 
              className="text-gray-400 hover:text-white"
              onClick={() => document.getElementById('fighter-selection')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Select Fighters
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Codex
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Legal
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