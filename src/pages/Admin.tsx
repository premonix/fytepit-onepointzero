import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserManagement } from '@/components/UserManagement';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  Shield, 
  Database, 
  Activity, 
  Settings, 
  Crown,
  BarChart3
} from 'lucide-react';

export default function Admin() {
  const { user } = useAuth();
  const { userRole, isAdmin, isSuperAdmin } = useUserRole();

  console.log('Admin page loaded - userRole:', userRole, 'isAdmin:', isAdmin(), 'isSuperAdmin:', isSuperAdmin());

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Platform management and oversight</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={userRole === 'super_admin' ? 'destructive' : 'default'}>
              {userRole === 'super_admin' && <Crown className="w-3 h-3 mr-1" />}
              {userRole.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Admin Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Fights</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            {isAdmin() && <TabsTrigger value="fighters">Fighter Management</TabsTrigger>}
            {isAdmin() && <TabsTrigger value="fights">Fight Management</TabsTrigger>}
            {isSuperAdmin() && <TabsTrigger value="system">System Settings</TabsTrigger>}
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          {isAdmin() && (
            <TabsContent value="fighters" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fighter Management</CardTitle>
                  <CardDescription>
                    Manage fighters, their stats, and availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Fighter management interface coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {isAdmin() && (
            <TabsContent value="fights" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fight Management</CardTitle>
                  <CardDescription>
                    Schedule fights, manage tournaments, and view results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Fight management interface coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {isSuperAdmin() && (
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    System Settings
                  </CardTitle>
                  <CardDescription>
                    Platform configuration and advanced settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">System settings interface coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}