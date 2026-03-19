import { useEffect, useMemo, useState } from "react";
import { mockEntries } from "../data/mockEntries";
import type { DailyEntry, DailyEntryInput } from "../types";
import { calculateBurnoutScore } from "../utils/burnout";
import { sortEntriesByDate } from "../utils/date";
import { loadEntries, persistEntries } from "../utils/storage";

export function useBurnoutEntries() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = loadEntries();
      const nextEntries = sortEntriesByDate(stored?.length ? stored : mockEntries);
      setEntries(nextEntries);
      setIsLoading(false);
    }, 650);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!entries.length) {
      return;
    }

    persistEntries(entries);
  }, [entries]);

  const saveEntry = (input: DailyEntryInput) => {
    const assessment = calculateBurnoutScore(input);
    const nextEntry: DailyEntry = {
      ...input,
      id: `entry-${input.date}`,
      createdAt: new Date().toISOString(),
      burnoutScore: assessment.score,
      riskLevel: assessment.riskLevel,
      explanation: assessment.explanation,
    };

    setEntries((currentEntries) => {
      const filtered = currentEntries.filter((entry) => entry.date !== input.date);
      return sortEntriesByDate([...filtered, nextEntry]);
    });

    return nextEntry;
  };

  const latestEntry = useMemo(
    () => entries[entries.length - 1] ?? null,
    [entries],
  );

  return {
    entries,
    isLoading,
    latestEntry,
    saveEntry,
  };
}
