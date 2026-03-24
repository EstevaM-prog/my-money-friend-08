import { useState, useMemo } from "react";
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  Landmark,
  CandlestickChart,
  Sparkles,
  PieChart as PieChartIcon
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { usePrivacy } from "@/hooks/use-privacy";
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
import { cn } from "@/lib/utils";

// ─── Interfaces & Mock Data ────────────────────────────────────────────────────────

interface FixedIncome {
  id: string;
  name: string;
  type: "CDB" | "Tesouro Direto" | "LCI" | "LCA" | "Debêntures";
  amount: number;
  rate: string;
  deadline: string;
}

interface VariableIncome {
  id: string;
  ticker: string;
  type: "Ações" | "FIIs" | "ETFs";
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

const initialFixed: FixedIncome[] = [];

const initialVariable: VariableIncome[] = [];

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
const fmtPct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;

export default function Finance() {
  const { isPrivate } = usePrivacy();

  const [fixedAssets, setFixedAssets] = useState<FixedIncome[]>(initialFixed);
  const [variableAssets, setVariableAssets] = useState<VariableIncome[]>(initialVariable);

  // Modal states
  const [openModal, setOpenModal] = useState<"fixed" | "variable" | null>(null);

  // Form State - Fixed
  const [fName, setFName] = useState("");
  const [fType, setFType] = useState<FixedIncome["type"]>("CDB");
  const [fAmount, setFAmount] = useState("");
  const [fRate, setFRate] = useState("");
  const [fDeadline, setFDeadline] = useState("");

  // Form State - Variable
  const [vTicker, setVTicker] = useState("");
  const [vType, setVType] = useState<VariableIncome["type"]>("Ações");
  const [vQuantity, setVQuantity] = useState("");
  const [vAvgPrice, setVAvgPrice] = useState("");
  const [vCurrentPrice, setVCurrentPrice] = useState("");

  const totalFixed = useMemo(() => fixedAssets.reduce((s, a) => s + a.amount, 0), [fixedAssets]);
  const totalVariable = useMemo(() => variableAssets.reduce((s, a) => s + (a.quantity * a.currentPrice), 0), [variableAssets]);
  const totalVariableInvested = useMemo(() => variableAssets.reduce((s, a) => s + (a.quantity * a.avgPrice), 0), [variableAssets]);
  
  const netWorth = totalFixed + totalVariable;
  const variableProfit = totalVariable - totalVariableInvested;
  const variableProfitPct = totalVariableInvested > 0 ? (variableProfit / totalVariableInvested) * 100 : 0;

  // Pie Chart Data
  const allocationData = [
    { name: "Tesouro Direto", value: fixedAssets.filter(a => a.type === "Tesouro Direto").reduce((s, a) => s + a.amount, 0) },
    { name: "CDB/LCI/LCA", value: fixedAssets.filter(a => ["CDB", "LCI", "LCA"].includes(a.type)).reduce((s, a) => s + a.amount, 0) },
    { name: "Debêntures", value: fixedAssets.filter(a => a.type === "Debêntures").reduce((s, a) => s + a.amount, 0) },
    { name: "Ações", value: variableAssets.filter(a => a.type === "Ações").reduce((s, a) => s + (a.quantity * a.currentPrice), 0) },
    { name: "FIIs", value: variableAssets.filter(a => a.type === "FIIs").reduce((s, a) => s + (a.quantity * a.currentPrice), 0) },
    { name: "ETFs", value: variableAssets.filter(a => a.type === "ETFs").reduce((s, a) => s + (a.quantity * a.currentPrice), 0) },
  ].filter(d => d.value > 0).sort((a,b) => b.value - a.value);

  function handleAddFixed(e: React.FormEvent) {
    e.preventDefault();
    if (!fName || !fAmount || !fRate || !fDeadline) return;
    setFixedAssets(prev => [...prev, {
      id: String(Date.now()),
      name: fName, type: fType, amount: Number(fAmount), rate: fRate, deadline: fDeadline
    }]);
    setOpenModal(null);
  }

  function handleAddVariable(e: React.FormEvent) {
    e.preventDefault();
    if (!vTicker || !vQuantity || !vAvgPrice || !vCurrentPrice) return;
    setVariableAssets(prev => [...prev, {
      id: String(Date.now()),
      ticker: vTicker.toUpperCase(), type: vType, quantity: Number(vQuantity), avgPrice: Number(vAvgPrice), currentPrice: Number(vCurrentPrice)
    }]);
    setOpenModal(null);
  }

  return (
    <div className="w-full min-h-screen pb-20 sm:pb-10 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-10">

        {/* ─── Hero Header ─── */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px] uppercase tracking-widest border border-emerald-500/20">
              <Sparkles className="h-3.5 w-3.5" /> Acervo de Investimentos
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-outfit">
              Sua <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">Carteira</span>
            </h1>
            <p className="text-muted-foreground text-sm font-medium max-w-md">
              Acompanhe sua alocação, rendimentos de renda fixa e volatilidade da renda variável em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Dialog open={openModal === "fixed"} onOpenChange={(v) => setOpenModal(v ? "fixed" : null)}>
              <DialogTrigger asChild>
                 <Button variant="outline" className="h-11 px-4 rounded-xl border-border/50 bg-card/50 hover:bg-card shadow-sm gap-2 font-bold">
                    <Plus className="h-4 w-4" /> Add Renda Fixa
                 </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-[2rem] bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl p-6 sm:p-8">
                 <DialogHeader className="mb-4">
                   <DialogTitle className="text-2xl font-black font-outfit">Novo Título Pós/Pré</DialogTitle>
                 </DialogHeader>
                 <form onSubmit={handleAddFixed} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Nome do Título</Label>
                      <Input value={fName} onChange={e => setFName(e.target.value)} placeholder="Ex: CDB Banco Inter" required className="h-12 bg-background/50 rounded-xl font-semibold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Classe</Label>
                        <Select value={fType} onValueChange={(v: any) => setFType(v)}>
                          <SelectTrigger className="h-12 bg-background/50 rounded-xl font-semibold"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {["CDB", "Tesouro Direto", "LCI", "LCA", "Debêntures"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Alocação (R$)</Label>
                        <Input type="number" step="0.01" value={fAmount} onChange={e => setFAmount(e.target.value)} required className="h-12 bg-background/50 rounded-xl font-semibold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Taxa</Label>
                        <Input value={fRate} onChange={e => setFRate(e.target.value)} placeholder="Ex: 110% CDI" required className="h-12 bg-background/50 rounded-xl font-semibold" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Vencimento</Label>
                        <Input type="date" value={fDeadline} onChange={e => setFDeadline(e.target.value)} required className="h-12 bg-background/50 rounded-xl font-semibold [&::-webkit-calendar-picker-indicator]:opacity-50" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs mt-4">Registrar Título</Button>
                 </form>
              </DialogContent>
            </Dialog>

            <Dialog open={openModal === "variable"} onOpenChange={(v) => setOpenModal(v ? "variable" : null)}>
              <DialogTrigger asChild>
                 <Button className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 gap-2 font-bold transition-all active:scale-95">
                    <Plus className="h-4 w-4" /> Add Renda Variável
                 </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-[2rem] bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl p-6 sm:p-8">
                 <DialogHeader className="mb-4">
                   <DialogTitle className="text-2xl font-black font-outfit">Nova Posição Variável</DialogTitle>
                 </DialogHeader>
                 <form onSubmit={handleAddVariable} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Ativo (Ticker)</Label>
                        <Input value={vTicker} onChange={e => setVTicker(e.target.value)} placeholder="Ex: BOVA11" required className="h-12 bg-background/50 rounded-xl font-bold uppercase" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Modalidade</Label>
                        <Select value={vType} onValueChange={(v: any) => setVType(v)}>
                          <SelectTrigger className="h-12 bg-background/50 rounded-xl font-semibold"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {["Ações", "FIIs", "ETFs"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Quantidade</Label>
                      <Input type="number" value={vQuantity} onChange={e => setVQuantity(e.target.value)} required className="h-12 bg-background/50 rounded-xl font-semibold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Preço Médio (R$)</Label>
                        <Input type="number" step="0.01" value={vAvgPrice} onChange={e => setVAvgPrice(e.target.value)} required className="h-12 bg-background/50 rounded-xl font-semibold" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Cotação Atual (R$)</Label>
                        <Input type="number" step="0.01" value={vCurrentPrice} onChange={e => setVCurrentPrice(e.target.value)} required className="h-12 bg-background/50 rounded-xl font-semibold" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs mt-4">Comprar/Registrar</Button>
                 </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* ─── Global Dashboard Summaries ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-card/40 backdrop-blur-md border border-border/40 p-6 sm:p-8 rounded-[2rem] shadow-sm relative overflow-hidden group">
               <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Wallet className="h-32 w-32 -mt-10 -mr-10 text-primary" />
               </div>
               <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2 relative z-10">Patrimônio Investido</p>
               <h2 className="text-4xl font-black font-outfit tracking-tighter relative z-10">
                 {isPrivate ? "••••••" : fmt(netWorth)}
               </h2>
               <div className="mt-8 flex items-center justify-between text-sm font-semibold relative z-10">
                 <div className="space-y-1">
                   <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest block">Segurança (Fixa)</span>
                   <span className="text-emerald-500">{isPrivate ? "••••" : fmt(totalFixed)}</span>
                 </div>
                 <div className="w-px h-8 bg-border/50 mx-4" />
                 <div className="space-y-1 text-right">
                   <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest block">Risco (Variável)</span>
                   <span className="text-indigo-400">{isPrivate ? "••••" : fmt(totalVariable)}</span>
                 </div>
               </div>
            </div>

            <div className="bg-card/40 backdrop-blur-md border border-border/40 p-6 sm:p-8 rounded-[2rem] shadow-sm flex flex-col justify-between">
               <div className="flex items-center gap-3 mb-4">
                 <div className={cn("p-3 rounded-xl", variableProfit >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
                    {variableProfit >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                 </div>
                 <div>
                   <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Lucro Renda Variável</p>
                   <p className={cn("text-2xl font-black font-outfit tracking-tighter", variableProfit >= 0 ? "text-emerald-500" : "text-rose-500")}>
                     {isPrivate ? "••••" : fmtPct(variableProfitPct)}
                   </p>
                 </div>
               </div>
               <div className="space-y-2 pt-4 border-t border-border/40">
                 <div className="flex justify-between text-sm font-bold">
                   <span className="text-muted-foreground">Valor Bruto:</span>
                   <span>{isPrivate ? "••••" : fmt(variableProfit)}</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-card/40 backdrop-blur-md border border-border/40 p-6 sm:p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center">
            <h3 className="text-lg font-black font-outfit tracking-tight w-full text-left mb-2 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 opacity-50" /> Alocação Gráfica
            </h3>
            <div className="w-full h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(2, 2, 5, 0.8)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {allocationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-border/40 my-10" />

        {/* ─── Renda Fixa Section (Elegante Tabela/Cards) ─── */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
               <Landmark className="h-5 w-5 text-indigo-500" />
             </div>
             <div>
               <h2 className="text-2xl font-black font-outfit tracking-tight">Renda Fixa</h2>
               <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Tesouro, CDBs e Debêntures</p>
             </div>
          </div>

          {fixedAssets.length === 0 ? (
            <div className="p-12 text-center rounded-[2rem] border border-dashed border-border/50 text-muted-foreground">
              Nenhuma alocação de risco zero registrada.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {fixedAssets.map(asset => (
                <div key={asset.id} className="bg-card/40 backdrop-blur-md border border-border/40 p-5 rounded-3xl shadow-sm hover:-translate-y-1 hover:border-indigo-500/30 transition-all flex flex-col justify-between group">
                  <div className="space-y-1 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20 inline-block mb-2">
                      {asset.type}
                    </span>
                    <h3 className="text-lg font-bold font-outfit tracking-tight leading-tight">{asset.name}</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Aplicação</span>
                      <span className="text-lg font-black tracking-tight">{isPrivate ? "••••" : fmt(asset.amount)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-border/40 pt-3">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Taxa</span>
                        <span className="text-sm font-semibold">{asset.rate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Vencimento</span>
                        <span className="text-sm font-semibold">{asset.deadline.slice(0,4)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── Renda Variável Section (Grid de Cards Interativos) ─── */}
        <section className="space-y-6 pt-6">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
               <CandlestickChart className="h-5 w-5 text-orange-500" />
             </div>
             <div>
               <h2 className="text-2xl font-black font-outfit tracking-tight">Renda Variável</h2>
               <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Ações, FIIs e ETFs</p>
             </div>
          </div>

          {variableAssets.length === 0 ? (
            <div className="p-12 text-center rounded-[2rem] border border-dashed border-border/50 text-muted-foreground">
              Sua carteira de especulação está vazia.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {variableAssets.map(asset => {
                const totalInvested = asset.quantity * asset.avgPrice;
                const currentTotal = asset.quantity * asset.currentPrice;
                const profitCalc = currentTotal - totalInvested;
                const profitPct = (profitCalc / totalInvested) * 100;
                const isUp = profitPct >= 0;

                return (
                  <div key={asset.id} className="bg-card/40 backdrop-blur-md border border-border/40 p-5 rounded-3xl shadow-sm hover:shadow-xl hover:border-border/80 transition-all relative overflow-hidden group">
                     {/* Dynamic Glow */}
                     <div className={cn(
                       "absolute -right-10 -top-10 w-24 h-24 rounded-full blur-[40px] opacity-10 pointer-events-none transition-opacity group-hover:opacity-30",
                       isUp ? "bg-emerald-500" : "bg-rose-500"
                     )} />

                     <div className="flex items-start justify-between mb-5 relative z-10">
                       <div>
                         <h3 className="text-2xl font-black font-outfit tracking-tighter">{asset.ticker}</h3>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{asset.type} • {asset.quantity} Cotas</span>
                       </div>
                       <div className={cn(
                         "p-2 rounded-xl border shadow-inner",
                         isUp ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                       )}>
                         {isUp ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                       </div>
                     </div>

                     <div className="space-y-4 relative z-10">
                       <div className="flex items-center justify-between">
                         <div className="space-y-0.5">
                           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">PM (R$)</span>
                           <span className="text-sm font-semibold">{asset.avgPrice.toFixed(2)}</span>
                         </div>
                         <div className="space-y-0.5 text-right">
                           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Agora (R$)</span>
                           <span className="text-sm font-black text-foreground">{asset.currentPrice.toFixed(2)}</span>
                         </div>
                       </div>

                       <div className={cn(
                         "p-3 rounded-xl border flex items-center justify-between font-outfit",
                         isUp ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" : "bg-rose-500/5 border-rose-500/20 text-rose-500"
                       )}>
                         <span className="text-xs font-bold uppercase tracking-widest opacity-80">{isUp ? "Lucro" : "Perda"}</span>
                         <span className="text-lg font-black tracking-tighter">{fmtPct(profitPct)}</span>
                       </div>
                     </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
