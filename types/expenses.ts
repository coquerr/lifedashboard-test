export type ExpenseCategory =
  | "food"
  | "transport"
  | "shopping"
  | "entertainment"
  | "education"
  | "other";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  createdAt: string;
}

export interface ExpenseInput {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}