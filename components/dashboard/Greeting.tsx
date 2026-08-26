"use client";

import { useState } from "react";

import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { useNow } from "@/hooks/useNow";
import { formatDate, formatTime } from "@/lib/format";
import { getGreeting } from "@/lib/greeting";
import { STORAGE_KEYS } from "@/lib/storage-keys";

export function Greeting() {
  const now = useNow();
  const [name, setName] = useLocalStorageState(STORAGE_KEYS.username, "Пользователь");
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  function startEditing() {
    setDraft(name);
    setIsEditing(true);
  }

  function commitEditing() {
    const trimmed = draft.trim();
    setName(trimmed.length > 0 ? trimmed : "Пользователь");
    setIsEditing(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-vanta-text-muted">
        {now ? getGreeting(now) : "Здравствуйте"}
        {", "}
        {isEditing ? (
          <input
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitEditing}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitEditing();
            }}
            className="w-40 border-b border-vanta-border bg-transparent text-vanta-text outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={startEditing}
            className="text-vanta-text underline decoration-vanta-border decoration-dotted underline-offset-4 hover:decoration-vanta-accent"
          >
            {name}
          </button>
        )}
      </p>

      <div className="flex items-baseline gap-3">
        <span className="font-mono text-4xl font-semibold tracking-tight text-vanta-text">
          {now ? formatTime(now) : "--:--"}
        </span>
        <span className="text-sm capitalize text-vanta-text-muted">
          {now ? formatDate(now) : ""}
        </span>
      </div>
    </div>
  );
}