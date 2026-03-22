import { useState, useMemo, useEffect } from "react";
import { useFinance } from "@/hooks/use-finance";
import { BudgetRule, CardCeiling, EXPENSE_CATEGORIES, CATEGORY_COLORS } from "@/lib/finance-data";
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
    <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all duration-700", danger && "animate-pulse")}
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
          msg: `⚠️ Já usou ${(ratio * 100).toFixed(0)}% da rezerva de "${rule.label}": ${fmt(used)} de ${fmt(limit)}. Faltam ${fmt(limit - used)}.`,
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

  // Trigger toast for new danger/warn once on mount
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* ─── Header ─── */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl gradient-primary">
          <Sliders className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Planejamento Estratégico</h1>
          <p className="text-sm text-muted-foreground">Defina sua estratégia de orçamento e teto de gastos por cartão</p>
        </div>
      </div>

      {/* ─── Notifications ─── */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.key}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl text-sm border",
                n.level === "danger"
                  ? "bg-destructive/10 border-destructive/30 text-destructive"
                  : "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400"
              )}
            >
              <TriangleAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <p>{n.msg}</p>
            </div>
          ))}
        </div>
      )}

      {/* ─── Budget Strategy Section ─── */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <Target className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Estratégia de Orçamento</h2>
              <p className="text-xs text-muted-foreground">Ex: Regra 50/30/20. A soma deve ser exatamente 100%.</p>
            </div>
          </div>
          <div className={cn(
            "text-sm font-bold px-3 py-1 rounded-full",
            isValid ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
          )}>
            {totalPct.toFixed(0)}% / 100%
          </div>
        </div>

        {/* Rule bars preview */}
        <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
          {rules.map((r) => (
            <div
              key={r.id}
              title={`${r.label}: ${r.percentage}%`}
              style={{ width: `${r.percentage}%`, backgroundColor: r.color }}
              className="transition-all duration-500 first:rounded-l-full last:rounded-r-full"
            />
          ))}
        </div>

        {/* Rules list */}
        <div className="space-y-3">
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
                  "border rounded-2xl p-4 space-y-3 transition-all",
                  isDanger ? "border-destructive/40 bg-destructive/5" : "border-border bg-card/40"
                )}
              >
                {/* Header row */}
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: rule.color }} />
                  {isEditing ? (
                    <Input
                      className="h-7 text-sm w-40"
                      value={rule.label}
                      onChange={(e) => updateRule(rule.id, "label", e.target.value)}
                    />
                  ) : (
                    <span className="font-semibold text-sm flex-1">{rule.label}</span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {isDanger ? (
                      <span className="text-destructive font-bold flex items-center gap-1">
                        <TriangleAlert className="h-3 w-3" /> Excedido
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-3 w-3" /> OK
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => setEditingRuleId(isEditing ? null : rule.id)}
                    className="p-1 rounded-md hover:bg-muted text-muted-foreground"
                  >
                    {isEditing ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Editing panel */}
                {isEditing && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="space-y-1">
                      <Label className="text-xs">Categoria vinculada</Label>
                      <Select
                        value={rule.category}
                        onValueChange={(v) => updateRule(rule.id, "category", v)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPENSE_CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Porcentagem (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        className="h-8 text-xs"
                        value={rule.percentage}
                        onChange={(e) => updateRule(rule.id, "percentage", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Cor</Label>
                      <div className="flex gap-1.5 flex-wrap">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => updateRule(rule.id, "color", c)}
                            className={cn(
                              "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                              rule.color === c ? "border-foreground scale-110" : "border-transparent"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{fmt(catUsed)} gastos</span>
                    <span>{rule.percentage}% → teto estimado {catLimit > 0 ? fmt(catLimit) : "—"}</span>
                  </div>
                  <ProgressBar value={ratio} color={rule.color} danger={isDanger} />
                  <p className="text-[11px] text-muted-foreground text-right">
                    {ratio.toFixed(0)}% utilizado
                    {!isDanger && catLimit > 0 && ` · Faltam ${fmt(catLimit - catUsed)}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={addRule} className="gap-1.5">
            <Plus className="h-4 w-4" /> Adicionar Regra
          </Button>
          <Button size="sm" onClick={handleSaveStrategy} className="gradient-primary text-white gap-1.5" disabled={!isValid}>
            <CheckCircle2 className="h-4 w-4" /> Salvar Estratégia
          </Button>
        </div>
      </section>

      {/* ─── Card Ceilings ─── */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-pink-500/10">
            <CreditCard className="h-5 w-5 text-pink-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Teto de Gastos por Cartão</h2>
            <p className="text-xs text-muted-foreground">Defina limites de alerta individuais para seus cartões de crédito</p>
          </div>
        </div>

        {creditCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
            <CreditCard className="h-8 w-8 opacity-30" />
            <p className="text-sm">Nenhum cartão de crédito cadastrado.</p>
            <p className="text-xs">Adicione um em <strong>Contas</strong> para configurar tetos.</p>
          </div>
        ) : (
          <div className="space-y-4">
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
                    "border rounded-2xl p-5 space-y-4",
                    isDanger ? "border-destructive/40 bg-destructive/5" : "border-border bg-card/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: card.color }} />
                    <span className="font-semibold text-sm">{card.name}</span>
                    <span className="text-xs text-muted-foreground">{card.institution}</span>
                    {isDanger && (
                      <span className="ml-auto text-xs font-bold text-destructive flex items-center gap-1">
                        <TriangleAlert className="h-3 w-3" /> Teto excedido
                      </span>
                    )}
                    {!isDanger && isWarn && (
                      <span className="ml-auto text-xs font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                        <TriangleAlert className="h-3 w-3" /> Próximo do limite
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Teto de Gasto (R$)</Label>
                      <Input
                        type="number"
                        min={0}
                        className="h-8 text-xs"
                        value={c.limit || ""}
                        placeholder="Ex: 2000"
                        onChange={(e) => patchCeiling(card.id, "limit", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Alertar em (%)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        className="h-8 text-xs"
                        value={c.alertAt}
                        onChange={(e) => patchCeiling(card.id, "alertAt", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Notificações</Label>
                      <div className="flex items-center gap-2 pt-1">
                        <Switch
                          checked={c.notifyEnabled}
                          onCheckedChange={(v) => patchCeiling(card.id, "notifyEnabled", v)}
                        />
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          {c.notifyEnabled ? <Bell className="h-3 w-3" /> : <BellOff className="h-3 w-3" />}
                          {c.notifyEnabled ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Usage bar */}
                  {c.limit > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" /> {fmt(spent)} gastos este mês
                        </span>
                        <span>Teto: {fmt(c.limit)}</span>
                      </div>
                      <ProgressBar value={ratio} color={card.color} danger={isDanger} />
                      <p className="text-[11px] text-muted-foreground text-right">
                        {ratio.toFixed(0)}% · {isDanger ? `Excedeu em ${fmt(spent - c.limit)}` : `Faltam ${fmt(c.limit - spent)}`}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      disabled={!isDirty}
                      onClick={() => saveCeiling(card.id)}
                      className="gradient-primary text-white text-xs gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Salvar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-destructive hover:bg-destructive/10 gap-1.5"
                      onClick={() => deleteCardCeiling(card.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remover Teto
                    </Button>
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
