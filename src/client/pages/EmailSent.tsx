import { useLocation, useNavigate } from "react-router-dom";
import { MailCheck, ArrowLeft, Wallet } from "lucide-react";

export default function EmailSent() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email ?? "seu-email@exemplo.com";

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6 relative overflow-hidden font-sans">
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
        <div className="w-full bg-[#16161a] border border-white/5 rounded-[32px] p-8 shadow-2xl shadow-black/50 text-center">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20 rotate-3 animate-in zoom-in-50 duration-500">
               <MailCheck className="h-10 w-10 text-blue-500 -rotate-12" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Email instructions sent</h2>
            <p className="text-sm text-white/40 leading-relaxed px-4">
              Please follow the instructions we sent to your inbox.
            </p>
            <p className="text-sm font-bold text-white mt-4 tracking-tight underline underline-offset-4 decoration-blue-700">{email}</p>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full h-14 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-white font-bold text-base transition-all active:scale-[0.98]"
          >
            Back to login
          </button>
          
          <p className="mt-8 text-xs text-white/30 font-medium">
            Didn't receive the email? <span className="text-blue-500 cursor-pointer hover:underline underline-offset-2">Send it again</span>
          </p>
        </div>
      </div>
    </div>
  );
}
