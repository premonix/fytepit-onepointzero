import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fighters } from '@/data/fighters';
import { worlds } from '@/data/worlds';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  TrendingUp, 
  Users, 
  Trophy,
  Target,
  Brain,
  Settings,
  Share2,
  DollarSign
} from 'lucide-react';
import { useSound } from '@/hooks/useSound';
import { Footer } from '@/components/Footer';

const Fighter = () => {
  const { fighterId } = useParams();
  const { playUI } = useSound();
  const [activeTab, setActiveTab] = useState<'overview' | 'combat' | 'investment'>('overview');
  
  const fighter = fighters.find(f => f.id === fighterId);
  const world = fighter ? worlds.find(w => w.id === fighter.world) : null;
  
  if (!fighter || !world) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Fighter Not Found</h1>
          <Link to="/">
            <Button>Return to Arena</Button>
          </Link>
        </div>
      </div>
    );
  }

  const winRate = (fighter.wins / (fighter.wins + fighter.losses)) * 100;
  const totalValue = fighter.totalShares * fighter.valuePerShare;

  const handleInvest = () => {
    playUI('click');
    // Future: Open investment modal
  };

  const handleBet = () => {
    playUI('click');
    // Future: Open betting interface
  };

  const handleShare = () => {
    playUI('click');
    // Future: Open sharing options
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-dark border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm" onClick={() => playUI('click')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Arena
              </Button>
            </Link>
            <Link to={`/realm/${fighter.world}`}>
              <Button variant="ghost" size="sm" onClick={() => playUI('click')}>
                View Realm: {world.name}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fighter Portrait and Basic Info */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={fighter.image} 
                  alt={fighter.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-3xl font-bold text-white mb-2">{fighter.name}</h1>
                  <Badge 
                    className="mb-2"
                    style={{ backgroundColor: world.theme.primary }}
                  >
                    {world.name}
                  </Badge>
                  <p className="text-sm text-gray-300">{fighter.description}</p>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Record */}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Fight Record</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">{fighter.wins}W</span>
                      <span className="text-red-500 font-bold">{fighter.losses}L</span>
                      <span className="text-muted-foreground">({winRate.toFixed(1)}%)</span>
                    </div>
                  </div>
                  
                  {/* Win Rate Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Win Rate</span>
                      <span>{winRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={winRate} className="h-2" />
                  </div>

                  {/* Market Value */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Share Price</span>
                      <span className="font-bold">${fighter.valuePerShare.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Market Cap</span>
                      <span className="font-bold">${totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Shares Outstanding</span>
                      <span>{fighter.totalShares.toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={handleInvest} className="w-full">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Invest
                    </Button>
                    <Button variant="outline" onClick={handleBet} className="w-full">
                      <Target className="w-4 h-4 mr-2" />
                      Bet on Fight
                    </Button>
                  </div>
                  
                  <Button variant="ghost" onClick={handleShare} className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Fighter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              {[
                { id: 'overview', label: 'Overview', icon: Users },
                { id: 'combat', label: 'Combat Analysis', icon: Sword },
                { id: 'investment', label: 'Investment', icon: TrendingUp }
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
                <div className="space-y-6">
                  {/* Backstory */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Backstory</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {fighter.backstory}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Special Move */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Special Move: {fighter.specialMove}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        This fighter's signature finishing move, developed through countless battles in {world.name}.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Abilities */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        Combat Abilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {fighter.abilities.map((ability, index) => (
                          <div key={index} className="p-3 bg-secondary rounded-lg text-center">
                            <div className="font-semibold">{ability}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Realm Connection */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Realm Origins</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-16 h-16 rounded-lg flex-shrink-0"
                          style={{ background: world.theme.gradient }}
                        />
                        <div>
                          <h4 className="font-semibold mb-2">{world.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{world.description}</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Power Source:</span> {world.powerSource}</div>
                            <div><span className="font-medium">Combat Style:</span> {world.combatFlavor}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'combat' && (
                <div className="space-y-6">
                  {/* Combat Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Combat Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                          { label: 'Attack', value: fighter.stats.attack, icon: Sword, color: 'text-red-500' },
                          { label: 'Defense', value: fighter.stats.defense, icon: Shield, color: 'text-blue-500' },
                          { label: 'Speed', value: fighter.stats.speed, icon: Zap, color: 'text-yellow-500' },
                          { label: 'Health', value: fighter.stats.health, icon: Heart, color: 'text-green-500' }
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

                  {/* Performance Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        Performance Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-secondary rounded-lg">
                          <div className="text-3xl font-bold text-green-500 mb-2">{fighter.wins}</div>
                          <div className="text-sm text-muted-foreground">Total Wins</div>
                        </div>
                        <div className="text-center p-4 bg-secondary rounded-lg">
                          <div className="text-3xl font-bold text-red-500 mb-2">{fighter.losses}</div>
                          <div className="text-sm text-muted-foreground">Total Losses</div>
                        </div>
                        <div className="text-center p-4 bg-secondary rounded-lg">
                          <div className="text-3xl font-bold text-primary mb-2">{winRate.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">Win Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Combat Style Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Combat Style Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Strengths</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {fighter.stats.attack >= 90 && <Badge variant="outline">High Attack Power</Badge>}
                            {fighter.stats.defense >= 90 && <Badge variant="outline">Excellent Defense</Badge>}
                            {fighter.stats.speed >= 90 && <Badge variant="outline">Lightning Speed</Badge>}
                            {fighter.stats.health >= 90 && <Badge variant="outline">High Endurance</Badge>}
                            {winRate >= 80 && <Badge variant="outline">Proven Winner</Badge>}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Tactical Advantages</h4>
                          <p className="text-sm text-muted-foreground">
                            Specializes in {world.combatFlavor} combat style. 
                            {fighter.stats.attack >= fighter.stats.defense ? ' Aggressive offensive fighter.' : ' Defensive-minded tactician.'}
                            {fighter.stats.speed >= 85 ? ' Exceptional mobility and reaction time.' : ''}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'investment' && (
                <div className="space-y-6">
                  {/* Investment Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Investment Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-4">Current Market Data</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span>Current Price</span>
                              <span className="font-bold">${fighter.valuePerShare.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Market Cap</span>
                              <span className="font-bold">${totalValue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Shares</span>
                              <span>{fighter.totalShares.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Performance Score</span>
                              <span className="font-bold">{((fighter.wins / (fighter.wins + fighter.losses)) * 10).toFixed(1)}/10</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-4">Investment Highlights</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-sm">{winRate.toFixed(0)}% win rate over {fighter.wins + fighter.losses} fights</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              <span className="text-sm">Proven track record in {world.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full" />
                              <span className="text-sm">Signature move: {fighter.specialMove}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                              <span className="text-sm">Combat rating: {Math.max(...Object.values(fighter.stats))}/100</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Investment Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Investment Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button size="lg" onClick={handleInvest} className="h-16">
                          <div className="text-center">
                            <DollarSign className="w-6 h-6 mx-auto mb-1" />
                            <div>Buy Shares</div>
                            <div className="text-xs opacity-80">${fighter.valuePerShare.toFixed(2)} per share</div>
                          </div>
                        </Button>
                        
                        <Button variant="outline" size="lg" onClick={handleBet} className="h-16">
                          <div className="text-center">
                            <Target className="w-6 h-6 mx-auto mb-1" />
                            <div>Place Bet</div>
                            <div className="text-xs opacity-80">Bet on next fight</div>
                          </div>
                        </Button>
                      </div>
                      
                      <div className="mt-4 p-4 bg-secondary rounded-lg">
                        <h5 className="font-semibold mb-2">Investment Strategy</h5>
                        <p className="text-sm text-muted-foreground">
                          {winRate >= 75 ? 
                            "High-performing fighter with consistent wins. Premium investment option." :
                            winRate >= 60 ?
                            "Solid performer with good upside potential. Balanced risk investment." :
                            "Emerging fighter with high growth potential. Higher risk, higher reward."
                          }
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Risk Assessment */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span>Investment Risk Level</span>
                            <Badge variant={winRate >= 75 ? "secondary" : winRate >= 60 ? "outline" : "destructive"}>
                              {winRate >= 75 ? "Low Risk" : winRate >= 60 ? "Medium Risk" : "High Risk"}
                            </Badge>
                          </div>
                          <Progress 
                            value={winRate >= 75 ? 25 : winRate >= 60 ? 50 : 75} 
                            className="h-2"
                          />
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <p>
                            Risk assessment based on fight record, stat distribution, and realm performance. 
                            Past performance does not guarantee future results.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Fighter;