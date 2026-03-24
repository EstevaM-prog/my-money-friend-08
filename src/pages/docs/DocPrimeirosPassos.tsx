import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Wallet, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  MessageCircle,
  HelpCircle,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DocPrimeirosPassos() {
  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* ─── Ambient Glows ─── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 rounded-full bg-blue-600/[0.08] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 rounded-full bg-purple-600/[0.08] blur-[120px]" />
      </div>

      <header className="fixed top-0 inset-x-0 z-50 px-6 py-6 pointer-events-none">
        <div className="max-w-4xl mx-auto flex items-center justify-between h-14 px-4 rounded-full border border-white/[0.08] bg-black/40 backdrop-blur-xl pointer-events-auto shadow-2xl">
          <Link to="/documentacao" className="flex items-center gap-2 group text-white/40 hover:text-white transition-colors">
            <div className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
              <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span className="text-sm font-bold tracking-tight">Voltar</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 pt-0.5">Wiki / Guia Rápido</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32 pb-20">
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
          
          <div className="space-y-8">
            <div className="w-20 h-20 rounded-[2rem] bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-2xl">
              <Wallet className="h-10 w-10" />
            </div>
            
            <div className="space-y-4">
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Primeiros Passos no <br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic">CashFlow</span>
              </h1>
              <p className="text-lg text-white/40 max-w-2xl font-medium leading-relaxed">
                Bem-vindo ao centro de comando da sua inteligência financeira. Siga este guia rápido para dominar a plataforma em poucos minutos.
              </p>
            </div>
          </div>

          <article className="bg-[#090910]/40 border border-white/[0.06] rounded-[2.5rem] p-8 sm:p-12 lg:p-16 backdrop-blur-3xl shadow-2xl">
            <div className="prose prose-invert max-w-none space-y-16">
              
              <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-white mb-6">1. Conhecendo o Painel de Controle</h2>
                <p className="text-white/40 leading-relaxed text-lg">
                  Ao acessar o CashFlow, você verá o seu <strong>Painel Central</strong>. Ele é dinâmico e inteligente, exibindo seu saldo líquido, receitas e despesas com processamento em tempo real. Cada gráfico foi desenhado para te dar uma resposta visual imediata sobre sua saúde financeira.
                </p>
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <HelpCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <p className="text-[13px] text-white/50 font-medium leading-relaxed italic">
                    Dica: Use o botão de olho no topo da tela para esconder seus valores reais quando estiver em público. Chamamos isso de **Modo Privacidade**.
                  </p>
                </div>
              </section>

              <section className="space-y-8">
                <h2 className="text-2xl font-bold tracking-tight text-white m-0">2. Sua Primeira Transação</h2>
                <p className="text-white/40 leading-relaxed text-lg">
                  Registrar movimentações é a base da sua organização. Veja como fazer:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Clique no botão central '+' (Mobile) ou na Lateral.",
                    "Selecione o Tipo (Entrada ou Saída).",
                    "Defina o Valor e escolha a Categoria.",
                    "Ative 'Falar com suporte' se precisar de ajuda."
                  ].map((step, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-4 group hover:bg-white/[0.05] transition-colors">
                      <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-black">
                        {i + 1}
                      </div>
                      <span className="text-sm text-white/60 font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-white mb-6">3. Organizando com Categorias</h2>
                <p className="text-white/40 leading-relaxed text-lg">
                  O CashFlow aprende com suas escolhas. Ao categorizar corretamente (Habitação, Lazer, etc.), você habilita o motor de análise que te mostrará exatamente para onde seu dinheiro está indo no final do mês.
                </p>
              </section>

            </div>
          </article>

          <footer className="space-y-12">
            <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-blue-500/[0.08] to-indigo-500/[0.08] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-8 group">
               <div className="space-y-2 text-center sm:text-left">
                  <h3 className="text-xl font-bold tracking-tight tracking-tight">Dúvidas durante o percurso?</h3>
                  <p className="text-sm text-white/40 font-medium">Inicie um chat agora e nossa equipe te ajudará a configurar tudo.</p>
               </div>
               <Button asChild className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-white/90 font-black text-sm uppercase tracking-widest border-0 flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
                  <Link to="/chat">
                     <MessageCircle className="h-5 w-5" />
                     Central de Ajuda
                  </Link>
               </Button>
            </div>
            
            <div className="text-center pb-10">
              <Link to="/documentacao" className="text-white/20 hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                Explorar Documentação Completa <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </footer>
        </div>
      </main>

      {/* Global Background Strip */}
      <div className="fixed inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent pointer-events-none" />
    </div>
  );
}
