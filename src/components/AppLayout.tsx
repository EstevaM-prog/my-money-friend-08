import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { getSession, logout } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppLayout() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getSession());

  // Keep user state in sync (e.g. after register/login)
  useEffect(() => {
    setUser(getSession());
  }, []);

  const username = user?.name ?? "Usuário";
  const email = user?.email ?? "";
  const avatarUrl = user?.avatarUrl ?? "";

  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar only on desktop */}
        {!isMobile && <AppSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10 px-4">
            {!isMobile ? <SidebarTrigger /> : <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg gradient-primary">
                <span className="text-primary-foreground text-xs font-bold">FP</span>
              </div>
            </div>}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 hover:opacity-80 transition-opacity outline-none">
                  <span className="text-sm font-medium hidden sm:block">{username}</span>
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarImage src={avatarUrl} alt={username} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2 space-y-0.5">
                  <p className="text-sm font-semibold truncate">{username}</p>
                  <p className="text-xs text-muted-foreground truncate">{email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" /> Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/configuracoes" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" /> Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className={cn("flex-1", isMobile && "pb-20")}>
            <Outlet />
          </main>
        </div>
        {/* Bottom nav only on mobile */}
        {isMobile && <MobileBottomNav />}
      </div>
    </SidebarProvider>
  );
}
