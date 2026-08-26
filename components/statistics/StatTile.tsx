import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";

interface StatTileProps {
  label: string;
  value: string;
  caption?: string;
  icon?: ReactNode;
}

export function StatTile({ label, value, caption, icon }: StatTileProps) {
  return (
    <Card className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-vanta-text-dim">
          {label}
        </p>
        {icon}
      </div>
      <p className="text-2xl font-semibold text-vanta-text">{value}</p>
      {caption ? <p className="text-xs text-vanta-text-muted">{caption}</p> : null}
    </Card>
  );
}