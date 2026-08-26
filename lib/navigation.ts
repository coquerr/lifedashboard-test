import {
  BarChart3,
  Droplet,
  LayoutDashboard,
  ListChecks,
  Repeat,
  Timer,
  Wallet,
} from "lucide-react";

import type { NavItem } from "@/types/navigation";

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, enabled: true },
  { label: "Задачи", href: "/tasks", icon: ListChecks, enabled: true },
  { label: "Привычки", href: "/habits", icon: Repeat, enabled: true },
  { label: "Расходы", href: "/expenses", icon: Wallet, enabled: true },
  { label: "Вода", href: "/water", icon: Droplet, enabled: true },
  { label: "Фокус", href: "/focus", icon: Timer, enabled: true },
  { label: "Статистика", href: "/stats", icon: BarChart3, enabled: true },
];