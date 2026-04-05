import { Link } from "react-router-dom";
import { Wallet, MessageCircle, Send, ArrowLeft, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ChatSupport() {
  const [messages, setMessages] = useState([
    { role: "agent", text: "Olá! Sou o assistente virtual do CashFlow. Como posso ajudar você hoje?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", text: input }]);
    setInput("");

    // Simulate auto-reply
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "agent", 
        text: "Desculpe, nossa equipe de suporte se encontra indisponível no momento. Nossa IA está registrando seu Ticket e retornaremos por e-mail!" 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/suporte"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg gradient-primary bg-primary">
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Suporte CashFlow</h1>
              <p className="text-[10px] text-primary font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span> Online agora
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex-1 overflow-y-auto space-y-4 py-4 px-2 custom-scrollbar">
          <div className="text-center text-xs text-muted-foreground my-8">
            Hoje
          </div>
          {messages.map((m, i) => (
            <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "agent" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${m.role === "user" ? "gradient-primary text-white rounded-br-none" : "bg-muted rounded-bl-none text-foreground"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="mt-auto p-2 bg-card border rounded-full flex items-center gap-2 card-shadow">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..." 
            className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent px-4"
          />
          <Button type="submit" size="icon" className="rounded-full shrink-0 gradient-primary h-10 w-10">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </main>
    </div>
  );
}
