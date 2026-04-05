import { Transaction, CATEGORY_COLORS } from "@/client/lib/finance-data";
import { Trash2 } from "lucide-react";
import { useFinance } from "@/client/hooks/use-finance";
import { getIconComponent, DEFAULT_CATEGORY_ICON_MAP } from "@/client/lib/icons";
import { NotificationToggle } from "./NotificationToggle";
import { cn } from "@/client/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePrivacy } from "@/client/hooks/use-privacy";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onToggleNotification: (id: string) => void;
}

export function TransactionList({ transactions, onDelete, onToggleNotification }: TransactionListProps) {
  const { isPrivate } = usePrivacy();
  const { customCategories } = useFinance();
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
      {sorted.map((t) => {
        const customCat = customCategories.find(c => c.name === t.category);
        const iconName = customCat ? customCat.icon : DEFAULT_CATEGORY_ICON_MAP[t.category];
        const CategoryIcon = getIconComponent(iconName);

        return (
          <div
            key={t.id}
            className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div
              className={cn(
                "p-1.5 sm:p-2 rounded-lg shrink-0",
                t.type === "income" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
              )}
            >
              <CategoryIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{t.paymentMethod}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">•</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                  {t.virtualRange ? t.virtualRange : format(new Date(t.date), "dd MMM", { locale: ptBR })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <p
                className={cn(
                  "text-xs sm:text-sm font-bold whitespace-nowrap text-right",
                  t.type === "income" ? "text-green-500" : "text-red-500"
                )}
              >
                {t.type === "income" ? "+ " : "- "}
                {isPrivate ? "R$ •••••" : `R$ ${t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              </p>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <NotificationToggle
                  active={t.email_notification_active ?? false}
                  onToggle={() => onToggleNotification(t.id)}
                />
                <button
                  onClick={() => onDelete(t.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-expense transition-all hidden sm:block"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Mobile delete stays same or simplified */}
            <button
              onClick={() => onDelete(t.id)}
              className="p-1 rounded-md text-muted-foreground hover:text-expense sm:hidden"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  );
}
