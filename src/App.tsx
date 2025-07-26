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
import NotFound from "./pages/NotFound";
import { MobileMenu } from "./components/MobileMenu";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <>
      <MobileMenu />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/worlds" element={<Worlds />} />
        <Route path="/fighter/:fighterId" element={<Fighter />} />
        <Route path="/realm/:realmId" element={<Realm />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/codex" element={<Codex />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/pit" element={<Pit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
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
