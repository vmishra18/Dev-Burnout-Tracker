import { HistoryTable } from "../components/HistoryTable";
import { EmptyState } from "../components/EmptyState";
import type { DailyEntry } from "../types";

interface HistoryPageProps {
  entries: DailyEntry[];
}

export function HistoryPage({ entries }: HistoryPageProps) {
  if (!entries.length) {
    return (
      <EmptyState
        title="No timeline yet"
        description="Log your first check-in to unlock your timeline, trend charts, and reflection notes."
      />
    );
  }

  return <HistoryTable entries={entries} />;
}
