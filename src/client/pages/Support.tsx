import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  MessageCircle,
  Mail,
  BookOpen,
  ChevronDown,
  ChevronUp,
  LifeBuoy,
  Plus,
  Send,
  HelpCircle,
  Sparkles as SparklesIcon,
  ArrowRight,
  User,
  FileText,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getSession } from "@/client/lib/auth";
import { cn } from "@/client/lib/utils";

const faqs = [
  {
    q: "Como adicionar uma transação?",
    a: 'Clique no botão "Nova Transação" na barra lateral ou no painel principal. Preencha o tipo (receita/despesa), valor, categoria e data.',
  },
  {
    q: "Como funciona o tema claro/escuro?",
    a: 'Acesse Configurações e ative o switch de tema escuro. A preferência é salva automaticamente no seu navegador.',
  },
  {
    q: "Meus dados são salvos?",
    a: "Sim! Todos os dados são armazenados localmente no seu navegador de forma segura. Não compartilhamos nenhuma informação.",
  },
  {
    q: "Como criar uma meta financeira?",
    a: 'Acesse a página "Metas" pelo menu lateral e clique em "Nova Meta". Defina o nome, valor e prazo desejado.',
  },
  {
    q: "Posso excluir uma transação?",
    a: "Sim! Na lista de transações, clique no ícone de lixeira ao lado da transação que deseja remover.",
  },
  {
    q: "Como exportar meus relatórios?",
    a: 'Acesse a página "Relatórios" e utilize os gráficos interativos. No futuro adicionaremos exportação em PDF e CSV.',
  },
];

