import { Link } from "react-router-dom";
import { Wallet, TrendingUp, ShieldCheck, BarChart3, Target, Zap, ArrowRight, CheckCircle2, Star, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BarChart3,
    title: "Gráficos em Tempo Real",
    description: "Visualize suas receitas e despesas com dashboards interativos e análises detalhadas.",
  },
  {
    icon: Target,
    title: "Metas Inteligentes",
    description: "Defina seus sonhos e deixe que o CashFlow mostre o caminho exato para alcançá-los.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança Bancária",
    description: "Seus dados são criptografados localmente. O controle e a privacidade são 100% seus.",
  },
  {
    icon: Zap,
    title: "Lançamentos Rápidos",
    description: "Interface otimizada para você registrar transações em menos de 5 segundos.",
  },
];

const stats = [
  { label: "Usuários Ativos", val: "50k+" },
  { label: "Economia Gerada", val: "R$ 10M+" },
  { label: "Avaliação App", val: "4.9/5" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      
      {/* Glow Backdrops */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Modern Glass Nav */}
      <header className="sticky top-0 z-50 glass border-b border-border/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-xl gradient-primary shadow-lg shadow-emerald-500/20 rotate-3 group-hover:rotate-12 transition-transform duration-500">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Cash<span className="text-primary italic font-extrabold">Flow</span>
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/login" className="text-sm font-semibold hover:text-primary transition-colors hidden sm:block">Login</Link>
            <Button asChild className="gradient-primary border-0 text-primary-foreground font-bold rounded-2xl px-6 hover:scale-105 active:scale-95 transition-all">
              <Link to="/cadastro">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Futuristic Hero Section */}
        <section className="pt-24 pb-16 px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-10 card-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-emerald-500/5 text-primary text-xs font-bold uppercase tracking-widest border-primary/20 animate-pulse">
              <Star className="h-3 w-3" />
              Gestão Financeira de Próxima Geração
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] perspective">
              Domine seu <span className="gradient-text">Dinheiro</span> <br />
              mude sua <span className="italic">Vida.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              O gerenciador financeiro elegante que combina beleza e inteligência para ajudar você a conquistar a <span className="text-foreground font-semibold">liberdade financeira</span> sem esforço.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild className="h-16 gradient-primary border-0 text-primary-foreground font-bold px-10 rounded-2xl gap-3 shadow-2xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all text-lg">
                <Link to="/cadastro">
                  Criar minha conta <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="h-16 text-lg font-bold hover:bg-muted/50 rounded-2xl px-8 underline-offset-4 hover:underline">
                 Ver demonstração
              </Button>
            </div>

            {/* Product Mockup/Image */}
            <div className="mt-20 relative group px-4">
               <div className="absolute inset-0 bg-primary/20 blur-[100px] opacity-20 -z-10 group-hover:opacity-40 transition-opacity" />
               <img 
                 src="/financial_dashboard_mockup_1774182010754.png" 
                 alt="CashFlow Dashboard" 
                 className="rounded-[2rem] shadow-2xl border border-white/10 glass max-w-5xl mx-auto hover:scale-[1.02] transition-transform duration-700 hover:rotate-1"
               />
               <div className="absolute -bottom-10 -left-1 sm:left-20 glass p-5 rounded-3xl shadow-xl flex items-center gap-4 hidden sm:flex animate-bounce-slow">
                  <div className="p-3 bg-emerald-500 rounded-2xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground font-bold uppercase">Patrimônio</p>
                    <p className="text-xl font-black text-emerald-600">+ R$ 12.450,00</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="py-20 border-y border-border/10 bg-muted/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-24 uppercase tracking-widest text-center">
            {stats.map(s => (
              <div key={s.label} className="space-y-1">
                <p className="text-4xl sm:text-5xl font-black gradient-text">{s.val}</p>
                <p className="text-[10px] sm:text-xs font-bold text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-4">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight">Experiência <span className="text-primary italic">Premium</span></h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">Desenvolvido com foco na melhor UX do mercado financeiro.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((f, i) => (
                <div key={f.title} className="glass p-8 rounded-[2.5rem] space-y-6 hover:bg-white/90 dark:hover:bg-black/90 transition-all duration-500 group border-border/10 hover:-translate-y-2">
                  <div className="p-4 rounded-2xl gradient-primary w-fit shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
                    <f.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-xl">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[3rem] gradient-primary p-12 sm:p-24 text-center text-primary-foreground card-reveal">
            <Coins className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] text-white/5 -rotate-12" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter">O controle que você <br /> merece está a um clique.</h2>
              <p className="text-lg opacity-90 max-w-lg mx-auto">Lançamentos agora levam menos de 5 segundos. Comece hoje a construir seu futuro rico.</p>
              <Button size="lg" asChild className="h-16 bg-white text-primary hover:bg-slate-100 font-black px-12 rounded-2xl text-lg shadow-2xl">
                <Link to="/cadastro">Criar minha conta grátis</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/10 py-12 px-6 bg-muted/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-primary">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">CashFlow</span>
          </div>
          <div className="flex items-center gap-8 font-bold text-xs uppercase tracking-widest">
            <Link to="/suporte" className="hover:text-primary transition-colors">Suporte</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Entrar</Link>
            <Link to="/cadastro" className="hover:text-primary transition-colors text-primary">Criar Conta</Link>
          </div>
          <span>© {new Date().getFullYear()} CashFlow Premium. Feito com paixão.</span>
        </div>
      </footer>
    </div>
  );
}
