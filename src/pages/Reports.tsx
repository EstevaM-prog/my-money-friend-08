import { useMemo, useState } from "react";
import { 
  FileBarChart, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Activity,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_COLORS } from "@/lib/finance-data";
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinance } from "@/hooks/use-finance";
import { cn } from "@/lib/utils";

type Period = "1" | "3" | "6" | "12";

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function Reports() {
  const [period, setPeriod] = useState<Period>("3");
  const { transactions } = useFinance();

  const now = new Date();
  const months = parseInt(period);

  const filtered = useMemo(() => {
    const start = startOfMonth(subMonths(now, months - 1));
    const end = endOfMonth(now);
    return transactions.filter((t) =>
      isWithinInterval(new Date(t.date), { start, end })
    );
  }, [transactions, months]);

  const totalIncome = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.filter((t) => t.type === "expense").forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const monthlyData = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    for (let i = months - 1; i >= 0; i--) {
      const d = subMonths(now, i);
      const key = format(d, "MMM/yy", { locale: ptBR });
      map[key] = { income: 0, expense: 0 };
    }
    filtered.forEach((t) => {
      const key = format(new Date(t.date), "MMM/yy", { locale: ptBR });
      if (map[key]) {
        if (t.type === "income") map[key].income += t.amount;
        else map[key].expense += t.amount;
      }
    });
    return Object.entries(map).map(([month, data]) => ({
      month,
      ...data,
      balance: data.income - data.expense,
    }));
  }, [filtered, months]);

  function handleExport() {
    const csvRows = ["Descrição,Tipo,Categoria,Forma de Pagamento,Valor,Data"];
    filtered.forEach((t) => {
      csvRows.push(`"${t.description}",${t.type},${t.category},${t.paymentMethod},${t.amount},${format(new Date(t.date), "dd/MM/yyyy")}`);
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-financeiro-${format(now, "yyyy-MM")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Defs for SVGs
  const renderGradients = () => (
    <defs>
      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
      </linearGradient>
    </defs>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 font-bold uppercase tracking-widest text-[10px]">
            <FileBarChart className="h-3.5 w-3.5" />
            CashFlow Analytics
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-outfit">Visão Estratégica</h1>
          <p className="text-muted-foreground font-medium text-sm max-w-md">
            Analise seu fluxo de caixa, compreenda seus gastos e tome decisões financeiras mais inteligentes.
          </p>
        </div>

        <div className="flex gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger className="w-[160px] h-11 bg-card/50 backdrop-blur-md border-border/50 font-semibold rounded-2xl shadow-sm hover:border-border transition-colors">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/50 shadow-xl">
              <SelectItem value="1">Último Mês</SelectItem>
              <SelectItem value="3">Último Trimestre</SelectItem>
              <SelectItem value="6">Último Semestre</SelectItem>
              <SelectItem value="12">Ano Atual</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={handleExport}
            className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 gap-2"
          >
            <Download className="h-4 w-4" /> 
            <span className="hidden sm:inline">Exportar CSV</span>
          </Button>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: "Total de Receitas", 
            value: fmt(totalIncome), 
            icon: TrendingUp, 
            color: "text-emerald-500", 
            bg: "bg-emerald-500/10",
            border: "hover:border-emerald-500/50"
          },
          { 
            label: "Total de Despesas", 
            value: fmt(totalExpense), 
            icon: TrendingDown, 
            color: "text-rose-500", 
            bg: "bg-rose-500/10",
            border: "hover:border-rose-500/50"
          },
          { 
            label: "Saldo Acumulado", 
            value: fmt(balance), 
            icon: Wallet, 
            color: balance >= 0 ? "text-emerald-500" : "text-rose-500", 
            bg: balance >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10",
            border: balance >= 0 ? "hover:border-emerald-500/50" : "hover:border-rose-500/50"
          },
          { 
            label: "Volume de Transações", 
            value: String(filtered.length), 
            icon: Activity, 
            color: "text-blue-500", 
            bg: "bg-blue-500/10",
            border: "hover:border-blue-500/50"
          },
        ].map((metric, i) => (
          <div 
            key={i} 
            className={cn(
              "group p-6 rounded-[2rem] bg-card border border-border/40 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden",
              metric.border
            )}
          >
            <div className={`absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${metric.color}`}>
               <metric.icon className="h-24 w-24 -mt-10 -mr-10" />
            </div>
            <div className="relative z-10 flex flex-col h-full gap-4">
              <div className={cn("h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center shrink-0", metric.bg)}>
                <metric.icon className={cn("h-5 w-5 sm:h-6 sm:w-6", metric.color)} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest">{metric.label}</p>
                <p className="text-2xl sm:text-3xl font-black mt-1 font-outfit tracking-tighter">{metric.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        
        {/* Line/Area Chart */}
        <div className="bg-card rounded-[2rem] border border-border/40 p-6 sm:p-8 shadow-sm group hover:border-border/80 transition-colors">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black tracking-tight font-outfit">Evolução de Patrimônio</h3>
              <p className="text-sm text-muted-foreground font-medium">Comparativo Mensal: Receitas vs Despesas</p>
            </div>
          </div>
          <div className="h-[300px] sm:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {renderGradients()}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))", fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))", fontWeight: 600 }} 
                  tickFormatter={(v) => `R$${v}`}
                />
                <Tooltip
                  cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "4 4" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.3)",
                    fontWeight: 600,
                    padding: "12px",
                  }}
                  itemStyle={{
                    fontWeight: 700,
                    paddingTop: "4px"
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  name="Receita" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#incomeGradient)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  name="Despesa" 
                  stroke="#ef4444" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#expenseGradient)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#ef4444" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-card rounded-[2rem] border border-border/40 p-6 sm:p-8 shadow-sm flex flex-col group hover:border-border/80 transition-colors">
          <div className="mb-2">
            <h3 className="text-lg font-black tracking-tight font-outfit">Distribuição</h3>
            <p className="text-sm text-muted-foreground font-medium">Onde você mais gasta</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[250px]">
            {categoryData.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                 <PieChart className="h-12 w-12 text-muted-foreground" />
                 <p className="text-sm font-semibold">Sem despesas registradas</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryData.map((entry) => (
                        <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#8884d8"} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => fmt(value)}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "12px",
                        fontWeight: "bold"
                      }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Despesas</p>
                   <p className="text-lg font-black tracking-tight">{categoryData.length > 0 ? Object.keys(categoryData).length : 0}</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Categorias</p>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Breakdown Sublist */}
      <div className="bg-card rounded-[2rem] border border-border/40 p-6 sm:p-8 shadow-sm overflow-hidden group hover:border-border/80 transition-colors">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-black tracking-tight font-outfit">Raio-X de Gastos</h3>
            <p className="text-sm text-muted-foreground font-medium">Análise aprofundada por setor financeiro</p>
          </div>
        </div>

        {categoryData.length === 0 ? (
           <p className="text-center text-sm font-medium text-muted-foreground py-10">
             Não há transações suficientes no período selecionado.
           </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryData.map((cat) => {
              const count = filtered.filter((t) => t.category === cat.name && t.type === "expense").length;
              const pct = totalExpense > 0 ? ((cat.value / totalExpense) * 100) : 0;
              const color = CATEGORY_COLORS[cat.name] || "#8884d8";

              return (
                <div key={cat.name} className="p-4 rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
                      <span className="font-bold text-sm">{cat.name}</span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground px-2 py-0.5 rounded-md bg-muted/50">
                      {count} {count === 1 ? 'transação' : 'transações'}
                    </span>
                  </div>
                  
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-lg font-black tracking-tight">{fmt(cat.value)}</span>
                    <span className="text-sm font-bold" style={{ color }}>{pct.toFixed(1)}%</span>
                  </div>
                  
                  <div className="w-full bg-border rounded-full h-1.5 mt-1 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  );
}
