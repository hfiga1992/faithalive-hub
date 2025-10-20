import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
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
import Reports from "./pages/Reports";
import Attendance from "./pages/Attendance";
import Finance from "./pages/Finance";
import FinancialTransactions from "./pages/FinancialTransactions";
import FinancialCategories from "./pages/FinancialCategories";
import FinancialAccounts from "./pages/FinancialAccounts";
import FinancialContacts from "./pages/FinancialContacts";
import CostCenters from "./pages/CostCenters";
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
                  <DashboardLayout><Dashboard /></DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/members" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER']}>
                  <DashboardLayout><Members /></DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ministries" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER']}>
                  <DashboardLayout><Ministries /></DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER']}>
                  <DashboardLayout><Events /></DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/worship" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER', 'MINISTER']}>
                  <DashboardLayout><Worship /></DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/announcements" 
              element={
                <ProtectedRoute>
                  <DashboardLayout><Announcements /></DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR']}>
                  <DashboardLayout><Reports /></DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/attendance" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER']}>
                  <DashboardLayout><Attendance /></DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER']}>
                  <Finance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance/transactions" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER']}>
                  <FinancialTransactions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance/categories" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER']}>
                  <FinancialCategories />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance/accounts" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER']}>
                  <FinancialAccounts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance/contacts" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER']}>
                  <FinancialContacts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance/cost-centers" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER']}>
                  <CostCenters />
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
