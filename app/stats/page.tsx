"use client";

import { Droplet, ListChecks, Repeat, Timer, Wallet } from "lucide-react";

import { ComparisonCard } from "@/components/statistics/ComparisonCard";
import { DailyScoreCard } from "@/components/statistics/DailyScoreCard";
import { StatTile } from "@/components/statistics/StatTile";
import { WeeklyChartCard } from "@/components/statistics/WeeklyChartCard";
import { useExpenses } from "@/hooks/useExpenses";
import { useFocusLog } from "@/hooks/useFocusLog";
import { useHabits } from "@/hooks/useHabits";
import { useTasks } from "@/hooks/useTasks";
import { useWaterLog } from "@/hooks/useWaterLog";
import { todayISO } from "@/lib/date";
import { formatLiters, formatMoney } from "@/lib/format";
import * as statisticsService from "@/services/statisticsService";

function formatFocusMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} мин`;
  return `${hours} ч ${rest} мин`;
}

export default function StatsPage() {
  const { tasks } = useTasks();
  const { habits } = useHabits();
  const waterLog = useWaterLog();
  const focusLog = useFocusLog();
  const { expenses } = useExpenses();

  const today = todayISO();
  const referenceDate = new Date();

  const summary = statisticsService.getTodaySummary(
    tasks,
    habits,
    waterLog,
    focusLog,
    expenses,
    today,
  );

  const weeklySeries = statisticsService.getWeeklySeries(
    tasks,
    waterLog,
    focusLog,
    expenses,
    referenceDate,
  );

  const dailyScore = statisticsService.computeDailyScore(summary, habits, today);
  const comparison = statisticsService.compareWeeklyTasks(tasks, referenceDate);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">Обзор</p>
        <h1 className="mt-2 text-2xl font-semibold text-vanta-text">Статистика</h1>
      </div>

      <section className="flex flex-col gap-4">
        <p className="text-sm font-medium text-vanta-text-muted">Сегодня</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatTile
            label="Задачи"
            value={`${summary.tasksDone}/${summary.tasksTotal}`}
            icon={<ListChecks className="h-4 w-4 text-vanta-text-dim" strokeWidth={1.75} />}
          />
          <StatTile
            label="Привычки"
            value={`${summary.habitsDone}/${summary.habitsTotal}`}
            icon={<Repeat className="h-4 w-4 text-vanta-text-dim" strokeWidth={1.75} />}
          />
          <StatTile
            label="Фокус"
            value={formatFocusMinutes(summary.focusMinutes)}
            icon={<Timer className="h-4 w-4 text-vanta-text-dim" strokeWidth={1.75} />}
          />
          <StatTile
            label="Вода"
            value={`${formatLiters(summary.waterMl)} л`}
            caption={`из ${formatLiters(summary.waterGoalMl)} л`}
            icon={<Droplet className="h-4 w-4 text-vanta-text-dim" strokeWidth={1.75} />}
          />
          <StatTile
            label="Расходы"
            value={formatMoney(summary.expensesTotal)}
            icon={<Wallet className="h-4 w-4 text-vanta-text-dim" strokeWidth={1.75} />}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <p className="text-sm font-medium text-vanta-text-muted">Daily Score</p>
        <DailyScoreCard score={dailyScore} />
      </section>

      <section className="flex flex-col gap-4">
        <p className="text-sm font-medium text-vanta-text-muted">Неделя</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <WeeklyChartCard title="Задачи по дням" data={weeklySeries.tasksCompleted} />
          <WeeklyChartCard
            title="Время фокуса"
            data={weeklySeries.focusMinutes}
            formatValue={(value) => `${value} мин`}
          />
          <WeeklyChartCard
            title="Вода"
            data={weeklySeries.water}
            formatValue={(value) => `${formatLiters(value)} л`}
          />
          <WeeklyChartCard
            title="Расходы"
            data={weeklySeries.expenses}
            formatValue={(value) => formatMoney(value)}
          />
        </div>
      </section>

      {comparison.message ? (
        <section className="flex flex-col gap-4">
          <p className="text-sm font-medium text-vanta-text-muted">Сравнение</p>
          <ComparisonCard message={comparison.message} />
        </section>
      ) : null}
    </div>
  );
}