import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fighters } from '@/data/fighters';
import { Sword, Users, Trophy, Zap, Play, Volume2, VolumeX } from 'lucide-react';
import { FighterCard } from '@/components/FighterCard';
import { Link } from 'react-router-dom';
import { useSound } from '@/hooks/useSound';

const Index = () => {
  const [selectedFighters, setSelectedFighters] = useState<string[]>([]);
  const { playUI, toggleMute, muted } = useSound();

  // Play homepage load sound on mount
  useEffect(() => {
    playUI('transition');
  }, [playUI]);

  const handleFighterSelect = (fighterId: string) => {
    playUI('click');
    setSelectedFighters(prev => 
      prev.includes(fighterId) 
        ? prev.filter(id => id !== fighterId)
        : prev.length < 2 
          ? [...prev, fighterId]
          : [prev[1], fighterId]
    );
  };

  const handleUIClick = () => {
    playUI('click');
  };

  const handleUIHover = () => {
    playUI('hover');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-dark border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sword className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">FYTEPIT</h1>
                <p className="text-sm text-muted-foreground">Interdimensional Combat Arena</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleMute}
              onMouseEnter={handleUIHover}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Enter the Arena
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Battle across three realms. Own warriors. Claim victory. Welcome to the future of combat entertainment.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90"
              onClick={handleUIClick}
              onMouseEnter={handleUIHover}
            >
              <Play className="w-5 h-5 mr-2" />
              Quick Match
            </Button>
            <Link to="/worlds">
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleUIClick}
                onMouseEnter={handleUIHover}
              >
                <Zap className="w-5 h-5 mr-2" />
                Explore Worlds
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onMouseEnter={handleUIHover}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Active Fighters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{fighters.length}</div>
                <p className="text-sm text-muted-foreground">Warriors ready for battle</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onMouseEnter={handleUIHover}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Recent Battles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">147</div>
                <p className="text-sm text-muted-foreground">Fights in the last 24h</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onMouseEnter={handleUIHover}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Power Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">S-Tier</div>
                <p className="text-sm text-muted-foreground">Highest combat rating</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Fighter Selection */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Select Your Fighters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {fighters.slice(0, 8).map(fighter => (
              <div
                key={fighter.id}
                onClick={() => handleFighterSelect(fighter.id)}
                onMouseEnter={handleUIHover}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedFighters.includes(fighter.id) ? 'ring-2 ring-primary' : ''
                }`}
              >
                <FighterCard 
                  fighter={fighter} 
                  showActions={false}
                />
                {selectedFighters.includes(fighter.id) && (
                  <Badge className="absolute top-2 left-2 bg-primary">
                    Fighter {selectedFighters.indexOf(fighter.id) + 1}
                  </Badge>
                )}
              </div>
            ))}
          </div>
          
          {selectedFighters.length === 2 && (
            <div className="text-center mt-8">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90"
                onClick={handleUIClick}
                onMouseEnter={handleUIHover}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Battle
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;