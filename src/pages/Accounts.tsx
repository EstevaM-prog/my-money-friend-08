import { useState } from "react";
import { CreditCard, Building2, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AccountType = "checking" | "savings" | "credit" | "investment";

interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  institution: string;
  color: string;
}

const TYPE_LABELS: Record<AccountType, string> = {
  checking: "Conta Corrente",
  savings: "Poupança",
  credit: "Cartão de Crédito",
  investment: "Investimento",
};

const TYPE_COLORS: Record<AccountType, string> = {
  checking: "bg-primary/10 text-primary",
  savings: "bg-accent text-accent-foreground",
  credit: "bg-destructive/10 text-destructive",
  investment: "bg-balance/10 text-balance",
};

const CARD_COLORS = [
  "from-primary to-primary/70",
  "from-balance to-balance/70",
  "from-destructive to-destructive/70",
  "from-warning to-warning/70",
  "from-muted-foreground to-muted-foreground/70",
];

const INITIAL_ACCOUNTS: Account[] = [
  { id: "1", name: "Nubank", type: "checking", balance: 4580.32, institution: "Nu Pagamentos", color: CARD_COLORS[0] },
  { id: "2", name: "Itaú Poupança", type: "savings", balance: 12300.00, institution: "Itaú Unibanco", color: CARD_COLORS[1] },
  { id: "3", name: "Visa Platinum", type: "credit", balance: -2150.80, institution: "Bradesco", color: CARD_COLORS[2] },
  { id: "4", name: "XP Investimentos", type: "investment", balance: 35420.15, institution: "XP Inc", color: CARD_COLORS[3] },
];

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [showBalances, setShowBalances] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("checking");
  const [balance, setBalance] = useState("");
  const [institution, setInstitution] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !institution) return;
    setAccounts((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name,
        type,
        balance: parseFloat(balance || "0"),
        institution,
        color: CARD_COLORS[prev.length % CARD_COLORS.length],
      },
    ]);
    setName(""); setBalance(""); setInstitution(""); setType("checking");
    setOpen(false);
  }

  const totalPositive = accounts.filter((a) => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalDebt = accounts.filter((a) => a.balance < 0).reduce((s, a) => s + a.balance, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl gradient-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Contas e Cartões</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setShowBalances(!showBalances)}>
            {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-primary border-0 text-primary-foreground font-semibold">
                <Plus className="h-4 w-4" /> Nova Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Conta</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Nubank" required />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={type} onValueChange={(v) => setType(v as AccountType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(TYPE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Saldo atual (R$)</Label>
                  <Input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label>Instituição</Label>
                  <Input value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Ex: Nu Pagamentos" required />
                </div>
                <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold">Adicionar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 card-shadow">
          <p className="text-sm text-muted-foreground font-medium">Patrimônio Total</p>
          <p className="text-2xl font-bold mt-1 text-primary">
            {showBalances ? fmt(totalPositive + totalDebt) : "••••••"}
          </p>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow">
          <p className="text-sm text-muted-foreground font-medium">Saldo Positivo</p>
          <p className="text-2xl font-bold mt-1 text-primary">
            {showBalances ? fmt(totalPositive) : "••••••"}
          </p>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow">
          <p className="text-sm text-muted-foreground font-medium">Dívidas</p>
          <p className="text-2xl font-bold mt-1 text-destructive">
            {showBalances ? fmt(Math.abs(totalDebt)) : "••••••"}
          </p>
        </div>
      </div>

      {/* Account cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <div key={account.id} className={`rounded-xl p-5 text-primary-foreground bg-gradient-to-br ${account.color} relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm opacity-80">{account.institution}</p>
                <h3 className="text-lg font-bold mt-1">{account.name}</h3>
                <Badge className={`mt-2 ${TYPE_COLORS[account.type]} border-0`}>
                  {TYPE_LABELS[account.type]}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="h-8 w-8 opacity-60" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10"
                  onClick={() => setAccounts((prev) => prev.filter((a) => a.id !== account.id))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-2xl font-bold mt-4 relative z-10">
              {showBalances ? fmt(account.balance) : "R$ ••••••"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
