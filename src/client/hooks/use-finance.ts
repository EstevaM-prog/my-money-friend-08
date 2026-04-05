import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  transactionsService,
  accountsService,
  goalsService,
  categoriesService,
  budgetRulesService
} from "@/client/lib/api";
import {
  Transaction,
  Account,
  Goal,
  CustomCategoryDef,
  BudgetRule,
  CardCeiling
} from "@/client/lib/finance-data";
import { useMemo } from "react";

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

  const { data: budgetRules = [], isLoading: isLoadingBudgetRules } = useQuery<BudgetRule[]>({
    queryKey: ["budget-rules"],
    queryFn: budgetRulesService.getAll,
  });

  // CardCeilings are derived from accounts with a 'limit' set
  const cardCeilings = useMemo<CardCeiling[]>(() => {
    return accounts
      .filter((a) => (a.limit || 0) > 0)
      .map((a) => ({
        accountId: a.id,
        limit: a.limit || 0,
        alertAt: 80, // Default alert threshold
        notifyEnabled: true,
      }));
  }, [accounts]);

  const isLoading =
    isLoadingTransactions ||
    isLoadingAccounts ||
    isLoadingGoals ||
    isLoadingCategories ||
    isLoadingBudgetRules;

  // --- MUTATIONS ---
  const addTransactionsMutation = useMutation({
    mutationFn: (newItems: Omit<Transaction, "id">[]) =>
      Promise.all(newItems.map(t => transactionsService.create(t))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
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

  const addBudgetRuleMutation = useMutation({
    mutationFn: (rule: Omit<BudgetRule, "id">) => budgetRulesService.create(rule),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budget-rules"] }),
  });

  const deleteBudgetRuleMutation = useMutation({
    mutationFn: (id: string) => budgetRulesService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budget-rules"] }),
  });

  const updateAccountMutation = useMutation({
    mutationFn: (acc: Account) => accountsService.update(acc.id, acc),
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

    // Actions
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
    addAccount: (acc: Omit<Account, "id">) => addAccountMutation.mutate(acc),
    deleteAccount: (id: string) => deleteAccountMutation.mutate(id),
    addBudgetRule: (rule: Omit<BudgetRule, "id">) => addBudgetRuleMutation.mutate(rule),
    deleteBudgetRule: (id: string) => deleteBudgetRuleMutation.mutate(id),
    saveCardCeiling: (ceiling: CardCeiling) => {
      const acc = accounts.find(a => a.id === ceiling.accountId);
      if (acc) updateAccountMutation.mutate({ ...acc, limit: ceiling.limit });
    },
    deleteCardCeiling: (accountId: string) => {
      const acc = accounts.find(a => a.id === accountId);
      if (acc) updateAccountMutation.mutate({ ...acc, limit: 0 });
    },

    // Compatibility
    toggleNotification: (id: string) => console.log("Toggling notification for", id),
  };
}
