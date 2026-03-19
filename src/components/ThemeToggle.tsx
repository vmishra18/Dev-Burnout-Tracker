import { MoonStar, SunMedium } from "lucide-react";
import type { ThemeMode } from "../types";

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="glass-panel inline-flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:bg-card/80 sm:px-4"
      aria-label={`Switch to ${nextTheme} mode`}
    >
      {isDark ? <SunMedium size={16} /> : <MoonStar size={16} />}
      <span className="hidden text-sm sm:inline">
        {`Switch to ${nextTheme}`}
      </span>
    </button>
  );
}
