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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Greeting />

      <ReviewWidget />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-6">
          <UpcomingCard />
        </div>
        <div className="md:col-span-6">
          <FocusCard />
        </div>

        <div className="md:col-span-7">
          <TasksCard />
        </div>
        <div className="md:col-span-5">
          <HabitsCard />
        </div>

        <div className="md:col-span-6">
          <WaterCard />
        </div>
        <div className="md:col-span-6">
          <ExpensesCard />
        </div>
      </div>
    </div>
  );
}