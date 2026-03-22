export type TransactionType = "income" | "expense";

export type Category = string;

export interface CustomCategoryDef {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export const INCOME_CATEGORIES: Category[] = ["Salário", "Freelance", "Investimentos", "Outros"];
export const EXPENSE_CATEGORIES: Category[] = [
  "Alimentação", "Transporte", "Moradia", "Saúde", "Educação", "Lazer", "Compras", "Outros",
];

export type AccountType = "checking" | "savings" | "credit" | "investment" | "debit";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  institution: string;
  color: string;
}

export type PaymentMethod = string;

export const DEFAULT_PAYMENT_METHODS = [
  "Dinheiro",
  "PIX",
  "Transferência",
  "Cartão de Débito",
];

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  paymentMethod?: PaymentMethod;
  accountId?: string;
  email_notification_active?: boolean;
  notification_scheduled_at?: string; // ISO string when scheduled
  date: string; // ISO string
  virtualRange?: string; 
  groupedIds?: string[];
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

export interface BudgetRule {
  id: string;
  label: string;       // e.g. "Necessidades"
  category: Category;  // matches EXPENSE_CATEGORIES or custom
  percentage: number;  // 0-100
  color: string;       // hex
}

export interface CardCeiling {
  accountId: string;   // credit card account id
  limit: number;       // spending ceiling in R$
  alertAt: number;     // 0-100, e.g. 80 = notify at 80%
  notifyEnabled: boolean;
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
