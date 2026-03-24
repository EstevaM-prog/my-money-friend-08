import {
  LayoutDashboard,
  Target,
  CreditCard,
  FileBarChart,
  Settings,
  Wallet,
  Plus,
  LifeBuoy,
  Sparkles,
  CheckCircle2,
  Tags,
  Sliders,
} from "lucide-react";
import { NavLink } from "./NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

const menuItems = [
  { title: "Painel", url: "/", icon: LayoutDashboard },
  { title: "Metas", url: "/metas", icon: Target },
  { title: "Contas", url: "/contas", icon: CreditCard },
  { title: "Categorias", url: "/categorias", icon: Tags },
  { title: "Estratégia", url: "/estrategia", icon: Sliders },
  { title: "Relatórios", url: "/relatorios", icon: FileBarChart },
  { title: "Suporte", url: "/suporte", icon: LifeBuoy },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const { theme } = useTheme();
  const isCollapsed = state === "collapsed";
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 transition-[width,background-color] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #111114 0%, #0e0e11 100%)"
          : "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
        borderRight: isDark ? "none" : "1px solid #e5e7eb"
      }}
    >
      {/* ── HEADER ── */}
      <SidebarHeader className="px-5 pt-6 pb-5 group-data-[state=collapsed]:px-3 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
        <div className="flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-3 shrink-0">
            {/* Logo mark */}
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-transform duration-500"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                boxShadow: isDark ? "0 0 16px rgba(16,185,129,0.35)" : "0 4px 12px rgba(16,185,129,0.2)",
              }}
            >
              <Wallet className="h-4 w-4 text-white" />
            </div>

            {/* Name */}
            {!isCollapsed && (
              <span
                className={cn(
                  "text-[17px] font-bold tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500",
                  isDark ? "text-white" : "text-slate-900"
                )}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Cash<span className="text-emerald-500 italic">Flow</span>
              </span>
            )}
          </div>

          {/* Minimize button inside sidebar */}
          {!isCollapsed && (
            <SidebarTrigger className={cn(
              "h-8 w-8 transition-all duration-500 rounded-lg shrink-0 opacity-100 scale-100",
              isDark ? "text-white/40 hover:text-white hover:bg-white/10" : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            )} />
          )}
        </div>
        {isCollapsed && (
          <div className="flex justify-center mt-2 animate-in fade-in zoom-in duration-500">
            <SidebarTrigger className={cn(
              "h-8 w-8 transition-all duration-500 rounded-lg",
              isDark ? "text-white/40 hover:text-white hover:bg-white/10" : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            )} />
          </div>
        )}
      </SidebarHeader>

      {/* ── NAV ── */}
      <SidebarContent className="px-3 group-data-[state=collapsed]:px-1.5 transition-all duration-500 pt-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => {
                const isActive =
                  item.url === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "relative h-11 rounded-xl px-4 transition-all duration-500 group/item border-0 outline-none ring-0 overflow-hidden",
                        isActive
                          ? (isDark ? "text-white" : "text-emerald-600")
                          : (isDark ? "text-white/50 hover:text-white/80 hover:bg-white/[0.05]" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100")
                      )}
                      style={
                        isActive
                          ? {
                            background: isDark
                              ? "linear-gradient(90deg, rgba(255,255,255,0.07) 0%, rgba(139,92,246,0.18) 85%, rgba(168,85,247,0.55) 100%)"
                              : "linear-gradient(90deg, rgba(16,185,129,0.05) 0%, rgba(16,185,129,0.1) 85%, rgba(16,185,129,0.2) 100%)",
                            borderRight: isDark
                              ? "3px solid rgba(168,85,247,0.9)"
                              : "3px solid #10b981",
                          }
                          : undefined
                      }
                    >
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="flex items-center gap-3.5 w-full whitespace-nowrap"
                      >
                        <item.icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0 transition-transform duration-500 group-hover/item:scale-110",
                            isActive
                              ? (isDark ? "text-white" : "text-emerald-600")
                              : (isDark ? "text-white/45 group-hover/item:text-white/75" : "text-slate-400 group-hover/item:text-slate-600")
                          )}
                          strokeWidth={isActive ? 2.2 : 1.8}
                        />
                        <span
                          className={cn(
                            "font-medium text-sm transition-all duration-500 group-data-[state=collapsed]:opacity-0 group-data-[state=collapsed]:translate-x-4",
                            isActive
                              ? (isDark ? "text-white" : "text-emerald-700")
                              : (isDark ? "text-white/55" : "text-slate-600")
                          )}
                        >
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── FOOTER ── */}
      <SidebarFooter className="p-4 group-data-[state=collapsed]:p-2 transition-all duration-500 space-y-3 overflow-hidden">
        {/* Upgrade hint card */}
        <div
          className={cn(
            "p-4 rounded-2xl relative overflow-hidden transition-all duration-500",
            isCollapsed ? "opacity-0 translate-y-4 pointer-events-none h-0 p-0" : "opacity-100 translate-y-0 h-auto"
          )}
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(16,185,129,0.08) 100%)"
              : "linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(59,130,246,0.05) 100%)",
            border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(16,185,129,0.1)",
          }}
        >
          <Sparkles className={cn(
            "absolute -right-1 -top-1 h-12 w-12 rotate-12 transition-transform duration-700",
            isDark ? "text-violet-400/10" : "text-emerald-400/10"
          )} />
          <p className={cn("text-[11px] font-bold mb-1", isDark ? "text-white/80" : "text-slate-900")}>
            Dica Premium
          </p>
          <p className={cn("text-[10px] mb-3 leading-relaxed", isDark ? "text-white/40" : "text-slate-500")}>
            Organize suas contas e economize até 20% ao mês.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 text-[10px] w-full font-bold outline-none",
                  isDark ? "text-white/70 bg-white/06 border-white/10" : "text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200"
                )}
                style={{
                  border: "1px solid transparent",
                  ...(isDark ? { background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" } : {})
                }}
              >
                Saiba Mais
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none bg-transparent shadow-2xl">
              <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[80px]" />
                <DialogHeader className="space-y-3 mb-6 relative z-10">
                  <div className="p-3 w-fit rounded-2xl gradient-primary rotate-3">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <DialogTitle className="text-2xl font-black tracking-tight">
                    CashFlow{" "}
                    <span className="text-primary italic">Premium</span>
                  </DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    Desbloqueie o potencial máximo das suas finanças com
                    ferramentas exclusivas.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mb-8 relative z-10 text-foreground">
                  {[
                    "Sincronização bancária automática",
                    "Relatórios avançados e exportação em PDF",
                    "Categorias personalizadas infinitas",
                    "Suporte prioritário 24/7",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  asChild
                  className="w-full h-14 gradient-primary rounded-xl font-bold text-lg hover:scale-105 transition-transform active:scale-95 border-0 text-white"
                >
                  <Link to="/planos">Fazer Upgrade Agora</Link>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => navigate("/?new=1")}
          className="w-full h-11 gap-3 border-0 text-white font-semibold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 rounded-xl text-sm"
          style={{
            background:
              "linear-gradient(90deg, #10b981 0%, #059669 100%)",
            boxShadow: isDark ? "0 4px 20px rgba(16,185,129,0.25)" : "0 4px 15px rgba(16,185,129,0.3)",
          }}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!isCollapsed && (
            <span className="animate-in fade-in slide-in-from-left-2 duration-500">
              Novo Lançamento
            </span>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
