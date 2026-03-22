import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Wallet, Target, CreditCard, FileBarChart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const articles: Record<string, { title: string, icon: any, color: string, content: React.ReactNode }> = {
  "primeiros-passos": {
    title: "Primeiros Passos",
    icon: Wallet,
    color: "text-blue-500 bg-blue-500/10",
    content: (
      <>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Bem-vindo ao CashFlow! Este guia mostra os fundamentos do aplicativo para você ter controle absoluto das suas finanças rapidamente.
        </p>
        <h2 className="text-2xl font-bold mt-8 border-b pb-2">1. O Coração do App: O Painel</h2>
        <p>No <strong>Painel (Dashboard)</strong>, você visualiza um resumo imediato das suas finanças. O aplicativo soma todas as suas receitas e subtrai suas despesas, montando automaticamente o saldo total do mês atual.</p>
        
        <h2 className="text-2xl font-bold mt-8 border-b pb-2">2. Botão de Lançamento</h2>
        <p>Tanto no menu lateral quanto pelo botão central na versão celular, existe a opção <strong>Lançamento</strong> para você incluir transações.</p>
        <ul className="list-disc pl-5 space-y-2 mt-4 text-muted-foreground">
          <li><strong>Receitas:</strong> Entrada de dinheiro, com categorias como <em>Salário</em> ou <em>Investimentos</em>.</li>
          <li><strong>Despesas:</strong> Saída de dinheiro, como <em>Alimentação</em>, <em>Moradia</em> e <em>Transporte</em>.</li>
          <li><strong>Notificações de Vencimento:</strong> Ao cadastrar uma despesa com data futura, você pode habilitar o alerta de e-mail integrado para não perder o prazo de pagamento.</li>
        </ul>
      </>
    )
  },
  "metas-financeiras": {
    title: "Metas Financeiras",
    icon: Target,
    color: "text-emerald-500 bg-emerald-500/10",
    content: (
      <>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Traçar objetivos é o segredo do sucesso financeiro. Use nosso módulo dinâmico de Metas para não se desviar do caminho.
        </p>
        <h2 className="text-2xl font-bold mt-8 border-b pb-2">Como definir e acompanhar</h2>
        <p>Na página <strong>Metas</strong>, clique em "Nova Meta". Defina:</p>
        <ul className="list-disc pl-5 space-y-2 mt-4 text-muted-foreground">
          <li>O nome do sonho (ex: "Viagem à Europa") e a data limite.</li>
          <li>O valor total desejado e quanto você já tem guardado (Valor Inicial).</li>
          <li>A cor temática para o cartão da sua meta.</li>
        </ul>
        <p className="mt-4">O CashFlow desenhará barras de progresso percentuais que mostram exatamente o quão perto você está do seu alvo.</p>
      </>
    )
  },
  "gerenciar-contas": {
    title: "Gerenciando Contas e Cartões",
    icon: CreditCard,
    color: "text-purple-500 bg-purple-500/10",
    content: (
      <>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Diga adeus à confusão das múltiplas contas. O módulo de Contas permite que você faça a conciliação exata de onde seu dinheiro está guardado.
        </p>
        <h2 className="text-2xl font-bold mt-8 border-b pb-2">1. Tipos de Conta</h2>
        <p>Você pode adicionar bancos com tipos específicos: <strong>Conta Corrente, Poupança, Cartão de Crédito e Investimento</strong>.</p>
        
        <h2 className="text-2xl font-bold mt-8 border-b pb-2">2. Magia do Cartão de Crédito</h2>
        <p>Sempre que você cadastrar um Cartão de Crédito, ele ficará disponível nos formulários de despesas! Ao selecionar "Cartão" numa despesa, aquele gasto aumenta automaticamente a fatura pendente e é contabilizado no resumo de <em>Dívidas</em>.</p>
        <p className="mt-4 text-sm bg-muted/50 p-4 rounded-xl border">Dica: Suas contas exibem saldos positivos separados de faturas pendentes, entregando seu <strong>Patrimônio Total Líquido</strong>.</p>
      </>
    )
  },
  "relatorios-exportacao": {
    title: "Relatórios e Exportação",
    icon: FileBarChart,
    color: "text-rose-500 bg-rose-500/10",
    content: (
      <>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Nenhuma gestão é cega. Nossos gráficos interativos e ferramentas de Exportação te entregam auditoria completa.
        </p>
        <h2 className="text-2xl font-bold mt-8 border-b pb-2">1. Análise Financeira</h2>
        <p>Na aba <strong>Relatórios</strong> e no <strong>Painel</strong>, você conta com gráficos que comparam entradas vs saídas e mapeiam categorias. O <em>Calendário Financeiro</em> ajuda a visualizar em qual dia do mês está caindo o maior peso.</p>
        <h2 className="text-2xl font-bold mt-8 border-b pb-2">2. Importar e Exportar Dados (Avançado)</h2>
        <p>Integrado na tela de perfil ou listas, utilizamos ferramentas de ponta para converter seus dados:</p>
        <ul className="list-disc pl-5 space-y-2 mt-4 text-muted-foreground">
          <li><strong>Exportar CSV, Excel e PDF:</strong> Faça backup ou envie sua declaração para o contador com um clique.</li>
          <li><strong>Importar Faturas PDF:</strong> O sistema tentará ler PDFs bancários padronizados para alimentar seu extrato.</li>
        </ul>
      </>
    )
  },
  "dicas-produtividade": {
    title: "Dicas de Produtividade",
    icon: Zap,
    color: "text-amber-500 bg-amber-500/10",
    content: (
      <>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Economizar dinheiro é bom, mas economizar tempo é mágico. Conheça as funcionalidades secretas.
        </p>
        <h2 className="text-2xl font-bold mt-8 border-b pb-2">Modo Privacidade (Anti-Curiosos)</h2>
        <p>No canto superior da tela (Header), existe um ícone de "Olho". Clique nele quando estiver pagando um lanche na padaria ou com fluxo de pessoas. <strong>O sistema mascarará instantaneamente todos os valores em R$</strong> em todas as telas.</p>
        <h2 className="text-2xl font-bold mt-8 border-b pb-2">Espaço Otimizado</h2>
        <p>Utilize os botões de recolher no final da barra lateral para usar o formato <em>Icon Mode</em>, aumentando o espaço dos gráficos, ideal para telas de Notebooks pequenos. Ou se preferir usar atalhos, pressione <strong>Ctrl + B</strong> (cmd + b no mac) para esconder o menu.</p>
        <h2 className="text-2xl font-bold mt-8 border-b pb-2">Notificações Rápidas</h2>
        <p>Você notará um pequeno ícone de "Sino" cinza nos itens na sua lista de transações recentes. Clique nele para agendar imediatamente um lembrete no momento da fatura!</p>
      </>
    )
  }
};

export default function DocArticle() {
  const { id } = useParams();
  const article = id ? articles[id] : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
         <h1 className="text-2xl font-black mb-4">Artigo não encontrado</h1>
         <Button asChild><Link to="/documentacao">Voltar</Link></Button>
      </div>
    );
  }

  const Icon = article.icon;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/documentacao"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight">{article.title}</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Central de Ajuda</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 sm:py-12">
        <div className="space-y-6 prose prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-black mb-6 flex items-center gap-3">
             <div className={`p-2 rounded-xl ${article.color}`}><Icon className="h-8 w-8" /></div>
             {article.title}
          </h1>
          
          {article.content}

          <div className="mt-12 p-6 rounded-2xl bg-muted/50 border flex flex-col items-center text-center">
             <h3 className="font-bold mb-2">Ainda com dúvidas?</h3>
             <Button asChild className="gradient-primary text-white">
               <Link to="/chat">Falar com Suporte</Link>
             </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
