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

export default function SettingsPage() {
  const { toast } = useToast();
  const [currency, setCurrency] = useState("BRL");
  const [notifications, setNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  function handleSave() {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl gradient-primary">
          <SettingsIcon className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
      </div>

      {/* Appearance */}
      <section className="bg-card rounded-xl p-6 card-shadow space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Aparência</h2>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-warning" />}
            <div>
              <p className="font-medium text-sm">Tema {isDark ? "Escuro" : "Claro"}</p>
              <p className="text-xs text-muted-foreground">Altere a aparência do sistema</p>
            </div>
          </div>
          <Switch checked={isDark} onCheckedChange={setIsDark} />
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Moeda</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="BRL">R$ - Real Brasileiro</SelectItem>
              <SelectItem value="USD">$ - Dólar Americano</SelectItem>
              <SelectItem value="EUR">€ - Euro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-card rounded-xl p-6 card-shadow space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Notificações</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Notificações por email</p>
              <p className="text-xs text-muted-foreground">Receba alertas e atualizações</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Relatório semanal</p>
              <p className="text-xs text-muted-foreground">Resumo das finanças por email</p>
            </div>
            <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Alertas de orçamento</p>
              <p className="text-xs text-muted-foreground">Aviso quando ultrapassar limites</p>
            </div>
            <Switch checked={budgetAlerts} onCheckedChange={setBudgetAlerts} />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-card rounded-xl p-6 card-shadow space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Segurança</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Autenticação de dois fatores</p>
            <p className="text-xs text-muted-foreground">Maior segurança para sua conta</p>
          </div>
          <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
        </div>
      </section>

      <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground font-semibold text-base py-5">
        Salvar Configurações
      </Button>
    </div>
  );
}
