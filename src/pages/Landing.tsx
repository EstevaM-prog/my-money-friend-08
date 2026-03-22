import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  Target,
  Zap,
  ArrowRight,
  Star,
  Coins,
  PiggyBank,
  LineChart,
  Bell,
  Lock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BarChart3,
    title: "Dashboards em Tempo Real",
    description:
      "Visualize receitas e despesas com gráficos interativos, detalhados e sempre atualizados.",
    color: "from-emerald-500 to-teal-400",
    glow: "shadow-emerald-500/25",
  },
  {
    icon: Target,
    title: "Metas Inteligentes",
    description:
      "Defina objetivos e deixe o CashFlow traçar o caminho exato para você alcançá-los.",
    color: "from-blue-500 to-indigo-400",
    glow: "shadow-blue-500/25",
  },
  {
    icon: ShieldCheck,
    title: "Privacidade Total",
    description:
      "Dados criptografados localmente. O controle é 100% seu, sem servidores externos.",
    color: "from-violet-500 to-purple-400",
    glow: "shadow-violet-500/25",
  },
  {
    icon: Zap,
    title: "Lançamentos Rápidos",
    description:
      "Interface otimizada para registrar transações em menos de 5 segundos.",
    color: "from-amber-500 to-orange-400",
    glow: "shadow-amber-500/25",
  },
];

const benefits = [
  { icon: PiggyBank, text: "Controle total do seu patrimônio" },
  { icon: LineChart, text: "Relatórios e análises avançadas" },
  { icon: Bell, text: "Alertas e metas personalizadas" },
  { icon: Lock, text: "Zero exposição de dados pessoais" },
];

const stats = [
  { label: "Usuários Ativos", val: "13+", sub: "e crescendo" },
  { label: "Economia Gerada", val: "R$ 3k", sub: "pelos nossos usuários" },
  { label: "Avaliação Média", val: "4.7★", sub: "nas lojas de apps" },
];

