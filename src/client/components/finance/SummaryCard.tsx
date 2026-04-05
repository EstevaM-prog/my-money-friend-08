import { LucideIcon } from "lucide-react";
import { cn } from "@/client/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant: "income" | "expense" | "balance";
}

export function SummaryCard({ title, value, icon: Icon, variant }: SummaryCardProps) {
  const styles = {
    income: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      glow: "hover:shadow-emerald-500/20",
      icon: "bg-emerald-500/20 text-emerald-600",
    },
    expense: {
      bg: "bg-rose-500/10 dark:bg-rose-500/20",
      text: "text-rose-600 dark:text-rose-400",
      glow: "hover:shadow-rose-500/20",
      icon: "bg-rose-500/20 text-rose-600",
    },
    balance: {
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
      text: "text-blue-600 dark:text-blue-400",
      glow: "hover:shadow-blue-500/20",
      icon: "bg-blue-500/20 text-blue-600",
    },
  }[variant];

  return (
    <div className={cn(
      "glass-card p-6 rounded-2xl relative overflow-hidden card-reveal group border-l-4",
      variant === "income" ? "border-emerald-500" : variant === "expense" ? "border-rose-500" : "border-blue-500",
      styles.bg,
      styles.glow
    )}>
      {/* Background Glow */}
      <div className={cn(
        "absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-20 transition-all duration-700 group-hover:scale-150",
        variant === "income" ? "bg-emerald-500" : variant === "expense" ? "bg-rose-500" : "bg-blue-500"
      )} />

      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
          <p className={cn("text-3xl font-bold tracking-tight", styles.text)}>
            {value}
          </p>
        </div>
        <div className={cn("p-4 rounded-2xl transition-transform duration-500 group-hover:rotate-12", styles.icon)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
