import { Link } from "react-router-dom";
import { ArrowLeft, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocPrimeirosPassos() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/documentacao"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight">Primeiros Passos</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Central de Ajuda</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 sm:py-12">
        <div className="space-y-6 prose prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-black mb-6 flex items-center gap-3">
             <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><Wallet className="h-8 w-8" /></div>
             Primeiros Passos no CashFlow
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Bem-vindo ao CashFlow! Este guia rápido vai te ajudar a configurar sua conta e dar os primeiros passos para uma vida financeira mais organizada e tranquila.
          </p>

          <h2 className="text-2xl font-bold mt-8 border-b pb-2">1. Conhecendo o Painel de Controle</h2>
          <p>
            Ao acessar o CashFlow, a primeira coisa que você verá é o **Painel**. Ele é o centro de comando das suas finanças, exibindo o saldo geral, suas despesas do mês e um resumo rápido das transações recentes.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 border-b pb-2">2. Registrando sua primeira Transação</h2>
          <p>
            Para adicionar uma movimentação:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Clique no botão circular <strong>Nova Transação</strong>.</li>
            <li>Escolha se é uma <strong>Receita</strong> (dinheiro entrando) ou <strong>Despesa</strong> (dinheiro saindo).</li>
            <li>Insira um valor, descrição e escolha uma <strong>Categoria</strong> (como Habitação, Transporte ou Lazer).</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 border-b pb-2">3. Organizando Categorias</h2>
          <p>
            Uma boa gestão financeira começa pela categorização correta. Tente não usar categorias muito genéricas (como "Outros"). Descreva o que você está gastando para que o sistema consiga gerar gráficos mais fiéis aos seus hábitos!
          </p>
          
          <div className="mt-12 p-6 rounded-2xl bg-muted/50 border flex flex-col items-center text-center">
             <h3 className="font-bold mb-2">Ainda com dúvidas?</h3>
             <Button asChild className="gradient-primary">
               <Link to="/chat">Falar com Suporte</Link>
             </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
