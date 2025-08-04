import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Plus, Trophy, Users, Crown, Play, Edit2, Trash2 } from 'lucide-react';

interface Tournament {
  id: string;
  name: string;
  description: string;
  world: string;
  tournament_type: string;
  max_participants: number;
  entry_fee: number;
  prize_pool: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  winner_id: string | null;
  created_at: string;
  participant_count?: number;
}

interface Fighter {
  id: string;
  name: string;
  world: string;
  image: string;
  attack: number;
  defense: number;
}

interface TournamentParticipant {
  id: string;
  fighter_id: string;
  seed_number: number;
  is_eliminated: boolean;
  fighter?: Fighter;
}

export function TournamentManagement() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<TournamentParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'create' | 'edit' | 'participants' | 'bracket'>('create');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    world: '',
    tournament_type: 'single_elimination',
    max_participants: 8,
    entry_fee: 0,
    prize_pool: 0,
    start_date: undefined as Date | undefined
  });
  const [selectedFighter, setSelectedFighter] = useState('');
  const { toast } = useToast();

  const worlds = ['dark-arena', 'fantasy-tech', 'sci-fi-ai'];

  useEffect(() => {
    fetchTournaments();
    fetchFighters();
  }, []);

  const fetchTournaments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          tournament_participants(count)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const tournamentsWithCounts = data?.map(tournament => ({
        ...tournament,
        participant_count: tournament.tournament_participants?.[0]?.count || 0
      })) || [];
      
      setTournaments(tournamentsWithCounts);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tournaments.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFighters = async () => {
    try {
      const { data, error } = await supabase
        .from('fighters')
        .select('id, name, world, image, attack, defense')
        .order('name');
      
      if (error) throw error;
      setFighters(data || []);
    } catch (error) {
      console.error('Error fetching fighters:', error);
    }
  };

  const fetchTournamentParticipants = async (tournamentId: string) => {
    try {
      const { data, error } = await supabase
        .from('tournament_participants')
        .select(`
          *,
          fighters:fighter_id (
            id, name, world, image, attack, defense
          )
        `)
        .eq('tournament_id', tournamentId)
        .order('seed_number');
      
      if (error) throw error;
      
      const participantsWithFighters = data?.map(participant => ({
        ...participant,
        fighter: participant.fighters
      })) || [];
      
      setParticipants(participantsWithFighters);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const handleCreateTournament = async () => {
    if (!formData.name || !formData.world) {
      toast({
        title: "Error",
        description: "Please fill in required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: tournamentId, error } = await supabase.rpc('admin_create_tournament', {
        _name: formData.name,
        _description: formData.description,
        _world: formData.world,
        _tournament_type: formData.tournament_type,
        _max_participants: formData.max_participants,
        _entry_fee: formData.entry_fee,
        _prize_pool: formData.prize_pool,
        _start_date: formData.start_date?.toISOString()
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tournament created successfully!",
      });

      setIsDialogOpen(false);
      resetForm();
      await fetchTournaments();
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast({
        title: "Error",
        description: "Failed to create tournament.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFighter = async () => {
    if (!selectedTournament || !selectedFighter) return;

    try {
      const { error } = await supabase.rpc('admin_add_tournament_fighter', {
        _tournament_id: selectedTournament.id,
        _fighter_id: selectedFighter
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Fighter added to tournament!",
      });

      setSelectedFighter('');
      await fetchTournamentParticipants(selectedTournament.id);
      await fetchTournaments();
    } catch (error) {
      console.error('Error adding fighter:', error);
      toast({
        title: "Error",
        description: "Failed to add fighter to tournament.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateBracket = async () => {
    if (!selectedTournament) return;

    try {
      const { error } = await supabase.rpc('admin_generate_tournament_bracket', {
        _tournament_id: selectedTournament.id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tournament bracket generated!",
      });

      await fetchTournaments();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error generating bracket:', error);
      toast({
        title: "Error",
        description: "Failed to generate tournament bracket.",
        variant: "destructive",
      });
    }
  };

  const openDialog = (type: 'create' | 'edit' | 'participants' | 'bracket', tournament?: Tournament) => {
    setDialogType(type);
    if (tournament) {
      setSelectedTournament(tournament);
      if (type === 'participants') {
        fetchTournamentParticipants(tournament.id);
      }
    } else {
      setSelectedTournament(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      world: '',
      tournament_type: 'single_elimination',
      max_participants: 8,
      entry_fee: 0,
      prize_pool: 0,
      start_date: undefined
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'upcoming': return 'secondary';
      case 'active': return 'default';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getAvailableFighters = () => {
    if (!selectedTournament) return [];
    
    const participantFighterIds = participants.map(p => p.fighter_id);
    return fighters.filter(fighter => 
      fighter.world === selectedTournament.world && 
      !participantFighterIds.includes(fighter.id)
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Tournament Management
          </CardTitle>
          <CardDescription>
            Create and manage tournaments across all realms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Active Tournaments</h3>
              <p className="text-sm text-muted-foreground">
                {tournaments.length} tournaments total
              </p>
            </div>
            <Button onClick={() => openDialog('create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Tournament
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tournament</TableHead>
                  <TableHead>World</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Prize Pool</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading tournaments...
                    </TableCell>
                  </TableRow>
                ) : tournaments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No tournaments found
                    </TableCell>
                  </TableRow>
                ) : (
                  tournaments.map((tournament) => (
                    <TableRow key={tournament.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{tournament.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {tournament.description || 'No description'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {tournament.world.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {tournament.tournament_type.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {tournament.participant_count || 0}/{tournament.max_participants}
                        </div>
                      </TableCell>
                      <TableCell>${tournament.prize_pool}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(tournament.status)}>
                          {tournament.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDialog('participants', tournament)}
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          {tournament.status === 'upcoming' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDialog('bracket', tournament)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tournament Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'create' && 'Create New Tournament'}
              {dialogType === 'participants' && `Manage Participants - ${selectedTournament?.name}`}
              {dialogType === 'bracket' && `Generate Bracket - ${selectedTournament?.name}`}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'create' && 'Set up a new tournament for fighters to compete'}
              {dialogType === 'participants' && 'Add fighters to the tournament'}
              {dialogType === 'bracket' && 'Generate the tournament bracket and start the competition'}
            </DialogDescription>
          </DialogHeader>

          {dialogType === 'create' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tournament Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter tournament name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="world">World</Label>
                <Select value={formData.world} onValueChange={(value) => setFormData({...formData, world: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select world" />
                  </SelectTrigger>
                  <SelectContent>
                    {worlds.map(world => (
                      <SelectItem key={world} value={world}>
                        {world.replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tournament description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tournament_type">Tournament Type</Label>
                <Select value={formData.tournament_type} onValueChange={(value) => setFormData({...formData, tournament_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single_elimination">Single Elimination</SelectItem>
                    <SelectItem value="double_elimination">Double Elimination</SelectItem>
                    <SelectItem value="round_robin">Round Robin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_participants">Max Participants</Label>
                <Select value={formData.max_participants.toString()} onValueChange={(value) => setFormData({...formData, max_participants: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 Fighters</SelectItem>
                    <SelectItem value="8">8 Fighters</SelectItem>
                    <SelectItem value="16">16 Fighters</SelectItem>
                    <SelectItem value="32">32 Fighters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="entry_fee">Entry Fee ($)</Label>
                <Input
                  id="entry_fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.entry_fee}
                  onChange={(e) => setFormData({...formData, entry_fee: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prize_pool">Prize Pool ($)</Label>
                <Input
                  id="prize_pool"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.prize_pool}
                  onChange={(e) => setFormData({...formData, prize_pool: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.start_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start_date ? format(formData.start_date, "PPP") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.start_date}
                      onSelect={(date) => setFormData({...formData, start_date: date})}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {dialogType === 'participants' && selectedTournament && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <Select value={selectedFighter} onValueChange={setSelectedFighter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select fighter to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableFighters().map(fighter => (
                      <SelectItem key={fighter.id} value={fighter.id}>
                        <div className="flex items-center gap-2">
                          <img 
                            src={fighter.image} 
                            alt={fighter.name}
                            className="w-6 h-6 rounded object-cover"
                          />
                          <span>{fighter.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddFighter} disabled={!selectedFighter}>
                  Add Fighter
                </Button>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Seed</TableHead>
                      <TableHead>Fighter</TableHead>
                      <TableHead>Stats</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell>#{participant.seed_number}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img 
                              src={participant.fighter?.image} 
                              alt={participant.fighter?.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <span>{participant.fighter?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            ATK: {participant.fighter?.attack} | DEF: {participant.fighter?.defense}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={participant.is_eliminated ? 'destructive' : 'default'}>
                            {participant.is_eliminated ? 'Eliminated' : 'Active'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {dialogType === 'bracket' && selectedTournament && (
            <div className="space-y-4">
              <div className="text-center">
                <Crown className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <h3 className="text-lg font-medium">Generate Tournament Bracket</h3>
                <p className="text-muted-foreground">
                  This will create the tournament bracket and start the competition.
                  Make sure all participants are added before proceeding.
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Participants:</span> {participants.length}/{selectedTournament.max_participants}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {selectedTournament.tournament_type.replace('_', ' ')}
                  </div>
                  <div>
                    <span className="font-medium">Prize Pool:</span> ${selectedTournament.prize_pool}
                  </div>
                  <div>
                    <span className="font-medium">Entry Fee:</span> ${selectedTournament.entry_fee}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            {dialogType === 'create' && (
              <Button onClick={handleCreateTournament} disabled={isLoading}>
                Create Tournament
              </Button>
            )}
            {dialogType === 'bracket' && (
              <Button onClick={handleGenerateBracket}>
                Generate Bracket
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}