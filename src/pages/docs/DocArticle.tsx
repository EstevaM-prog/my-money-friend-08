import { Link, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Wallet, 
  Target, 
  CreditCard, 
  FileBarChart, 
  Zap,
  HelpCircle,
  ChevronLeft,
  MessageCircle,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const articles: Record<string, { title: string, icon: any, color: string, content: React.ReactNode }> = {
  "primeiros-passos": {
    title: "Primeiros Passos",
    icon: Wallet,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    content: (
      <>
        <p className="text-lg text-white/50 leading-relaxed font-medium">
          Bem-vindo ao CashFlow! Este guia mostra os fundamentos do aplicativo para você ter controle absoluto das suas finanças rapidamente.
        </p>
        <h2 className="text-2xl font-bold mt-12 mb-4 text-white tracking-tight">1. O Coração do App: O Painel</h2>
        <p className="text-white/40 leading-relaxed mb-6">No <strong>Painel (Dashboard)</strong>, você visualiza um resumo imediato das suas finanças. O aplicativo soma todas as suas receitas e subtrai suas despesas, montando automaticamente o saldo total do mês atual.</p>
        
        <h2 className="text-2xl font-bold mt-12 mb-4 text-white tracking-tight">2. Botão de Lançamento</h2>
        <p className="text-white/40 leading-relaxed">Tanto no menu lateral quanto pelo botão central na versão celular, existe a opção <strong>Lançamento</strong> para você incluir transações.</p>
        <ul className="space-y-4 mt-6">
          <li className="flex gap-3 text-white/40 italic">
            <div className="h-1 w-1 rounded-full bg-blue-400 mt-2.5 shrink-0" />
            <span><strong>Receitas:</strong> Entrada de dinheiro, com categorias como Salário ou Investimentos.</span>
          </li>
          <li className="flex gap-3 text-white/40 italic">
            <div className="h-1 w-1 rounded-full bg-blue-400 mt-2.5 shrink-0" />
            <span><strong>Despesas:</strong> Saída de dinheiro, como Alimentação, Moradia e Transporte.</span>
          </li>
          <li className="flex gap-3 text-white/40 italic">
            <div className="h-1 w-1 rounded-full bg-blue-400 mt-2.5 shrink-0" />
            <span><strong>Notificações de Vencimento:</strong> Ao cadastrar uma despesa com data futura, você pode habilitar o alerta de e-mail integrado para não perder o prazo de pagamento.</span>
          </li>
        </ul>
      </>
    )
  },
  "metas-financeiras": {
    title: "Metas Financeiras",
    icon: Target,
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    content: (
      <>
        <p className="text-lg text-white/50 leading-relaxed font-medium">
          Traçar objetivos é o segredo do sucesso financeiro. Use nosso módulo dinâmico de Metas para não se desviar do caminho.
        </p>
        <h2 className="text-2xl font-bold mt-12 mb-4 text-white tracking-tight">Como definir e acompanhar</h2>
        <p className="text-white/40 leading-relaxed">Na página <strong>Metas</strong>, clique em "Nova Meta". Defina:</p>
        <ul className="space-y-4 mt-6">
          <li className="flex gap-3 text-white/40">
            <div className="h-1 w-1 rounded-full bg-emerald-400 mt-2.5 shrink-0" />
            O nome do sonho (ex: "Viagem à Europa") e a data limite.
          </li>
          <li className="flex gap-3 text-white/40">
            <div className="h-1 w-1 rounded-full bg-emerald-400 mt-2.5 shrink-0" />
            O valor total desejado e quanto você já tem guardado (Valor Inicial).
          </li>
          <li className="flex gap-3 text-white/40">
            <div className="h-1 w-1 rounded-full bg-emerald-400 mt-2.5 shrink-0" />
            A cor temática para o cartão da sua meta.
          </li>
        </ul>
        <p className="mt-8 text-white/40 leading-relaxed italic">O CashFlow desenhará barras de progresso percentuais que mostram exatamente o quão perto você está do seu alvo.</p>
      </>
    )
  },
  "gerenciar-contas": {
    title: "Gerenciando Contas",
    icon: CreditCard,
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    content: (
      <>
        <p className="text-lg text-white/50 leading-relaxed font-medium">
          Diga adeus à confusão das múltiplas contas. O módulo de Contas permite que você faça a conciliação exata de onde seu dinheiro está guardado.
        </p>
        <h2 className="text-2xl font-bold mt-12 mb-4 text-white tracking-tight">1. Tipos de Conta</h2>
        <p className="text-white/40 leading-relaxed">Você pode adicionar bancos com tipos específicos: <strong>Conta Corrente, Poupança, Cartão de Crédito e Investimento</strong>.</p>
        
        <h2 className="text-2xl font-bold mt-12 mb-4 text-white tracking-tight">2. Magia do Cartão de Crédito</h2>
        <p className="text-white/40 leading-relaxed">Sempre que você cadastrar um Cartão de Crédito, ele ficará disponível nos formulários de despesas! Ao selecionar "Cartão" numa despesa, aquele gasto aumenta automaticamente a fatura pendente.</p>
        <div className="mt-8 p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex gap-4">
          <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-bold mb-1">Dica de Especialista</p>
            <p className="text-xs text-white/40 font-medium leading-relaxed">Suas contas exibem saldos positivos separados de faturas pendentes, entregando seu <strong>Patrimônio Total Líquido</strong> de forma precisa.</p>
          </div>
        </div>
      </>
    )
  },
  "relatorios-exportacao": {
    title: "Relatórios & Export",
    icon: FileBarChart,
    color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    content: (
      <>
        <p className="text-lg text-white/50 leading-relaxed font-medium">
          Nenhuma gestão é cega. Nossos gráficos interativos e ferramentas de Exportação te entregam auditoria completa.
        </p>
        <h2 className="text-2xl font-bold mt-12 mb-4 text-white tracking-tight">1. Análise Financeira</h2>
        <p className="text-white/40 leading-relaxed">Na aba <strong>Relatórios</strong> e no <strong>Painel</strong>, você conta com gráficos que comparam entradas vs saídas e mapeiam categorias.</p>
        <h2 className="text-2xl font-bold mt-12 mb-4 text-white tracking-tight">2. Importar e Exportar Dados</h2>
        <p className="text-white/40 leading-relaxed">Integrado na tela de perfil ou listas, utilizamos ferramentas de ponta para converter seus dados:</p>
        <ul className="space-y-4 mt-6">
          <li className="flex gap-3 text-white/40">
            <div className="h-1 w-1 rounded-full bg-rose-400 mt-2.5 shrink-0" />
            <span><strong>Exportar CSV, Excel e PDF:</strong> Faça backup ou envie sua declaração para o contador com um clique.</span>
          </li>
          <li className="flex gap-3 text-white/40">
            <div className="h-1 w-1 rounded-full bg-rose-400 mt-2.5 shrink-0" />
            <span><strong>Importar Faturas PDF:</strong> O sistema tentará ler PDFs bancários padronizados para alimentar seu extrato.</span>
          </li>
        </ul>
      </>
    )
  },
  "dicas-produtividade": {
    title: "Dicas & Truques",
    icon: Zap,
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    content: (
      <>
        <p className="text-lg text-white/50 leading-relaxed font-medium">
          Economizar dinheiro é bom, mas economizar tempo é mágico. Conheça as funcionalidades secretas.
        </p>
        <h2 className="text-2xl font-bold mt-12 mb-4 text-white tracking-tight">Modo Privacidade</h2>
        <p className="text-white/40 leading-relaxed">No canto superior da tela (Header), existe um ícone de "Olho". Clique nele quando estiver pagando um lanche na padaria ou com fluxo de pessoas. <strong>O sistema mascarará instantaneamente todos os valores em R$</strong> em todas as telas.</p>
        <h2 className="text-2xl font-bold mt-12 mb-4 text-white tracking-tight">Atalhos de Interface</h2>
        <p className="text-white/40 leading-relaxed">Utilize os botões de recolher no final da barra lateral para usar o formato <em>Icon Mode</em>, aumentando o espaço dos gráficos. Ou use <strong>Ctrl + B</strong> para esconder o menu.</p>
      </>
    )
  }
};

export default function DocArticle() {
  const { id } = useParams();
  const article = id ? articles[id] : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-[#020205] flex flex-col items-center justify-center p-6 text-center space-y-6">
         <div className="h-20 w-20 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
            <HelpCircle className="h-10 w-10 text-white/20" />
         </div>
         <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>Artigo não encontrado</h1>
            <p className="text-white/40 font-medium">O conteúdo que você procura não existe ou foi movido.</p>
         </div>
         <Button asChild className="h-12 px-8 rounded-xl bg-white text-black hover:bg-white/90 font-bold border-0">
            <Link to="/documentacao">Voltar para Documentação</Link>
         </Button>
      </div>
    );
  }

  const Icon = article.icon;

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* ─── Ambient Glows ─── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 rounded-full bg-purple-600/[0.06] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 rounded-full bg-blue-600/[0.06] blur-[120px]" />
      </div>

      <header className="fixed top-0 inset-x-0 z-50 px-6 py-6 pointer-events-none">
        <div className="max-w-4xl mx-auto flex items-center justify-between h-14 px-4 rounded-full border border-white/[0.08] bg-black/40 backdrop-blur-xl pointer-events-auto shadow-2xl">
          <Link to="/documentacao" className="flex items-center gap-2 group text-white/40 hover:text-white transition-colors">
            <div className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
              <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span className="text-sm font-bold tracking-tight">Documentação</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 pt-0.5">Wiki Ativa</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32 pb-20">
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
          
          {/* Article Header */}
          <div className="space-y-8">
            <div className={cn(
              "w-20 h-20 rounded-[2rem] border flex items-center justify-center shadow-2xl",
              article.color
            )}>
              <Icon className="h-10 w-10" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/30 text-xs font-black uppercase tracking-[0.2em]">
                <BookOpen className="h-3.5 w-3.5" />
                Guia Detalhado
              </div>
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {article.title}
              </h1>
            </div>
          </div>

          {/* Article Body */}
          <div className="bg-[#090910]/40 border border-white/[0.06] rounded-[2.5rem] p-8 sm:p-12 lg:p-16 backdrop-blur-3xl shadow-2xl">
            <div className="prose prose-invert max-w-none prose-p:text-white/40 prose-headings:text-white font-medium">
              {article.content}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-purple-500/[0.08] to-indigo-500/[0.08] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-8 group">
             <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-xl font-bold tracking-tight">Precisa de suporte personalizado?</h3>
                <p className="text-sm text-white/40 font-medium">Nossa equipe de especialistas está pronta para te atender agora.</p>
             </div>
             <Button asChild className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-white/90 font-black text-sm uppercase tracking-widest border-0 flex items-center gap-3 transition-all hover:scale-105 active:scale-95">
                <Link to="/chat">
                   <MessageCircle className="h-5 w-5" />
                   Falar com IA
                </Link>
             </Button>
          </div>
        </div>
      </main>

      {/* ─── Global Background Strip ─── */}
      <div className="fixed inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
    </div>
  );
}
