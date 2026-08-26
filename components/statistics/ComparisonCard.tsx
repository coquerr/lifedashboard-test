import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/Card";

interface ComparisonCardProps {
  message: string;
}

export function ComparisonCard({ message }: ComparisonCardProps) {
  return (
    <Card className="flex items-center gap-3 p-5">
      <Sparkles className="h-4 w-4 shrink-0 text-vanta-accent" strokeWidth={1.75} />
      <p className="text-sm text-vanta-text">{message}</p>
    </Card>
  );
}