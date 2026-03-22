import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Transaction, CATEGORY_COLORS } from "@/lib/finance-data";

interface CategoryChartProps {
  transactions: Transaction[];
}

export function CategoryChart({ transactions }: CategoryChartProps) {
  const expenses = transactions.filter((t) => t.type === "expense");

  const categoryTotals = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Sem despesas neste período
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      <div className="w-48 h-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#6b7280"} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) =>
                `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
              }
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-2 min-w-0 w-full">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2 w-full">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[d.name] || "#6b7280" }}
            />
            <span className="text-sm text-card-foreground flex-1 min-w-0 truncate pr-2" title={d.name}>{d.name}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-medium text-muted-foreground tabular-nums w-9 text-right">
                {((d.value / total) * 100).toFixed(0)}%
              </span>
              <span className="text-sm font-semibold text-card-foreground tabular-nums text-right whitespace-nowrap">
                R$ {d.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
