import { type FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Coffee,
  MessageSquareText,
  Save,
  Sparkles,
  TimerReset,
} from "lucide-react";
import type { BreakQuality, DailyEntry, DailyEntryInput } from "../types";
import { calculateBurnoutScore, getRiskColor } from "../utils/burnout";
import { formatDateBadge, toISODate } from "../utils/date";
import { MoodSelector } from "./MoodSelector";
import { SliderField } from "./SliderField";

interface DailyCheckinFormProps {
  entries: DailyEntry[];
  onSubmit: (entry: DailyEntryInput) => void;
}

const breakLabels: Array<{ value: BreakQuality; label: string }> = [
  { value: 1, label: "Skipped" },
  { value: 2, label: "Rushed" },
  { value: 3, label: "Okay" },
  { value: 4, label: "Good" },
  { value: 5, label: "Restorative" },
];

function createInitialState(date = toISODate(new Date())): DailyEntryInput {
  return {
    date,
    mood: 3,
    stress: 5,
    productivity: 7,
    codingHours: 8,
    sleepHours: 7,
    breakQuality: 3,
    meetings: 2,
    notes: "",
  };
}

export function DailyCheckinForm({
  entries,
  onSubmit,
}: DailyCheckinFormProps) {
  const [form, setForm] = useState<DailyEntryInput>(createInitialState());

  const existingEntry = useMemo(
    () => entries.find((entry) => entry.date === form.date) ?? null,
    [entries, form.date],
  );

  useEffect(() => {
    if (existingEntry) {
      setForm({
        date: existingEntry.date,
        mood: existingEntry.mood,
        stress: existingEntry.stress,
        productivity: existingEntry.productivity,
        codingHours: existingEntry.codingHours,
        sleepHours: existingEntry.sleepHours,
        breakQuality: existingEntry.breakQuality,
        meetings: existingEntry.meetings,
        notes: existingEntry.notes,
      });
    }
  }, [existingEntry]);

  const assessment = useMemo(() => calculateBurnoutScore(form), [form]);
  const previewColor = getRiskColor(assessment.riskLevel);
  const formatFactorLabel = (label: string) => `${label.charAt(0).toUpperCase()}${label.slice(1)}`;

  const handleFieldChange = <Key extends keyof DailyEntryInput>(
    key: Key,
    value: DailyEntryInput[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleDateChange = (date: string) => {
    const match = entries.find((entry) => entry.date === date);
    if (match) {
      setForm({
        date: match.date,
        mood: match.mood,
        stress: match.stress,
        productivity: match.productivity,
        codingHours: match.codingHours,
        sleepHours: match.sleepHours,
        breakQuality: match.breakQuality,
        meetings: match.meetings,
        notes: match.notes,
      });
      return;
    }

    setForm((current) => ({
      ...createInitialState(date),
      notes: current.date === date ? current.notes : "",
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_400px]">
      <motion.form
        layout
        onSubmit={handleSubmit}
        className="showcase-panel glass-panel rounded-[44px] p-6 sm:p-7"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="metric-chip">daily check-in</span>
              <span className="metric-chip">live score preview</span>
            </div>
            <h2 className="mt-4 font-display text-[2.3rem] font-bold leading-[0.96] tracking-tight sm:text-[3.25rem]">
              Pause for a minute and log the day honestly.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
              A small daily reflection gives the analytics enough context to spot when
              your week is becoming harder than it needs to be.
            </p>
          </div>
          <label className="soft-panel flex items-center gap-3 rounded-full px-4 py-3">
            <CalendarDays size={16} className="text-muted" />
            <input
              type="date"
              value={form.date}
              max={toISODate(new Date())}
              onChange={(event) => handleDateChange(event.target.value)}
              className="bg-transparent text-sm font-semibold text-foreground outline-none"
            />
          </label>
        </div>

        {existingEntry ? (
          <div className="mt-6 rounded-[24px] border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-muted">
            A check-in already exists for this date. Saving will update that entry.
          </div>
        ) : null}

        <div className="mt-8 grid gap-6">
          <section className="soft-panel p-5">
            <div className="section-head">
              <div className="icon-badge border-accent/15 bg-accent/10 text-accent">
                <Sparkles size={16} />
              </div>
              <h3 className="text-2xl">Emotional read</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              Start with the honest signal. It gives the rest of the check-in its tone.
            </p>
            <div className="mt-5">
              <MoodSelector
                value={form.mood}
                onChange={(mood) => handleFieldChange("mood", mood)}
              />
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <SliderField
                label="Stress level"
                value={form.stress}
                min={1}
                max={10}
                helper="1 is calm, 10 is overwhelmed."
                onChange={(value) => handleFieldChange("stress", value)}
              />
              <SliderField
                label="Productivity"
                value={form.productivity}
                min={1}
                max={10}
                helper="Rate how effective your day felt overall."
                onChange={(value) => handleFieldChange("productivity", value)}
              />
            </div>
          </section>

          <section className="soft-panel p-5">
            <div className="section-head">
              <div className="icon-badge border-accent/15 bg-accent/10 text-accent">
                <TimerReset size={16} />
              </div>
              <h3 className="text-2xl">Load and recovery</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              This is where the score gets most of its context: output, rest, and interruption load.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <label className="soft-card block p-4">
                <span className="text-sm font-semibold text-foreground">Coding hours</span>
                <input
                  type="number"
                  min={0}
                  max={16}
                  step={0.5}
                  value={form.codingHours}
                  onChange={(event) =>
                    handleFieldChange("codingHours", Number(event.target.value))
                  }
                  className="mt-3 w-full rounded-2xl border border-border/15 bg-card/70 px-4 py-3 text-sm font-semibold text-foreground outline-none"
                />
              </label>
              <label className="soft-card block p-4">
                <span className="text-sm font-semibold text-foreground">Sleep hours</span>
                <input
                  type="number"
                  min={0}
                  max={12}
                  step={0.5}
                  value={form.sleepHours}
                  onChange={(event) =>
                    handleFieldChange("sleepHours", Number(event.target.value))
                  }
                  className="mt-3 w-full rounded-2xl border border-border/15 bg-card/70 px-4 py-3 text-sm font-semibold text-foreground outline-none"
                />
              </label>
              <label className="soft-card block p-4">
                <span className="text-sm font-semibold text-foreground">Meetings</span>
                <input
                  type="number"
                  min={0}
                  max={12}
                  step={1}
                  value={form.meetings}
                  onChange={(event) =>
                    handleFieldChange("meetings", Number(event.target.value))
                  }
                  className="mt-3 w-full rounded-2xl border border-border/15 bg-card/70 px-4 py-3 text-sm font-semibold text-foreground outline-none"
                />
              </label>
            </div>
          </section>

          <section className="soft-panel p-5">
            <div className="section-head">
              <div className="icon-badge border-accent/15 bg-accent/10 text-accent">
                <Coffee size={16} />
              </div>
              <h3 className="text-2xl">Break quality</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              Better breaks usually echo later as steadier mood and clearer work.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-5">
              {breakLabels.map((item) => {
                const active = item.value === form.breakQuality;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleFieldChange("breakQuality", item.value)}
                    className={`min-h-[76px] rounded-[22px] border px-4 py-4 text-sm font-semibold transition ${
                      active
                        ? "border-accent/40 bg-accent/12 text-foreground"
                        : "border-border/15 bg-background/35 text-muted hover:border-accent/25 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="soft-panel p-5">
            <div className="section-head">
              <div className="icon-badge border-accent/15 bg-accent/10 text-accent">
                <MessageSquareText size={16} />
              </div>
              <h3 className="text-2xl">Reflection note</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              Write down what shaped the day: interruptions, wins, energy shifts, or anything future-you should remember.
            </p>
            <textarea
              rows={7}
              value={form.notes}
              onChange={(event) => handleFieldChange("notes", event.target.value)}
              placeholder="Example: afternoon meetings wrecked focus, but a real lunch break helped me recover enough to finish the feature calmly."
              className="mt-5 w-full rounded-[26px] border border-border/15 bg-background/35 px-4 py-4 text-sm leading-7 text-foreground outline-none placeholder:text-muted"
            />
          </section>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-bold text-slate-950 transition hover:brightness-105"
          >
            <Save size={16} />
            {existingEntry ? "Update check-in" : "Save check-in"}
          </button>
        </div>
      </motion.form>

      <div className="grid gap-6 xl:sticky xl:top-8 xl:self-start">
        <section className="showcase-panel glass-panel rounded-[44px] p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="metric-chip">{assessment.riskLevel}</span>
            <span className="metric-chip">{formatDateBadge(form.date)}</span>
          </div>

          <div className="mt-6 flex flex-col items-center text-center">
            <div
              className="spotlight-ring relative flex h-64 w-64 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(${previewColor} ${assessment.score}%, rgba(255,255,255,0.07) ${assessment.score}% 100%)`,
              }}
            >
              <div className="flex h-[calc(100%-22px)] w-[calc(100%-22px)] flex-col items-center justify-center rounded-full bg-background/95">
                <span className="font-display text-8xl font-bold tracking-tight">
                  {assessment.score}
                </span>
                <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
                  score out of 100
                </span>
              </div>
            </div>
            <p className="mt-6 text-sm leading-7 text-muted">{assessment.explanation}</p>
          </div>

          <div className="mt-6 space-y-3">
            {assessment.factors.slice(0, 4).map((factor) => (
              <div key={factor.key} className="soft-card p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-foreground">
                    {formatFactorLabel(factor.label)}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {Math.round(factor.contribution)} pts
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{
                      width: `${Math.min((factor.contribution / 28) * 100, 100)}%`,
                      backgroundColor: previewColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[40px] p-6">
          <p className="section-label">Helpful notes</p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-muted">
            <li>Log the day honestly rather than optimistically. Better data creates gentler, more useful patterns.</li>
            <li>Sleep debt and long coding sessions often show up as a trend, not just a difficult single day.</li>
            <li>Short journal notes make the timeline much more meaningful when you look back later.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
