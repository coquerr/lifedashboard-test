import { BarChart } from "@/components/ui/BarChart";
import { Card } from "@/components/ui/Card";

interface WeeklyChartCardProps {
  title: string;
  data: { label: string; value: number }[];
  formatValue?: (value: number) => string;
}

export function WeeklyChartCard({ title, data, formatValue }: WeeklyChartCardProps) {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">{title}</p>
      <BarChart data={data} formatValue={formatValue} />
    </Card>
  );
}