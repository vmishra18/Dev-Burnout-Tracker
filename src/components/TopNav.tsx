import {
  Download,
  Flame,
  HeartPulse,
  LayoutDashboard,
  ScrollText,
  Settings2,
  ShieldAlert,
} from "lucide-react";
import { motion } from "framer-motion";
import type { AppView, RiskLevel, ThemeMode } from "../types";
import { getRiskColor } from "../utils/burnout";
import { ThemeToggle } from "./ThemeToggle";

interface TopNavProps {
  activeView: AppView;
  onChangeView: (view: AppView) => void;
  onExport: () => void;
  streak: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
  currentScore: number;
  riskLevel: RiskLevel;
  profileName?: string;
}

const navItems: Array<{
  id: AppView;
  label: string;
  detail: string;
  icon: typeof LayoutDashboard;
}> = [
  {
    id: "dashboard",
    label: "Dashboard",
    detail: "Weekly signal and trends",
    icon: LayoutDashboard,
  },
  {
    id: "checkin",
    label: "Check-In",
    detail: "Capture today honestly",
    icon: HeartPulse,
  },
  {
    id: "history",
    label: "Timeline",
    detail: "Review the pattern",
    icon: ScrollText,
  },
  {
    id: "settings",
    label: "Settings",
    detail: "Tune your goals",
    icon: Settings2,
  },
];

export function TopNav({
  activeView,
  onChangeView,
  onExport,
  streak,
  theme,
  onToggleTheme,
  currentScore,
  riskLevel,
  profileName,
}: TopNavProps) {
  const riskColor = getRiskColor(riskLevel);

  return (
    <>
      <header className="glass-panel showcase-panel sticky top-3 z-30 mx-3 rounded-[28px] px-4 py-3.5 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="icon-badge h-11 w-11 border-accent/15 bg-accent/10 text-accent">
              <HeartPulse size={20} />
            </div>
            <div>
              <p className="font-display text-lg font-bold tracking-tight">
                Dev Burnout Tracker
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                {profileName ? `${profileName}'s calm space` : "Calm space"}
              </p>
            </div>
          </div>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="soft-panel inline-flex items-center gap-2 rounded-full px-3 py-2">
            <span className="section-label">Latest</span>
            <span className="text-sm font-semibold text-foreground">{currentScore}/100</span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ backgroundColor: `${riskColor}22`, color: riskColor }}
            >
              {riskLevel}
            </span>
          </div>
          <div className="soft-panel inline-flex items-center gap-2 rounded-full px-3 py-2">
            <Flame size={14} className="text-warn" />
            <span className="text-sm font-semibold text-foreground">{streak} day streak</span>
          </div>
        </div>

        <nav className="mt-3 grid grid-cols-2 gap-2">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeView === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => onChangeView(id)}
                className={`min-h-[74px] rounded-[20px] border px-3 py-2.5 text-left transition ${
                  isActive
                    ? "border-accent/40 bg-accent/15 text-foreground"
                    : "border-border/10 bg-card/40 text-muted hover:border-border/20 hover:text-foreground"
                }`}
              >
                <div className="flex h-full flex-col justify-between">
                  <Icon size={16} />
                  <p className="text-xs font-semibold leading-5">{label}</p>
                </div>
              </button>
            );
          })}
        </nav>
      </header>

      <aside className="hidden lg:block">
        <div className="sticky top-0 px-5 py-5">
          <div className="glass-panel side-panel rounded-[32px] p-4.5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="icon-badge h-12 w-12 border-accent/15 bg-accent/10 text-accent">
                  <HeartPulse size={22} />
                </div>
                <div>
                  <p className="font-display text-lg font-bold tracking-tight">
                    Dev Burnout Tracker
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
                    {profileName ? `${profileName}'s calm space` : "Calm space"}
                  </p>
                </div>
              </div>
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <div className="soft-panel inline-flex items-center gap-2 rounded-full px-3.5 py-2">
                <span className="section-label">Latest</span>
                <span className="text-sm font-semibold text-foreground">{currentScore}/100</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{ backgroundColor: `${riskColor}22`, color: riskColor }}
                >
                  {riskLevel}
                </span>
              </div>
              <div className="soft-panel inline-flex items-center gap-2 rounded-full px-3.5 py-2">
                <Flame size={14} className="text-warn" />
                <span className="text-sm font-semibold text-foreground">{streak} day streak</span>
              </div>
            </div>
          </div>

          <nav className="mt-4 grid gap-2.5">
            {navItems.map(({ id, label, detail, icon: Icon }) => {
              const isActive = activeView === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChangeView(id)}
                  className={`relative overflow-hidden rounded-[20px] border px-3.5 py-3 text-left transition ${
                    isActive
                      ? "border-accent/40 bg-accent/15 text-foreground"
                      : "border-border/10 bg-card/30 text-muted hover:border-border/20 hover:bg-card/40 hover:text-foreground"
                  }`}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="rail-active"
                      className="absolute inset-y-3.5 left-0 w-1 rounded-r-full bg-accent"
                    />
                  ) : null}
                  <div className="flex items-center gap-3">
                    <div className="icon-badge">
                      <Icon size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-[0.96rem] font-bold tracking-tight">
                        {label}
                      </p>
                      <p className="mt-0.5 text-[12px] leading-5 text-muted">{detail}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="mt-4 grid gap-2.5">
            <button
              type="button"
              onClick={onExport}
              className="glass-panel flex items-center justify-between rounded-[20px] px-4 py-3.5 text-left transition hover:border-accent/30"
            >
              <div>
                <p className="section-label">Export</p>
                <p className="mt-2 text-sm font-semibold text-foreground">Open weekly recap</p>
              </div>
              <Download size={18} />
            </button>
            <div className="px-1 py-1">
              <div className="flex items-start gap-3">
                <div className="icon-badge h-10 w-10 border-warn/10 bg-warn/10 text-warn">
                  <ShieldAlert size={16} />
                </div>
                <p className="text-sm leading-6 text-muted">
                  Keep the app focused on the week, not on filling every panel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
