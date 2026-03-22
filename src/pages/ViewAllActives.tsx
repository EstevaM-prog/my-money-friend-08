import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useFinance } from "@/hooks/use-finance";
import { TransactionList } from "@/components/finance/TransactionList";
import { ArrowLeft, History } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/finance-data";

export default function ViewAllActives() {
  const { transactions, deleteTransaction, toggleNotification } = useFinance();

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    
    transactions.forEach(t => {
      const key = `${t.description}_${t.amount}_${t.category}_${t.paymentMethod || ''}_${t.type}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });

    const result: Transaction[] = [];

    Object.values(groups).forEach(group => {
      if (group.length > 1) {
        const sortedDates = group.map(g => parseISO(g.date)).sort((a, b) => a.getTime() - b.getTime());
        const minDate = sortedDates[0];
        const maxDate = sortedDates[sortedDates.length - 1];

        const dateStr = `${format(minDate, "dd/MM/yy")} a ${format(maxDate, "dd/MM/yy")}`;

        result.push({
          ...group[0],
          id: group.map(g => g.id).join(","), 
          date: maxDate.toISOString(),
          virtualRange: dateStr,
          groupedIds: group.map(g => g.id),
        });
      } else {
        result.push(group[0]);
      }
    });

    return result;
  }, [transactions]);

  const handleDelete = (id: string) => {
    if (id.includes(",")) {
      id.split(",").forEach(singleId => deleteTransaction(singleId));
    } else {
      deleteTransaction(id);
    }
  };

  const handleToggle = (id: string) => {
    if (id.includes(",")) {
      id.split(",").forEach(singleId => toggleNotification(singleId));
    } else {
      toggleNotification(id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl gradient-primary">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Todas as Atividades</h1>
            <p className="text-sm text-muted-foreground">Histórico completo de transações</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <TransactionList 
          transactions={groupedTransactions} 
          onDelete={handleDelete}
          onToggleNotification={handleToggle}
        />
      </div>
    </div>
  );
}
