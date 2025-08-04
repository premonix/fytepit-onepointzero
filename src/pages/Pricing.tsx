import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  Dice6, 
  Globe, 
  Star,
  Check,
  Zap,
  Trophy,
  Palette,
  Users,
  Settings
} from "lucide-react";

import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";

const Pricing = () => {
  const { user } = useAuth();
  const { subscription, createCheckout, openCustomerPortal } = useSubscription();
  const fighterTiers = [
    {
      name: "Free",
      description: "View battles, scout fighters, explore lore",
      price: "$0",
      features: [
        "View all battles",
        "Scout fighter stats",
        "Explore realm lore",
        "Access community forums"
      ],
      icon: Trophy,
      popular: false
    },
    {
      name: "Fractional Stake",
      description: "Buy into a fighter, earn on wins",
      price: "Varies by market",
      priceNote: "(as low as $1)",
      features: [
        "Own shares in fighters",
        "Earn from victories",
        "Vote on fighter decisions",
        "Access to exclusive content"
      ],
      icon: Crown,
      popular: true
    },
    {
      name: "Premium Fighter Packs",
      description: "Get a stake in multiple elite fighters + early access perks",
      price: "Starting from $49",
      features: [
        "Multiple fighter stakes",
        "Early access to new fighters",
        "Premium battle notifications",
        "Exclusive tournaments"
      ],
      icon: Star,
      popular: false
    }
  ];

  const wageringFeatures = [
    { feature: "Match Bets", cost: "As low as $FYTE 1" },
    { feature: "Bonus Bets (Special Win, Round Prediction)", cost: "Optional add-ons, $FYTE 2–10" },
    { feature: "Tournament Brackets", cost: "Entry varies by pool size, starting from $FYTE 25" }
  ];

  const worldCreationPlans = [
    {
      name: "Realm Creator Pass",
      description: "Create 1 custom realm + up to 5 fighters",
      price: "$499 one-time",
      altPrice: "or $55/mo x 12",
      features: [
        "1 custom realm",
        "Up to 5 fighters",
        "Basic customization",
        "Revenue sharing"
      ],
      icon: Globe,
      popular: false
    },
    {
      name: "Pro Realm Builder",
      description: "Add custom lore, terrain skins, earn hosting fees",
      price: "$999 one-time",
      altPrice: "or $99/mo x 12",
      features: [
        "Advanced customization",
        "Custom lore & terrain",
        "Hosting fee earnings",
        "Priority support"
      ],
      icon: Palette,
      popular: true
    },
    {
      name: "Creator Guild DAO Tier",
      description: "DAO-based realm with profit sharing, community voting tools",
      price: "Invite Only",
      altPrice: "Application Required",
      features: [
        "DAO governance",
        "Profit sharing",
        "Community voting",
        "Exclusive access"
      ],
      icon: Users,
      popular: false
    }
  ];

  const addOns = [
    { feature: "Arena Hosting (as a creator)", price: "5% of battle pool (auto-deducted from pot)" },
    { feature: "Custom Trait Design (Per Fighter)", price: "$25" },
    { feature: "Skin or Sponsor Branding", price: "$FYTE 15 per match or seasonal pass available" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Pricing
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Whether you're here to fight, bet, or build — there's a tier for you.
          </motion.p>
          
          {/* Current Subscription Status */}
          {user && (
            <motion.div
              className="mt-8 flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Current Plan:</span>
                <Badge variant={subscription.subscription_tier === 'free' ? 'secondary' : 'default'}>
                  {subscription.subscription_tier === 'free' && <Trophy className="w-3 h-3 mr-1" />}
                  {subscription.subscription_tier === 'fractional' && <Crown className="w-3 h-3 mr-1" />}
                  {subscription.subscription_tier === 'premium' && <Star className="w-3 h-3 mr-1" />}
                  {subscription.subscription_tier.charAt(0).toUpperCase() + subscription.subscription_tier.slice(1)}
                </Badge>
              </div>
              {subscription.subscription_tier !== 'free' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={openCustomerPortal}
                  className="gap-2"
                >
                  <Settings className="w-3 h-3" />
                  Manage Subscription
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Fighter Ownership Tiers */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Fighter Ownership Tiers
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {fighterTiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Card className={`relative h-full ${tier.popular ? 'border-primary shadow-lg' : 'border-border/50'}`}>
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">{tier.name}</CardTitle>
                      <p className="text-muted-foreground">{tier.description}</p>
                      <div className="pt-4">
                        <div className="text-3xl font-bold">{tier.price}</div>
                        {tier.priceNote && (
                          <div className="text-sm text-muted-foreground">{tier.priceNote}</div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="w-full" 
                        variant={tier.popular ? "default" : "outline"}
                        onClick={() => {
                          if (tier.name === "Free") {
                            window.location.href = "/auth";
                          } else if (tier.name === "Fractional Stake") {
                            if (user) {
                              createCheckout('fractional');
                            } else {
                              window.location.href = "/auth";
                            }
                          } else {
                            if (user) {
                              createCheckout('premium');
                            } else {
                              window.location.href = "/auth";
                            }
                          }
                        }}
                      >
                        {tier.name === "Free" ? "Get Started" : user ? "Choose Plan" : "Sign In to Subscribe"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Wagering */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Dice6 className="w-10 h-10 inline-block mr-3 text-primary" />
            Wagering
          </motion.h2>
          <div className="space-y-6">
            {wageringFeatures.map((item, index) => (
              <motion.div
                key={index}
                className="flex justify-between items-center p-6 bg-card rounded-lg border border-border/50"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="font-medium">{item.feature}</div>
                <div className="text-primary font-semibold">{item.cost}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* World Creation */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            World Creation (WorldForge Access)
          </motion.h2>
          <motion.p 
            className="text-center text-muted-foreground mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Realm owners earn ongoing revenue from battles, spectatorship, and skin sponsorships.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-8">
            {worldCreationPlans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Card className={`relative h-full ${plan.popular ? 'border-primary shadow-lg' : 'border-border/50'}`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{plan.description}</p>
                      <div className="pt-4">
                        <div className="text-2xl font-bold">{plan.price}</div>
                        <div className="text-sm text-muted-foreground">{plan.altPrice}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.name === "Creator Guild DAO Tier" ? "Apply Now" : "Get Started"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Optional Add-Ons */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Zap className="w-10 h-10 inline-block mr-3 text-primary" />
            Optional Add-Ons
          </motion.h2>
          <div className="space-y-6">
            {addOns.map((item, index) => (
              <motion.div
                key={index}
                className="flex justify-between items-center p-6 bg-card rounded-lg border border-border/50"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="font-medium">{item.feature}</div>
                <div className="text-primary font-semibold">{item.price}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* No Hidden Fees */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            No hidden fees.
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Everything you pay is either used to build your fighter, fuel your realm, or increase your earnings.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80">
              Let's shape the funnel so players turn into owners — and owners become architects.
            </Button>
          </motion.div>
        </div>
      </section>

      
    </div>
  );
};

export default Pricing;