import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  bracket?: boolean;
  className?: string;
}

/**
 * Базовая графитовая карточка VANTA.
 * bracket=true добавляет тонкие угловые засечки акцентного цвета —
 * фирменный визуальный элемент интерфейса.
 */
export function Card({ children, bracket = false, className = "" }: CardProps) {
  return (
    <div
      className={`relative rounded-2xl border border-vanta-border bg-vanta-surface shadow-[0_12px_32px_-16px_rgba(0,0,0,0.7)] ${className}`}
    >
      {bracket ? (
        <>
          <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-vanta-accent/50" />
          <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-vanta-accent/50" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-vanta-accent/50" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-vanta-accent/50" />
        </>
      ) : null}
      {children}
    </div>
  );
}