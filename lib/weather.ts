import type { WeatherData } from "@/types/dashboard";

/**
 * Мок-данные погоды для Этапа 2.
 *
 * На будущем этапе эта функция будет заменена на реальный запрос —
 * например, через собственный Route Handler (app/api/weather/route.ts),
 * который будет обращаться к внешнему weather API на сервере (чтобы
 * API-ключ не попадал в клиентский код) и возвращать данные в этом же
 * формате WeatherData. Компоненты, использующие getMockWeather,
 * менять не придётся.
 */
export function getMockWeather(): WeatherData {
  return {
    city: "Москва",
    tempC: 18,
    condition: "Переменная облачность",
  };
}