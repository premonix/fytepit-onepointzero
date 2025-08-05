import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Gamepad2, 
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
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const Creator = () => {
  const inspirations = [
    {
      title: "Ready Player One",
      description: "The dream of a limitless virtual universe where anything is possible",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      quote: "A world where imagination becomes reality"
    },
    {
      title: "Zed Run",
      description: "True digital ownership and the thrill of breeding, trading, and racing",
      icon: Trophy,
      color: "from-green-500 to-emerald-500",
      quote: "Own your champions, control your destiny"
    },
    {
      title: "Minecraft",
      description: "Infinite creative freedom to build worlds limited only by imagination",
      icon: Building2,
      color: "from-amber-500 to-orange-500",
      quote: "Every block placed, every world built with purpose"
    },
    {
      title: "Warhammer 40K",
      description: "Epic battles across vast universes with deep lore and tactical combat",
      icon: Sword,
      color: "from-red-500 to-rose-500",
      quote: "In the grim darkness of the far future, there is only war"
    },
    {
      title: "Street Fighter",
      description: "Precise combat mechanics where skill and strategy determine victory",
      icon: Target,
      color: "from-purple-500 to-violet-500",
      quote: "Every move matters, every frame counts"
    }
  ];

  const visionPoints = [
    {
      icon: Crown,
      title: "True Ownership",
      description: "Own your fighters, worlds, and creations. Trade, sell, or keep them forever - the choice is yours."
    },
    {
      icon: Palette,
      title: "Creator Economy",
      description: "Build worlds, design fighters, craft experiences. Monetize your creativity in ways never before possible."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Every world tells a story. Every fighter has a legacy. Every battle shapes the metaverse."
    },
    {
      icon: Zap,
      title: "AI Revolution",
      description: "Watch intelligent fighters evolve, learn, and adapt. Witness the birth of digital consciousness."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/5" />
        
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

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">The Origin Story</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent mb-6 font-orbitron">
              The Creator
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Every great revolution begins with a dream. This is the story of FYTEPIT - 
              born from a vision to create the ultimate digital arena where 
              <span className="text-primary font-semibold"> ownership meets creativity</span>, 
              and <span className="text-accent font-semibold">combat meets art</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Dream Section */}
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
              The Dream
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              It started with a simple question: <em>"What if we could build the OASIS from Ready Player One, 
              but make it real?"</em> A place where digital ownership isn't just a concept - it's the foundation 
              of an entire economy. Where creativity flows like currency, and every battle tells a story.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border border-primary/10 rounded-2xl p-8 md:p-12"
          >
            <blockquote className="text-2xl md:text-3xl font-medium text-center text-foreground leading-relaxed italic">
              "I wanted to create a world where gamers don't just play - they <span className="text-primary font-bold">own</span>. 
              Where developers don't just code - they <span className="text-accent font-bold">create universes</span>. 
              Where every fighter, every world, every victory becomes part of a legacy that lives forever."
            </blockquote>
            <div className="text-center mt-6">
              <span className="text-muted-foreground">- The Creator of FYTEPIT</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Inspirations Section */}
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
              The Inspirations
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              FYTEPIT wasn't born in a vacuum. It stands on the shoulders of giants - 
              each inspiration bringing a crucial element to the ultimate vision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {inspirations.map((inspiration, index) => (
              <motion.div
                key={inspiration.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${inspiration.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <inspiration.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-foreground mb-4 font-rajdhani">
                      {inspiration.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {inspiration.description}
                    </p>
                    
                    <blockquote className="text-primary font-medium italic border-l-2 border-primary pl-4">
                      "{inspiration.quote}"
                    </blockquote>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Vision Section */}
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
              The Vision Realized
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From dream to reality - how FYTEPIT brings together the best elements 
              of gaming, ownership, creativity, and combat into one revolutionary platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {visionPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                    <point.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 font-rajdhani">
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/20 rounded-2xl p-8 md:p-12">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-orbitron">
                Join the Revolution
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                This is just the beginning. Every day, FYTEPIT grows closer to the ultimate vision - 
                a place where creativity, ownership, and combat converge to create something truly magical.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/worlds">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-8 py-4 rounded-full group"
                  >
                    Explore the Worlds
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