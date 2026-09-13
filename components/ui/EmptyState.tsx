import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <Icon className="h-12 w-12 text-vanta-text-dim" strokeWidth={1} />

      <div className="flex flex-col gap-1">
        <p className="font-medium text-vanta-text-muted">{title}</p>
        <p className="max-w-xs text-sm text-vanta-text-dim">{description}</p>
      </div>

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="rounded-md border border-vanta-accent px-3 py-2 text-sm text-vanta-accent transition-colors hover:bg-vanta-accent/10"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}