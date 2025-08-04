import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Crown, Play, ChevronRight, Zap, Users } from 'lucide-react';

interface BracketData {
  tournament: {
    id: string;
    name: string;
    status: string;
    tournament_type: string;
    max_participants: number;
    winner_id: string | null;
  };
  participants: Array<{
    fighter_id: string;
    seed_number: number;
    is_eliminated: boolean;
    fighter: {
      id: string;
      name: string;
      image: string;
      world: string;
    };
  }>;
  rounds: Array<{
    round_number: number;
    matches: Array<{
      match_id: string;
      match_number: number;
      fight_id: string;
      status: string;
      fight: {
        id: string;
        fighter1_id: string;
        fighter2_id: string;
        winner_id: string | null;
        status: string;
        fighter1: {
          id: string;
          name: string;
          image: string;
        };
        fighter2: {
          id: string;
          name: string;
          image: string;
        };
      };
    }>;
  }>;
}

interface TournamentBracketProps {
  tournamentId: string;
  onClose: () => void;
}

export function TournamentBracket({ tournamentId, onClose }: TournamentBracketProps) {
  const [bracketData, setBracketData] = useState<BracketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFight, setSelectedFight] = useState<any>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<'simulate' | 'advance'>('simulate');
  const { toast } = useToast();

  useEffect(() => {
    if (tournamentId) {
      fetchBracketData();
    }
  }, [tournamentId]);

  const fetchBracketData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_tournament_bracket', {
        _tournament_id: tournamentId
      });

      if (error) throw error;
      setBracketData(data as unknown as BracketData);
    } catch (error) {
      console.error('Error fetching bracket data:', error);
      toast({
        title: "Error",
        description: "Failed to load tournament bracket.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateFight = async (fightId: string, winnerId: string) => {
    try {
      const { error } = await supabase.rpc('admin_update_fight', {
        _fight_id: fightId,
        _winner_id: winnerId,
        _status: 'completed'
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Fight completed successfully!",
      });

      await fetchBracketData();
      setIsActionDialogOpen(false);
      setSelectedFight(null);
    } catch (error) {
      console.error('Error simulating fight:', error);
      toast({
        title: "Error",
        description: "Failed to complete fight.",
        variant: "destructive",
      });
    }
  };

  const advanceRound = async (roundNumber: number) => {
    try {
      const { error } = await supabase.rpc('admin_advance_tournament_round', {
        _tournament_id: tournamentId,
        _current_round: roundNumber
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Round advanced successfully!",
      });

      await fetchBracketData();
      setIsActionDialogOpen(false);
    } catch (error) {
      console.error('Error advancing round:', error);
      toast({
        title: "Error",
        description: "Failed to advance round. Make sure all fights are completed.",
        variant: "destructive",
      });
    }
  };

  const openActionDialog = (action: 'simulate' | 'advance', fight?: any, round?: number) => {
    setCurrentAction(action);
    if (fight) setSelectedFight(fight);
    setIsActionDialogOpen(true);
  };

  const getRoundName = (roundNumber: number, totalRounds: number) => {
    if (roundNumber === totalRounds) return 'Finals';
    if (roundNumber === totalRounds - 1) return 'Semifinals';
    if (roundNumber === totalRounds - 2) return 'Quarterfinals';
    return `Round ${roundNumber}`;
  };

  const getMatchStatus = (fight: any) => {
    if (fight.status === 'completed') return 'completed';
    if (fight.status === 'in_progress') return 'active';
    return 'pending';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'active': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const isRoundComplete = (round: any) => {
    return round.matches.every((match: any) => match.fight.status === 'completed');
  };

  const canAdvanceRound = (roundNumber: number) => {
    const round = bracketData?.rounds.find(r => r.round_number === roundNumber);
    return round && isRoundComplete(round) && bracketData.tournament.status === 'active';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-lg">Loading tournament bracket...</div>
        </CardContent>
      </Card>
    );
  }

  if (!bracketData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-lg text-muted-foreground">Failed to load bracket data</div>
        </CardContent>
      </Card>
    );
  }

  const totalRounds = bracketData.rounds.length;

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                {bracketData.tournament.name}
              </CardTitle>
              <CardDescription>
                {bracketData.tournament.tournament_type.replace('_', ' ')} • {bracketData.participants.length} fighters
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={
                bracketData.tournament.status === 'completed' ? 'default' :
                bracketData.tournament.status === 'active' ? 'destructive' : 'secondary'
              }>
                {bracketData.tournament.status}
              </Badge>
              {bracketData.tournament.winner_id && (
                <Badge variant="default" className="bg-yellow-500 text-yellow-950">
                  <Crown className="h-3 w-3 mr-1" />
                  Champion
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tournament Bracket */}
      <Card>
        <CardHeader>
          <CardTitle>Tournament Bracket</CardTitle>
          <CardDescription>Track fights through each round to the championship</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8 overflow-x-auto pb-4">
            {bracketData.rounds.map((round, roundIndex) => (
              <div key={round.round_number} className="flex-shrink-0 space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-lg">
                    {getRoundName(round.round_number, totalRounds)}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant="outline">
                      {round.matches.length} {round.matches.length === 1 ? 'Match' : 'Matches'}
                    </Badge>
                    {canAdvanceRound(round.round_number) && round.round_number < totalRounds && (
                      <Button
                        size="sm"
                        onClick={() => openActionDialog('advance', undefined, round.round_number)}
                        className="ml-2"
                      >
                        <ChevronRight className="h-4 w-4 mr-1" />
                        Advance
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-4 min-w-[280px]">
                  {round.matches.map((match) => (
                    <Card 
                      key={match.match_id} 
                      className={`transition-all duration-200 ${
                        match.fight.status === 'completed' ? 'bg-muted/50' : 
                        match.fight.status === 'in_progress' ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Match Header */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Match {match.match_number}
                            </span>
                            <Badge variant={getStatusBadgeVariant(getMatchStatus(match.fight))}>
                              {getMatchStatus(match.fight)}
                            </Badge>
                          </div>

                          {/* Fighters */}
                          <div className="space-y-2">
                            {/* Fighter 1 */}
                            <div className={`flex items-center gap-3 p-2 rounded ${
                              match.fight.winner_id === match.fight.fighter1_id ? 'bg-green-100 dark:bg-green-900/20' : ''
                            }`}>
                              <img 
                                src={match.fight.fighter1.image} 
                                alt={match.fight.fighter1.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <span className="font-medium flex-1">{match.fight.fighter1.name}</span>
                              {match.fight.winner_id === match.fight.fighter1_id && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>

                            {/* VS Divider */}
                            <div className="text-center text-sm text-muted-foreground">VS</div>

                            {/* Fighter 2 */}
                            <div className={`flex items-center gap-3 p-2 rounded ${
                              match.fight.winner_id === match.fight.fighter2_id ? 'bg-green-100 dark:bg-green-900/20' : ''
                            }`}>
                              <img 
                                src={match.fight.fighter2.image} 
                                alt={match.fight.fighter2.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <span className="font-medium flex-1">{match.fight.fighter2.name}</span>
                              {match.fight.winner_id === match.fight.fighter2_id && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          {match.fight.status !== 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openActionDialog('simulate', match.fight)}
                              className="w-full"
                            >
                              <Zap className="h-4 w-4 mr-2" />
                              Simulate Fight
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Round Connector */}
                {roundIndex < bracketData.rounds.length - 1 && (
                  <div className="flex items-center justify-center pt-8">
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Champion Card */}
      {bracketData.tournament.status === 'completed' && bracketData.tournament.winner_id && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
          <CardContent className="p-6 text-center">
            <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Tournament Champion</h2>
            <div className="flex items-center justify-center gap-3">
              {(() => {
                const champion = bracketData.participants.find(p => p.fighter_id === bracketData.tournament.winner_id);
                return champion ? (
                  <>
                    <img 
                      src={champion.fighter.image} 
                      alt={champion.fighter.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-yellow-500"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{champion.fighter.name}</h3>
                      <p className="text-muted-foreground capitalize">{champion.fighter.world.replace('-', ' ')}</p>
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentAction === 'simulate' ? 'Simulate Fight' : 'Advance Round'}
            </DialogTitle>
            <DialogDescription>
              {currentAction === 'simulate' 
                ? 'Choose the winner of this fight to advance them to the next round.'
                : 'Advance to the next round and create new matchups for the winners.'
              }
            </DialogDescription>
          </DialogHeader>

          {currentAction === 'simulate' && selectedFight && (
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">Select the winner:</p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => simulateFight(selectedFight.id, selectedFight.fighter1_id)}
                  className="w-full justify-start"
                >
                  <img 
                    src={selectedFight.fighter1.image} 
                    alt={selectedFight.fighter1.name}
                    className="w-8 h-8 rounded object-cover mr-3"
                  />
                  {selectedFight.fighter1.name}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => simulateFight(selectedFight.id, selectedFight.fighter2_id)}
                  className="w-full justify-start"
                >
                  <img 
                    src={selectedFight.fighter2.image} 
                    alt={selectedFight.fighter2.name}
                    className="w-8 h-8 rounded object-cover mr-3"
                  />
                  {selectedFight.fighter2.name}
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}