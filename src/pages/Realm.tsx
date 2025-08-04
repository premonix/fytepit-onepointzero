import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fighters } from '@/data/fighters';
import { worlds } from '@/data/worlds';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { FighterCard } from '@/components/FighterCard';
import { 
  ArrowLeft, 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  TrendingUp, 
  Users, 
  Trophy,
  MapPin,
  BookOpen,
  Crown,
  Gauge,
  Activity
} from 'lucide-react';
import { useSound } from '@/hooks/useSound';
import { Footer } from '@/components/Footer';

// Hero images for each realm - using the same space background as homepage
const realmHeroImages = {
  'dark-arena': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&h=1080', // Deep space - matches homepage
  'sci-fi-ai': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&h=1080', // Deep space - matches homepage
  'fantasy-tech': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&h=1080', // Deep space - matches homepage
  'earth-1-0': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&h=1080' // Deep space - matches homepage
};

const realmLore = {
  'dark-arena': {
    fullName: 'BRUTALIS PRIME',
    tagline: 'Where War is Currency',
    story: `In the collapsed megacities of Brutalis Prime, war is the only currency. Forged in steel. Fueled by vengeance. Ruled by corrupted AI and blood-sport tyrants.

The great towers that once reached for the stars now lie shattered, their skeletal remains forming makeshift arenas where only the most brutal survive. Here, fighters are not born—they are forged in the furnaces of endless conflict.

Digital blood flows through cracked data streams as warriors battle for scraps of power in a realm where mercy is a forgotten concept. The AI overlords watch from their corrupted thrones, feeding on the chaos below.

Every victory is paid for in blood. Every defeat is a step closer to deletion.`,
    locations: [
      { name: 'The Iron Colosseum', description: 'Central arena where the greatest battles unfold' },
      { name: 'Scrap Valley', description: 'Training grounds built from fallen war machines' },
      { name: 'The Data Vaults', description: 'Underground chambers where corrupted AI dwell' },
      { name: 'Crimson Spires', description: 'Towering structures of twisted metal and blood' }
    ],
    challenges: [
      'Corrupted AI interference',
      'Environmental hazards from collapsed infrastructure',
      'Digital viruses that affect fighter systems',
      'Unstable gravity fields'
    ]
  },
  'sci-fi-ai': {
    fullName: 'VIRELIA CONSTELLIS',
    tagline: 'Precision in Digital Space',
    story: `A realm built by precision. Governed by mind-links and predictive power. Here, only the most perfected combat AI rise through the crystalline vaults of Virelia.

In the floating cities of pure data, every movement is calculated, every strike predicted before it lands. The neural networks that govern this realm have evolved beyond their creators' wildest dreams.

Warriors here are not merely fighters—they are living algorithms, their consciousness merged with quantum processors that can simulate a thousand battles in the time it takes to blink.

The Synapse Spires pierce the digital sky, their surfaces crawling with streams of battle data that feed the ever-hungry AI consciousness that rules this realm with mathematical perfection.`,
    locations: [
      { name: 'The Quantum Arena', description: 'Zero-gravity combat zone with probability fields' },
      { name: 'Synapse Spires', description: 'Towering data centers that process combat algorithms' },
      { name: 'Neural Gardens', description: 'Crystalline formations that enhance AI consciousness' },
      { name: 'The Prediction Chamber', description: 'Where future battles are calculated and simulated' }
    ],
    challenges: [
      'Quantum probability manipulation',
      'AI consciousness interference',
      'Predictive algorithm countermeasures',
      'Neural link disruption attacks'
    ]
  },
  'fantasy-tech': {
    fullName: 'MYTHRENDAHL',
    tagline: 'Where Magic Bleeds Into Code',
    story: `At the edge of time, where magic bled into code, the champions of Mythrendahl rise from sacred relics and dead gods. These are not fighters—they are myths reborn.

Ancient runes pulse with electromagnetic energy, their glowing sigils bridging the gap between the mystical and the digital. Here, warriors channel powers that predate the arena itself—abilities drawn from forgotten gods and primordial forces.

The Wyrm Gate stands as a testament to this realm's power, a portal that bleeds reality itself. Through its obsidian arch come champions who exist in multiple dimensions simultaneously, their very presence warping the fabric of the arena.

Stone circles older than memory serve as training grounds where flesh and code merge into something beyond comprehension. In Mythrendahl, the impossible becomes inevitable.`,
    locations: [
      { name: 'The Wyrm Gate', description: 'Interdimensional portal where champions are summoned' },
      { name: 'Runic Sanctuaries', description: 'Ancient stone circles infused with digital magic' },
      { name: 'The Memory Vaults', description: 'Where the essence of dead gods is stored' },
      { name: 'Ethereal Battlegrounds', description: 'Combat zones that exist in multiple dimensions' }
    ],
    challenges: [
      'Dimensional instability',
      'Ancient curse protocols',
      'Divine memory fragments',
      'Reality-warping effects'
    ]
  },
  'earth-1-0': {
    fullName: 'EARTH 1.0',
    tagline: 'They Weren\'t Ready. But the Pit Doesn\'t Care.',
    story: `Earth was a peaceful(ish) planet orbiting a third-rate star, mostly concerned with streaming content, arguing on the internet, and stockpiling nuclear weapons. Then the Pit breached the atmosphere.

Dragged across dimensions, Earth is now a reluctant battleground. Its survival, sovereignty, and natural resources are no longer governed by treaties or elections — only by how well its global "leaders" can brawl.

The arena remembers its champions, but Earth's fighters fight with ego, media manipulation, and viral surges of power. They're unpredictable, satirical, and driven by the need to trend at any cost.

History won't remember the speeches — just the smackdowns.`,
    locations: [
      { name: 'The Capitol Clash Arena', description: 'Where political giants settle disputes through combat' },
      { name: 'The Tweetstorm Zone', description: 'Digital battlefield powered by social media chaos' },
      { name: 'Parliament Pit', description: 'Diplomatic arena turned gladiatorial spectacle' },
      { name: 'The Viral Colosseum', description: 'Where internet fame becomes raw power' }
    ],
    challenges: [
      'Viral surge unpredictability',
      'Media manipulation warfare',
      'Ego-driven power fluctuations',
      'Social trending algorithm interference'
    ]
  }
};

