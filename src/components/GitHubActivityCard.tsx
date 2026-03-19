import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  GitBranch,
  GitPullRequestArrow,
  Gauge,
  ShieldAlert,
} from "lucide-react";
import type { GitHubActivitySummary } from "../types";

function formatCountLabel(value: number, singular: string, plural = `${singular}s`): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

interface GitHubActivityCardProps {
  activity: GitHubActivitySummary | null;
  isLoading: boolean;
  error: string | null;
  isEnabled: boolean;
  username?: string;
}

export function GitHubActivityCard({
  activity,
  isLoading,
  error,
  isEnabled,
  username,
}: GitHubActivityCardProps) {
  if (!isEnabled) {
    return (
      <section className="glass-panel min-w-0 rounded-[30px] p-4.5">
        <div className="flex items-center gap-3">
          <div className="icon-badge h-11 w-11 border-accent/15 bg-accent/10 text-accent">
            <Github size={18} />
          </div>
          <div>
            <p className="section-label">GitHub activity</p>
            <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">
              Keep code activity optional
            </h3>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-muted">
          Add a GitHub username in settings if you want public pushes and pull requests to
          support the wellness story.
        </p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="glass-panel min-w-0 rounded-[30px] p-4.5">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-36 rounded-full bg-card/70" />
          <div className="h-10 w-52 rounded-full bg-card/70" />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="h-28 rounded-[24px] bg-card/70" />
            <div className="h-28 rounded-[24px] bg-card/70" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !activity) {
    return (
      <section className="glass-panel min-w-0 rounded-[30px] p-4.5">
        <div className="flex items-center gap-3">
          <div className="icon-badge h-11 w-11 border-danger/15 bg-danger/10 text-danger">
            <ShieldAlert size={18} />
          </div>
          <div>
            <p className="section-label">GitHub activity</p>
            <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">
              Couldn&apos;t load @{username || "profile"}
            </h3>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-muted">
          {error || "GitHub activity could not be loaded right now."}
        </p>
      </section>
    );
  }

  const pulsePoints = activity.dailyActivity.map((day) => ({
    ...day,
    total: day.pushes + day.pullRequests * 3 + day.reviews * 2 + day.commits * 0.5,
  }));
  const maxPulse = Math.max(...pulsePoints.map((day) => day.total), 1);
  const hasPulse = pulsePoints.some((day) => day.total > 0);

  return (
    <section className="glass-panel min-w-0 rounded-[30px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={activity.avatarUrl}
            alt={`${activity.username} avatar`}
            className="h-12 w-12 rounded-2xl border border-border/15 object-cover"
          />
          <div>
            <p className="section-label">GitHub activity</p>
            <div className="mt-1 flex items-center gap-2">
              <h3 className="font-display text-[1.65rem] font-bold tracking-tight">
                @{activity.username}
              </h3>
              <a
                href={activity.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted transition hover:text-foreground"
                aria-label="Open GitHub profile"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
        <span className="metric-chip">{activity.tone} week</span>
      </div>

      <p className="mt-3.5 text-sm leading-7 text-muted">{activity.insight}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="metric-chip">{formatCountLabel(activity.pushes7d, "push")}</span>
        <span className="metric-chip">{formatCountLabel(activity.pullRequests7d, "PR")}</span>
        <span className="metric-chip">{formatCountLabel(activity.reposTouched7d, "repo touched", "repos touched")}</span>
      </div>

      <div className="mt-4 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="soft-panel min-w-0 p-3.5">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <Gauge size={15} className="text-accent" />
            7-day activity pulse
          </div>
          {hasPulse ? (
            <div className="mt-3.5 flex h-20 items-end gap-1.5">
              {pulsePoints.map((day) => (
                <div
                  key={day.date}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max((day.total / maxPulse) * 100, 12)}%` }}
                    transition={{ duration: 0.35 }}
                    className="w-full rounded-full bg-gradient-to-t from-accent to-accent-soft/90"
                    style={{ minHeight: day.total ? 16 : 8 }}
                  />
                  <span className="text-[10px] text-muted">{day.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-muted">
              No recent public push or pull request activity showed up in the last 7 days.
            </p>
          )}
        </div>

        <div className="soft-panel min-w-0 p-3.5">
          <p className="section-label">Most active repos</p>
          <div className="mt-3.5 space-y-2.5">
            {activity.topRepos.length ? (
              activity.topRepos.slice(0, 2).map((repo) => (
                <div
                  key={repo.name}
                  className="soft-card flex items-center justify-between gap-3 px-3.5 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {repo.name}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {formatCountLabel(repo.pushes, "push")} • {formatCountLabel(repo.pullRequests, "PR")}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <GitBranch size={14} className="text-accent" />
                    {repo.pushes + repo.pullRequests * 3}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-muted">
                Recent activity exists, but no single repository clearly stood out this week.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted">
        <GitPullRequestArrow size={14} className="text-accent" />
        Public GitHub events are used here, so private contributions are not included.
      </div>
    </section>
  );
}
