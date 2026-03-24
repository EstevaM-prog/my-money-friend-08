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
import {
  User,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Wallet,
  SunMoon,
  Sparkles,
  Command,
  HelpCircle,
  ChevronRight,
  Plus,
  CheckCircle2
} from "lucide-react";
import { getSession, logout } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePrivacy } from "@/hooks/use-privacy";
import { ModeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function AppLayout() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { isPrivate, togglePrivacy } = usePrivacy();
  const { theme } = useTheme();
  const [user, setUser] = useState(() => getSession());

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

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

            <div className="flex items-center gap-4">
              {/* Create Button - Desktop only */}
              {!isMobile && (
                <Button
                  onClick={() => navigate("/?new=1")}
                  className="rounded-full px-5 h-10 border-border/50 bg-background hover:bg-muted text-foreground font-semibold shadow-sm flex items-center gap-2 transition-all active:scale-95"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create</span>
                </Button>
              )}

              <div className="flex items-center gap-1">
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
              </div>

              <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:opacity-90 transition-all outline-none group">
                    <Avatar className="h-9 w-9 border-2 border-primary/20 ring-offset-2 ring-offset-background group-hover:ring-2 ring-primary/20 transition-all">
                      <AvatarImage src={avatarUrl} alt={username} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className={cn(
                    "w-64 p-2 rounded-[22px] shadow-2xl border-border/50 animate-in zoom-in-95 duration-200",
                    isDark ? "bg-[#0f0f12] text-white" : "bg-white text-slate-900"
                  )}
                >
                  {/* User Profile Header */}
                  <div className="px-3 py-3 mb-1">
                    <div className="flex items-center gap-3">
                      <Avatar className={cn("h-10 w-10 border", isDark ? "border-white/10 shadow-inner" : "border-slate-200 shadow-sm")}>
                        <AvatarImage src={avatarUrl} alt={username} />
                        <AvatarFallback className={cn("bg-muted text-muted-foreground text-xs font-bold", isDark && "bg-white/5 text-white/70")}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <p className="text-[14px] font-bold truncate tracking-tight">{username}</p>
                        <p className={cn("text-[11px] truncate tracking-tight leading-none mt-0.5", isDark ? "text-white/40" : "text-slate-500")}>
                          {email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Main Links */}
                  <div className="space-y-0.5 mt-1 px-1">
                    <DropdownMenuItem asChild className="rounded-[12px] h-10 px-3 focus:bg-accent cursor-pointer outline-none">
                      <Link to="/perfil" className="flex items-center gap-3 group/item">
                        <User className="h-[18px] w-[18px] opacity-60 group-hover/item:opacity-100 transition-opacity" />
                        <span className="text-[13px] font-medium tracking-tight">Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="rounded-[12px] h-10 px-3 focus:bg-accent cursor-pointer outline-none">
                      <Link to="/configuracoes" className="flex items-center gap-3 group/item">
                        <Settings className="h-[18px] w-[18px] opacity-60 group-hover/item:opacity-100 transition-opacity" />
                        <span className="text-[13px] font-medium tracking-tight">Settings</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="rounded-[12px] h-10 px-3 focus:bg-accent cursor-pointer flex items-center justify-between group/item outline-none"
                      onClick={() => navigate("/configuracoes?tab=theme")}
                    >
                      <div className="flex items-center gap-3">
                        <SunMoon className="h-[18px] w-[18px] opacity-60 group-hover/item:opacity-100 transition-opacity" />
                        <span className="text-[13px] font-medium tracking-tight">Theme</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-20" />
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="rounded-[12px] h-10 px-3 focus:bg-accent cursor-pointer outline-none">
                      <Link to="/planos" className="flex items-center gap-3 group/item">
                        <Sparkles className="h-[18px] w-[18px] opacity-60 group-hover/item:opacity-100 transition-opacity" />
                        <span className="text-[13px] font-medium tracking-tight">Fazer Upgrade</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator className="my-1.5 mx-2" />

                  {/* Secondary Links */}
                  <div className="space-y-0.5 px-1">
                    <DropdownMenuItem className="rounded-[12px] h-10 px-3 focus:bg-accent cursor-pointer flex items-center gap-3 group/item outline-none">
                      <Command className="h-[18px] w-[18px] opacity-60 group-hover/item:opacity-100 transition-opacity" />
                      <span className="text-[13px] font-medium tracking-tight">Keyboard shortcuts</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="rounded-[12px] h-10 px-3 focus:bg-accent cursor-pointer flex items-center gap-3 group/item outline-none">
                      <HelpCircle className="h-[18px] w-[18px] opacity-60 group-hover/item:opacity-100 transition-opacity" />
                      <span className="text-[13px] font-medium tracking-tight">Help center</span>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator className="my-1.5 mx-2" />

                  {/* Logout */}
                  <div className="px-1">
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-[12px] h-10 px-3 focus:bg-red-500/10 cursor-pointer flex items-center gap-3 group/logout mb-0.5 text-red-500 focus:text-red-500 outline-none"
                    >
                      <LogOut className="h-[18px] w-[18px] transition-colors" />
                      <span className="text-[13px] font-bold tracking-tight">Log out</span>
                    </DropdownMenuItem>
                    </div>
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
