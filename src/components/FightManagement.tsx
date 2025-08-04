import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, Trophy, Crown, Calendar } from 'lucide-react';

interface Fight {
  id: string;
  fighter1_id: string;
  fighter2_id: string;
  winner_id: string | null;
  status: string;
  total_pot: number;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Fighter {
  id: string;
  name: string;
  world: string;
  image: string;
}

export function FightManagement() {
  const [fights, setFights] = useState<Fight[]>([]);
  const [filteredFights, setFilteredFights] = useState<Fight[]>([]);
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFight, setSelectedFight] = useState<Fight | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [winnerId, setWinnerId] = useState<string>('');
  const [newStatus, setNewStatus] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchFights();
    fetchFighters();
  }, []);

  useEffect(() => {
    filterFights();
  }, [fights, searchTerm, statusFilter]);

  const fetchFights = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('fights')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFights(data || []);
    } catch (error) {
      console.error('Error fetching fights:', error);
      toast({
        title: "Error",
        description: "Failed to fetch fights. Please try again.",
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
        .select('id, name, world, image');
      
      if (error) throw error;
      setFighters(data || []);
    } catch (error) {
      console.error('Error fetching fighters:', error);
    }
  };

  const filterFights = () => {
    let filtered = [...fights];

    if (searchTerm) {
      filtered = filtered.filter(fight => {
        const fighter1 = getFighterById(fight.fighter1_id);
        const fighter2 = getFighterById(fight.fighter2_id);
        return (
          fighter1?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fighter2?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fight.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(fight => fight.status === statusFilter);
    }

    setFilteredFights(filtered);
  };

  const getFighterById = (id: string) => {
    return fighters.find(fighter => fighter.id === id);
  };

  const openUpdateDialog = (fight: Fight) => {
    setSelectedFight(fight);
    setWinnerId(fight.winner_id || '');
    setNewStatus(fight.status);
    setIsDialogOpen(true);
  };

  const handleUpdateFight = async () => {
    if (!selectedFight) return;

    try {
      const { error } = await supabase.rpc('admin_update_fight', {
        _fight_id: selectedFight.id,
        _winner_id: winnerId || null,
        _status: newStatus
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Fight updated successfully.",
      });

      setIsDialogOpen(false);
      setSelectedFight(null);
      setWinnerId('');
      setNewStatus('');
      await fetchFights();
    } catch (error) {
      console.error('Error updating fight:', error);
      toast({
        title: "Error",
        description: "Failed to update fight. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'upcoming': return 'secondary';
      case 'in_progress': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Fight Management
        </CardTitle>
        <CardDescription>
          Manage fight schedules, outcomes, and history ({filteredFights.length} fights)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by fighter name or fight ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchFights} disabled={isLoading} variant="outline">
              Refresh
            </Button>
          </div>

          {/* Fights Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Winner</TableHead>
                  <TableHead>Pot</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading fights...
                    </TableCell>
                  </TableRow>
                ) : filteredFights.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No fights found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFights.map((fight) => {
                    const fighter1 = getFighterById(fight.fighter1_id);
                    const fighter2 = getFighterById(fight.fighter2_id);
                    const winner = fight.winner_id ? getFighterById(fight.winner_id) : null;

                    return (
                      <TableRow key={fight.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {fighter1 && (
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={fighter1.image} 
                                    alt={fighter1.name}
                                    className="w-6 h-6 rounded object-cover"
                                  />
                                  <span className="font-medium">{fighter1.name}</span>
                                </div>
                              )}
                              <span className="text-muted-foreground">vs</span>
                              {fighter2 && (
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={fighter2.image} 
                                    alt={fighter2.name}
                                    className="w-6 h-6 rounded object-cover"
                                  />
                                  <span className="font-medium">{fighter2.name}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">#{fight.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(fight.status)}>
                            {fight.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {winner ? (
                            <div className="flex items-center gap-2">
                              <Crown className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">{winner.name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">TBD</span>
                          )}
                        </TableCell>
                        <TableCell>${fight.total_pot}</TableCell>
                        <TableCell>
                          {fight.scheduled_at ? (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {new Date(fight.scheduled_at).toLocaleDateString()}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Not scheduled</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openUpdateDialog(fight)}
                          >
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Update Fight Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Fight</DialogTitle>
              <DialogDescription>
                Update fight status and winner
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedFight && (
                <div>
                  <label className="text-sm font-medium">Winner</label>
                  <Select value={winnerId} onValueChange={setWinnerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select winner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No winner</SelectItem>
                      <SelectItem value={selectedFight.fighter1_id}>
                        {getFighterById(selectedFight.fighter1_id)?.name}
                      </SelectItem>
                      <SelectItem value={selectedFight.fighter2_id}>
                        {getFighterById(selectedFight.fighter2_id)?.name}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateFight}>
                Update Fight
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}