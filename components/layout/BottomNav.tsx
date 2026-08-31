"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal } from "lucide-react";

import { navItems } from "@/lib/navigation";
import { Modal } from "@/components/ui/Modal";

const primaryItems = navItems.filter((item) => item.primary);
const secondaryItems = navItems.filter((item) => !item.primary);

export function BottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isSecondaryActive = secondaryItems.some((item) => pathname === item.href);

  return (
    <>
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-10 border-t border-vanta-border bg-vanta-bg/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-between px-2 py-2">
          {primaryItems.map((item) => {
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

          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            aria-label="Ещё"
            aria-haspopup="dialog"
            aria-expanded={isMoreOpen}
            className={`flex min-w-[64px] flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 ${
              isSecondaryActive ? "text-vanta-accent" : "text-vanta-text-muted"
            }`}
          >
            <MoreHorizontal className="h-5 w-5" strokeWidth={1.75} />
            <span className="text-[10px] leading-none">Ещё</span>
          </button>
        </div>
      </nav>

      <Modal isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} title="Ещё">
        <div className="flex flex-col gap-1">
          {secondaryItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (!item.enabled) {
              return (
                <span
                  key={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-vanta-text-dim"
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                  <span className="text-sm">{item.label}</span>
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMoreOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-vanta-surface-hover ${
                  isActive
                    ? "text-vanta-accent"
                    : "text-vanta-text-muted hover:text-vanta-text"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </Modal>
    </>
  );
}