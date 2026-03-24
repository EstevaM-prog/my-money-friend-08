import { useState } from "react";
import { Target, Plus, Trash2, TrendingUp, Sparkles, Flag, Rocket, CheckCircle2 } from "lucide-react";
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
import { useFinance } from "@/hooks/use-finance";
import { Goal } from "@/lib/finance-data";
import { cn } from "@/lib/utils";

const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f97316", // Orange
  "#ec4899", // Pink
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
];

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function Goals() {
  const { goals, addGoal, deleteGoal, updateGoalCurrent } = useFinance();
  const [open, setOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [deadline, setDeadline] = useState("");

  const resetForm = () => {
    setName(""); setTarget(""); setCurrent(""); setDeadline("");
  };

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !target || !deadline) return;
    addGoal({
      name,
      target: parseFloat(target),
      current: parseFloat(current || "0"),
      deadline,
      color: COLORS[goals.length % COLORS.length],
    });
    resetForm();
    setOpen(false);
  }

  function handleDelete(id: string) {
    deleteGoal(id);
  }

  function handleAddValue(id: string) {
    const value = prompt("Quanto deseja aportar nesta meta agora? (R$)");
    if (!value || isNaN(Number(value))) return;
    updateGoalCurrent(id, Number(value));
  }

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.current, 0);
  const totalCompletionPct = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold uppercase tracking-widest text-[10px]">
            <Sparkles className="h-3.5 w-3.5" />
            Engenharia de Sonhos
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-outfit">Metas e Acervos</h1>
          <p className="text-muted-foreground font-medium text-sm max-w-lg">
            Guarde dinheiro com propósito. Defina alvos, acompanhe o progresso do seu patrimônio e alcance sua liberdade.
          </p>
        </div>

        <Dialog open={open} onOpenChange={(v) => {
          if (!v) resetForm();
          setOpen(v);
        }}>
          <DialogTrigger asChild>
            <Button 
              className="h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-lg shadow-indigo-500/20 gap-2 transition-all active:scale-95 border-0"
            >
              <Plus className="h-5 w-5" /> Iniciar Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-[2rem] bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl p-6 sm:p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-black font-outfit tracking-tight">Novo Objetivo</DialogTitle>
              <p className="text-sm text-muted-foreground font-medium">Até onde você quer chegar? Defina o norte.</p>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-5">
              
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Códinome do Projeto</Label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Ex: Viagem para o Japão, Macbook M4..." 
                  required 
                  className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-indigo-500 text-base font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Alvo Ouro (R$)</Label>
                  <Input 
                    type="number" 
                    value={target} 
                    onChange={(e) => setTarget(e.target.value)} 
                    min="1" 
                    step="0.01" 
                    placeholder="20000"
                    required 
                    className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-indigo-500 text-base font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Já Guardado</Label>
                  <Input 
                    type="number" 
                    value={current} 
                    onChange={(e) => setCurrent(e.target.value)} 
                    min="0" 
                    step="0.01" 
                    placeholder="0"
                    className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-indigo-500 text-base font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Data de Conquista</Label>
                <div className="relative">
                  <Input 
                    type="date" 
                    value={deadline} 
                    onChange={(e) => setDeadline(e.target.value)} 
                    required 
                    className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-indigo-500 text-base font-semibold [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/20 transition-all border-0 mt-4"
              >
                Travar Objetivo
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ─── Summary Global ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card/40 backdrop-blur-md p-6 rounded-[2rem] border border-border/40 flex flex-col justify-center relative overflow-hidden group shadow-sm">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <Target className="h-24 w-24 -mt-10 -mr-10 text-primary" />
           </div>
           <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 relative z-10">Projetos Ativos</p>
           <p className="text-3xl font-black font-outfit tracking-tighter relative z-10">{goals.length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-900/10 backdrop-blur-md p-6 rounded-[2rem] border border-indigo-500/20 shadow-sm relative overflow-hidden group">
           <p className="text-xs font-bold text-indigo-400/80 uppercase tracking-widest mb-1">Capital Acumulado Global</p>
           <p className="text-3xl font-black text-indigo-100 font-outfit tracking-tighter">{fmt(totalCurrent)}</p>
           <div className="text-[11px] font-bold text-indigo-400mt-2 bg-indigo-500/20 w-fit px-2 py-0.5 rounded-md mt-2 flex items-center gap-1">
             <Rocket className="h-3 w-3" /> Fogo no Caixa
           </div>
        </div>

        <div className="bg-card/40 backdrop-blur-md p-6 rounded-[2rem] border border-border/40 shadow-sm relative overflow-hidden group">
           <div className="absolute inset-y-0 left-0 w-1.5 bg-border/50 group-hover:bg-primary/50 transition-colors" />
           <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Alvo Patrimonial Total</p>
           <p className="text-3xl font-black font-outfit tracking-tighter">{fmt(totalTarget)}</p>
           
           <div className="w-full bg-background/50 h-1.5 rounded-full mt-3 overflow-hidden border border-border/50">
              <div className="h-full bg-foreground rounded-full" style={{ width: `${totalCompletionPct}%` }} />
           </div>
        </div>
      </div>

      {/* ─── Goals Grid ─── */}
      {goals.length === 0 ? (
        <div className="py-20 px-6 flex flex-col items-center justify-center text-center rounded-[2rem] border border-border/40 border-dashed bg-card/20 text-muted-foreground">
          <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
            <Flag className="h-10 w-10 opacity-40" />
          </div>
          <p className="text-lg font-bold text-foreground">Você ainda não tem metas cravadas.</p>
          <p className="text-sm font-medium mt-1 max-w-sm">
            Sem um alvo, qualquer caminho serve. Comece criando um objetivo palpável e veja seu patrimônio seguir a direção certa.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const rawPct = (goal.current / goal.target) * 100;
            const pct = isNaN(rawPct) ? 0 : Math.min(rawPct, 100);
            const isFinished = pct >= 100;

            return (
              <div 
                key={goal.id} 
                className={cn(
                  "bg-card/40 backdrop-blur-md p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden group shadow-sm flex flex-col gap-6",
                  isFinished 
                    ? "border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-500 shadow-emerald-500/10" 
                    : "border-border/40 hover:border-border/80 hover:shadow-xl hover:-translate-y-1"
                )}
              >
                {/* Visual Glow */}
                <div 
                   className={cn(
                     "absolute -left-10 -bottom-10 w-32 h-32 rounded-full blur-[40px] opacity-10 pointer-events-none transition-opacity group-hover:opacity-30",
                     isFinished ? "bg-emerald-500" : "bg-primary"
                   )}
                   style={{ backgroundColor: !isFinished ? goal.color : undefined }}
                />

                <div className="flex items-start justify-between relative z-10">
                  <div className="min-w-0 pr-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      Prazo: {new Date(goal.deadline).toLocaleDateString("pt-BR")}
                    </p>
                    <h3 className="font-outfit font-black text-xl tracking-tight truncate leading-tight">
                      {goal.name}
                    </h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(goal.id)} 
                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0 rounded-lg -mr-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-end space-y-3">
                  <div className="flex items-end justify-between font-outfit">
                    <div>
                      <span className="text-2xl font-black tracking-tighter">{fmt(goal.current)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block leading-3">Alvo</span>
                      <span className="text-sm font-bold text-muted-foreground/80">{fmt(goal.target)}</span>
                    </div>
                  </div>
                  
                  {/* Premium Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full bg-background/50 h-3 rounded-full overflow-hidden border border-border/50 relative shadow-inner">
                      {/* Glow Behind Bar */}
                      <div 
                         className="absolute inset-y-0 left-0 w-full opacity-30 blur-sm mix-blend-screen pointer-events-none"
                         style={{ backgroundColor: isFinished ? "#10b981" : goal.color }}
                      />
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out relative z-10"
                        style={{ 
                          width: `${pct}%`, 
                          backgroundColor: isFinished ? "#10b981" : goal.color 
                        }} 
                      />
                    </div>
                    
                    <div className="flex justify-end">
                       {isFinished ? (
                         <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                           <CheckCircle2 className="h-3.5 w-3.5" /> Alcançada!
                         </span>
                       ) : (
                         <span className="text-[11px] font-bold text-muted-foreground">
                           {pct.toFixed(1)}% do trajeto concluído
                         </span>
                       )}
                    </div>
                  </div>
                </div>

                {!isFinished && (
                  <Button 
                    variant="outline" 
                    className="w-full relative z-10 rounded-xl font-bold bg-background/50 border-border/50 hover:bg-background hover:text-foreground hover:border-border gap-2 shadow-sm"
                    onClick={() => handleAddValue(goal.id)}
                  >
                    <TrendingUp className="h-4 w-4" /> Fazer Aporte
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
