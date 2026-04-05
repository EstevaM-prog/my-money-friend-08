import { Link } from "react-router-dom";
import { BookOpen, Wallet, Target, CreditCard, ChevronRight, FileBarChart, Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const sections = [
  {
    icon: Wallet,
    title: "Primeiros Passos",
    desc: "Aprenda a configurar sua conta e registrar suas primeiras transações de forma rápida.",
    color: "text-blue-500 bg-blue-500/10",
    link: "primeiros-passos"
  },
  {
    icon: Target,
    title: "Metas Financeiras",
    desc: "Descubra como criar, acompanhar e atingir seus objetivos a curto, médio e longo prazo.",
    color: "text-emerald-500 bg-emerald-500/10",
    link: "metas-financeiras"
  },
  {
    icon: CreditCard,
    title: "Gerenciando Contas e Cartões",
    desc: "Cadastre bancos, unifique faturas de cartão de crédito e acompanhe seus saldos em um só lugar.",
    color: "text-purple-500 bg-purple-500/10",
    link: "gerenciar-contas"
  },
  {
    icon: FileBarChart,
    title: "Relatórios e Exportação",
    desc: "Gere relatórios complexos, visualize gráficos avançados e exporte dados para PDF ou Excel.",
    color: "text-rose-500 bg-rose-500/10",
    link: "relatorios-exportacao"
  },
  {
    icon: Zap,
    title: "Dicas de Produtividade",
    desc: "Atalhos de teclado, comandos rápidos e formas de otimizar sua gestão financeira diária.",
    color: "text-amber-500 bg-amber-500/10",
    link: "dicas-produtividade"
  }
];

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/suporte"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight">Centro de Ajuda</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Guias Oficiais V2.0</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:py-16">
        
        <div className="space-y-4 text-center pb-12 card-reveal">
          <div className="mx-auto w-fit p-4 rounded-2xl bg-primary/10 mb-6">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter">
            Como podemos te <span className="text-primary italic">ajudar?</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
            Tutoriais passo a passo e respostas detalhadas para você dominar o CashFlow Premium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8">
          {sections.map((sec, i) => (
             <Link key={i} to={`/documentacao/${sec.link}`} className="glass-card p-6 rounded-2xl border flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform duration-300 group cursor-pointer card-shadow">
               <div className={`p-3 rounded-xl ${sec.color}`}>
                 <sec.icon className="h-6 w-6" />
               </div>
               <div className="space-y-2 flex-1">
                 <h2 className="text-xl font-bold">{sec.title}</h2>
                 <p className="text-sm text-muted-foreground leading-relaxed">{sec.desc}</p>
               </div>
               <div className="mt-4 flex items-center text-primary font-semibold text-sm group-hover:underline w-full justify-between">
                 <span>Ler artigo completo</span>
                 <ChevronRight className="h-4 w-4" />
               </div>
             </Link>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-3xl gradient-primary text-white text-center shadow-xl space-y-4 overflow-hidden relative group">
           <BookOpen className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
           <h3 className="text-2xl font-black relative z-10">Não encontrou o que procurava?</h3>
           <p className="opacity-90 relative z-10 max-w-md mx-auto">Nossos especialistas estão disponíveis no chat para te auxiliar com qualquer dúvida específica.</p>
           <Button variant="secondary" size="lg" className="rounded-xl font-bold mt-4 relative z-10" asChild>
             <Link to="/chat">Falar com o Suporte</Link>
           </Button>
        </div>
      </main>
    </div>
  );
}
