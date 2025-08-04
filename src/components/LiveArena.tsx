import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Pause, 
  Users, 
  DollarSign, 
  Zap, 
  Heart, 
  Shield, 
  Swords,
  Eye,
  TrendingUp,
  Flame,
  Volume2
} from 'lucide-react';
import { useLiveFight } from '@/hooks/useLiveFight';
import { Fighter } from '@/types/fighter';
import { useToast } from '@/hooks/use-toast';

interface LiveArenaProps {
  fightId: string;
}

interface CountdownState {
  isActive: boolean;
  count: number;
}

export function LiveArena({ fightId }: LiveArenaProps) {
  const { fight, isConnected, isLoading, error, spectators, placeBet, reactToFight, startFight } = useLiveFight(fightId);
  const [betAmount, setBetAmount] = useState<string>('');
  const [selectedFighter, setSelectedFighter] = useState<string | null>(null);
  const [isBetting, setIsBetting] = useState(false);
  const [countdown, setCountdown] = useState<CountdownState>({ isActive: false, count: 0 });
  const { toast } = useToast();

  // Expose countdown setter globally for the useLiveFight hook
  React.useEffect(() => {
    (window as any).setCountdown = setCountdown;
    return () => {
      delete (window as any).setCountdown;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Connecting to live fight...</p>
        </div>
      </div>
    );
  }

  if (error || !fight) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold">Connection Issues</h3>
            <p className="text-muted-foreground">
              {error || 'Fight not found'}
            </p>
            <p className="text-sm text-muted-foreground">
              Running in offline mode - you can still view the fight details but won't see real-time updates.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePlaceBet = async () => {
    if (!selectedFighter || !betAmount) {
      toast({
        title: "Invalid Bet",
        description: "Please select a fighter and enter bet amount",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(betAmount);
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Bet amount must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    setIsBetting(true);
    try {
      await placeBet(selectedFighter, amount);
      toast({
        title: "Bet Placed!",
        description: `$${amount} bet placed on ${selectedFighter === fight.fighter1.id ? fight.fighter1.name : fight.fighter2.name}`,
      });
      setBetAmount('');
      setSelectedFighter(null);
    } catch (err) {
      toast({
        title: "Bet Failed",
        description: "Failed to place bet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBetting(false);
    }
  };

  const getHealthPercentage = (fighterId: string): number => {
    if (!fight.currentState) return 100;
    
    if (fighterId === fight.fighter1.id) {
      return (fight.currentState.fighter1Health / fight.fighter1.stats.health) * 100;
    } else {
      return (fight.currentState.fighter2Health / fight.fighter2.stats.health) * 100;
    }
  };

  const getEnergyPercentage = (fighterId: string): number => {
    if (!fight.currentState) return 100;
    
    if (fighterId === fight.fighter1.id) {
      return fight.currentState.fighter1Energy;
    } else {
      return fight.currentState.fighter2Energy;
    }
  };

  const getMomentumColor = (): string => {
    if (!fight.currentState) return 'hsl(var(--muted))';
    
    const momentum = fight.currentState.momentum;
    if (momentum > 20) return 'hsl(var(--primary))';
    if (momentum < -20) return 'hsl(var(--destructive))';
    return 'hsl(var(--secondary))';
  };

  const FighterCard = ({ fighter, isLeft }: { fighter: Fighter; isLeft: boolean }) => {
    const healthPercent = getHealthPercentage(fighter.id);
    const energyPercent = getEnergyPercentage(fighter.id);
    const isSelected = selectedFighter === fighter.id;
    
    return (
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        className={`relative ${isLeft ? 'order-1' : 'order-3'}`}
      >
        <Card className={`relative overflow-hidden transition-all duration-300 ${
          isSelected ? 'ring-2 ring-primary shadow-lg' : ''
        } ${fight.status === 'live' ? 'border-primary/20' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={fighter.image} 
                  alt={fighter.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-border"
                />
                {fight.status === 'live' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{fighter.name}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {fighter.world.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {/* Health Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-500" />
                  Health
                </span>
                <span className="text-xs text-muted-foreground">
                  {fight.currentState ? 
                    `${Math.round(healthPercent)}%` : 
                    `${fighter.stats.health}`
                  }
                </span>
              </div>
              <Progress 
                value={healthPercent} 
                className="h-2"
                style={{
                  '--progress-background': healthPercent > 60 ? 'hsl(var(--primary))' : 
                                         healthPercent > 30 ? 'hsl(47 96% 53%)' : 
                                         'hsl(var(--destructive))'
                } as React.CSSProperties}
              />
            </div>

            {/* Energy Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-blue-500" />
                  Energy
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(energyPercent)}%
                </span>
              </div>
              <Progress 
                value={energyPercent} 
                className="h-2"
                style={{ '--progress-background': 'hsl(220 91% 64%)' } as React.CSSProperties}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <Swords className="w-3 h-3 mx-auto mb-1 text-red-500" />
                <div className="font-semibold">{fighter.stats.attack}</div>
                <div className="text-muted-foreground">ATK</div>
              </div>
              <div className="text-center">
                <Shield className="w-3 h-3 mx-auto mb-1 text-blue-500" />
                <div className="font-semibold">{fighter.stats.defense}</div>
                <div className="text-muted-foreground">DEF</div>
              </div>
              <div className="text-center">
                <Flame className="w-3 h-3 mx-auto mb-1 text-orange-500" />
                <div className="font-semibold">{fighter.stats.speed}</div>
                <div className="text-muted-foreground">SPD</div>
              </div>
            </div>

            {fight.status === 'upcoming' && (
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={() => setSelectedFighter(fighter.id)}
              >
                {isSelected ? "Selected" : "Select to Bet"}
              </Button>
            )}

            {fight.status === 'live' && (
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={() => setSelectedFighter(fighter.id)}
              >
                {isSelected ? "Selected for Live Bet" : "Select for Live Bet"}
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Status Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant={
                fight.status === 'live' ? 'destructive' : 
                fight.status === 'upcoming' ? 'secondary' : 
                'outline'
              }>
                {fight.status === 'live' && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />}
                {fight.status.toUpperCase()}
              </Badge>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{spectators} watching</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>${fight.totalBets.toLocaleString()} in bets</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span>
                  {isConnected ? 'Live' : 'Offline Mode'}
                  {!isConnected && (
                    <span className="text-xs text-muted-foreground ml-1">
                      (Limited functionality)
                    </span>
                  )}
                </span>
              </div>
            </div>

            {fight.currentState && (
              <div className="flex items-center gap-2 text-sm">
                <span>Round {fight.currentState.round}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FighterCard fighter={fight.fighter1} isLeft={true} />
        
        {/* Center Arena */}
        <div className="order-2 space-y-4">
          {/* Momentum Indicator */}
          {fight.currentState && (
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <div className="text-sm font-medium">Momentum</div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="absolute h-full rounded-full"
                      style={{ 
                        backgroundColor: getMomentumColor(),
                        left: fight.currentState.momentum > 0 ? '50%' : `${50 + fight.currentState.momentum/2}%`,
                        width: `${Math.abs(fight.currentState.momentum)/2}%`
                      }}
                      animate={{ 
                        x: fight.currentState.momentum > 0 ? 0 : `${fight.currentState.momentum}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{fight.fighter1.name}</span>
                    <span>{fight.fighter2.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* VS Display */}
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <motion.div
                  className="text-6xl font-bold text-primary mb-4"
                animate={{ scale: fight.status === 'live' ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 2, repeat: fight.status === 'live' ? Infinity : 0 }}
              >
                VS
              </motion.div>
              
              {/* Countdown Display */}
              {countdown.isActive && (
                <motion.div
                  className="text-8xl font-bold text-destructive mb-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {countdown.count}
                </motion.div>
              )}
              
              <div className="text-lg text-muted-foreground">
                {countdown.isActive && "Fight starting..."}
                {!countdown.isActive && fight.status === 'upcoming' && fight.startTime && 
                  `Starts ${fight.startTime.toLocaleTimeString()}`
                }
                {!countdown.isActive && fight.status === 'upcoming' && !fight.startTime && 
                  "Ready to start"
                }
                {!countdown.isActive && fight.status === 'live' && "FIGHT IN PROGRESS!"}
                {!countdown.isActive && fight.status === 'completed' && fight.winner && 
                  `${fight.winner.name} Wins!`
                }
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Betting Interface - Allow betting for upcoming and live fights */}
          {(fight.status === 'upcoming' || fight.status === 'live') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  {fight.status === 'live' ? 'Live Betting' : 'Place Your Bet'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter bet amount"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="text-center"
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handlePlaceBet}
                  disabled={!selectedFighter || !betAmount || isBetting}
                >
                  {isBetting ? 'Placing Bet...' : 
                   fight.status === 'live' ? 'Place Live Bet' : 'Place Bet'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Start Fight Button */}
          {fight.status === 'upcoming' && !countdown.isActive && (
            <Card>
              <CardContent className="p-4">
                <Button 
                  className="w-full"
                  size="lg"
                  onClick={startFight}
                  disabled={!isConnected}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Fight
                </Button>
                {!isConnected && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Waiting for connection...
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Reaction Buttons */}
          {fight.status === 'live' && (
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-2">
                  {['🔥', '💪', '⚡', '🎯'].map((emoji) => (
                    <Button
                      key={emoji}
                      variant="outline"
                      size="sm"
                      onClick={() => reactToFight(emoji)}
                      className="text-lg"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <FighterCard fighter={fight.fighter2} isLeft={false} />
      </div>

      {/* Combat Log */}
      {fight.combatLog.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Live Commentary
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto space-y-2">
            <AnimatePresence>
              {fight.combatLog.slice(-10).map((action, index) => (
                <motion.div
                  key={`action-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-2 rounded text-sm ${
                    action.critical ? 'bg-destructive/10 border-l-4 border-destructive' :
                    action.type === 'special' ? 'bg-primary/10 border-l-4 border-primary' :
                    action.type === 'ultimate' ? 'bg-orange-500/10 border-l-4 border-orange-500' :
                    'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {action.critical && <Flame className="w-3 h-3 text-destructive" />}
                    {action.type === 'special' && <Zap className="w-3 h-3 text-primary" />}
                    {action.type === 'ultimate' && <TrendingUp className="w-3 h-3 text-orange-500" />}
                    <span>{action.description}</span>
                    {action.damage && (
                      <Badge variant="outline" className="ml-auto">
                        -{action.damage} HP
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      )}
    </div>
  );
}