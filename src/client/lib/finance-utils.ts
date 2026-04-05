import { addMonths, isBefore, parseISO, startOfDay } from "date-fns";
import { Transaction, Account } from "./finance-data";

/**
 * Gera múltiplas parcelas ou ocorrências recorrentes de uma transação.
 */
export function generateRecurringTransactions(
  base: Omit<Transaction, "id" | "date">,
  startDateStr: string,
  untilDateStr: string
): Omit<Transaction, "id">[] {
  const transactions: Omit<Transaction, "id">[] = [];
  const startDate = parseISO(startDateStr);
  const endDate = parseISO(untilDateStr);
  let currentDate = startDate;

  while (
    isBefore(startOfDay(currentDate), addMonths(startOfDay(endDate), 0)) ||
    currentDate.getTime() === endDate.getTime()
  ) {
    transactions.push({
      ...base,
      date: currentDate.toISOString(),
    });
    currentDate = addMonths(currentDate, 1);
    if (currentDate > addMonths(endDate, 1)) break; // Safety break
  }

  return transactions;
}

/**
 * Calcula os novos saldos das contas baseados em uma lista de transações.
 */
export function updateAccountBalances(
  accounts: Account[],
  transactions: Transaction[]
): Account[] {
  const updatedAccounts = [...accounts];

  transactions.forEach((t) => {
    if (t.accountId) {
      const accIndex = updatedAccounts.findIndex((a) => a.id === t.accountId);
      if (accIndex !== -1) {
        const acc = { ...updatedAccounts[accIndex] };
        if (t.type === "expense") {
          acc.balance -= t.amount;
        } else {
          acc.balance += t.amount;
        }
        updatedAccounts[accIndex] = acc;
      }
    }
  });

  return updatedAccounts;
}
