import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Wallet,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  Target,
  Zap,
  ArrowRight,
  Star,
  PiggyBank,
  LineChart,
  Bell,
  Lock,
  ChevronRight,
  Sparkles,
  Activity,
  Cpu,
  Layers,
  CheckCircle2,
  ChevronDown,
  Plus,
  Minus,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── Data ─── */

const features = [
  {
    icon: Cpu,
    title: "IA Financeira",
    description:
      "Nossa IA analisa seus padrões de consumo e sugere economias personalizadas todos os dias.",
    gradient: "from-purple-500/20 to-violet-600/5",
    iconColor: "text-purple-400",
    borderHover: "group-hover:border-purple-500/30",
  },
  {
    icon: Activity,
    title: "Insights em Tempo Real",
    description:
      "Visualize o fluxo de caixa com precisão absoluta, antecipando gargalos e oportunidades.",
    gradient: "from-blue-500/20 to-cyan-600/5",
    iconColor: "text-blue-400",
    borderHover: "group-hover:border-blue-500/30",
  },
  {
    icon: ShieldCheck,
    title: "Privacidade Híbrida",
    description:
      "Seus dados sensíveis permanecem sob sua custódia total, criptografados ponta a ponta.",
    gradient: "from-emerald-500/20 to-teal-600/5",
    iconColor: "text-emerald-400",
    borderHover: "group-hover:border-emerald-500/30",
  },
  {
    icon: Zap,
    title: "Automação Inteligente",
    description:
      "Crie regras de categorização e metas automáticas que trabalham por você 24/7.",
    gradient: "from-amber-500/20 to-orange-600/5",
    iconColor: "text-amber-400",
    borderHover: "group-hover:border-amber-500/30",
  },
  {
    icon: BarChart3,
    title: "Visualização de Dados",
    description:
      "Gráficos e relatórios interativos que transformam números complexos em decisões claras.",
    gradient: "from-rose-500/20 to-pink-600/5",
    iconColor: "text-rose-400",
    borderHover: "group-hover:border-rose-500/30",
  },
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Crie sua Conta",
    description:
      "Cadastre-se gratuitamente em segundos e configure seu perfil financeiro personalizado.",
    icon: Sparkles,
  },
  {
    step: "02",
    title: "Conecte suas Finanças",
    description:
      "Adicione suas contas, categorias e metas. Nossa IA começa a trabalhar imediatamente.",
    icon: Layers,
  },
  {
    step: "03",
    title: "Acompanhe o Progresso",
    description:
      "Monitore seus gastos, receitas e metas em tempo real com insights poderosos.",
    icon: TrendingUp,
  },
];

const testimonials = [
  {
    name: "Lucas M.",
    role: "Empreendedor",
    text: "O CashFlow transformou a forma como eu gerencio meu negócio. Os insights de IA são incríveis.",
    avatar: "LM",
    rating: 5,
  },
  {
    name: "Ana S.",
    role: "Product Manager",
    text: "A interface é simplesmente linda e os relatórios me poupam horas de trabalho toda semana.",
    avatar: "AS",
    rating: 5,
  },
  {
    name: "Diego P.",
    role: "UX Designer",
    text: "Finalmente uma ferramenta financeira que parece ter sido feita no futuro. Recomendo fortemente.",
    avatar: "DP",
    rating: 5,
  },
];

const faqItems = [
  {
    question: "Quanto tempo leva para configurar?",
    answer:
      "Menos de 2 minutos! Basta criar sua conta, adicionar suas contas financeiras e nossa IA faz o resto. Sem configurações complexas.",
  },
  {
    question: "O CashFlow é realmente gratuito?",
    answer:
      "Sim! Oferecemos um plano gratuito com todos os recursos essenciais. Planos premium desbloqueiam funcionalidades avançadas de IA e relatórios.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Absolutamente. Usamos criptografia AES-256-GCM de ponta a ponta, autenticação JWT com dois fatores e seus dados sensíveis nunca saem do seu dispositivo.",
  },
  {
    question: "Posso integrar com minhas ferramentas?",
    answer:
      "Sim, o CashFlow se integra com diversas ferramentas e estamos constantemente adicionando novas integrações baseadas no feedback dos usuários.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer:
      "Claro! Sem contratos ou compromissos. Você pode cancelar seu plano premium a qualquer momento e continuar usando o plano gratuito.",
  },
];

