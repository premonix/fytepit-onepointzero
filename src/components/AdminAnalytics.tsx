import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, Users, DollarSign, Trophy, AlertTriangle, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  total_users: number;
  active_users: number;
  banned_users: number;
  total_fighters: number;
  total_fights: number;
  completed_fights: number;
  pending_fights: number;
  total_bets: number;
  total_bet_amount: number;
  total_transactions: number;
  total_revenue: number;
  pending_reports: number;
  users_by_role: Record<string, number>;
  recent_activity: Array<{
    type: string;
    timestamp: string;
    user_email: string;
  }>;
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_admin_analytics');
      
      if (error) throw error;
      setAnalytics(data as unknown as AnalyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Analytics
          </CardTitle>
          <CardDescription>Loading analytics data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Analytics
          </CardTitle>
          <CardDescription>Failed to load analytics data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: analytics.total_users,
      icon: Users,
      description: `${analytics.active_users} active, ${analytics.banned_users} banned`,
      variant: "default" as const
    },
    {
      title: "Total Revenue",
      value: `$${analytics.total_revenue.toLocaleString()}`,
      icon: DollarSign,
      description: `From ${analytics.total_transactions} transactions`,
      variant: "default" as const
    },
    {
      title: "Total Fights",
      value: analytics.total_fights,
      icon: Trophy,
      description: `${analytics.completed_fights} completed, ${analytics.pending_fights} pending`,
      variant: "default" as const
    },
    {
      title: "Total Bets",
      value: analytics.total_bets,
      icon: TrendingUp,
      description: `$${analytics.total_bet_amount.toLocaleString()} total wagered`,
      variant: "default" as const
    },
    {
      title: "Pending Reports",
      value: analytics.pending_reports,
      icon: AlertTriangle,
      description: "Require moderation",
      variant: analytics.pending_reports > 0 ? "destructive" as const : "default" as const
    },
    {
      title: "Fighters",
      value: analytics.total_fighters,
      icon: Users,
      description: "Across all realms",
      variant: "default" as const
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Analytics
          </CardTitle>
          <CardDescription>
            Real-time platform statistics and user activity metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.description}
                      </p>
                    </div>
                    <stat.icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <Card>
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
            <CardDescription>Distribution of user roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.users_by_role || {}).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      role === 'super_admin' ? 'destructive' :
                      role === 'admin' ? 'default' : 'secondary'
                    }>
                      {role.replace('_', ' ')}
                    </Badge>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recent_activity?.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{activity.type.replace('_', ' ')}</p>
                    <p className="text-muted-foreground">{activity.user_email}</p>
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              )) || (
                <p className="text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}