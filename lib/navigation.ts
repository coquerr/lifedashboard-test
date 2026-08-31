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
  { label: "Dashboard", href: "/", icon: LayoutDashboard, enabled: true, primary: true },
  { label: "Задачи", href: "/tasks", icon: ListChecks, enabled: true, primary: true },
  { label: "Привычки", href: "/habits", icon: Repeat, enabled: true, primary: true },
  { label: "Расходы", href: "/expenses", icon: Wallet, enabled: true, primary: true },
  { label: "Вода", href: "/water", icon: Droplet, enabled: true, primary: false },
  { label: "Фокус", href: "/focus", icon: Timer, enabled: true, primary: false },
  { label: "Статистика", href: "/stats", icon: BarChart3, enabled: true, primary: false },
];