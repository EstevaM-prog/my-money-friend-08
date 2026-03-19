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

export const INITIAL_TRANSACTIONS: Transaction[] = [];
