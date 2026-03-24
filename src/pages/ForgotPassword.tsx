import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Wallet } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate("/email-enviado", { state: { email } });
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-600/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Back Link */}
        <button
          onClick={() => navigate("/login")}
          className="absolute left-0 -top-12 flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back To Main
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2.5 rounded-2xl bg-blue-600/20 border border-blue-500/30">
            <Wallet className="h-6 w-6 text-blue-500" />
          </div>
          <span className="text-white font-black text-2xl tracking-tighter">
            Cash<span className="text-blue-500 italic">Flow</span>
          </span>
        </div>

        {/* Card */}
        <div className="w-full bg-[#16161a] border border-white/5 rounded-[32px] p-8 shadow-2xl shadow-black/50">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20 rotate-3">
              <Send className="h-10 w-10 text-blue-500 -rotate-12" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Forgot password?</h2>
            <p className="text-sm text-white/40 leading-relaxed px-4">
              Please enter your registered email address. We'll send instructions to help reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  placeholder="web@phylumweb.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              {loading ? "Sending..." : "Send reset instructions"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
