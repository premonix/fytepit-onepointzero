import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Bell, X, CheckCircle, AlertCircle, Info, Trophy, DollarSign } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

const notificationIcons = {
  'bet_won': Trophy,
  'bet_lost': AlertCircle,
  'achievement': Trophy,
  'fight_result': CheckCircle,
  'balance_update': DollarSign,
  'system': Info,
};

const notificationColors = {
  'bet_won': 'border-green-500/50 bg-green-500/5',
  'bet_lost': 'border-red-500/50 bg-red-500/5',
  'achievement': 'border-yellow-500/50 bg-yellow-500/5',
  'fight_result': 'border-blue-500/50 bg-blue-500/5',
  'balance_update': 'border-purple-500/50 bg-purple-500/5',
  'system': 'border-gray-500/50 bg-gray-500/5',
};

export function RealtimeNotifications() {
  const { user } = useAuth();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
  };

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  if (isLoading || !notifications?.length) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm space-y-2">
      <AnimatePresence>
        {notifications
          .filter(n => !n.is_read)
          .slice(0, 3) // Show max 3 notifications
          .map((notification) => {
            const IconComponent = notificationIcons[notification.type as keyof typeof notificationIcons] || Info;
            const colorClass = notificationColors[notification.type as keyof typeof notificationColors] || notificationColors.system;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 300, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className={`${colorClass} border backdrop-blur-sm shadow-lg`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-semibold">
                              {notification.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-background/20"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            {notification.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
      </AnimatePresence>
      
      {unreadCount > 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Badge variant="secondary" className="text-xs">
            +{unreadCount - 3} more notifications
          </Badge>
        </motion.div>
      )}
    </div>
  );
}