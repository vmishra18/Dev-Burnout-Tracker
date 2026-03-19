import type { DailyEntry } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;
const DISPLAY_LOCALE = "en-GB";

interface DisplayDateOptions {
  includeWeekday?: boolean;
  includeYear?: boolean;
}

export function parseISODate(date: string): Date {
  return new Date(`${date}T12:00:00`);
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

export function formatShortDate(date: string): string {
  return parseISODate(date).toLocaleDateString(DISPLAY_LOCALE, {
    day: "numeric",
    month: "short",
  });
}

export function formatLongDate(
  date: string,
  options: DisplayDateOptions = {},
): string {
  const { includeWeekday = true, includeYear = true } = options;

  return parseISODate(date).toLocaleDateString(DISPLAY_LOCALE, {
    weekday: includeWeekday ? "long" : undefined,
    day: "numeric",
    month: "long",
    year: includeYear ? "numeric" : undefined,
  });
}

export function formatDateBadge(date: string): string {
  return parseISODate(date).toLocaleDateString(DISPLAY_LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getWeekdayName(date: string): string {
  return parseISODate(date).toLocaleDateString(DISPLAY_LOCALE, {
    weekday: "long",
  });
}

export function sortEntriesByDate(entries: DailyEntry[]): DailyEntry[] {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date));
}

export function getEntriesWithinDays(
  entries: DailyEntry[],
  dayCount: number,
): DailyEntry[] {
  const sorted = sortEntriesByDate(entries);
  const newest = sorted[sorted.length - 1];

  if (!newest) {
    return [];
  }

  const newestTime = parseISODate(newest.date).getTime();

  return sorted.filter((entry) => {
    const distance = newestTime - parseISODate(entry.date).getTime();
    return distance <= (dayCount - 1) * DAY_MS;
  });
}

export function getAverage(values: number[]): number {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function getContinuousStreak(entries: DailyEntry[]): number {
  const sorted = sortEntriesByDate(entries);

  if (!sorted.length) {
    return 0;
  }

  let streak = 1;

  for (let index = sorted.length - 1; index > 0; index -= 1) {
    const current = parseISODate(sorted[index].date).getTime();
    const previous = parseISODate(sorted[index - 1].date).getTime();
    const diff = Math.round((current - previous) / DAY_MS);

    if (diff === 1) {
      streak += 1;
      continue;
    }

    if (diff > 1) {
      break;
    }
  }

  return streak;
}

export function getDaysAgo(date: string): number {
  const now = parseISODate(toISODate(new Date())).getTime();
  const compared = parseISODate(date).getTime();
  return Math.round((now - compared) / DAY_MS);
}
