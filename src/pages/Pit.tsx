import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fighters } from '@/data/fighters';
import { Fighter, WorldType } from '@/types/fighter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Heart, 
  Zap, 
  Shield, 
  Swords,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  MessageCircle,
  ThumbsUp,
  Star
} from 'lucide-react';
import { useSound } from '@/hooks/useSound';

interface CombatEvent {
  id: string;
  timestamp: number;
  fighter: Fighter;
  action: string;
  damage?: number;
  type: 'attack' | 'defense' | 'special' | 'critical';
  description: string;
}

interface LiveFight {
  id: string;
  fighter1: Fighter;
  fighter2: Fighter;
  fighter1Health: number;
  fighter2Health: number;
  fighter1Energy: number;
  fighter2Energy: number;
  round: number;
  isActive: boolean;
  winner: Fighter | null;
  combatLog: CombatEvent[];
  spectators: number;
  totalBets: number;
  odds: { fighter1: number; fighter2: number };
}

const generateCombatEvent = (fighter: Fighter, opponent: Fighter, eventId: number): CombatEvent => {
  const eventTypes = ['attack', 'defense', 'special', 'critical'] as const;
  const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  
  const actions = {
    attack: [
      `${fighter.name} launches a devastating combo`,
      `${fighter.name} strikes with precision`,
      `${fighter.name} unleashes a flurry of attacks`,
      `${fighter.name} goes on the offensive`
    ],
    defense: [
      `${fighter.name} blocks ${opponent.name}'s attack`,
      `${fighter.name} evades with superior agility`,
      `${fighter.name} counters ${opponent.name}'s move`,
      `${fighter.name} deflects the incoming strike`
    ],
    special: [
      `${fighter.name} activates ${fighter.specialMove}!`,
      `${fighter.name} channels their special ability`,
      `${fighter.name} enters overdrive mode`,
      `${fighter.name} unleashes their signature move`
    ],
    critical: [
      `CRITICAL HIT! ${fighter.name} lands a devastating blow`,
      `${fighter.name} finds the perfect opening`,
      `${fighter.name} strikes a vital point`,
      `${fighter.name} delivers a crushing critical strike`
    ]
  };

  const actionList = actions[type];
  const action = actionList[Math.floor(Math.random() * actionList.length)];
  const damage = type === 'critical' ? Math.floor(Math.random() * 25) + 15 
                : type === 'special' ? Math.floor(Math.random() * 20) + 10
                : type === 'attack' ? Math.floor(Math.random() * 15) + 5
                : 0;

  return {
    id: `event-${eventId}`,
    timestamp: Date.now(),
    fighter,
    action,
    damage,
    type,
    description: action
  };
};

const getRealmTheme = (world: WorldType) => {
  const themes = {
    'dark-arena': {
      primary: 'from-red-900 to-red-600',
      accent: 'bg-red-500',
      glow: 'shadow-red-500/30',
      bg: 'bg-gradient-to-br from-gray-900 via-red-900/20 to-black',
      name: 'BRUTALIS PRIME'
    },
    'sci-fi-ai': {
      primary: 'from-cyan-900 to-cyan-400',
      accent: 'bg-cyan-400',
      glow: 'shadow-cyan-400/30',
      bg: 'bg-gradient-to-br from-gray-900 via-cyan-900/20 to-black',
      name: 'VIRELIA CONSTELLIS'
    },
    'fantasy-tech': {
      primary: 'from-emerald-900 to-emerald-400',
      accent: 'bg-emerald-400',
      glow: 'shadow-emerald-400/30',
      bg: 'bg-gradient-to-br from-gray-900 via-emerald-900/20 to-black',
      name: 'MYTHRENDAHL'
    },
    'earth-1-0': {
      primary: 'from-blue-900 to-orange-600',
      accent: 'bg-blue-500',
      glow: 'shadow-blue-500/30',
      bg: 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-black',
      name: 'EARTH 1.0'
    }
  };
  return themes[world];
};

