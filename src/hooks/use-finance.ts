import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  transactionsService, 
  accountsService, 
  goalsService, 
  categoriesService 
} from "@/lib/api";
import { 
  Transaction, 
  Account, 
  Goal, 
  CustomCategoryDef, 
  BudgetRule, 
  CardCeiling 
} from "@/lib/finance-data";
import { useLocalStorage } from "./use-local-storage";

/**
 * Hook centralizado para gerenciar transações, contas e metas chamando a API.
 */
export function useFinance() {
  const queryClient = useQueryClient();

  // --- QUERIES ---
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: transactionsService.getAll,
  });

  const { data: accounts = [], isLoading: isLoadingAccounts } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: accountsService.getAll,
  });

  const { data: goals = [], isLoading: isLoadingGoals } = useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: goalsService.getAll,
  });

  const { data: customCategories = [], isLoading: isLoadingCategories } = useQuery<CustomCategoryDef[]>({
    queryKey: ["categories"],
    queryFn: categoriesService.getAll,
  });

  const isLoading = isLoadingTransactions || isLoadingAccounts || isLoadingGoals || isLoadingCategories;

  // Mantemos BudgetRules e CardCeilings no localStorage por enquanto ou pode mover para o banco se houver endpoint
  const [budgetRules, setBudgetRules] = useLocalStorage<BudgetRule[]>("mymoneyfriend_budget_rules", [
    { id: "1", label: "Necessidades", category: "Moradia", percentage: 50, color: "#6366f1" },
    { id: "2", label: "Desejos", category: "Lazer", percentage: 30, color: "#ec4899" },
    { id: "3", label: "Poupança", category: "Outros", percentage: 20, color: "#10b981" },
  ]);
  const [cardCeilings, setCardCeilings] = useLocalStorage<CardCeiling[]>("mymoneyfriend_card_ceilings", []);

  // --- MUTATIONS ---
  const addTransactionsMutation = useMutation({
    mutationFn: (newItems: Omit<Transaction, "id">[]) => 
      Promise.all(newItems.map(t => transactionsService.create(t))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] }); // Update balances
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: ({ id, type }: { id: string; type: string }) => transactionsService.delete(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const addGoalMutation = useMutation({
    mutationFn: (goal: Omit<Goal, "id">) => goalsService.create(goal),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (id: string) => goalsService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  });

  const updateGoalCurrentMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) => {
      const g = goals.find(goal => goal.id === id);
      if (!g) return Promise.reject();
      return goalsService.update(id, { ...g, current: Math.min(g.current + amount, g.target) });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  });

  const addCustomCategoryMutation = useMutation({
    mutationFn: (cat: Omit<CustomCategoryDef, "id">) => categoriesService.create(cat),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const editCustomCategoryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CustomCategoryDef> }) => 
      categoriesService.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const deleteCustomCategoryMutation = useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const addAccountMutation = useMutation({
    mutationFn: (acc: Omit<Account, "id">) => accountsService.create(acc),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (id: string) => accountsService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });

  return {
    // Data
    transactions,
    accounts,
    goals,
    customCategories,
    budgetRules,
    cardCeilings,
    isLoading,

    // Actions (using mutate wrappers for compatibility)
    addTransactions: (newItems: Omit<Transaction, "id">[]) => addTransactionsMutation.mutate(newItems),
    deleteTransaction: (id: string) => {
      const t = transactions.find(t => t.id === id);
      if (t) deleteTransactionMutation.mutate({ id, type: t.type });
    },
    addGoal: (goal: Omit<Goal, "id">) => addGoalMutation.mutate(goal),
    deleteGoal: (id: string) => deleteGoalMutation.mutate(id),
    updateGoalCurrent: (id: string, amount: number) => updateGoalCurrentMutation.mutate({ id, amount }),
    addCustomCategory: (cat: Omit<CustomCategoryDef, "id">) => addCustomCategoryMutation.mutate(cat),
    editCustomCategory: (id: string, updates: Partial<CustomCategoryDef>) => editCustomCategoryMutation.mutate({ id, updates }),
    deleteCustomCategory: (id: string) => deleteCustomCategoryMutation.mutate(id),
    toggleNotification: (id: string) => console.log("Toggling notification for", id), // API hook placeholder
    
    // Fallbacks/Compatibility
    setAccounts: () => {}, // No longer set directly
    setTransactions: () => {},
    setGoals: () => {},
    saveBudgetRules: (rules: BudgetRule[]) => setBudgetRules(rules),
    saveCardCeiling: (ceiling: CardCeiling) => {
      setCardCeilings(prev => {
        const idx = prev.findIndex(c => c.accountId === ceiling.accountId);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = ceiling;
          return updated;
        }
        return [...prev, ceiling];
      });
    },
    deleteCardCeiling: (accountId: string) => setCardCeilings(prev => prev.filter(c => c.accountId !== accountId)),
  };
}
