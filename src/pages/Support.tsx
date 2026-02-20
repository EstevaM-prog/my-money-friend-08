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
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
    action: "suporte@financaspro.app",
    href: "mailto:suporte@financaspro.app",
  },
  {
    icon: MessageCircle,
    title: "Chat ao vivo",
    desc: "Disponível de seg. a sex., 9h–18h",
    action: "Iniciar conversa",
    href: "#",
  },
  {
    icon: BookOpen,
    title: "Documentação",
    desc: "Guias e tutoriais completos",
    action: "Ver documentação",
    href: "#",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-medium text-sm">{q}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t bg-muted/20">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function Support() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simulate send (no backend)
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/apresentacao" className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg gradient-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">FinançasPro</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild className="gradient-primary border-0 text-primary-foreground">
              <Link to="/cadastro">Criar conta</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-accent/50 text-accent-foreground text-sm font-medium">
              <LifeBuoy className="h-3.5 w-3.5" />
              Central de Suporte
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Como podemos ajudar?</h1>
            <p className="text-muted-foreground">
              Encontre respostas rápidas nas perguntas frequentes ou entre em contato com nossa equipe.
            </p>
          </div>
        </section>

        {/* Channels */}
        <section className="pb-16 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {channels.map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="bg-card border rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow group space-y-3"
              >
                <div className="p-2.5 rounded-xl gradient-primary w-fit">
                  <c.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{c.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-primary font-medium group-hover:underline">
                  {c.action} <ExternalLink className="h-3 w-3" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* FAQ + Contact form */}
        <section className="pb-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* FAQ */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Perguntas frequentes</h2>
              <div className="space-y-2">
                {faqs.map((faq) => (
                  <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Enviar mensagem</h2>
              {sent ? (
                <div className="bg-accent/40 border border-primary/20 rounded-2xl p-8 text-center space-y-3">
                  <div className="p-3 rounded-full gradient-primary w-fit mx-auto">
                    <LifeBuoy className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg">Mensagem enviada!</h3>
                  <p className="text-sm text-muted-foreground">
                    Nossa equipe responderá em até 24 horas no e-mail informado.
                  </p>
                  <Button variant="outline" onClick={() => setSent(false)}>
                    Enviar outra mensagem
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card border rounded-2xl p-6 card-shadow space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Seu nome"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Ex: Problema ao adicionar transação"
                      value={form.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Descreva sua dúvida ou problema com o máximo de detalhes..."
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full gradient-primary border-0 text-primary-foreground font-semibold"
                  >
                    Enviar mensagem
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 px-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} FinançasPro. Todos os direitos reservados.
      </footer>
    </div>
  );
}
