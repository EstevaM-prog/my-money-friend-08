import { Bell, BellOff } from "lucide-react";
import { cn } from "@/client/lib/utils";

interface NotificationToggleProps {
  active: boolean;
  onToggle: () => void;
  variant?: "icon" | "switch";
}

export function NotificationToggle({ active, onToggle, variant = "icon" }: NotificationToggleProps) {
  if (variant === "switch") {
    return (
      <div
        onClick={onToggle}
        className="flex items-center justify-between p-3 rounded-xl border bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors"
      >
        <div className="space-y-0.5">
          <p className="text-sm font-semibold">Notificar Vencimento</p>
          <p className="text-xs text-muted-foreground">Lembrar por e-mail no dia do vencimento</p>
        </div>
        <div className={cn(
          "w-10 h-6 flex items-center rounded-full p-1 transition-colors",
          active ? "bg-primary" : "bg-muted-foreground/30"
        )}>
          <div className={cn(
            "bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform",
            active ? "translate-x-4" : "translate-x-0"
          )} />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "p-1.5 rounded-md transition-all",
        active
          ? "text-primary bg-primary/10 hover:bg-primary/20"
          : "text-muted-foreground hover:bg-muted opacity-40 hover:opacity-100"
      )}
      title={active ? "Notificação ativa" : "Ativar notificação"}
    >
      {active ? <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <BellOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
    </button>
  );
}
