import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Complaints from "./pages/Complaints";
import ComplaintDetail from "./pages/ComplaintDetail";
import NewComplaint from "./pages/NewComplaint";
import Architecture from "./pages/Architecture";
import JoinOrganization from "./pages/JoinOrganization";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import { useStore } from "./store/useStore";

const queryClient = new QueryClient();

const getRedirectPath = (role: string) => {
  if (role === 'MANAGER' || role === 'ADMIN') return '/dashboard';
  return '/complaints';
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, userProfiles, loading } = useStore();
  
  if (loading) return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  
  if (userProfiles.length > 0 && !currentUser) {
    return <Navigate to="/onboarding" replace />;
  }

  if (currentUser) {
    return <Navigate to={getRedirectPath(currentUser.role)} replace />;
  }
  
  return <>{children}</>;
};

const ProtectedRoute = ({ children, allowedRoles, isSelectionPage = false }: { children: React.ReactNode, allowedRoles?: string[], isSelectionPage?: boolean }) => {
  const { currentUser, userProfiles, loading } = useStore();
  
  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  if (userProfiles.length === 0) return <Navigate to="/login" replace />;
  
  if (!currentUser && !isSelectionPage) return <Navigate to="/onboarding" replace />;
  
  if (currentUser && allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={getRedirectPath(currentUser.role)} replace />;
  }
  
  if (isSelectionPage) return <>{children}</>;
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          
          <Route path="/onboarding" element={
            <ProtectedRoute isSelectionPage>
              <Index />
            </ProtectedRoute>
          } />

          <Route path="/join" element={
            <ProtectedRoute isSelectionPage>
              <JoinOrganization />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/complaints" element={
            <ProtectedRoute>
              <Complaints />
            </ProtectedRoute>
          } />

          <Route path="/complaints/new" element={
            <ProtectedRoute>
              <NewComplaint />
            </ProtectedRoute>
          } />

          <Route path="/complaints/:id" element={
            <ProtectedRoute>
              <ComplaintDetail />
            </ProtectedRoute>
          } />

          <Route path="/architecture" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Architecture />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;