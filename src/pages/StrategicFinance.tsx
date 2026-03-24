import { useState, useMemo, useEffect } from "react";
import { useFinance } from "@/hooks/use-finance";
import { BudgetRule, CardCeiling, EXPENSE_CATEGORIES } from "@/lib/finance-data";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Target,
  CreditCard,
  Bell,
  BellOff,
  Plus,
  Trash2,
  TriangleAlert,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  Sliders,
  Sparkles,
  PieChart
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const PRESET_COLORS = [
  "#6366f1", "#ec4899", "#10b981", "#f97316",
  "#3b82f6", "#8b5cf6", "#eab308", "#ef4444",
];
function fmt(v: number) {
  return `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}
function pct(used: number, limit: number) {
  if (limit <= 0) return 0;
  return Math.min((used / limit) * 100, 100);
}

// ─────────────────────────────────────────────
// Progress Bar
// ─────────────────────────────────────────────
function ProgressBar({ value, color, danger }: { value: number; color: string; danger: boolean }) {
  return (
    <div className="w-full h-2.5 rounded-full bg-secondary/50 overflow-hidden border border-border/50 relative">
      {/* Glow Effect */}
      <div 
         className="absolute inset-y-0 left-0 w-full opacity-20 blur-sm mix-blend-screen pointer-events-none"
         style={{ backgroundColor: danger ? "#ef4444" : color }}
      />
      <div
        className={cn("h-full rounded-full transition-all duration-1000 ease-out relative z-10", danger && "animate-pulse")}
        style={{
          width: `${value}%`,
          backgroundColor: danger ? "#ef4444" : color,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function StrategicFinance() {
  const { toast } = useToast();
  const {
    transactions,
    accounts,
    budgetRules,
    saveBudgetRules,
    cardCeilings,
    saveCardCeiling,
    deleteCardCeiling,
  } = useFinance();

  // ── Budget Strategy ──────────────────────────
  const [rules, setRules] = useState<BudgetRule[]>(budgetRules);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  const totalPct = rules.reduce((s, r) => s + Number(r.percentage), 0);
  const isValid = Math.abs(totalPct - 100) < 0.01;

  function addRule() {
    const newRule: BudgetRule = {
      id: String(Date.now()),
      label: "Nova Regra",
      category: EXPENSE_CATEGORIES[0],
      percentage: 0,
      color: PRESET_COLORS[rules.length % PRESET_COLORS.length],
    };
    setRules((prev) => [...prev, newRule]);
    setEditingRuleId(newRule.id);
  }

  function updateRule(id: string, field: keyof BudgetRule, value: string | number) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }

  function removeRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  function handleSaveStrategy() {
    if (!isValid) {
      toast({ title: "Soma inválida", description: `A soma atual é ${totalPct.toFixed(0)}%. Ajuste para 100%.`, variant: "destructive" });
      return;
    }
    saveBudgetRules(rules);
    toast({ title: "Estratégia salva!", description: "Sua distribuição foi atualizada." });
  }

  // ── Card Ceilings ───────────────────────────
  const [ceilingEdit, setCeilingEdit] = useState<Record<string, Partial<CardCeiling>>>({});

  const creditCards = useMemo(
    () => accounts.filter((a) => a.type === "credit"),
    [accounts]
  );

  function getCeiling(accId: string): CardCeiling {
    const saved = cardCeilings.find((c) => c.accountId === accId);
    return ceilingEdit[accId]
      ? { accountId: accId, limit: 0, alertAt: 80, notifyEnabled: true, ...saved, ...ceilingEdit[accId] }
      : saved ?? { accountId: accId, limit: 0, alertAt: 80, notifyEnabled: true };
  }

  function patchCeiling(accId: string, field: keyof CardCeiling, value: number | boolean) {
    setCeilingEdit((prev) => ({
      ...prev,
      [accId]: { ...prev[accId], [field]: value },
    }));
  }

  function saveCeiling(accId: string) {
    const c = getCeiling(accId);
    saveCardCeiling(c);
    setCeilingEdit((prev) => { const n = { ...prev }; delete n[accId]; return n; });
    toast({ title: "Teto salvo!", description: `Configuração atualizada para ${accounts.find(a => a.id === accId)?.name}.` });
  }

  // ── Spending stats for current month ────────
  const monthNow = new Date();
  const monthStart = startOfMonth(monthNow);
  const monthEnd = endOfMonth(monthNow);

  const monthlyExpenses = useMemo(() =>
    transactions.filter(
      (t) => t.type === "expense" && isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
    ),
    [transactions, monthStart, monthEnd]
  );

  const totalMonthExpense = monthlyExpenses.reduce((s, t) => s + t.amount, 0);

  // category spending map
  const catSpending = useMemo(() => {
    const map: Record<string, number> = {};
    monthlyExpenses.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return map;
  }, [monthlyExpenses]);

  // card spending map (by accountId from linked transactions)
  const cardSpending = useMemo(() => {
    const map: Record<string, number> = {};
    monthlyExpenses.forEach((t) => {
      if (t.accountId) map[t.accountId] = (map[t.accountId] || 0) + t.amount;
    });
    return map;
  }, [monthlyExpenses]);

  // ── Smart Notifications ─────────────────────
  const notifications = useMemo(() => {
    const msgs: { key: string; msg: string; level: "warn" | "danger" }[] = [];

    // budget category alerts
    rules.forEach((rule) => {
      const limit = (rule.percentage / 100) * totalMonthExpense;
      const used = catSpending[rule.category] || 0;
      const ratio = limit > 0 ? used / limit : 0;
      if (ratio >= 1) {
        msgs.push({
          key: `cat-${rule.id}`,
          msg: `🚨 Limite excedido em "${rule.label}" — gastou ${fmt(used)} de ${fmt(limit)} (${(ratio * 100).toFixed(0)}%)`,
          level: "danger",
        });
      } else if (ratio >= 0.8) {
        msgs.push({
          key: `cat-${rule.id}`,
          msg: `⚠️ Já usou ${(ratio * 100).toFixed(0)}% da reserva de "${rule.label}": ${fmt(used)} de ${fmt(limit)}. Faltam ${fmt(limit - used)}.`,
          level: "warn",
        });
      }
    });

    // card ceiling alerts
    cardCeilings.filter((c) => c.notifyEnabled && c.limit > 0).forEach((c) => {
      const used = cardSpending[c.accountId] || 0;
      const ratio = used / c.limit;
      const accName = accounts.find((a) => a.id === c.accountId)?.name ?? "Cartão";
      if (ratio >= 1) {
        msgs.push({
          key: `card-${c.accountId}`,
          msg: `🚨 Teto excedido em "${accName}" — ${fmt(used)} de ${fmt(c.limit)}`,
          level: "danger",
        });
      } else if (ratio >= c.alertAt / 100) {
        msgs.push({
          key: `card-${c.accountId}`,
          msg: `⚠️ Você já utilizou ${(ratio * 100).toFixed(0)}% do teto de "${accName}" (${fmt(used)} de ${fmt(c.limit)}). Faltam ${fmt(c.limit - used)}.`,
          level: "warn",
        });
      }
    });

    return msgs;
  }, [rules, catSpending, cardCeilings, cardSpending, accounts, totalMonthExpense]);

  useEffect(() => {
    if (notifications.length > 0) {
      notifications.slice(0, 1).forEach((n) => {
        toast({
          title: n.level === "danger" ? "Limite Excedido!" : "Atenção ao orçamento",
          description: n.msg,
          variant: n.level === "danger" ? "destructive" : "default",
        });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 font-bold uppercase tracking-widest text-[10px]">
            <Sparkles className="h-3.5 w-3.5" />
            Metodologia Inteligente
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-outfit">Estratégia Financeira</h1>
          <p className="text-muted-foreground font-medium text-sm max-w-lg">
            Defina sua distribuição ideal de orçamento (ex: 50-30-20) e configure tetos de limite blindados para seus cartões de crédito.
          </p>
        </div>
      </div>

      {/* ─── Notifications ─── */}
      {notifications.length > 0 && (
        <div className="space-y-3 animate-in zoom-in-95 duration-500">
          {notifications.map((n) => (
            <div
              key={n.key}
              className={cn(
                "flex items-start gap-4 p-5 rounded-2xl text-sm border shadow-sm backdrop-blur-md relative overflow-hidden",
                n.level === "danger"
                  ? "bg-destructive/10 border-destructive/20 text-destructive"
                  : "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400"
              )}
            >
              <div className={cn(
                "absolute -left-10 -top-10 w-20 h-20 rounded-full blur-[30px] opacity-20 pointer-events-none",
                n.level === "danger" ? "bg-destructive" : "bg-yellow-500"
              )} />
              
              <div className={cn(
                "h-8 w-8 rounded-full border shrink-0 flex items-center justify-center -translate-y-0.5",
                n.level === "danger" ? "bg-destructive/20 border-destructive/30" : "bg-yellow-500/20 border-yellow-500/30"
              )}>
                 <TriangleAlert className="h-4 w-4" />
              </div>
              <p className="font-semibold pt-1.5 leading-relaxed relative z-10">{n.msg}</p>
            </div>
          ))}
        </div>
      )}

      {/* ─── Budget Strategy Section ─── */}
      <section className="bg-card/40 backdrop-blur-md border border-border/40 p-6 sm:p-10 rounded-[2rem] shadow-sm space-y-8 relative overflow-hidden group hover:border-border/80 transition-colors">
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-inner">
              <Target className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-xl font-black font-outfit tracking-tight">Distribuição Alvo do Orçamento</h2>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">Defina quanto do seu dinheiro suado vai para cada área.</p>
            </div>
          </div>
          <div className={cn(
            "text-base font-black px-4 py-1.5 rounded-full border shadow-sm transition-colors",
            isValid ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
          )}>
            {totalPct.toFixed(0)}% / 100%
          </div>
        </div>

        {/* Rule bars preview */}
        <div className="flex h-3 rounded-full overflow-hidden border border-border/50 bg-muted/50 shadow-inner">
          {rules.length === 0 && <div className="w-full bg-secondary" />}
          {rules.map((r) => (
            <div
              key={r.id}
              title={`${r.label}: ${r.percentage}%`}
              style={{ width: `${r.percentage}%`, backgroundColor: r.color }}
              className="transition-all duration-1000 origin-left ease-out hover:brightness-125"
            />
          ))}
        </div>

        {/* Rules list */}
        <div className="space-y-4">
          {rules.map((rule) => {
            const catUsed = catSpending[rule.category] || 0;
            const catLimit = (rule.percentage / 100) * totalMonthExpense;
            const ratio = pct(catUsed, catLimit);
            const isDanger = catUsed > catLimit && catLimit > 0;
            const isEditing = editingRuleId === rule.id;

            return (
              <div
                key={rule.id}
                className={cn(
                  "border rounded-2xl p-5 space-y-4 transition-all duration-300 relative overflow-hidden",
                  isDanger ? "border-destructive/40 bg-destructive/5 shadow-inner" : "border-border/60 bg-card/60 hover:bg-card/80 shadow-sm"
                )}
              >
                {/* Header row */}
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-4 h-4 rounded-full border border-border/50 shadow-inner shrink-0" style={{ backgroundColor: rule.color }} />
                  {isEditing ? (
                    <Input
                      className="h-9 text-sm font-bold w-48 bg-background/50 rounded-xl"
                      value={rule.label}
                      onChange={(e) => updateRule(rule.id, "label", e.target.value)}
                    />
                  ) : (
                    <span className="font-bold text-base flex-1">{rule.label}</span>
                  )}
                  <span className="text-xs font-bold text-muted-foreground ml-auto hidden sm:flex">
                    {isDanger ? (
                      <span className="text-destructive flex items-center gap-1.5 uppercase tracking-widest bg-destructive/10 px-2 py-1 rounded-md">
                        <TriangleAlert className="h-3.5 w-3.5" /> Excedido
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-green-600 bg-green-500/10 px-2 py-1 rounded-md uppercase tracking-widest">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Dentro do limite
                      </span>
                    )}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingRuleId(isEditing ? null : rule.id)}
                      className="h-8 w-8 rounded-xl flex items-center justify-center bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                    >
                      {isEditing ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => removeRule(rule.id)}
                      className="h-8 w-8 rounded-xl flex items-center justify-center bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Editing panel */}
                {isEditing && (
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_150px] gap-6 pt-4 border-t border-border/40 relative z-10">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Categoria Monitorada</Label>
                      <Select
                        value={rule.category}
                        onValueChange={(v) => updateRule(rule.id, "category", v)}
                      >
                        <SelectTrigger className="h-10 text-sm font-semibold rounded-xl bg-background/40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {EXPENSE_CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c} className="font-medium text-sm">{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Peso (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        className="h-10 text-sm font-black rounded-xl bg-background/40"
                        value={rule.percentage}
                        onChange={(e) => updateRule(rule.id, "percentage", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cor Tema</Label>
                      <div className="flex gap-2 flex-wrap">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => updateRule(rule.id, "color", c)}
                            className={cn(
                              "w-7 h-7 rounded-full border-2 transition-all hover:scale-110 shadow-inner",
                              rule.color === c ? "border-foreground scale-110 shadow-black ring-2 ring-primary/30" : "border-transparent opacity-60"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress */}
                <div className="space-y-2 pt-2 relative z-10">
                  <div className="flex justify-between text-[13px] font-bold text-muted-foreground">
                    <span className="flex items-center gap-1.5 text-foreground"><PieChart className="h-4 w-4" /> Consumido: {fmt(catUsed)}</span>
                    <span>Teto Estipulado: {catLimit > 0 ? fmt(catLimit) : "—"}</span>
                  </div>
                  <ProgressBar value={ratio} color={rule.color} danger={isDanger} />
                  <p className="text-xs font-medium text-muted-foreground text-right pt-1">
                    <strong className={isDanger ? "text-destructive" : "text-foreground"}>{ratio.toFixed(1)}% utilizado</strong>
                    {!isDanger && catLimit > 0 && ` · Restam ${fmt(catLimit - catUsed)}`}
                  </p>
                </div>
              </div>
            );
          })}

          {rules.length === 0 && (
            <div className="text-center py-10 opacity-50 border border-dashed rounded-2xl border-border/50">
               <p className="font-semibold text-sm">Nenhuma regra definida. Adicione sua primeira distribuição.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/40">
          <Button variant="outline" onClick={addRule} className="h-12 rounded-xl font-bold bg-secondary/50 border-0 hover:bg-secondary gap-2">
            <Plus className="h-4 w-4" /> Mais uma divisão
          </Button>
          <Button 
             onClick={handleSaveStrategy} 
             disabled={!isValid}
             className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs gap-2 shadow-lg shadow-indigo-500/20 w-full sm:w-auto"
          >
            <CheckCircle2 className="h-5 w-5" /> Consolidar Plano
          </Button>
        </div>
      </section>

      {/* ─── Card Ceilings ─── */}
      <section className="bg-card/40 backdrop-blur-md border border-border/40 p-6 sm:p-10 rounded-[2rem] shadow-sm space-y-8 relative overflow-hidden group hover:border-border/80 transition-colors">
        
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 shadow-inner">
            <CreditCard className="h-6 w-6 text-rose-500" />
          </div>
          <div>
            <h2 className="text-xl font-black font-outfit tracking-tight">Travas de Dinheiro de Plástico</h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">Defina gatilhos de alerta de teto independentes do limite do cartão (para evitar rolar faturas).</p>
          </div>
        </div>

        {creditCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3 bg-muted/20 border border-dashed rounded-[2rem]">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center opacity-50">
               <CreditCard className="h-8 w-8" />
            </div>
            <p className="font-semibold">Sua carteira digital não possui cartões de crédito.</p>
            <p className="text-xs">Cadastre um na aba contas para travá-los contra excessos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {creditCards.map((card) => {
              const c = getCeiling(card.id);
              const spent = cardSpending[card.id] || 0;
              const ratio = pct(spent, c.limit);
              const isDanger = c.limit > 0 && spent > c.limit;
              const isWarn = c.limit > 0 && ratio >= c.alertAt;
              const isDirty = !!ceilingEdit[card.id];

              return (
                <div
                  key={card.id}
                  className={cn(
                    "border border-border/60 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 shadow-sm",
                    isDanger ? "bg-destructive/5 border-destructive/30" : "bg-card/60 hover:border-border"
                  )}
                >
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl border border-border/50 shadow-inner flex items-center justify-center" style={{ backgroundColor: `${card.color}20` }}>
                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: card.color }} />
                      </div>
                      <div>
                        <span className="font-bold block tracking-tight">{card.name}</span>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{card.institution}</span>
                      </div>
                    </div>
                    {isDanger ? (
                       <span className="text-[10px] font-black uppercase tracking-widest text-destructive bg-destructive/10 px-2 py-1 rounded-md border border-destructive/20 shadow-sm flex items-center gap-1">
                          <TriangleAlert className="h-3 w-3" /> Excedeu Teto
                       </span>
                    ) : isWarn ? (
                       <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600 bg-yellow-500/10 px-2 py-1 rounded-md border border-yellow-500/20 shadow-sm flex items-center gap-1">
                          <TriangleAlert className="h-3 w-3" /> Em Risco
                       </span>
                    ) : null}
                  </div>

                  <div className="space-y-5 relative z-10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Teto Mensal (R$)</Label>
                        <Input
                          type="number"
                          min={0}
                          className="h-10 text-sm font-black bg-background/50 rounded-xl"
                          value={c.limit || ""}
                          placeholder="Ex: 2000"
                          onChange={(e) => patchCeiling(card.id, "limit", Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Alarme (%)</Label>
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          className="h-10 text-sm font-black bg-background/50 rounded-xl"
                          value={c.alertAt}
                          onChange={(e) => patchCeiling(card.id, "alertAt", Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-background/40 border border-border/50">
                      <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        {c.notifyEnabled ? <Bell className="h-4 w-4 text-foreground" /> : <BellOff className="h-4 w-4 text-foreground opacity-50" />}
                        Notificações de Alarme
                      </Label>
                      <Switch
                        checked={c.notifyEnabled}
                        onCheckedChange={(v) => patchCeiling(card.id, "notifyEnabled", v)}
                      />
                    </div>

                    {/* Usage bar */}
                    {c.limit > 0 && (
                      <div className="space-y-2 pt-2 border-t border-border/40">
                        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                          <span className="flex items-center gap-1 text-foreground">
                            <TrendingDown className="h-3.5 w-3.5 text-rose-500" /> Dispêndio: {fmt(spent)}
                          </span>
                        </div>
                        <ProgressBar value={ratio} color={card.color} danger={isDanger} />
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-3">
                      <Button
                        disabled={!isDirty}
                        onClick={() => saveCeiling(card.id)}
                        className="h-10 flex-1 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold tracking-tight text-xs shadow-md"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1.5" /> Atualizar Trava
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-10 w-10 shrink-0 rounded-xl border-border/50 text-destructive hover:bg-destructive/10"
                        onClick={() => deleteCardCeiling(card.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
