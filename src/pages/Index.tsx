import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Wallet, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, isWithinInterval, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SummaryCard } from "@/components/SummaryCard";
import { TransactionList } from "@/components/TransactionList";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { CategoryChart } from "@/components/CategoryChart";
import { MonthlyChart } from "@/components/MonthlyChart";
import { INITIAL_TRANSACTIONS, Transaction } from "@/lib/finance-data";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  function handleAdd(t: Omit<Transaction, "id">) {
    setTransactions((prev) => [...prev, { ...t, id: String(Date.now()) }]);
  }

  function handleDelete(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">FinançasPro</h1>
          </div>
          <AddTransactionDialog onAdd={handleAdd} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Month selector */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold min-w-[160px] text-center capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard title="Receitas" value={fmt(totalIncome)} icon={TrendingUp} variant="income" />
          <SummaryCard title="Despesas" value={fmt(totalExpense)} icon={TrendingDown} variant="expense" />
          <SummaryCard title="Saldo" value={fmt(balance)} icon={Wallet} variant="balance" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl p-5 card-shadow">
            <h3 className="text-base font-semibold mb-4">Despesas por Categoria</h3>
            <CategoryChart transactions={filtered} />
          </div>
          <div className="bg-card rounded-xl p-5 card-shadow">
            <h3 className="text-base font-semibold mb-4">Evolução Mensal</h3>
            <MonthlyChart transactions={transactions} />
          </div>
        </div>

        {/* Transaction list */}
        <div className="bg-card rounded-xl p-5 card-shadow">
          <h3 className="text-base font-semibold mb-4">
            Transações ({filtered.length})
          </h3>
          <TransactionList transactions={filtered} onDelete={handleDelete} />
        </div>
      </main>
    </div>
  );
};

export default Index;
