import type {
  ChartPoint,
  DailyEntry,
  Insight,
  StatusBadge,
  UserProfile,
  WeeklySummary,
} from "../types";
import {
  formatShortDate,
  getAverage,
  getContinuousStreak,
  getEntriesWithinDays,
  getWeekdayName,
  sortEntriesByDate,
} from "./date";

function averageMetric(entries: DailyEntry[], field: keyof DailyEntry): number {
  return getAverage(entries.map((entry) => Number(entry[field])));
}

export function buildChartData(entries: DailyEntry[], dayCount = 7): ChartPoint[] {
  return getEntriesWithinDays(entries, dayCount).map((entry) => ({
    date: entry.date,
    label: formatShortDate(entry.date),
    mood: entry.mood,
    stress: entry.stress,
    productivity: entry.productivity,
    codingHours: entry.codingHours,
    sleepHours: entry.sleepHours,
    burnoutScore: entry.burnoutScore,
  }));
}

export function getWeeklySummary(
  entries: DailyEntry[],
  profile?: UserProfile | null,
): WeeklySummary {
  const current = getEntriesWithinDays(entries, 7);
  const previous = getEntriesWithinDays(entries, 14).slice(0, -current.length);

  const averageBurnout = Math.round(averageMetric(current, "burnoutScore"));
  const averageSleep = Number(averageMetric(current, "sleepHours").toFixed(1));
  const averageStress = Number(averageMetric(current, "stress").toFixed(1));
  const averageProductivity = Number(
    averageMetric(current, "productivity").toFixed(1),
  );
  const totalCodingHours = Number(
    current.reduce((sum, entry) => sum + entry.codingHours, 0).toFixed(1),
  );
  const previousBurnout = Math.round(averageMetric(previous, "burnoutScore"));
  const deltaBurnout = averageBurnout - previousBurnout;

  let summary =
    "Your week looks steady, with productive output and manageable stress signals.";
  let takeBreakSuggestion =
    "Keep your current routine and protect at least one uninterrupted recovery block this weekend.";
  let focusArea = "Maintain a steady workload and protect recovery.";

  if (averageBurnout >= 70) {
    summary =
      "This week carried a heavy cognitive load, and your recovery signals slipped at the same time.";
    takeBreakSuggestion =
      "Book a low-meeting block tomorrow, end work on time, and protect a full evening away from screens.";
    focusArea = "Reduce load quickly and create space for real decompression.";
  } else if (averageBurnout >= 50) {
    summary =
      "You are still functioning well, but the week is trending toward fatigue and diminishing returns.";
    takeBreakSuggestion =
      "Try a lighter second half of the day with fewer meetings and a deliberate walking break.";
    focusArea = "Stabilize the week before moderate fatigue becomes your default.";
  }

  if (profile) {
    if (averageSleep < profile.goals.sleepTarget) {
      focusArea = `Sleep is ${(
        profile.goals.sleepTarget - averageSleep
      ).toFixed(1)}h below your target, so recovery should be the priority.`;
    } else if (averageStress > profile.goals.stressCeiling) {
      focusArea =
        "Your stress is above the ceiling you set, so reducing interruptions matters more than squeezing in extra work.";
    } else if (totalCodingHours / Math.max(current.length, 1) > profile.goals.maxCodingHours) {
      focusArea =
        "Your coding load is running above the limit you set for sustainable focus.";
    }
  }

  return {
    averageBurnout,
    averageSleep,
    averageStress,
    averageProductivity,
    totalCodingHours,
    deltaBurnout,
    summary,
    takeBreakSuggestion,
    focusArea,
  };
}

export function getBestDay(entries: DailyEntry[]): string {
  const byWeekday = new Map<string, DailyEntry[]>();

  sortEntriesByDate(entries).forEach((entry) => {
    const day = getWeekdayName(entry.date);
    const existing = byWeekday.get(day) ?? [];
    byWeekday.set(day, [...existing, entry]);
  });

  let bestDay = "Tuesday";
  let bestScore = -Infinity;

  byWeekday.forEach((dayEntries, day) => {
    const score =
      getAverage(dayEntries.map((entry) => entry.mood * 12 - entry.stress * 3)) -
      getAverage(dayEntries.map((entry) => entry.burnoutScore * 0.2));

    if (score > bestScore) {
      bestScore = score;
      bestDay = day;
    }
  });

  return bestDay;
}