const testimonials = [
  {
    name: "Ana Paula",
    role: "Empreendedora",
    text: "Em 3 meses economizei R$ 4.200 só acompanhando meu padrão de gastos. Incrível!",
    avatar: "AP",
    color: "from-emerald-400 to-teal-500",
  },
  {
    name: "Carlos M.",
    role: "Desenvolvedor",
    text: "A interface é sensacional. Consigo lançar tudo em segundos e ver onde meu dinheiro vai.",
    avatar: "CM",
    color: "from-blue-400 to-indigo-500",
  },
  {
    name: "Beatriz L.",
    role: "Designer",
    text: "Finalmente um app financeiro bonito e funcional. Não consigo imaginar minha vida sem ele.",
    avatar: "BL",
    color: "from-violet-400 to-purple-500",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">

      {/* ─── Ambient Glows ─── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/6 blur-[140px]" />
        <div className="absolute top-[30%] right-[-15%] w-[50%] h-[50%] rounded-full bg-blue-500/6 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-violet-500/5 blur-[120px]" />
      </div>

      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2.5 rounded-xl gradient-primary shadow-lg shadow-emerald-500/30 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">
              Cash<span className="text-primary italic">Flow</span>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Recursos</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Números</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Depoimentos</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-muted/60 transition-all text-foreground/80 hover:text-foreground"
            >
              Entrar
            </Link>
            <Button
              asChild
              className="gradient-primary border-0 text-white font-bold rounded-xl px-6 py-2.5 shadow-lg shadow-emerald-500/20 hover:scale-105 hover:shadow-emerald-500/30 active:scale-95 transition-all gap-2"
            >
              <Link to="/cadastro">
                Começar Grátis <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ─── Hero ─── */}
        <section className="relative pt-28 pb-20 px-6 text-center overflow-hidden">
          {/* Grid decoration */}
          <div
            className="absolute inset-0 -z-10 opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(160 84% 39%) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39%) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="max-w-4xl mx-auto space-y-8 card-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              Gestão Financeira de Próxima Geração
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl md:text-[5.5rem] font-black tracking-tighter leading-[0.9]">
              Domine seu{" "}
              <span className="gradient-text">Dinheiro</span>
              <br />
              mude sua{" "}
              <span className="italic text-foreground/70">Vida.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              O gerenciador financeiro elegante que combina beleza e inteligência
              para ajudar você a conquistar a{" "}
              <span className="text-foreground font-semibold">liberdade financeira</span>{" "}
              sem esforço.
            </p>

            {/* Benefit Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {benefits.map((b) => (
                <div
                  key={b.text}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/40 text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
                >
                  <b.icon className="h-3.5 w-3.5 text-primary" />
                  {b.text}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                asChild
                className="h-14 gradient-primary border-0 text-white font-bold px-10 rounded-2xl gap-3 shadow-2xl shadow-emerald-500/25 hover:scale-105 hover:shadow-emerald-500/40 active:scale-95 transition-all text-base"
              >
                <Link to="/cadastro">
                  Criar minha conta grátis <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                asChild
                className="h-14 text-base font-bold hover:bg-muted/60 rounded-2xl px-8 border border-border/40 hover:border-primary/30"
              >
                <Link to="/login">Já tenho conta</Link>
              </Button>
            </div>

            {/* Social Proof Mini */}
            <div className="flex items-center justify-center gap-3 pt-2 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["EP", "MR", "JS", "AL"].map((init, i) => (
                  <div
                    key={init}
                    className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-[10px] font-bold border-2 border-background"
                    style={{ opacity: 1 - i * 0.1 }}
                  >
                    {init}
                  </div>
                ))}
              </div>
              <span>
                <span className="font-semibold text-foreground">10+</span> pessoas já controlam suas finanças
              </span>
            </div>
          </div>

          {/* ─── Dashboard Mockup ─── */}
          <div className="mt-20 relative group px-4 max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/15 via-blue-500/10 to-violet-500/15 blur-[80px] opacity-60 -z-10 group-hover:opacity-90 transition-opacity duration-700" />

            {/* Floating card */}
            <div className="absolute -top-6 -right-2 sm:right-8 glass p-4 rounded-2xl shadow-xl flex items-center gap-3 z-10 animate-bounce-slow hidden sm:flex">
              <div className="p-2.5 bg-blue-500 rounded-xl">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Saldo Atual</p>
                <p className="text-lg font-black text-blue-500">R$ 28.750</p>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-2 sm:left-10 glass p-4 rounded-2xl shadow-xl flex items-center gap-3 z-10 hidden sm:flex">
              <div className="p-2.5 bg-emerald-500 rounded-xl">
                <Star className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Meta do mês</p>
                <p className="text-lg font-black text-emerald-600">85% atingida</p>
              </div>
            </div>

            <img
              src="/financial_dashboard_mockup_1774182010754.png"
              alt="CashFlow Dashboard — Painel de controle financeiro"
              className="rounded-[2rem] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.25)] border border-white/10 glass w-full hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        </section>

        {/* ─── Stats ─── */}
        <section id="stats" className="py-24 border-y border-border/10 bg-muted/20 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/20 text-center">
            {stats.map((s) => (
              <div key={s.label} className="py-10 md:py-0 space-y-2 px-8">
                <p className="text-4xl sm:text-5xl font-black gradient-text">{s.val}</p>
                <p className="text-sm font-bold text-foreground uppercase tracking-widest">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Features ─── */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
                <Sparkles className="h-3 w-3" /> Recursos
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                Experiência <span className="text-primary italic">Premium</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Desenvolvido com foco na melhor UX do mercado financeiro.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="glass p-7 rounded-[2rem] space-y-5 hover:bg-white/90 dark:hover:bg-slate-900/90 transition-all duration-500 group border-transparent hover:border-white/20 hover:-translate-y-3 cursor-default"
                >
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${f.color} w-fit shadow-lg ${f.glow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                  >
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg leading-tight">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <section id="testimonials" className="py-24 px-6 bg-muted/20">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
                <Star className="h-3 w-3" /> Depoimentos
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                Quem usa,{" "}
                <span className="text-primary italic">ama</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="glass p-8 rounded-[2rem] space-y-5 hover:-translate-y-2 transition-all duration-500 group"
                >
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-1">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[3rem] gradient-primary p-14 sm:p-24 text-center text-white">
            {/* Decorations */}
            <Coins className="absolute -top-8 -left-8 w-48 h-48 text-white/5 -rotate-12 pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="absolute top-10 right-20 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-widest">
                <Sparkles className="h-3 w-3" /> Gratuito para sempre
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-tight">
                O controle que você <br /> merece está a um clique.
              </h2>
              <p className="text-lg opacity-85 max-w-lg mx-auto leading-relaxed">
                Lançamentos agora levam menos de 5 segundos. Comece hoje a construir seu futuro rico.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  asChild
                  className="h-14 bg-white text-primary hover:bg-slate-50 font-black px-12 rounded-2xl text-base shadow-2xl hover:scale-105 active:scale-95 transition-all gap-2"
                >
                  <Link to="/cadastro">
                    Criar minha conta grátis <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  asChild
                  className="h-14 text-base font-bold text-white hover:bg-white/15 rounded-2xl px-8 border border-white/30"
                >
                  <Link to="/login">Já tenho conta</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/10 py-14 px-6 bg-muted/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl gradient-primary shadow-md">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="font-black text-foreground">CashFlow</span>
                <p className="text-xs text-muted-foreground">Gestão Financeira Premium</p>
              </div>
            </div>

            {/* Links */}
            <nav className="flex items-center gap-8 font-bold text-xs uppercase tracking-widest text-muted-foreground">
              <a href="#features" className="hover:text-primary transition-colors">Recursos</a>
              <Link to="/suporte" className="hover:text-primary transition-colors">Suporte</Link>
              <Link to="/login" className="hover:text-primary transition-colors">Entrar</Link>
              <Link to="/cadastro" className="text-primary hover:text-primary/80 transition-colors">
                Criar Conta
              </Link>
            </nav>

            {/* Copyright */}
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} CashFlow — Feito com ❤️
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
