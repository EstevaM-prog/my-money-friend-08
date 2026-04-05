import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Sparkles,
  TriangleAlert,
  CheckCircle2,
  Sliders,
  ArrowUpRight,
  Activity,
  MoreHorizontal,
  Eye,
  Zap,
  Shield,
  PieChart,
  LayoutList,
  Clock
} from "lucide-react";
import { format, startOfMonth, endOfMonth, isWithinInterval, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSearchParams } from "react-router-dom";
import { TransactionList } from "@/components/finance/TransactionList";
import { AddTransactionDialog } from "@/components/finance/AddTransactionDialog";
import { DataExchange } from "@/components/finance/DataExchange";
import { CategoryChart } from "@/components/charts/CategoryChart";
import { MonthlyChart } from "@/components/charts/MonthlyChart";
import { FinanceCalendar } from "@/components/finance/FinanceCalendar";
import { useFinance } from "@/client/hooks/use-finance";
import { usePrivacy } from "@/client/hooks/use-privacy";
import { Button } from "@/components/ui/button";
import { getSession } from "@/client/lib/auth";
import { cn } from "@/client/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 22 } }
};

const glowPulse = {
  animate: {
    opacity: [0.4, 0.8, 0.4],
    scale: [1, 1.05, 1],
  },
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut" as const,
  }
};

