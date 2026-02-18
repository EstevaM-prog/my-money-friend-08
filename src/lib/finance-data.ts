export type TransactionType = "income" | "expense";

export type Category =
  | "Salário"
  | "Freelance"
  | "Investimentos"
  | "Alimentação"
  | "Transporte"
  | "Moradia"
  | "Saúde"
  | "Educação"
  | "Lazer"
  | "Compras"
  | "Outros";

export const INCOME_CATEGORIES: Category[] = ["Salário", "Freelance", "Investimentos", "Outros"];
export const EXPENSE_CATEGORIES: Category[] = [
  "Alimentação", "Transporte", "Moradia", "Saúde", "Educação", "Lazer", "Compras", "Outros",
];

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // ISO string
}

export const CATEGORY_COLORS: Record<string, string> = {
  "Salário": "#10b981",
  "Freelance": "#34d399",
  "Investimentos": "#6ee7b7",
  "Alimentação": "#f97316",
  "Transporte": "#3b82f6",
  "Moradia": "#8b5cf6",
  "Saúde": "#ef4444",
  "Educação": "#eab308",
  "Lazer": "#ec4899",
  "Compras": "#14b8a6",
  "Outros": "#6b7280",
};

const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

function randomDate(month: number, year: number): string {
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day).toISOString();
}

let idCounter = 1;
function makeId() {
  return String(idCounter++);
}

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: makeId(), description: "Salário mensal", amount: 8500, type: "income", category: "Salário", date: randomDate(currentMonth, currentYear) },
  { id: makeId(), description: "Projeto freelance", amount: 2200, type: "income", category: "Freelance", date: randomDate(currentMonth, currentYear) },
  { id: makeId(), description: "Dividendos", amount: 340, type: "income", category: "Investimentos", date: randomDate(currentMonth, currentYear) },
  { id: makeId(), description: "Supermercado", amount: 820, type: "expense", category: "Alimentação", date: randomDate(currentMonth, currentYear) },
  { id: makeId(), description: "Restaurante", amount: 215, type: "expense", category: "Alimentação", date: randomDate(currentMonth, currentYear) },
  { id: makeId(), description: "Uber / 99", amount: 180, type: "expense", category: "Transporte", date: randomDate(currentMonth, currentYear) },
  { id: makeId(), description: "Gasolina", amount: 350, type: "expense", category: "Transporte", date: randomDate(currentMonth, currentYear) },
  { id: makeId(), description: "Aluguel", amount: 2200, type: "expense", category: "Moradia", date: randomDate(currentMonth, currentYear) },
  { id: makeId(), description: "Condomínio", amount: 580, type: "expense", category: "Moradia", date: randomDate(currentMonth, currentYear) },
  { id: makeId(), description: "Plano de saúde", amount: 450, type: "expense", category: "Saúde", date: randomDate(currentMonth, currentYear) },
  { id: makeId(), description: "Curso online", amount: 120, type: "expense", category: "Educação", date: randomDate(currentMonth, currentYear) },
  { id: makeId(), description: "Cinema", amount: 65, type: "expense", category: "Lazer", date: randomDate(currentMonth, currentYear) },
  { id: makeId(), description: "Roupas", amount: 380, type: "expense", category: "Compras", date: randomDate(currentMonth, currentYear) },
  // Previous month
  { id: makeId(), description: "Salário mensal", amount: 8500, type: "income", category: "Salário", date: randomDate(currentMonth - 1, currentYear) },
  { id: makeId(), description: "Supermercado", amount: 750, type: "expense", category: "Alimentação", date: randomDate(currentMonth - 1, currentYear) },
  { id: makeId(), description: "Aluguel", amount: 2200, type: "expense", category: "Moradia", date: randomDate(currentMonth - 1, currentYear) },
  { id: makeId(), description: "Transporte", amount: 420, type: "expense", category: "Transporte", date: randomDate(currentMonth - 1, currentYear) },
];
