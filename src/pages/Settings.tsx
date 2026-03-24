import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Palette, Bell, Shield, Sun, Moon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SettingsData {
  currency: string;
  notifications: boolean;
  weeklyReport: boolean;
  budgetAlerts: boolean;
  twoFactor: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useLocalStorage<SettingsData>("financaspro_settings", {
    currency: "BRL",
    notifications: true,
    weeklyReport: true,
    budgetAlerts: true,
    twoFactor: false,
  });

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const update = (partial: Partial<SettingsData>) =>
    setSettings((prev) => ({ ...prev, ...partial }));

  function handleSave() {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  }

  return (
    <div className="w-full min-h-screen pb-20 sm:pb-10 font-sans tracking-tight bg-[#030306] relative overflow-hidden text-white/90">
      
      {/* ═══ Ambient Background ═══ */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay pointer-events-none z-0" />
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-500/[0.06] rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-purple-500/[0.05] rounded-full blur-[150px] pointer-events-none z-0" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[700px] mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="h-16 w-16 bg-gradient-to-br from-indigo-500/25 to-purple-600/25 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.15)] relative shrink-0"
          >
            <SettingsIcon className="h-8 w-8 text-indigo-400" />
            <div className="absolute inset-0 rounded-2xl bg-indigo-400/10 animate-pulse" />
          </motion.div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50">
              Configurações
            </h1>
            <p className="text-sm text-white/40 font-medium mt-1">Ajuste as preferências e segurança do app</p>
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.section variants={itemVariants} className="relative rounded-[32px] overflow-hidden group">
          <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-b from-indigo-500/30 via-transparent to-transparent z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-[1px] rounded-[31px] bg-[#080810]" />
          </div>

          <div className="relative bg-[#080810]/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                  <Palette className="h-5 w-5 text-indigo-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Aparência e Localização</h2>
              </div>
            </div>

            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn("p-2 rounded-lg", isDark ? "bg-white/10" : "bg-warning/20")}>
                    {isDark ? <Moon className="h-4 w-4 text-white" /> : <Sun className="h-4 w-4 text-warning" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white/90">Tema {isDark ? "Escuro (Matrix)" : "Claro"}</p>
                    <p className="text-xs text-white/40 mt-0.5 font-medium">Use a estética hacker</p>
                  </div>
                </div>
                <Switch checked={isDark} onCheckedChange={setIsDark} className="data-[state=checked]:bg-indigo-500" />
              </div>

              {/* Currency Select */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors gap-4">
                <div>
                  <p className="font-bold text-sm text-white/90">Moeda Padrão</p>
                  <p className="text-xs text-white/40 mt-0.5 font-medium">Símbolo usado em toda a aplicação</p>
                </div>
                <Select value={settings.currency} onValueChange={(v) => update({ currency: v })}>
                  <SelectTrigger className="w-full sm:w-[220px] bg-white/[0.03] border-white/10 text-white rounded-xl focus:ring-1 focus:ring-indigo-500/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0B10] border-white/10 text-white rounded-xl">
                    <SelectItem value="BRL" className="focus:bg-white/10 focus:text-white rounded-lg">R$ - Real Brasileiro</SelectItem>
                    <SelectItem value="USD" className="focus:bg-white/10 focus:text-white rounded-lg">$ - Dólar Americano</SelectItem>
                    <SelectItem value="EUR" className="focus:bg-white/10 focus:text-white rounded-lg">€ - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Notifications Section */}
        <motion.section variants={itemVariants} className="relative rounded-[32px] overflow-hidden group">
          <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-b from-sky-500/30 via-transparent to-transparent z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-[1px] rounded-[31px] bg-[#080810]" />
          </div>

          <div className="relative bg-[#080810]/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
                  <Bell className="h-5 w-5 text-sky-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Notificações</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                <div>
                  <p className="font-bold text-sm text-white/90">Notificações por Email</p>
                  <p className="text-xs text-white/40 mt-0.5 font-medium">Receba alertas das suas transações diárias</p>
                </div>
                <Switch checked={settings.notifications} onCheckedChange={(v) => update({ notifications: v })} className="data-[state=checked]:bg-sky-500" />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                <div>
                  <p className="font-bold text-sm text-white/90">Relatório Semanal</p>
                  <p className="text-xs text-white/40 mt-0.5 font-medium">Receba um compilado detalhado todo domingo</p>
                </div>
                <Switch checked={settings.weeklyReport} onCheckedChange={(v) => update({ weeklyReport: v })} className="data-[state=checked]:bg-sky-500" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                <div>
                  <p className="font-bold text-sm text-white/90 flex items-center gap-2">
                    Alertas de Orçamento
                    <span className="bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-widest border border-rose-500/20">Crítico</span>
                  </p>
                  <p className="text-xs text-white/40 mt-0.5 font-medium">Seja avisado ao se aproximar do limite de gastos</p>
                </div>
                <Switch checked={settings.budgetAlerts} onCheckedChange={(v) => update({ budgetAlerts: v })} className="data-[state=checked]:bg-sky-500" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Security Section */}
        <motion.section variants={itemVariants} className="relative rounded-[32px] overflow-hidden group">
          <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-b from-emerald-500/30 via-transparent to-transparent z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-[1px] rounded-[31px] bg-[#080810]" />
          </div>

          <div className="relative bg-[#080810]/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Segurança Avançada</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                <div>
                  <p className="font-bold text-sm text-white/90">Autenticação 2FA</p>
                  <p className="text-xs text-white/40 mt-0.5 font-medium">Exigir código extra vindo do seu app Authy</p>
                </div>
                <Switch checked={settings.twoFactor} onCheckedChange={(v) => update({ twoFactor: v })} className="data-[state=checked]:bg-emerald-500" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Save Button */}
        <motion.div variants={itemVariants} className="pt-4 pb-10">
          <Button 
            onClick={handleSave} 
            className="w-full h-16 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-lg tracking-tight flex items-center justify-center gap-3 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.6)] transition-all transform hover:-translate-y-1"
          >
            <CheckCircle2 className="h-6 w-6" />
            Salvar Preferências Atuais
          </Button>
        </motion.div>

      </motion.div>
    </div>
  );
}
