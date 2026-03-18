import { Transaction, CATEGORY_COLORS } from "@/lib/finance-data";
import { ArrowDownLeft, ArrowUpRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-muted-foreground">
        <p className="text-base sm:text-lg font-medium">Nenhuma transação encontrada</p>
        <p className="text-xs sm:text-sm">Adicione sua primeira transação</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 sm:space-y-2">
      {sorted.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors group"
        >
          <div
            className={cn(
              "p-1.5 sm:p-2 rounded-lg shrink-0",
              t.type === "income" ? "bg-accent" : "bg-destructive/10"
            )}
          >
            {t.type === "income" ? (
              <ArrowDownLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-income" />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-expense" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-card-foreground truncate">{t.description}</p>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[t.category] }}
              />
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{t.category}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">•</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                {format(new Date(t.date), "dd MMM", { locale: ptBR })}
              </span>
            </div>
          </div>
          <p
            className={cn(
              "text-xs sm:text-sm font-semibold tabular-nums shrink-0",
              t.type === "income" ? "text-income" : "text-expense"
            )}
          >
            {t.type === "income" ? "+" : "-"} R${" "}
            {t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <button
            onClick={() => onDelete(t.id)}
            className="opacity-0 group-hover:opacity-100 p-1 sm:p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-expense transition-all sm:block hidden"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {/* Mobile: always visible delete */}
          <button
            onClick={() => onDelete(t.id)}
            className="p-1 rounded-md text-muted-foreground hover:text-expense sm:hidden"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
