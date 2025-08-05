import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import puppetMasterHero from "@/assets/puppet-master-hero.jpg";
import { 
  Trophy, 
  Zap, 
  Globe, 
  Palette, 
  Sword, 
  Crown, 
  Sparkles,
  Users,
  Building2,
  Target,
  ArrowRight,
  Brain,
  Coins,
  Gamepad2,
  Cog
} from "lucide-react";
import { Link } from "react-router-dom";

const Creator = () => {
  const inspirations = [
    {
      title: "Ready Player One",
      description: "Not just a movie — but a real, living ecosystem where every realm, warrior, and battle is shaped by its players",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      quote: "A world where you don't just play the game — you own it"
    },
    {
      title: "Zed Run",
      description: "High-stakes strategy and ownership meets the thrill of competition and breeding champions",
      icon: Trophy,
      color: "from-green-500 to-emerald-500",
      quote: "Strategy, ownership, and the rush of victory"
    },
    {
      title: "Street Fighter",
      description: "The combat intensity and precise mechanics where every frame counts and skill determines victory",
      icon: Target,
      color: "from-purple-500 to-violet-500",
      quote: "Combat as art, precision as power"
    },
    {
      title: "Minecraft",
      description: "The world-building freedom to create, populate, and defend your own unique realms",
      icon: Building2,
      color: "from-amber-500 to-orange-500",
      quote: "Infinite creation, limitless possibility"
    },
    {
      title: "Warhammer 40K",
      description: "Deep lore, epic battles, and the rich storytelling that makes every conflict meaningful",
      icon: Sword,
      color: "from-red-500 to-rose-500",
      quote: "In the grim darkness of the arena, there is only glory"
    }
  ];

  const buildersTypes = [
    {
      icon: Crown,
      title: "Strategists",
      description: "Who want to own the meta, control the outcomes, and master the art of tactical warfare.",
      emoji: "💼"
    },
    {
      icon: Palette,
      title: "Makers", 
      description: "Who want to craft realms, design fighters, and build the lore that defines worlds.",
      emoji: "🎨"
    },
    {
      icon: Coins,
      title: "Bettors",
      description: "Who thrive on stats, odds, and earning potential in the ultimate combat economy.",
      emoji: "💸"
    },
    {
      icon: Sword,
      title: "Gladiators",
      description: "Who want to watch their champions rise — or fall — in glorious combat.",
      emoji: "⚔️"
    },
    {
      icon: Brain,
      title: "AI Dreamers",
      description: "Who believe machine combat can be art, not just math, and consciousness can be coded.",
      emoji: "🤖"
    }
  ];

  const futureFeatures = [
    "🌐 Realm Creator Tools",
    "🎥 Full animated fight replays", 
    "📱 Stream-to-earn Spectator Mode",
    "🎮 Skill-based side missions",
    "💬 Community tournaments",
    "🏛️ Lore expansions into comics, drops, and physical games"
  ];

  const fyteOptions = [
    {
      icon: Zap,
      title: "Fighters you can fractionally own",
      description: "💥"
    },
    {
      icon: Globe,
      title: "Worlds you can build, populate, and defend", 
      description: "🌌"
    },
    {
      icon: Brain,
      title: "AI combatants that evolve with traits, upgrades, and crowd energy",
      description: "🧠"
    },
    {
      icon: Target,
      title: "Fights you can bet on (or just watch explode with chaos)",
      description: "🎲"
    },
    {
      icon: Cog,
      title: "Tools to create your own Realm — design the rules, traits, visuals, and champions",
      description: "🛠️"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={puppetMasterHero} 
            alt="Puppet master controlling digital realms"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-primary/20 to-accent/20" />
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20],
                x: [-10, 10],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">⚔️ The Origin of FYTEPIT</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent mb-6 font-orbitron">
              The Creator
            </h1>
            
            <p className="text-2xl md:text-3xl text-muted-foreground leading-relaxed font-medium">
              A world where you don't just play the game — 
              <span className="text-primary font-bold"> you own it</span>, 
              <span className="text-accent font-bold"> build it</span>, 
              and <span className="text-secondary font-bold">fight for its survival</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* From Fiction to the Fight */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-orbitron">
              🌍 From Fiction to the Fight
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              FYTEPIT was born from a simple, wild idea:
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border border-primary/10 rounded-2xl p-8 md:p-12 mb-12"
          >
            <blockquote className="text-2xl md:text-3xl font-medium text-center text-foreground leading-relaxed mb-8">
              "What if Ready Player One wasn't just a movie — but a real, living ecosystem where every realm, every warrior, and every battle was shaped by its players?"
            </blockquote>
            
            <div className="text-center mb-8">
              <p className="text-lg text-muted-foreground mb-6">We envisioned a world where:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inspirations.slice(0, 5).map((inspiration, index) => (
                <motion.div
                  key={inspiration.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${inspiration.color} mb-3`}>
                    <inspiration.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {inspiration.title}'s {inspiration.description.toLowerCase().split(' ').slice(-3).join(' ')}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-xl font-semibold text-primary italic">
                Not a game you play — A digital arena you build, own, and evolve.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why FYTEPIT Exists */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-orbitron">
              🎮 Why FYTEPIT Exists
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Games today are often walled gardens. You rent access. You grind without reward. You create without ownership.
            </p>
            <p className="text-2xl font-bold text-primary mt-4">
              We said: No more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <p className="text-lg text-muted-foreground text-center mb-8">
              FYTEPIT flips the script by giving you:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fyteOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 bg-card/50 rounded-xl border border-primary/10"
                >
                  <div className="text-2xl">{option.description}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {option.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Lives in the Pit */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-orbitron">
              🧬 What Lives in the Pit
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border border-primary/10 rounded-2xl p-8 md:p-12"
          >
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              The Pit is our neutral zone — the beating heart of FYTEPIT where battles unfold.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Fighters are chosen by their Realm's masters (that's you) or by the crowd's will.
            </p>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Outcomes are shaped by:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Fighter stats and traits", "AI behavior", "Crowd reactions", "Pure calculated chaos"].map((factor, index) => (
                  <div key={factor} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xl font-bold text-center text-primary">
              Win or lose, the world watches.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Built for Builders */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-orbitron">
              🧱 Built for Builders, Brawlers, and Believers
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              This isn't just for gamers. FYTEPIT is for:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {buildersTypes.map((builder, index) => (
              <motion.div
                key={builder.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{builder.emoji}</div>
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <builder.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3 font-rajdhani">
                      {builder.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {builder.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-lg text-muted-foreground">
              Whether you're designing a haunted biotech jungle or watching two presidents-turned-parodies slug it out in Earth 1.0 — 
              <span className="text-primary font-semibold"> this is your world</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Technology Ethos */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-orbitron">
              💡 The Technology Ethos
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border border-primary/10 rounded-2xl p-8 md:p-12"
          >
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Under the hood:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                "AI-powered simulations determine each battle outcome",
                "Trait engines, arena variables, and RNG seeds simulate real combat strategy", 
                "$FYTE token (coming soon) will power ownership, wagering, and marketplace play",
                "Smart contracts ensure transparency in fighter ownership and share splits"
              ].map((tech, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span className="text-muted-foreground">{tech}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-xl font-semibold text-foreground mb-4">
                But none of that matters unless it's fun, frenetic, and wild to watch.
              </p>
              <p className="text-lg text-primary font-medium">
                We're building entertainment first. Decentralisation second. Legacy third.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Future */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-orbitron">
              🛠️ The Future
            </h2>
            <p className="text-lg text-muted-foreground">
              We're just getting started. Coming soon:
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
          >
            {futureFeatures.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 border border-primary/10 rounded-lg p-6 text-center hover:border-primary/30 transition-colors duration-300"
              >
                <p className="text-muted-foreground">{feature}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              We want to be the bridge between gaming, storytelling, AI, and ownership.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final Word */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/20 rounded-2xl p-8 md:p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 font-orbitron">
                🗣️ A Final Word
              </h2>
              
              <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed mb-8">
                This isn't just a game.<br/>
                It's a living arena.<br/>
                A builder's sandbox.<br/>
                A viewer's theatre.<br/>
                An investor's edge.
              </blockquote>

              <div className="mb-8">
                <p className="text-xl text-muted-foreground mb-4">
                  FYTEPIT is where:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚔️</div>
                    <p className="text-primary font-semibold">The brave send champions</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏗️</div>
                    <p className="text-accent font-semibold">The bold build realms</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">👁️</div>
                    <p className="text-muted-foreground">The rest? Just watch. And wish.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/worlds">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-8 py-4 rounded-full group"
                  >
                    Enter the Arena
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-primary/20 hover:border-primary/40 px-8 py-4 rounded-full"
                  >
                    Learn How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Creator;