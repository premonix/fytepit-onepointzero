import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMenu } from "@/components/MobileMenu";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { UserMenu } from "@/components/UserMenu";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const isMobile = useIsMobile();
  const { muted, toggleMute, playUI } = useSound();

  if (isMobile) {
    return (
      <>
        <MobileMenu />
        {children}
      </>
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
                onClick={toggleMute}
                onMouseEnter={() => playUI('hover')}
                className="text-white hover:text-primary"
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
        </div>
      </div>
    </SidebarProvider>
  );
}