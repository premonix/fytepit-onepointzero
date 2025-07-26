import { Fighter } from '@/types/fighter';
import { worlds } from '@/data/worlds';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sword, Shield, Zap, Heart, TrendingUp, Users, Eye } from 'lucide-react';
import { useSound } from '@/hooks/useSound';
import { Link } from 'react-router-dom';

interface FighterCardProps {
  fighter: Fighter;
  onInvest?: (fighterId: string) => void;
  onBet?: (fighterId: string) => void;
  showActions?: boolean;
}

export const FighterCard = ({ fighter, onInvest, onBet, showActions = true }: FighterCardProps) => {
  const winRate = (fighter.wins / (fighter.wins + fighter.losses)) * 100;
  const world = worlds.find(w => w.id === fighter.world);
  const { playUI } = useSound();

  const handleClick = (action: 'invest' | 'bet') => {
    playUI('click', world?.id);
    if (action === 'invest') {
      onInvest?.(fighter.id);
    } else {
      onBet?.(fighter.id);
    }
  };

  const handleHover = () => {
    playUI('hover');
  };

  return (
    <Card 
      className="bg-card border-border hover:shadow-glow-primary transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={handleHover}
    >
      <div className="relative">
        <img 
          src={fighter.image} 
          alt={fighter.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
            {winRate.toFixed(0)}% WR
          </Badge>
          {world && (
            <Badge variant="outline" className="bg-background/80 text-xs">
              {world.name.split(' ')[0]}
            </Badge>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card to-transparent p-4">
          <h3 className="text-xl font-bold text-foreground mb-1">{fighter.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{fighter.description}</p>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sword className="w-4 h-4 text-destructive" />
              <span className="text-sm">Attack</span>
              <span className="text-sm font-bold ml-auto">{fighter.stats.attack}</span>
            </div>
            <Progress value={fighter.stats.attack} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-neon-blue" />
              <span className="text-sm">Defense</span>
              <span className="text-sm font-bold ml-auto">{fighter.stats.defense}</span>
            </div>
            <Progress value={fighter.stats.defense} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-neon-green" />
              <span className="text-sm">Speed</span>
              <span className="text-sm font-bold ml-auto">{fighter.stats.speed}</span>
            </div>
            <Progress value={fighter.stats.speed} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-neon-pink" />
              <span className="text-sm">Health</span>
              <span className="text-sm font-bold ml-auto">{fighter.stats.health}</span>
            </div>
            <Progress value={fighter.stats.health} className="h-2" />
          </div>
        </div>

        <div className="flex justify-between items-center bg-secondary/50 rounded-lg p-3">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Record</div>
            <div className="font-bold text-accent">{fighter.wins}W - {fighter.losses}L</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Share Price</div>
            <div className="font-bold text-primary">${fighter.valuePerShare}</div>
          </div>
        </div>

        {/* Abilities */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Abilities</div>
          <div className="flex flex-wrap gap-1">
            {fighter.abilities.map(ability => (
              <Badge key={ability} variant="outline" className="text-xs px-2 py-1 bg-accent/10">
                {ability}
              </Badge>
            ))}
          </div>
        </div>

        <div className="bg-accent/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="font-semibold text-accent">Special Move</span>
          </div>
          <p className="text-sm text-foreground">{fighter.specialMove}</p>
        </div>

        {showActions && (
          <div className="flex gap-2">
            <Button 
              variant="neon" 
              className="flex-1"
              onClick={() => handleClick('invest')}
              onMouseEnter={handleHover}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Invest
            </Button>
            <Button 
              variant="cyber"
              className="flex-1"
              onClick={() => handleClick('bet')}
              onMouseEnter={handleHover}
            >
              <Users className="w-4 h-4 mr-2" />
              Bet
            </Button>
          </div>
        )}
        
        <Link to={`/fighter/${fighter.id}`}>
          <Button variant="ghost" size="sm" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            View Fighter
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};