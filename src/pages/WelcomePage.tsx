import { ArrowRight, Github, HeartPulse, LineChart, Sparkles } from "lucide-react";
import type { BurnoutAssessment, DailyEntry, GitHubActivitySummary, UserProfile, WeeklySummary } from "../types";
import { formatLongDate } from "../utils/date";

interface WelcomePageProps {
  profile: UserProfile;
  latestEntry: DailyEntry | null;
  assessment: BurnoutAssessment | null;
  weeklySummary: WeeklySummary;
  streak: number;
  githubActivity: GitHubActivitySummary | null;
  onEnterDashboard: () => void;
  onStartCheckIn: () => void;
  onOpenHistory: () => void;
}

export function WelcomePage({
  profile,
  latestEntry,
  assessment,
  weeklySummary,
  streak,
  githubActivity,
  onEnterDashboard,
  onStartCheckIn,
  onOpenHistory,
}: WelcomePageProps) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-7 lg:px-8">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_390px]">
        <article className="showcase-panel glass-panel card-sheen rounded-[40px] p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className="metric-chip">developer wellness</span>
            <span className="metric-chip">local-first app</span>
            <span className="metric-chip">{streak}-day streak</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-balance font-display text-[2.6rem] font-bold leading-[0.94] tracking-tight sm:text-[4rem]">
            {profile.name}, keep your work sustainable before the week starts telling the story for you.
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-muted">
            Dev Burnout Tracker turns daily check-ins into a calmer read on stress, sleep,
            coding load, and recovery so you can catch pressure patterns early.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={onEnterDashboard}
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-105"
            >
              Open dashboard
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={onStartCheckIn}
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-border/15 bg-card/50 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent/30 hover:text-accent"
            >
              Start today&apos;s check-in
              <HeartPulse size={16} />
            </button>
            <button
              type="button"
              onClick={onOpenHistory}
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-border/15 bg-card/50 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent/30 hover:text-accent"
            >
              Review timeline
              <LineChart size={16} />
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="soft-card p-3.5">
              <p className="section-label">Current burnout score</p>
              <p className="mt-2 font-display text-4xl font-bold tracking-tight">
                {assessment?.score ?? 0}
              </p>
              <p className="mt-2 text-sm text-muted">
                {assessment?.riskLevel ?? "Low"} risk based on your latest saved check-in.
              </p>
            </div>
            <div className="soft-card p-3.5">
              <p className="section-label">Average sleep</p>
              <p className="mt-2 font-display text-4xl font-bold tracking-tight">
                {weeklySummary.averageSleep}h
              </p>
              <p className="mt-2 text-sm text-muted">
                Measured against your recovery target.
              </p>
            </div>
            <div className="soft-card p-3.5">
              <p className="section-label">Coding load</p>
              <p className="mt-2 font-display text-4xl font-bold tracking-tight">
                {weeklySummary.totalCodingHours}h
              </p>
              <p className="mt-2 text-sm text-muted">Tracked across the last 7 entries.</p>
            </div>
          </div>
        </article>

        <div className="grid gap-5">
          <section className="glass-panel rounded-[34px] p-5">
            <div className="section-head">
              <div className="icon-badge h-11 w-11 border-accent/15 bg-accent/10 text-accent">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="section-label">How it works</p>
                <h2 className="mt-1 text-[1.8rem]">Three calm loops</h2>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="soft-card px-4 py-3.5">
                <p className="text-sm font-semibold text-foreground">1. Check in daily</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Log mood, stress, sleep, meetings, coding hours, and a short reflection.
                </p>
              </div>
              <div className="soft-card px-4 py-3.5">
                <p className="text-sm font-semibold text-foreground">2. Score burnout risk</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Weighted signals turn that check-in into a believable burnout score.
                </p>
              </div>
              <div className="soft-card px-4 py-3.5">
                <p className="text-sm font-semibold text-foreground">3. Spot patterns early</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Charts, insights, and GitHub context help you notice when load is no longer sustainable.
                </p>
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-[34px] p-5">
            <p className="section-label">Latest reflection</p>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {latestEntry ? formatLongDate(latestEntry.date) : "No check-in yet"}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {latestEntry?.notes || "Once you add a note, this welcome page becomes a quick recap of how the latest day felt."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="metric-chip">{weeklySummary.averageBurnout} avg burnout score</span>
              <span className="metric-chip">{weeklySummary.averageStress} avg stress / 10</span>
              <span className="metric-chip">
                {githubActivity ? `${githubActivity.reposTouched7d} repos touched` : "GitHub optional"}
              </span>
            </div>
          </section>
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="glass-panel rounded-[30px] p-5">
          <div className="section-head">
            <div className="icon-badge border-accent/15 bg-accent/10 text-accent">
              <HeartPulse size={16} />
            </div>
            <div>
              <p className="section-label">Score logic</p>
                <h3 className="mt-1 text-[1.55rem]">Believable, not decorative</h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">
            Burnout is calculated from stress, sleep debt, long coding sessions, mood,
            productivity, meetings, and break quality, then mapped to a 0-100 risk score.
          </p>
        </div>

        <div className="glass-panel rounded-[30px] p-5">
          <div className="section-head">
            <div className="icon-badge border-accent/15 bg-accent/10 text-accent">
              <Github size={16} />
            </div>
            <div>
              <p className="section-label">GitHub context</p>
                <h3 className="mt-1 text-[1.55rem]">Coding activity as a secondary signal</h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">
            Optional GitHub integration reads recent public pushes and pull request activity
            so code intensity supports the wellness story instead of taking over the app.
          </p>
        </div>

        <div className="glass-panel rounded-[30px] p-5">
          <div className="section-head">
            <div className="icon-badge border-accent/15 bg-accent/10 text-accent">
              <LineChart size={16} />
            </div>
            <div>
              <p className="section-label">Built for extension</p>
                <h3 className="mt-1 text-[1.55rem]">Strong MVP architecture</h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">
            The app uses modular React components, typed models, local persistence, and
            route-based structure so it can grow into a real backend-backed product later.
          </p>
        </div>
      </section>
    </div>
  );
}
