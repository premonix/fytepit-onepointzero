import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, useUserTransactions, useUserBets } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  User, 
  Trophy, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Bell,
  Settings,
  Sword,
  BarChart3,
  History,
  CreditCard,
  ArrowUpDown
} from 'lucide-react';

interface UserProfile {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  total_balance: number;
  created_at: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  earned_at?: string;
}

interface FighterOwnership {
  fighter_id: string;
  shares: number;
  total_investment: number;
  fighter: {
    name: string;
    image: string;
    world: string;
    value_per_share: number;
  };
}

interface BetHistory {
  id: string;
  amount: number;
  odds: number;
  status: string;
  potential_payout: number;
  payout: number;
  created_at: string;
  fighter_id: string;
  fight: {
    fighter1_id: string;
    fighter2_id: string;
    status: string;
    winner_id: string;
  };
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Use unified data hooks
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: transactions, isLoading: transactionsLoading } = useUserTransactions();
  const { data: bets, isLoading: betsLoading } = useUserBets();
  
  // Keep existing state for other features
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [fighterOwnerships, setFighterOwnerships] = useState<FighterOwnership[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileData) {
        setFormData({
          username: profileData.username || '',
          display_name: profileData.display_name || '',
          bio: profileData.bio || ''
        });
      }

      // Fetch user achievements
      const { data: achievementsData } = await supabase
        .from('user_achievements')
        .select(`
          earned_at,
          achievement:achievements (
            id, name, description, icon, category, points
          )
        `)
        .eq('user_id', user?.id);

      if (achievementsData) {
        const userAchievements = achievementsData.map(item => ({
          ...item.achievement,
          earned_at: item.earned_at
        }));
        setAchievements(userAchievements);
      }

      // Fetch fighter ownerships
      const { data: ownershipData } = await supabase
        .from('user_fighters')
        .select(`
          fighter_id,
          shares,
          total_investment,
          fighter:fighters (
            name, image, world, value_per_share
          )
        `)
        .eq('user_id', user?.id);

      if (ownershipData) {
        setFighterOwnerships(ownershipData);
      }

      // Fetch bet history
      const { data: betsData } = await supabase
        .from('bets')
        .select(`
          *,
          fight:fights (
            fighter1_id, fighter2_id, status, winner_id
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Bets are now handled by useUserBets hook

      // Fetch notifications
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (notificationsData) {
        setNotifications(notificationsData);
      }

    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          display_name: formData.display_name,
          bio: formData.bio
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });

      setIsEditing(false);
      fetchProfileData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Profile not found</div>
      </div>
    );
  }

  const totalAchievementPoints = achievements.reduce((sum, ach) => sum + ach.points, 0);
  const totalPortfolioValue = fighterOwnerships.reduce(
    (sum, ownership) => sum + (ownership.shares * ownership.fighter.value_per_share), 0
  );

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto p-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="bg-gradient-primary text-white text-xl">
                    {profile.display_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white">
                    {profile.display_name || profile.username}
                  </h1>
                  <p className="text-gray-400">@{profile.username}</p>
                  <p className="text-gray-300 mt-2">{profile.bio}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">
                    {profile.total_balance.toLocaleString()} Credits
                  </div>
                  <div className="text-sm text-gray-400">
                    Member since {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-yellow-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Achievement Points</p>
                  <p className="text-2xl font-bold text-white">{totalAchievementPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Sword className="h-8 w-8 text-red-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Fighters Owned</p>
                  <p className="text-2xl font-bold text-white">{fighterOwnerships.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Portfolio Value</p>
                  <p className="text-2xl font-bold text-white">{totalPortfolioValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Total Bets</p>
                  <p className="text-2xl font-bold text-white">{bets?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="fighters" className="data-[state=active]:bg-gray-700">
              <Sword className="w-4 h-4 mr-2" />
              My Fighters
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gray-700">
              <History className="w-4 h-4 mr-2" />
              Bet History
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-gray-700">
              <CreditCard className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-gray-700">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-700">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {notifications.filter(n => !n.is_read).length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {notifications.filter(n => !n.is_read).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Activity Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <p className="text-white font-medium">{achievement.name}</p>
                          <p className="text-sm text-gray-400">{achievement.points} points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Top Fighters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {fighterOwnerships.slice(0, 3).map((ownership) => (
                      <div key={ownership.fighter_id} className="flex items-center space-x-3">
                        <img 
                          src={ownership.fighter.image} 
                          alt={ownership.fighter.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-white font-medium">{ownership.fighter.name}</p>
                          <p className="text-sm text-gray-400">{ownership.shares} shares</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fighters" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fighterOwnerships.map((ownership) => (
                <Card key={ownership.fighter_id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <img 
                      src={ownership.fighter.image} 
                      alt={ownership.fighter.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-bold text-white mb-2">{ownership.fighter.name}</h3>
                    <Badge variant="outline" className="mb-3">
                      {ownership.fighter.world}
                    </Badge>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Shares:</span>
                        <span className="text-white">{ownership.shares}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Value per Share:</span>
                        <span className="text-white">{ownership.fighter.value_per_share}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Value:</span>
                        <span className="text-green-400">
                          {(ownership.shares * ownership.fighter.value_per_share).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Investment:</span>
                        <span className="text-white">{ownership.total_investment.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Betting History</CardTitle>
                <CardDescription>Your recent bets and their outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bets?.map((bet) => (
                    <div key={bet.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Bet Amount: {bet.amount}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(bet.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={bet.status === 'won' ? 'default' : bet.status === 'lost' ? 'destructive' : 'secondary'}
                        >
                          {bet.status}
                        </Badge>
                        {bet.payout && (
                          <p className="text-sm text-green-400 mt-1">
                            Payout: {bet.payout}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Transaction History</CardTitle>
                <CardDescription>Your recent financial transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading transactions...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-400">Type</TableHead>
                        <TableHead className="text-gray-400">Amount</TableHead>
                        <TableHead className="text-gray-400">Description</TableHead>
                        <TableHead className="text-gray-400">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions?.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <Badge 
                              variant={
                                transaction.type.includes('payout') || transaction.type.includes('winnings') 
                                  ? 'default' 
                                  : transaction.type.includes('bet') || transaction.type.includes('purchase')
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {transaction.type.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className={`font-mono ${
                            transaction.type.includes('payout') || transaction.type.includes('winnings')
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}>
                            {transaction.type.includes('payout') || transaction.type.includes('winnings') ? '+' : '-'}
                            {transaction.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {transaction.description || 'No description'}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3 className="text-lg font-bold text-white mb-2">{achievement.name}</h3>
                      <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                      <Badge variant="outline" className="mb-2">
                        {achievement.category}
                      </Badge>
                      <div className="text-yellow-400 font-bold">
                        {achievement.points} points
                      </div>
                      {achievement.earned_at && (
                        <p className="text-xs text-gray-500 mt-2">
                          Earned: {new Date(achievement.earned_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        notification.is_read 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-blue-900/20 border-blue-600'
                      }`}
                      onClick={() => !notification.is_read && markNotificationAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">{notification.title}</h4>
                          <p className="text-gray-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Profile Settings</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm text-gray-400">Username</label>
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Display Name</label>
                      <Input
                        value={formData.display_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Bio</label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <Button onClick={handleUpdateProfile}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Username</label>
                        <p className="text-white">{profile.username || 'Not set'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Display Name</label>
                        <p className="text-white">{profile.display_name || 'Not set'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Bio</label>
                        <p className="text-white">{profile.bio || 'No bio set'}</p>
                      </div>
                    </div>
                    <Button onClick={() => setIsEditing(true)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;