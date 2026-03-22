import {
  LayoutDashboard,
  Target,
  CreditCard,
  FileBarChart,
  Settings,
  Plus,
} from "lucide-react";
import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Painel", url: "/", icon: LayoutDashboard },
  { title: "Metas", url: "/metas", icon: Target },
  { title: "Contas", url: "/contas", icon: CreditCard },
  { title: "Relatórios", url: "/relatorios", icon: FileBarChart },
];

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.slice(0, 2).map((item) => {
          const isActive =
            item.url === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.url);
          return (
            <RouterNavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-muted-foreground transition-colors",
                isActive && "text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.title}</span>
            </RouterNavLink>
          );
        })}

        {/* Center FAB */}
        <div className="flex flex-col items-center justify-center flex-1">
          <button
            onClick={() => navigate("/?new=1")}
            className="flex items-center justify-center w-12 h-12 -mt-5 rounded-full gradient-primary text-primary-foreground shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>

        {navItems.slice(2).map((item) => {
          const isActive = location.pathname.startsWith(item.url);
          return (
            <RouterNavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-muted-foreground transition-colors",
                isActive && "text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.title}</span>
            </RouterNavLink>
          );
        })}
      </div>
    </nav>
  );
}
