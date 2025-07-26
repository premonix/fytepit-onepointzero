import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Users, TrendingUp, Star, Zap } from "lucide-react";
import { fighters } from "@/data/fighters";
import { Fighter } from "@/types/fighter";
import { useSound } from "@/hooks/useSound";

interface ScheduledFight {
  id: string;
  fighter1: Fighter;
  fighter2: Fighter;
  scheduledTime: string;
  status: 'upcoming' | 'live' | 'completed';
  hype: number;
  totalBets: number;
  estimatedPot: number;
  buildUp: {
    rivalryLevel: 'mild' | 'intense' | 'legendary';
    storyline: string;
    predictions: {
      fighter1Odds: number;
      fighter2Odds: number;
    };
    fanFavorite: string;
  };
}

const generateScheduledFights = (): ScheduledFight[] => {
  const fights: ScheduledFight[] = [];
  const storylines = [
    "A clash of old rivals seeking redemption",
    "New champion vs seasoned veteran showdown",
    "Battle for world supremacy in the arena", 
    "Revenge match after controversial defeat",
    "Cross-realm tournament elimination bout",
    "Undefeated streak on the line",
    "Master vs former apprentice confrontation",
    "Last chance for championship qualification"
  ];

  for (let i = 0; i < 8; i++) {
    const fighter1 = fighters[Math.floor(Math.random() * fighters.length)];
    let fighter2 = fighters[Math.floor(Math.random() * fighters.length)];
    
    while (fighter2.id === fighter1.id) {
      fighter2 = fighters[Math.floor(Math.random() * fighters.length)];
    }

    const hoursAhead = (i + 1) * 6 + Math.floor(Math.random() * 4);
    const scheduledTime = new Date(Date.now() + hoursAhead * 60 * 60 * 1000).toISOString();
    
    const totalWins1 = fighter1.wins;
    const totalWins2 = fighter2.wins;
    const baseOdds1 = totalWins2 / (totalWins1 + totalWins2);
    const baseOdds2 = totalWins1 / (totalWins1 + totalWins2);
    
    const fight: ScheduledFight = {
      id: `scheduled-${i + 1}`,
      fighter1,
      fighter2,
      scheduledTime,
      status: i === 0 ? 'live' : 'upcoming',
      hype: Math.floor(Math.random() * 40) + 60,
      totalBets: Math.floor(Math.random() * 500) + 100,
      estimatedPot: Math.floor(Math.random() * 50000) + 10000,
      buildUp: {
        rivalryLevel: ['mild', 'intense', 'legendary'][Math.floor(Math.random() * 3)] as 'mild' | 'intense' | 'legendary',
        storyline: storylines[Math.floor(Math.random() * storylines.length)],
        predictions: {
          fighter1Odds: Math.round(baseOdds1 * 100) / 100,
          fighter2Odds: Math.round(baseOdds2 * 100) / 100,
        },
        fanFavorite: Math.random() > 0.5 ? fighter1.id : fighter2.id
      }
    };

    fights.push(fight);
  }

  return fights.sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
};

const FyteCard = () => {
  const [fights, setFights] = useState<ScheduledFight[]>([]);
  const [loading, setLoading] = useState(true);
  const { playUI } = useSound();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFights(generateScheduledFights());
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatTimeUntil = (scheduledTime: string) => {
    const now = new Date();
    const fightTime = new Date(scheduledTime);
    const diffMs = fightTime.getTime() - now.getTime();
    
    if (diffMs <= 0) return "Live Now";
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const days = Math.floor(diffHours / 24);
      return `${days}d ${diffHours % 24}h`;
    }
    
    return `${diffHours}h ${diffMins}m`;
  };

  const getRivalryColor = (level: string) => {
    switch (level) {
      case 'legendary': return 'destructive';
      case 'intense': return 'default';
      case 'mild': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleBetClick = (fightId: string) => {
    playUI("click");
    // TODO: Implement betting functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          
          <div className="grid gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            FYTE CARD
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Scheduled battles and the stories that drive them to war
          </p>
        </div>

        {/* Live Fight Banner */}
        {fights.find(f => f.status === 'live') && (
          <Card className="border-destructive bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                <CardTitle className="text-destructive">LIVE NOW</CardTitle>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Scheduled Fights */}
        <div className="grid gap-6">
          {fights.map((fight) => (
            <Card key={fight.id} className={`overflow-hidden ${fight.status === 'live' ? 'border-destructive shadow-lg' : ''}`}>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <Badge variant={fight.status === 'live' ? 'destructive' : 'outline'}>
                      {fight.status === 'live' ? 'LIVE' : formatTimeUntil(fight.scheduledTime)}
                    </Badge>
                    <Badge variant={getRivalryColor(fight.buildUp.rivalryLevel)}>
                      {fight.buildUp.rivalryLevel.toUpperCase()} RIVALRY
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{fight.totalBets} bets</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>${fight.estimatedPot.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Fighters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Fighter 1 */}
                  <div className="text-center space-y-3">
                    <Avatar className="w-20 h-20 mx-auto">
                      <AvatarImage src={fight.fighter1.image} alt={fight.fighter1.name} />
                      <AvatarFallback>{fight.fighter1.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{fight.fighter1.name}</h3>
                      <p className="text-muted-foreground capitalize">{fight.fighter1.world.replace('-', ' ')}</p>
                      <div className="flex justify-center gap-1 mt-1">
                        <span className="text-sm font-medium">{fight.fighter1.wins}W</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-sm font-medium">{fight.fighter1.losses}L</span>
                      </div>
                    </div>
                    {fight.buildUp.fanFavorite === fight.fighter1.id && (
                      <div className="flex items-center justify-center gap-1 text-primary">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">Fan Favorite</span>
                      </div>
                    )}
                  </div>

                  {/* VS and Odds */}
                  <div className="text-center space-y-4">
                    <div className="text-2xl font-bold text-muted-foreground">VS</div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Betting Odds</div>
                      <div className="flex justify-center gap-4 text-sm">
                        <span className="font-medium">{fight.buildUp.predictions.fighter1Odds.toFixed(2)}</span>
                        <span className="text-muted-foreground">|</span>
                        <span className="font-medium">{fight.buildUp.predictions.fighter2Odds.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fighter 2 */}
                  <div className="text-center space-y-3">
                    <Avatar className="w-20 h-20 mx-auto">
                      <AvatarImage src={fight.fighter2.image} alt={fight.fighter2.name} />
                      <AvatarFallback>{fight.fighter2.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{fight.fighter2.name}</h3>
                      <p className="text-muted-foreground capitalize">{fight.fighter2.world.replace('-', ' ')}</p>
                      <div className="flex justify-center gap-1 mt-1">
                        <span className="text-sm font-medium">{fight.fighter2.wins}W</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-sm font-medium">{fight.fighter2.losses}L</span>
                      </div>
                    </div>
                    {fight.buildUp.fanFavorite === fight.fighter2.id && (
                      <div className="flex items-center justify-center gap-1 text-primary">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">Fan Favorite</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Storyline */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Fight Build-Up
                  </h4>
                  <p className="text-muted-foreground">{fight.buildUp.storyline}</p>
                </div>

                {/* Hype Meter */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Hype Level</span>
                    <span className="font-medium">{fight.hype}%</span>
                  </div>
                  <Progress value={fight.hype} className="h-2" />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={() => handleBetClick(fight.id)}
                  >
                    Place Bet
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                  {fight.status === 'live' && (
                    <Button variant="destructive" className="flex-1">
                      Watch Live
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FyteCard;