import { useState, useMemo } from "react";
import { getIconComponent, DEFAULT_CATEGORY_ICON_MAP } from "@/lib/icons";
import { toast } from "sonner";
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
import { Plus, Repeat, CreditCard, CalendarDays, Wallet, AlignLeft, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
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
  CATEGORY_COLORS,
} from "@/lib/finance-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useFinance } from "@/hooks/use-finance";
import { cn } from "@/lib/utils";

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
    if (!description.trim() || !amount || !category || !paymentMethod || !date) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    const baseTransaction: Omit<Transaction, "id" | "date"> = {
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category: category as Category,
    };
    
    if (type === "expense") {
      baseTransaction.email_notification_active = emailNotificationActive;
      if (emailNotificationActive) {
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

  const isIncome = type === "income";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 px-5 gap-2 bg-white/10 hover:bg-white/20 text-white font-bold tracking-wide rounded-xl border border-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-105 active:scale-95">
          <Plus className="h-4 w-4" />
          Novo Registro
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] bg-[#080810]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-0 overflow-hidden shadow-2xl">
        {/* Glow */}
        <div className={cn(
          "absolute inset-0 opacity-20 blur-[100px] pointer-events-none transition-colors duration-500",
          isIncome ? "bg-emerald-500" : "bg-rose-500"
        )} />

        <div className="p-6 relative z-10">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black text-white text-center flex items-center justify-center gap-2">
              <Plus className="h-6 w-6 text-white/50" />
              Adicionar Transação
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type Selector */}
            <div className="flex bg-white/[0.03] p-1 rounded-2xl border border-white/[0.05]">
              <button
                type="button"
                onClick={() => { setType("expense"); setCategory(""); }}
                className={cn(
                  "flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all",
                  !isIncome 
                    ? "bg-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)] border border-rose-500/30" 
                    : "text-white/40 hover:text-white/70"
                )}
              >
                <ArrowDownCircle className="h-4 w-4" /> Despesa
              </button>
              <button
                type="button"
                onClick={() => { setType("income"); setCategory(""); }}
                className={cn(
                  "flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all",
                  isIncome 
                    ? "bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] border border-emerald-500/30" 
                    : "text-white/40 hover:text-white/70"
                )}
              >
                <ArrowUpCircle className="h-4 w-4" /> Receita
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">Valor</Label>
              <div className="relative">
                <span className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 font-black text-lg",
                  isIncome ? "text-emerald-500" : "text-rose-500"
                )}>R$</span>
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="0.00" 
                  min="0.01" 
                  step="0.01" 
                  required 
                  className={cn(
                    "h-14 pl-12 text-xl font-black bg-white/[0.02] border border-white/10 rounded-2xl text-white transition-all",
                    isIncome ? "focus:border-emerald-500/50 focus:ring-emerald-500/20" : "focus:border-rose-500/50 focus:ring-rose-500/20"
                  )}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="relative group">
                <AlignLeft className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Descrição da transação..." 
                  maxLength={100} 
                  required 
                  className="h-12 pl-11 bg-white/[0.02] border border-white/10 rounded-2xl text-white text-sm font-semibold focus:border-white/30 focus:bg-white/[0.05] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <Label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1 flex items-center gap-1.5">
                  Categoria
                </Label>
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                  <SelectTrigger className="h-12 bg-white/[0.02] border border-white/10 rounded-xl text-white font-semibold focus:ring-1 focus:border-white/30 truncate">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0B10] border-white/10 text-white rounded-xl">
                    {currentCategories.map((c) => {
                      const custom = customCategories.find(cc => cc.name === c);
                      const iconName = custom ? custom.icon : DEFAULT_CATEGORY_ICON_MAP[c];
                      const Icon = getIconComponent(iconName);
                      const catColor = CATEGORY_COLORS[c] || "#fff";
                      return (
                        <SelectItem key={c} value={c} className="focus:bg-white/10 rounded-lg cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" style={{ color: catColor }} />
                            <span>{c}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">
                  {isIncome ? "Conta/Origem" : "Pagamento"}
                </Label>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)} required>
                  <SelectTrigger className="h-12 bg-white/[0.02] border border-white/10 rounded-xl text-white font-semibold focus:ring-1 focus:border-white/30 truncate">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-white/50" />
                      <SelectValue placeholder="Selecione..." />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0B10] border-white/10 text-white rounded-xl">
                    {paymentMethods.map((p) => (
                      <SelectItem key={p} value={p} className="focus:bg-white/10 rounded-lg cursor-pointer">{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <div className="relative group">
                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required 
                  className="h-12 pl-11 pr-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white font-semibold uppercase tracking-widest text-xs focus:border-white/30 [&::-webkit-calendar-picker-indicator]:invert-[1] [&::-webkit-calendar-picker-indicator]:opacity-50"
                />
              </div>
            </div>

            {/* Options Panel */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-4 space-y-4">
              {!isIncome && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-white/5">
                      <Wallet className="h-4 w-4 text-white/60" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-white uppercase tracking-wider">Aviso de Vencimento</Label>
                      <p className="text-[10px] text-white/40 font-medium">Receber alerta no email cadastrado</p>
                    </div>
                  </div>
                  <NotificationToggle 
                    variant="switch" 
                    active={emailNotificationActive} 
                    onToggle={() => setEmailNotificationActive(!emailNotificationActive)} 
                  />
                </div>
              )}

              {/* Recurring */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-white/5">
                    <Repeat className="h-4 w-4 text-white/60" />
                  </div>
                  <div>
                    <Label className="text-sm font-bold text-white uppercase tracking-wider">Recorrente</Label>
                    <p className="text-[10px] text-white/40 font-medium">Repetir lançamentos</p>
                  </div>
                </div>
                <Switch checked={isRecurring} onCheckedChange={setIsRecurring} className="data-[state=checked]:bg-blue-500" />
              </div>

              {isRecurring && (
                <div className="pt-2 border-t border-white/[0.05] mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <Label className="text-[10px] text-white/40 uppercase tracking-widest mb-2 block">Repetir mensalmente até:</Label>
                  <Input 
                    type="date" 
                    value={recurringUntil} 
                    onChange={(e) => setRecurringUntil(e.target.value)} 
                    min={date}
                    required={isRecurring}
                    className="h-10 bg-white/5 border-white/10 rounded-xl text-white text-xs uppercase tracking-widest [&::-webkit-calendar-picker-indicator]:invert-[1] [&::-webkit-calendar-picker-indicator]:opacity-50 focus:border-blue-500/50"
                  />
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className={cn(
                "w-full h-14 rounded-2xl text-white font-black text-base shadow-xl transition-all transform active:scale-[0.98]",
                isIncome 
                  ? "bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                  : "bg-rose-500 hover:bg-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
              )}
            >
              Confirmar Transação
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
