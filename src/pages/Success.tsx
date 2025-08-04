import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { CheckCircle, Crown, Star, ArrowRight } from 'lucide-react';

export default function Success() {
  const { subscription, refreshSubscription } = useSubscription();

  useEffect(() => {
    // Refresh subscription status when page loads
    const timer = setTimeout(() => {
      refreshSubscription();
    }, 2000);

    return () => clearTimeout(timer);
  }, [refreshSubscription]);

  const getTierInfo = () => {
    switch (subscription.subscription_tier) {
      case 'fractional':
        return {
          name: 'Fractional Stake',
          icon: Crown,
          color: 'text-blue-500',
          benefits: [
            'Own shares in fighters',
            'Earn from victories',
            'Vote on fighter decisions',
            'Access to exclusive content'
          ]
        };
      case 'premium':
        return {
          name: 'Premium Fighter Packs',
          icon: Star,
          color: 'text-purple-500',
          benefits: [
            'Multiple fighter stakes',
            'Early access to new fighters',
            'Premium battle notifications',
            'Exclusive tournaments'
          ]
        };
      default:
        return {
          name: 'Free',
          icon: CheckCircle,
          color: 'text-gray-500',
          benefits: [
            'View all battles',
            'Scout fighter stats',
            'Explore realm lore',
            'Access community forums'
          ]
        };
    }
  };

  const tierInfo = getTierInfo();
  const Icon = tierInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-primary/20 bg-background/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className="mx-auto"
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
              </motion.div>
              
              <div>
                <CardTitle className="text-3xl mb-2">Payment Successful!</CardTitle>
                <p className="text-muted-foreground">
                  Welcome to your new subscription tier
                </p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Icon className={`w-5 h-5 ${tierInfo.color}`} />
                <Badge variant="default" className="text-lg px-4 py-2">
                  {tierInfo.name}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">What you now have access to:</h3>
                <ul className="space-y-2">
                  {tierInfo.benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1"
                  onClick={() => window.location.href = '/'}
                >
                  Explore Arena
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/pit'}
                >
                  Start Fighting
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Your subscription is now active and will automatically renew monthly.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}