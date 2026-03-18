import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Palette, Bell, Shield, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface SettingsData {
  currency: string;
  notifications: boolean;
  weeklyReport: boolean;
  budgetAlerts: boolean;
  twoFactor: boolean;
}

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
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl gradient-primary">
          <SettingsIcon className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Configurações</h1>
      </div>

      {/* Appearance */}
      <section className="bg-card rounded-xl p-5 sm:p-6 card-shadow space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="h-5 w-5 text-primary" />
          <h2 className="text-base sm:text-lg font-semibold">Aparência</h2>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {isDark ? <Moon className="h-5 w-5 text-primary shrink-0" /> : <Sun className="h-5 w-5 text-warning shrink-0" />}
            <div className="min-w-0">
              <p className="font-medium text-sm">Tema {isDark ? "Escuro" : "Claro"}</p>
              <p className="text-xs text-muted-foreground hidden sm:block">Altere a aparência do sistema</p>
            </div>
          </div>
          <Switch checked={isDark} onCheckedChange={setIsDark} />
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Moeda</Label>
          <Select value={settings.currency} onValueChange={(v) => update({ currency: v })}>
            <SelectTrigger className="w-full sm:w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="BRL">R$ - Real Brasileiro</SelectItem>
              <SelectItem value="USD">$ - Dólar Americano</SelectItem>
              <SelectItem value="EUR">€ - Euro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-card rounded-xl p-5 sm:p-6 card-shadow space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-base sm:text-lg font-semibold">Notificações</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-sm">Notificações por email</p>
              <p className="text-xs text-muted-foreground hidden sm:block">Receba alertas e atualizações</p>
            </div>
            <Switch checked={settings.notifications} onCheckedChange={(v) => update({ notifications: v })} />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-sm">Relatório semanal</p>
              <p className="text-xs text-muted-foreground hidden sm:block">Resumo das finanças por email</p>
            </div>
            <Switch checked={settings.weeklyReport} onCheckedChange={(v) => update({ weeklyReport: v })} />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-sm">Alertas de orçamento</p>
              <p className="text-xs text-muted-foreground hidden sm:block">Aviso quando ultrapassar limites</p>
            </div>
            <Switch checked={settings.budgetAlerts} onCheckedChange={(v) => update({ budgetAlerts: v })} />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-card rounded-xl p-5 sm:p-6 card-shadow space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-base sm:text-lg font-semibold">Segurança</h2>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium text-sm">Autenticação de dois fatores</p>
            <p className="text-xs text-muted-foreground hidden sm:block">Maior segurança para sua conta</p>
          </div>
          <Switch checked={settings.twoFactor} onCheckedChange={(v) => update({ twoFactor: v })} />
        </div>
      </section>

      <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground font-semibold text-base py-5">
        Salvar Configurações
      </Button>
    </div>
  );
}
