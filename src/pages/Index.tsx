import { useState } from 'react';
import { fighters } from '@/data/fighters';
import { FighterCard } from '@/components/FighterCard';
import { FightArena } from '@/components/FightArena';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fighter } from '@/types/fighter';
import { Swords, TrendingUp, Users, DollarSign, Trophy } from 'lucide-react';

const Index = () => {
  const [selectedFighters, setSelectedFighters] = useState<Fighter[]>([]);
  const [showArena, setShowArena] = useState(false);
  const [portfolio, setPortfolio] = useState([
    { fighterId: '1', shares: 50, totalInvestment: 122.50 },
    { fighterId: '2', shares: 25, totalInvestment: 93.00 }
  ]);

  const handleFighterSelect = (fighter: Fighter) => {
    if (selectedFighters.find(f => f.id === fighter.id)) {
      setSelectedFighters(selectedFighters.filter(f => f.id !== fighter.id));
    } else if (selectedFighters.length < 2) {
      setSelectedFighters([...selectedFighters, fighter]);
    }
  };

  const startFight = () => {
    if (selectedFighters.length === 2) {
      setShowArena(true);
    }
  };

  const handleInvest = (fighterId: string) => {
    // Mock investment logic
    console.log('Investing in fighter:', fighterId);
  };

  const handleBet = (fighterId: string) => {
    // Mock betting logic
    console.log('Betting on fighter:', fighterId);
  };

  const totalPortfolioValue = portfolio.reduce((total, holding) => {
    const fighter = fighters.find(f => f.id === holding.fighterId);
    return total + (fighter ? holding.shares * fighter.valuePerShare : 0);
  }, 0);

  const totalInvestment = portfolio.reduce((total, holding) => total + holding.totalInvestment, 0);
  const portfolioReturn = ((totalPortfolioValue - totalInvestment) / totalInvestment * 100);

  if (showArena && selectedFighters.length === 2) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Fight Arena
            </h1>
            <Button variant="outline" onClick={() => setShowArena(false)}>
              Back to Fighters
            </Button>
          </div>
          
          <FightArena 
            fighter1={selectedFighters[0]} 
            fighter2={selectedFighters[1]}
            onFightComplete={(winner) => {
              console.log('Fight completed, winner:', winner.name);
              // Update fighter stats, handle payouts, etc.
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-dark border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Fyte Pit
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Own fractions of elite fighters, place strategic bets, and watch epic battles unfold in the most advanced combat arena in the metaverse.
            </p>
            
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{fighters.length}</div>
                <div className="text-sm text-muted-foreground">Active Fighters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">$2.1M</div>
                <div className="text-sm text-muted-foreground">Total Market Cap</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-neon-green">89%</div>
                <div className="text-sm text-muted-foreground">Avg Win Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="fighters" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fighters" className="flex items-center gap-2">
              <Swords className="w-4 h-4" />
              Fighters
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fighters" className="space-y-6">
            {/* Fight Setup */}
            {selectedFighters.length > 0 && (
              <Card className="bg-gradient-accent/10 border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Swords className="w-5 h-5" />
                    Fight Setup ({selectedFighters.length}/2)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      {selectedFighters.map(fighter => (
                        <Badge key={fighter.id} variant="secondary" className="px-3 py-1">
                          {fighter.name}
                        </Badge>
                      ))}
                    </div>
                    {selectedFighters.length === 2 && (
                      <Button variant="fight" onClick={startFight}>
                        <Swords className="w-4 h-4 mr-2" />
                        Start Fight
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fighter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fighters.map(fighter => (
                <div 
                  key={fighter.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedFighters.find(f => f.id === fighter.id) 
                      ? 'ring-2 ring-primary transform scale-105' 
                      : ''
                  }`}
                  onClick={() => handleFighterSelect(fighter)}
                >
                  <FighterCard 
                    fighter={fighter}
                    onInvest={handleInvest}
                    onBet={handleBet}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Total Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalPortfolioValue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Current market value</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Total Return
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${portfolioReturn >= 0 ? 'text-accent' : 'text-destructive'}`}>
                    {portfolioReturn >= 0 ? '+' : ''}{portfolioReturn.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Since first investment</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Fighters Owned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{portfolio.length}</div>
                  <p className="text-xs text-muted-foreground">Active investments</p>
                </CardContent>
              </Card>
            </div>

            {/* Holdings */}
            <Card>
              <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolio.map(holding => {
                    const fighter = fighters.find(f => f.id === holding.fighterId);
                    if (!fighter) return null;
                    
                    const currentValue = holding.shares * fighter.valuePerShare;
                    const returnValue = currentValue - holding.totalInvestment;
                    const returnPercent = (returnValue / holding.totalInvestment) * 100;
                    
                    return (
                      <div key={holding.fighterId} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <img src={fighter.image} alt={fighter.name} className="w-12 h-12 rounded object-cover" />
                          <div>
                            <h4 className="font-semibold">{fighter.name}</h4>
                            <p className="text-sm text-muted-foreground">{holding.shares} shares</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${currentValue.toFixed(2)}</div>
                          <div className={`text-sm ${returnPercent >= 0 ? 'text-accent' : 'text-destructive'}`}>
                            {returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Top Fighters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fighters
                    .sort((a, b) => (b.wins / (b.wins + b.losses)) - (a.wins / (a.wins + a.losses)))
                    .map((fighter, index) => {
                      const winRate = (fighter.wins / (fighter.wins + fighter.losses)) * 100;
                      return (
                        <div key={fighter.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                            <img src={fighter.image} alt={fighter.name} className="w-12 h-12 rounded object-cover" />
                            <div>
                              <h4 className="font-semibold">{fighter.name}</h4>
                              <p className="text-sm text-muted-foreground">{fighter.wins}W - {fighter.losses}L</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-accent">{winRate.toFixed(1)}%</div>
                            <div className="text-sm text-muted-foreground">${fighter.valuePerShare}</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;