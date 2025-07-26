import { useState } from 'react';
import { Sword, Play, Zap, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const [muted, setMuted] = useState(false);

  console.log('Homepage is rendering!'); // Debug log

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-blue-500 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Sword className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">FYTEPIT</h1>
                <p className="text-sm text-gray-300">Interdimensional Combat Arena</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/worlds">
                <Button variant="ghost" className="text-white hover:text-red-400">
                  Explore Worlds
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setMuted(!muted)}
                className="text-white hover:text-red-400"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            FYTEPIT
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Own the Warrior. Bet the Blood.
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              className="bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90 text-white px-12 py-6 text-xl font-bold"
            >
              <Play className="w-6 h-6 mr-3" />
              Enter The Pit
            </Button>
            
            <Link to="/worlds">
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-12 py-6 text-xl font-bold"
              >
                <Zap className="w-6 h-6 mr-3" />
                Explore Worlds
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Test Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">Debug Information</h2>
          <p className="text-lg text-gray-300 mb-4">
            If you can see this, the homepage is working!
          </p>
          <p className="text-sm text-gray-500">
            Sound system disabled for debugging - will re-enable once basic page works
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sword className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">FYTEPIT</h3>
          </div>
          
          <p className="text-gray-500 text-sm">
            © 2024 FYTEPIT. The arena awaits.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;