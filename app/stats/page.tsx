"use client";

import { useState } from "react";
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
import { Card } from "@/components/ui/Card";
import { StackedBarChart } from "@/components/statistics/StackedBarChart";
import { formatDuration, formatLiters, formatMoney } from "@/lib/format";
import * as statisticsService from "@/services/statisticsService";


type TabKey = "summary" | "productivity" | "health" | "finance";

const TABS: { key: TabKey; label: string }[] = [
  { key: "summary", label: "Сводка" },
  { key: "productivity", label: "Продуктивность" },
  { key: "health", label: "Здоровье" },
  { key: "finance", label: "Финансы" },
];

export default function StatsPage() {
  const { tasks } = useTasks();
  const { habits } = useHabits();
  const waterLog = useWaterLog();
  const focusLog = useFocusLog();
  const { expenses } = useExpenses();
  const [activeTab, setActiveTab] = useState<TabKey>("summary");

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
            value={formatDuration(summary.focusMinutes)}
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

      <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 rounded-xl border px-4 py-2 text-sm transition-colors ${
              activeTab === tab.key
                ? "border-vanta-accent bg-vanta-accent/15 text-vanta-accent"
                : "border-vanta-border text-vanta-text-muted hover:text-vanta-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "productivity" ? (
  <section className="flex flex-col gap-4">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <WeeklyChartCard title="Задачи по дням" data={weeklySeries.tasksCompleted} />
      <Card className="flex flex-col gap-4 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
          Время фокуса
        </p>
        <StackedBarChart
          data={statisticsService.getWeeklyFocusByTag(focusLog, referenceDate)}
          formatValue={(value) => `${value} мин`}
        />
      </Card>
    </div>
    {comparison.message ? <ComparisonCard message={comparison.message} /> : null}
  </section>
) : null}

      {activeTab === "health" ? (
        <section className="flex flex-col gap-4">
          <WeeklyChartCard
  title="Вода"
  data={weeklySeries.water}
  formatValue={(value) => `${formatLiters(value)} л`}
  thresholdValue={2000}
  thresholdLabel="2.0 л"
/>
        </section>
      ) : null}

      {activeTab === "finance" ? (
        <section className="flex flex-col gap-4">
          <WeeklyChartCard
            title="Расходы"
            data={weeklySeries.expenses}
            formatValue={(value) => formatMoney(value)}
          />
        </section>
      ) : null}
    </div>
  );
}