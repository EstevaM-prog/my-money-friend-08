import { useState, useEffect } from "react";
import {
  CreditCard,
  ChevronLeft,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Info,
  QrCode,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/client/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Use PLAN_DETAILS from PlanMode.tsx
import { PLAN_DETAILS } from "./PlanMode";

export default function Payment() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultPlanId = searchParams.get("plan") || "business";

  // Validate plan parameter against PLAN_DETAILS map
  const initialPlan = PLAN_DETAILS.find(p => p.id === defaultPlanId) || PLAN_DETAILS[1];

  const [method, setMethod] = useState<"card" | "pix">("card");
  const [isLoading, setIsLoading] = useState(false);
  const [activePlan, setActivePlan] = useState(initialPlan);

  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    // Keep URL parameter in sync if user changes plan
    setSearchParams({ plan: activePlan.id });
  }, [activePlan, setSearchParams]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only keep digits
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 16);
    // Add space every 4 digits
    const formatted = digitsOnly.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
    setFormError("");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only letters and spaces allowed
    const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setName(lettersOnly.toUpperCase());
    setFormError("");
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only digits
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 4);
    // Format MM/AA
    let formatted = digitsOnly;
    if (digitsOnly.length > 2) {
      formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
    }
    setExpiry(formatted);
    setFormError("");
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(digitsOnly);
    setFormError("");
  };

  const validateCardForm = () => {
    const cleanCard = cardNumber.replace(/\s/g, "");
    const cleanExpiry = expiry.replace("/", "");

    if (cleanCard.length !== 16) return false;
    if (name.trim().length === 0) return false;
    if (cleanExpiry.length !== 4) return false;
    // Basic MM/AA check (Month 01-12)
    const month = parseInt(cleanExpiry.slice(0, 2), 10);
    if (month < 1 || month > 12) return false;
    if (cvv.length < 3) return false;

    return true;
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (method === "card") {
      if (!validateCardForm()) {
        setFormError("Por favor, preencha todos os campos corretamente.");
        toast.error("Erro na validação do formulário.");
        return;
      }
    }

    setIsLoading(true);
    setFormError("");

    // Simulate payment
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Pagamento realizado com sucesso! Assinatura Ativa.");
      navigate("/");
    }, 2000);
  };

  const taxes = 0;
  const total = activePlan.numericPrice + taxes;

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">

      {/* ─── Ambient Glows ─── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 rounded-full bg-purple-600/[0.08] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 rounded-full bg-blue-600/[0.08] blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 relative z-10">

        {/* Back Link */}
        <Link
          to="/planos"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-white transition-colors mb-10 group"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Voltar para Planos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 items-start">

          {/* Left Column: Form */}
          <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
            <header className="space-y-3">
              <h1
                className="text-3xl md:text-5xl font-black tracking-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Checkout Seguro
              </h1>
              <p className="text-white/40 font-medium max-w-md">
                Você escolheu o plano <strong className="text-white">{activePlan.name}</strong>. Finalize os dados abaixo para concluir.
              </p>
            </header>

            {/* Plan Switcher (Fast Toggle) */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Alterar Plano Escolhido</p>
              <div className="flex flex-wrap gap-3">
                {PLAN_DETAILS.map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => setActivePlan(plan)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl border font-bold text-sm transition-all duration-300",
                      activePlan.id === plan.id
                        ? "bg-purple-600 text-white border-purple-500/50 shadow-lg shadow-purple-500/20"
                        : "bg-white/[0.03] text-white/50 border-white/10 hover:border-white/30 hover:text-white"
                    )}
                  >
                    {plan.name} — {plan.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-4">
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Método de Pagamento</p>
              <div className="flex gap-4 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] w-fit">
                <button
                  onClick={() => setMethod("card")}
                  className={cn(
                    "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                    method === "card"
                      ? "bg-white text-black shadow-lg"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                >
                  <CreditCard className="h-4 w-4" />
                  Cartão de Crédito
                </button>
                <button
                  onClick={() => setMethod("pix")}
                  className={cn(
                    "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                    method === "pix"
                      ? "bg-white text-black shadow-lg"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                >
                  <QrCode className="h-4 w-4" />
                  Pix Instantâneo
                </button>
              </div>
            </div>

            {method === "card" ? (
              <form onSubmit={handlePayment} className="space-y-8 max-w-xl">
                {/* Visual Card Preview */}
                <div className="relative h-48 sm:h-56 w-full max-w-sm rounded-[1.5rem] bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-8 shadow-2xl flex flex-col justify-between overflow-hidden group border border-white/10">
                  <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Sparkles className="h-40 w-40 text-white" />
                  </div>
                  <div className="flex justify-between items-start relative z-10">
                    <div className="h-10 w-14 rounded-md bg-white/20 border border-white/30 backdrop-blur-sm" />
                    <CreditCard className="h-8 w-8 text-white/80" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <p className="text-xl sm:text-2xl font-bold tracking-[0.2em] text-white">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </p>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Titular</p>
                        <p className="text-sm font-bold text-white uppercase truncate max-w-[150px]">{name || "SEU NOME"}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Validade</p>
                        <p className="text-sm font-bold text-white">{expiry || "MM/AA"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                  <div className="sm:col-span-2 space-y-2">
                    <label className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                      <span>Número do Cartão</span>
                      <span className="text-[10px] lowercase text-white/20">Apenas numéricos, 16 dígitos</span>
                    </label>
                    <Input
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19} // 16 digits + 3 spaces
                      className="h-14 bg-white/[0.03] border-white/[0.08] rounded-xl focus:ring-purple-500/20 px-5 text-base font-medium transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                      <span>Nome no Cartão</span>
                      <span className="text-[10px] lowercase text-white/20">Como impresso no cartão</span>
                    </label>
                    <Input
                      placeholder="NOME COMPLETO"
                      value={name}
                      onChange={handleNameChange}
                      className="h-14 bg-white/[0.03] border-white/[0.08] rounded-xl focus:ring-purple-500/20 px-5 text-base font-medium transition-colors uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Validade (MM/AA)</label>
                    <Input
                      placeholder="MM/AA"
                      value={expiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      className="h-14 bg-white/[0.03] border-white/[0.08] rounded-xl focus:ring-purple-500/20 px-5 text-base font-medium transition-colors text-center"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">CVV</label>
                    <Input
                      placeholder="000"
                      value={cvv}
                      onChange={handleCvvChange}
                      maxLength={4}
                      type="password"
                      className="h-14 bg-white/[0.03] border-white/[0.08] rounded-xl focus:ring-purple-500/20 px-5 text-base font-medium transition-colors text-center font-mono tracking-widest"
                    />
                  </div>
                </div>

                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex items-center gap-3"
                  >
                    <Info className="h-5 w-5" />
                    {formError}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-lg shadow-xl shadow-purple-600/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3 border-0"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Confirmar Pagamento Seguro
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="p-10 rounded-[2rem] bg-white/[0.03] border border-white/[0.06] text-center space-y-8 max-w-xl animate-in zoom-in-95 duration-500">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Pague com Pix</h3>
                  <p className="text-sm text-white/40">A assinatura do seu <strong className="text-white">{activePlan.name}</strong> é liberada instantaneamente.</p>
                </div>

                <div className="mx-auto w-48 h-48 p-4 rounded-3xl bg-white flex items-center justify-center shadow-inner relative group">
                  <QrCode className="h-full w-full text-black" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center backdrop-blur-sm cursor-pointer">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white">Clique para copiar</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between gap-4">
                    <p className="text-xs font-medium text-white/40 truncate">00020101021226840014br.gov.bcb.pix0124cashflow...</p>
                    <button className="text-[10px] font-bold uppercase text-purple-400 hover:text-purple-300">Copiar</button>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-white/30 text-[11px] font-medium">
                    <Info className="h-3 w-3" />
                    O código expira em 30 minutos.
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full h-14 rounded-xl bg-white text-black hover:bg-white/90 font-bold transition-all active:scale-95 border-0"
                >
                  {isLoading ? "Processando..." : "Simular que paguei"}
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Summary */}
          <aside className="space-y-6 lg:sticky top-32 animate-in fade-in slide-in-from-right-4 duration-700 w-full relative">
            <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/[0.06] backdrop-blur-3xl space-y-8 overflow-hidden relative">
              {/* Visual Flair in summary based on current plan */}
              <motion.div
                key={activePlan.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none"
              />

              <div className="space-y-4 relative z-10">
                <h2 className="text-lg font-bold tracking-tight">Resumo do Pedido</h2>

                {/* Dynamic Plan display in summary using Framer Motion */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePlan.id}
                    initial={{ y: 10, filter: "blur(4px)", opacity: 0 }}
                    animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                    exit={{ y: -10, filter: "blur(4px)", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 90, damping: 20 }}
                    className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative isolate"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{activePlan.name}</p>
                      <p className="text-[11px] font-medium text-purple-400">Renovação automática</p>
                    </div>
                    <p className="text-xl sm:text-lg font-black">{activePlan.price}<span className="text-[10px] text-white/40 font-bold"> /{activePlan.period.replace("per ", "").replace(" month", "mês")}</span></p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Subtotal</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activePlan.price}
                      initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(4px)" }}
                      transition={{ duration: 0.3 }}
                      className="font-bold"
                    >
                      {activePlan.price}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Taxas e Impostos</span>
                  <span className="font-bold text-emerald-400">Isento</span>
                </div>
                <div className="h-px bg-white/[0.04] my-2" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-bold text-white">Total a pagar hoje</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activePlan.price}
                      initial={{ y: 5, opacity: 0, filter: "blur(4px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: -5, opacity: 0, filter: "blur(4px)" }}
                      transition={{ type: "spring", stiffness: 90, damping: 20 }}
                      className="text-3xl font-black text-white"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {activePlan.price}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <div className="pt-2 relative z-10">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">O que está incluso</p>
                <ul className="space-y-3">
                  <AnimatePresence mode="wait">
                    <motion.div key={activePlan.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {activePlan.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-[13px] text-white/50 font-medium mb-3">
                          <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </ul>
              </div>
            </div>

            {/* Trust badges */}
            <div className="p-6 space-y-5 rounded-3xl bg-white/[0.01] border border-white/[0.02] backdrop-blur-xl">
              <div className="flex items-center gap-3 text-white/30">
                <ShieldCheck className="h-5 w-5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">Pagamento Criptografado</p>
                  <p className="text-[10px] uppercase font-medium">SSL de 256-bits</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/30">
                <Lock className="h-5 w-5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">Proteção de Dados</p>
                  <p className="text-[10px] uppercase font-medium">Conformidade com LGPD/PCI-DSS</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
