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

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

const COLORS = ["hsl(160 84% 39%)", "hsl(217 91% 60%)", "hsl(38 92% 50%)", "hsl(280 65% 60%)", "hsl(0 72% 51%)"];

const INITIAL_GOALS: Goal[] = [
  { id: "1", name: "Fundo de emergência", target: 30000, current: 18500, deadline: "2026-12-31", color: COLORS[0] },
  { id: "2", name: "Viagem Europa", target: 15000, current: 4200, deadline: "2027-06-01", color: COLORS[1] },
  { id: "3", name: "Carro novo", target: 80000, current: 22000, deadline: "2028-01-01", color: COLORS[2] },
];

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl gradient-primary">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Metas Financeiras</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary border-0 text-primary-foreground font-semibold">
              <Plus className="h-4 w-4" /> Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 card-shadow">
          <p className="text-sm text-muted-foreground font-medium">Total de Metas</p>
          <p className="text-2xl font-bold mt-1">{goals.length}</p>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow">
          <p className="text-sm text-muted-foreground font-medium">Total Economizado</p>
          <p className="text-2xl font-bold mt-1 text-primary">{fmt(totalCurrent)}</p>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow">
          <p className="text-sm text-muted-foreground font-medium">Total Alvo</p>
          <p className="text-2xl font-bold mt-1">{fmt(totalTarget)}</p>
        </div>
      </div>

      {/* Goals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const pct = Math.round((goal.current / goal.target) * 100);
          return (
            <div key={goal.id} className="bg-card rounded-xl p-5 card-shadow space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{goal.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Prazo: {new Date(goal.deadline).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{fmt(goal.current)}</span>
                  <span className="text-muted-foreground">{fmt(goal.target)}</span>
                </div>
                <Progress value={pct} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">{pct}% concluído</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleAddValue(goal.id)}>
                <TrendingUp className="h-3.5 w-3.5" /> Adicionar valor
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
