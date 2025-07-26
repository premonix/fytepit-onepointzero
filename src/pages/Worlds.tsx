import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { worlds } from '@/data/worlds';
import { fighters } from '@/data/fighters';
import { ArrowLeft, MapPin, Users, Zap, Lock, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSound } from '@/hooks/useSound';

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
            <Card className="h-[600px] relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Arena System Map
                </CardTitle>
              </CardHeader>
              <CardContent className="relative h-full">
                {/* Central Void */}
                <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-background/50 to-secondary/30 border border-border/50">
                  
                  {/* Main Realms */}
                  {worlds.map((world, index) => {
                    const positions = [
                      'bottom-4 left-4', // Brutalis Prime - lower left
                      'top-4 left-1/2 transform -translate-x-1/2', // Virelia - upper center  
                      'bottom-4 right-4' // Mythrendahl - lower right
                    ];
                    const fighterCount = fighters.filter(f => f.world === world.id).length;
                    
                    return (
                      <div
                        key={world.id}
                        className={`absolute ${positions[index]} cursor-pointer transition-all duration-300 hover:scale-105`}
                        onClick={() => handleRealmSelection(world.id)}
                        onMouseEnter={() => handleRealmHover(world.id)}
                      >
                        <div className={`w-24 h-24 rounded-lg border-2 ${
                          selectedRealm === world.id ? 'border-primary ring-2 ring-primary/50' : 'border-border'
                        } bg-gradient-to-br ${world.theme.gradient} p-3 flex flex-col items-center justify-center text-center shadow-lg`}>
                          <div className="text-xs font-bold text-white mb-1">
                            {world.name.split(' ')[0]}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {fighterCount} fighters
                          </Badge>
                        </div>
                      </div>
                    );
                  })}

                  {/* Expansion Zones */}
                  {expansionZones.map((zone) => {
                    const positions = {
                      'top-left': 'top-4 left-4',
                      'bottom': 'bottom-4 left-1/2 transform -translate-x-1/2',
                      'left-center': 'top-1/2 left-4 transform -translate-y-1/2',
                      'top-right': 'top-4 right-4'
                    };
                    
                    return (
                      <div
                        key={zone.id}
                        className={`absolute ${positions[zone.position]} cursor-pointer transition-all duration-300 hover:scale-110`}
                        onMouseEnter={() => {
                          setHoveredZone(zone.id);
                          playUI('hover');
                        }}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <div className="w-16 h-16 rounded-full border-2 border-border/50 bg-secondary/30 flex items-center justify-center hover:border-accent transition-colors">
                          <Lock className="w-6 h-6 text-muted-foreground" />
                        </div>
                        {hoveredZone === zone.id && (
                          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg p-2 text-xs text-center min-w-[120px] z-10">
                            <div className="font-semibold">{zone.name}</div>
                            <div className="text-muted-foreground">{zone.description}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                    <defs>
                      <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" />
                      </linearGradient>
                    </defs>
                    {/* Lines connecting main realms */}
                    <line x1="20%" y1="85%" x2="50%" y2="15%" stroke="url(#connectionGrad)" strokeWidth="2" strokeDasharray="5,5" />
                    <line x1="50%" y1="15%" x2="80%" y2="85%" stroke="url(#connectionGrad)" strokeWidth="2" strokeDasharray="5,5" />
                    <line x1="20%" y1="85%" x2="80%" y2="85%" stroke="url(#connectionGrad)" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                </div>
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
                          <Badge key={fighter.id} variant="outline" className="text-xs">
                            {fighter.name}
                          </Badge>
                        ))}
                        {worldFighters.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{worldFighters.length - 4} more
                          </Badge>
                        )}
                      </div>
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
    </div>
  );
};

export default Worlds;