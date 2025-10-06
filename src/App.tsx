import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserRegister from "./pages/UserRegister";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Ministries from "./pages/Ministries";
import Events from "./pages/Events";
import Worship from "./pages/Worship";
import Announcements from "./pages/Announcements";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-register" element={<UserRegister />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/members" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER']}>
                  <Members />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ministries" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER']}>
                  <Ministries />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER']}>
                  <Events />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/worship" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER', 'MINISTER']}>
                  <Worship />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/announcements" 
              element={
                <ProtectedRoute>
                  <Announcements />
                </ProtectedRoute>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
