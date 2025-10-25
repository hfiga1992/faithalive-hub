import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ErrorBoundary } from "./components/error/ErrorBoundary";
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
import MediaSettings from "./pages/MediaSettings";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
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
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR']}>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/attendance" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR', 'LEADER']}>
                  <Attendance />
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
            <Route 
              path="/media/settings" 
              element={
                <ProtectedRoute allowedRoles={['PASTOR']}>
                  <MediaSettings />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;