export function getMotivationalBadges(
  entries: DailyEntry[],
  streak = getContinuousStreak(entries),
): StatusBadge[] {
  const weekly = getEntriesWithinDays(entries, 7);
  const averageSleep = getAverage(weekly.map((entry) => entry.sleepHours));
  const averageMood = getAverage(weekly.map((entry) => entry.mood));
  const badges: StatusBadge[] = [];

  if (streak >= 5) {
    badges.push({
      id: "streak",
      label: `${streak}-day streak`,
      description: "You have kept a strong reflection habit going.",
      tone: "accent",
    });
  }

  if (averageSleep >= 7.5) {
    badges.push({
      id: "sleep",
      label: "Sleep protected",
      description: "You are averaging enough rest to support deep work.",
      tone: "success",
    });
  }

  if (averageMood >= 4) {
    badges.push({
      id: "mood",
      label: "Solid momentum",
      description: "Your mood has stayed consistently resilient this week.",
      tone: "success",
    });
  }

  if (!badges.length) {
    badges.push({
      id: "reset",
      label: "Reset week",
      description: "A small improvement streak starts with one lighter day.",
      tone: "warning",
    });
  }

  return badges;
}

export function generateInsights(
  entries: DailyEntry[],
  profile?: UserProfile | null,
): Insight[] {
  const sorted = sortEntriesByDate(entries);
  const last7 = getEntriesWithinDays(sorted, 7);
  const previous7 = getEntriesWithinDays(sorted, 14).slice(0, -last7.length);
  const insights: Insight[] = [];

  if (!sorted.length) {
    return insights;
  }

  let consecutiveLongSessions = 0;
  let maxLongSessionStreak = 0;
  for (const entry of last7) {
    if (entry.codingHours >= 11) {
      consecutiveLongSessions += 1;
      maxLongSessionStreak = Math.max(maxLongSessionStreak, consecutiveLongSessions);
    } else {
      consecutiveLongSessions = 0;
    }
  }

  if (maxLongSessionStreak >= 3) {
    insights.push({
      id: "coding-streak",
      title: "Long-session risk detected",
      description: `You worked 11+ hours for ${maxLongSessionStreak} days in a row, which usually compounds fatigue quickly.`,
      tone: "warning",
    });
  }

  const currentSleep = getAverage(last7.map((entry) => entry.sleepHours));
  const previousSleep = getAverage(previous7.map((entry) => entry.sleepHours));
  if (previousSleep && currentSleep < previousSleep - 0.6) {
    insights.push({
      id: "sleep-drop",
      title: "Sleep dropped this week",
      description: `Your sleep is down by ${(previousSleep - currentSleep).toFixed(1)} hours compared with the previous week.`,
      tone: "warning",
    });
  }

  const earlyStress = getAverage(last7.slice(0, 3).map((entry) => entry.stress));
  const lateStress = getAverage(last7.slice(-3).map((entry) => entry.stress));
  if (lateStress >= earlyStress + 1) {
    insights.push({
      id: "stress-trend",
      title: "Stress is trending upward",
      description: "Your last few check-ins show higher stress than the start of the week.",
      tone: "warning",
    });
  }

  const weekdayEntries = sorted.filter((entry) => {
    const day = getWeekdayName(entry.date);
    return !["Saturday", "Sunday"].includes(day);
  });
  const weekendEntries = sorted.filter((entry) => {
    const day = getWeekdayName(entry.date);
    return ["Saturday", "Sunday"].includes(day);
  });
  if (
    weekdayEntries.length > 2 &&
    weekendEntries.length > 1 &&
    getAverage(weekdayEntries.map((entry) => entry.stress)) >=
      getAverage(weekendEntries.map((entry) => entry.stress)) + 1
  ) {
    insights.push({
      id: "weekday-stress",
      title: "Weekdays carry the heaviest load",
      description: "You seem noticeably more stressed on workdays than on weekends.",
      tone: "neutral",
    });
  }

  const lowSleepDays = sorted.filter((entry) => entry.sleepHours < 7);
  const restedDays = sorted.filter((entry) => entry.sleepHours >= 7);
  if (
    lowSleepDays.length > 2 &&
    restedDays.length > 2 &&
    getAverage(lowSleepDays.map((entry) => entry.productivity)) <=
      getAverage(restedDays.map((entry) => entry.productivity)) - 1
  ) {
    insights.push({
      id: "sleep-productivity",
      title: "Sleep is tied to productivity",
      description: "On lower-sleep days your productivity tends to dip meaningfully.",
      tone: "neutral",
    });
  }

  const longCodingDays = sorted.filter((entry) => entry.codingHours >= 9);
  const shorterCodingDays = sorted.filter((entry) => entry.codingHours < 9);
  if (
    longCodingDays.length > 2 &&
    shorterCodingDays.length > 2 &&
    getAverage(longCodingDays.map((entry) => entry.burnoutScore)) >=
      getAverage(shorterCodingDays.map((entry) => entry.burnoutScore)) + 10
  ) {
    insights.push({
      id: "coding-burnout",
      title: "Long coding sessions raise your risk",
      description: "Your burnout score jumps on days with extended deep-work blocks.",
      tone: "warning",
    });
  }

  const betterBreaks = sorted.filter((entry) => entry.breakQuality >= 4);
  const poorBreaks = sorted.filter((entry) => entry.breakQuality <= 2);
  if (
    betterBreaks.length > 1 &&
    poorBreaks.length > 1 &&
    getAverage(betterBreaks.map((entry) => entry.mood)) >=
      getAverage(poorBreaks.map((entry) => entry.mood)) + 0.8
  ) {
    insights.push({
      id: "break-mood",
      title: "Better breaks improve your mood",
      description: "Days with stronger breaks consistently line up with better mood scores.",
      tone: "positive",
    });
  }

  if (profile) {
    const last7AverageCoding = getAverage(last7.map((entry) => entry.codingHours));
    if (last7AverageCoding > profile.goals.maxCodingHours) {
      insights.push({
        id: "goal-coding-load",
        title: "You are above your sustainable coding limit",
        description: `Your recent average coding time is ${last7AverageCoding.toFixed(1)}h, above your target of ${profile.goals.maxCodingHours}h.`,
        tone: "warning",
      });
    }

    const last7AverageSleep = getAverage(last7.map((entry) => entry.sleepHours));
    if (last7AverageSleep < profile.goals.sleepTarget) {
      insights.push({
        id: "goal-sleep-target",
        title: "Recovery is below your goal",
        description: `You are averaging ${last7AverageSleep.toFixed(1)}h of sleep against a target of ${profile.goals.sleepTarget}h.`,
        tone: "neutral",
      });
    }

    if (profile.focus === "stress" && getAverage(last7.map((entry) => entry.stress)) > 6) {
      insights.push({
        id: "focus-stress",
        title: "Your current focus area needs support",
        description:
          "You marked stress reduction as the priority, and your recent entries suggest that still needs intervention.",
        tone: "warning",
      });
    }
  }

  if (!insights.length) {
    insights.push({
      id: "steady",
      title: "Your routine looks balanced",
      description: "No major warning patterns are showing up yet. Keep logging to unlock deeper insights.",
      tone: "positive",
    });
  }

  return insights.slice(0, 7);
}

