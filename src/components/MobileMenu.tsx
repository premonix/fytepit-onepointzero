import { useState } from "react";
import { Menu, Home, Globe, Trophy, Book, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
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

  if (!isMobile) return null;

  const menuItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/worlds", label: "Worlds", icon: Globe },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { to: "/codex", label: "Codex", icon: Book },
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
        <DrawerContent className="h-[300px]">
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle className="text-lg font-bold">Navigation</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          
          <div className="px-4 pb-4 space-y-2">
            {menuItems.map((item) => {
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
        </DrawerContent>
      </Drawer>
    </>
  );
};