const Pit = () => {
  const [liveFight, setLiveFight] = useState<LiveFight | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [selectedBet, setSelectedBet] = useState<{ fighter: Fighter; amount: number } | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const combatLogRef = useRef<HTMLDivElement>(null);
  const { playUI } = useSound();

  // Initialize a random fight
  useEffect(() => {
    const initializeFight = () => {
      const fighter1 = fighters[Math.floor(Math.random() * fighters.length)];
      let fighter2 = fighters[Math.floor(Math.random() * fighters.length)];
      
      while (fighter2.id === fighter1.id) {
        fighter2 = fighters[Math.floor(Math.random() * fighters.length)];
      }

      const totalWins1 = fighter1.wins;
      const totalWins2 = fighter2.wins;
      const baseOdds1 = totalWins2 / (totalWins1 + totalWins2);
      const baseOdds2 = totalWins1 / (totalWins1 + totalWins2);

      setLiveFight({
        id: `fight-${Date.now()}`,
        fighter1,
        fighter2,
        fighter1Health: 100,
        fighter2Health: 100,
        fighter1Energy: 100,
        fighter2Energy: 100,
        round: 1,
        isActive: false,
        winner: null,
        combatLog: [],
        spectators: Math.floor(Math.random() * 5000) + 1000,
        totalBets: Math.floor(Math.random() * 100000) + 25000,
        odds: { 
          fighter1: Math.round(baseOdds1 * 100) / 100, 
          fighter2: Math.round(baseOdds2 * 100) / 100 
        }
      });
    };

    initializeFight();
  }, []);

  // Combat simulation
  useEffect(() => {
    if (!isSimulating || !liveFight || liveFight.winner) return;

    const interval = setInterval(() => {
      setLiveFight(prev => {
        if (!prev) return prev;

        const activeFighter = Math.random() > 0.5 ? prev.fighter1 : prev.fighter2;
        const opponent = activeFighter.id === prev.fighter1.id ? prev.fighter2 : prev.fighter1;
        
        const newEvent = generateCombatEvent(activeFighter, opponent, prev.combatLog.length + 1);
        
        let newHealth1 = prev.fighter1Health;
        let newHealth2 = prev.fighter2Health;
        let newEnergy1 = prev.fighter1Energy;
        let newEnergy2 = prev.fighter2Energy;

        // Apply damage and energy changes
        if (newEvent.damage && newEvent.damage > 0) {
          if (activeFighter.id === prev.fighter1.id) {
            newHealth2 = Math.max(0, newHealth2 - newEvent.damage);
            newEnergy1 = Math.max(0, newEnergy1 - (newEvent.type === 'special' ? 20 : 5));
          } else {
            newHealth1 = Math.max(0, newHealth1 - newEvent.damage);
            newEnergy2 = Math.max(0, newEnergy2 - (newEvent.type === 'special' ? 20 : 5));
          }
        }

        // Regenerate energy slowly
        newEnergy1 = Math.min(100, newEnergy1 + 2);
        newEnergy2 = Math.min(100, newEnergy2 + 2);

        // Check for winner
        const winner = newHealth1 <= 0 ? prev.fighter2 
                     : newHealth2 <= 0 ? prev.fighter1 
                     : null;

        return {
          ...prev,
          fighter1Health: newHealth1,
          fighter2Health: newHealth2,
          fighter1Energy: newEnergy1,
          fighter2Energy: newEnergy2,
          winner,
          combatLog: [...prev.combatLog, newEvent].slice(-10), // Keep last 10 events
          isActive: !winner
        };
      });
    }, 2000); // Event every 2 seconds

    return () => clearInterval(interval);
  }, [isSimulating, liveFight?.winner]);

  // Auto-scroll combat log
  useEffect(() => {
    if (combatLogRef.current) {
      combatLogRef.current.scrollTop = combatLogRef.current.scrollHeight;
    }
  }, [liveFight?.combatLog]);

  const handlePlayPause = () => {
    if (!liveFight?.winner) {
      setIsSimulating(!isSimulating);
      playUI("click");
    }
  };

  const handleNextMove = () => {
    if (!liveFight || liveFight.winner) return;
    
    const activeFighter = Math.random() > 0.5 ? liveFight.fighter1 : liveFight.fighter2;
    const opponent = activeFighter.id === liveFight.fighter1.id ? liveFight.fighter2 : liveFight.fighter1;
    
    const newEvent = generateCombatEvent(activeFighter, opponent, liveFight.combatLog.length + 1);
    
    setLiveFight(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        combatLog: [...prev.combatLog, newEvent].slice(-10)
      };
    });
    playUI("click");
  };

  const handleBet = (fighter: Fighter) => {
    setSelectedBet({ fighter, amount: betAmount });
    playUI("click");
  };

  const handleReaction = (type: string) => {
    playUI("click");
    // Placeholder for reaction system
  };

  if (!liveFight) return <div className="min-h-screen bg-black" />;

  const theme = getRealmTheme(liveFight.fighter1.world);
  const potentialPayout = selectedBet ? 
    Math.round(selectedBet.amount * (selectedBet.fighter.id === liveFight.fighter1.id ? liveFight.odds.fighter1 : liveFight.odds.fighter2) * 100) / 100 : 0;

  return (
    <div className={`min-h-screen ${theme.bg} font-rajdhani`}>
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${liveFight.isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
              <h1 className="text-2xl font-orbitron font-bold text-white">
                THE PIT
              </h1>
              <Badge variant="secondary" className="font-orbitron">
                {theme.name}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="h-4 w-4" />
                <span>{liveFight.spectators.toLocaleString()} watching</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
              >
                {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Context Info */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-lg mx-4 mb-6 p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Play className="w-3 h-3 text-primary" />
          </div>
          <div>
            <h3 className="text-white font-orbitron font-bold text-sm mb-1">Training Arena</h3>
            <p className="text-gray-300 text-xs leading-relaxed">
              The Pit is your <span className="text-primary font-semibold">offline practice arena</span>. Test combat strategies, experiment with fighter matchups, and practice betting with simulated fights. All battles here use local AI - perfect for training before entering real multiplayer competitions.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Arena View */}
          <div className="lg:col-span-2 space-y-6">
            {/* Arena */}
            <Card className="bg-black/40 border-gray-800 overflow-hidden">
              <div className={`h-96 relative bg-gradient-to-b ${theme.primary} flex items-center justify-center`}>
                {/* Arena Floor */}
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                <div className={`absolute inset-0 ${theme.glow} shadow-2xl`} />
                
                {/* Fighters */}
                <div className="flex items-center justify-between w-full px-12">
                  <motion.div 
                    className="text-center"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-white/20">
                      <AvatarImage src={liveFight.fighter1.image} />
                      <AvatarFallback>{liveFight.fighter1.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-orbitron font-bold text-white text-lg">
                      {liveFight.fighter1.name}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <Heart className="h-3 w-3 text-red-400" />
                        <Progress value={liveFight.fighter1Health} className="w-20 h-2" />
                        <span className="text-xs text-white">{liveFight.fighter1Health}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-blue-400" />
                        <Progress value={liveFight.fighter1Energy} className="w-20 h-2" />
                        <span className="text-xs text-white">{liveFight.fighter1Energy}%</span>
                      </div>
                    </div>
                  </motion.div>

                  <div className="text-center">
                    <motion.div
                      animate={{ scale: isSimulating ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 0.5, repeat: isSimulating ? Infinity : 0 }}
                      className="text-4xl font-orbitron font-black text-white mb-4"
                    >
                      VS
                    </motion.div>
                    <Badge variant={liveFight.isActive ? "destructive" : "secondary"}>
                      ROUND {liveFight.round}
                    </Badge>
                  </div>

                  <motion.div 
                    className="text-center"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-white/20">
                      <AvatarImage src={liveFight.fighter2.image} />
                      <AvatarFallback>{liveFight.fighter2.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-orbitron font-bold text-white text-lg">
                      {liveFight.fighter2.name}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <Heart className="h-3 w-3 text-red-400" />
                        <Progress value={liveFight.fighter2Health} className="w-20 h-2" />
                        <span className="text-xs text-white">{liveFight.fighter2Health}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-blue-400" />
                        <Progress value={liveFight.fighter2Energy} className="w-20 h-2" />
                        <span className="text-xs text-white">{liveFight.fighter2Energy}%</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Winner Overlay */}
                <AnimatePresence>
                  {liveFight.winner && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-black/80 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <h2 className="text-6xl font-orbitron font-black text-yellow-400 mb-4">
                          VICTORY!
                        </h2>
                        <h3 className="text-3xl font-bold text-white">
                          {liveFight.winner.name}
                        </h3>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {/* Arena Controls */}
            <Card className="bg-black/40 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePlayPause}
                      disabled={!!liveFight.winner}
                      className="text-white hover:bg-white/10"
                    >
                      {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNextMove}
                      disabled={!!liveFight.winner}
                      className="text-white hover:bg-white/10"
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <span className="text-sm text-gray-400">
                      {isSimulating ? 'Simulation Running' : 'Simulation Paused'}
                    </span>
                  </div>

                  {/* Live Reactions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction('cheer')}
                      className="text-white hover:bg-white/10"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction('boost')}
                      className="text-white hover:bg-white/10"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction('react')}
                      className="text-white hover:bg-white/10"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fighter Stats & Betting */}
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white font-orbitron">BETTING ODDS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <h4 className="font-semibold text-white text-sm mb-2">{liveFight.fighter1.name}</h4>
                    <div className="text-2xl font-bold text-green-400 mb-2">
                      {liveFight.odds.fighter1.toFixed(2)}x
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleBet(liveFight.fighter1)}
                      className="w-full"
                      disabled={!!liveFight.winner}
                    >
                      Bet
                    </Button>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <h4 className="font-semibold text-white text-sm mb-2">{liveFight.fighter2.name}</h4>
                    <div className="text-2xl font-bold text-green-400 mb-2">
                      {liveFight.odds.fighter2.toFixed(2)}x
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleBet(liveFight.fighter2)}
                      className="w-full"
                      disabled={!!liveFight.winner}
                    >
                      Bet
                    </Button>
                  </div>
                </div>

                {selectedBet && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                  >
                    <div className="text-sm text-gray-300 mb-2">
                      Betting on: <span className="text-white font-semibold">{selectedBet.fighter.name}</span>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">
                      Amount: <span className="text-green-400">${selectedBet.amount}</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      Potential Payout: <span className="text-green-400 font-semibold">${potentialPayout}</span>
                    </div>
                  </motion.div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Total Pot: ${liveFight.totalBets.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Combat Log */}
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white font-orbitron">COMBAT LOG</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  ref={combatLogRef}
                  className="h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600"
                >
                  <AnimatePresence>
                    {liveFight.combatLog.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={`p-2 rounded text-xs ${
                          event.type === 'critical' ? 'bg-red-500/20 text-red-300' :
                          event.type === 'special' ? 'bg-purple-500/20 text-purple-300' :
                          event.type === 'attack' ? 'bg-orange-500/20 text-orange-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {event.type === 'critical' && <Target className="h-3 w-3" />}
                          {event.type === 'special' && <Zap className="h-3 w-3" />}
                          {event.type === 'attack' && <Swords className="h-3 w-3" />}
                          {event.type === 'defense' && <Shield className="h-3 w-3" />}
                          <span>{event.description}</span>
                        </div>
                        {event.damage && event.damage > 0 && (
                          <div className="text-right font-semibold">
                            -{event.damage} HP
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pit;