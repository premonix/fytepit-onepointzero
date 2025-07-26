import { fighters } from '@/data/fighters';
import { worlds } from '@/data/worlds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, TrendingUp, DollarSign } from 'lucide-react';

export const LeaderboardStats = () => {
  // Calculate stats
  const totalFighters = fighters.length;
  const totalFights = fighters.reduce((sum, fighter) => sum + fighter.wins + fighter.losses, 0);
  const averageWinRate = fighters.reduce((sum, fighter) => {
    const winRate = fighter.wins / (fighter.wins + fighter.losses);
    return sum + winRate;
  }, 0) / fighters.length;
  
  const totalMarketValue = fighters.reduce((sum, fighter) => {
    return sum + (fighter.totalShares * fighter.valuePerShare);
  }, 0);

  // Get top performer
  const topPerformer = fighters
    .map(fighter => ({
      ...fighter,
      winRate: fighter.wins / (fighter.wins + fighter.losses)
    }))
    .sort((a, b) => b.winRate - a.winRate || b.wins - a.wins)[0];

  // Fighter distribution by world
  const worldDistribution = worlds.map(world => ({
    ...world,
    fighterCount: fighters.filter(f => f.world === world.id).length
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Fighters</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalFighters}</div>
          <p className="text-xs text-muted-foreground">
            Across {worlds.length} worlds
          </p>
          <div className="mt-2 space-y-1">
            {worldDistribution.map(world => (
              <div key={world.id} className="flex justify-between text-xs">
                <span>{world.name}:</span>
                <span>{world.fighterCount}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Fights</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalFights.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Battles completed
          </p>
          <div className="mt-2">
            <div className="text-xs text-muted-foreground">
              Avg per fighter: {Math.round(totalFights / totalFighters)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Win Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(averageWinRate * 100).toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Across all fighters
          </p>
          <div className="mt-2">
            <div className="text-xs">
              <span className="text-muted-foreground">Top: </span>
              <span className="font-medium">{topPerformer.name}</span>
              <span className="text-muted-foreground"> ({(topPerformer.winRate * 100).toFixed(1)}%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Market Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(totalMarketValue / 1000000).toFixed(1)}M</div>
          <p className="text-xs text-muted-foreground">
            Combined fighter value
          </p>
          <div className="mt-2">
            <div className="text-xs text-muted-foreground">
              Avg per fighter: ${Math.round(totalMarketValue / totalFighters).toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};