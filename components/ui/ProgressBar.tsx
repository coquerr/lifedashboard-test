interface ProgressBarProps {
  value: number;
  className?: string;
  trackClassName?: string;
  glow?: boolean;
}

export function ProgressBar({ value, className = "", trackClassName = "", glow = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-vanta-surface-hover ${trackClassName} ${className}`}
    >
      <div
        className="h-full rounded-full bg-vanta-accent transition-[width] duration-300 ease-in-out"
        style={{
          width: `${clamped}%`,
          boxShadow: glow ? "0 0 8px 1px rgba(201, 162, 75, 0.6)" : undefined,
        }}
      />
    </div>
  );
}