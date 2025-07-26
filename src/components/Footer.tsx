import { Button } from '@/components/ui/button';
import { Sword } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Sword className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">FYTEPIT</h3>
        </div>
        
        <div className="flex justify-center gap-8 mb-6 text-gray-400">
          <Link to="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Fighters
            </Button>
          </Link>
          <Link to="/worlds">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Worlds
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Leaderboard
            </Button>
          </Link>
          <Link to="/codex">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Codex
            </Button>
          </Link>
          <Link to="/how-it-works">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              How It Works
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Pricing
            </Button>
          </Link>
        </div>
        
        <div className="flex justify-center gap-6 mb-6 text-gray-400">
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            Discord
          </Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            Twitter
          </Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            Terms
          </Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            Privacy
          </Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            Legal
          </Button>
        </div>
        
        <p className="text-gray-500 text-sm">
          © 2024 FYTEPIT. The arena awaits.
        </p>
      </div>
    </footer>
  );
};