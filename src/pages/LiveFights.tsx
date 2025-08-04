import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Eye, 
  Users, 
  DollarSign, 
  Clock, 
  Zap,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { fighters } from '@/data/fighters';

interface LiveFightSummary {
  id: string;
  fighter1Name: string;
  fighter2Name: string;
  fighter1Image: string;
  fighter2Image: string;
  status: 'upcoming' | 'live' | 'completed';
  spectators: number;
  totalBets: number;
  scheduledAt?: Date;
  winner?: string;
}

export default function LiveFights() {
  const [liveFights, setLiveFights] = useState<LiveFightSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadLiveFights();
  }, []);

  const loadLiveFights = async () => {
    try {
      const { data: fightsData, error } = await supabase
        .from('fights')
        .select(`
          *,
          fighter1:fighters!fighter1_id(*),
          fighter2:fighters!fighter2_id(*)
        `)
        .in('status', ['upcoming', 'live', 'completed'])
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        throw error;
      }

      const fightSummaries: LiveFightSummary[] = fightsData.map(fight => ({
        id: fight.id,
        fighter1Name: fight.fighter1.name,
        fighter2Name: fight.fighter2.name,
        fighter1Image: fight.fighter1.image,
        fighter2Image: fight.fighter2.image,
        status: fight.status as 'upcoming' | 'live' | 'completed',
        spectators: Math.floor(Math.random() * 500) + 50, // Mock data
        totalBets: fight.total_pot || 0,
        scheduledAt: fight.scheduled_at ? new Date(fight.scheduled_at) : undefined,
        winner: fight.winner_id === fight.fighter1_id ? fight.fighter1.name : 
               fight.winner_id === fight.fighter2_id ? fight.fighter2.name : undefined
      }));

      setLiveFights(fightSummaries);
    } catch (error) {
      console.error('Failed to load live fights:', error);
      toast({
        title: "Error",
        description: "Failed to load live fights",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createRandomFight = async () => {
    try {
      // First, get all fighters that actually exist in the database
      const { data: dbFighters, error: fetchError } = await supabase
        .from('fighters')
        .select('id, name');

      if (fetchError) {
        throw fetchError;
      }

      if (!dbFighters || dbFighters.length < 2) {
        throw new Error('Not enough fighters in database to create a fight');
      }

      // Select two random fighters from database fighters
      const shuffled = [...dbFighters].sort(() => 0.5 - Math.random());
      const fighter1 = shuffled[0];
      const fighter2 = shuffled[1];

      

      const { data, error } = await supabase
        .rpc('admin_create_fight', {
          _fighter1_id: fighter1.id,
          _fighter2_id: fighter2.id,
          _fight_type: 'exhibition',
          _scheduled_at: null,
          _venue: 'Live Arena'
        });

      if (error) {
        console.error('Fight creation error:', error);
        throw error;
      }

      toast({
        title: "Fight Created!",
        description: `${fighter1.name} vs ${fighter2.name} - Ready to go live!`,
      });

      // Reload the fights list
      await loadLiveFights();

      // Navigate to the new fight
      navigate(`/live-fight/${data}`);
    } catch (error) {
      console.error('Failed to create fight:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create fight",
        variant: "destructive"
      });
    }
  };

  const FightCard = ({ fight }: { fight: LiveFightSummary }) => {
    const getStatusColor = () => {
      switch (fight.status) {
        case 'live': return 'destructive';
        case 'upcoming': return 'secondary';
        case 'completed': return 'outline';
        default: return 'outline';
      }
    };

    const getStatusIcon = () => {
      switch (fight.status) {
        case 'live': return <Activity className="w-3 h-3 animate-pulse" />;
        case 'upcoming': return <Clock className="w-3 h-3" />;
        case 'completed': return <TrendingUp className="w-3 h-3" />;
        default: return null;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="w-full"
      >
        <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
          fight.status === 'live' ? 'border-primary ring-1 ring-primary/20' : ''
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge variant={getStatusColor()} className="flex items-center gap-1">
                {getStatusIcon()}
                {fight.status.toUpperCase()}
              </Badge>
              
              {fight.status === 'live' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{fight.spectators}</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Fighters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <img 
                  src={fight.fighter1Image} 
                  alt={fight.fighter1Name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-border"
                />
                <div>
                  <div className="font-semibold text-sm">{fight.fighter1Name}</div>
                  {fight.status === 'completed' && fight.winner === fight.fighter1Name && (
                    <Badge variant="default" className="text-xs">WINNER</Badge>
                  )}
                </div>
              </div>

              <div className="text-2xl font-bold text-primary mx-4">VS</div>

              <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="text-right">
                  <div className="font-semibold text-sm">{fight.fighter2Name}</div>
                  {fight.status === 'completed' && fight.winner === fight.fighter2Name && (
                    <Badge variant="default" className="text-xs">WINNER</Badge>
                  )}
                </div>
                <img 
                  src={fight.fighter2Image} 
                  alt={fight.fighter2Name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-border"
                />
              </div>
            </div>

            {/* Fight Info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <DollarSign className="w-3 h-3" />
                <span>${fight.totalBets.toLocaleString()}</span>
              </div>
              
              {fight.scheduledAt && fight.status === 'upcoming' && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>{fight.scheduledAt.toLocaleTimeString()}</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button 
              className="w-full" 
              variant={fight.status === 'live' ? 'default' : 'outline'}
              onClick={() => navigate(`/live-fight/${fight.id}`)}
            >
              {fight.status === 'live' && <Eye className="w-4 h-4 mr-2" />}
              {fight.status === 'upcoming' && <Clock className="w-4 h-4 mr-2" />}
              {fight.status === 'completed' && <TrendingUp className="w-4 h-4 mr-2" />}
              
              {fight.status === 'live' ? 'Watch Live' : 
               fight.status === 'upcoming' ? 'View Details' : 
               'View Results'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const liveFightsData = liveFights.filter(f => f.status === 'live');
  const upcomingFights = liveFights.filter(f => f.status === 'upcoming');
  const completedFights = liveFights.filter(f => f.status === 'completed');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Context Info */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Activity className="w-3 h-3 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground font-semibold text-sm mb-1">Multiplayer Arena</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              The Live Arena hosts <span className="text-primary font-semibold">real multiplayer fights</span> with live streaming, community betting, and actual rewards. These fights use WebSocket connections for real-time updates and are backed by the database for persistent results and leaderboards.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Arena</h1>
          <p className="text-muted-foreground">Real-time fights happening now</p>
        </div>
        
        <Button onClick={createRandomFight} className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Start Random Fight
        </Button>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{liveFightsData.length}</div>
                <div className="text-sm text-muted-foreground">Live Now</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">
                  {liveFightsData.reduce((sum, f) => sum + f.spectators, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Viewers</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  ${liveFights.reduce((sum, f) => sum + f.totalBets, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Bets</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fight Tabs */}
      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Live ({liveFightsData.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Upcoming ({upcomingFights.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Completed ({completedFights.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          {liveFightsData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Live Fights</h3>
                <p className="text-muted-foreground mb-4">
                  No fights are currently in progress. Start one now!
                </p>
                <Button onClick={createRandomFight}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Fight
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveFightsData.map(fight => (
                <FightCard key={fight.id} fight={fight} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingFights.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Fights</h3>
                <p className="text-muted-foreground">No fights are scheduled.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingFights.map(fight => (
                <FightCard key={fight.id} fight={fight} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedFights.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Completed Fights</h3>
                <p className="text-muted-foreground">No fights have been completed yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedFights.map(fight => (
                <FightCard key={fight.id} fight={fight} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}