const partners = ["LOGOIPSUM", "TRACLE", "LGPSM", "PHYLUM", "QUANTIX"];

/* ─── Animated Counter Hook ─── */
function useCountUp(end: number, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [hasStarted, end, start, duration]);

  return { count, ref };
}

/* ─── Intersection Observer Hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ─── FAQ Item Component ─── */
function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof faqItems)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "border rounded-2xl transition-all duration-500 overflow-hidden",
        isOpen
          ? "border-purple-500/30 bg-purple-500/5"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left group"
      >
        <span className="text-[15px] sm:text-base font-semibold text-white/90 pr-4">
          {item.question}
        </span>
        <div
          className={cn(
            "shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300",
            isOpen
              ? "bg-purple-500/20 text-purple-400 rotate-0"
              : "bg-white/5 text-white/40 group-hover:bg-white/10"
          )}
        >
          {isOpen ? (
            <Minus className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </div>
      </button>
      <div
        className={cn(
          "grid transition-all duration-500",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-[14px] sm:text-[15px] text-white/40 leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Landing Page ─── */
export default function Landing() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const heroRef = useInView(0.1);
  const featuresRef = useInView(0.1);
  const howItWorksRef = useInView(0.1);
  const testimonialsRef = useInView(0.1);
  const faqRef = useInView(0.1);
  const ctaRef = useInView(0.1);

  const usersCount = useCountUp(10000, 2500);
  const transCount = useCountUp(2, 2500);
  const countriesCount = useCountUp(50, 2000);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col selection:bg-purple-500/30 font-sans overflow-x-hidden">
      {/* ─── Ambient Glows ─── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[60%] h-[60%] rounded-full bg-purple-600/[0.07] blur-[180px] animate-pulse" />
        <div className="absolute top-[40%] right-[-20%] w-[50%] h-[50%] rounded-full bg-blue-600/[0.05] blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[40%] rounded-full bg-indigo-600/[0.06] blur-[140px]" />
      </div>

      {/* ─── Navbar ─── */}
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500",
          scrolled
            ? "bg-black/60 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/20"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span
              className="text-xl font-black tracking-tighter"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Cash<span className="text-purple-400 italic">Flow</span>
            </span>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.03]">
              {[
                { label: "Features", href: "#features" },
                { label: "Como Funciona", href: "#how-it-works" },
                { label: "Depoimentos", href: "#testimonials" },
                { label: "FAQ", href: "#faq" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-full text-[13px] font-semibold text-white/50 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Action */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:block text-[13px] font-semibold text-white/50 hover:text-white transition-colors px-4 py-2"
            >
              Entrar
            </Link>
            <Link to="/cadastro">
              <Button className="rounded-full px-6 h-10 bg-purple-600 hover:bg-purple-500 text-white font-semibold border-0 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all active:scale-95 text-[13px] gap-2">
                Começar Grátis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/[0.06] text-white/60 hover:text-white transition-all"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden transition-all duration-500 overflow-hidden",
            mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-6 pb-6 pt-2 space-y-1 border-t border-white/[0.06] bg-black/80 backdrop-blur-2xl">
            {[
              { label: "Features", href: "#features" },
              { label: "Como Funciona", href: "#how-it-works" },
              { label: "Depoimentos", href: "#testimonials" },
              { label: "FAQ", href: "#faq" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-[14px] font-semibold text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/login"
              className="block px-4 py-3 rounded-xl text-[14px] font-semibold text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ─── Hero Section ─── */}
        <section
          ref={heroRef.ref}
          className="relative pt-36 sm:pt-44 pb-20 sm:pb-32 px-4 sm:px-6 flex flex-col items-center text-center overflow-hidden"
        >
          {/* Top radial glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-purple-600/[0.12] blur-[200px] pointer-events-none" />

          <div
            className={cn(
              "max-w-5xl mx-auto space-y-8 relative z-10 transition-all duration-1000",
              heroRef.inView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
          >
            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-purple-500/20 bg-purple-500/[0.08] backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
                  Otimize Suas Finanças
                </span>
              </div>
            </div>

            {/* Tagline */}
            <h1
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.92] text-white"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Controle Financeiro com{" "}
              <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400">
                Automação e IA.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed font-medium">
              Uma plataforma inovadora que simplifica suas tarefas financeiras e
              ajuda seu negócio a crescer com confiança. Potencializado por IA
              para estabilidade inteligente.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link to="/cadastro">
                <Button
                  size="lg"
                  className="h-14 rounded-full px-10 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[15px] shadow-2xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all hover:scale-[1.03] active:scale-95 border-0 gap-3"
                >
                  Começar Agora Grátis
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-14 rounded-full px-10 border border-white/10 bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/20 font-bold text-[15px] gap-3 transition-all"
                >
                  Explorar Features
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </a>
            </div>

            {/* Dashboard Showcase */}
            <div className="mt-16 sm:mt-24 relative group">
              {/* Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-violet-600/10 to-blue-600/20 blur-[80px] -z-10 rounded-[3rem] opacity-40 group-hover:opacity-70 transition-opacity duration-1000" />

              {/* Floating elements */}
              <div className="absolute -top-6 -right-3 sm:-right-6 z-20 p-4 rounded-2xl bg-[#0c0c10]/90 border border-white/[0.08] backdrop-blur-xl shadow-2xl animate-bounce-slow hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/40 font-medium">
                      Receitas
                    </p>
                    <p className="text-sm font-bold text-emerald-400">
                      +12.8%
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-2 sm:-left-6 z-20 p-4 rounded-2xl bg-[#0c0c10]/90 border border-white/[0.08] backdrop-blur-xl shadow-2xl hidden sm:block" style={{ animation: "bounce-slow 3s ease-in-out 1s infinite" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/40 font-medium">
                      Meta atingida!
                    </p>
                    <p className="text-sm font-bold text-purple-400">
                      Viagem 2026
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/[0.08] p-1.5 sm:p-2 bg-white/[0.03] backdrop-blur-3xl shadow-2xl overflow-hidden group-hover:border-purple-500/20 transition-all duration-700">
                <img
                  src="/dashboard_showcase.png"
                  alt="CashFlow Dashboard Showcase"
                  className="w-full rounded-[1.2rem] sm:rounded-[2rem] opacity-90 group-hover:opacity-100 transition-opacity duration-500 border border-white/[0.04]"
                />
                {/* Glass overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303]/60 via-transparent to-transparent pointer-events-none rounded-[2.5rem]" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Stats Bar ─── */}
        <section className="py-12 sm:py-16 border-y border-white/[0.04] bg-white/[0.01]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              <div
                ref={usersCount.ref}
                className="text-center space-y-1 sm:space-y-2"
              >
                <p
                  className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {usersCount.count.toLocaleString()}+
                </p>
                <p className="text-[11px] sm:text-xs text-white/30 font-semibold uppercase tracking-widest">
                  Usuários Ativos
                </p>
              </div>
              <div
                ref={transCount.ref}
                className="text-center space-y-1 sm:space-y-2"
              >
                <p
                  className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {transCount.count}M+
                </p>
                <p className="text-[11px] sm:text-xs text-white/30 font-semibold uppercase tracking-widest">
                  Transações
                </p>
              </div>
              <div
                ref={countriesCount.ref}
                className="text-center space-y-1 sm:space-y-2"
              >
                <p
                  className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {countriesCount.count}+
                </p>
                <p className="text-[11px] sm:text-xs text-white/30 font-semibold uppercase tracking-widest">
                  Países
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Partners ─── */}
        <section className="py-12 sm:py-16 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.3em] text-white/20 mb-10">
              Trusted by 10,000+ Teams Worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-8 sm:gap-14 items-center opacity-25 hover:opacity-40 transition-opacity duration-700">
              {partners.map((p, i) => (
                <span
                  key={i}
                  className="text-lg sm:text-xl font-black italic tracking-widest text-white"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section
          id="features"
          ref={featuresRef.ref}
          className="py-24 sm:py-40 px-4 sm:px-6 relative overflow-hidden"
        >
          <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/[0.04] blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto">
            <div
              className={cn(
                "flex flex-col items-center text-center space-y-6 mb-16 sm:mb-24 transition-all duration-700",
                featuresRef.inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
            >
              <div className="px-5 py-2 rounded-full border border-purple-500/20 bg-purple-500/[0.06] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-purple-400">
                Features
              </div>
              <h2
                className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Acelere seu controle com{" "}
                <br className="hidden sm:block" />
                <span className="text-purple-400 italic">
                  processos inteligentes.
                </span>
              </h2>
              <p className="text-base sm:text-lg text-white/35 max-w-2xl mx-auto leading-relaxed">
                Todas as ferramentas que você precisa para otimizar operações,
                aumentar produtividade e crescer com confiança.
              </p>
            </div>

            {/* Feature Cards: 3 on top, 2 on bottom centered */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {features.slice(0, 3).map((f, i) => (
                <div
                  key={i}
                  className={cn(
                    "group relative rounded-[1.8rem] border border-white/[0.06] bg-[#09090c] p-8 sm:p-10 space-y-6 overflow-hidden transition-all duration-700 hover:scale-[1.02]",
                    f.borderHover,
                    featuresRef.inView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  )}
                  style={{
                    transitionDelay: featuresRef.inView ? `${i * 100}ms` : "0ms",
                  }}
                >
                  {/* Background gradient */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                      f.gradient
                    )}
                  />

                  <div className="relative z-10">
                    <div
                      className={cn(
                        "inline-flex p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] transition-all duration-500 group-hover:scale-110 group-hover:bg-white/[0.08]"
                      )}
                    >
                      <f.icon className={cn("h-7 w-7", f.iconColor)} />
                    </div>
                  </div>

                  <div className="relative z-10 space-y-3">
                    <h3 className="text-xl font-bold tracking-tight text-white">
                      {f.title}
                    </h3>
                    <p className="text-[14px] sm:text-[15px] text-white/35 leading-relaxed font-medium">
                      {f.description}
                    </p>
                  </div>

                  {/* Decorative corner glow */}
                  <div className="absolute right-[-30px] bottom-[-30px] w-40 h-40 rounded-full bg-purple-500/[0.03] blur-3xl group-hover:bg-purple-500/[0.08] transition-all duration-700" />
                </div>
              ))}
            </div>

            {/* Bottom 2 cards centered */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mt-5 sm:mt-6 max-w-2xl lg:max-w-[66.666%] mx-auto">
              {features.slice(3).map((f, i) => (
                <div
                  key={i + 3}
                  className={cn(
                    "group relative rounded-[1.8rem] border border-white/[0.06] bg-[#09090c] p-8 sm:p-10 space-y-6 overflow-hidden transition-all duration-700 hover:scale-[1.02]",
                    f.borderHover,
                    featuresRef.inView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  )}
                  style={{
                    transitionDelay: featuresRef.inView
                      ? `${(i + 3) * 100}ms`
                      : "0ms",
                  }}
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                      f.gradient
                    )}
                  />

                  <div className="relative z-10">
                    <div className="inline-flex p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] transition-all duration-500 group-hover:scale-110 group-hover:bg-white/[0.08]">
                      <f.icon className={cn("h-7 w-7", f.iconColor)} />
                    </div>
                  </div>

                  <div className="relative z-10 space-y-3">
                    <h3 className="text-xl font-bold tracking-tight text-white">
                      {f.title}
                    </h3>
                    <p className="text-[14px] sm:text-[15px] text-white/35 leading-relaxed font-medium">
                      {f.description}
                    </p>
                  </div>

                  <div className="absolute right-[-30px] bottom-[-30px] w-40 h-40 rounded-full bg-purple-500/[0.03] blur-3xl group-hover:bg-purple-500/[0.08] transition-all duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section
          id="how-it-works"
          ref={howItWorksRef.ref}
          className="py-24 sm:py-40 px-4 sm:px-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/[0.04] blur-[120px] pointer-events-none" />

          <div className="max-w-6xl mx-auto">
            <div
              className={cn(
                "flex flex-col items-center text-center space-y-6 mb-16 sm:mb-24 transition-all duration-700",
                howItWorksRef.inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
            >
              <div className="px-5 py-2 rounded-full border border-blue-500/20 bg-blue-500/[0.06] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-blue-400">
                Como Funciona
              </div>
              <h2
                className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Configure Rápido,{" "}
                <br className="hidden sm:block" />
                <span className="text-blue-400 italic">
                  Comece a Usar Agora.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
              {/* Connection line (desktop only) */}
              <div className="hidden md:block absolute top-[4.5rem] left-[16.666%] right-[16.666%] h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

              {howItWorksSteps.map((step, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative flex flex-col items-center text-center space-y-6 transition-all duration-700",
                    howItWorksRef.inView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  )}
                  style={{
                    transitionDelay: howItWorksRef.inView
                      ? `${i * 150}ms`
                      : "0ms",
                  }}
                >
                  {/* Step Number Circle */}
                  <div className="relative">
                    <div className="w-[5.5rem] h-[5.5rem] rounded-3xl bg-gradient-to-br from-purple-600/20 to-blue-600/10 border border-purple-500/20 flex items-center justify-center backdrop-blur-sm">
                      <span
                        className="text-2xl font-black text-purple-400"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {step.step}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <step.icon className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <div className="space-y-3 max-w-xs">
                    <h3
                      className="text-xl font-bold tracking-tight"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-[14px] text-white/35 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <section
          id="testimonials"
          ref={testimonialsRef.ref}
          className="py-24 sm:py-40 px-4 sm:px-6 relative overflow-hidden"
        >
          <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/[0.04] blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto">
            <div
              className={cn(
                "flex flex-col items-center text-center space-y-6 mb-16 sm:mb-24 transition-all duration-700",
                testimonialsRef.inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
            >
              <div className="px-5 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400">
                Depoimentos
              </div>
              <h2
                className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Quem usa CashFlow{" "}
                <br className="hidden sm:block" />
                <span className="text-emerald-400 italic">
                  não volta atrás.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={cn(
                    "group relative rounded-[1.8rem] border border-white/[0.06] bg-[#09090c] p-8 sm:p-10 space-y-6 transition-all duration-700 hover:border-purple-500/20 hover:scale-[1.02]",
                    testimonialsRef.inView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  )}
                  style={{
                    transitionDelay: testimonialsRef.inView
                      ? `${i * 100}ms`
                      : "0ms",
                  }}
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>

                  <p className="text-[15px] text-white/50 leading-relaxed font-medium italic">
                    "{t.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/[0.04]">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600/30 to-blue-600/20 border border-white/[0.08] flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-300">
                        {t.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-xs text-white/30 font-medium">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section
          id="faq"
          ref={faqRef.ref}
          className="py-24 sm:py-40 px-4 sm:px-6 relative overflow-hidden"
        >
          <div className="max-w-3xl mx-auto">
            <div
              className={cn(
                "flex flex-col items-center text-center space-y-6 mb-16 transition-all duration-700",
                faqRef.inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
            >
              <div className="px-5 py-2 rounded-full border border-violet-500/20 bg-violet-500/[0.06] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-violet-400">
                FAQ
              </div>
              <h2
                className="text-3xl sm:text-5xl font-black tracking-tighter"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Tudo que Você Precisa{" "}
                <br className="hidden sm:block" />
                <span className="text-violet-400 italic">Saber Antes.</span>
              </h2>
              <p className="text-base text-white/35 max-w-xl mx-auto">
                Respostas para as perguntas mais frequentes, assim você pode
                começar com total confiança.
              </p>
            </div>

            <div
              className={cn(
                "space-y-3 transition-all duration-700",
                faqRef.inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
            >
              {faqItems.map((item, i) => (
                <FAQItem
                  key={i}
                  item={item}
                  isOpen={openFAQ === i}
                  onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA Final ─── */}
        <section ref={ctaRef.ref} className="py-20 sm:py-32 px-4 sm:px-6">
          <div
            className={cn(
              "max-w-5xl mx-auto relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] transition-all duration-1000",
              ctaRef.inView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-violet-900/30 to-blue-900/40" />
            <div className="absolute inset-0 bg-[#030303]/30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-purple-500/20 blur-[120px]" />

            {/* Decorative border */}
            <div className="absolute inset-0 rounded-[2rem] sm:rounded-[3rem] border border-purple-500/10" />

            <div className="relative z-10 py-16 sm:py-24 px-6 sm:px-16 flex flex-col items-center text-center space-y-8">
              <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center mb-2">
                <Sparkles className="h-8 w-8 text-purple-400" />
              </div>

              <h2
                className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Pronto para Tomar{" "}
                <br className="hidden sm:block" />
                Controle?
              </h2>
              <p className="text-base sm:text-lg text-white/45 max-w-xl mx-auto leading-relaxed">
                Junte-se a milhares de usuários que já transformaram seu futuro
                financeiro. Comece agora, é grátis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                <Link to="/cadastro">
                  <Button
                    size="lg"
                    className="h-14 sm:h-16 rounded-full px-10 sm:px-14 bg-white text-black hover:bg-white/90 font-black text-base sm:text-lg transition-all active:scale-95 shadow-2xl shadow-white/10 hover:shadow-white/20 border-0"
                  >
                    Começar Agora
                  </Button>
                </Link>
                <Link
                  to="/documentacao"
                  className="text-white/50 hover:text-white font-bold text-base underline underline-offset-8 decoration-purple-500/30 hover:decoration-purple-500 transition-all"
                >
                  Ver Documentação
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="py-16 sm:py-20 px-4 sm:px-6 border-t border-white/[0.04] bg-[#010101]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">
          <div className="col-span-2 md:col-span-1 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-600 shadow-lg shadow-purple-600/20">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-black tracking-tighter">
                Cash<span className="text-purple-400 italic">Flow</span>
              </span>
            </div>
            <p className="text-white/30 text-[13px] leading-relaxed max-w-xs">
              Sua inteligência financeira personalizada. Transformando dados em
              liberdade real.
            </p>
          </div>

          <div>
            <h4 className="text-white/80 font-bold mb-5 uppercase tracking-widest text-[11px]">
              Navegação
            </h4>
            <ul className="space-y-3 text-white/30 text-[13px] font-medium">
              <li>
                <a
                  href="#features"
                  className="hover:text-purple-400 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-purple-400 transition-colors"
                >
                  Como Funciona
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="hover:text-purple-400 transition-colors"
                >
                  Depoimentos
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-purple-400 transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white/80 font-bold mb-5 uppercase tracking-widest text-[11px]">
              Recursos
            </h4>
            <ul className="space-y-3 text-white/30 text-[13px] font-medium">
              <li>
                <Link
                  to="/documentacao"
                  className="hover:text-purple-400 transition-colors"
                >
                  Documentação
                </Link>
              </li>
              <li>
                <Link
                  to="/suporte"
                  className="hover:text-purple-400 transition-colors"
                >
                  Suporte
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white/80 font-bold mb-5 uppercase tracking-widest text-[11px]">
              Legal
            </h4>
            <ul className="space-y-3 text-white/30 text-[13px] font-medium">
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-14 sm:mt-20 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-[12px] font-medium text-white/20">
            © {new Date().getFullYear()} CashFlow. Todos os direitos reservados.
          </span>
          <div className="flex gap-8 items-center text-[11px] font-bold uppercase tracking-widest text-white/20">
            <a
              href="#"
              className="hover:text-purple-400 transition-colors"
            >
              Twitter
            </a>
            <a
              href="#"
              className="hover:text-purple-400 transition-colors"
            >
              Discord
            </a>
            <a
              href="#"
              className="hover:text-purple-400 transition-colors"
            >
              Github
            </a>
          </div>
        </div>
      </footer>

      {/* ─── Custom Animations ─── */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
