import { Link } from "react-router-dom";
import { Wallet, TrendingUp, ShieldCheck, BarChart3, Target, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BarChart3,
    title: "Gráficos em tempo real",
    description: "Visualize suas receitas e despesas com gráficos interativos e intuitivos.",
  },
  {
    icon: Target,
    title: "Metas financeiras",
    description: "Defina e acompanhe metas personalizadas para alcançar seus objetivos.",
  },
  {
    icon: ShieldCheck,
    title: "100% seguro",
    description: "Seus dados ficam protegidos e armazenados de forma segura.",
  },
  {
    icon: Zap,
    title: "Lançamentos rápidos",
    description: "Registre transações em segundos com uma interface simples e eficiente.",
  },
];

const benefits = [
  "Controle total das suas finanças",
  "Dashboard completo e intuitivo",
  "Relatórios mensais detalhados",
  "Calendário financeiro integrado",
  "Tema claro e escuro",
  "Acesso em qualquer dispositivo",
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg gradient-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">FinançasPro</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild className="gradient-primary border-0 text-primary-foreground">
              <Link to="/cadastro">Começar grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-accent/50 text-accent-foreground text-sm font-medium mb-2">
              <TrendingUp className="h-3.5 w-3.5" />
              Controle financeiro inteligente
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Suas finanças,{" "}
              <span className="text-primary">sob controle</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Gerencie receitas, despesas e metas financeiras com um painel moderno, intuitivo e completo. Grátis para sempre.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button size="lg" asChild className="gradient-primary border-0 text-primary-foreground font-semibold px-8 gap-2">
                <Link to="/cadastro">
                  Criar conta grátis <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Já tenho conta</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 px-4 bg-muted/40">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-3 p-4 rounded-xl bg-card border card-shadow">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold tracking-tight">Tudo que você precisa</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Ferramentas poderosas para ajudar você a alcançar a liberdade financeira.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f) => (
                <div key={f.title} className="bg-card rounded-2xl p-6 border card-shadow space-y-3 hover:card-shadow-hover transition-shadow">
                  <div className="p-2.5 rounded-xl gradient-primary w-fit">
                    <f.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6 bg-card rounded-3xl border p-12 card-shadow relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
            </div>
            <div className="p-3 rounded-2xl gradient-primary w-fit mx-auto">
              <Wallet className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Pronto para começar?</h2>
            <p className="text-muted-foreground">
              Crie sua conta gratuitamente e comece a controlar suas finanças hoje mesmo.
            </p>
            <Button size="lg" asChild className="gradient-primary border-0 text-primary-foreground font-semibold px-10 gap-2">
              <Link to="/cadastro">
                Começar agora <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} FinançasPro. Todos os direitos reservados.</span>
          <div className="flex items-center gap-4">
            <Link to="/suporte" className="hover:text-primary transition-colors">Suporte</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link to="/cadastro" className="hover:text-primary transition-colors">Cadastro</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
