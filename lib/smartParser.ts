const WEEKDAYS: { pattern: RegExp; weekday: number }[] = [
  { pattern: /\bв\s+понедельник\b/iu, weekday: 1 },
  { pattern: /\bво\s+вторник\b/iu, weekday: 2 },
  { pattern: /\bв\s+среду\b/iu, weekday: 3 },
  { pattern: /\bв\s+четверг\b/iu, weekday: 4 },
  { pattern: /\bв\s+пятницу\b/iu, weekday: 5 },
  { pattern: /\bв\s+субботу\b/iu, weekday: 6 },
  { pattern: /\bв\s+воскресенье\b/iu, weekday: 0 },
];

const TIME_PATTERN = /\bв\s+(\d{1,2}):(\d{2})\b/u;
const TRAILING_AMOUNT_PATTERN = /(\d+(?:[.,]\d+)?)\s*$/u;

export interface SmartParseResult {
  cleanText: string;
  date: Date | null;
  time: string | null;
  amount: number | null;
  categoryHint: string | null;
}

const CATEGORY_KEYWORDS: { category: string; keywords: string[] }[] = [
  { category: "food", keywords: ["обед", "ужин", "завтрак", "кафе", "ресторан", "продукты", "протеин", "ксб"] },
  { category: "transport", keywords: ["такси", "метро", "автобус", "бензин", "заправка"] },
  { category: "shopping", keywords: ["магазин", "покупк", "одежда"] },
  { category: "entertainment", keywords: ["кино", "игра", "концерт"] },
  { category: "education", keywords: ["курс", "книга", "учеба", "учёба"] },
];

function nextWeekday(from: Date, targetWeekday: number): Date {
  const result = new Date(from);
  const currentWeekday = result.getDay();
  let diff = targetWeekday - currentWeekday;
  if (diff <= 0) diff += 7;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function guessCategory(text: string): string | null {
  const lower = text.toLowerCase();
  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      return category;
    }
  }
  return null;
}

/**
 * Разбирает свободный текст на дату, время, сумму и подсказку по
 * категории расходов. Чистая функция — не зависит от React или
 * localStorage. referenceDate позволяет тестировать/передавать
 * конкретный "сегодня" вместо неявного new Date().
 */
export function parseNaturalLanguage(
  input: string,
  referenceDate: Date = new Date(),
): SmartParseResult {
  let remaining = input;
  let date: Date | null = null;
  let time: string | null = null;
  let amount: number | null = null;

  if (/\bзавтра\b/iu.test(remaining)) {
    date = new Date(referenceDate);
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    remaining = remaining.replace(/\bзавтра\b/giu, "");
  } else if (/\bсегодня\b/iu.test(remaining)) {
    date = new Date(referenceDate);
    date.setHours(0, 0, 0, 0);
    remaining = remaining.replace(/\bсегодня\b/giu, "");
  } else {
    for (const { pattern, weekday } of WEEKDAYS) {
      if (pattern.test(remaining)) {
        date = nextWeekday(referenceDate, weekday);
        remaining = remaining.replace(pattern, "");
        break;
      }
    }
  }

  const timeMatch = remaining.match(TIME_PATTERN);
  if (timeMatch) {
    const hours = timeMatch[1].padStart(2, "0");
    const minutes = timeMatch[2];
    time = `${hours}:${minutes}`;
    remaining = remaining.replace(TIME_PATTERN, "");
  }

  const amountMatch = remaining.match(TRAILING_AMOUNT_PATTERN);
  if (amountMatch) {
    const parsed = Number(amountMatch[1].replace(",", "."));
    if (Number.isFinite(parsed) && parsed > 0) {
      amount = parsed;
      remaining = remaining.slice(0, amountMatch.index).trim();
    }
  }

  const cleanText = remaining.replace(/\s{2,}/g, " ").trim();
  const categoryHint = amount !== null ? guessCategory(input) : null;

  return { cleanText, date, time, amount, categoryHint };
}