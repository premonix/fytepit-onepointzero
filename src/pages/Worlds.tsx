import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { worlds } from '@/data/worlds';
import { fighters } from '@/data/fighters';
import { ArrowLeft, MapPin, Users, Zap, Lock, Volume2, VolumeX, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSound } from '@/hooks/useSound';
import { WorldsMap3D } from '@/components/WorldsMap3D';
import { Footer } from '@/components/Footer';

const expansionZones = [
  { id: 'shatter-point', name: 'The Shatter Point', position: 'top-left', description: 'Chaotic realm entry for rogue zones', status: 'dormant' },
  { id: 'frostline-rift', name: 'The Frostline Rift', position: 'bottom', description: 'Frozen combat plains with biomech beasts', status: 'dormant' },
  { id: 'echo-span', name: 'The Echo Span', position: 'left-center', description: 'Time-looped warriors and multiversal anomalies', status: 'dormant' },
  { id: 'ember-arc', name: 'The Ember Arc', position: 'top-right', description: 'Fire-forged tech realm with mechdragons', status: 'dormant' }
];

const Worlds = () => {
  const [selectedRealm, setSelectedRealm] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const { playUI, playRealmHover, selectRealm, stopAmbient, toggleMute, muted } = useSound();

  // Cleanup ambient sound when leaving the page
  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, [stopAmbient]);

  const handleRealmSelection = (worldId: string) => {
    const newSelection = selectedRealm === worldId ? null : worldId;
    setSelectedRealm(newSelection);
    
    if (newSelection) {
      selectRealm(worldId);
    } else {
      stopAmbient();
    }
  };

  const handleRealmHover = (worldId: string) => {
    playRealmHover(worldId);
  };

  const handleUIClick = (variant?: string) => {
    playUI('click', variant);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-dark border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm" onClick={() => handleUIClick()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Arena
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleMute}
              className="ml-auto"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                The Fracture Core
              </h1>
              <p className="text-muted-foreground">
                Interdimensional arena system where worlds collide and champions are forged
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* World Map */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  3D Arena System Map
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Interactive 3D visualization of the interdimensional combat realms
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <WorldsMap3D 
                  selectedRealm={selectedRealm} 
                  onRealmSelect={handleRealmSelection} 
                />
              </CardContent>
            </Card>
          </div>

          {/* Realm Details */}
          <div className="space-y-6">
            {selectedRealm ? (
              (() => {
                const world = worlds.find(w => w.id === selectedRealm);
                const worldFighters = fighters.filter(f => f.world === selectedRealm);
                if (!world) return null;
                
                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        {world.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm italic">"{world.description}"</p>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-semibold">Power Source:</span>
                          <p className="text-sm text-muted-foreground">{world.powerSource}</p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold">Visual Style:</span>
                          <p className="text-sm text-muted-foreground">{world.visualStyle}</p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold">Combat Style:</span>
                          <p className="text-sm text-muted-foreground">{world.combatFlavor}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-semibold">{worldFighters.length} Active Fighters</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {worldFighters.slice(0, 4).map(fighter => (
                          <Link key={fighter.id} to={`/fighter/${fighter.id}`}>
                            <Badge variant="outline" className="text-xs hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors">
                              {fighter.name}
                            </Badge>
                          </Link>
                        ))}
                        {worldFighters.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{worldFighters.length - 4} more
                          </Badge>
                        )}
                      </div>
                      
                      <Link to={`/realm/${selectedRealm}`}>
                        <Button variant="outline" size="sm" className="w-full mt-4">
                          Explore {world.name}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })()
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Realm</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Click on any realm in the map to explore its fighters, lore, and combat mechanics.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Expansion Zones Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Expansion Anchors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Four dormant anchor points await activation for new realms, tournaments, and cross-world events.
                </p>
                <div className="space-y-2">
                  {expansionZones.map(zone => (
                    <div key={zone.id} className="text-xs">
                      <span className="font-semibold">{zone.name}:</span>
                      <span className="text-muted-foreground ml-1">{zone.description}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Worlds;