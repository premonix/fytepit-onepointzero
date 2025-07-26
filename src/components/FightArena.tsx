import { useState } from 'react';
import { Fighter } from '@/types/fighter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Swords, Zap, Shield, TrendingUp } from 'lucide-react';

interface FightArenaProps {
  fighter1: Fighter;
  fighter2: Fighter;
  onFightComplete?: (winner: Fighter) => void;
}

export const FightArena = ({ fighter1, fighter2, onFightComplete }: FightArenaProps) => {
  const [fightInProgress, setFightInProgress] = useState(false);
  const [fighter1Health, setFighter1Health] = useState(fighter1.stats.health);
  const [fighter2Health, setFighter2Health] = useState(fighter2.stats.health);
  const [currentTurn, setCurrentTurn] = useState<'fighter1' | 'fighter2'>('fighter1');
  const [fightLog, setFightLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<Fighter | null>(null);

  const calculateDamage = (attacker: Fighter, defender: Fighter) => {
    const baseDamage = attacker.stats.attack;
    const defense = defender.stats.defense;
    const speedBonus = Math.random() * (attacker.stats.speed / 100);
    const criticalHit = Math.random() > 0.8 ? 1.5 : 1;
    
    return Math.max(1, Math.floor((baseDamage - defense * 0.5) * (1 + speedBonus) * criticalHit));
  };

  const executeAttack = () => {
    const attacker = currentTurn === 'fighter1' ? fighter1 : fighter2;
    const defender = currentTurn === 'fighter1' ? fighter2 : fighter1;
    const damage = calculateDamage(attacker, defender);
    
    const newHealth = currentTurn === 'fighter1' 
      ? Math.max(0, fighter2Health - damage)
      : Math.max(0, fighter1Health - damage);

    if (currentTurn === 'fighter1') {
      setFighter2Health(newHealth);
    } else {
      setFighter1Health(newHealth);
    }

    const logEntry = `${attacker.name} attacks ${defender.name} for ${damage} damage!`;
    setFightLog(prev => [...prev, logEntry]);

    if (newHealth <= 0) {
      setWinner(attacker);
      setFightInProgress(false);
      onFightComplete?.(attacker);
      setFightLog(prev => [...prev, `${attacker.name} wins the fight!`]);
    } else {
      setCurrentTurn(currentTurn === 'fighter1' ? 'fighter2' : 'fighter1');
    }
  };

  const useSpecialMove = () => {
    const attacker = currentTurn === 'fighter1' ? fighter1 : fighter2;
    const defender = currentTurn === 'fighter1' ? fighter2 : fighter1;
    const damage = Math.floor(calculateDamage(attacker, defender) * 1.5);
    
    const newHealth = currentTurn === 'fighter1' 
      ? Math.max(0, fighter2Health - damage)
      : Math.max(0, fighter1Health - damage);

    if (currentTurn === 'fighter1') {
      setFighter2Health(newHealth);
    } else {
      setFighter1Health(newHealth);
    }

    const logEntry = `${attacker.name} uses ${attacker.specialMove} for ${damage} damage!`;
    setFightLog(prev => [...prev, logEntry]);

    if (newHealth <= 0) {
      setWinner(attacker);
      setFightInProgress(false);
      onFightComplete?.(attacker);
      setFightLog(prev => [...prev, `${attacker.name} wins with their special move!`]);
    } else {
      setCurrentTurn(currentTurn === 'fighter1' ? 'fighter2' : 'fighter1');
    }
  };

  const startFight = () => {
    setFightInProgress(true);
    setFighter1Health(fighter1.stats.health);
    setFighter2Health(fighter2.stats.health);
    setCurrentTurn(fighter1.stats.speed >= fighter2.stats.speed ? 'fighter1' : 'fighter2');
    setFightLog(['Fight begins!']);
    setWinner(null);
  };

  const resetFight = () => {
    setFightInProgress(false);
    setFighter1Health(fighter1.stats.health);
    setFighter2Health(fighter2.stats.health);
    setCurrentTurn('fighter1');
    setFightLog([]);
    setWinner(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-dark border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Combat Arena
          </CardTitle>
          <div className="flex items-center justify-center gap-4">
            <span className="text-lg font-semibold">{fighter1.name}</span>
            <Swords className="w-6 h-6 text-destructive" />
            <span className="text-lg font-semibold">{fighter2.name}</span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fighter 1 */}
            <div className={`space-y-4 ${currentTurn === 'fighter1' && fightInProgress ? 'ring-2 ring-primary rounded-lg p-4' : 'p-4'}`}>
              <div className="flex items-center gap-3">
                <img src={fighter1.image} alt={fighter1.name} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h3 className="font-bold text-lg">{fighter1.name}</h3>
                  {currentTurn === 'fighter1' && fightInProgress && (
                    <Badge variant="default" className="mt-1">Your Turn</Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Health</span>
                  <span>{fighter1Health}/{fighter1.stats.health}</span>
                </div>
                <Progress value={(fighter1Health / fighter1.stats.health) * 100} className="h-3" />
              </div>
            </div>

            {/* Fighter 2 */}
            <div className={`space-y-4 ${currentTurn === 'fighter2' && fightInProgress ? 'ring-2 ring-primary rounded-lg p-4' : 'p-4'}`}>
              <div className="flex items-center gap-3">
                <img src={fighter2.image} alt={fighter2.name} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h3 className="font-bold text-lg">{fighter2.name}</h3>
                  {currentTurn === 'fighter2' && fightInProgress && (
                    <Badge variant="default" className="mt-1">Your Turn</Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Health</span>
                  <span>{fighter2Health}/{fighter2.stats.health}</span>
                </div>
                <Progress value={(fighter2Health / fighter2.stats.health) * 100} className="h-3" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!fightInProgress && !winner && (
              <Button variant="fight" size="lg" onClick={startFight}>
                <Swords className="w-5 h-5 mr-2" />
                Start Fight
              </Button>
            )}
            
            {fightInProgress && (
              <div className="flex gap-2">
                <Button variant="neon" onClick={executeAttack}>
                  <Shield className="w-4 h-4 mr-2" />
                  Attack
                </Button>
                <Button variant="cyber" onClick={useSpecialMove}>
                  <Zap className="w-4 h-4 mr-2" />
                  Special Move
                </Button>
              </div>
            )}
            
            {winner && (
              <div className="text-center space-y-4">
                <div className="text-2xl font-bold text-accent">
                  🏆 {winner.name} Wins!
                </div>
                <Button variant="neon" onClick={resetFight}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  New Fight
                </Button>
              </div>
            )}
          </div>

          {/* Fight Log */}
          {fightLog.length > 0 && (
            <Card className="bg-secondary/20">
              <CardHeader>
                <CardTitle className="text-lg">Fight Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {fightLog.map((log, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {log}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};