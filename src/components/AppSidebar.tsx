import { Home, Globe, Trophy, Book, Swords, HelpCircle, DollarSign, Calendar, Scroll, Settings, Zap, Users } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSound } from "@/hooks/useSound";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Worlds", url: "/worlds", icon: Globe },
  { title: "The Pit", url: "/pit", icon: Swords },
  { title: "Live Arena", url: "/live-fights", icon: Zap },
  { title: "Tournaments", url: "/tournaments", icon: Trophy },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Social", url: "/social", icon: Users },
];

const gameItems = [
  { title: "Fyte Card", url: "/fyte-card", icon: Calendar },
  { title: "Bloodbook", url: "/bloodbook", icon: Scroll },
  { title: "Codex", url: "/codex", icon: Book },
];

const infoItems = [
  { title: "How It Works", url: "/how-it-works", icon: HelpCircle },
  { title: "Pricing", url: "/pricing", icon: DollarSign },
];

const adminItems = [
  { title: "Admin", url: "/admin", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { playUI } = useSound();
  const { isAdmin, userRole, loading } = useUserRole();
  const currentPath = location.pathname;

  console.log('AppSidebar - isAdmin:', isAdmin(), 'userRole:', userRole, 'loading:', loading);

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/50";

  const handleLinkClick = (item: typeof mainItems[0]) => () => {
    console.log('Navigating to:', item.url, 'Title:', item.title);
    playUI('click');
  };

  const renderMenuItems = (items: typeof mainItems) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <NavLink 
              to={item.url} 
              end 
              className={getNavCls}
              onClick={handleLinkClick(item)}
            >
              <item.icon className="h-4 w-4" />
              {state !== "collapsed" && <span>{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarContent className="bg-black/95 border-r border-primary/20">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-bold">
            {state !== "collapsed" && "FYTEPIT"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(mainItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Game Features */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">
            {state !== "collapsed" && "Game"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(gameItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Information */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">
            {state !== "collapsed" && "Info"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(infoItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin - Only show to admins */}
        {isAdmin() && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400">
              {state !== "collapsed" && "Admin"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {renderMenuItems(adminItems)}
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}