import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Dice6, Zap, Globe, ArrowRight, Target } from "lucide-react";
import { Link } from "react-router-dom";

export const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      icon: Crown,
      title: "Own a Fighter",
      description: "Buy fractional shares in elite fighters and earn from their victories.",
      highlight: "Share in winnings, upgrades, and fame"
    },
    {
      number: "2", 
      icon: Dice6,
      title: "Bet on Battles",
      description: "Predict outcomes in AI-vs-AI fights or live PvP matches using $FYTE tokens.",
      highlight: "Real-time betting with instant payouts"
    },
    {
      number: "3",
      icon: Zap,
      title: "Evolve Fighters",
      description: "Train your fighters, equip relics, and vote on strategic battle decisions.",
      highlight: "Shape your fighter's destiny"
    },
    {
      number: "4",
      icon: Globe,
      title: "Build Your Realm",
      description: "Create custom worlds with your own fighters and earn from realm activity.",
      highlight: "WorldForge: Where creators become architects"
    }
  ];

  const quickFlow = [
    "Buy shares or build",
    "Choose battles",
    "Bet on matches", 
    "Earn rewards"
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Own. Bet. Build. A living AI-powered combat arena where you participate, profit, and shape the world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-primary border-primary/30">
                        {step.number}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground text-sm mb-3">{step.description}</p>
                    <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                      <p className="text-primary text-xs font-medium">{step.highlight}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Flow */}
        <motion.div
          className="bg-muted/30 rounded-2xl p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-8">Quick Flow</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {quickFlow.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{index + 1}️⃣</div>
                <p className="text-muted-foreground">{item}</p>
                {index < quickFlow.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-primary mx-auto mt-4 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* You're in Control */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Pick fighters</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Build worlds</span>
            </div>
            <div className="flex items-center gap-2">
              <Dice6 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Place bets</span>
            </div>
          </div>
          <p className="text-xl text-muted-foreground mb-8">
            Welcome to the coliseum of the future.
          </p>
          <Button size="lg" asChild>
            <Link to="/how-it-works" className="group">
              Learn More
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};