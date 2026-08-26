"use client";

import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      aria-label={label}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
        checked
          ? "border-vanta-accent bg-vanta-accent/15"
          : "border-vanta-border bg-transparent"
      }`}
    >
      {checked ? (
        <Check className="h-3.5 w-3.5 text-vanta-accent" strokeWidth={2.5} />
      ) : null}
    </button>
  );
}