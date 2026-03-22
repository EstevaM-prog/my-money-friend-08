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
  Sliders
} from "lucide-react";
import { NavLink } from "./NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
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
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Painel", url: "/", icon: LayoutDashboard },
  { title: "Metas", url: "/metas", icon: Target },
  { title: "Contas", url: "/contas", icon: CreditCard },
  { title: "Categorias", url: "/categorias", icon: Tags },
  { title: "Estratégia", url: "/estrategia", icon: Sliders },
  { title: "Relatórios", url: "/relatorios", icon: FileBarChart },
  { title: "Config", url: "/configuracoes", icon: Settings },
  { title: "Suporte", url: "/suporte", icon: LifeBuoy },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-background/50 backdrop-blur-xl transition-[width] duration-300">
      <SidebarHeader className="p-4 group-data-[state=collapsed]:p-2 transition-all">
        <div className="flex items-center gap-3 group">
          <div className="p-2.5 rounded-xl gradient-primary shrink-0 rotate-3 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-primary/20">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[state=collapsed]:hidden animate-in fade-in duration-500">
            <span className="text-lg font-bold tracking-tight leading-none">
              Cash<span className="text-primary font-extrabold italic">Flow</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-0.5">Premium v2.0</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 group-data-[state=collapsed]:px-1 transition-all">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/50 mb-4 transition-opacity group-data-[state=collapsed]:opacity-0">
            Navegação Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {menuItems.map((item) => {
                const isActive = item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} className={cn(
                      "group h-11 rounded-xl px-4 transition-all duration-300",
                      isActive ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "hover:bg-accent/50"
                    )}>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="flex items-center gap-3 w-full"
                        activeClassName="font-bold"
                      >
                        <item.icon className={cn("h-4 w-4 transition-transform duration-500 group-hover:scale-110", isActive && "text-primary")} />
                        <span className="font-medium text-sm group-data-[state=collapsed]:hidden">{item.title}</span>
                        {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-primary animate-pulse group-data-[state=collapsed]:hidden" />}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[state=collapsed]:p-2 transition-all space-y-4">
        {/* Upgrade Card (Small UX Detail) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-primary/10 border border-primary/20 transition-all group-data-[state=collapsed]:hidden overflow-hidden relative">
           <Sparkles className="absolute -right-1 -top-1 h-12 w-12 text-primary/10 rotate-12" />
           <p className="text-xs font-bold mb-1">Dica Premium</p>
           <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">Organize suas contas e economize até 20% ao mês.</p>
           <Dialog>
             <DialogTrigger asChild>
               <Button variant="ghost" size="sm" className="h-7 text-[10px] w-full bg-white dark:bg-black font-bold outline-none">
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
                     CashFlow <span className="text-primary italic">Premium</span>
                   </DialogTitle>
                   <DialogDescription className="text-base">
                     Desbloqueie o potencial máximo das suas finanças com ferramentas exclusivas.
                   </DialogDescription>
                 </DialogHeader>
                 
                 <div className="space-y-4 mb-8 relative z-10">
                   {[
                     "Sincronização bancária automática",
                     "Relatórios avançados e exportação em PDF",
                     "Categorias personalizadas infinitas",
                     "Suporte prioritário 24/7"
                   ].map((feature, i) => (
                     <div key={i} className="flex items-center gap-3">
                       <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                       <span className="text-sm font-medium">{feature}</span>
                     </div>
                   ))}
                 </div>

                 <Button className="w-full h-14 gradient-primary rounded-xl font-bold text-lg hover:scale-105 transition-transform active:scale-95 border-0 text-white">
                   Fazer Upgrade Agora
                 </Button>
               </div>
             </DialogContent>
           </Dialog>
        </div>

        <Button
          onClick={() => navigate("/?new=1")}
          className="w-full h-12 gap-3 gradient-primary border-0 text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group-data-[state=collapsed]:h-10 group-data-[state=collapsed]:p-0 rounded-2xl"
        >
          <Plus className="h-5 w-5 shrink-0" />
          <span className="group-data-[state=collapsed]:hidden">Lançamento</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
