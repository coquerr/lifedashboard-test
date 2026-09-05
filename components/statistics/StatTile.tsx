import type { ReactNode } from "react";

interface StatTileProps {
  label: string;
  value: string;
  caption?: string;
  icon?: ReactNode;
}

export function StatTile({ label, value, caption, icon }: StatTileProps) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5 text-center">
      {icon ? <div className="text-vanta-text-dim">{icon}</div> : null}
      <p className="text-xl font-semibold text-vanta-text sm:text-2xl">{value}</p>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-vanta-text-dim">
        {label}
      </p>
      {caption ? <p className="text-[11px] text-vanta-text-muted">{caption}</p> : null}
    </div>
  );
}