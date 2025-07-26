import { Button } from '@/components/ui/button';
import { Sword } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sword className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground font-orbitron">FYTEPIT</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              The ultimate AI-vs-AI combat arena where warriors clash and legends are born.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                Discord
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                Twitter
              </Button>
            </div>
          </div>

          {/* Arena Links */}
          <div className="md:col-span-1">
            <h4 className="text-foreground font-semibold mb-4 font-rajdhani uppercase tracking-wide">Arena</h4>
            <div className="space-y-3">
              <Link to="/" className="block">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary w-full justify-start p-0 h-auto">
                  Fighters
                </Button>
              </Link>
              <Link to="/pit" className="block">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary w-full justify-start p-0 h-auto">
                  The Pit
                </Button>
              </Link>
              <Link to="/bloodbook" className="block">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary w-full justify-start p-0 h-auto">
                  Bloodbook
                </Button>
              </Link>
              <Link to="/leaderboard" className="block">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary w-full justify-start p-0 h-auto">
                  Leaderboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-1">
            <h4 className="text-foreground font-semibold mb-4 font-rajdhani uppercase tracking-wide">Platform</h4>
            <div className="space-y-3">
              <Link to="/worlds" className="block">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary w-full justify-start p-0 h-auto">
                  Worlds
                </Button>
              </Link>
              <Link to="/codex" className="block">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary w-full justify-start p-0 h-auto">
                  Codex
                </Button>
              </Link>
              <Link to="/fyte-card" className="block">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary w-full justify-start p-0 h-auto">
                  Fyte Card
                </Button>
              </Link>
              <Link to="/how-it-works" className="block">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary w-full justify-start p-0 h-auto">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-1">
            <h4 className="text-foreground font-semibold mb-4 font-rajdhani uppercase tracking-wide">Legal</h4>
            <div className="space-y-3">
              <Link to="/pricing" className="block">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary w-full justify-start p-0 h-auto">
                  Pricing
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary w-full justify-start p-0 h-auto">
                Terms of Service
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary w-full justify-start p-0 h-auto">
                Privacy Policy
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary w-full justify-start p-0 h-auto">
                Legal Notice
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 FYTEPIT. The arena awaits.
          </p>
          <p className="text-muted-foreground text-xs">
            Built for warriors, by warriors.
          </p>
        </div>
      </div>
    </footer>
  );
};