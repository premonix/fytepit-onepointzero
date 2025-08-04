import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription, SubscriptionTier } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { Crown, Star, Lock } from 'lucide-react';

interface SubscriptionGateProps {
  children: ReactNode;
  requiredTier: SubscriptionTier;
  title?: string;
  description?: string;
}

export function SubscriptionGate({ 
  children, 
  requiredTier, 
  title = "Premium Feature", 
  description = "This feature requires a subscription upgrade." 
}: SubscriptionGateProps) {
  const { user } = useAuth();
  const { subscription, hasAccess, createCheckout } = useSubscription();

  // Always allow free tier access
  if (requiredTier === 'free' || hasAccess(requiredTier)) {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <Card className="border-primary/20">
        <CardHeader className="text-center">
          <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>Please sign in to access this feature</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getTierInfo = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'fractional':
        return {
          name: 'Fractional Stake',
          price: '$9.99/month',
          icon: Crown,
          color: 'bg-blue-500'
        };
      case 'premium':
        return {
          name: 'Premium Fighter Packs',
          price: '$49.99/month',
          icon: Star,
          color: 'bg-purple-500'
        };
      default:
        return {
          name: 'Free',
          price: '$0/month',
          icon: Lock,
          color: 'bg-gray-500'
        };
    }
  };

  const tierInfo = getTierInfo(requiredTier);
  const Icon = tierInfo.icon;

  return (
    <Card className="border-primary/20">
      <CardHeader className="text-center">
        <div className={`w-16 h-16 rounded-full ${tierInfo.color} flex items-center justify-center mx-auto mb-4`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          {title}
          <Badge variant="outline">{tierInfo.name} Required</Badge>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-sm text-muted-foreground">
          Current Plan: <Badge variant="secondary">{subscription.subscription_tier}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Upgrade to <strong>{tierInfo.name}</strong> for {tierInfo.price}
        </div>
        <Button 
          onClick={() => createCheckout(requiredTier as 'fractional' | 'premium')}
          className="w-full"
        >
          Upgrade to {tierInfo.name}
        </Button>
      </CardContent>
    </Card>
  );
}