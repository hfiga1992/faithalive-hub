import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AccessDenied from "@/pages/AccessDenied";

type UserRole = 'PASTOR' | 'LEADER' | 'MINISTER' | 'MEMBER' | 'VISITOR';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, hasAnyRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check if user has any of them
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasAnyRole(allowedRoles)) {
      return <AccessDenied />;
    }
  }

  return <>{children}</>;
};
