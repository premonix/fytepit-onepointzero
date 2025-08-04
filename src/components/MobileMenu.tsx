import { useState } from "react";
import { Menu, Home, Globe, Trophy, Book, X, Swords, HelpCircle, DollarSign, Calendar, Scroll, Zap, Users, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useSound } from "@/hooks/useSound";

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { playUI } = useSound();
  const { isAdmin } = useUserRole();

  if (!isMobile) return null;

  const mainMenuItems = [
    { to: "/", label: "Home", icon: Home, section: "main" },
    { to: "/worlds", label: "Worlds", icon: Globe, section: "main" },
    { to: "/pit", label: "The Pit", icon: Swords, section: "main" },
    { to: "/live-fights", label: "Live Arena", icon: Zap, section: "main" },
    { to: "/tournaments", label: "Tournaments", icon: Trophy, section: "main" },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy, section: "main" },
    { to: "/social", label: "Social", icon: Users, section: "main" },
  ];

  const gameMenuItems = [
    { to: "/fyte-card", label: "Fyte Card", icon: Calendar, section: "game" },
    { to: "/bloodbook", label: "Bloodbook", icon: Scroll, section: "game" },
    { to: "/codex", label: "Codex", icon: Book, section: "game" },
  ];

  const infoMenuItems = [
    { to: "/how-it-works", label: "How It Works", icon: HelpCircle, section: "info" },
    { to: "/pricing", label: "Pricing", icon: DollarSign, section: "info" },
  ];

  const adminMenuItems = [
    { to: "/admin", label: "Admin", icon: Settings, section: "admin" },
  ];

  const allMenuItems = [
    ...mainMenuItems,
    ...gameMenuItems,
    ...infoMenuItems,
    ...(isAdmin() ? adminMenuItems : [])
  ];

  const handleMenuClick = () => {
    playUI("click");
    setIsOpen(true);
  };

  const handleLinkClick = () => {
    playUI("click");
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border"
        onClick={handleMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle className="text-lg font-bold">Navigation</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          
          <div className="px-4 pb-4 space-y-4 overflow-y-auto flex-1">
            {/* Main Navigation */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Main
              </h3>
              {mainMenuItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Game Features */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Game
              </h3>
              {gameMenuItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Information */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Info
              </h3>
              {infoMenuItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Admin - Only show to admins */}
            {isAdmin() && (
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                  Admin
                </h3>
                {adminMenuItems.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};