import { useState } from 'react';
import { fighters } from '@/data/fighters';
import { Fighter } from '@/types/fighter';
import { FightArena } from '@/components/FightArena';
import { FighterCard } from '@/components/FighterCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Swords, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pit = () => {
  const navigate = useNavigate();
  const [selectedFighter1, setSelectedFighter1] = useState<Fighter | null>(null);
  const [selectedFighter2, setSelectedFighter2] = useState<Fighter | null>(null);
  const [fightStarted, setFightStarted] = useState(false);
  const [fightHistory, setFightHistory] = useState<Array<{ winner: Fighter; loser: Fighter; timestamp: Date }>>([]);

  const handleFighterSelect = (fighter: Fighter, position: 1 | 2) => {
    if (position === 1) {
      setSelectedFighter1(fighter);
      if (selectedFighter2?.id === fighter.id) {
        setSelectedFighter2(null);
      }
    } else {
      setSelectedFighter2(fighter);
      if (selectedFighter1?.id === fighter.id) {
        setSelectedFighter1(null);
      }
    }
  };

  const startFight = () => {
    if (selectedFighter1 && selectedFighter2) {
      setFightStarted(true);
    }
  };

  const handleFightComplete = (winner: Fighter) => {
    const loser = winner.id === selectedFighter1?.id ? selectedFighter2! : selectedFighter1!;
    setFightHistory(prev => [{ winner, loser, timestamp: new Date() }, ...prev.slice(0, 4)]);
    setFightStarted(false);
  };

  const resetSelection = () => {
    setSelectedFighter1(null);
    setSelectedFighter2(null);
    setFightStarted(false);
  };

  if (fightStarted && selectedFighter1 && selectedFighter2) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => setFightStarted(false)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Fighter Selection
          </Button>
          <FightArena
            fighter1={selectedFighter1}
            fighter2={selectedFighter2}
            onFightComplete={handleFightComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="absolute left-4 top-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Swords className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              The Pit
            </h1>
            <Swords className="h-8 w-8 text-primary scale-x-[-1]" />
          </div>
          <p className="text-muted-foreground text-lg">
            Select two fighters and watch them battle for supremacy
          </p>
        </div>

        {/* Fighter Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Fighter 1 Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Fighter 1</CardTitle>
              <CardDescription className="text-center">
                {selectedFighter1 ? selectedFighter1.name : 'Select a fighter'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedFighter1 ? (
                <div className="space-y-4">
                  <FighterCard fighter={selectedFighter1} />
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFighter1(null)}
                    className="w-full"
                  >
                    Change Fighter
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {fighters.map((fighter) => (
                    <Button
                      key={fighter.id}
                      variant="ghost"
                      onClick={() => handleFighterSelect(fighter, 1)}
                      className="h-auto p-2"
                      disabled={selectedFighter2?.id === fighter.id}
                    >
                      <div className="text-center">
                        <img
                          src={fighter.image}
                          alt={fighter.name}
                          className="w-12 h-12 rounded-full mx-auto mb-1"
                        />
                        <p className="text-xs">{fighter.name}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fighter 2 Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Fighter 2</CardTitle>
              <CardDescription className="text-center">
                {selectedFighter2 ? selectedFighter2.name : 'Select a fighter'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedFighter2 ? (
                <div className="space-y-4">
                  <FighterCard fighter={selectedFighter2} />
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFighter2(null)}
                    className="w-full"
                  >
                    Change Fighter
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {fighters.map((fighter) => (
                    <Button
                      key={fighter.id}
                      variant="ghost"
                      onClick={() => handleFighterSelect(fighter, 2)}
                      className="h-auto p-2"
                      disabled={selectedFighter1?.id === fighter.id}
                    >
                      <div className="text-center">
                        <img
                          src={fighter.image}
                          alt={fighter.name}
                          className="w-12 h-12 rounded-full mx-auto mb-1"
                        />
                        <p className="text-xs">{fighter.name}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Fight Controls */}
        <div className="text-center mb-8">
          <Button
            onClick={startFight}
            disabled={!selectedFighter1 || !selectedFighter2}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            <Swords className="h-5 w-5 mr-2" />
            Start the Fight!
          </Button>
          {selectedFighter1 && selectedFighter2 && (
            <Button
              variant="outline"
              onClick={resetSelection}
              className="ml-4"
            >
              Reset Selection
            </Button>
          )}
        </div>

        {/* Fight History */}
        {fightHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Recent Fights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fightHistory.map((fight, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src={fight.winner.image}
                        alt={fight.winner.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{fight.winner.name}</p>
                        <p className="text-sm text-muted-foreground">
                          defeated {fight.loser.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Trophy className="h-4 w-4 text-yellow-500 ml-auto" />
                      <p className="text-xs text-muted-foreground">
                        {fight.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Pit;