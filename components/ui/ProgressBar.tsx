interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-vanta-surface-hover ${className}`}
    >
      <div
        className="h-full rounded-full bg-vanta-accent transition-[width] duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}