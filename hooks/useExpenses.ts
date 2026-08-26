import { useCallback } from "react";

import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import * as expensesService from "@/services/expensesService";
import type { Expense, ExpenseInput } from "@/types/expenses";

const DEFAULT_EXPENSES: Expense[] = [];

export function useExpenses() {
  const [expenses, setExpenses] = useLocalStorageState<Expense[]>(
    STORAGE_KEYS.expenses,
    DEFAULT_EXPENSES,
  );

  const addExpense = useCallback(
    (input: ExpenseInput) => setExpenses((current) => expensesService.addExpense(current, input)),
    [setExpenses],
  );

  const removeExpense = useCallback(
    (id: string) => setExpenses((current) => expensesService.deleteExpense(current, id)),
    [setExpenses],
  );

  return { expenses, addExpense, removeExpense };
}