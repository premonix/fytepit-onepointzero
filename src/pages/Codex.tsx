import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Book, 
  Sword, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  Trophy, 
  Star,
  ArrowRight,
  Eye,
  Target
} from 'lucide-react';
import { Footer } from '@/components/Footer';
import { useSound } from '@/hooks/useSound';

const Codex = () => {
  const [selectedCategory, setSelectedCategory] = useState('lore');
  const { playUI } = useSound();

  const handleTabChange = (value: string) => {
    playUI('click');
    setSelectedCategory(value);
  };

  const loreEntries = [
    {
      title: "The Great Fracture",
      description: "The catastrophic event that split reality into three distinct realms",
      content: "In the year 2157, a dimensional experiment gone wrong shattered the fabric of space-time, creating three parallel realms where only the strongest survive. Each realm developed its own unique laws of physics, magic, and technology.",
      icon: Globe,
      category: "History"
    },
    {
      title: "Champion Summoning",
      description: "The mystical process of bringing fighters into the pit",
      content: "Champions are not born - they are forged from the essence of fallen warriors, twisted by dark magic, or constructed from advanced nanotechnology. Each summoning ritual requires immense resources and carries unknown risks.",
      icon: Star,
      category: "Mechanics"
    },
    {
      title: "The Eternal Wager",
      description: "Why the realms fight endlessly for supremacy",
      content: "Ancient prophecies speak of a final victory that will reunite the realms under one banner. Until then, the three factions wage eternal war through their champions, believing that only through combat can balance be restored.",
      icon: Trophy,
      category: "Prophecy"
    }
  ];

  const fightingStyles = [
    {
      name: "Brutalist Combat",
      realm: "Dark Arena",
      description: "Raw power and devastating strikes",
      strengths: ["High damage output", "Intimidation factor", "Armor penetration"],
      weaknesses: ["Slower movement", "Energy consumption"],
      icon: Sword
    },
    {
      name: "Technological Warfare",
      realm: "Sci-Fi AI",
      description: "Precision strikes and advanced tactics",
      strengths: ["Strategic advantage", "Range combat", "Adaptability"],
      weaknesses: ["Complex systems", "EMP vulnerability"],
      icon: Zap
    },
    {
      name: "Mystical Arts",
      realm: "Fantasy Tech",
      description: "Magic-infused combat techniques",
      strengths: ["Elemental powers", "Healing abilities", "Unpredictability"],
      weaknesses: ["Mana dependency", "Casting time"],
      icon: Shield
    }
  ];

  const championClasses = [
    {
      class: "Berserker",
      description: "Melee specialists with devastating close-combat abilities",
      stats: { attack: 95, defense: 60, speed: 70, special: 80 },
      signature: "Rage Mode - Temporary invincibility and doubled damage"
    },
    {
      class: "Assassin",
      description: "Lightning-fast fighters specializing in critical strikes",
      stats: { attack: 85, defense: 40, speed: 95, special: 90 },
      signature: "Shadow Strike - Teleport behind enemy for guaranteed critical hit"
    },
    {
      class: "Guardian",
      description: "Defensive powerhouses that protect and endure",
      stats: { attack: 65, defense: 95, speed: 45, special: 75 },
      signature: "Barrier Shield - Absorb and reflect incoming damage"
    },
    {
      class: "Technomancer",
      description: "Tech-magic hybrids with versatile abilities",
      stats: { attack: 75, defense: 70, speed: 80, special: 95 },
      signature: "System Override - Hack enemy abilities and turn them hostile"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-gray-900 via-black to-black">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <Book className="w-12 h-12 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                FYTEPIT CODEX
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your complete guide to the fractured realms, legendary champions, and the eternal war that shapes destiny itself.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs value={selectedCategory} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="lore">Lore & History</TabsTrigger>
              <TabsTrigger value="combat">Combat Guide</TabsTrigger>
              <TabsTrigger value="champions">Champion Classes</TabsTrigger>
              <TabsTrigger value="realms">Realm Details</TabsTrigger>
            </TabsList>

            <TabsContent value="lore" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loreEntries.map((entry, index) => (
                  <motion.div
                    key={entry.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-900 border-gray-800 hover:border-primary/50 transition-colors h-full">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <entry.icon className="w-6 h-6 text-primary" />
                          <Badge variant="outline">{entry.category}</Badge>
                        </div>
                        <CardTitle className="text-white">{entry.title}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {entry.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {entry.content}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="combat" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {fightingStyles.map((style, index) => (
                  <motion.div
                    key={style.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-900 border-gray-800 h-full">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <style.icon className="w-6 h-6 text-primary" />
                          <Badge variant="secondary">{style.realm}</Badge>
                        </div>
                        <CardTitle className="text-white">{style.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {style.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                            <ArrowRight className="w-4 h-4" />
                            Strengths
                          </h4>
                          <ul className="space-y-1">
                            {style.strengths.map((strength, i) => (
                              <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                                <div className="w-1 h-1 bg-green-400 rounded-full" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Weaknesses
                          </h4>
                          <ul className="space-y-1">
                            {style.weaknesses.map((weakness, i) => (
                              <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                                <div className="w-1 h-1 bg-red-400 rounded-full" />
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="champions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {championClasses.map((championClass, index) => (
                  <motion.div
                    key={championClass.class}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-900 border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                          <Users className="w-6 h-6 text-primary" />
                          {championClass.class}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {championClass.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Attack</span>
                              <span className="text-sm text-white">{championClass.stats.attack}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: `${championClass.stats.attack}%` }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Defense</span>
                              <span className="text-sm text-white">{championClass.stats.defense}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${championClass.stats.defense}%` }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Speed</span>
                              <span className="text-sm text-white">{championClass.stats.speed}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${championClass.stats.speed}%` }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Special</span>
                              <span className="text-sm text-white">{championClass.stats.special}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full" 
                                style={{ width: `${championClass.stats.special}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                          <h4 className="text-sm font-semibold text-primary mb-1 flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            Signature Ability
                          </h4>
                          <p className="text-sm text-gray-300">{championClass.signature}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="realms" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <Eye className="w-6 h-6 text-red-400" />
                      Dark Arena
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Realm of Shadow and Steel
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-300">
                      A brutal wasteland where only the strongest survive. Ancient technology merges with dark magic to create weapons of unimaginable power.
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-400">Dominant Element:</span>
                        <span className="text-red-400 ml-2">Shadow Energy</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Fighting Style:</span>
                        <span className="text-white ml-2">Aggressive Melee</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Specialty:</span>
                        <span className="text-white ml-2">Raw Power</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-900/20 to-black border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <Zap className="w-6 h-6 text-blue-400" />
                      Sci-Fi AI
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Realm of Logic and Lightning
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-300">
                      A digital fortress where artificial intelligence has evolved beyond human comprehension. Precision and strategy dominate every encounter.
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-400">Dominant Element:</span>
                        <span className="text-blue-400 ml-2">Digital Energy</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Fighting Style:</span>
                        <span className="text-white ml-2">Tactical Ranged</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Specialty:</span>
                        <span className="text-white ml-2">Strategic Analysis</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/20 to-black border-purple-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <Shield className="w-6 h-6 text-purple-400" />
                      Fantasy Tech
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Realm of Magic and Machine
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-300">
                      Where ancient sorcery interfaces with cutting-edge technology. Unpredictable and mystical, defying conventional combat logic.
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-400">Dominant Element:</span>
                        <span className="text-purple-400 ml-2">Arcane Tech</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Fighting Style:</span>
                        <span className="text-white ml-2">Adaptive Hybrid</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Specialty:</span>
                        <span className="text-white ml-2">Mystical Arts</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Codex;