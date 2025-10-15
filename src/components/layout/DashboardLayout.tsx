import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu, Church } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { church } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Sidebar - Mobile Overlay */}
      {isMobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="md:hidden">
            <Sidebar
              isCollapsed={false}
              onToggle={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </>
      )}

      {/* Header - Fora do conteúdo */}
      <header 
        className={`
          fixed top-0 right-0 z-20 bg-background border-b border-border
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? "md:left-20" : "md:left-64"}
          left-0
        `}
      >
        <div className="flex h-16 items-center gap-4 px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Church className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">{church?.name || "FaithAlive"}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div
        className={`
          pt-16 transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? "md:pl-20" : "md:pl-64"}
        `}
      >
        <main className="px-4 md:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};
