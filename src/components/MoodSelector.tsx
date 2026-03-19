import { motion } from "framer-motion";
import type { MoodValue } from "../types";

interface MoodSelectorProps {
  value: MoodValue;
  onChange: (mood: MoodValue) => void;
}

const moods: Array<{ value: MoodValue; emoji: string; label: string }> = [
  { value: 1, emoji: "😵", label: "Drained" },
  { value: 2, emoji: "😕", label: "Low" },
  { value: 3, emoji: "🙂", label: "Okay" },
  { value: 4, emoji: "😄", label: "Good" },
  { value: 5, emoji: "🚀", label: "Great" },
];

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
      {moods.map((mood) => {
        const active = mood.value === value;

        return (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            className={`relative min-h-[110px] rounded-[24px] border px-2 py-4 text-center transition ${
              active
                ? "border-accent/60 bg-accent/15 text-foreground"
                : "border-border/15 bg-card/40 text-muted hover:border-accent/30 hover:text-foreground"
            }`}
          >
            {active ? (
              <motion.span
                layoutId="mood-pill"
                className="absolute inset-0 rounded-[24px] border border-accent/30 bg-accent/10"
              />
            ) : null}
            <span className="relative z-10 flex h-full flex-col items-center justify-center">
              <span className="text-2xl">{mood.emoji}</span>
              <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
                {mood.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
