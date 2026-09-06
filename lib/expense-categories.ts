import {
  Bus,
  Clapperboard,
  GraduationCap,
  Package,
  ShoppingBag,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import type { ExpenseCategory } from "@/types/expenses";

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; icon: LucideIcon }[] = [
  { value: "food", label: "Еда", icon: Utensils },
  { value: "transport", label: "Транспорт", icon: Bus },
  { value: "shopping", label: "Покупки", icon: ShoppingBag },
  { value: "entertainment", label: "Развлечения", icon: Clapperboard },
  { value: "education", label: "Учёба", icon: GraduationCap },
  { value: "other", label: "Другое", icon: Package },
];

export const DEFAULT_EXPENSE_CATEGORY_ICON = Package;