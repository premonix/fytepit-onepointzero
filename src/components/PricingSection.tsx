import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Trophy, Star, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const PricingSection = () => {
  const pricingTiers = [
    {
      name: "Free",
      description: "View battles & explore lore",
      price: "$0",
      features: ["View all battles", "Scout fighter stats", "Explore realm lore"],
      icon: Trophy,
      popular: false
    },
    {
      name: "Fractional Stake",
      description: "Own shares, earn from wins",
      price: "From $1",
      features: ["Own shares in fighters", "Earn from victories", "Vote on decisions"],
      icon: Crown,
      popular: true
    },
    {
      name: "Premium Packs",
      description: "Multiple elite fighters",
      price: "From $49",
      features: ["Multiple fighter stakes", "Early access", "Exclusive tournaments"],
      icon: Star,
      popular: false
    }
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Choose Your Path
          </h2>
          <p className="text-xl text-muted-foreground">
            Whether you're here to fight, bet, or build — there's a tier for you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingTiers.map((tier, index) => {
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
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">{tier.description}</p>
                    <div className="pt-4">
                      <div className="text-2xl font-bold">{tier.price}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
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
                      asChild
                    >
                      <Link to="/pricing">
                        {tier.name === "Free" ? "Get Started" : "Choose Plan"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Button variant="ghost" size="lg" asChild>
            <Link to="/pricing" className="group">
              View Full Pricing Details
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};