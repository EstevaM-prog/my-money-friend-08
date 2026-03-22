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
  ShoppingBag,
  Car,
  Home,
  HeartPulse,
  GraduationCap,
  Coffee,
  Plane,
  Gift,
  Tv,
  Smartphone,
  Book,
  Monitor,
  Pizza,
  Music,
  Dumbbell,
  Briefcase,
  TrendingUp,
  Landmark,
  Plus,
  Trash2,
  Edit2,
  Tags
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl gradient-primary">
            <Tags className="h-5 w-5 text-white" />
          </div>
          <div>
             <h1 className="text-2xl font-bold tracking-tight">Categorias Customizadas</h1>
             <p className="text-sm text-muted-foreground">Personalize as despesas e receitas exatamente do seu jeito.</p>
          </div>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew} className="gap-2 gradient-primary">
              <Plus className="h-4 w-4" /> Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Categoria" : "Criar Categoria"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ex: Roupas Mensais" />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={type} onValueChange={(v: "income" | "expense") => setType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Receita (Entrada)</SelectItem>
                    <SelectItem value="expense">Despesa (Saída)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Escolha um Ícone (Único)</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
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
                          "aspect-square rounded-xl flex items-center justify-center transition-all",
                          isSelected ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" : "bg-muted text-muted-foreground hover:bg-muted/80",
                          isUsed && "opacity-20 cursor-not-allowed grayscale"
                        )}
                        title={isUsed ? "Ícone já utilizado" : IconObj.name}
                      >
                        <IconObj.icon className="h-5 w-5" />
                      </button>
                    )
                  })}
                </div>
              </div>
              <Button type="submit" disabled={!name || !selectedIcon} className="w-full gradient-primary">
                {editingId ? "Salvar" : "Criar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customCategories.length === 0 ? (
           <div className="col-span-full p-12 text-center rounded-2xl border bg-card/50 text-muted-foreground border-dashed">
             Você ainda não criou nenhuma categoria customizada.
           </div>
        ) : (
          customCategories.map((cat) => {
            const IconComponent = getIconComponent(cat.icon);
            return (
              <div key={cat.id} className="bg-card p-4 rounded-2xl border flex items-center justify-between card-shadow group">
                 <div className="flex items-center gap-3">
                   <div className={cn("p-2 rounded-xl", cat.type === "income" ? "bg-income/10 text-income" : "bg-expense/10 text-expense")}>
                      <IconComponent className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="font-bold">{cat.name}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{cat.type === "income" ? "Receita" : "Despesa"}</p>
                   </div>
                 </div>
                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(cat)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                     <Edit2 className="h-4 w-4" />
                   </Button>
                   <Button variant="ghost" size="icon" onClick={() => deleteCustomCategory(cat.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}
