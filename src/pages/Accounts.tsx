import { useState, useMemo } from "react";
import { 
  CreditCard, 
  Building2, 
  Plus, 
  Trash2, 
  Wallet,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Landmark,
  PiggyBank,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Account, AccountType } from "@/lib/finance-data";
import { useFinance } from "@/hooks/use-finance";
import { usePrivacy } from "@/hooks/use-privacy";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<AccountType, string> = {
  checking: "Conta Corrente",
  savings: "Poupança",
  credit: "Cartão de Crédito",
  debit: "Cartão de Débito",
  investment: "Carteira de Investimento",
};

const TYPE_ICONS: Record<AccountType, any> = {
  checking: Landmark,
  savings: PiggyBank,
  credit: CreditCard,
  debit: Wallet,
  investment: Briefcase,
};

// Premium Gradients for Cards
const PREMIUM_CARD_GRADIENTS = [
  "from-[#0f172a] via-[#1e293b] to-[#334155]", // Obsidian
  "from-[#3b0764] via-[#581c87] to-[#7e22ce]", // Deep Purple
  "from-[#064e3b] via-[#047857] to-[#059669]", // Emerald
  "from-[#7f1d1d] via-[#991b1b] to-[#b91c1c]", // Crimson
  "from-[#172554] via-[#1e3a8a] to-[#1d4ed8]", // Sapphire
  "from-[#451a03] via-[#78350f] to-[#b45309]", // Bronze
];

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function Accounts() {
  const { accounts, setAccounts } = useFinance();
  const { isPrivate } = usePrivacy();
  const [open, setOpen] = useState(false);
  
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("checking");
  const [balance, setBalance] = useState("");
  const [institution, setInstitution] = useState("");
  const [color, setColor] = useState(PREMIUM_CARD_GRADIENTS[0]);

  const resetForm = () => {
    setName(""); setBalance(""); setInstitution(""); setType("checking"); setColor(PREMIUM_CARD_GRADIENTS[0]);
  };

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
        color,
      },
    ]);
    resetForm();
    setOpen(false);
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const totalPositive = useMemo(() => accounts.filter((a) => a.balance > 0).reduce((s, a) => s + a.balance, 0), [accounts]);
  const totalDebt = useMemo(() => accounts.filter((a) => a.balance < 0).reduce((s, a) => s + a.balance, 0), [accounts]);
  const netWorth = totalPositive + totalDebt;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 font-bold uppercase tracking-widest text-[10px]">
            <Sparkles className="h-3.5 w-3.5" />
            Portfólio Financeiro
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-outfit">Contas e Cartões</h1>
          <p className="text-muted-foreground font-medium text-sm max-w-lg">
            Gerencie todas as suas instituições financeiras em um único painel. Controle saldos e limites de forma consolidada e segura.
          </p>
        </div>

        <Dialog 
          open={open} 
          onOpenChange={(v) => {
            if(!v) resetForm();
            setOpen(v);
          }}
        >
          <DialogTrigger asChild>
            <Button 
              className="h-10 px-5 gap-2 bg-white/10 hover:bg-white/20 text-white font-bold tracking-wide rounded-xl border border-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4" /> Adicionar Conta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#080810]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-0 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-20 blur-[100px] pointer-events-none transition-colors duration-500 bg-indigo-500" />
            <div className="p-6 relative z-10">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-black text-white text-center flex items-center justify-center gap-2">
                  <Wallet className="h-6 w-6 text-white/50" />
                  Vincular Instituição
                </DialogTitle>
                <p className="text-xs text-white/50 font-medium text-center mt-1">Cadastre um novo banco, carteira ou cartão para monitoramento.</p>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-5">
                
                <div className="space-y-2">
                  <Label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">Apelido da Conta</Label>
                  <div className="relative group">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Ex: Nubank Principal..." 
                      maxLength={100}
                      required 
                      className="h-12 pl-11 bg-white/[0.02] border border-white/10 rounded-2xl text-white text-sm font-semibold focus:border-white/30 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">Instituição</Label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input 
                        value={institution} 
                        onChange={(e) => setInstitution(e.target.value)} 
                        placeholder="Ex: Nu Pagamentos" 
                        required 
                        className="h-14 pl-11 pr-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white font-semibold placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all focus:bg-white/[0.04]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">Saldo ou Fatura</Label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-indigo-500">R$</span>
                      <Input 
                        type="number" 
                        value={balance} 
                        onChange={(e) => setBalance(e.target.value)} 
                        step="0.01" 
                        placeholder="0.00"
                        className="h-14 pl-12 pr-4 text-xl font-black bg-white/[0.02] border border-white/10 rounded-2xl text-white transition-all focus:border-indigo-500/50 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">Modalidade</Label>
                    <Select value={type} onValueChange={(v) => setType(v as AccountType)}>
                      <SelectTrigger className="h-12 bg-white/[0.02] border border-white/10 rounded-xl text-white font-semibold focus:ring-1 focus:border-white/30 truncate">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A0B10] border-white/10 text-white rounded-xl">
                        {Object.entries(TYPE_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k} className="focus:bg-white/10 rounded-lg cursor-pointer">
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">Cor Base</Label>
                    <div className="flex flex-wrap gap-2 p-2 bg-white/[0.02] border border-white/10 rounded-xl justify-center">
                      {PREMIUM_CARD_GRADIENTS.map((g) => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => setColor(g)}
                          className={cn("w-6 h-6 rounded-md border-2 transition-all bg-gradient-to-br shadow-inner", g, color === g ? "border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "border-transparent opacity-50 hover:opacity-100")}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl text-white font-black text-base shadow-xl transition-all transform active:scale-[0.98] bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] mt-2"
                >
                  Efetivar Vínculo
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ─── Hero Summary ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Ativos em Caixa", value: totalPositive, color: "text-emerald-500", glow: "bg-emerald-500/10", border: 'hover:border-emerald-500/50', icon: TrendingUp },
          { label: "Faturas e Passivos", value: totalDebt, color: "text-rose-500", glow: "bg-rose-500/10", border: 'hover:border-rose-500/50', icon: TrendingDown },
          { label: "Patrimônio Líquido", value: netWorth, color: netWorth >= 0 ? "text-indigo-500" : "text-rose-500", glow: netWorth >= 0 ? "bg-indigo-500/10" : "bg-rose-500/10", border: 'hover:border-indigo-500/50', icon: Wallet }
        ].map((stat, i) => (
          <div key={i} className={cn("group p-6 rounded-[2rem] bg-card/40 backdrop-blur-md border border-border/40 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden", stat.border)}>
            <div className={`absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${stat.color}`}>
               <stat.icon className="h-24 w-24 -mt-10 -mr-10" />
            </div>
            <div className="flex flex-col gap-2 relative z-10">
              <div className="flex items-center gap-2">
                 <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border border-border/50 shadow-inner", stat.glow)}>
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                 </div>
                 <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </div>
              <p className={cn("text-3xl font-black font-outfit tracking-tighter mt-2", stat.color)}>
                {isPrivate ? "••••••" : fmt(stat.value)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Cards Grid ─── */}
      {accounts.length === 0 ? (
        <div className="py-20 px-6 flex flex-col items-center justify-center text-center rounded-[2rem] border border-border/40 border-dashed bg-card/20 text-muted-foreground">
          <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
            <Building2 className="h-10 w-10 opacity-40" />
          </div>
          <p className="text-lg font-bold text-foreground">Sua carteira de instituições está vazia.</p>
          <p className="text-sm font-medium mt-1 max-w-sm">
            Adicione seus bancos diários, contas de corretora ou cartões de crédito para iniciar seu monitoramento patrimonial.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => {
            const IconComponent = TYPE_ICONS[account.type] || Building2;
            const isNegative = account.balance < 0;

            return (
              <div 
                key={account.id} 
                className={cn(
                  "p-6 h-[200px] rounded-[2rem] text-white flex flex-col justify-between relative overflow-hidden group shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-br",
                  account.color
                )}
              >
                {/* Visual Flair: Credit Card Chip & Glows */}
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_20%,rgba(255,255,255,0.05)_50%,transparent_80%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 blur-[50px] rounded-full pointer-events-none" />
                
                <div className="flex justify-between items-start relative z-10 w-full">
                  <div className="space-y-1 w-full pr-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-white/10 backdrop-blur-sm border border-white/20">
                         <IconComponent className="h-4 w-4 text-white/90" />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 truncate">
                        {TYPE_LABELS[account.type]}
                      </p>
                    </div>
                    <h3 className="text-lg font-bold font-outfit tracking-tight leading-tight pt-1 truncate max-w-full">
                      {account.name}
                    </h3>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full border border-white/10 bg-black/10 hover:bg-black/30 hover:text-white text-white/50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    onClick={(e) => handleDelete(account.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="relative z-10 w-full flex flex-col justify-end space-y-1">
                   <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">{account.institution}</p>
                   <div className="flex items-end justify-between">
                     <p className={cn(
                        "text-3xl font-black font-outfit tracking-tight truncate",
                        isNegative ? "text-white/90" : "text-white"
                     )}>
                       {isPrivate ? "••••••••" : fmt(Math.abs(account.balance))}
                     </p>
                     
                     {/* For Credit cards that have negative balances, we show an alert inside the card */}
                     {isNegative && (
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-black/20 backdrop-blur-sm text-white/80 border border-white/10 mb-1 ml-2 shrink-0">
                           A PAGAR
                        </span>
                     )}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
