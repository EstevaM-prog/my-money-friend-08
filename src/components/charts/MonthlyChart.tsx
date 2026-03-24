import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Transaction } from "@/lib/finance-data";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonthlyChartProps {
  transactions: Transaction[];
}

export function MonthlyChart({ transactions }: MonthlyChartProps) {
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    return {
      date,
      label: format(date, "MMM", { locale: ptBR }),
      start: startOfMonth(date),
      end: endOfMonth(date),
    };
  });

  const data = months.map((m) => {
    const monthTx = transactions.filter((t) =>
      isWithinInterval(new Date(t.date), { start: m.start, end: m.end })
    );
    return {
      month: m.label,
      Receitas: monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      Despesas: monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={6} barSize={18}>
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
            <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" stopOpacity={1} />
            <stop offset="100%" stopColor="#e11d48" stopOpacity={0.8} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="rgba(255,255,255,0.04)" 
          vertical={false}
        />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)", fontWeight: 600 }} 
          stroke="rgba(255,255,255,0.06)"
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis 
          tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)", fontWeight: 600 }} 
          stroke="rgba(255,255,255,0.06)" 
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          axisLine={false}
          tickLine={false}
          dx={-5}
        />
        <Tooltip
          formatter={(value: number) =>
            `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
          }
          contentStyle={{
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            backgroundColor: "rgba(8,8,16,0.95)",
            color: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(12px)",
            fontSize: "12px",
            fontWeight: "600",
            padding: "10px 16px",
          }}
          itemStyle={{ color: "rgba(255,255,255,0.8)" }}
          labelStyle={{ color: "rgba(255,255,255,0.4)", fontWeight: "700", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.05em" }}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
        />
        <Legend 
          wrapperStyle={{ 
            fontSize: "11px", 
            fontWeight: "700", 
            color: "rgba(255,255,255,0.5)",
            paddingTop: "12px"
          }}
          iconType="circle"
          iconSize={8}
        />
        <Bar 
          dataKey="Receitas" 
          fill="url(#incomeGradient)" 
          radius={[6, 6, 0, 0]}
          animationDuration={1200}
          animationBegin={0}
        />
        <Bar 
          dataKey="Despesas" 
          fill="url(#expenseGradient)"  
          radius={[6, 6, 0, 0]}
          animationDuration={1200}
          animationBegin={200}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
