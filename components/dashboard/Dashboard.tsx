import { ExpensesCard } from "@/components/dashboard/ExpensesCard";
import { FocusCard } from "@/components/dashboard/FocusCard";
import { Greeting } from "@/components/dashboard/Greeting";
import { HabitsCard } from "@/components/dashboard/HabitsCard";
import { ReviewWidget } from "@/components/dashboard/ReviewWidget";
import { TasksCard } from "@/components/dashboard/TasksCard";
import { UpcomingCard } from "@/components/dashboard/UpcomingCard";
import { WaterCard } from "@/components/dashboard/WaterCard";

export function Dashboard() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <Greeting />

      <ReviewWidget />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <FocusCard />
          <TasksCard />
        </div>

        <div className="flex flex-col gap-8">
          <UpcomingCard />
          <HabitsCard />
          <WaterCard />
          <ExpensesCard />
        </div>
      </div>
    </div>
  );
}