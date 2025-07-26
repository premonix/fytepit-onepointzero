import { Fighter } from '@/types/fighter';
import { worlds } from '@/data/worlds';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Shield, Gauge, Heart, TrendingUp, DollarSign, Trophy } from 'lucide-react';

interface FighterDetailsModalProps {
  fighter: Fighter | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FighterDetailsModal = ({ fighter, isOpen, onClose }: FighterDetailsModalProps) => {
  if (!fighter) return null;

  const world = worlds.find(w => w.id === fighter.world);
  const winRate = (fighter.wins / (fighter.wins + fighter.losses)) * 100;
  const totalFights = fighter.wins + fighter.losses;
  const totalValue = fighter.totalShares * fighter.valuePerShare;

  const getStatColor = (stat: number) => {
    if (stat >= 90) return 'text-green-500';
    if (stat >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getWorldBadgeVariant = (worldType: string) => {
    switch (worldType) {
      case 'dark-arena': return 'destructive';
      case 'sci-fi-ai': return 'default';
      case 'fantasy-tech': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{fighter.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Fighter Image and Basic Info */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={fighter.image} 
                alt={fighter.name}
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={getWorldBadgeVariant(fighter.world)}>
                  {world?.name}
                </Badge>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Special Move</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-primary">{fighter.specialMove}</p>
              </CardContent>
            </Card>
          </div>

          {/* Stats and Performance */}
          <div className="space-y-4">
            {/* Combat Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Combat Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-red-500" />
                    <span>Attack</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={fighter.stats.attack} className="w-20" />
                    <span className={`font-mono ${getStatColor(fighter.stats.attack)}`}>
                      {fighter.stats.attack}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>Defense</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={fighter.stats.defense} className="w-20" />
                    <span className={`font-mono ${getStatColor(fighter.stats.defense)}`}>
                      {fighter.stats.defense}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-yellow-500" />
                    <span>Speed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={fighter.stats.speed} className="w-20" />
                    <span className={`font-mono ${getStatColor(fighter.stats.speed)}`}>
                      {fighter.stats.speed}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-green-500" />
                    <span>Health</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={fighter.stats.health} className="w-20" />
                    <span className={`font-mono ${getStatColor(fighter.stats.health)}`}>
                      {fighter.stats.health}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{fighter.wins}</div>
                    <div className="text-sm text-muted-foreground">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{fighter.losses}</div>
                    <div className="text-sm text-muted-foreground">Losses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalFights}</div>
                    <div className="text-sm text-muted-foreground">Total Fights</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{winRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Value */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Market Value
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Share Price:</span>
                  <span className="font-mono">${fighter.valuePerShare}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Shares:</span>
                  <span className="font-mono">{fighter.totalShares.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total Value:</span>
                  <span className="font-mono">${totalValue.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Backstory and Abilities */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Backstory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{fighter.backstory}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Abilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {fighter.abilities.map((ability, index) => (
                  <Badge key={index} variant="outline">
                    {ability}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">{fighter.description}</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};