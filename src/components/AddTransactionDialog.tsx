import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import {
  TransactionType,
  Category,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  Transaction,
} from "@/lib/finance-data";

interface AddTransactionDialogProps {
  onAdd: (t: Omit<Transaction, "id">) => void;
}

export function AddTransactionDialog({ onAdd }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim() || !amount || !category || !date) return;
    onAdd({
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category: category as Category,
      date: new Date(date).toISOString(),
    });
    setDescription("");
    setAmount("");
    setCategory("");
    setDate(new Date().toISOString().split("T")[0]);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 gradient-primary border-0 text-primary-foreground font-semibold shadow-md hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Transação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === "expense" ? "default" : "outline"}
              className={type === "expense" ? "flex-1 bg-expense text-primary-foreground hover:bg-expense/90" : "flex-1"}
              onClick={() => { setType("expense"); setCategory(""); }}
            >
              Despesa
            </Button>
            <Button
              type="button"
              variant={type === "income" ? "default" : "outline"}
              className={type === "income" ? "flex-1 gradient-primary text-primary-foreground hover:opacity-90" : "flex-1"}
              onClick={() => { setType("income"); setCategory(""); }}
            >
              Receita
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Supermercado"
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold hover:opacity-90">
            Adicionar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
