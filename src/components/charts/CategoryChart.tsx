import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Transaction, CATEGORY_COLORS } from "@/lib/finance-data";
import { motion } from "framer-motion";

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
      <div className="flex flex-col items-center justify-center h-48 text-white/30">
        <div className="h-16 w-16 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-3">
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-sm font-medium">Sem despesas neste período</p>
        <p className="text-[10px] text-white/20 mt-1 uppercase tracking-widest">Adicione transações para visualizar</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Donut Chart with Glow */}
      <div className="w-44 h-44 shrink-0 relative">
        {/* Glow behind chart */}
        <div className="absolute inset-[-10%] rounded-full bg-amber-500/[0.05] blur-[30px] pointer-events-none" />
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1200}
            >
              {data.map((entry) => (
                <Cell 
                  key={entry.name} 
                  fill={CATEGORY_COLORS[entry.name] || "#6b7280"} 
                  style={{ filter: `drop-shadow(0 0 4px ${CATEGORY_COLORS[entry.name] || "#6b7280"}50)` }}
                />
              ))}
            </Pie>
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
                padding: "8px 14px",
              }}
              itemStyle={{ color: "rgba(255,255,255,0.8)" }}
              labelStyle={{ color: "rgba(255,255,255,0.5)", fontWeight: "700", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.05em" }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Total</span>
          <span className="text-base font-black text-white/80 mt-0.5">
            R$ {(total / 1000).toFixed(1)}k
          </span>
        </div>
      </div>
      
      {/* Legend Items */}
      <div className="w-full space-y-1.5">
        {data.map((d, i) => {
          const pct = ((d.value / total) * 100).toFixed(0);
          return (
            <motion.div 
              key={d.name} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg hover:bg-white/[0.03] transition-colors duration-200 group/item"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-lg"
                style={{ 
                  backgroundColor: CATEGORY_COLORS[d.name] || "#6b7280",
                  boxShadow: `0 0 6px ${CATEGORY_COLORS[d.name] || "#6b7280"}40`
                }}
              />
              <span className="text-xs text-white/60 flex-1 min-w-0 truncate pr-2 font-medium group-hover/item:text-white/80 transition-colors" title={d.name}>
                {d.name}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-black text-white/30 tabular-nums w-8 text-right bg-white/[0.03] px-1.5 py-0.5 rounded">
                  {pct}%
                </span>
                <span className="text-xs font-bold text-white/70 tabular-nums text-right whitespace-nowrap">
                  R$ {d.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