const Index = () => {
  const {
    transactions,
    accounts,
    addTransactions,
    deleteTransaction,
    toggleNotification,
    budgetRules,
    cardCeilings,
    isLoading
  } = useFinance();
  const { isPrivate } = usePrivacy();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const user = getSession();

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setDialogOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { filtered, totalIncome, totalExpense, balance, transactionCount } = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    const _filtered = transactions.filter((t) =>
      isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
    );

    const _income = _filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const _expense = _filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    return {
      filtered: _filtered,
      totalIncome: _income,
      totalExpense: _expense,
      balance: _income - _expense,
      transactionCount: _filtered.length,
    };
  }, [transactions, currentMonth]);

  const fmt = (v: number) => isPrivate ? "R$ •••••" : `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const catSpending = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return map;
  }, [filtered]);

  const cardSpending = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.filter(t => t.type === "expense" && t.accountId).forEach(t => {
      map[t.accountId!] = (map[t.accountId!] || 0) + t.amount;
    });
    return map;
  }, [filtered]);

  return (
    <div className="w-full min-h-screen pb-20 sm:pb-10 font-sans tracking-tight bg-background relative overflow-hidden text-foreground">

      {/* ═══ Layered Ambient Background ═══ */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none z-0" />
      <motion.div {...glowPulse} className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-emerald-500/[0.07] rounded-full blur-[150px] pointer-events-none z-0" />
      <motion.div {...glowPulse} style={{ animationDelay: '2s' }} className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-violet-500/[0.07] rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[60%] h-[30%] bg-cyan-500/[0.03] rounded-full blur-[120px] pointer-events-none z-0" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-6 relative z-10 transition-opacity duration-500",
          isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
        )}
      >
        {isLoading && (
          <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full border border-primary/20 backdrop-blur-md animate-pulse">
            <Zap className="h-4 w-4 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando...</span>
          </div>
        )}
        {/* ─── Hero Header ─── */}
        <motion.section variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
          <div className="space-y-1">
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-5xl font-black tracking-tighter flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground/40"
            >
              Control Room
            </motion.h1>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground font-medium flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-primary" /> Olá, <span className="font-bold text-foreground">{user?.name?.split(' ')[0] || 'Sócio'}</span>. Aqui está o seu relatório diário.
            </motion.p>
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 bg-card/50 p-1.5 rounded-full border border-border backdrop-blur-3xl shadow-2xl"
          >
            <DataExchange onImport={addTransactions} transactions={transactions} />
            <AddTransactionDialog onAdd={addTransactions} open={dialogOpen} onOpenChange={setDialogOpen} />
          </motion.div>
        </motion.section>

        {/* ─── Top KPIs Strip ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Gross Income Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group overflow-hidden rounded-[24px] bg-card/80 backdrop-blur-xl border border-emerald-500/10 p-6 shadow-2xl shadow-emerald-500/5 cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[50px] -mr-10 -mt-10 transition-all duration-500 group-hover:bg-emerald-500/30" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                <div className="p-1.5 rounded-lg bg-emerald-500/10">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                Entradas
              </div>
              <div className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-emerald-500/20">
                Receita
              </div>
            </div>
            <p className="text-3xl font-black tracking-tighter text-foreground relative z-10 drop-shadow-md">
              {fmt(totalIncome)}
            </p>
          </motion.div>

          {/* Expenses Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group overflow-hidden rounded-[24px] bg-card/80 backdrop-blur-xl border border-rose-500/10 p-6 shadow-2xl shadow-rose-500/5 cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-[50px] -mr-10 -mt-10 transition-all duration-500 group-hover:bg-rose-500/30" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                <div className="p-1.5 rounded-lg bg-rose-500/10">
                  <TrendingDown className="h-4 w-4 text-rose-400" />
                </div>
                Saídas
              </div>
              <div className="bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-rose-500/20">
                Despesa
              </div>
            </div>
            <p className="text-3xl font-black tracking-tighter text-foreground relative z-10 drop-shadow-md">
              {fmt(totalExpense)}
            </p>
          </motion.div>

          {/* Main Balance Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group overflow-hidden rounded-[24px] border border-white/20 p-6 shadow-[0_0_40px_-15px_rgba(99,102,241,0.5)] cursor-pointer"
            style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.3) 0%, rgba(15,23,42,0.8) 100%)' }}
          >
            <div className="absolute inset-0 bg-indigo-950/20 backdrop-blur-sm z-0"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/40 rounded-full blur-[60px] -mr-10 -mt-10 transition-all duration-700 group-hover:scale-150 group-hover:bg-indigo-400/50" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-2 text-indigo-100 font-medium text-sm">
                <div className="p-1.5 rounded-lg bg-indigo-500/20">
                  <Wallet className="h-4 w-4 text-indigo-300" />
                </div>
                Saldo Líquido
              </div>
              <div className="bg-white/10 text-white px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/20 backdrop-blur-md shadow-lg">
                Global
              </div>
            </div>
            <AnimatePresence mode="popLayout">
              <motion.p
                key={balance}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black tracking-tighter text-white relative z-10 drop-shadow-2xl"
              >
                {fmt(balance)}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Time/Month Selector */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[24px] bg-card/80 backdrop-blur-xl border border-border p-5 shadow-2xl flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted rounded-2xl transition-all" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-primary/80 font-black uppercase tracking-widest mb-0.5">Apuração</span>
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentMonth.toISOString()}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-lg font-black text-foreground capitalize bg-muted px-4 py-1.5 rounded-xl border border-border"
                  >
                    {format(currentMonth, "MMM / yyyy", { locale: ptBR })}
                  </motion.h2>
                </AnimatePresence>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted rounded-2xl transition-all" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full text-xs font-black uppercase tracking-widest rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 h-10 transition-all active:scale-95"
              onClick={() => setCurrentMonth(new Date())}
            >
              Retornar ao Presente
            </Button>
          </motion.div>
        </div>

        {/* ─── Main Grid Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">

          {/* Left Column (Charts & Graph) */}
          <div className="lg:col-span-8 space-y-6">

            {/* ═══════════════════════════════════════════════ */}
            {/* ═══  ANÁLISE DE FLUXO — Premium Redesign ═══  */}
            {/* ═══════════════════════════════════════════════ */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.003 }}
              className="relative rounded-[32px] overflow-hidden group"
            >
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-br from-violet-500/30 via-transparent to-cyan-500/30 opacity-60 group-hover:opacity-100 transition-opacity duration-1000 z-0">
                <div className="absolute inset-[1px] rounded-[31px] bg-card" />
              </div>

              {/* Card Body */}
              <div className="relative bg-card/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 z-10">
                {/* Mesh Gradient BG */}
                <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
                  <div className="absolute top-[-30%] left-[-20%] w-[60%] h-[60%] bg-violet-600/[0.06] rounded-full blur-[100px] group-hover:bg-violet-500/[0.1] transition-all duration-1000" />
                  <div className="absolute bottom-[-30%] right-[-20%] w-[60%] h-[60%] bg-cyan-600/[0.06] rounded-full blur-[100px] group-hover:bg-cyan-500/[0.1] transition-all duration-1000" />
                  <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%] bg-indigo-600/[0.04] rounded-full blur-[80px]" />
                </div>
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.008)_2px,rgba(0,0,0,0.008)_4px)] dark:bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.008)_2px,rgba(255,255,255,0.008)_4px)] pointer-events-none rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Header */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="h-14 w-14 bg-gradient-to-br from-violet-500/25 to-indigo-600/25 rounded-2xl flex items-center justify-center border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.15)] group-hover:shadow-[0_0_40px_rgba(139,92,246,0.25)] transition-shadow duration-700 relative"
                    >
                      <Activity className="h-7 w-7 text-violet-400" />
                      {/* Icon inner glow */}
                      <div className="absolute inset-0 rounded-2xl bg-violet-400/10 animate-pulse" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-black text-foreground tracking-tighter flex items-center gap-2.5">
                        Análise de Fluxo
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-violet-500/15 rounded-lg text-[10px] text-violet-400 font-black tracking-widest uppercase border border-violet-500/20">
                          <Zap className="h-3 w-3" /> Real-Time
                        </span>
                      </h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1 flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400/70 animate-pulse" />
                        Evolução Mensal Interativa
                      </p>
                    </div>
                  </div>
                  {/* Mini Stats */}
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Entradas</span>
                      <span className="text-sm font-black text-emerald-400 tabular-nums">{fmt(totalIncome)}</span>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Saídas</span>
                      <span className="text-sm font-black text-rose-400 tabular-nums">{fmt(totalExpense)}</span>
                    </div>
                  </div>
                </div>

                {/* Chart Container */}
                <div className="h-[320px] relative z-10 bg-muted/20 rounded-2xl border border-border/50 p-3">
                  <MonthlyChart transactions={transactions} />
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* ═══════════════════════════════════════ */}
              {/* ═══  TIMELINE — Premium Redesign ═══   */}
              {/* ═══════════════════════════════════════ */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.005 }}
                className="relative rounded-[32px] overflow-hidden group"
              >
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-br from-cyan-500/25 via-transparent to-blue-500/25 opacity-50 group-hover:opacity-100 transition-opacity duration-700 z-0">
                  <div className="absolute inset-[1px] rounded-[31px] bg-card" />
                </div>

                <div className="relative bg-card/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-7 z-10">
                  {/* Ambient Glow */}
                  <div className="absolute top-[-25%] right-[-15%] w-[55%] h-[55%] bg-cyan-500/[0.06] rounded-full blur-[90px] pointer-events-none group-hover:bg-cyan-400/[0.12] transition-all duration-1000" />
                  <div className="absolute bottom-[-25%] left-[-15%] w-[45%] h-[45%] bg-blue-500/[0.04] rounded-full blur-[70px] pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3.5">
                      <motion.div
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        className="h-12 w-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-cyan-500/15 shadow-[0_0_25px_rgba(6,182,212,0.12)] group-hover:shadow-[0_0_35px_rgba(6,182,212,0.22)] transition-all duration-700 relative"
                      >
                        <CalendarIcon className="h-5.5 w-5.5 text-cyan-400" />
                        <div className="absolute inset-0 rounded-2xl bg-cyan-400/5 animate-pulse" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-black text-foreground tracking-tighter flex items-center gap-2">
                          Timeline
                        </h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5 flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" />
                          Calendário Térmico
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-[9px] font-black tracking-widest uppercase border border-cyan-500/20 flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                      >
                        <Clock className="h-3 w-3" />
                        Live
                      </motion.div>
                    </div>
                  </div>

                  {/* Calendar */}
                  <div className="relative z-10 bg-muted/10 rounded-2xl border border-border/50 p-3">
                    <FinanceCalendar transactions={filtered} selectedDate={selectedDate} onSelectDate={setSelectedDate} currentMonth={currentMonth} />
                  </div>
                </div>
              </motion.div>

              {/* ═══════════════════════════════════════ */}
              {/* ═══ CATEGORIAS — Premium Redesign ═══  */}
              {/* ═══════════════════════════════════════ */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.005 }}
                className="relative rounded-[32px] overflow-hidden group"
              >
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-br from-amber-500/25 via-transparent to-orange-500/25 opacity-50 group-hover:opacity-100 transition-opacity duration-700 z-0">
                  <div className="absolute inset-[1px] rounded-[31px] bg-card" />
                </div>

                <div className="relative bg-card/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-7 z-10">
                  {/* Ambient Glow */}
                  <div className="absolute top-[-20%] left-[-15%] w-[55%] h-[55%] bg-amber-500/[0.06] rounded-full blur-[90px] pointer-events-none group-hover:bg-amber-400/[0.12] transition-all duration-1000" />
                  <div className="absolute bottom-[-20%] right-[-15%] w-[45%] h-[45%] bg-orange-500/[0.04] rounded-full blur-[70px] pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3.5">
                      <motion.div
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        className="h-12 w-12 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center border border-amber-500/15 shadow-[0_0_25px_rgba(245,158,11,0.12)] group-hover:shadow-[0_0_35px_rgba(245,158,11,0.22)] transition-all duration-700 relative"
                      >
                        <PieChart className="h-5.5 w-5.5 text-amber-400" />
                        <div className="absolute inset-0 rounded-2xl bg-amber-400/5 animate-pulse" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-black text-foreground tracking-tighter">Categorias</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5 flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-pulse" />
                          Distribuição Inteligente
                        </p>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-full text-[9px] font-black tracking-widest uppercase border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.1)]">
                      {Object.keys(catSpending).length} Tipos
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="relative z-10 bg-muted/10 rounded-2xl border border-border/50 p-3">
                    <CategoryChart transactions={filtered} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column (Transactions & Budget Tracking) */}
          <div className="lg:col-span-4 space-y-6">

            {/* ═══════════════════════════════════════════════ */}
            {/* ═══ HISTÓRICO VIVO — Premium Redesign ═══════  */}
            {/* ═══════════════════════════════════════════════ */}
            <motion.div
              variants={itemVariants}
              className="relative rounded-[32px] overflow-hidden group"
            >
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-b from-emerald-500/30 via-transparent to-teal-500/20 opacity-60 group-hover:opacity-100 transition-opacity duration-700 z-0">
                <div className="absolute inset-[1px] rounded-[31px] bg-card" />
              </div>

              <div className="relative bg-card/95 backdrop-blur-2xl rounded-[32px] flex flex-col h-[520px] z-10">
                {/* Ambient Glow */}
                <div className="absolute top-[-20%] left-[-15%] w-[50%] h-[50%] bg-emerald-500/[0.06] rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-400/[0.1] transition-all duration-1000" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/[0.04] rounded-full blur-[60px] pointer-events-none" />

                {/* Header */}
                <div className="p-6 sm:p-7 pb-0">
                  <div className="flex items-center justify-between mb-5 relative z-10 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl flex items-center justify-center border border-emerald-500/15 shadow-[0_0_25px_rgba(16,185,129,0.12)] group-hover:shadow-[0_0_35px_rgba(16,185,129,0.22)] transition-all duration-700 relative">
                        <LayoutList className="h-5.5 w-5.5 text-emerald-400" />
                        <div className="absolute inset-0 rounded-2xl bg-emerald-400/5 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-foreground tracking-tighter">Histórico Vivo</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                          </span>
                          <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">{transactionCount} Registros</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" className="h-9 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest px-4 transition-all border border-emerald-500/15 shadow-[0_0_12px_rgba(16,185,129,0.08)] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] flex items-center gap-1.5" asChild>
                      <Link to="/view-all-actives">
                        <Eye className="h-3.5 w-3.5" />
                        Explorar
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Transaction Feed */}
                <div className="flex-1 overflow-auto px-6 sm:px-7 pb-6 sm:pb-7 custom-scrollbar relative z-10">
                  {/* Top fade */}
                  <div className="sticky top-0 left-0 right-0 h-4 bg-gradient-to-b from-card to-transparent pointer-events-none z-20" />
                  <TransactionList
                    transactions={filtered}
                    onDelete={deleteTransaction}
                    onToggleNotification={toggleNotification}
                  />
                  {/* Bottom fade */}
                  <div className="sticky bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent pointer-events-none z-20" />
                </div>
              </div>
            </motion.div>

            {/* ═══════════════════════════════════════════════════ */}
            {/* ═══ RADAR DE LIMITES — Premium Redesign ═══════   */}
            {/* ═══════════════════════════════════════════════════ */}
            {budgetRules.length > 0 && (
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.005 }}
                className="relative rounded-[32px] overflow-hidden group"
              >
                {/* Animated Border Gradient */}
                <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-br from-rose-500/25 via-transparent to-pink-500/25 opacity-50 group-hover:opacity-100 transition-opacity duration-700 z-0">
                  <div className="absolute inset-[1px] rounded-[31px] bg-card" />
                </div>

                <div className="relative bg-card/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-7 space-y-6 z-10">
                  {/* Ambient Glow */}
                  <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-15%] w-[50%] h-[50%] bg-rose-500/[0.06] rounded-full blur-[80px] group-hover:bg-rose-400/[0.12] transition-all duration-1000" />
                    <div className="absolute bottom-[-20%] left-[-15%] w-[40%] h-[40%] bg-pink-500/[0.04] rounded-full blur-[60px]" />
                  </div>
                  {/* Noise texture */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] mix-blend-overlay pointer-events-none rounded-[32px]" />
                  {/* Scanline on hover */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(244,63,94,0.015)_3px,rgba(244,63,94,0.015)_6px)] pointer-events-none rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Header */}
                  <div className="flex items-center justify-between relative z-10 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 bg-gradient-to-br from-rose-500/20 to-pink-600/20 rounded-2xl flex items-center justify-center border border-rose-500/15 shadow-[0_0_25px_rgba(244,63,94,0.12)] group-hover:shadow-[0_0_35px_rgba(244,63,94,0.22)] transition-all duration-700 relative">
                        <Shield className="h-5.5 w-5.5 text-rose-400" />
                        <div className="absolute inset-0 rounded-2xl bg-rose-400/5 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-foreground tracking-tighter flex items-center gap-2">
                          Radar de Limites
                        </h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1 flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400/60 animate-pulse" />
                          Teto de Gastos Ativo
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-11 w-11 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all border border-rose-500/15 shadow-[0_0_12px_rgba(244,63,94,0.08)] hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]" asChild>
                      <Link to="/estrategia"><Sliders className="h-5 w-5" /></Link>
                    </Button>
                  </div>

                  {/* Budget Rules */}
                  <div className="space-y-5 relative z-10">
                    {budgetRules.map((rule, idx) => {
                      const used = catSpending[rule.category] || 0;
                      const limit = (rule.percentage / 100) * totalExpense;
                      const ratio = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
                      const isDanger = limit > 0 && used > limit;
                      return (
                        <motion.div
                          key={rule.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          className="space-y-3 p-3 rounded-xl bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors duration-300"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2.5 text-foreground/80 font-bold tracking-tight">
                              <span className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: rule.color, boxShadow: `0 0 8px ${rule.color}40` }} />
                              {rule.label}
                            </span>
                            <motion.span
                              animate={isDanger ? { opacity: [1, 0.5, 1], scale: [1, 1.1, 1] } : {}}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className={cn(
                                "font-black text-[10px] tracking-widest px-2.5 py-1 rounded-lg",
                                isDanger
                                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              )}
                            >
                              {isDanger ? "⚠ ALERTA MÁX" : `${ratio.toFixed(0)}%`}
                            </motion.span>
                          </div>
                          {/* Premium Progress Bar */}
                          <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden shadow-inner relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${ratio}%` }}
                              transition={{ duration: 1.5, type: "spring" }}
                              className={cn("absolute inset-0 h-full rounded-full blur-[4px] opacity-60", isDanger ? "bg-rose-500" : "")}
                              style={{ backgroundColor: isDanger ? '' : rule.color }}
                            />
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${ratio}%` }}
                              transition={{ duration: 1.5, type: "spring" }}
                              className={cn("h-full rounded-full relative z-10", isDanger ? "bg-rose-500" : "")}
                              style={{
                                backgroundColor: isDanger ? '' : rule.color,
                                boxShadow: isDanger
                                  ? '0 0 15px rgba(244,63,94,0.6), 0 0 30px rgba(244,63,94,0.3)'
                                  : `0 0 10px ${rule.color}40`
                              }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}

                    {cardCeilings.filter(c => c.limit > 0).map((c, idx) => {
                      const acc = accounts.find(a => a.id === c.accountId);
                      if (!acc) return null;
                      const spent = cardSpending[c.accountId] || 0;
                      const ratio = Math.min((spent / c.limit) * 100, 100);
                      const isDanger = spent > c.limit;
                      return (
                        <motion.div
                          key={c.accountId}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * (budgetRules.length + idx) }}
                          className="space-y-3 p-3 rounded-xl bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors duration-300"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2.5 text-foreground/80 font-bold tracking-tight">
                              <span className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: acc.color, boxShadow: `0 0 8px ${acc.color}40` }} />
                              {acc.name}
                            </span>
                            <span className={cn(
                              "font-black text-[10px] tracking-widest px-2.5 py-1 rounded-lg",
                              isDanger
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                : "bg-muted text-muted-foreground border border-border/50"
                            )}>
                              {ratio.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden shadow-inner relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${ratio}%` }}
                              transition={{ duration: 1.5, type: "spring" }}
                              className={cn("absolute inset-0 h-full rounded-full blur-[4px] opacity-60", isDanger ? "bg-rose-500" : "")}
                              style={{ backgroundColor: isDanger ? '' : acc.color }}
                            />
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${ratio}%` }}
                              transition={{ duration: 1.5, type: "spring" }}
                              className={cn("h-full rounded-full relative z-10", isDanger ? "bg-rose-500" : "")}
                              style={{
                                backgroundColor: isDanger ? '' : acc.color,
                                boxShadow: isDanger
                                  ? '0 0 15px rgba(244,63,94,0.6)'
                                  : `0 0 10px ${acc.color}40`
                              }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
