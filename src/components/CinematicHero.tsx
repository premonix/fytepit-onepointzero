import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Zap, ChevronDown, Sword, VolumeX, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Hero3DBackground } from '@/components/Hero3DBackground';
import { useSound } from '@/hooks/useSound';

export const CinematicHero = () => {
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [currentPowerText, setCurrentPowerText] = useState(0);
  const { playUI, muted, toggleMute } = useSound();

  const powerTexts = [
    "OWN THE WARRIOR",
    "BET THE BLOOD", 
    "CLAIM THE GLORY",
    "RULE THE PIT"
  ];

  const handleEnterPit = () => {
    playUI('click');
    document.getElementById('fighter-selection')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowScrollHint(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPowerText((prev) => (prev + 1) % powerTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Enhanced 3D Background */}
      <Hero3DBackground />
      
      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-blue-900/10" />
      
      {/* Particle overlay effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,68,68,0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,170,255,0.1)_0%,transparent_50%)]" />
      
      {/* Dynamic scanlines */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
        animate={{ 
          backgroundPosition: ['0px 0px', '0px 100px'] 
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
      />

      {/* Header */}
      <motion.div 
        className="absolute top-0 left-0 right-0 z-30"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center"
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(255,68,68,0.5)',
                    '0 0 30px rgba(0,170,255,0.5)',
                    '0 0 20px rgba(255,68,68,0.5)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sword className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">FYTEPIT</h1>
                <p className="text-sm text-gray-400">Interdimensional Combat Arena</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Cinematic Hero Content */}
      <div className="relative z-20 text-center px-4">
        {/* Main Title with Dramatic Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <motion.h1
            className="text-7xl md:text-9xl lg:text-[12rem] font-black mb-8 leading-none"
            style={{
              background: 'linear-gradient(45deg, #ff4444, #00aaff, #44ffaa, #ff4444)',
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              textShadow: [
                '0 0 30px rgba(255,68,68,0.8)',
                '0 0 50px rgba(0,170,255,0.8)',
                '0 0 30px rgba(68,255,170,0.8)',
                '0 0 50px rgba(255,68,68,0.8)'
              ]
            }}
            transition={{
              backgroundPosition: { duration: 8, repeat: Infinity, ease: 'linear' },
              textShadow: { duration: 4, repeat: Infinity }
            }}
          >
            FYTEPIT
          </motion.h1>
        </motion.div>

        {/* Dynamic Power Text */}
        <motion.div
          className="h-20 mb-8 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentPowerText}
              className="text-2xl md:text-4xl font-bold text-white"
              initial={{ y: 50, opacity: 0, rotateX: 90 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={{ y: -50, opacity: 0, rotateX: -90 }}
              transition={{ duration: 0.8 }}
              style={{
                textShadow: '0 0 20px rgba(255,255,255,0.5)'
              }}
            >
              {powerTexts[currentPowerText]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
        >
          Step into the ultimate interdimensional arena where champions are forged in blood and glory. 
          <br className="hidden md:block" />
          <span className="text-primary font-semibold">Your warrior. Your stakes. Your destiny.</span>
        </motion.p>

        {/* Enhanced Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,68,68,0.6)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleEnterPit}
              className="bg-gradient-primary hover:opacity-90 text-white px-16 py-8 text-2xl font-bold rounded-full border-2 border-transparent hover:border-white/20 transition-all duration-300"
              onMouseEnter={() => playUI('hover')}
            >
              <Play className="w-8 h-8 mr-4" />
              ENTER THE PIT
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,170,255,0.6)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/worlds">
              <Button
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-16 py-8 text-2xl font-bold rounded-full transition-all duration-300"
                onMouseEnter={() => playUI('hover')}
                onClick={() => playUI('click')}
              >
                <Zap className="w-8 h-8 mr-4" />
                EXPLORE REALMS
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Arena Mode Context */}
        <motion.div
          className="mt-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.0 }}
        >
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-white font-orbitron font-bold">THE PIT</span>
              </div>
              <p className="text-gray-300 text-xs">Offline practice arena for training and experimentation</p>
            </div>
            <div className="bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-white font-orbitron font-bold">LIVE ARENA</span>
              </div>
              <p className="text-gray-300 text-xs">Real multiplayer fights with live streaming and rewards</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Ticker */}
        <motion.div
          className="mt-16 flex justify-center gap-12 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.8 }}
        >
          {[
            { label: 'Active Fighters', value: '50+' },
            { label: 'Realms', value: '4' },
            { label: 'Total Battles', value: '∞' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-white"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(255,255,255,0.3)',
                  '0 0 20px rgba(255,255,255,0.6)',
                  '0 0 10px rgba(255,255,255,0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
            >
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1, delay: 3.5 }}
          >
            <motion.p 
              className="text-gray-300 mb-4 text-lg font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Descend into the Arena
            </motion.p>
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <ChevronDown className="w-12 h-12 text-primary mx-auto" />
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(255,68,68,0.7)',
                    '0 0 0 20px rgba(255,68,68,0)',
                    '0 0 0 0 rgba(255,68,68,0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};