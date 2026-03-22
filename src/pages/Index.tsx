import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Wallet, ChevronLeft, ChevronRight, ArrowUpRight, Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { format, startOfMonth, endOfMonth, isWithinInterval, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSearchParams } from "react-router-dom";
import { SummaryCard } from "@/components/finance/SummaryCard";
import { TransactionList } from "@/components/finance/TransactionList";
import { AddTransactionDialog } from "@/components/finance/AddTransactionDialog";
import { DataExchange } from "@/components/finance/DataExchange";
import { CategoryChart } from "@/components/charts/CategoryChart";
import { MonthlyChart } from "@/components/charts/MonthlyChart";
import { FinanceCalendar } from "@/components/finance/FinanceCalendar";
import { useFinance } from "@/hooks/use-finance";
import { usePrivacy } from "@/hooks/use-privacy";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { TriangleAlert, CheckCircle2, Sliders } from "lucide-react";

const Index = () => {
  const {
    transactions,
    accounts,
    addTransactions,
    deleteTransaction,
    toggleNotification,
    budgetRules,
    cardCeilings,
  } = useFinance();
  const { isPrivate } = usePrivacy();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const user = getSession();

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setDialogOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { filtered, totalIncome, totalExpense, balance, transactionCount } = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    const _filtered = transactions.filter((t) =>
      isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
    );

    const _income = _filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const _expense = _filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    return {
      filtered: _filtered,
      totalIncome: _income,
      totalExpense: _expense,
      balance: _income - _expense,
      transactionCount: _filtered.length,
    };
  }, [transactions, currentMonth]);

  const fmt = (v: number) => isPrivate ? "R$ •••••" : `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  // ── Budget monitoring for dashboard ──
  const catSpending = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return map;
  }, [filtered]);

  const cardSpending = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.filter(t => t.type === "expense" && t.accountId).forEach(t => {
      map[t.accountId!] = (map[t.accountId!] || 0) + t.amount;
    });
    return map;
  }, [filtered]);

  return (
    <div className="w-full min-h-screen pb-20 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-8">
        
        {/* Hero Greeting Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 card-reveal">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm tracking-wider uppercase">
              <Sparkles className="h-4 w-4" />
              <span>Bem-vindo de volta</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Olá, <span>{user?.name?.split(' ')[0] || 'Amigo'}!</span>
            </h1>
            <p className="text-muted-foreground max-w-md">
              Aqui está um resumo do seu desempenho financeiro em <span className="text-foreground font-medium capitalize">{format(currentMonth, "MMMM", { locale: ptBR })}</span>.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DataExchange onImport={addTransactions} transactions={transactions} />
            <AddTransactionDialog onAdd={addTransactions} open={dialogOpen} onOpenChange={setDialogOpen} />
          </div>
        </section>

        {/* Month Navigation & Global Summaries */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          <div className="xl:col-span-1 space-y-6">
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-between h-full min-h-[160px]">
              <div className="flex items-center justify-between w-full mb-4">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Período</span>
                  <h2 className="text-lg font-bold capitalize">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</h2>
                </div>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2 rounded-xl border-dashed border-primary/50 text-primary hover:bg-primary/5"
                onClick={() => setCurrentMonth(new Date())}
              >
                <CalendarIcon className="h-4 w-4" /> Ir para Hoje
              </Button>
            </div>
          </div>

          <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <SummaryCard title="Entradas" value={fmt(totalIncome)} icon={TrendingUp} variant="income" />
            <SummaryCard title="Saídas" value={fmt(totalExpense)} icon={TrendingDown} variant="expense" />
            <SummaryCard title="Saldo Global" value={fmt(balance)} icon={Wallet} variant="balance" />
          </div>
        </div>

        {/* Data Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <div className="glass-card p-6 sm:p-8 rounded-3xl overflow-hidden card-reveal" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold">Fluxo de Caixa</h3>
                  <p className="text-sm text-muted-foreground">Evolução financeira baseada nos seus lançamentos</p>
                </div>
                <div className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold text-primary uppercase tracking-tighter">Tempo Real</div>
              </div>
              <div className="h-[300px]">
                <MonthlyChart transactions={transactions} />
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="glass-card p-6 sm:p-8 rounded-3xl card-reveal" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Resumo Diário</h3>
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <CalendarIcon className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                <FinanceCalendar
                  transactions={filtered}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  currentMonth={currentMonth}
                />
              </div>

               <div className="glass-card p-6 sm:p-8 rounded-3xl card-reveal" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-lg font-bold mb-6">Categorias Principais</h3>
                <CategoryChart transactions={filtered} />
              </div>
            </div>
          </div>

          {/* ── Budget monitoring column ── */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-card p-6 sm:p-8 rounded-3xl flex flex-col card-reveal" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold">Últimas Atividades</h3>
                  <p className="text-sm text-muted-foreground">{transactionCount} lançamentos registrados</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-primary hover:bg-primary/5" asChild>
                  <Link to="/view-all-actives">Ver Tudo</Link>
                </Button>
              </div>
              <div className="flex-1 overflow-auto pr-1 custom-scrollbar">
                <TransactionList 
                  transactions={filtered} 
                  onDelete={deleteTransaction} 
                  onToggleNotification={toggleNotification} 
                />
              </div>
            </div>

            {/* Budget monitoring mini-panel */}
            {budgetRules.length > 0 && (
              <div className="glass-card p-6 rounded-3xl card-reveal space-y-4" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold">Orçamento do Mês</h3>
                  <Button variant="ghost" size="sm" className="text-xs text-primary hover:bg-primary/5" asChild>
                    <Link to="/estrategia"><Sliders className="h-3.5 w-3.5 mr-1 inline" />Configurar</Link>
                  </Button>
                </div>
                <div className="space-y-3">
                  {budgetRules.map((rule) => {
                    const used = catSpending[rule.category] || 0;
                    const limit = (rule.percentage / 100) * totalExpense;
                    const ratio = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
                    const isDanger = limit > 0 && used > limit;
                    return (
                      <div key={rule.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: rule.color }} />
                            {rule.label}
                          </span>
                          <span className={isDanger ? "text-destructive font-bold flex items-center gap-1" : "text-muted-foreground"}>
                            {isDanger && <TriangleAlert className="h-3 w-3" />}
                            {isDanger ? "Excedido" : `${ratio.toFixed(0)}%`}
                            {!isDanger && <CheckCircle2 className="h-3 w-3 text-green-500 ml-1" />}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${ratio}%`, backgroundColor: isDanger ? "#ef4444" : rule.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {cardCeilings.filter(c => c.limit > 0).map(c => {
                  const acc = accounts.find(a => a.id === c.accountId);
                  if (!acc) return null;
                  const spent = cardSpending[c.accountId] || 0;
                  const ratio = Math.min((spent / c.limit) * 100, 100);
                  const isDanger = spent > c.limit;
                  return (
                    <div key={c.accountId} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: acc.color }} />
                          {acc.name}
                        </span>
                        <span className={isDanger ? "text-destructive font-bold" : "text-muted-foreground"}>
                          {ratio.toFixed(0)}% {isDanger && "⚠️"}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${ratio}%`, backgroundColor: isDanger ? "#ef4444" : acc.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
