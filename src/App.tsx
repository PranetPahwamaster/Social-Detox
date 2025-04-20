
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AppLayout from "./components/layouts/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MindToolkit from "./pages/MindToolkit";
import NeuroBot from "./pages/NeuroBot";
import MindGraph from "./pages/MindGraph";
import EnergyLab from "./pages/EnergyLab";
import ZenPlay from "./pages/ZenPlay";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Auth wrapper for correct context nesting
const AuthenticatedApp = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Home />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/toolkit" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <MindToolkit />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/toolkit/:tool" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <MindToolkit />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/neurobot" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <NeuroBot />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mind-graph" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <MindGraph />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/energy-lab" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <EnergyLab />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/zenplay" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <ZenPlay />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AuthenticatedApp />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
