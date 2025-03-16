
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HeartfeltBloom from "./pages/HeartfeltBloom";
import CosmicSorry from "./pages/CosmicSorry";
import PuzzleOfUs from "./pages/PuzzleOfUs";
import RainyDay from "./pages/RainyDay";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/heartfelt-bloom" element={<HeartfeltBloom />} />
          <Route path="/cosmic-sorry" element={<CosmicSorry />} />
          <Route path="/puzzle-of-us" element={<PuzzleOfUs />} />
          <Route path="/rainy-day" element={<RainyDay />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
