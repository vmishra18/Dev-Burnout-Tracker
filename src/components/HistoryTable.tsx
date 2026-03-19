import { useDeferredValue, useMemo, useState } from "react";
import { CalendarRange, Search, SlidersHorizontal } from "lucide-react";
import type { DailyEntry, HistoryFilter } from "../types";
import { formatLongDate, getDaysAgo } from "../utils/date";
import { EmptyState } from "./EmptyState";

interface HistoryTableProps {
  entries: DailyEntry[];
}

const filters: Array<{ id: HistoryFilter; label: string }> = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "all", label: "All time" },
];

export function HistoryTable({ entries }: HistoryTableProps) {
  const [filter, setFilter] = useState<HistoryFilter>("30d");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredEntries = useMemo(() => {
    const byRange = entries.filter((entry) => {
      if (filter === "all") {
        return true;
      }

      const daysAgo = getDaysAgo(entry.date);
      return filter === "7d" ? daysAgo <= 6 : daysAgo <= 29;
    });

    const normalizedQuery = deferredQuery.trim().toLowerCase();
    const bySearch = normalizedQuery
      ? byRange.filter((entry) =>
          `${entry.notes} ${entry.riskLevel}`.toLowerCase().includes(normalizedQuery),
        )
      : byRange;

    return [...bySearch].sort((a, b) => b.date.localeCompare(a.date));
  }, [deferredQuery, entries, filter]);

  if (!entries.length) {
    return (
      <EmptyState
        title="No check-ins yet"
        description="Once you log a few days, your timeline, score history, and reflection notes will show up here."
      />
    );
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="grid gap-6 xl:sticky xl:top-8 xl:self-start">
        <div className="showcase-panel glass-panel rounded-[42px] p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="metric-chip">timeline</span>
            <span className="metric-chip">searchable timeline</span>
          </div>
          <h2 className="mt-4 font-display text-[2.2rem] font-bold leading-[0.98] tracking-tight sm:text-4xl">
            Look back gently and notice what your harder days had in common.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            Use the timeline to connect how you felt with how workload, sleep, and meetings were stacking.
          </p>
        </div>

        <div className="glass-panel rounded-[38px] p-6">
          <div className="section-head">
            <div className="icon-badge border-accent/15 bg-accent/10 text-accent">
              <SlidersHorizontal size={16} />
            </div>
            <p className="section-label">Filters</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.map((item) => {
              const active = filter === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-accent text-slate-950"
                      : "border border-border/15 bg-card/45 text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <label className="soft-panel mt-5 flex items-center gap-3 rounded-[22px] px-4 py-3">
            <Search size={16} className="text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search reflection notes or risk"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
            />
          </label>
        </div>
      </aside>

      <div className="glass-panel rounded-[42px] p-6">
        {filteredEntries.length ? (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <article
                key={entry.id}
                className="showcase-panel grid gap-4 rounded-[34px] border border-border/15 bg-card/30 p-5 lg:grid-cols-[220px_minmax(0,1fr)]"
              >
                <div className="soft-panel p-4">
                  <div className="flex items-center gap-3">
                    <div className="icon-badge border-accent/15 bg-accent/10 text-accent">
                      <CalendarRange size={18} />
                    </div>
                    <div>
                      <p className="section-label">Date</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {formatLongDate(entry.date)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="soft-card flex items-center justify-between px-3 py-2.5">
                      <span className="text-xs text-muted">Burnout score</span>
                      <span className="text-sm font-semibold text-foreground">
                        {entry.burnoutScore}/100
                      </span>
                    </div>
                    <div className="soft-card flex items-center justify-between px-3 py-2.5">
                      <span className="text-xs text-muted">Risk</span>
                      <span className="rounded-full border border-border/15 bg-card/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-foreground">
                        {entry.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-4">
                    <div className="soft-card px-4 py-3">
                      <p className="section-label">Mood</p>
                      <p className="mt-2 font-display text-2xl font-bold tracking-tight">
                        {entry.mood}/5
                      </p>
                    </div>
                    <div className="soft-card px-4 py-3">
                      <p className="section-label">Stress</p>
                      <p className="mt-2 font-display text-2xl font-bold tracking-tight">
                        {entry.stress}/10
                      </p>
                    </div>
                    <div className="soft-card px-4 py-3">
                      <p className="section-label">Sleep</p>
                      <p className="mt-2 font-display text-2xl font-bold tracking-tight">
                        {entry.sleepHours}h
                      </p>
                    </div>
                    <div className="soft-card px-4 py-3">
                      <p className="section-label">Coding</p>
                      <p className="mt-2 font-display text-2xl font-bold tracking-tight">
                        {entry.codingHours}h
                      </p>
                    </div>
                  </div>

                  <div className="soft-card p-4">
                    <p className="section-label">Reflection note</p>
                    <p className="mt-3 text-sm leading-7 text-muted">
                      {entry.notes || "No note was saved for this day."}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No entries match this filter"
            description="Try a broader range or search term to surface more of your timeline."
          />
        )}
      </div>
    </section>
  );
}