export function getPersonalizedRecommendations(
  entries: DailyEntry[],
  profile?: UserProfile | null,
): string[] {
  const last7 = getEntriesWithinDays(entries, 7);

  if (!last7.length) {
    return [
      "Start with three honest check-ins this week so the system can learn your rhythm.",
      "Protect one uninterrupted lunch break before optimizing anything else.",
    ];
  }

  const recommendations: string[] = [];
  const averageSleep = getAverage(last7.map((entry) => entry.sleepHours));
  const averageStress = getAverage(last7.map((entry) => entry.stress));
  const averageMeetings = getAverage(last7.map((entry) => entry.meetings));

  if (profile && averageSleep < profile.goals.sleepTarget) {
    recommendations.push(
      `Move one evening commitment this week so you can close the sleep gap to your ${profile.goals.sleepTarget}h target.`,
    );
  }

  if (averageStress >= 7) {
    recommendations.push(
      "Schedule a low-context-switching block tomorrow and decline one nonessential meeting if possible.",
    );
  }

  if (averageMeetings >= 4) {
    recommendations.push(
      "Cluster meetings into a tighter window so your best focus hours stay protected.",
    );
  }

  if (profile?.focus === "focus") {
    recommendations.push(
      "Batch reviews and Slack catch-up into one pass instead of letting them fragment deep work.",
    );
  }

  if (profile?.focus === "balance") {
    recommendations.push(
      "Pick one clean end-of-day cutoff this week and treat it as a hard product constraint.",
    );
  }

  if (!recommendations.length) {
    recommendations.push(
      "Your routine looks stable right now. Keep the check-ins consistent and protect the habits already working.",
    );
  }

  return recommendations.slice(0, 3);
}
