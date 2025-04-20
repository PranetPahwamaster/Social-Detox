
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layouts/AppLayout";
import Home from "./pages/Home";
import MindToolkit from "./pages/MindToolkit";
import NeuroBot from "./pages/NeuroBot";
import MindGraph from "./pages/MindGraph";
import EnergyLab from "./pages/EnergyLab";
import ZenPlay from "./pages/ZenPlay";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/toolkit" element={<MindToolkit />} />
            <Route path="/toolkit/:tool" element={<MindToolkit />} />
            <Route path="/neurobot" element={<NeuroBot />} />
            <Route path="/mind-graph" element={<MindGraph />} />
            <Route path="/energy-lab" element={<EnergyLab />} />
            <Route path="/zenplay" element={<ZenPlay />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
