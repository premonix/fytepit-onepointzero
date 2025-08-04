import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Sword, Settings, Trophy, Users, Volume2, VolumeX, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { worlds } from '@/data/worlds';
import { fighters } from '@/data/fighters';
import { useSound } from '@/hooks/useSound';

export const GameLikeHero = () => {
  const [selectedRealm, setSelectedRealm] = useState<string>('dark-arena');
  const [selectedFighters, setSelectedFighters] = useState<string[]>([]);
  const [gameMenuState, setGameMenuState] = useState<'main' | 'realms' | 'fighters' | 'battle'>('main');
  const { playUI, muted, toggleMute } = useSound();

  const currentWorld = worlds.find(w => w.id === selectedRealm);
  const realmFighters = fighters.filter(f => f.world === selectedRealm);

  const mainMenuOptions = [
    { id: 'battle', label: 'ENTER BATTLE', icon: Sword, action: () => setGameMenuState('fighters') },
    { id: 'realms', label: 'SELECT REALM', icon: Zap, action: () => setGameMenuState('realms') },
    { id: 'leaderboard', label: 'LEADERBOARD', icon: Trophy, action: () => {} },
    { id: 'fighters', label: 'FIGHTER CODEX', icon: Users, action: () => {} },
  ];

  const handleRealmSelect = (realmId: string) => {
    playUI('click');
    setSelectedRealm(realmId);
    setSelectedFighters([]);
    setGameMenuState('main');
  };

  const handleFighterSelect = (fighterId: string) => {
    playUI('click');
    setSelectedFighters(prev => {
      if (prev.includes(fighterId)) {
        return prev.filter(id => id !== fighterId);
      }
      if (prev.length < 2) {
        return [...prev, fighterId];
      }
      return prev;
    });
  };

  const handleStartBattle = () => {
    playUI('click');
    document.getElementById('fighter-selection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex overflow-hidden bg-gradient-to-br from-cyber-darker via-cyber-dark to-background">
      {/* Dynamic Background based on selected realm */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${currentWorld?.theme.primary}20, transparent 70%)`
        }}
      />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at 70% 30%, ${currentWorld?.theme.accent}20, transparent 70%)`
        }}
      />

      {/* HUD Header */}
      <motion.div 
        className="absolute top-0 left-0 right-0 z-30 p-6"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ background: currentWorld?.theme.gradient }}
            >
              <Sword className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">FYTEPIT</h1>
              <p className="text-sm text-muted-foreground">Combat Arena v2.0</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-muted-foreground hover:text-foreground"
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Game Interface */}
      <div className="relative z-20 w-full flex">
        {/* Left Panel - Menu/Selection */}
        <motion.div 
          className="w-1/2 p-8 flex flex-col justify-center"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {gameMenuState === 'main' && (
              <motion.div
                key="main-menu"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-6xl font-black text-foreground mb-4">FYTEPIT</h2>
                  <p className="text-xl text-muted-foreground">
                    Current Realm: <span style={{ color: currentWorld?.theme.primary }}>{currentWorld?.name}</span>
                  </p>
                </div>

                <div className="space-y-4">
                  {mainMenuOptions.map((option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        onClick={option.action}
                        onMouseEnter={() => playUI('hover')}
                        className="w-full justify-between p-6 text-xl font-bold bg-card hover:bg-secondary border-2 border-border hover:border-primary transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <option.icon className="w-6 h-6" />
                          {option.label}
                        </div>
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {gameMenuState === 'realms' && (
              <motion.div
                key="realm-selection"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-8">
                  <Button
                    variant="ghost"
                    onClick={() => setGameMenuState('main')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ← Back
                  </Button>
                  <h2 className="text-4xl font-bold text-foreground">SELECT REALM</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {worlds.map((world, index) => (
                    <motion.div
                      key={world.id}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        onClick={() => handleRealmSelect(world.id)}
                        onMouseEnter={() => playUI('hover')}
                        className={`w-full p-6 text-left transition-all duration-300 ${
                          selectedRealm === world.id 
                            ? 'bg-primary/20 border-primary' 
                            : 'bg-card hover:bg-secondary border-border'
                        } border-2`}
                      >
                        <div>
                          <h3 className="text-xl font-bold mb-2" style={{ color: world.theme.primary }}>
                            {world.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">{world.description}</p>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {gameMenuState === 'fighters' && (
              <motion.div
                key="fighter-selection"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-8">
                  <Button
                    variant="ghost"
                    onClick={() => setGameMenuState('main')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ← Back
                  </Button>
                  <h2 className="text-4xl font-bold text-foreground">SELECT FIGHTERS</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {realmFighters.slice(0, 8).map((fighter, index) => (
                    <motion.div
                      key={fighter.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Button
                        onClick={() => handleFighterSelect(fighter.id)}
                        onMouseEnter={() => playUI('hover')}
                        className={`w-full p-4 h-auto transition-all duration-300 ${
                          selectedFighters.includes(fighter.id)
                            ? 'bg-primary/20 border-primary'
                            : 'bg-card hover:bg-secondary border-border'
                        } border-2`}
                      >
                        <div className="text-left">
                          <h4 className="font-bold text-sm mb-1">{fighter.name}</h4>
                          <p className="text-xs text-muted-foreground">{fighter.wins}W-{fighter.losses}L</p>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {selectedFighters.length === 2 && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="pt-4"
                  >
                    <Button
                      onClick={handleStartBattle}
                      className="w-full py-4 text-xl font-bold bg-gradient-primary hover:opacity-90 text-white"
                    >
                      <Play className="w-6 h-6 mr-2" />
                      START BATTLE
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Panel - Preview/Display */}
        <motion.div 
          className="w-1/2 p-8 flex flex-col justify-center items-center"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="relative w-full h-96 bg-card/50 rounded-lg border-2 border-border overflow-hidden">
            {/* Realm Preview */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: currentWorld?.theme.gradient
              }}
            />
            
            {/* Content based on menu state */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center text-center">
              {gameMenuState === 'main' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-3xl font-bold mb-4" style={{ color: currentWorld?.theme.primary }}>
                    {currentWorld?.name}
                  </h3>
                  <p className="text-muted-foreground mb-6">{currentWorld?.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Power Source:</span>
                      <p className="font-semibold">{currentWorld?.powerSource}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Combat Style:</span>
                      <p className="font-semibold">{currentWorld?.combatFlavor}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {gameMenuState === 'realms' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <h3 className="text-2xl font-bold mb-4">Realm Preview</h3>
                  <p className="text-muted-foreground">Select a realm to explore its unique fighters and combat styles</p>
                </motion.div>
              )}

              {gameMenuState === 'fighters' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <h3 className="text-2xl font-bold mb-4">Battle Preview</h3>
                  {selectedFighters.length === 0 && (
                    <p className="text-muted-foreground">Select your first fighter</p>
                  )}
                  {selectedFighters.length === 1 && (
                    <p className="text-muted-foreground">Select your second fighter</p>
                  )}
                  {selectedFighters.length === 2 && (
                    <div>
                      <p className="text-primary font-bold mb-2">BATTLE READY!</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {selectedFighters.map(fighterId => {
                          const fighter = fighters.find(f => f.id === fighterId);
                          return (
                            <div key={fighterId} className="bg-card/80 p-3 rounded">
                              <p className="font-bold">{fighter?.name}</p>
                              <p className="text-xs text-muted-foreground">{fighter?.wins}W-{fighter?.losses}L</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div 
            className="mt-8 grid grid-cols-3 gap-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {[
              { label: 'Active Fighters', value: realmFighters.length },
              { label: 'Total Realms', value: worlds.length },
              { label: 'Battles Today', value: '∞' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                animate={{ 
                  textShadow: [
                    '0 0 10px rgba(255,255,255,0.3)',
                    '0 0 20px rgba(255,255,255,0.6)',
                    '0 0 10px rgba(255,255,255,0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              >
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Quick Access Footer */}
      <motion.div 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="flex items-center gap-4 bg-card/80 backdrop-blur-sm rounded-full px-6 py-3 border border-border">
          <Link to="/worlds">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Explore Worlds
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Leaderboard
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
            onClick={toggleMute}
          >
            {muted ? 'Unmute' : 'Mute'}
          </Button>
        </div>
      </motion.div>
    </section>
  );
};