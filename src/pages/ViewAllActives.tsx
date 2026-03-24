import { useState, useMemo } from "react";
import { format, parseISO, isToday, isYesterday, isSameWeek, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useFinance } from "@/hooks/use-finance";
import { getIconComponent, DEFAULT_CATEGORY_ICON_MAP } from "@/lib/icons";
import { NotificationToggle } from "@/components/finance/NotificationToggle";
import { 
  ArrowLeft, 
  History, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Trash2,
  Zap,
  LayoutGrid,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  Receipt,
  Eye,
  SlidersHorizontal,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Transaction, CATEGORY_COLORS } from "@/lib/finance-data";
import { usePrivacy } from "@/hooks/use-privacy";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 26 } }
};

type FilterType = "all" | "income" | "expense";

export default function ViewAllActives() {
  const { transactions, deleteTransaction, toggleNotification, customCategories } = useFinance();
  const { isPrivate } = usePrivacy();
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Group duplicate transactions
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    
    transactions.forEach(t => {
      const key = `${t.description}_${t.amount}_${t.category}_${t.paymentMethod || ''}_${t.type}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });

    const result: Transaction[] = [];

    Object.values(groups).forEach(group => {
      if (group.length > 1) {
        const sortedDates = group.map(g => parseISO(g.date)).sort((a, b) => a.getTime() - b.getTime());
        const minDate = sortedDates[0];
        const maxDate = sortedDates[sortedDates.length - 1];

        const dateStr = `${format(minDate, "dd/MM/yy")} a ${format(maxDate, "dd/MM/yy")}`;

        result.push({
          ...group[0],
          id: group.map(g => g.id).join(","), 
          date: maxDate.toISOString(),
          virtualRange: dateStr,
          groupedIds: group.map(g => g.id),
        });
      } else {
        result.push(group[0]);
      }
    });

    return result;
  }, [transactions]);

  // Apply filters
  const filteredTransactions = useMemo(() => {
    let result = groupedTransactions;
    
    if (filterType !== "all") {
      result = result.filter(t => t.type === filterType);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.description.toLowerCase().includes(q) || 
        t.category.toLowerCase().includes(q) ||
        (t.paymentMethod && t.paymentMethod.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      result = result.filter(t => t.category === selectedCategory);
    }
    
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [groupedTransactions, filterType, searchQuery, selectedCategory]);

  // Group by date sections
  const groupedByDate = useMemo(() => {
    const groups: { label: string; transactions: Transaction[] }[] = [];
    const labelMap = new Map<string, Transaction[]>();

    filteredTransactions.forEach(t => {
      const date = new Date(t.date);
      let label: string;

      if (isToday(date)) {
        label = "Hoje";
      } else if (isYesterday(date)) {
        label = "Ontem";
      } else if (isSameWeek(date, new Date(), { weekStartsOn: 0 })) {
        label = "Esta Semana";
      } else if (isSameMonth(date, new Date())) {
        label = "Este Mês";
      } else {
        label = format(date, "MMMM yyyy", { locale: ptBR });
        label = label.charAt(0).toUpperCase() + label.slice(1);
      }

      if (!labelMap.has(label)) labelMap.set(label, []);
      labelMap.get(label)!.push(t);
    });

    labelMap.forEach((txns, label) => {
      groups.push({ label, transactions: txns });
    });

    return groups;
  }, [filteredTransactions]);

  // Stats
  const stats = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = filteredTransactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { total: filteredTransactions.length, income, expense };
  }, [filteredTransactions]);

  // Categories for filter
  const categories = useMemo(() => {
    const cats = new Set<string>();
    groupedTransactions.forEach(t => cats.add(t.category));
    return Array.from(cats).sort();
  }, [groupedTransactions]);

  const handleDelete = (id: string) => {
    if (id.includes(",")) {
      id.split(",").forEach(singleId => deleteTransaction(singleId));
    } else {
      deleteTransaction(id);
    }
  };

  const handleToggle = (id: string) => {
    if (id.includes(",")) {
      id.split(",").forEach(singleId => toggleNotification(singleId));
    } else {
      toggleNotification(id);
    }
  };

  const fmt = (v: number) => isPrivate ? "R$ •••••" : `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const filterTabs: { key: FilterType; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "all", label: "Todas", icon: <LayoutGrid className="h-3.5 w-3.5" />, color: "violet" },
    { key: "income", label: "Receitas", icon: <ArrowUpRight className="h-3.5 w-3.5" />, color: "emerald" },
    { key: "expense", label: "Despesas", icon: <ArrowDownRight className="h-3.5 w-3.5" />, color: "rose" },
  ];

  return (
    <div className="w-full min-h-screen pb-20 sm:pb-10 font-sans tracking-tight bg-[#030306] relative overflow-hidden text-white/90">
      
      {/* ═══ Ambient Background ═══ */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay pointer-events-none z-0" />
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-violet-500/[0.06] rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-emerald-500/[0.05] rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-rose-500/[0.03] rounded-full blur-[120px] pointer-events-none z-0" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1100px] mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-6 relative z-10"
      >
        {/* ─── Hero Header ─── */}
        <motion.section variants={itemVariants} className="space-y-6">
          {/* Breadcrumb + Back */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-11 w-11 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl border border-white/[0.06] transition-all backdrop-blur-sm" 
              asChild
            >
              <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div className="flex items-center gap-2 text-[11px] text-white/30 uppercase tracking-widest font-bold">
              <Link to="/" className="hover:text-white/60 transition-colors">Control Room</Link>
              <span>/</span>
              <span className="text-white/60">Atividades</span>
            </div>
          </div>

          {/* Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.5 }}
                className="h-16 w-16 bg-gradient-to-br from-violet-500/25 to-indigo-600/25 rounded-2xl flex items-center justify-center border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.15)] relative shrink-0"
              >
                <History className="h-8 w-8 text-violet-400" />
                <div className="absolute inset-0 rounded-2xl bg-violet-400/10 animate-pulse" />
              </motion.div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50">
                  Todas as Atividades
                </h1>
                <p className="text-sm text-white/40 font-medium mt-1 flex items-center gap-2">
                  <Receipt className="h-3.5 w-3.5 text-violet-400" />
                  Histórico completo de transações agrupadas
                </p>
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-white/[0.03] px-4 py-2.5 rounded-2xl border border-white/[0.06] backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                <span className="text-xs font-bold text-emerald-400 tabular-nums">{fmt(stats.income)}</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.5)]" />
                <span className="text-xs font-bold text-rose-400 tabular-nums">{fmt(stats.expense)}</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-black">{stats.total} itens</span>
            </div>
          </div>
        </motion.section>

        {/* ─── Filter Bar ─── */}
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar transações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-10 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/20 focus:bg-white/[0.05] transition-all backdrop-blur-sm font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10 text-white/30 hover:text-white/60 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Type Filter Tabs */}
            <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] backdrop-blur-sm">
              {filterTabs.map(tab => {
                const isActive = filterType === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setFilterType(tab.key)}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                      isActive 
                        ? tab.color === "violet" ? "bg-violet-500/20 text-violet-400 border border-violet-500/20 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                        : tab.color === "emerald" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
                        : "text-white/30 hover:text-white/60 border border-transparent"
                    )}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter Chips */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border",
                  !selectedCategory 
                    ? "bg-white/10 text-white/80 border-white/15" 
                    : "bg-transparent text-white/25 border-white/[0.05] hover:text-white/50 hover:border-white/10"
                )}
              >
                Todas
              </button>
              {categories.map(cat => {
                const isActive = selectedCategory === cat;
                const color = CATEGORY_COLORS[cat] || "#6b7280";
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(isActive ? null : cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-1.5",
                      isActive 
                        ? "text-white/90 border-white/15" 
                        : "text-white/25 border-white/[0.05] hover:text-white/50 hover:border-white/10"
                    )}
                    style={isActive ? { backgroundColor: `${color}20`, borderColor: `${color}30` } : {}}
                  >
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: color, boxShadow: isActive ? `0 0 6px ${color}60` : 'none' }} 
                    />
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* ─── Transaction Feed ─── */}
        <motion.section variants={itemVariants} className="space-y-4">
          {filteredTransactions.length === 0 ? (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-[32px] overflow-hidden"
            >
              <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-br from-white/10 via-transparent to-white/5 z-0">
                <div className="absolute inset-[1px] rounded-[31px] bg-[#080810]" />
              </div>
              <div className="relative bg-[#080810]/95 rounded-[32px] p-12 sm:p-16 flex flex-col items-center justify-center text-center z-10">
                <div className="h-20 w-20 bg-white/[0.03] rounded-3xl flex items-center justify-center border border-white/[0.06] mb-6">
                  <Receipt className="h-10 w-10 text-white/15" />
                </div>
                <h3 className="text-xl font-black text-white/60 tracking-tight mb-2">Nenhuma transação encontrada</h3>
                <p className="text-sm text-white/25 max-w-sm">
                  {searchQuery || selectedCategory || filterType !== "all" 
                    ? "Tente ajustar seus filtros para encontrar o que procura." 
                    : "Adicione sua primeira transação para começar a acompanhar suas finanças."}
                </p>
                {(searchQuery || selectedCategory || filterType !== "all") && (
                  <Button
                    onClick={() => { setSearchQuery(""); setSelectedCategory(null); setFilterType("all"); }}
                    className="mt-6 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 border border-violet-500/20 rounded-xl text-xs font-black uppercase tracking-widest"
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            /* Transaction Groups */
            <div className="space-y-6">
              {groupedByDate.map((group, groupIdx) => (
                <motion.div 
                  key={group.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIdx * 0.05 }}
                >
                  {/* Date Group Header */}
                  <div className="flex items-center gap-3 mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-white/20" />
                      <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">{group.label}</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
                    <span className="text-[10px] text-white/15 font-bold tabular-nums">{group.transactions.length} itens</span>
                  </div>

                  {/* Transaction Card Container */}
                  <div className="relative rounded-[24px] overflow-hidden">
                    {/* Border Gradient */}
                    <div className="absolute inset-0 rounded-[24px] p-[1px] bg-gradient-to-b from-white/[0.06] via-transparent to-white/[0.02] z-0">
                      <div className="absolute inset-[1px] rounded-[23px] bg-[#080810]" />
                    </div>

                    <div className="relative bg-[#080810]/95 backdrop-blur-2xl rounded-[24px] z-10 divide-y divide-white/[0.04]">
                      {group.transactions.map((t, idx) => {
                        const customCat = customCategories.find(c => c.name === t.category);
                        const iconName = customCat ? customCat.icon : DEFAULT_CATEGORY_ICON_MAP[t.category];
                        const CategoryIcon = getIconComponent(iconName);
                        const catColor = CATEGORY_COLORS[t.category] || "#6b7280";

                        return (
                          <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-white/[0.02] transition-all duration-300 group/row cursor-default relative"
                          >
                            {/* Category Icon */}
                            <div
                              className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover/row:scale-105"
                              style={{ 
                                backgroundColor: `${catColor}15`, 
                                borderColor: `${catColor}20`,
                                boxShadow: `0 0 15px ${catColor}08`
                              }}
                            >
                              <CategoryIcon className="h-5 w-5 sm:h-5.5 sm:w-5.5" style={{ color: catColor }} />
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm sm:text-base font-bold text-white/90 truncate tracking-tight group-hover/row:text-white transition-colors">
                                {t.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span 
                                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border"
                                  style={{ 
                                    color: `${catColor}cc`,
                                    backgroundColor: `${catColor}10`,
                                    borderColor: `${catColor}15`
                                  }}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catColor }} />
                                  {t.category}
                                </span>
                                {t.paymentMethod && (
                                  <span className="text-[10px] text-white/20 font-medium">{t.paymentMethod}</span>
                                )}
                                <span className="text-[10px] text-white/15">•</span>
                                <span className="text-[10px] text-white/25 font-medium shrink-0 whitespace-nowrap flex items-center gap-1">
                                  <CalendarDays className="h-2.5 w-2.5" />
                                  {t.virtualRange ? t.virtualRange : format(new Date(t.date), "dd MMM yyyy", { locale: ptBR })}
                                </span>
                                {t.groupedIds && t.groupedIds.length > 1 && (
                                  <span className="text-[9px] text-violet-400/60 bg-violet-500/10 px-1.5 py-0.5 rounded font-black uppercase tracking-widest border border-violet-500/10">
                                    {t.groupedIds.length}x
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Amount + Actions */}
                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                              <div className="text-right">
                                <p
                                  className={cn(
                                    "text-sm sm:text-base font-black whitespace-nowrap tabular-nums tracking-tight",
                                    t.type === "income" ? "text-emerald-400" : "text-rose-400"
                                  )}
                                >
                                  {t.type === "income" ? "+" : "−"} {fmt(t.amount)}
                                </p>
                                <p className={cn(
                                  "text-[10px] font-bold uppercase tracking-widest mt-0.5",
                                  t.type === "income" ? "text-emerald-400/40" : "text-rose-400/40"
                                )}>
                                  {t.type === "income" ? "Receita" : "Despesa"}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-all duration-300">
                                <NotificationToggle
                                  active={t.email_notification_active ?? false}
                                  onToggle={() => handleToggle(t.id)}
                                />
                                <button
                                  onClick={() => handleDelete(t.id)}
                                  className="p-2 rounded-xl hover:bg-rose-500/10 text-white/20 hover:text-rose-400 transition-all"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </motion.div>
    </div>
  );
}
