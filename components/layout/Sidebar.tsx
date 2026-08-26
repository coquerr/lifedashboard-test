"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-vanta-border px-4 py-6 md:flex">
      <div className="flex items-center gap-2 px-2">
        <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-vanta-text">
          Vanta
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-vanta-accent" />
      </div>

      <nav className="mt-10 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (!item.enabled) {
            return (
              <span
                key={item.href}
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-vanta-text-dim"
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-vanta-surface text-vanta-text"
                  : "text-vanta-text-muted hover:bg-vanta-surface hover:text-vanta-text"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${isActive ? "text-vanta-accent" : ""}`}
                strokeWidth={1.75}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}