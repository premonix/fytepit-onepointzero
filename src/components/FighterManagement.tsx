import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { Search, Plus, Edit2, Trash2, Swords } from 'lucide-react';

interface Fighter {
  id: string;
  name: string;
  world: string;
  image: string;
  attack: number;
  defense: number;
  speed: number;
  health: number;
  wins: number;
  losses: number;
  description?: string;
  backstory?: string;
  special_move?: string;
  abilities?: string[];
  created_at: string;
  updated_at: string;
}

export function FighterManagement() {
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [filteredFighters, setFilteredFighters] = useState<Fighter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [worldFilter, setWorldFilter] = useState<string>('all');
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'create' | 'edit' | 'delete'>('create');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    world: '',
    image: '',
    attack: 50,
    defense: 50,
    speed: 50,
    health: 100,
    description: '',
    backstory: '',
    special_move: '',
    abilities: ''
  });
  const { toast } = useToast();
  const { isSuperAdmin } = useUserRole();

  const worlds = ['dark-arena', 'fantasy-tech', 'sci-fi-ai'];

  useEffect(() => {
    fetchFighters();
  }, []);

  useEffect(() => {
    filterFighters();
  }, [fighters, searchTerm, worldFilter]);

  const fetchFighters = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('fighters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFighters(data || []);
    } catch (error) {
      console.error('Error fetching fighters:', error);
      toast({
        title: "Error",
        description: "Failed to fetch fighters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterFighters = () => {
    let filtered = [...fighters];

    if (searchTerm) {
      filtered = filtered.filter(fighter => 
        fighter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fighter.world.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (worldFilter !== 'all') {
      filtered = filtered.filter(fighter => fighter.world === worldFilter);
    }

    setFilteredFighters(filtered);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      world: '',
      image: '',
      attack: 50,
      defense: 50,
      speed: 50,
      health: 100,
      description: '',
      backstory: '',
      special_move: '',
      abilities: ''
    });
  };

  const openDialog = (type: 'create' | 'edit' | 'delete', fighter?: Fighter) => {
    setDialogType(type);
    if (fighter) {
      setSelectedFighter(fighter);
      if (type === 'edit') {
        setFormData({
          id: fighter.id,
          name: fighter.name,
          world: fighter.world,
          image: fighter.image,
          attack: fighter.attack,
          defense: fighter.defense,
          speed: fighter.speed,
          health: fighter.health,
          description: fighter.description || '',
          backstory: fighter.backstory || '',
          special_move: fighter.special_move || '',
          abilities: fighter.abilities?.join(', ') || ''
        });
      }
    } else {
      setSelectedFighter(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCreateFighter = async () => {
    try {
      const abilities = formData.abilities ? formData.abilities.split(',').map(a => a.trim()).filter(a => a) : [];
      
      const { error } = await supabase.rpc('admin_create_fighter', {
        _id: formData.id,
        _name: formData.name,
        _world: formData.world,
        _image: formData.image,
        _attack: formData.attack,
        _defense: formData.defense,
        _speed: formData.speed,
        _health: formData.health,
        _description: formData.description || null,
        _backstory: formData.backstory || null,
        _special_move: formData.special_move || null,
        _abilities: abilities.length > 0 ? abilities : null
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Fighter created successfully.",
      });

      setIsDialogOpen(false);
      resetForm();
      await fetchFighters();
    } catch (error) {
      console.error('Error creating fighter:', error);
      toast({
        title: "Error",
        description: "Failed to create fighter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFighter = async () => {
    if (!selectedFighter) return;

    try {
      const abilities = formData.abilities ? formData.abilities.split(',').map(a => a.trim()).filter(a => a) : [];
      
      const { error } = await supabase.rpc('admin_update_fighter', {
        _id: selectedFighter.id,
        _name: formData.name,
        _world: formData.world,
        _image: formData.image,
        _attack: formData.attack,
        _defense: formData.defense,
        _speed: formData.speed,
        _health: formData.health,
        _description: formData.description || null,
        _backstory: formData.backstory || null,
        _special_move: formData.special_move || null,
        _abilities: abilities.length > 0 ? abilities : null
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Fighter updated successfully.",
      });

      setIsDialogOpen(false);
      setSelectedFighter(null);
      resetForm();
      await fetchFighters();
    } catch (error) {
      console.error('Error updating fighter:', error);
      toast({
        title: "Error",
        description: "Failed to update fighter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFighter = async () => {
    if (!selectedFighter) return;

    try {
      const { error } = await supabase.rpc('admin_delete_fighter', {
        _fighter_id: selectedFighter.id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Fighter deleted successfully.",
      });

      setIsDialogOpen(false);
      setSelectedFighter(null);
      await fetchFighters();
    } catch (error) {
      console.error('Error deleting fighter:', error);
      toast({
        title: "Error",
        description: "Failed to delete fighter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getWorldBadgeVariant = (world: string) => {
    switch (world) {
      case 'dark-arena': return 'destructive';
      case 'fantasy-tech': return 'default';
      case 'sci-fi-ai': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Swords className="h-5 w-5" />
          Fighter Management
        </CardTitle>
        <CardDescription>
          Create, edit, and manage fighters across all realms ({filteredFighters.length} fighters)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search fighters by name or world..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={worldFilter} onValueChange={setWorldFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by world" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Worlds</SelectItem>
                <SelectItem value="dark-arena">Dark Arena</SelectItem>
                <SelectItem value="fantasy-tech">Fantasy Tech</SelectItem>
                <SelectItem value="sci-fi-ai">Sci-Fi AI</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => openDialog('create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Fighter
            </Button>
            <Button onClick={fetchFighters} disabled={isLoading} variant="outline">
              Refresh
            </Button>
          </div>

          {/* Fighters Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fighter</TableHead>
                  <TableHead>World</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead>Record</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading fighters...
                    </TableCell>
                  </TableRow>
                ) : filteredFighters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No fighters found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFighters.map((fighter) => (
                    <TableRow key={fighter.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={fighter.image} 
                            alt={fighter.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium">{fighter.name}</div>
                            <div className="text-sm text-muted-foreground">#{fighter.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getWorldBadgeVariant(fighter.world)}>
                          {fighter.world.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>ATK: {fighter.attack} | DEF: {fighter.defense}</div>
                          <div>SPD: {fighter.speed} | HP: {fighter.health}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span className="text-green-600">{fighter.wins}W</span> - 
                          <span className="text-red-600 ml-1">{fighter.losses}L</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(fighter.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDialog('edit', fighter)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          {isSuperAdmin() && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDialog('delete', fighter)}
                            >
                              <Trash2 className="h-4 w-4" />
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
        </div>

        {/* Fighter Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {dialogType === 'create' && 'Create New Fighter'}
                {dialogType === 'edit' && 'Edit Fighter'}
                {dialogType === 'delete' && 'Delete Fighter'}
              </DialogTitle>
              <DialogDescription>
                {dialogType === 'create' && 'Create a new fighter for the arena'}
                {dialogType === 'edit' && 'Update fighter information and stats'}
                {dialogType === 'delete' && `Are you sure you want to delete ${selectedFighter?.name}? This action cannot be undone.`}
              </DialogDescription>
            </DialogHeader>

            {(dialogType === 'create' || dialogType === 'edit') && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Fighter ID</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => setFormData({...formData, id: e.target.value})}
                    disabled={dialogType === 'edit'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attack">Attack ({formData.attack})</Label>
                  <Input
                    id="attack"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.attack}
                    onChange={(e) => setFormData({...formData, attack: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defense">Defense ({formData.defense})</Label>
                  <Input
                    id="defense"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.defense}
                    onChange={(e) => setFormData({...formData, defense: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speed">Speed ({formData.speed})</Label>
                  <Input
                    id="speed"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.speed}
                    onChange={(e) => setFormData({...formData, speed: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="health">Health ({formData.health})</Label>
                  <Input
                    id="health"
                    type="number"
                    min="1"
                    max="200"
                    value={formData.health}
                    onChange={(e) => setFormData({...formData, health: parseInt(e.target.value)})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="abilities">Abilities (comma separated)</Label>
                  <Input
                    id="abilities"
                    value={formData.abilities}
                    onChange={(e) => setFormData({...formData, abilities: e.target.value})}
                    placeholder="Fire Blast, Lightning Strike, Shield Wall"
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (dialogType === 'create') handleCreateFighter();
                  else if (dialogType === 'edit') handleUpdateFighter();
                  else if (dialogType === 'delete') handleDeleteFighter();
                }}
                variant={dialogType === 'delete' ? 'destructive' : 'default'}
              >
                {dialogType === 'create' && 'Create Fighter'}
                {dialogType === 'edit' && 'Update Fighter'}
                {dialogType === 'delete' && 'Delete Fighter'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}