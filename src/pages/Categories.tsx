import { useState } from "react";
import { useFinance } from "@/hooks/use-finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Edit2,
  Tags,
  Sparkles,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/finance-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AVAILABLE_ICONS, getIconComponent } from "@/lib/icons";

export default function Categories() {
  const { customCategories, addCustomCategory, editCustomCategory, deleteCustomCategory } = useFinance();
  const [open, setOpen] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [selectedIcon, setSelectedIcon] = useState<string>("");

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setType("expense");
    setSelectedIcon("");
  };

  const handleOpenNew = () => {
    resetForm();
    setOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setType(cat.type);
    setSelectedIcon(cat.icon);
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedIcon) return;

    // Check uniqueness (cannot exist in default or other custom categories)
    const isNameTaken = 
      INCOME_CATEGORIES.includes(name) || 
      EXPENSE_CATEGORIES.includes(name) ||
      customCategories.some(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== editingId);

    if (isNameTaken) {
      alert("Já existe uma categoria com este nome.");
      return;
    }

    if (editingId) {
      editCustomCategory(editingId, { name, type, icon: selectedIcon });
    } else {
      addCustomCategory({ name, type, icon: selectedIcon, color: type === "income" ? "text-income" : "text-expense" });
    }
    setOpen(false);
  };

  // The rule is: an icon can only be used ONCE.
  const usedIcons = customCategories.map(c => c.icon);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 font-bold uppercase tracking-widest text-[10px]">
            <Sparkles className="h-3.5 w-3.5" />
            Taxonomia Inteligente
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-outfit">Categorias Customizadas</h1>
          <p className="text-muted-foreground font-medium text-sm max-w-lg">
            Crie classificações personalizadas para agrupar suas despesas e receitas exatamente com a cara da sua rotina.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={handleOpenNew} 
              className="h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-lg shadow-indigo-500/20 gap-2 transition-all active:scale-95 border-0"
            >
              <Plus className="h-5 w-5" /> Montar Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#080810]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-0 overflow-hidden shadow-2xl">
            <div className={cn("absolute inset-0 opacity-20 blur-[100px] pointer-events-none transition-colors duration-500", type === "income" ? "bg-emerald-500" : "bg-rose-500")} />
            <div className="p-6 relative z-10">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-black text-white text-center flex items-center justify-center gap-2">
                  <Tags className="h-6 w-6 text-white/50" />
                  {editingId ? "Editar Classificação" : "Nova Classificação"}
                </DialogTitle>
                <p className="text-xs text-white/50 font-medium text-center mt-1">Personalize a gaveta financeira para classificar seus lançamentos.</p>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="space-y-2">
                  <Label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">Nomenclatura Única</Label>
                  <div className="relative group">
                    <Tags className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                      placeholder="Ex: Roupas de Grife..." 
                      className="h-12 pl-11 bg-white/[0.02] border border-white/10 rounded-2xl text-white text-sm font-semibold focus:border-white/30 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">Natureza da Categoria</Label>
                  <Select value={type} onValueChange={(v: "income" | "expense") => setType(v)}>
                    <SelectTrigger className="h-12 bg-white/[0.02] border border-white/10 rounded-xl text-white font-semibold focus:ring-1 focus:border-white/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0B10] border-white/10 text-white rounded-xl shadow-xl">
                      <SelectItem value="income" className="font-semibold text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-400 rounded-lg cursor-pointer">Receita (Dinheiro Entrando)</SelectItem>
                      <SelectItem value="expense" className="font-semibold text-rose-500 focus:bg-rose-500/10 focus:text-rose-400 rounded-lg cursor-pointer">Despesa (Dinheiro Saindo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

               <div className="space-y-3">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex justify-between pl-1 pr-1">
                  <span>Simbologia Visual</span>
                  <span className="text-muted-foreground/50 lowercase font-normal italic">escolha 1 ícone exclusivo</span>
                </Label>
                <div className="grid grid-cols-6 sm:grid-cols-7 gap-2.5 p-4 rounded-2xl bg-white/[0.02] border border-white/10 max-h-[220px] overflow-y-auto custom-scrollbar shadow-inner">
                  {AVAILABLE_ICONS.map((IconObj) => {
                    const isUsed = usedIcons.includes(IconObj.name) && IconObj.name !== selectedIcon;
                    const isSelected = selectedIcon === IconObj.name;
                    return (
                      <button
                        type="button"
                        key={IconObj.name}
                        disabled={isUsed}
                        onClick={() => setSelectedIcon(IconObj.name)}
                        className={cn(
                          "aspect-square rounded-[0.8rem] flex items-center justify-center transition-all duration-300 relative group overflow-hidden",
                          isSelected 
                            ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] ring-2 ring-indigo-500/50 scale-105" 
                            : "bg-white/[0.03] border border-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground hover:border-white/20",
                          isUsed && "opacity-20 cursor-not-allowed scale-95 hover:bg-transparent hover:border-transparent"
                        )}
                        title={isUsed ? "Ícone em uso por outra categoria" : IconObj.name}
                      >
                         {isSelected && <div className="absolute inset-0 bg-white/20 blur-sm mix-blend-overlay" />}
                        <IconObj.icon className="h-5 w-5 relative z-10" />
                      </button>
                    )
                  })}
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={!name || !selectedIcon} 
                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-base shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all border border-indigo-500/50 active:scale-[0.98] mt-2 group flex items-center gap-2 disabled:bg-indigo-600/50 disabled:border-indigo-600/20"
              >
                {editingId ? "Salvar Alterações" : "Carimbar Coleção"}
              </Button>
            </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ─── Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {customCategories.length === 0 ? (
           <div className="col-span-full py-20 px-6 flex flex-col items-center justify-center text-center rounded-[2rem] border border-border/40 border-dashed bg-card/20 text-muted-foreground">
             <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
               <LayoutGrid className="h-10 w-10 opacity-40" />
             </div>
             <p className="text-lg font-bold text-foreground">Sua gaveta de categorias está vazia.</p>
             <p className="text-sm font-medium mt-1 max-w-sm">
               Crie tags e ícones que fazem sentido para o seu estilo de vida exclusivista. (Ex: Viagens para Dubai, Joias, etc.)
             </p>
           </div>
        ) : (
          customCategories.map((cat) => {
            const IconComponent = getIconComponent(cat.icon);
            const isIncome = cat.type === "income";

            return (
              <div 
                key={cat.id} 
                className={cn(
                  "bg-card/40 backdrop-blur-md p-5 rounded-3xl border border-border/40 flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-border/80 relative overflow-hidden h-[160px]"
                )}
              >
                 {/* Fundo glow sutil no hover */}
                 <div className={cn(
                   "absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none",
                   isIncome ? "bg-emerald-500" : "bg-rose-500"
                 )} />

                 <div className="flex items-start justify-between relative z-10">
                   <div className={cn(
                     "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner shrink-0", 
                     isIncome ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                   )}>
                      <IconComponent className="h-6 w-6" />
                   </div>
                   
                   <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       onClick={() => handleOpenEdit(cat)} 
                       className="h-8 w-8 rounded-lg bg-background/50 hover:bg-background text-muted-foreground hover:text-foreground shadow-sm"
                     >
                       <Edit2 className="h-3.5 w-3.5" />
                     </Button>
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       onClick={() => deleteCustomCategory(cat.id)} 
                       className="h-8 w-8 rounded-lg bg-background/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive shadow-sm"
                     >
                       <Trash2 className="h-3.5 w-3.5" />
                     </Button>
                   </div>
                 </div>

                 <div className="relative z-10">
                    <p className="font-black text-lg font-outfit tracking-tight truncate pr-2">{cat.name}</p>
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-widest mt-1",
                      isIncome ? "text-emerald-500/70" : "text-rose-500/70"
                    )}>
                      {isIncome ? "Entrada de Caixa" : "Saída de Caixa"}
                    </p>
                 </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}
