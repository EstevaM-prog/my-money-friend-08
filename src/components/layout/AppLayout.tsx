import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Eye, EyeOff, Wallet } from "lucide-react";
import { getSession, logout } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePrivacy } from "@/hooks/use-privacy";
import { ModeToggle } from "./ThemeToggle";

export function AppLayout() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { isPrivate, togglePrivacy } = usePrivacy();
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
      <div className="min-h-[100dvh] flex w-full bg-background transition-colors duration-300">
        {/* Sidebar only on desktop */}
        {!isMobile && <AppSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b bg-card/50 backdrop-blur-xl sticky top-0 z-10 px-6">
            <div className="flex items-center gap-4">
              {isMobile && (
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg gradient-primary rotate-3 shadow-md shadow-primary/20">
                    <Wallet className="h-4.5 w-4.5 text-primary-foreground" />
                  </div>
                  <span className="font-bold tracking-tight text-lg">
                    Cash<span className="text-primary italic">Flow</span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={togglePrivacy}
                className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all outline-none"
                title={isPrivate ? "Mostrar valores" : "Esconder valores"}
              >
                {isPrivate ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>

              <ModeToggle />

              <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:opacity-90 transition-all outline-none group">
                    <div className="flex flex-col items-end hidden sm:flex">
                      <span className="text-sm font-semibold leading-none">
                        {username}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">
                        Conta Ativa
                      </span>
                    </div>
                    <Avatar className="h-9 w-9 border-2 border-primary/20 ring-offset-2 ring-offset-background group-hover:ring-2 ring-primary/20 transition-all">
                      <AvatarImage src={avatarUrl} alt={username} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-border/50">
                  <div className="px-3 py-3 space-y-1 mb-1 bg-muted/30 rounded-xl">
                    <p className="text-sm font-bold truncate">{username}</p>
                    <p className="text-[10px] text-muted-foreground truncate uppercase tracking-tight">
                      {email}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="-mx-1 my-1" />
                  <DropdownMenuItem asChild className="rounded-lg h-10 px-3">
                    <Link
                      to="/perfil"
                      className="flex items-center gap-2.5 cursor-pointer font-medium"
                    >
                      <User className="h-4 w-4 text-muted-foreground" /> Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg h-10 px-3">
                    <Link
                      to="/configuracoes"
                      className="flex items-center gap-2.5 cursor-pointer font-medium"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" /> Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="-mx-1 my-1" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg h-10 px-3 font-semibold"
                  >
                    <LogOut className="h-4 w-4" /> Sair da Conta
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
