import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TournamentBracket } from '@/components/TournamentBracket';
import { supabase } from '@/integrations/supabase/client';
import { Users, Trophy, Clock, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Tournament {
  id: string;
  name: string;
  status: string;
  tournament_type: string;
  max_participants: number;
  prize_pool: number;
  start_date: string;
  world: string;
  participant_count: number;
  spectator_count?: number;
}

export function LiveTournamentViewer() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [spectatorCounts, setSpectatorCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTournaments();
    const interval = setInterval(updateSpectatorCounts, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          tournament_participants(count)
        `)
        .in('status', ['active', 'upcoming'])
        .order('start_date', { ascending: true });

      if (error) throw error;

      const tournamentsWithCounts = data?.map(tournament => ({
        ...tournament,
        participant_count: tournament.tournament_participants?.[0]?.count || 0
      }));

      setTournaments(tournamentsWithCounts || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch tournaments.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSpectatorCounts = () => {
    // Only update spectator counts if we have tournaments
    if (tournaments.length === 0) return;
    
    // Simulate real-time spectator counts
    const newCounts: Record<string, number> = {};
    tournaments.forEach(tournament => {
      newCounts[tournament.id] = Math.floor(Math.random() * 500) + 50;
    });
    setSpectatorCounts(newCounts);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'destructive';
      case 'upcoming':
        return 'secondary';
      case 'completed':
        return 'default';
      default:
        return 'outline';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading tournaments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Tournaments</h2>
          <p className="text-muted-foreground">Watch active tournaments and upcoming events</p>
        </div>
      </div>

      {selectedTournament ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setSelectedTournament(null)}
            >
              ← Back to Tournaments
            </Button>
            <Badge variant={getStatusVariant(selectedTournament.status)}>
              {selectedTournament.status}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              {spectatorCounts[selectedTournament.id] || 0} spectators
            </div>
          </div>
          
          <TournamentBracket 
            tournamentId={selectedTournament.id}
            onClose={() => setSelectedTournament(null)}
          />
        </div>
      ) : tournaments.length === 0 ? (
        // Empty state when no tournaments exist
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Tournaments Available</h3>
          <p className="text-muted-foreground mb-4">
            There are currently no active or upcoming tournaments. Check back later for exciting competitions!
          </p>
          <Button variant="outline" onClick={fetchTournaments}>
            Refresh
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">
              Active ({tournaments.filter(t => t.status === 'active').length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({tournaments.filter(t => t.status === 'upcoming').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {tournaments.filter(t => t.status === 'active').length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-3">
                  <Trophy className="w-6 h-6 text-muted-foreground" />
                </div>
                <h4 className="font-medium mb-1">No Active Tournaments</h4>
                <p className="text-sm text-muted-foreground">All tournaments have finished or are yet to start.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tournaments.filter(t => t.status === 'active').map(tournament => (
                  <Card key={tournament.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{tournament.name}</CardTitle>
                        <Badge variant="destructive">LIVE</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {tournament.world} • {tournament.tournament_type.replace('_', ' ')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {tournament.participant_count}/{tournament.max_participants}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {spectatorCounts[tournament.id] || 0}
                          </div>
                        </div>

                        {tournament.prize_pool > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Trophy className="w-4 h-4 text-primary" />
                            <span className="font-medium">{tournament.prize_pool.toLocaleString()} credits</span>
                          </div>
                        )}

                        <Button 
                          className="w-full"
                          onClick={() => setSelectedTournament(tournament)}
                        >
                          Watch Tournament
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            {tournaments.filter(t => t.status === 'upcoming').length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
                <h4 className="font-medium mb-1">No Upcoming Tournaments</h4>
                <p className="text-sm text-muted-foreground">No tournaments are scheduled. New events will be announced soon!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tournaments.filter(t => t.status === 'upcoming').map(tournament => (
                  <Card key={tournament.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{tournament.name}</CardTitle>
                        <Badge variant="secondary">Upcoming</Badge>
                      </div>
                      <CardDescription>
                        {tournament.world} • {tournament.tournament_type.replace('_', ' ')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-4 h-4" />
                          {formatDateTime(tournament.start_date)}
                        </div>

                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4" />
                          {tournament.participant_count}/{tournament.max_participants} registered
                        </div>

                        {tournament.prize_pool > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Trophy className="w-4 h-4 text-primary" />
                            <span className="font-medium">{tournament.prize_pool.toLocaleString()} credits</span>
                          </div>
                        )}

                        <Button 
                          variant="outline"
                          className="w-full"
                          onClick={() => setSelectedTournament(tournament)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}