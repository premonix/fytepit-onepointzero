import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export type SubscriptionTier = 'free' | 'fractional' | 'premium';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: SubscriptionTier;
  subscription_end: string | null;
}

export function useSubscription() {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscribed: true,
    subscription_tier: 'free',
    subscription_end: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && session) {
      checkSubscription();
    }
  }, [user, session]);

  const checkSubscription = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setSubscription(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (tier: 'fractional' | 'premium') => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Checkout Error",
        description: "Failed to create checkout session",
        variant: "destructive"
      });
    }
  };

  const openCustomerPortal = async () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage subscription",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // Open customer portal in a new tab
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Portal Error",
        description: "Failed to open customer portal",
        variant: "destructive"
      });
    }
  };

  const hasAccess = (requiredTier: SubscriptionTier): boolean => {
    const tierHierarchy: Record<SubscriptionTier, number> = {
      'free': 1,
      'fractional': 2,
      'premium': 3
    };

    return tierHierarchy[subscription.subscription_tier] >= tierHierarchy[requiredTier];
  };

  const refreshSubscription = () => {
    checkSubscription();
  };

  return {
    subscription,
    loading,
    createCheckout,
    openCustomerPortal,
    hasAccess,
    refreshSubscription
  };
}