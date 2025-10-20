import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Calendar, 
  Music, 
  Megaphone, 
  BarChart3,
  ListChecks,
  ClipboardCheck,
  Church,
  LogOut,
  ChevronLeft,
  ChevronRight,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfiles";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Membros", path: "/members" },
  { icon: Layers, label: "Ministérios", path: "/ministries" },
  { icon: Calendar, label: "Eventos", path: "/events" },
  { icon: Music, label: "Louvor", path: "/worship" },
  { icon: Megaphone, label: "Anúncios", path: "/announcements" },
  { icon: ClipboardCheck, label: "Presença", path: "/attendance" },
  { icon: DollarSign, label: "Financeiro", path: "/finance" },
  { icon: BarChart3, label: "Relatórios", path: "/reports" },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 h-screen bg-card border-r border-border
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      <div className="flex h-full flex-col">
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-2 animate-fade-in">
              <Church className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg bg-gradient-spiritual bg-clip-text text-transparent">
                FaithAlive
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={`h-8 w-8 ${isCollapsed ? "mx-auto" : ""}`}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-border">
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}>
            <Avatar className={isCollapsed ? "h-10 w-10" : "h-12 w-12"}>
              <AvatarImage src={profile?.photo_url || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {profile?.name?.split(" ").map(n => n[0]).join("") || user?.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 animate-fade-in">
                <p className="text-sm font-semibold truncate">{profile?.name || user?.email}</p>
                <p className="text-xs text-muted-foreground truncate">{profile?.status || "Membro"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center rounded-lg px-3 py-2.5 transition-all duration-200
                      ${active 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                      ${isCollapsed ? "justify-center" : "space-x-3"}
                    `}
                  >
                    <Icon className={isCollapsed ? "h-5 w-5" : "h-5 w-5 flex-shrink-0"} />
                    {!isCollapsed && (
                      <span className="text-sm font-medium animate-fade-in">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`
              w-full text-destructive hover:bg-destructive/10 hover:text-destructive
              ${isCollapsed ? "px-0" : "justify-start"}
            `}
          >
            <LogOut className={isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3"} />
            {!isCollapsed && <span className="animate-fade-in">Sair</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};
