"use client";

import { CalendarClock } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { useNow } from "@/hooks/useNow";
import { formatTime } from "@/lib/format";
import { getMockUpcomingEvent } from "@/lib/mock-events";

export function UpcomingCard() {
  const now = useNow(30000);
  const event = getMockUpcomingEvent();
  const eventDate = new Date(event.time);

  const diffMinutes = now
    ? Math.max(0, Math.round((eventDate.getTime() - now.getTime()) / 60000))
    : null;

  const hours = diffMinutes !== null ? Math.floor(diffMinutes / 60) : 0;
  const minutes = diffMinutes !== null ? diffMinutes % 60 : 0;

  const remainingLabel =
    diffMinutes === null
      ? ""
      : diffMinutes <= 0
        ? "уже началось"
        : hours > 0
          ? `через ${hours} ч ${minutes} мин`
          : `через ${minutes} мин`;

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
          Ближайшее событие
        </p>
        <CalendarClock className="h-4 w-4 text-vanta-text-dim" strokeWidth={1.75} />
      </div>

      <div>
        <p className="text-lg font-semibold text-vanta-text">{event.title}</p>
        <p className="mt-1 text-sm text-vanta-text-muted">
          {formatTime(eventDate)} · {remainingLabel}
        </p>
      </div>
    </Card>
  );
}