import type { ExpenseCategory } from "@/types/expenses";

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; icon: string }[] = [
  { value: "food", label: "Еда", icon: "🍔" },
  { value: "transport", label: "Транспорт", icon: "🚌" },
  { value: "shopping", label: "Покупки", icon: "🛍️" },
  { value: "entertainment", label: "Развлечения", icon: "🎬" },
  { value: "education", label: "Учёба", icon: "📚" },
  { value: "other", label: "Другое", icon: "📦" },
];