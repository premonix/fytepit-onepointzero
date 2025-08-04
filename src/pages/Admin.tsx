import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserManagement } from '@/components/UserManagement';
import { FighterManagement } from '@/components/FighterManagement';
import { FightManagement } from '@/components/FightManagement';
import { SystemSettings } from '@/components/SystemSettings';
import { ContentModeration } from '@/components/ContentModeration';
import { AdminAnalytics } from '@/components/AdminAnalytics';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  Shield, 
  Database, 
  Activity, 
  Settings, 
  Crown,
  BarChart3,
  Swords,
  Trophy,
  AlertTriangle
} from 'lucide-react';

console.log('Admin.tsx file loaded');

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

        {/* Admin Analytics */}
        <AdminAnalytics />

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            {isAdmin() && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
            {isAdmin() && <TabsTrigger value="fighters">Fighter Management</TabsTrigger>}
            {isAdmin() && <TabsTrigger value="fights">Fight Management</TabsTrigger>}
            {isAdmin() && <TabsTrigger value="moderation">Content Moderation</TabsTrigger>}
            {isSuperAdmin() && <TabsTrigger value="system">System Settings</TabsTrigger>}
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          {isAdmin() && (
            <TabsContent value="analytics" className="space-y-6">
              <AdminAnalytics />
            </TabsContent>
          )}

          {isAdmin() && (
            <TabsContent value="fighters" className="space-y-6">
              <FighterManagement />
            </TabsContent>
          )}

          {isAdmin() && (
            <TabsContent value="fights" className="space-y-6">
              <FightManagement />
            </TabsContent>
          )}

          {isAdmin() && (
            <TabsContent value="moderation" className="space-y-6">
              <ContentModeration />
            </TabsContent>
          )}

          {isSuperAdmin() && (
            <TabsContent value="system" className="space-y-6">
              <SystemSettings />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}