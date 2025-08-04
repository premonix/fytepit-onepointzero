import { useState } from 'react';
import { useFightersWithStats, useFightersByWorld } from '@/hooks/useFighters';
import { worlds } from '@/data/worlds';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Zap, Shield, Gauge, Heart, ChevronLeft, ChevronRight, Activity, BarChart3 } from 'lucide-react';
import { Fighter, WorldType } from '@/types/fighter';
import { FighterDetailsModal } from '@/components/FighterDetailsModal';
import { LeaderboardStats } from '@/components/LeaderboardStats';
import { RecentFights } from '@/components/RecentFights';
import { PerformanceTrends } from '@/components/PerformanceTrends';
import { Footer } from '@/components/Footer';

const Leaderboard = () => {
  const [selectedWorld, setSelectedWorld] = useState<WorldType>('dark-arena');
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentWorldPage, setCurrentWorldPage] = useState(1);
  const fightersPerPage = 10;

  // Get live fighter data
  const { data: allFighters, isLoading: loadingAll } = useFightersWithStats();
  const { data: worldFighters, isLoading: loadingWorld } = useFightersByWorld(selectedWorld);

  // Calculate overall rankings with live data
  const overallRankings = allFighters
    ?.sort((a, b) => b.winRate - a.winRate || b.wins - a.wins) || [];

  // Calculate world-specific rankings with live data
  const worldRankings = worldFighters
    ?.map(fighter => ({
      ...fighter,
      winRate: fighter.wins / (fighter.wins + fighter.losses) || 0,
      totalFights: fighter.wins + fighter.losses,
    }))
    .sort((a, b) => b.winRate - a.winRate || b.wins - a.wins) || [];

  // Pagination logic
  const totalPages = Math.ceil(overallRankings.length / fightersPerPage);
  const totalWorldPages = Math.ceil(worldRankings.length / fightersPerPage);
  
  const paginatedOverallRankings = overallRankings.slice(
    (currentPage - 1) * fightersPerPage,
    currentPage * fightersPerPage
  );
  
  const paginatedWorldRankings = worldRankings.slice(
    (currentWorldPage - 1) * fightersPerPage,
    currentWorldPage * fightersPerPage
  );

  const getWorldBadgeVariant = (world: WorldType) => {
    switch (world) {
      case 'dark-arena': return 'destructive';
      case 'sci-fi-ai': return 'default';
      case 'fantasy-tech': return 'secondary';
      case 'earth-1-0': return 'outline';
      default: return 'outline';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-amber-600" />;
    return <span className="h-5 w-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
  };

  const FighterTable = ({ fighters: fighterList, startRank = 1 }: { fighters: any[]; startRank?: number }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Fighter</TableHead>
            <TableHead>World</TableHead>
            <TableHead className="text-center">W/L</TableHead>
            <TableHead className="text-center">Win Rate</TableHead>
            <TableHead className="text-center">Value</TableHead>
            <TableHead className="text-center">Stats</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fighterList.map((fighter, index) => (
            <TableRow key={fighter.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedFighter(fighter)}>
              <TableCell className="font-medium">
                {getRankIcon(startRank + index)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img 
                    src={fighter.image} 
                    alt={fighter.name}
                    className="w-12 h-12 rounded-lg object-cover hover-scale"
                  />
                  <div>
                    <div className="font-semibold">{fighter.name}</div>
                    <div className="text-sm text-muted-foreground">{fighter.specialMove}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getWorldBadgeVariant(fighter.world)}>
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

  const PaginationControls = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
  }: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void; 
  }) => (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Loading state
  if (loadingAll || loadingWorld) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading live fighter data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Fighter Leaderboard</h1>
          <p className="text-muted-foreground">
            Track the best fighters across all worlds
          </p>
        </div>

        {/* Statistics Cards */}
        <LeaderboardStats />

        <Tabs defaultValue="overall" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="overall">Overall Rankings</TabsTrigger>
            <TabsTrigger value="worlds">By World</TabsTrigger>
            <TabsTrigger value="recent">
              <Activity className="h-4 w-4 mr-2" />
              Recent Fights
            </TabsTrigger>
            <TabsTrigger value="trends">
              <BarChart3 className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
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
                <FighterTable fighters={paginatedOverallRankings} startRank={(currentPage - 1) * fightersPerPage + 1} />
                <PaginationControls 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="worlds" className="space-y-6">
            <div className="flex gap-4 mb-6">
              {worlds.map(world => (
                <button
                  key={world.id}
                  onClick={() => setSelectedWorld(world.id)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedWorld === world.id 
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
                  {worlds.find(w => w.id === selectedWorld)?.name} Champions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FighterTable fighters={paginatedWorldRankings} startRank={(currentWorldPage - 1) * fightersPerPage + 1} />
                <PaginationControls 
                  currentPage={currentWorldPage}
                  totalPages={totalWorldPages}
                  onPageChange={(page) => {
                    setCurrentWorldPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <RecentFights />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <PerformanceTrends />
          </TabsContent>
        </Tabs>

        {/* Fighter Details Modal */}
        <FighterDetailsModal
          fighter={selectedFighter}
          isOpen={!!selectedFighter}
          onClose={() => setSelectedFighter(null)}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Leaderboard;