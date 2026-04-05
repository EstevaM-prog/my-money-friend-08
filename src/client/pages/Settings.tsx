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
import { useToast } from "@/client/hooks/use-toast";
import { useLocalStorage } from "@/client/hooks/use-local-storage";
import { motion } from "framer-motion";
import { cn } from "@/client/lib/utils";
import { useTheme } from "@/components/theme-provider";

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
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
} as const;

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [settings, setSettings] = useLocalStorage<SettingsData>("financaspro_settings", {
    currency: "BRL",
    notifications: true,
    weeklyReport: true,
    budgetAlerts: true,
    twoFactor: false,
  });

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const update = (partial: Partial<SettingsData>) =>
    setSettings((prev) => ({ ...prev, ...partial }));

  function handleSave() {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  }

  return (
    <div className="w-full min-h-screen pb-20 sm:pb-10 font-sans tracking-tight bg-background relative overflow-hidden text-foreground/90 transition-colors duration-500">

      {/* ═══ Ambient Background ═══ */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none z-0" />
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
            className="h-16 w-16 bg-gradient-to-br from-indigo-500/25 to-purple-600/25 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-lg relative shrink-0"
          >
            <SettingsIcon className="h-8 w-8 text-indigo-500" />
            <div className="absolute inset-0 rounded-2xl bg-indigo-400/10 animate-pulse" />
          </motion.div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/50">
              Configurações
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">Ajuste as preferências e segurança do app</p>
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.section variants={itemVariants} className="relative rounded-[32px] overflow-hidden group">
          <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-b from-indigo-500/30 via-transparent to-transparent z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700 font-outfit font-black">
            <div className="absolute inset-[1px] rounded-[31px] bg-card" />
          </div>

          <div className="relative bg-card/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shadow-inner">
                  <Palette className="h-5 w-5 text-indigo-500" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">Aparência e Localização</h2>
              </div>
            </div>

            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn("p-2 rounded-lg", isDark ? "bg-primary/20" : "bg-orange-500/20 shadow-inner border border-orange-500/20")}>
                    {isDark ? <Moon className="h-4 w-4 text-primary font-bold" /> : <Sun className="h-4 w-4 text-orange-500 font-bold" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground/90 uppercase text-[12px] tracking-widest font-outfit">Tema {isDark ? "Escuro (Matrix)" : "Claro"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">Use a estética hacker</p>
                  </div>
                </div>
                <Switch
                  checked={isDark}
                  onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
                  className="data-[state=checked]:bg-indigo-500"
                />
              </div>

              {/* Currency Select */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/30 transition-colors gap-4">
                <div>
                  <p className="font-bold text-sm text-foreground/90 uppercase text-[12px] tracking-widest font-outfit">Moeda Padrão</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">Símbolo usado em toda a aplicação</p>
                </div>
                <Select value={settings.currency} onValueChange={(v) => update({ currency: v })}>
                  <SelectTrigger className="w-full sm:w-[220px] bg-muted/50 border-border text-foreground rounded-xl focus:ring-1 focus:ring-indigo-500/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-popover-foreground rounded-xl">
                    <SelectItem value="BRL" className="focus:bg-muted rounded-lg cursor-pointer">R$ - Real Brasileiro</SelectItem>
                    <SelectItem value="USD" className="focus:bg-muted rounded-lg cursor-pointer">$ - Dólar Americano</SelectItem>
                    <SelectItem value="EUR" className="focus:bg-muted rounded-lg cursor-pointer">€ - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Notifications Section */}
        <motion.section variants={itemVariants} className="relative rounded-[32px] overflow-hidden group">
          <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-b from-sky-500/30 via-transparent to-transparent z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-[1px] rounded-[31px] bg-card" />
          </div>

          <div className="relative bg-card/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/50 font-outfit font-black tracking-tight">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 shadow-inner">
                  <Bell className="h-5 w-5 text-sky-500" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">Notificações</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-bold text-sm text-foreground/90 uppercase text-[12px] tracking-widest font-outfit">Notificações por Email</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">Receba alertas das suas transações diárias</p>
                </div>
                <Switch checked={settings.notifications} onCheckedChange={(v) => update({ notifications: v })} className="data-[state=checked]:bg-sky-500" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-bold text-sm text-foreground/90 uppercase text-[12px] tracking-widest font-outfit">Relatório Semanal</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">Receba um compilado detalhado todo domingo</p>
                </div>
                <Switch checked={settings.weeklyReport} onCheckedChange={(v) => update({ weeklyReport: v })} className="data-[state=checked]:bg-sky-500" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-bold text-sm text-foreground/90 uppercase text-[12px] tracking-widest font-outfit flex items-center gap-2 font-black">
                    Alertas de Orçamento
                    <span className="bg-rose-500/20 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-widest border border-rose-500/20">Crítico</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">Seja avisado ao se aproximar do limite de gastos</p>
                </div>
                <Switch checked={settings.budgetAlerts} onCheckedChange={(v) => update({ budgetAlerts: v })} className="data-[state=checked]:bg-sky-500" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Security Section */}
        <motion.section variants={itemVariants} className="relative rounded-[32px] overflow-hidden group">
          <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-b from-emerald-500/30 via-transparent to-transparent z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-[1px] rounded-[31px] bg-card" />
          </div>

          <div className="relative bg-card/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/50 font-outfit font-black tracking-tight">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-inner">
                  <Shield className="h-5 w-5 text-emerald-500" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground font-black">Segurança Avançada</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-bold text-sm text-foreground/90 uppercase text-[12px] tracking-widest font-outfit">Autenticação 2FA</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">Exigir código extra vindo do seu app Authy</p>
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
            className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black text-lg tracking-tight flex items-center justify-center gap-3 shadow-xl transition-all transform hover:-translate-y-1"
          >
            <CheckCircle2 className="h-6 w-6" />
            Salvar Preferências Atuais
          </Button>
        </motion.div>

      </motion.div>
    </div>
  );
}
