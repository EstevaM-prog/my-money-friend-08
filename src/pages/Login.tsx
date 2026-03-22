import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wallet,
  Eye,
  EyeOff,
  AtSign,
  Lock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "@/lib/auth";

const highlights = [
  { icon: TrendingUp, text: "Dashboard em tempo real" },
  { icon: ShieldCheck, text: "Dados 100% privados e seguros" },
  { icon: Target, text: "Metas e planejamento inteligente" },
];

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.identifier || !form.password) {
      setError("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      login(form.identifier, form.password, remember);
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex">

      {/* ─── Left Panel (decorativo, desktop only) ─── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden gradient-primary flex-col justify-between p-12">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full bg-white/10 blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-black/20 blur-[80px]" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">
            Cash<span className="italic opacity-80">Flow</span>
          </span>
        </div>

        {/* Main message */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="h-3 w-3" /> Bem-vindo de volta
            </div>
            <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
              Sua jornada
              <br />
              financeira
              <br />
              <span className="text-white/70 italic">continua aqui.</span>
            </h1>
            <p className="mt-4 text-white/70 text-base leading-relaxed max-w-xs">
              Acesse seu painel e veja todo o progresso que você conquistou.
            </p>
          </div>

          {/* Feature highlights */}
          <ul className="space-y-3">
            {highlights.map((h) => (
              <li key={h.text} className="flex items-center gap-3">
                <div className="p-2 bg-white/15 rounded-xl border border-white/20 flex-shrink-0">
                  <h.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/85 text-sm font-medium">{h.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-white/40 text-xs font-medium">
          © {new Date().getFullYear()} CashFlow · Gestão Financeira Premium
        </p>
      </div>

      {/* ─── Right Panel (form) ─── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Subtle ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="w-full max-w-sm relative z-10">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Link to="/apresentacao" className="inline-flex items-center gap-2.5 group">
              <div className="p-2.5 rounded-xl gradient-primary shadow-lg shadow-emerald-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">
                Cash<span className="text-primary italic">Flow</span>
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8 space-y-1">
            <h2 className="text-2xl font-black tracking-tight">Entrar na conta</h2>
            <p className="text-muted-foreground text-sm">
              Use seu e-mail ou nome de usuário para acessar.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border/50 rounded-2xl p-7 shadow-xl shadow-black/5 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

              {/* Identifier field */}
              <div className="space-y-1.5">
                <Label htmlFor="identifier" className="text-sm font-semibold">
                  E-mail ou usuário
                </Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="identifier"
                    name="identifier"
                    type="text"
                    placeholder="seu@email.com ou joaosilva"
                    value={form.identifier}
                    onChange={handleChange}
                    autoComplete="username"
                    className="pl-9 h-11 rounded-xl border-border/60 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold">
                    Senha
                  </Label>
                  <Link
                    to="/suporte"
                    className="text-xs text-primary font-medium hover:underline underline-offset-2"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="pl-9 pr-10 h-11 rounded-xl border-border/60 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
                    aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPass ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(!!v)}
                  className="rounded-md"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer select-none text-muted-foreground"
                >
                  Lembrar por 7 dias
                </Label>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-2.5 text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3">
                  <span className="mt-0.5 flex-shrink-0 text-destructive">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 gradient-primary border-0 text-white font-bold rounded-xl gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  <>
                    Entrar <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-card text-xs text-muted-foreground font-medium">
                  Não tem conta?
                </span>
              </div>
            </div>

            {/* Register link */}
            <Button
              asChild
              variant="outline"
              className="w-full h-11 rounded-xl font-bold border-border/60 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all"
            >
              <Link to="/cadastro">Criar conta grátis</Link>
            </Button>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Precisa de ajuda?{" "}
            <Link to="/suporte" className="text-primary font-semibold hover:underline underline-offset-2">
              Falar com suporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
