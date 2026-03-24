import { useState } from "react";
import { 
  CreditCard, 
  ChevronLeft, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Info,
  QrCode,
  ArrowRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Payment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<"card" | "pix">("card");
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate payment
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Pagamento realizado com sucesso!");
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* ─── Ambient Glows ─── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 rounded-full bg-purple-600/[0.08] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 rounded-full bg-blue-600/[0.08] blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-24 relative z-10">
        
        {/* Back Link */}
        <Link 
          to="/planos" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-white transition-colors mb-10 group"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Voltar para Planos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
          
          {/* Left Column: Form */}
          <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
            <header className="space-y-3">
              <h1 
                className="text-3xl md:text-5xl font-black tracking-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Checkout Seguro
              </h1>
              <p className="text-white/40 font-medium">
                Escolha sua forma de pagamento e finalize sua assinatura.
              </p>
            </header>

            {/* Payment Method Selector */}
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

            {method === "card" ? (
              <form onSubmit={handlePayment} className="space-y-8 max-w-xl">
                {/* Visual Card Preview */}
                <div className="relative h-48 sm:h-56 w-full max-w-sm rounded-[1.5rem] bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-8 shadow-2xl flex flex-col justify-between overflow-hidden group">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Número do Cartão</label>
                    <Input 
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="h-14 bg-white/[0.03] border-white/[0.08] rounded-xl focus:ring-purple-500/20 px-5 text-base font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Nome no Cartão</label>
                    <Input 
                      placeholder="NOME COMPLETO"
                      value={name}
                      onChange={(e) => setName(e.target.value.toUpperCase())}
                      className="h-14 bg-white/[0.03] border-white/[0.08] rounded-xl focus:ring-purple-500/20 px-5 text-base font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Validade</label>
                    <Input 
                      placeholder="MM/AA"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="h-14 bg-white/[0.03] border-white/[0.08] rounded-xl focus:ring-purple-500/20 px-5 text-base font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">CVV</label>
                    <Input 
                      placeholder="000"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="h-14 bg-white/[0.03] border-white/[0.08] rounded-xl focus:ring-purple-500/20 px-5 text-base font-medium"
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-lg shadow-xl shadow-purple-600/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3 border-0"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Confirmar Assinatura
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="p-10 rounded-[2rem] bg-white/[0.03] border border-white/[0.06] text-center space-y-8 max-w-xl animate-in zoom-in-95 duration-500">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Pague com Pix</h3>
                  <p className="text-sm text-white/40">A assinatura é liberada instantaneamente.</p>
                </div>
                
                <div className="mx-auto w-48 h-48 p-4 rounded-3xl bg-white flex items-center justify-center shadow-inner relative group">
                  <QrCode className="h-full w-full text-black" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center backdrop-blur-sm">
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
                  {isLoading ? "Processando..." : "Já realizei o pagamento"}
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Summary */}
          <aside className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
             <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/[0.06] backdrop-blur-3xl space-y-8">
                <div className="space-y-4">
                  <h2 className="text-lg font-bold tracking-tight">Resumo do Pedido</h2>
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">Plano Business</p>
                      <p className="text-[11px] font-medium text-purple-400">Mudança automática</p>
                    </div>
                    <p className="text-lg font-black">$20<span className="text-[10px] text-white/40 font-bold">/mês</span></p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                     <span className="text-white/40">Subtotal</span>
                     <span className="font-bold">$20.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-white/40">Taxas</span>
                     <span className="font-bold text-emerald-400">$0.00</span>
                  </div>
                  <div className="h-px bg-white/[0.04] my-2" />
                  <div className="flex justify-between items-center pt-2">
                     <span className="text-base font-bold text-white">Total</span>
                     <span className="text-2xl font-black text-white">$20.00</span>
                  </div>
                </div>

                <ul className="space-y-3 pt-2">
                  {[
                    "Acesso ilimitado à IA",
                    "Insights em tempo real",
                    "Relatórios avançados",
                    "Suporte prioritário"
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-[13px] text-white/45 font-medium">
                       <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                       {f}
                    </li>
                  ))}
                </ul>
             </div>

             {/* Trust badges */}
             <div className="p-6 space-y-5">
                <div className="flex items-center gap-3 text-white/30">
                   <ShieldCheck className="h-5 w-5" />
                   <p className="text-[11px] font-bold uppercase tracking-widest">Pagamento 100% Seguro</p>
                </div>
                <div className="flex items-center gap-3 text-white/30">
                   <Lock className="h-5 w-5" />
                   <p className="text-[11px] font-bold uppercase tracking-widest">Proteção de Dados PCI-DSS</p>
                </div>
             </div>
          </aside>
        </div>
      </div>

      {/* ─── Extra Decorative ─── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 0L105.8 84.2L190 90L105.8 95.8L100 180L94.2 95.8L10 90L94.2 84.2L100 0Z" fill="currentColor"/>
    </svg>
  );
}
