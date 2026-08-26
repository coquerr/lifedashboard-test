import { Cloud } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { getMockWeather } from "@/lib/weather";

export function WeatherCard() {
  const weather = getMockWeather();

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
          Погода
        </p>
        <Cloud className="h-4 w-4 text-vanta-text-dim" strokeWidth={1.75} />
      </div>

      <div>
        <p className="text-3xl font-semibold text-vanta-text">{weather.tempC}°</p>
        <p className="mt-1 text-sm text-vanta-text-muted">
          {weather.condition} · {weather.city}
        </p>
      </div>
    </Card>
  );
}