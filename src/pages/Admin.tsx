import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Users, 
  Sword, 
  TrendingUp, 
  Eye, 
  Settings, 
  Database,
  BarChart3,
  UserCheck,
  Crown,
  Plus,
  Edit,
  Trash2,
  Activity,
  DollarSign
} from 'lucide-react';
import { fighters } from '@/data/fighters';
import { worlds } from '@/data/worlds';
import { useToast } from '@/hooks/use-toast';

// Mock admin session
const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const admin = localStorage.getItem('fytepit_admin');
    if (admin) {
      setAdminData(JSON.parse(admin));
      setIsAdmin(true);
    }
  }, []);

  const login = (username: string, password: string) => {
    // Simple admin check - in production this would be server-side
    if (username === 'admin' && password === 'fytepit2024') {
      const adminSession = {
        username,
        loginTime: new Date().toISOString(),
        permissions: ['read', 'write', 'delete']
      };
      localStorage.setItem('fytepit_admin', JSON.stringify(adminSession));
      setAdminData(adminSession);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('fytepit_admin');
    setIsAdmin(false);
    setAdminData(null);
  };

  return { isAdmin, adminData, login, logout };
};

const AdminLogin = ({ onLogin }: { onLogin: (username: string, password: string) => boolean }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(username, password)) {
      toast({
        title: "Login Successful",
        description: "Welcome to FYTEPIT Admin Dashboard",
      });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">FYTEPIT Admin</CardTitle>
          <CardDescription>Sign in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4 p-3 bg-muted rounded text-sm">
            <strong>Demo Credentials:</strong><br />
            Username: admin<br />
            Password: fytepit2024
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Mock stats
  const stats = {
    totalUsers: 1247,
    activeFights: 8,
    totalRevenue: 45890,
    avgFightDuration: 4.2,
    topFighter: 'Velora',
    totalFighters: fighters.length,
    totalRealms: worlds.length
  };

  const mockUsers = [
    { id: 1, username: 'PitMaster79', email: 'user1@example.com', joinDate: '2024-01-15', status: 'active' },
    { id: 2, username: 'RelicStaker', email: 'user2@example.com', joinDate: '2024-01-20', status: 'active' },
    { id: 3, username: 'ShadowBetter', email: 'user3@example.com', joinDate: '2024-02-01', status: 'suspended' },
  ];

  const mockTransactions = [
    { id: 1, user: 'PitMaster79', type: 'Fighter Purchase', amount: 150, date: '2024-01-25' },
    { id: 2, user: 'RelicStaker', type: 'Bet Placed', amount: 50, date: '2024-01-25' },
    { id: 3, user: 'ShadowBetter', type: 'Share Purchase', amount: 200, date: '2024-01-24' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">FYTEPIT Admin</h1>
              <p className="text-sm text-muted-foreground">Platform Management Dashboard</p>
            </div>
          </div>
          <Button onClick={onLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fighters">Fighters</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="transactions">Finance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-3xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Fights</p>
                      <p className="text-3xl font-bold">{stats.activeFights}</p>
                    </div>
                    <Activity className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revenue ($FYTE)</p>
                      <p className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Top Fighter</p>
                      <p className="text-3xl font-bold">{stats.topFighter}</p>
                    </div>
                    <Crown className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveTab('fighters')}
                    className="h-16 flex flex-col gap-2"
                  >
                    <Sword className="w-6 h-6" />
                    Manage Fighters
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('users')}
                    variant="outline"
                    className="h-16 flex flex-col gap-2"
                  >
                    <Users className="w-6 h-6" />
                    View Users
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('analytics')}
                    variant="outline"
                    className="h-16 flex flex-col gap-2"
                  >
                    <BarChart3 className="w-6 h-6" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fighters" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Fighter Management</h2>
                <p className="text-muted-foreground">Manage fighters across all realms</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Fighter
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Fighter</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                      <Label htmlFor="name">Fighter Name</Label>
                      <Input id="name" placeholder="Enter fighter name" />
                    </div>
                    <div>
                      <Label htmlFor="realm">Realm</Label>
                      <select className="w-full p-2 border rounded">
                        {worlds.map(world => (
                          <option key={world.id} value={world.id}>{world.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="attack">Attack</Label>
                      <Input id="attack" type="number" placeholder="0-100" />
                    </div>
                    <div>
                      <Label htmlFor="defense">Defense</Label>
                      <Input id="defense" type="number" placeholder="0-100" />
                    </div>
                  </div>
                  <Button onClick={() => toast({ title: "Fighter Created", description: "New fighter added successfully" })}>
                    Create Fighter
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fighter</TableHead>
                      <TableHead>Realm</TableHead>
                      <TableHead>Record</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fighters.slice(0, 10).map((fighter) => (
                      <TableRow key={fighter.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img src={fighter.image} alt={fighter.name} className="w-8 h-8 rounded object-cover" />
                            <div>
                              <div className="font-medium">{fighter.name}</div>
                              <div className="text-sm text-muted-foreground">{fighter.specialMove}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {worlds.find(w => w.id === fighter.world)?.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-green-600">{fighter.wins}</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-red-600">{fighter.losses}</span>
                        </TableCell>
                        <TableCell>${fighter.valuePerShare}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">User Management</h2>
              <p className="text-muted-foreground">Monitor and manage platform users</p>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                              {user.username.charAt(0)}
                            </div>
                            <div className="font-medium">{user.username}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Platform Analytics</h2>
              <p className="text-muted-foreground">Performance metrics and insights</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fighter Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fighters.slice(0, 5).map((fighter, index) => {
                      const winRate = (fighter.wins / (fighter.wins + fighter.losses)) * 100;
                      return (
                        <div key={fighter.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-mono">#{index + 1}</span>
                            <span className="font-medium">{fighter.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={winRate} className="w-20" />
                            <span className="text-sm">{winRate.toFixed(0)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Realm Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {worlds.map((world) => {
                      const fighterCount = fighters.filter(f => f.world === world.id).length;
                      const percentage = (fighterCount / fighters.length) * 100;
                      return (
                        <div key={world.id} className="flex items-center justify-between">
                          <span className="font-medium">{world.name}</span>
                          <div className="flex items-center gap-3">
                            <Progress value={percentage} className="w-20" />
                            <span className="text-sm">{fighterCount} fighters</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Financial Management</h2>
              <p className="text-muted-foreground">Transaction history and revenue tracking</p>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono">#{transaction.id.toString().padStart(6, '0')}</TableCell>
                        <TableCell>{transaction.user}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>${transaction.amount}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Platform Settings</h2>
              <p className="text-muted-foreground">Configure platform parameters</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fight Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fight-duration">Default Fight Duration (minutes)</Label>
                    <Input id="fight-duration" type="number" defaultValue="5" />
                  </div>
                  <div>
                    <Label htmlFor="bet-limit">Maximum Bet Amount</Label>
                    <Input id="bet-limit" type="number" defaultValue="1000" />
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Maintenance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Database className="w-4 h-4 mr-2" />
                    Backup Data
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    System Status
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Maintenance Mode
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Admin = () => {
  const { isAdmin, login, logout } = useAdminAuth();

  if (!isAdmin) {
    return <AdminLogin onLogin={login} />;
  }

  return <AdminDashboard onLogout={logout} />;
};

export default Admin;