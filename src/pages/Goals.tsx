import { useState } from "react";
import { Target, Plus, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

const COLORS = ["hsl(160 84% 39%)", "hsl(217 91% 60%)", "hsl(38 92% 50%)", "hsl(280 65% 60%)", "hsl(0 72% 51%)"];

const INITIAL_GOALS: Goal[] = [];

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function Goals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>("financaspro_goals", INITIAL_GOALS);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [deadline, setDeadline] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !target || !deadline) return;
    setGoals((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name,
        target: parseFloat(target),
        current: parseFloat(current || "0"),
        deadline,
        color: COLORS[prev.length % COLORS.length],
      },
    ]);
    setName(""); setTarget(""); setCurrent(""); setDeadline("");
    setOpen(false);
  }

  function handleDelete(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  function handleAddValue(id: string) {
    const value = prompt("Quanto deseja adicionar? (R$)");
    if (!value || isNaN(Number(value))) return;
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, current: Math.min(g.current + Number(value), g.target) } : g
      )
    );
  }

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.current, 0);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl gradient-primary">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Metas Financeiras</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary border-0 text-primary-foreground font-semibold text-sm">
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Nova Meta</span><span className="sm:hidden">Nova</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-w-[calc(100vw-2rem)]">
            <DialogHeader>
              <DialogTitle>Adicionar Meta</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Nome da meta</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Fundo de emergência" required />
              </div>
              <div className="space-y-2">
                <Label>Valor alvo (R$)</Label>
                <Input type="number" value={target} onChange={(e) => setTarget(e.target.value)} min="1" step="0.01" required />
              </div>
              <div className="space-y-2">
                <Label>Valor atual (R$)</Label>
                <Input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} min="0" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label>Prazo</Label>
                <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold">Adicionar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-card rounded-xl p-4 sm:p-5 card-shadow">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Total de Metas</p>
          <p className="text-xl sm:text-2xl font-bold mt-1">{goals.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 sm:p-5 card-shadow">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Total Economizado</p>
          <p className="text-xl sm:text-2xl font-bold mt-1 text-primary">{fmt(totalCurrent)}</p>
        </div>
        <div className="bg-card rounded-xl p-4 sm:p-5 card-shadow">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Total Alvo</p>
          <p className="text-xl sm:text-2xl font-bold mt-1">{fmt(totalTarget)}</p>
        </div>
      </div>

      {/* Goals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {goals.map((goal) => {
          const pct = Math.round((goal.current / goal.target) * 100);
          return (
            <div key={goal.id} className="bg-card rounded-xl p-4 sm:p-5 card-shadow space-y-3 sm:space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg truncate">{goal.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Prazo: {new Date(goal.deadline).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span className="font-medium">{fmt(goal.current)}</span>
                  <span className="text-muted-foreground">{fmt(goal.target)}</span>
                </div>
                <Progress value={pct} className="h-2.5 sm:h-3" />
                <p className="text-xs text-muted-foreground mt-1">{pct}% concluído</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm" onClick={() => handleAddValue(goal.id)}>
                <TrendingUp className="h-3.5 w-3.5" /> Adicionar valor
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
