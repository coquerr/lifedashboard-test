import type { Expense, ExpenseInput } from "@/types/expenses";

export function createExpense(input: ExpenseInput): Expense {
  return {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    amount: input.amount,
    category: input.category,
    date: input.date,
    createdAt: new Date().toISOString(),
  };
}

export function addExpense(expenses: Expense[], input: ExpenseInput): Expense[] {
  return [...expenses, createExpense(input)];
}

export function deleteExpense(expenses: Expense[], id: string): Expense[] {
  return expenses.filter((expense) => expense.id !== id);
}

export function getExpensesInRange(
  expenses: Expense[],
  fromDate: string,
  toDate: string,
): Expense[] {
  return expenses
    .filter((expense) => expense.date >= fromDate && expense.date <= toDate)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

export function sumExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}