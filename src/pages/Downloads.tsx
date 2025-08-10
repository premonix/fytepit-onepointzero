import { useState } from 'react';
import { Download, Archive, Filter, Map, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fighters } from '@/data/fighters';

// Additional website imagery
import puppetMasterHero from '@/assets/puppet-master-hero.jpg';
import worldMapImage from '@/assets/fytepit-world-map.jpg';
import fighter1 from '@/assets/fighter-1.jpg';
import fighter2 from '@/assets/fighter-2.jpg';
import fighter3 from '@/assets/fighter-3.jpg';

const realmColors = {
  'dark-arena': 'bg-red-600/20 text-red-400 border-red-600/30',
  'sci-fi-ai': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  'fantasy-tech': 'bg-purple-600/20 text-purple-400 border-purple-600/30',
  'earth-1-0': 'bg-green-600/20 text-green-400 border-green-600/30',
};

const realmNames = {
  'dark-arena': 'Dark Arena',
  'sci-fi-ai': 'Sci-Fi AI',
  'fantasy-tech': 'Fantasy Tech',
  'earth-1-0': 'Earth 1.0',
};

// Additional website imagery
const additionalImages = [
  {
    id: 'puppet-master-hero',
    name: 'Puppet Master Hero',
    image: puppetMasterHero,
    category: 'Hero Images',
    description: 'The mysterious Puppet Master - creator of the FYTEPIT universe'
  },
  {
    id: 'fytepit-world-map',
    name: 'FYTEPIT World Map',
    image: worldMapImage,
    category: 'World Assets',
    description: 'Complete map of the FYTEPIT multiverse showing all realms'
  },
  {
    id: 'fighter-1',
    name: 'Fighter Concept 1',
    image: fighter1,
    category: 'Concept Art',
    description: 'Early fighter concept artwork'
  },
  {
    id: 'fighter-2',
    name: 'Fighter Concept 2',
    image: fighter2,
    category: 'Concept Art',
    description: 'Early fighter concept artwork'
  },
  {
    id: 'fighter-3',
    name: 'Fighter Concept 3',
    image: fighter3,
    category: 'Concept Art',
    description: 'Early fighter concept artwork'
  }
];

const categoryColors = {
  'Hero Images': 'bg-purple-600/20 text-purple-400 border-purple-600/30',
  'World Assets': 'bg-orange-600/20 text-orange-400 border-orange-600/30',
  'Concept Art': 'bg-cyan-600/20 text-cyan-400 border-cyan-600/30',
};

