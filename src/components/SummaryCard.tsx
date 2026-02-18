import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant: "income" | "expense" | "balance";
}

const variantStyles = {
  income: "border-l-income text-income",
  expense: "border-l-expense text-expense",
  balance: "border-l-balance text-balance",
};

export function SummaryCard({ title, value, icon: Icon, variant }: SummaryCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 card-shadow border-l-4 transition-all duration-200 hover:card-shadow-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className={cn("text-2xl font-bold mt-1 tracking-tight", variantStyles[variant])}>
            {value}
          </p>
        </div>
        <div className={cn("p-3 rounded-xl", variant === "income" ? "bg-accent" : variant === "expense" ? "bg-destructive/10" : "bg-balance/10")}>
          <Icon className={cn("h-5 w-5", variantStyles[variant])} />
        </div>
      </div>
    </div>
  );
}
