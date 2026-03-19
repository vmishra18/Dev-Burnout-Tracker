import type { DailyEntry, DailyEntryInput } from "../types";
import { DailyCheckinForm } from "../components/DailyCheckinForm";

interface CheckInPageProps {
  entries: DailyEntry[];
  onSubmit: (entry: DailyEntryInput) => void;
}

export function CheckInPage({ entries, onSubmit }: CheckInPageProps) {
  return <DailyCheckinForm entries={entries} onSubmit={onSubmit} />;
}