function Downloads() {
  const [selectedRealm, setSelectedRealm] = useState<string>('all');
  const [downloading, setDownloading] = useState<Set<string>>(new Set());

  const groupedFighters = fighters.reduce((acc, fighter) => {
    if (!acc[fighter.world]) {
      acc[fighter.world] = [];
    }
    acc[fighter.world].push(fighter);
    return acc;
  }, {} as Record<string, typeof fighters>);

  const filteredFighters = selectedRealm === 'all' 
    ? fighters 
    : groupedFighters[selectedRealm] || [];

  const totalImages = fighters.length + additionalImages.length;

  const downloadAdditionalImage = async (imageUrl: string, filename: string) => {
    try {
      setDownloading(prev => new Set(prev).add(filename));
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(prev => {
        const newSet = new Set(prev);
        newSet.delete(filename);
        return newSet;
      });
    }
  };

  const downloadRealmImages = async (realm: string) => {
    const realmFighters = groupedFighters[realm] || [];
    for (const fighter of realmFighters) {
      const filename = `FYTEPIT_${fighter.name.replace(/\s+/g, '_')}_${realmNames[realm].replace(/\s+/g, '_')}.jpg`;
      await downloadImage(fighter.image, filename);
      // Add delay to prevent overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const downloadAllImages = async () => {
    for (const fighter of fighters) {
      const filename = `FYTEPIT_${fighter.name.replace(/\s+/g, '_')}_${realmNames[fighter.world].replace(/\s+/g, '_')}.jpg`;
      await downloadImage(fighter.image, filename);
      // Add delay to prevent overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Download additional images
    for (const image of additionalImages) {
      const filename = `FYTEPIT_${image.name.replace(/\s+/g, '_')}.jpg`;
      await downloadImage(image.image, filename);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const downloadCategoryImages = async (category: string) => {
    const categoryImages = additionalImages.filter(img => img.category === category);
    for (const image of categoryImages) {
      const filename = `FYTEPIT_${image.name.replace(/\s+/g, '_')}.jpg`;
      await downloadImage(image.image, filename);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      setDownloading(prev => new Set(prev).add(filename));
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(prev => {
        const newSet = new Set(prev);
        newSet.delete(filename);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Archive className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Fighter Gallery
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Download all FYTEPIT fighter images in high quality. Perfect for wallpapers, fan art, or your own projects.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{totalImages}</div>
              <div className="text-sm text-muted-foreground">Total Images</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{fighters.length}</div>
              <div className="text-sm text-muted-foreground">Fighters</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{additionalImages.length}</div>
              <div className="text-sm text-muted-foreground">Concept Art</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">Free</div>
              <div className="text-sm text-muted-foreground">Download</div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Download Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="w-5 h-5" />
              Bulk Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={downloadAllImages}
                className="flex items-center gap-2"
                size="lg"
              >
                <Download className="w-4 h-4" />
                Download All Images ({totalImages})
              </Button>
              {Object.entries(groupedFighters).map(([realm, realmFighters]) => (
                <Button
                  key={realm}
                  variant="outline"
                  onClick={() => downloadRealmImages(realm)}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {realmNames[realm]} ({realmFighters.length})
                </Button>
              ))}
              
              {/* Category Downloads */}
              {Object.keys(categoryColors).map((category) => {
                const categoryImages = additionalImages.filter(img => img.category === category);
                return (
                  <Button
                    key={category}
                    variant="outline"
                    onClick={() => downloadCategoryImages(category)}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {category} ({categoryImages.length})
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <Tabs value={selectedRealm} onValueChange={setSelectedRealm} className="mb-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              All Images
            </TabsTrigger>
            <TabsTrigger value="additional" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Concept Art
            </TabsTrigger>
            {Object.keys(groupedFighters).map((realm) => (
              <TabsTrigger key={realm} value={realm}>
                {realmNames[realm]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-8">
              {/* Fighter Images */}
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Crown className="w-6 h-6 text-primary" />
                  Fighter Gallery ({fighters.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {fighters.map((fighter) => (
                    <FighterDownloadCard 
                      key={fighter.id} 
                      fighter={fighter} 
                      downloading={downloading}
                      onDownload={downloadImage}
                    />
                  ))}
                </div>
              </div>

              {/* Additional Images */}
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Map className="w-6 h-6 text-primary" />
                  Concept Art & World Assets ({additionalImages.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {additionalImages.map((image) => (
                    <AdditionalImageCard 
                      key={image.id} 
                      image={image} 
                      downloading={downloading}
                      onDownload={downloadImage}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="additional" className="mt-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Concept Art & World Assets</h2>
              <p className="text-muted-foreground">
                {additionalImages.length} additional images including world maps, concept art, and hero imagery
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {additionalImages.map((image) => (
                <AdditionalImageCard 
                  key={image.id} 
                  image={image} 
                  downloading={downloading}
                  onDownload={downloadImage}
                />
              ))}
            </div>
          </TabsContent>

          {Object.entries(groupedFighters).map(([realm, realmFighters]) => (
            <TabsContent key={realm} value={realm} className="mt-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">{realmNames[realm]}</h2>
                <p className="text-muted-foreground">
                  {realmFighters.length} fighters from the {realmNames[realm]} realm
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {realmFighters.map((fighter) => (
                  <FighterDownloadCard 
                    key={fighter.id} 
                    fighter={fighter} 
                    downloading={downloading}
                    onDownload={downloadImage}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function FighterDownloadCard({ 
  fighter, 
  downloading, 
  onDownload 
}: { 
  fighter: typeof fighters[0];
  downloading: Set<string>;
  onDownload: (url: string, filename: string) => void;
}) {
  const filename = `FYTEPIT_${fighter.name.replace(/\s+/g, '_')}_${realmNames[fighter.world].replace(/\s+/g, '_')}.jpg`;
  const isDownloading = downloading.has(filename);

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={fighter.image} 
          alt={fighter.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        <Button
          onClick={() => onDownload(fighter.image, filename)}
          disabled={isDownloading}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          size="sm"
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold truncate">{fighter.name}</h3>
          <Badge className={realmColors[fighter.world]}>
            {realmNames[fighter.world]}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {fighter.description}
        </p>
        <Button 
          onClick={() => onDownload(fighter.image, filename)}
          disabled={isDownloading}
          className="w-full"
          variant="outline"
          size="sm"
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function AdditionalImageCard({ 
  image, 
  downloading, 
  onDownload 
}: { 
  image: typeof additionalImages[0];
  downloading: Set<string>;
  onDownload: (url: string, filename: string) => void;
}) {
  const filename = `FYTEPIT_${image.name.replace(/\s+/g, '_')}.jpg`;
  const isDownloading = downloading.has(filename);

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={image.image} 
          alt={image.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        <Button
          onClick={() => onDownload(image.image, filename)}
          disabled={isDownloading}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          size="sm"
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold truncate">{image.name}</h3>
          <Badge className={categoryColors[image.category]}>
            {image.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {image.description}
        </p>
        <Button 
          onClick={() => onDownload(image.image, filename)}
          disabled={isDownloading}
          className="w-full"
          variant="outline"
          size="sm"
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default Downloads;