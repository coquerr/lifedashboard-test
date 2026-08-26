"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/lib/navigation";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-10 border-t border-vanta-border bg-vanta-bg/95 backdrop-blur md:hidden">
      <div className="flex items-center justify-between overflow-x-auto px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (!item.enabled) {
            return (
              <span
                key={item.href}
                className="flex min-w-[64px] flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-vanta-text-dim"
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
                <span className="text-[10px] leading-none">{item.label}</span>
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[64px] flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 ${
                isActive ? "text-vanta-accent" : "text-vanta-text-muted"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              <span className="text-[10px] leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}