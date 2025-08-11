import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMenu } from "@/components/MobileMenu";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Music, Pause } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { useSoundManager } from "@/services/SoundManager";
import { UserMenu } from "@/components/UserMenu";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const isMobile = useIsMobile();
  const { muted, toggleMute, playUI } = useSound();
  const soundManager = useSoundManager();
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    soundManager.initialize();
    const updateMusicState = () => {
      setMusicPlaying(soundManager.getState().musicPlaying);
    };
    const interval = setInterval(updateMusicState, 1000);
    return () => clearInterval(interval);
  }, [soundManager]);

  const handleMusicToggle = () => {
    const playing = soundManager.toggleBackgroundMusic();
    setMusicPlaying(playing);
  };

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col">
        <MobileMenu />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-black">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Desktop Header with Sidebar Toggle */}
          <header className="h-12 flex items-center justify-between border-b border-primary/20 bg-black/95 px-4">
            <SidebarTrigger className="text-white hover:text-primary" />
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMusicToggle}
                onMouseEnter={() => playUI('hover')}
                className="text-white hover:text-primary"
                title={musicPlaying ? "Pause music" : "Play music"}
              >
                {musicPlaying ? <Pause className="w-4 h-4" /> : <Music className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleMute}
                onMouseEnter={() => playUI('hover')}
                className="text-white hover:text-primary"
                title={muted ? "Unmute all sounds" : "Mute all sounds"}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <UserMenu />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}