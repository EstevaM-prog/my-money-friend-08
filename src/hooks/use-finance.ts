import { useLocalStorage } from "./use-local-storage";
import { Transaction, Account, Goal, INITIAL_TRANSACTIONS, CustomCategoryDef, BudgetRule, CardCeiling } from "@/lib/finance-data";
import { updateAccountBalances } from "@/lib/finance-utils";

/**
 * Hook centralizado para gerenciar transações, contas e metas de forma sincronizada.
 */
export function useFinance() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "mymoneyfriend_transactions",
    INITIAL_TRANSACTIONS
  );
  
  const [accounts, setAccounts] = useLocalStorage<Account[]>(
    "mymoneyfriend_accounts", 
    []
  );

  const [goals, setGoals] = useLocalStorage<Goal[]>(
    "mymoneyfriend_goals",
    []
  );

  const [customCategories, setCustomCategories] = useLocalStorage<CustomCategoryDef[]>(
    "mymoneyfriend_custom_categories",
    []
  );

  const [budgetRules, setBudgetRules] = useLocalStorage<BudgetRule[]>(
    "mymoneyfriend_budget_rules",
    [
      { id: "1", label: "Necessidades", category: "Moradia", percentage: 50, color: "#6366f1" },
      { id: "2", label: "Desejos", category: "Lazer", percentage: 30, color: "#ec4899" },
      { id: "3", label: "Poupança", category: "Outros", percentage: 20, color: "#10b981" },
    ]
  );

  const [cardCeilings, setCardCeilings] = useLocalStorage<CardCeiling[]>(
    "mymoneyfriend_card_ceilings",
    []
  );

  const addTransactions = (newItems: Omit<Transaction, "id">[]) => {
    const withIds = newItems.map((t, index) => ({
      ...t,
      id: String(Date.now() + index + Math.random()),
    }));

    setTransactions((prev) => [...prev, ...withIds]);
    setAccounts((prevAccounts) => updateAccountBalances(prevAccounts, withIds as Transaction[]));
  };

  const deleteTransaction = (id: string) => {
    const tToDelete = transactions.find((t) => t.id === id);
    if (!tToDelete) return;

    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setAccounts((prevAccounts) => {
      const updated = [...prevAccounts];
      if (tToDelete.accountId) {
        const idx = updated.findIndex((a) => a.id === tToDelete.accountId);
        if (idx !== -1) {
          const acc = { ...updated[idx] };
          if (tToDelete.type === "expense") acc.balance += tToDelete.amount;
          else acc.balance -= tToDelete.amount;
          updated[idx] = acc;
        }
      }
      return updated;
    });
  };

  const addGoal = (goal: Omit<Goal, "id">) => {
    setGoals((prev) => [...prev, { ...goal, id: String(Date.now()) }]);
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const updateGoalCurrent = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, current: Math.min(g.current + amount, g.target) } : g
      )
    );
  };

  const toggleNotification = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, email_notification_active: !t.email_notification_active } : t
      )
    );
  };

  const addCustomCategory = (cat: Omit<CustomCategoryDef, "id">) => {
    setCustomCategories(prev => [...prev, { ...cat, id: String(Date.now()) }]);
  };

  const editCustomCategory = (id: string, updates: Partial<CustomCategoryDef>) => {
    setCustomCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCustomCategory = (id: string) => {
    setCustomCategories(prev => prev.filter(c => c.id !== id));
  };

  const saveBudgetRules = (rules: BudgetRule[]) => setBudgetRules(rules);

  const saveCardCeiling = (ceiling: CardCeiling) => {
    setCardCeilings(prev => {
      const idx = prev.findIndex(c => c.accountId === ceiling.accountId);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = ceiling;
        return updated;
      }
      return [...prev, ceiling];
    });
  };

  const deleteCardCeiling = (accountId: string) => {
    setCardCeilings(prev => prev.filter(c => c.accountId !== accountId));
  };

  return {
    transactions,
    accounts,
    goals,
    addTransactions,
    deleteTransaction,
    toggleNotification,
    addGoal,
    deleteGoal,
    updateGoalCurrent,
    setAccounts,
    setTransactions,
    setGoals,
    customCategories,
    addCustomCategory,
    editCustomCategory,
    deleteCustomCategory,
    budgetRules,
    saveBudgetRules,
    cardCeilings,
    saveCardCeiling,
    deleteCardCeiling,
  };
}
