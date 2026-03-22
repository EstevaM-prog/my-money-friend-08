import { useMemo, useState } from "react";
import { FileBarChart, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_COLORS, Transaction } from "@/lib/finance-data";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinance } from "@/hooks/use-finance";

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

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl gradient-primary">
            <FileBarChart className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Relatórios</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger className="w-[140px] sm:w-[160px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Último mês</SelectItem>
              <SelectItem value="3">3 meses</SelectItem>
              <SelectItem value="6">6 meses</SelectItem>
              <SelectItem value="12">12 meses</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 text-sm" onClick={handleExport}>
            <Download className="h-4 w-4" /> <span className="hidden sm:inline">Exportar CSV</span><span className="sm:hidden">CSV</span>
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card rounded-xl p-4 sm:p-5 card-shadow">
          <p className="text-xs sm:text-sm text-muted-foreground">Total Receitas</p>
          <p className="text-lg sm:text-xl font-bold mt-1 text-primary">{fmt(totalIncome)}</p>
        </div>
        <div className="bg-card rounded-xl p-4 sm:p-5 card-shadow">
          <p className="text-xs sm:text-sm text-muted-foreground">Total Despesas</p>
          <p className="text-lg sm:text-xl font-bold mt-1 text-destructive">{fmt(totalExpense)}</p>
        </div>
        <div className="bg-card rounded-xl p-4 sm:p-5 card-shadow">
          <p className="text-xs sm:text-sm text-muted-foreground">Saldo Período</p>
          <p className="text-lg sm:text-xl font-bold mt-1 text-balance">{fmt(totalIncome - totalExpense)}</p>
        </div>
        <div className="bg-card rounded-xl p-4 sm:p-5 card-shadow">
          <p className="text-xs sm:text-sm text-muted-foreground">Transações</p>
          <p className="text-lg sm:text-xl font-bold mt-1">{filtered.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-card rounded-xl p-4 sm:p-5 card-shadow">
          <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Evolução Mensal</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={60} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="income" name="Receita" stroke="hsl(var(--income))" fill="hsl(var(--income) / 0.2)" />
              <Area type="monotone" dataKey="expense" name="Despesa" stroke="hsl(var(--expense))" fill="hsl(var(--expense) / 0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-4 sm:p-5 card-shadow">
          <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Despesas por Categoria</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ strokeWidth: 1 }}
              >
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#6b7280"} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => fmt(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table breakdown */}
      <div className="bg-card rounded-xl p-4 sm:p-5 card-shadow overflow-x-auto">
        <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Detalhamento por Categoria</h3>
        <div className="min-w-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">% do Total</TableHead>
                <TableHead className="text-right">Qtd.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryData.map((cat) => {
                const count = filtered.filter((t) => t.category === cat.name && t.type === "expense").length;
                return (
                  <TableRow key={cat.name}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[cat.name] }} />
                        <span className="text-xs sm:text-sm">{cat.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm">{fmt(cat.value)}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm">{totalExpense > 0 ? ((cat.value / totalExpense) * 100).toFixed(1) : 0}%</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm">{count}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
