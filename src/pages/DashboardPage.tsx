import {
  ArrowRight,
  BrainCircuit,
  Clock3,
  GitBranch,
  MoonStar,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import type {
  BurnoutAssessment,
  ChartPoint,
  DailyEntry,
  GitHubActivitySummary,
  Insight,
  StatusBadge,
  UserProfile,
  WeeklySummary,
} from "../types";
import { formatLongDate, getGreeting } from "../utils/date";
import { BurnoutGauge } from "../components/BurnoutGauge";
import { GitHubActivityCard } from "../components/GitHubActivityCard";
import { InsightCard } from "../components/InsightCard";
import { TrendChart } from "../components/TrendChart";

interface DashboardPageProps {
  latestEntry: DailyEntry;
  assessment: BurnoutAssessment;
  chartData: ChartPoint[];
  insights: Insight[];
  weeklySummary: WeeklySummary;
  bestDay: string;
  badges: StatusBadge[];
  streak: number;
  onGoToCheckin: () => void;
  profile?: UserProfile | null;
  recommendations: string[];
  githubActivity: GitHubActivitySummary | null;
  githubLoading: boolean;
  githubError: string | null;
}

export function DashboardPage({
  latestEntry,
  assessment,
  chartData,
  insights,
  weeklySummary,
  bestDay,
  badges,
  streak,
  onGoToCheckin,
  profile,
  recommendations,
  githubActivity,
  githubLoading,
  githubError,
}: DashboardPageProps) {
  const highlightedInsights = insights.slice(0, 3);
  const spotlightBadge = badges[0];
  const sleepTarget = profile?.goals.sleepTarget ?? 7.5;
  const isBelowSleepTarget = weeklySummary.averageSleep < sleepTarget;

  return (
    <div className="grid min-w-0 gap-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.92fr)]">
        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="showcase-panel glass-panel card-sheen min-w-0 rounded-[38px] p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="metric-chip">{getGreeting()}</span>
            <span className="metric-chip">weekly view</span>
            <span className="metric-chip">{bestDay} is your best day</span>
          </div>

          <h1 className="mt-4 max-w-4xl font-display text-[2.4rem] font-bold leading-[0.96] tracking-tight sm:text-[3.5rem]">
            {profile?.name
              ? `${profile.name}, here is a softer view of how work is landing this week.`
              : "Here is a softer view of how work is landing this week."}
          </h1>
          <p className="mt-3.5 max-w-3xl text-[15px] leading-7 text-muted">
            Follow your pressure, mood, recovery, and output in one calm space, then make
            small course corrections before fatigue becomes the tone of the week.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="soft-card p-4">
              <p className="section-label">Weekly burnout score</p>
              <p className="mt-2 font-display text-4xl font-bold tracking-tight">
                {weeklySummary.averageBurnout}
              </p>
              <p className="mt-2 text-sm text-muted">Average burnout score across this week.</p>
            </div>
            <div className="soft-card p-4">
              <p className="section-label">Average sleep</p>
              <p className="mt-2 font-display text-4xl font-bold tracking-tight">
                {weeklySummary.averageSleep}h
              </p>
              <p className="mt-2 text-sm text-muted">Your strongest recovery indicator.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 xl:grid-cols-[0.9fr_1.1fr]">
            <button
              type="button"
              onClick={onGoToCheckin}
              className="inline-flex min-h-[64px] items-center justify-center gap-2 rounded-[24px] bg-accent px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:brightness-105"
            >
              Start today&apos;s check-in
              <ArrowRight size={16} />
            </button>

            <div className="soft-panel p-4.5">
              <p className="section-label">Latest reflection</p>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {formatLongDate(latestEntry.date)}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                {latestEntry.notes || "No note attached to the latest entry yet."}
              </p>
            </div>
          </div>
        </motion.article>

        <BurnoutGauge
          score={assessment.score}
          riskLevel={assessment.riskLevel}
          explanation={latestEntry.explanation}
          factors={assessment.factors}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <div className="min-w-0">
          <TrendChart
            title="Burnout score history"
            subtitle="Load, sleep, stress, breaks, mood, productivity, and meetings are blended into one steady signal."
            data={chartData}
            type="line"
            series={[
              { key: "burnoutScore", name: "Burnout Score", color: "rgb(80, 140, 255)" },
            ]}
          />
        </div>

        <div className="grid min-w-0 gap-6">
          <div className="showcase-panel glass-panel rounded-[34px] p-5">
            <div className="section-head">
              <div className="icon-badge h-11 w-11 border-accent/15 bg-accent/10 text-accent">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="section-label">Weekly brief</p>
                <h2 className="mt-1 text-[1.8rem]">How the week feels</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">{weeklySummary.summary}</p>
            {weeklySummary.focusArea ? (
              <div className="soft-card mt-4 px-4 py-3.5 text-sm leading-7 text-muted">
                <span className="font-semibold text-foreground">Focus area:</span>{" "}
                {weeklySummary.focusArea}
              </div>
            ) : null}
            {spotlightBadge ? (
              <div className="soft-card mt-4 px-4 py-3.5">
                <p className="font-display text-lg font-bold tracking-tight">
                  {spotlightBadge.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {spotlightBadge.description}
                </p>
              </div>
            ) : null}
            <div className="soft-card mt-4 px-4 py-3.5">
              <p className="section-label">Next move</p>
              <p className="mt-2 text-sm leading-7 text-muted">
                {weeklySummary.takeBreakSuggestion}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <TrendChart
          title="Stress drift"
          subtitle="Stress usually climbs before the rest of the week starts to feel harder."
          data={chartData}
          type="line"
          series={[{ key: "stress", name: "Stress", color: "rgb(251, 113, 133)" }]}
        />
        <TrendChart
          title="Sleep rhythm"
          subtitle="Consistency matters just as much as the total."
          data={chartData}
          type="area"
          series={[
            { key: "sleepHours", name: "Sleep Hours", color: "rgb(125, 211, 252)" },
          ]}
        />
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="grid min-w-0 gap-6">
          <div className="glass-panel self-start rounded-[34px] p-5">
            <div className="section-head">
              <div className="icon-badge h-12 w-12 border-accent/15 bg-accent/10 text-accent">
                <BrainCircuit size={20} />
              </div>
              <div>
                <p className="section-label">Patterns</p>
                <h2 className="mt-1 text-[1.85rem]">What the week is telling you</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {highlightedInsights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid min-w-0 gap-6">
          <div className="glass-panel self-start rounded-[34px] p-5">
            <div className="section-head">
              <div className="icon-badge border-accent/15 bg-accent/10 text-accent">
                <MoonStar size={18} />
              </div>
              <div>
                <p className="section-label">Recovery and rhythm</p>
                <h3 className="mt-1 text-[1.8rem]">
                  {isBelowSleepTarget ? "Ease the second half of the week" : "Your recovery is holding up"}
                </h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">
              You are averaging {weeklySummary.averageSleep}h of sleep against a target of{" "}
              {sleepTarget}h, while your output rhythm is {weeklySummary.averageProductivity}/10
              {" "}and your streak is {streak} days.
            </p>
            <div className="mt-4 soft-card px-4 py-4 text-sm leading-7 text-muted">
              <span className="font-semibold text-foreground">Focus area:</span>{" "}
              {weeklySummary.focusArea ?? weeklySummary.takeBreakSuggestion}
            </div>
          </div>

          <div className="glass-panel self-start rounded-[34px] p-5">
            <div className="grid gap-5 md:grid-cols-[0.92fr_1.08fr]">
              <div>
                <div className="section-head">
                  <div className="icon-badge border-accent/15 bg-accent/10 text-accent">
                    <Clock3 size={18} />
                  </div>
                  <div>
                    <p className="section-label">This week&apos;s reset</p>
                    <h3 className="mt-1 text-[1.75rem]">Keep the next move small</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">
                  {weeklySummary.takeBreakSuggestion}
                </p>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <GitBranch size={16} className="text-accent" />
                  Two small adjustments
                </div>
                <div className="mt-3 space-y-3">
                  {recommendations.slice(0, 2).map((recommendation, index) => (
                    <div key={index} className="soft-card px-4 py-4 text-sm leading-7 text-muted">
                      {recommendation}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <GitHubActivityCard
            activity={githubActivity}
            isLoading={githubLoading}
            error={githubError}
            isEnabled={Boolean(profile?.github.enabled)}
            username={profile?.github.username}
          />
        </div>
      </section>
    </div>
  );
}
