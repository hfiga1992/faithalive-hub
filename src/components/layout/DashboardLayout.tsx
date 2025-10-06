import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

      {/* Main Content */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? "md:pl-20" : "md:pl-64"}
        `}
      >
        <Header onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
