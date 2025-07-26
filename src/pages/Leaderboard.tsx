import { useState } from 'react';
import { fighters } from '@/data/fighters';
import { worlds } from '@/data/worlds';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, Zap, Shield, Gauge, Heart } from 'lucide-react';
import { Fighter, WorldType } from '@/types/fighter';

const Leaderboard = () => {
  const [selectedRealm, setSelectedRealm] = useState<WorldType>('dark-arena');

  // Calculate overall rankings
  const overallRankings = fighters
    .map(fighter => ({
      ...fighter,
      winRate: fighter.wins / (fighter.wins + fighter.losses),
      totalFights: fighter.wins + fighter.losses
    }))
    .sort((a, b) => b.winRate - a.winRate || b.wins - a.wins);

  // Calculate realm-specific rankings
  const realmRankings = fighters
    .filter(fighter => fighter.world === selectedRealm)
    .map(fighter => ({
      ...fighter,
      winRate: fighter.wins / (fighter.wins + fighter.losses),
      totalFights: fighter.wins + fighter.losses
    }))
    .sort((a, b) => b.winRate - a.winRate || b.wins - a.wins);

  const getRealmBadgeVariant = (world: WorldType) => {
    switch (world) {
      case 'dark-arena': return 'destructive';
      case 'sci-fi-ai': return 'default';
      case 'fantasy-tech': return 'secondary';
      default: return 'outline';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-amber-600" />;
    return <span className="h-5 w-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
  };

  const FighterTable = ({ fighters: fighterList }: { fighters: any[] }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Fighter</TableHead>
            <TableHead>Realm</TableHead>
            <TableHead className="text-center">W/L</TableHead>
            <TableHead className="text-center">Win Rate</TableHead>
            <TableHead className="text-center">Value</TableHead>
            <TableHead className="text-center">Stats</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fighterList.map((fighter, index) => (
            <TableRow key={fighter.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {getRankIcon(index + 1)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img 
                    src={fighter.image} 
                    alt={fighter.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-semibold">{fighter.name}</div>
                    <div className="text-sm text-muted-foreground">{fighter.specialMove}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getRealmBadgeVariant(fighter.world)}>
                  {worlds.find(w => w.id === fighter.world)?.name}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="font-mono">
                  <span className="text-green-600">{fighter.wins}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-red-600">{fighter.losses}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-mono">{(fighter.winRate * 100).toFixed(1)}%</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className="font-mono">${fighter.valuePerShare}</span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-red-500" />
                    <span>{fighter.stats.attack}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-blue-500" />
                    <span>{fighter.stats.defense}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Gauge className="h-3 w-3 text-yellow-500" />
                    <span>{fighter.stats.speed}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-green-500" />
                    <span>{fighter.stats.health}</span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Fighter Leaderboard</h1>
          <p className="text-muted-foreground">
            Track the best fighters across all realms
          </p>
        </div>

        <Tabs defaultValue="overall" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="overall">Overall Rankings</TabsTrigger>
            <TabsTrigger value="realms">By Realm</TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  Overall Champions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FighterTable fighters={overallRankings} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realms" className="space-y-6">
            <div className="flex gap-4 mb-6">
              {worlds.map(world => (
                <button
                  key={world.id}
                  onClick={() => setSelectedRealm(world.id)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedRealm === world.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background hover:bg-muted'
                  }`}
                >
                  {world.name}
                </button>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  {worlds.find(w => w.id === selectedRealm)?.name} Champions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FighterTable fighters={realmRankings} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;