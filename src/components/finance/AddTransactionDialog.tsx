import { useState, useMemo } from "react";
import { getIconComponent, DEFAULT_CATEGORY_ICON_MAP } from "@/lib/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Repeat } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { generateRecurringTransactions } from "@/lib/finance-utils";
import { NotificationToggle } from "./NotificationToggle";
import { parseISO } from "date-fns";
import {
  Transaction,
  PaymentMethod,
  DEFAULT_PAYMENT_METHODS,
  Account,
  TransactionType,
  Category,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from "@/lib/finance-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useFinance } from "@/hooks/use-finance";

interface AddTransactionDialogProps {
  onAdd: (t: Omit<Transaction, "id">[]) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddTransactionDialog({ onAdd, open: controlledOpen, onOpenChange }: AddTransactionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  const [type, setType] = useState<TransactionType>("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringUntil, setRecurringUntil] = useState("");
  const [emailNotificationActive, setEmailNotificationActive] = useState(false);

  const [accounts] = useLocalStorage<Account[]>("mymoneyfriend_accounts", []);
  const { customCategories } = useFinance();
  
  const paymentMethods = [
    ...DEFAULT_PAYMENT_METHODS,
    ...accounts.map(acc => acc.name)
  ];

  const currentCategories = useMemo(() => {
    const base = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const custom = customCategories.filter(c => c.type === type).map(c => c.name);
    return [...base, ...custom];
  }, [type, customCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || !category || !paymentMethod || !date) return;
    
    const baseTransaction: Omit<Transaction, "id" | "date"> = {
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category: category as Category,
    };
    
    if (type === "expense") {
      baseTransaction.email_notification_active = emailNotificationActive;
      if (emailNotificationActive) {
        // Define que disparará no mesmo dia do vencimento
        baseTransaction.notification_scheduled_at = new Date().toISOString(); 
      }
    }
      baseTransaction.paymentMethod = paymentMethod as PaymentMethod;
      const account = accounts.find(a => a.name === paymentMethod);
      if (account) {
        baseTransaction.accountId = account.id;
      }

    const newTransactions: Omit<Transaction, "id">[] = [];
    const startDate = parseISO(date);
    
    if (isRecurring && recurringUntil) {
      newTransactions.push(...generateRecurringTransactions(baseTransaction, date, recurringUntil));
    } else {
      newTransactions.push({
        ...baseTransaction,
        date: startDate.toISOString(),
      });
    }

    onAdd(newTransactions);
    setDescription("");
    setAmount("");
    setCategory("");
    setPaymentMethod("");
    setDate(new Date().toISOString().split("T")[0]);
    setIsRecurring(false);
    setRecurringUntil("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 gradient-primary border-0 text-primary-foreground font-semibold shadow-md hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Transação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === "expense" ? "default" : "outline"}
              className={type === "expense" ? "flex-1 bg-expense text-primary-foreground hover:bg-expense/90" : "flex-1"}
              onClick={() => { setType("expense"); setCategory(""); }}
            >
              Despesa
            </Button>
            <Button
              type="button"
              variant={type === "income" ? "default" : "outline"}
              className={type === "income" ? "flex-1 gradient-primary text-primary-foreground hover:opacity-90" : "flex-1"}
              onClick={() => { setType("income"); setCategory(""); }}
            >
              Receita
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Supermercado" maxLength={100} required />
          </div>

          <div className="space-y-2">
            <Label>Valor (R$)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00" min="0.01" step="0.01" required />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {currentCategories.map((c) => {
                  const custom = customCategories.find(cc => cc.name === c);
                  const iconName = custom ? custom.icon : DEFAULT_CATEGORY_ICON_MAP[c];
                  const Icon = getIconComponent(iconName);
                  return (
                    <SelectItem key={c} value={c}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span>{c}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
            <div className="space-y-2 animate-in fade-in duration-200">
              <Label>{type === "expense" ? "Forma de Pagamento" : "Conta de Destino"}</Label>
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)} required>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          {type === "expense" && (
            <NotificationToggle 
              variant="switch" 
              active={emailNotificationActive} 
              onToggle={() => setEmailNotificationActive(!emailNotificationActive)} 
            />
          )}

          <div className="flex flex-col gap-3 p-3 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="recurring" className="cursor-pointer">Lançamento Recorrente</Label>
              </div>
              <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
            </div>
            
            {isRecurring && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <Label>Repetir mensalmente até</Label>
                <Input 
                  type="date" 
                  value={recurringUntil} 
                  onChange={(e) => setRecurringUntil(e.target.value)} 
                  min={date}
                  required={isRecurring}
                />
                <p className="text-[10px] text-muted-foreground">
                  Uma transação será criada para cada mês neste período.
                </p>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold hover:opacity-90">
            Adicionar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
