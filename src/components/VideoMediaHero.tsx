import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Sword, ChevronLeft, ChevronRight, Zap, Users, Trophy, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { worlds } from '@/data/worlds';
import { fighters } from '@/data/fighters';
import { useSound } from '@/hooks/useSound';

export const VideoMediaHero = () => {
  const [currentRealmIndex, setCurrentRealmIndex] = useState(0);
  const [currentFighterIndex, setCurrentFighterIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const { playUI, muted, toggleMute } = useSound();

  const currentRealm = worlds[currentRealmIndex];
  const realmFighters = fighters.filter(f => f.world === currentRealm.id);
  const featuredFighters = fighters.slice(0, 8); // Top 8 fighters for showcase

  // Auto-advance realm showcase
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentRealmIndex(prev => (prev + 1) % worlds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  // Auto-advance fighter showcase
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentFighterIndex(prev => (prev + 1) % featuredFighters.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [autoPlay, featuredFighters.length]);

  const nextRealm = () => {
    playUI('click');
    setAutoPlay(false);
    setCurrentRealmIndex(prev => (prev + 1) % worlds.length);
  };

  const prevRealm = () => {
    playUI('click');
    setAutoPlay(false);
    setCurrentRealmIndex(prev => (prev - 1 + worlds.length) % worlds.length);
  };

  const nextFighter = () => {
    playUI('click');
    setAutoPlay(false);
    setCurrentFighterIndex(prev => (prev + 1) % featuredFighters.length);
  };

  const prevFighter = () => {
    playUI('click');
    setAutoPlay(false);
    setCurrentFighterIndex(prev => (prev - 1 + featuredFighters.length) % featuredFighters.length);
  };

  const handleEnterPit = () => {
    playUI('click');
    document.getElementById('fighter-selection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      {/* Dynamic Video-like Background */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRealmIndex}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?auto=format&fit=crop&w=1920&h=1080)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </AnimatePresence>
        
        {/* Realm-specific overlay */}
        <div 
          className="absolute inset-0 opacity-70"
          style={{
            background: `linear-gradient(45deg, ${currentRealm.theme.primary}40, ${currentRealm.theme.accent}40)`
          }}
        />
        
        {/* Cinematic bars */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Header */}
      <motion.div 
        className="relative z-30 p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ background: currentRealm.theme.gradient }}
            >
              <Sword className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">FYTEPIT</h1>
              <p className="text-sm text-gray-300">Interdimensional Combat Arena</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-white/70 hover:text-white"
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setAutoPlay(!autoPlay)}
              className="text-white/70 hover:text-white"
            >
              {autoPlay ? 'Pause' : 'Play'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="relative z-20 flex-1 flex">
        {/* Left: Realm Showcase */}
        <motion.div 
          className="w-1/2 p-8 flex flex-col justify-center"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="relative">
            {/* Realm Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevRealm}
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <div className="flex gap-2">
                {worlds.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentRealmIndex ? 'bg-white w-8' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextRealm}
                className="text-white hover:bg-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Realm Info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRealmIndex}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h2 
                  className="text-5xl font-black mb-4"
                  style={{ color: currentRealm.theme.primary }}
                >
                  {currentRealm.name}
                </h2>
                <p className="text-xl text-white/90 mb-6 max-w-md mx-auto leading-relaxed">
                  {currentRealm.description}
                </p>
                
                {/* Realm Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/50 rounded-lg p-4 border border-white/20">
                    <p className="text-white/70 text-sm">Power Source</p>
                    <p className="text-white font-semibold">{currentRealm.powerSource}</p>
                  </div>
                  <div className="bg-black/50 rounded-lg p-4 border border-white/20">
                    <p className="text-white/70 text-sm">Combat Style</p>
                    <p className="text-white font-semibold">{currentRealm.combatFlavor}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleEnterPit}
                    className="px-8 py-3 text-lg font-bold text-white border-2 border-white/30 hover:bg-white/20"
                    style={{ background: currentRealm.theme.gradient }}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    ENTER REALM
                  </Button>
                  
                  <Link to="/worlds">
                    <Button
                      variant="outline"
                      className="px-8 py-3 text-lg font-bold border-2 border-white/50 text-white hover:bg-white/20"
                      onClick={() => playUI('click')}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      EXPLORE
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right: Fighter Showcase */}
        <motion.div 
          className="w-1/2 p-8 flex flex-col justify-center"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="relative h-full">
            {/* Fighter Carousel Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">FEATURED FIGHTERS</h3>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevFighter}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextFighter}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Main Fighter Display */}
            <div className="relative h-96 mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFighterIndex}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <div className="relative h-full bg-black/40 rounded-lg overflow-hidden border-2 border-white/20">
                    {/* Fighter Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${featuredFighters[currentFighterIndex]?.image})`
                      }}
                    />
                    
                    {/* Fighter Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h4 className="text-3xl font-bold text-white mb-2">
                        {featuredFighters[currentFighterIndex]?.name}
                      </h4>
                      <p className="text-white/80 mb-4 line-clamp-2">
                        {featuredFighters[currentFighterIndex]?.description}
                      </p>
                      
                      {/* Fighter Stats */}
                      <div className="flex gap-4">
                        <div className="bg-black/60 rounded px-3 py-1">
                          <span className="text-green-400 font-bold">
                            {featuredFighters[currentFighterIndex]?.wins}W
                          </span>
                        </div>
                        <div className="bg-black/60 rounded px-3 py-1">
                          <span className="text-red-400 font-bold">
                            {featuredFighters[currentFighterIndex]?.losses}L
                          </span>
                        </div>
                        <div className="bg-black/60 rounded px-3 py-1">
                          <span className="text-blue-400 font-bold">
                            {featuredFighters[currentFighterIndex]?.stats.attack} ATK
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Fighter Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {featuredFighters.slice(0, 4).map((fighter, index) => (
                <motion.div
                  key={fighter.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative h-16 rounded cursor-pointer transition-all duration-300 overflow-hidden border-2 ${
                    index === currentFighterIndex % 4 
                      ? 'border-white scale-105' 
                      : 'border-white/30 hover:border-white/60'
                  }`}
                  onClick={() => {
                    setCurrentFighterIndex(index);
                    setAutoPlay(false);
                    playUI('hover');
                  }}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${fighter.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-1 left-1 right-1">
                    <p className="text-white text-xs font-bold truncate">
                      {fighter.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Stats Bar */}
      <motion.div 
        className="relative z-20 bg-black/60 backdrop-blur-sm border-t border-white/20 p-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <div className="flex justify-center gap-12">
          {[
            { icon: Users, label: 'Active Fighters', value: fighters.length },
            { icon: Zap, label: 'Realms', value: worlds.length },
            { icon: Trophy, label: 'Battles Today', value: '∞' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="flex items-center gap-3 text-white"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(255,255,255,0.3)',
                  '0 0 20px rgba(255,255,255,0.6)',
                  '0 0 10px rgba(255,255,255,0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
            >
              <stat.icon className="w-6 h-6 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};