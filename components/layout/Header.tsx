export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-vanta-border px-4 py-4 md:hidden">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-vanta-text">
          Vanta
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-vanta-accent" />
      </div>
    </header>
  );
}