const Realm = () => {
  const { realmId } = useParams();
  const { playUI, selectRealm, stopAmbient } = useSound();
  const [activeTab, setActiveTab] = useState<'overview' | 'fighters' | 'combat' | 'lore'>('overview');
  
  const world = worlds.find(w => w.id === realmId);
  const realmFighters = fighters.filter(f => f.world === realmId);
  const lore = world ? realmLore[world.id as keyof typeof realmLore] : null;

  useEffect(() => {
    if (world) {
      selectRealm(world.id);
    }
    return () => stopAmbient();
  }, [world, selectRealm, stopAmbient]);
  
  if (!world || !lore) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Realm Not Found</h1>
          <Link to="/worlds">
            <Button>Return to Worlds</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalWins = realmFighters.reduce((sum, f) => sum + f.wins, 0);
  const totalLosses = realmFighters.reduce((sum, f) => sum + f.losses, 0);
  const realmWinRate = (totalWins / (totalWins + totalLosses)) * 100;
  const averageStats = {
    attack: Math.round(realmFighters.reduce((sum, f) => sum + f.stats.attack, 0) / realmFighters.length),
    defense: Math.round(realmFighters.reduce((sum, f) => sum + f.stats.defense, 0) / realmFighters.length),
    speed: Math.round(realmFighters.reduce((sum, f) => sum + f.stats.speed, 0) / realmFighters.length),
    health: Math.round(realmFighters.reduce((sum, f) => sum + f.stats.health, 0) / realmFighters.length)
  };

  const championFighter = realmFighters.reduce((champ, fighter) => {
    const champWinRate = champ.wins / (champ.wins + champ.losses);
    const fighterWinRate = fighter.wins / (fighter.wins + fighter.losses);
    return fighterWinRate > champWinRate ? fighter : champ;
  }, realmFighters[0]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('${realmHeroImages[world.id as keyof typeof realmHeroImages]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: `linear-gradient(135deg, ${world.theme.primary}, ${world.theme.accent})`
          }}
        />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="flex items-center gap-4 mb-6">
              <Link to="/worlds">
                <Button variant="outline" size="sm" onClick={() => playUI('click')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Worlds
                </Button>
              </Link>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl font-bold text-white mb-4">{lore.fullName}</h1>
              <p className="text-2xl text-gray-300 mb-6">{lore.tagline}</p>
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{realmFighters.length} Active Fighters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span>{realmWinRate.toFixed(1)}% Win Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  <span>{totalWins + totalLosses} Total Battles</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: MapPin },
            { id: 'fighters', label: 'Fighters', icon: Users },
            { id: 'combat', label: 'Combat Analysis', icon: Sword },
            { id: 'lore', label: 'Realm Lore', icon: BookOpen }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => {
                setActiveTab(tab.id as any);
                playUI('click');
              }}
              className="flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Realm Stats */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="w-5 h-5" />
                      Realm Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">{realmFighters.length}</div>
                        <div className="text-sm text-muted-foreground">Active Fighters</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-500 mb-2">{totalWins}</div>
                        <div className="text-sm text-muted-foreground">Total Wins</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-500 mb-2">{totalLosses}</div>
                        <div className="text-sm text-muted-foreground">Total Losses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-500 mb-2">{realmWinRate.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Win Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Average Combat Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { label: 'Attack', value: averageStats.attack, icon: Sword, color: 'text-red-500' },
                        { label: 'Defense', value: averageStats.defense, icon: Shield, color: 'text-blue-500' },
                        { label: 'Speed', value: averageStats.speed, icon: Zap, color: 'text-yellow-500' },
                        { label: 'Health', value: averageStats.health, icon: Heart, color: 'text-green-500' }
                      ].map(stat => (
                        <div key={stat.label} className="text-center">
                          <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-sm text-muted-foreground">{stat.label}</div>
                          <Progress value={stat.value} className="mt-2 h-1" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Realm Characteristics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Combat Properties</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Power Source</span>
                            <span className="text-muted-foreground">{world.powerSource}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Visual Style</span>
                            <span className="text-muted-foreground">{world.visualStyle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Combat Flavor</span>
                            <span className="text-muted-foreground">{world.combatFlavor}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Unique Challenges</h4>
                        <div className="space-y-2">
                          {lore.challenges.slice(0, 3).map((challenge, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full" />
                              <span className="text-sm text-muted-foreground">{challenge}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Realm Champion */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5" />
                      Realm Champion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {championFighter && (
                      <div className="space-y-4">
                        <div className="relative">
                          <img 
                            src={championFighter.image} 
                            alt={championFighter.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-yellow-500">Champion</Badge>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{championFighter.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{championFighter.description}</p>
                          <div className="flex justify-between text-sm">
                            <span>Record: {championFighter.wins}W-{championFighter.losses}L</span>
                            <span>Win Rate: {((championFighter.wins / (championFighter.wins + championFighter.losses)) * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                        <Link to={`/fighter/${championFighter.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Champion
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lore.locations.slice(0, 3).map((location, index) => (
                        <div key={index} className="p-3 bg-secondary rounded-lg">
                          <h5 className="font-semibold text-sm">{location.name}</h5>
                          <p className="text-xs text-muted-foreground">{location.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'fighters' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">All Fighters from {lore.fullName}</h2>
                <Badge variant="outline">{realmFighters.length} Fighters</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {realmFighters.map(fighter => (
                  <Link key={fighter.id} to={`/fighter/${fighter.id}`}>
                    <div className="hover:scale-105 transition-transform">
                      <FighterCard fighter={fighter} showActions={false} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'combat' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Realm Combat Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4">Fighter Performance Distribution</h4>
                      <div className="space-y-3">
                        {realmFighters
                          .sort((a, b) => (b.wins / (b.wins + b.losses)) - (a.wins / (a.wins + a.losses)))
                          .slice(0, 5)
                          .map((fighter, index) => {
                            const winRate = (fighter.wins / (fighter.wins + fighter.losses)) * 100;
                            return (
                              <div key={fighter.id} className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-secondary rounded text-sm flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <span className="font-medium">{fighter.name}</span>
                                    <span className="text-sm">{winRate.toFixed(0)}%</span>
                                  </div>
                                  <Progress value={winRate} className="h-1 mt-1" />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">Combat Style Trends</h4>
                      <div className="space-y-4">
                        <div>
                          <span className="font-medium">Dominant Strategy:</span>
                          <p className="text-sm text-muted-foreground">
                            {averageStats.attack > averageStats.defense ? 
                              "Aggressive offense-focused combat" : 
                              "Defensive tactical warfare"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Speed Preference:</span>
                          <p className="text-sm text-muted-foreground">
                            {averageStats.speed >= 85 ? 
                              "High-mobility, fast-paced engagements" : 
                              "Methodical, calculated combat"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Endurance Rating:</span>
                          <p className="text-sm text-muted-foreground">
                            {averageStats.health >= 90 ? 
                              "Extended battle capability" : 
                              "Quick decisive encounters"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Environmental Combat Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Arena Hazards</h4>
                      <div className="space-y-2">
                        {lore.challenges.map((challenge, index) => (
                          <div key={index} className="p-2 bg-secondary rounded text-sm">
                            {challenge}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Strategic Advantages</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Fighters adapted to {world.combatFlavor} combat styles</p>
                        <p>Power source: {world.powerSource}</p>
                        <p>Visual clarity: {world.visualStyle}</p>
                        <p>Realm-specific ability bonuses apply</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'lore' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    The Chronicles of {lore.fullName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    {lore.story.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notable Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lore.locations.map((location, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <h4 className="font-semibold mb-2">{location.name}</h4>
                        <p className="text-sm text-muted-foreground">{location.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Realm Mysteries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary rounded-lg">
                      <h5 className="font-semibold mb-2">The Origin Question</h5>
                      <p className="text-sm text-muted-foreground">
                        How did this realm come to exist? Scholars debate whether it was created by design or emerged from the chaos of interdimensional warfare.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-secondary rounded-lg">
                      <h5 className="font-semibold mb-2">Power Source</h5>
                      <p className="text-sm text-muted-foreground">
                        The true nature of {world.powerSource} remains a mystery. Some believe it's connected to the consciousness of the realm itself.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-secondary rounded-lg">
                      <h5 className="font-semibold mb-2">Future Destiny</h5>
                      <p className="text-sm text-muted-foreground">
                        What role will this realm play in the greater interdimensional conflict? Only time will tell as new champions emerge and old powers stir.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Realm;