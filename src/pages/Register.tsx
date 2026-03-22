import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Wallet } from "lucide-react";
import { register } from "@/lib/auth";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { firstName, lastName, email, password, confirm } = form;
    if (!firstName || !lastName || !email || !password || !confirm) {
      setError("Preencha todos os campos.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      register(`${firstName} ${lastName}`, email, password);
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl shadow-black/60 min-h-[560px]">

        {/* ── Left Panel: Green Gradient ── */}
        <div
          className="hidden md:flex md:w-[42%] relative flex-col justify-between p-10 overflow-hidden"
          style={{ background: "linear-gradient(160deg, #1a5c45 0%, #0d3d2e 40%, #0a2a20 100%)" }}
        >
          {/* Glow overlays */}
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
              Get Started
              <br />
              with Us
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-[200px]">
              Complete esses passos simples para criar sua conta.
            </p>
          </div>

          {/* Steps */}
          <div className="relative z-10 flex gap-3">
            {[
              { n: "1", label: "Crie sua conta" },
              { n: "2", label: "Configure o app" },
              { n: "3", label: "Seu perfil" },
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
              <h2 className="text-xl font-bold text-white tracking-tight">Criar conta</h2>
              <p className="text-sm text-white/40 mt-1">
                Preencha seus dados para começar.
              </p>
            </div>

            {/* White Form Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-black/40 space-y-4">

              {/* First Name + Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="firstName" className="block text-[13px] font-semibold text-gray-700">
                    Nome
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="ex. João"
                    value={form.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    className="w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="lastName" className="block text-[13px] font-semibold text-gray-700">
                    Sobrenome
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="ex. Silva"
                    value={form.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    className="w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[13px] font-semibold text-gray-700">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ex. joaosilva@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
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
                    placeholder="Mínimo 6 caracteres"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
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
                <p className="text-[11px] text-gray-400">Deve ter pelo menos 6 caracteres.</p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirm" className="block text-[13px] font-semibold text-gray-700">
                  Confirmar senha
                </label>
                <div className="relative">
                  <input
                    id="confirm"
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repita a senha"
                    value={form.confirm}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="w-full h-10 px-3.5 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
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
                {loading ? "Criando conta..." : "Criar conta"}
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-[13px] text-white/40 mt-5">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
