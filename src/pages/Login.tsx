import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Wallet } from "lucide-react";
import { login } from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPass, setShowPass] = useState(false);
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
      login(form.identifier, form.password);
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl shadow-black/60 min-h-[520px]">

        {/* ── Left Panel: Green Gradient ── */}
        <div className="hidden md:flex md:w-[42%] relative flex-col justify-between p-10 overflow-hidden"
          style={{ background: "linear-gradient(160deg, #1a5c45 0%, #0d3d2e 40%, #0a2a20 100%)" }}>

          {/* Noise/glow overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-30%] right-[-20%] w-[80%] h-[80%] rounded-full bg-emerald-400/10 blur-[80px]" />
            <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-teal-900/40 blur-[60px]" />
          </div>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-black text-lg tracking-tight">
              Cash<span className="italic text-white/60">Flow</span>
            </span>
          </div>

          {/* Main copy */}
          <div className="relative z-10 space-y-3">
            <h1 className="text-3xl font-black text-white leading-tight">
              Entre na sua
              <br />
              conta com us
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-[200px]">
              Acesse e continue de onde parou.
            </p>
          </div>

          {/* Steps */}
          <div className="relative z-10 flex gap-3">
            {[
              { n: "1", label: "Insira seus dados" },
              { n: "2", label: "Acesse o dashboard" },
              { n: "3", label: "Controle tudo" },
            ].map((s) => (
              <div
                key={s.n}
                className="flex-1 bg-white/8 border border-white/10 rounded-xl p-3 backdrop-blur-sm"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/15 text-white text-xs font-bold mb-2">
                  {s.n}
                </span>
                <p className="text-white/70 text-[11px] leading-tight font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel: Dark + White Card ── */}
        <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-sm">

            {/* Heading */}
            <div className="mb-7 text-center">
              <h2 className="text-xl font-bold text-white tracking-tight">Entrar na conta</h2>
              <p className="text-sm text-white/40 mt-1">
                Use seu e-mail ou nome de usuário.
              </p>
            </div>

            {/* White Form Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-black/40 space-y-4">

              {/* Identifier */}
              <div className="space-y-1.5">
                <label htmlFor="identifier" className="block text-[13px] font-semibold text-gray-700">
                  E-mail ou usuário
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="ex. joaosilva ou joao@email.com"
                  value={form.identifier}
                  onChange={handleChange}
                  autoComplete="username"
                  className="w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-[13px] font-semibold text-gray-700">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="w-full h-10 px-3.5 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">Mínimo de 6 caracteres.</p>
              </div>

              {/* Error */}
              {error && (
                <p className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit as unknown as React.MouseEventHandler}
                disabled={loading}
                className="w-full h-10 rounded-lg bg-gray-900 hover:bg-gray-800 active:scale-[0.98] text-white text-sm font-bold transition-all shadow-md disabled:opacity-60"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-[13px] text-white/40 mt-5">
              Não tem conta?{" "}
              <Link to="/cadastro" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
