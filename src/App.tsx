import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Worlds from "./pages/Worlds";
import Fighter from "./pages/Fighter";
import Realm from "./pages/Realm";
import Leaderboard from "./pages/Leaderboard";
import Codex from "./pages/Codex";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Pit from "./pages/Pit";
import FyteCard from "./pages/FyteCard";
import Bloodbook from "./pages/Bloodbook";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Success from "./pages/Success";
import Profile from "./pages/Profile";
import LiveFight from "./pages/LiveFight";
import LiveFights from "./pages/LiveFights";
import { SidebarLayout } from "./components/SidebarLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { RealtimeNotifications } from "./components/RealtimeNotifications";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <SidebarLayout>
      <RealtimeNotifications />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/success" element={<Success />} />
        <Route path="/" element={<Index />} />
        <Route path="/worlds" element={<Worlds />} />
        <Route path="/fighter/:fighterId" element={<Fighter />} />
        <Route path="/realm/:realmId" element={<Realm />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/codex" element={<Codex />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/pit" element={<ProtectedRoute><Pit /></ProtectedRoute>} />
        <Route path="/fyte-card" element={<ProtectedRoute><FyteCard /></ProtectedRoute>} />
        <Route path="/bloodbook" element={<ProtectedRoute><Bloodbook /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/live-fights" element={<ProtectedRoute><LiveFights /></ProtectedRoute>} />
        <Route path="/live-fight/:fightId" element={<ProtectedRoute><LiveFight /></ProtectedRoute>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SidebarLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