const channels = [
  {
    icon: Mail,
    title: "E-mail",
    desc: "Resposta em até 24 horas",
    action: "Nos envie um e-mail",
    href: "mailto:suporte@mymoneyfriend.app",
    color: "from-blue-500/20 to-indigo-500/20"
  },
  {
    icon: MessageCircle,
    title: "Chat ao vivo",
    desc: "Disponível de seg. a sex., 9h–18h",
    action: "Iniciar conversa",
    href: "/chat",
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    icon: BookOpen,
    title: "Documentação",
    desc: "Guias e tutoriais completos",
    action: "Ver documentação",
    href: "/documentacao",
    color: "from-emerald-500/20 to-teal-500/20"
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn(
      "group border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300",
      open ? "bg-white/[0.03] border-white/10" : "hover:border-white/10"
    )}>
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors outline-none"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={cn(
          "font-bold text-sm tracking-tight transition-colors",
          open ? "text-white" : "text-white/70"
        )}>{q}</span>
        <div className={cn(
          "h-6 w-6 rounded-lg flex items-center justify-center transition-all duration-300",
          open ? "bg-white/10 rotate-180" : "bg-white/[0.03]"
        )}>
          <ChevronDown className="h-4 w-4 text-white/40" />
        </div>
      </button>
      <div className={cn(
        "grid transition-all duration-300 ease-in-out",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden">
          <div className="px-6 pb-5 text-[13px] text-white/40 font-medium leading-relaxed">
            {a}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Support() {
  const session = getSession();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate send
    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col font-sans selection:bg-purple-500/30 overflow-x-hidden">

      {/* ─── Ambient Glows ─── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 rounded-full bg-purple-600/[0.08] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 rounded-full bg-blue-600/[0.08] blur-[120px]" />
      </div>

      {/* Header / Nav */}
      <header className="fixed top-0 inset-x-0 z-50 px-6 py-6 pointer-events-none">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-6 rounded-full border border-white/[0.08] bg-black/40 backdrop-blur-xl pointer-events-auto shadow-2xl shadow-black/50">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-purple-500/20">
              <Wallet className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tighter">Cash<span className="text-purple-400 italic font-medium">Flow</span></span>
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <Button asChild className="h-9 px-5 rounded-full bg-white text-black hover:bg-white/90 font-bold text-xs transition-all active:scale-95 border-0">
                <Link to="/">Meu Painel</Link>
              </Button>
            ) : (
              <Button asChild className="h-9 px-5 rounded-full bg-white text-black hover:bg-white/90 font-bold text-xs transition-all active:scale-95 border-0">
                <Link to="/cadastro">Começar Agora</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 lg:pt-40">

        {/* Banner Hero */}
        <section className="px-6 pb-20 text-center relative">
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/[0.08] text-purple-400 text-[11px] font-black uppercase tracking-[0.2em]">
              <LifeBuoy className="h-3.5 w-3.5" />
              Central de Ajuda
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-[4.5rem] font-black tracking-tighter leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Como podemos <br />
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent italic">ajudar você?</span>
            </h1>
            <p className="text-white/40 text-base md:text-lg max-w-xl mx-auto font-medium">
              Estamos aqui para garantir que sua jornada financeira seja tranquila e eficiente. Explore nossos recursos ou fale com a gente.
            </p>
          </div>
        </section>

        {/* Support Channels */}
        <section className="px-6 pb-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {channels.map((c, i) => (
              <div
                key={c.title}
                className="group relative bg-[#090910]/40 backdrop-blur-3xl border border-white/[0.06] rounded-[2rem] p-8 flex flex-col items-center justify-center text-center hover:border-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                {/* Channel Background Glow */}
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500", c.color)} />

                <div className="relative z-10 space-y-6 flex flex-col items-center h-full">
                  <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl group-hover:bg-white/10 transition-all duration-500">
                    <c.icon className="h-8 w-8 text-white/50 group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-xl tracking-tight">{c.title}</h3>
                    <p className="text-sm text-white/40 font-medium leading-relaxed">{c.desc}</p>
                  </div>
                  <Button variant="ghost" asChild className="mt-auto w-full h-12 rounded-xl border border-white/[0.06] hover:bg-white hover:text-black font-bold text-[13px] group-hover:shadow-2xl transition-all">
                    {c.href.startsWith("mailto:") ? (
                      <a href={c.href}>{c.action}</a>
                    ) : (
                      <Link to={c.href} className="flex items-center gap-2">
                        {c.action} <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Content Section: FAQ + Contact Form */}
        <section className="px-6 pb-32">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              {/* Left Column: FAQ */}
              <div className="space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-6 w-6 text-purple-400/50" />
                    <h2 className="text-2xl font-bold tracking-tight">Perguntas Frequentes</h2>
                  </div>
                  <p className="text-sm text-white/40 font-medium">As soluções mais rápidas para suas dúvidas comuns.</p>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                  ))}
                </div>

                <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 flex items-center justify-between gap-6 group">
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Não encontrou o que procurava?</p>
                    <p className="text-xs text-white/40 font-medium">Explore nossa base de conhecimento completa.</p>
                  </div>
                  <Link to="/documentacao" className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-110 transition-transform">
                    <Plus className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="relative">
                {/* Form Decoration */}
                <div className="absolute -top-10 -right-10 p-10 opacity-10 pointer-events-none">
                  <Sparkles className="h-40 w-40 text-purple-400" />
                </div>

                <div className={cn(
                  "relative p-8 lg:p-10 rounded-[2.5rem] border transition-all duration-700 backdrop-blur-3xl overflow-hidden shadow-2xl",
                  sent ? "bg-emerald-500/[0.02] border-emerald-500/20" : "bg-white/[0.03] border-white/[0.08]"
                )}>
                  {sent ? (
                    <div className="text-center space-y-8 py-10 animate-in zoom-in-95 duration-500">
                      <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                        <Send className="h-8 w-8 text-emerald-400" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold tracking-tight">Recebemos sua mensagem!</h3>
                        <p className="text-sm text-white/40 font-medium max-w-[280px] mx-auto leading-relaxed">
                          Nossa equipe já está com seu pedido e retornaremos em até 24 horas.
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => setSent(false)}
                        className="font-bold text-xs uppercase tracking-widest text-white/50 hover:text-white"
                      >
                        Enviar outra mensagem
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Enviar Mensagem</h2>
                        <p className="text-xs font-medium text-white/40">Responderemos o mais rápido possível.</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Nome</Label>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                              <Input
                                id="name"
                                name="name"
                                placeholder="Como se chama?"
                                value={form.name}
                                onChange={handleChange}
                                className="h-14 pl-12 pr-4 bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 rounded-2xl text-white font-semibold placeholder:text-white/20 transition-all focus:bg-white/[0.05]"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">E-mail</Label>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="seu@exemplo.com"
                                value={form.email}
                                onChange={handleChange}
                                className="h-14 pl-12 pr-4 bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 rounded-2xl text-white font-semibold placeholder:text-white/20 transition-all focus:bg-white/[0.05]"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Assunto</Label>
                          <div className="relative group">
                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                            <Input
                              id="subject"
                              name="subject"
                              placeholder="Qual o motivo do contato?"
                              value={form.subject}
                              onChange={handleChange}
                              className="h-14 pl-12 pr-4 bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 rounded-2xl text-white font-semibold placeholder:text-white/20 transition-all focus:bg-white/[0.05]"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Mensagem</Label>
                          <div className="relative group">
                            <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                            <Textarea
                              id="message"
                              name="message"
                              placeholder="Descreva como podemos ajudar com o máximo de detalhes..."
                              value={form.message}
                              onChange={handleChange}
                              rows={5}
                              className="pl-12 pr-4 pt-4 bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 rounded-2xl text-white font-semibold placeholder:text-white/20 transition-all focus:bg-white/[0.05] resize-none"
                              required
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-widest border-0 shadow-[0_0_30px_rgba(147,51,234,0.3)] active:scale-[0.98] transition-all rounded-2xl flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>Enviar pedido de ajuda <Send className="h-4 w-4" /></>
                          )}
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-12 border-t border-white/[0.06] text-center">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-white/20 text-xs font-bold uppercase tracking-widest">
            <SparklesIcon className="h-3 w-3" />
            CashFlow Intelligence
          </div>
          <p className="text-[11px] text-white/30 font-medium tracking-wide">
            © {new Date().getFullYear()} CashFlow Finance. Protegendo seus dados com criptografia de ponta a ponta.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 0L105.8 84.2L190 90L105.8 95.8L100 180L94.2 95.8L10 90L94.2 84.2L100 0Z" fill="currentColor" />
    </svg>
  );
}
