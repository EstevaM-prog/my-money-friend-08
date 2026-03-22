import { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Transaction } from "@/lib/finance-data";
import { isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface FinanceCalendarProps {
  transactions: Transaction[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  currentMonth: Date;
}

export function FinanceCalendar({
  transactions,
  selectedDate,
  onSelectDate,
  currentMonth,
}: FinanceCalendarProps) {
  const dayData = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    transactions.forEach((t) => {
      const key = new Date(t.date).toDateString();
      const prev = map.get(key) || { income: 0, expense: 0 };
      if (t.type === "income") prev.income += t.amount;
      else prev.expense += t.amount;
      map.set(key, prev);
    });
    return map;
  }, [transactions]);

  return (
    <div className="space-y-3">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        month={currentMonth}
        className="p-3 pointer-events-auto w-full"
        classNames={{
          months: "flex flex-col w-full",
          month: "space-y-4 w-full",
          table: "w-full border-collapse",
          head_row: "flex w-full",
          head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] text-center",
          row: "flex w-full mt-1",
          cell: "flex-1 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          day: "h-10 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md flex flex-col items-center justify-center gap-0.5",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "hidden",
        }}
        components={{
          DayContent: ({ date }) => {
            const key = date.toDateString();
            const data = dayData.get(key);
            return (
              <div className="flex flex-col items-center">
                <span className="text-xs">{date.getDate()}</span>
                {data && (
                  <div className="flex gap-0.5">
                    {data.income > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--income))]" />
                    )}
                    {data.expense > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--expense))]" />
                    )}
                  </div>
                )}
              </div>
            );
          },
        }}
      />

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[hsl(var(--income))]" />
          Receita
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[hsl(var(--expense))]" />
          Despesa
        </div>
      </div>

      {/* Selected day summary */}
      {selectedDate && (() => {
        const key = selectedDate.toDateString();
        const data = dayData.get(key);
        const dayTransactions = transactions.filter((t) =>
          isSameDay(new Date(t.date), selectedDate)
        );
        if (!dayTransactions.length) return null;
        return (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              Transações do dia
            </p>
            {dayTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-xs">
                <span className="truncate max-w-[140px]">{t.description}</span>
                <span
                  className={cn(
                    "font-semibold",
                    t.type === "income" ? "text-[hsl(var(--income))]" : "text-[hsl(var(--expense))]"
                  )}
                >
                  {t.type === "income" ? "+" : "-"}R$ {t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}
