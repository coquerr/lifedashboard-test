"use client";

import { CalendarClock } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { useClientToday } from "@/hooks/useClientToday";
import { useNow } from "@/hooks/useNow";
import { useTasks } from "@/hooks/useTasks";
import { toISODate } from "@/lib/date";
import { formatTime } from "@/lib/format";

function parseTaskDateTime(dateISO: string, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const [year, month, day] = dateISO.split("-").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

export function UpcomingCard() {
  const now = useNow(30000);
  const today = useClientToday();
  const { getTasksForDate } = useTasks();

  const todayISO = today ? toISODate(today) : null;
  const todaysTasks = todayISO ? getTasksForDate(todayISO) : [];

  const upcomingTask = now
    ? todaysTasks
        .filter((task) => !task.done && task.time !== null)
        .map((task) => ({ task, at: parseTaskDateTime(task.date, task.time as string) }))
        .filter(({ at }) => at.getTime() >= now.getTime())
        .sort((a, b) => a.at.getTime() - b.at.getTime())[0]
    : undefined;

  const diffMinutes =
    now && upcomingTask ? Math.max(0, Math.round((upcomingTask.at.getTime() - now.getTime()) / 60000)) : null;

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
          Ближайшая задача
        </p>
        <CalendarClock className="h-4 w-4 text-vanta-text-dim" strokeWidth={1.75} />
      </div>

      {upcomingTask ? (
        <div>
          <p className="text-lg font-semibold text-vanta-text">{upcomingTask.task.title}</p>
          <p className="mt-1 text-sm text-vanta-text-muted">
            {formatTime(upcomingTask.at)} · {remainingLabel}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-vanta-text-muted">
            {now ? "На сегодня задач со временем нет" : "Загрузка…"}
          </p>
        </div>
      )}
    </Card>
  );
}