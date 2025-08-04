import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Plus, Swords, Clock } from 'lucide-react';

interface Fighter {
  id: string;
  name: string;
  world: string;
  image: string;
  attack: number;
  defense: number;
  speed: number;
  health: number;
}

interface Tournament {
  id: string;
  name: string;
  world: string;
  status: string;
}

export function FightCreation() {
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fighter1_id: '',
    fighter2_id: '',
    fight_type: 'exhibition',
    scheduled_date: undefined as Date | undefined,
    scheduled_time: '',
    venue: '',
    max_betting_amount: '',
    tournament_id: '',
    rules: {
      rounds: 3,
      time_limit: 300,
      victory_conditions: ['knockout', 'submission', 'decision']
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFighters();
    fetchTournaments();
  }, []);

  const fetchFighters = async () => {
    try {
      const { data, error } = await supabase
        .from('fighters')
        .select('id, name, world, image, attack, defense, speed, health')
        .order('name');
      
      if (error) throw error;
      setFighters(data || []);
    } catch (error) {
      console.error('Error fetching fighters:', error);
    }
  };

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('id, name, world, status')
        .in('status', ['upcoming', 'active'])
        .order('name');
      
      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  const handleCreateFight = async () => {
    if (!formData.fighter1_id || !formData.fighter2_id) {
      toast({
        title: "Error",
        description: "Please select both fighters.",
        variant: "destructive",
      });
      return;
    }

    if (formData.fighter1_id === formData.fighter2_id) {
      toast({
        title: "Error",
        description: "A fighter cannot fight themselves.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Combine date and time for scheduling
      let scheduledAt = null;
      if (formData.scheduled_date && formData.scheduled_time) {
        const [hours, minutes] = formData.scheduled_time.split(':');
        scheduledAt = new Date(formData.scheduled_date);
        scheduledAt.setHours(parseInt(hours), parseInt(minutes));
      }

      const { data: fightId, error } = await supabase.rpc('admin_create_fight', {
        _fighter1_id: formData.fighter1_id,
        _fighter2_id: formData.fighter2_id,
        _fight_type: formData.fight_type,
        _scheduled_at: scheduledAt?.toISOString() || null,
        _venue: formData.venue || null,
        _max_betting_amount: formData.max_betting_amount ? parseFloat(formData.max_betting_amount) : null,
        _tournament_id: formData.tournament_id || null,
        _rules: formData.rules
      });

      console.log('Fight creation result:', { fightId, error });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Fight created successfully!",
      });

      // Reset form
      setFormData({
        fighter1_id: '',
        fighter2_id: '',
        fight_type: 'exhibition',
        scheduled_date: undefined,
        scheduled_time: '',
        venue: '',
        max_betting_amount: '',
        tournament_id: '',
        rules: {
          rounds: 3,
          time_limit: 300,
          victory_conditions: ['knockout', 'submission', 'decision']
        }
      });
    } catch (error) {
      console.error('Error creating fight:', error);
      toast({
        title: "Error",
        description: "Failed to create fight. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFighterById = (id: string) => {
    return fighters.find(fighter => fighter.id === id);
  };

  const getFightersByWorld = (world: string) => {
    return fighters.filter(fighter => fighter.world === world);
  };

  const availableWorlds = [...new Set(fighters.map(f => f.world))];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Swords className="h-5 w-5" />
          Create New Fight
        </CardTitle>
        <CardDescription>
          Schedule fights between fighters and manage combat rules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fighter Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="fighter1">Fighter 1</Label>
              <Select value={formData.fighter1_id} onValueChange={(value) => setFormData({...formData, fighter1_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Fighter 1" />
                </SelectTrigger>
                <SelectContent>
                  {availableWorlds.map(world => (
                    <div key={world}>
                      <div className="px-2 py-1 text-sm font-medium text-muted-foreground capitalize">
                        {world.replace('-', ' ')}
                      </div>
                      {getFightersByWorld(world).map(fighter => (
                        <SelectItem key={fighter.id} value={fighter.id}>
                          <div className="flex items-center gap-2">
                            <img 
                              src={fighter.image} 
                              alt={fighter.name}
                              className="w-6 h-6 rounded object-cover"
                            />
                            <span>{fighter.name}</span>
                            <span className="text-sm text-muted-foreground">
                              (ATK: {fighter.attack}, DEF: {fighter.defense})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fighter2">Fighter 2</Label>
              <Select value={formData.fighter2_id} onValueChange={(value) => setFormData({...formData, fighter2_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Fighter 2" />
                </SelectTrigger>
                <SelectContent>
                  {availableWorlds.map(world => (
                    <div key={world}>
                      <div className="px-2 py-1 text-sm font-medium text-muted-foreground capitalize">
                        {world.replace('-', ' ')}
                      </div>
                      {getFightersByWorld(world).map(fighter => (
                        <SelectItem key={fighter.id} value={fighter.id}>
                          <div className="flex items-center gap-2">
                            <img 
                              src={fighter.image} 
                              alt={fighter.name}
                              className="w-6 h-6 rounded object-cover"
                            />
                            <span>{fighter.name}</span>
                            <span className="text-sm text-muted-foreground">
                              (ATK: {fighter.attack}, DEF: {fighter.defense})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fighter Preview */}
            {formData.fighter1_id && formData.fighter2_id && (
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Fight Preview</h4>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <img 
                      src={getFighterById(formData.fighter1_id)?.image} 
                      alt="Fighter 1"
                      className="w-16 h-16 rounded object-cover mx-auto mb-2"
                    />
                    <p className="font-medium">{getFighterById(formData.fighter1_id)?.name}</p>
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">VS</div>
                  <div className="text-center">
                    <img 
                      src={getFighterById(formData.fighter2_id)?.image} 
                      alt="Fighter 2"
                      className="w-16 h-16 rounded object-cover mx-auto mb-2"
                    />
                    <p className="font-medium">{getFighterById(formData.fighter2_id)?.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fight Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="fight_type">Fight Type</Label>
              <Select value={formData.fight_type} onValueChange={(value) => setFormData({...formData, fight_type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exhibition">Exhibition</SelectItem>
                  <SelectItem value="tournament">Tournament</SelectItem>
                  <SelectItem value="championship">Championship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.fight_type === 'tournament' && (
              <div>
                <Label htmlFor="tournament">Tournament</Label>
                <Select value={formData.tournament_id} onValueChange={(value) => setFormData({...formData, tournament_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Tournament" />
                  </SelectTrigger>
                  <SelectContent>
                    {tournaments.map(tournament => (
                      <SelectItem key={tournament.id} value={tournament.id}>
                        {tournament.name} ({tournament.world})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Schedule Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.scheduled_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.scheduled_date ? format(formData.scheduled_date, "PPP") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.scheduled_date}
                      onSelect={(date) => setFormData({...formData, scheduled_date: date})}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="scheduled_time">Schedule Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="scheduled_time"
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => setFormData({...formData, venue: e.target.value})}
                placeholder="Fight venue location"
              />
            </div>

            <div>
              <Label htmlFor="max_betting_amount">Max Betting Amount ($)</Label>
              <Input
                id="max_betting_amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.max_betting_amount}
                onChange={(e) => setFormData({...formData, max_betting_amount: e.target.value})}
                placeholder="Maximum bet per user"
              />
            </div>

            <div>
              <Label>Fight Rules</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rounds">Rounds</Label>
                  <Input
                    id="rounds"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.rules.rounds}
                    onChange={(e) => setFormData({
                      ...formData,
                      rules: { ...formData.rules, rounds: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="time_limit">Time Limit (seconds)</Label>
                  <Input
                    id="time_limit"
                    type="number"
                    min="60"
                    max="1800"
                    value={formData.rules.time_limit}
                    onChange={(e) => setFormData({
                      ...formData,
                      rules: { ...formData.rules, time_limit: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <Button onClick={handleCreateFight} disabled={isLoading} className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? 'Creating Fight...' : 'Create Fight'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setFormData({
              fighter1_id: '',
              fighter2_id: '',
              fight_type: 'exhibition',
              scheduled_date: undefined,
              scheduled_time: '',
              venue: '',
              max_betting_amount: '',
              tournament_id: '',
              rules: {
                rounds: 3,
                time_limit: 300,
                victory_conditions: ['knockout', 'submission', 'decision']
              }
            })}
          >
            Reset Form
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}