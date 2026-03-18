import { useState, useMemo, useEffect } from "react";
import { TrendingUp, TrendingDown, Wallet, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, isWithinInterval, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSearchParams } from "react-router-dom";
import { SummaryCard } from "@/components/SummaryCard";
import { TransactionList } from "@/components/TransactionList";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { CategoryChart } from "@/components/CategoryChart";
import { MonthlyChart } from "@/components/MonthlyChart";
import { FinanceCalendar } from "@/components/FinanceCalendar";
import { INITIAL_TRANSACTIONS, Transaction } from "@/lib/finance-data";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";

const Index = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "financaspro_transactions",
    INITIAL_TRANSACTIONS
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setDialogOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const filtered = useMemo(
    () =>
      transactions.filter((t) =>
        isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
      ),
    [transactions, monthStart, monthEnd]
  );

  const totalIncome = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const transactionCount = filtered.length;

  const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  function handleAdd(t: Omit<Transaction, "id">) {
    setTransactions((prev) => [...prev, { ...t, id: String(Date.now()) }]);
  }

  function handleDelete(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Painel Principal</h1>
          <AddTransactionDialog onAdd={handleAdd} open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>

        {/* Month selector */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth((m) => subMonths(m, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-base sm:text-lg font-semibold min-w-[140px] sm:min-w-[160px] text-center capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth((m) => addMonths(m, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <SummaryCard title="Receitas" value={fmt(totalIncome)} icon={TrendingUp} variant="income" />
          <SummaryCard title="Despesas" value={fmt(totalExpense)} icon={TrendingDown} variant="expense" />
          <SummaryCard title="Saldo" value={fmt(balance)} icon={Wallet} variant="balance" />
          <div className="bg-card rounded-xl p-4 sm:p-5 card-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Transações</p>
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold mt-2">{transactionCount}</p>
            <p className="text-xs text-muted-foreground mt-1">neste mês</p>
          </div>
        </div>

        {/* Main grid: Charts + Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-card rounded-xl p-4 sm:p-5 card-shadow">
              <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Evolução Mensal</h3>
              <MonthlyChart transactions={transactions} />
            </div>
            <div className="bg-card rounded-xl p-4 sm:p-5 card-shadow">
              <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Despesas por Categoria</h3>
              <CategoryChart transactions={filtered} />
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 sm:p-5 card-shadow">
            <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Calendário</h3>
            <FinanceCalendar
              transactions={filtered}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              currentMonth={currentMonth}
            />
          </div>
        </div>

        {/* Transaction list */}
        <div className="bg-card rounded-xl p-4 sm:p-5 card-shadow">
          <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Transações ({filtered.length})</h3>
          <TransactionList transactions={filtered} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default Index;
