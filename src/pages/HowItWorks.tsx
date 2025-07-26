import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  Dice6, 
  Zap, 
  Globe, 
  ArrowRight,
  Trophy,
  Target,
  Brain,
  Gamepad2
} from "lucide-react";
import { Footer } from "@/components/Footer";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      icon: Crown,
      title: "Own a Fighter",
      description: "Every champion in FYTEPIT is a unique, battle-ready digital fighter with their own stats, traits, and legacy.",
      features: [
        "Buy fractional shares in fighters through tokenized ownership",
        "Share in their winnings, upgrades, and fame",
        "The better they perform, the more you earn"
      ],
      example: 'You own 1% of "Velora". She wins a tournament. You get 1% of the prize pool.'
    },
    {
      number: "2",
      icon: Dice6,
      title: "Bet on the Outcome",
      description: "You can bet on AI-vs-AI fights or live PvP matches using our $FYTE token.",
      features: [
        "Predict the winner, round, or special conditions",
        "Watch the match unfold live with real-time commentary",
        "Win payouts instantly when the dust settles"
      ],
      example: "Odds are calculated by fighter stats, past performance, and trait matchups."
    },
    {
      number: "3",
      icon: Zap,
      title: "Fighters Evolve Over Time",
      description: "You don't just watch your fighter — you help them grow.",
      features: [
        "Train fighters to boost stats",
        "Equip them with relics or skins",
        "Vote on whether they enter high-stakes battles or hold back"
      ],
      example: "Shape your fighter's destiny through strategic decisions."
    },
    {
      number: "4",
      icon: Globe,
      title: "Build Your Own Realm",
      description: "You're not limited to buying shares. Now you can create an entire world of your own.",
      features: [
        "Pay to build a custom realm: name it, theme it, give it lore",
        "Design 1–5 original fighters that live and fight in your world",
        "Earn when players host battles in your realm, use your fighters, or bet in your arenas"
      ],
      example: "This is the WorldForge — where creators become combat architects."
    }
  ];

  const controlFeatures = [
    { icon: Target, text: "Pick your fighters" },
    { icon: Globe, text: "Back your world" },
    { icon: Dice6, text: "Place your bets" },
    { icon: Trophy, text: "Earn your share" }
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
            How It Works
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Own a fighter. Bet on battles. Build your realm.
          </motion.p>
          <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            FYTEPIT is a living, AI-powered combat arena where you don't just play — you participate, profit, and shape the world.
          </motion.p>
        </div>
      </motion.section>

      {/* Steps Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary">
                          <Icon className="w-6 h-6" />
                        </div>
                        <Badge variant="outline" className="text-primary border-primary/30">
                          Step {step.number}
                        </Badge>
                      </div>
                      <CardTitle className="text-3xl mb-2">{step.title}</CardTitle>
                      <p className="text-lg text-muted-foreground">{step.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <ul className="space-y-3">
                            {step.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                <span className="text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4 border border-border/30">
                          <div className="flex items-center gap-2 mb-2">
                            {step.number === "1" && <Gamepad2 className="w-4 h-4 text-primary" />}
                            {step.number === "2" && <Brain className="w-4 h-4 text-primary" />}
                            {step.number === "3" && <Zap className="w-4 h-4 text-primary" />}
                            {step.number === "4" && <Globe className="w-4 h-4 text-primary" />}
                            <span className="text-sm font-medium text-primary">
                              {step.number === "1" && "Example"}
                              {step.number === "2" && "How It Works"}
                              {step.number === "3" && "Your Role"}
                              {step.number === "4" && "WorldForge"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground italic">{step.example}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Summary Flow */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Summary Flow
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1️⃣", action: "Buy shares in a fighter or build your own" },
              { step: "2️⃣", action: "Choose battles to enter, watch outcomes" },
              { step: "3️⃣", action: "Bet on matches to multiply your stake" },
              { step: "4️⃣", action: "Earn from wins, wagers, and realm activity" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{item.step}</div>
                <p className="text-muted-foreground">{item.action}</p>
                {index < 3 && (
                  <ArrowRight className="w-6 h-6 text-primary mx-auto mt-4 hidden md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* You're in Control */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            You're in Control
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {controlFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-medium">{feature.text}</p>
                </motion.div>
              );
            })}
          </div>
          <motion.p 
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Welcome to the coliseum of the future.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;