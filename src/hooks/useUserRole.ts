import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user';

export function useUserRole() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserRole('user');
      setLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        console.log('Fetching user role for user:', user.id, user.email);
        const { data, error } = await supabase.rpc('get_user_role', {
          _user_id: user.id
        });

        console.log('Role fetch result:', { data, error });

        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole('user');
        } else {
          console.log('Setting user role to:', data || 'user');
          setUserRole(data || 'user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const hasRole = (role: UserRole): boolean => {
    const roleHierarchy: Record<UserRole, number> = {
      'user': 1,
      'admin': 2,
      'super_admin': 3
    };

    return roleHierarchy[userRole] >= roleHierarchy[role];
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isSuperAdmin = (): boolean => hasRole('super_admin');

  return {
    userRole,
    loading,
    hasRole,
    isAdmin,
    isSuperAdmin
  };
}