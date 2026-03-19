import { useState } from "react";
import { BriefcaseBusiness, Github, MoonStar, Save, Target, Zap } from "lucide-react";
import type { UserProfile, WellnessFocus } from "../types";

interface ProfileFormProps {
  initialValue: UserProfile;
  title: string;
  description: string;
  submitLabel: string;
  onSubmit: (profile: UserProfile) => void;
}

const focusOptions: Array<{
  id: WellnessFocus;
  label: string;
  description: string;
}> = [
  { id: "balance", label: "Balance", description: "Keep work sustainable across the week." },
  { id: "sleep", label: "Sleep", description: "Prioritize recovery and a better sleep baseline." },
  { id: "stress", label: "Stress", description: "Reduce overload and context switching." },
  { id: "focus", label: "Focus", description: "Protect deep-work time and cleaner output." },
];

export function ProfileForm({
  initialValue,
  title,
  description,
  submitLabel,
  onSubmit,
}: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>(initialValue);

  const setField = <Key extends keyof UserProfile>(key: Key, value: UserProfile[Key]) => {
    setProfile((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const setGoal = (key: keyof UserProfile["goals"], value: number) => {
    setProfile((current) => ({
      ...current,
      goals: {
        ...current.goals,
        [key]: value,
      },
    }));
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(profile);
      }}
      className="glass-panel rounded-[36px] p-5 sm:p-6"
    >
      <p className="section-label">Profile and goals</p>
      <h1 className="mt-2.5 font-display text-[2.85rem] font-bold tracking-tight">{title}</h1>
      <p className="mt-3.5 max-w-2xl text-sm leading-7 text-muted">{description}</p>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="rounded-[24px] border border-border/15 bg-card/35 p-3.5">
            <span className="text-sm font-semibold text-foreground">Your name</span>
            <input
              required
              value={profile.name}
              onChange={(event) => setField("name", event.target.value)}
              placeholder="Vishal"
              className="mt-3 w-full rounded-2xl border border-border/15 bg-background/45 px-4 py-3 text-sm font-semibold text-foreground outline-none"
            />
          </label>
          <label className="rounded-[24px] border border-border/15 bg-card/35 p-3.5">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <BriefcaseBusiness size={16} className="text-accent" />
              Role
            </span>
            <input
              value={profile.role}
              onChange={(event) => setField("role", event.target.value)}
              placeholder="Frontend Engineer"
              className="mt-3 w-full rounded-2xl border border-border/15 bg-background/45 px-4 py-3 text-sm font-semibold text-foreground outline-none"
            />
          </label>
        </div>

        <label className="rounded-[24px] border border-border/15 bg-card/35 p-3.5">
          <span className="text-sm font-semibold text-foreground">Team or workspace</span>
          <input
            value={profile.team}
            onChange={(event) => setField("team", event.target.value)}
            placeholder="Product Engineering"
            className="mt-3 w-full rounded-2xl border border-border/15 bg-background/45 px-4 py-3 text-sm font-semibold text-foreground outline-none"
          />
        </label>

        <section className="rounded-[28px] border border-border/15 bg-card/35 p-4.5">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-accent" />
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Current priority
            </h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {focusOptions.map((option) => {
              const active = profile.focus === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setField("focus", option.id)}
                  className={`rounded-[20px] border p-3.5 text-left transition ${
                    active
                      ? "border-accent/35 bg-accent/10"
                      : "border-border/15 bg-background/35 hover:border-accent/20"
                  }`}
                >
                  <p className="font-display text-[1.35rem] font-bold tracking-tight">
                    {option.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">{option.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[28px] border border-border/15 bg-card/35 p-4.5">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-accent" />
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Sustainable targets
            </h2>
          </div>
          <div className="mt-4 grid gap-3.5 md:grid-cols-2">
            <label className="rounded-[20px] bg-background/35 p-3.5">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <MoonStar size={15} className="text-accent" />
                Sleep target
              </span>
              <input
                type="number"
                min={5}
                max={10}
                step={0.5}
                value={profile.goals.sleepTarget}
                onChange={(event) => setGoal("sleepTarget", Number(event.target.value))}
                className="mt-3 w-full rounded-2xl border border-border/15 bg-card/70 px-4 py-3 text-sm font-semibold text-foreground outline-none"
              />
            </label>
            <label className="rounded-[20px] bg-background/35 p-3.5">
              <span className="text-sm font-semibold text-foreground">Max coding hours / day</span>
              <input
                type="number"
                min={4}
                max={12}
                step={0.5}
                value={profile.goals.maxCodingHours}
                onChange={(event) => setGoal("maxCodingHours", Number(event.target.value))}
                className="mt-3 w-full rounded-2xl border border-border/15 bg-card/70 px-4 py-3 text-sm font-semibold text-foreground outline-none"
              />
            </label>
            <label className="rounded-[20px] bg-background/35 p-3.5">
              <span className="text-sm font-semibold text-foreground">Stress ceiling</span>
              <input
                type="number"
                min={1}
                max={10}
                step={1}
                value={profile.goals.stressCeiling}
                onChange={(event) => setGoal("stressCeiling", Number(event.target.value))}
                className="mt-3 w-full rounded-2xl border border-border/15 bg-card/70 px-4 py-3 text-sm font-semibold text-foreground outline-none"
              />
            </label>
            <label className="rounded-[20px] bg-background/35 p-3.5">
              <span className="text-sm font-semibold text-foreground">Productivity target</span>
              <input
                type="number"
                min={1}
                max={10}
                step={1}
                value={profile.goals.productivityTarget}
                onChange={(event) => setGoal("productivityTarget", Number(event.target.value))}
                className="mt-3 w-full rounded-2xl border border-border/15 bg-card/70 px-4 py-3 text-sm font-semibold text-foreground outline-none"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[28px] border border-border/15 bg-card/35 p-4.5">
          <div className="flex items-center gap-2">
            <Github size={16} className="text-accent" />
            <h2 className="font-display text-2xl font-bold tracking-tight">
              GitHub activity
            </h2>
          </div>
          <p className="mt-2.5 max-w-2xl text-sm leading-7 text-muted">
            Pull in recent public GitHub events so the dashboard can compare how your coding rhythm relates to stress, mood, and recovery.
          </p>

          <div className="mt-4 grid gap-3.5">
            <label className="inline-flex items-center gap-3 rounded-[20px] border border-border/15 bg-background/35 px-4 py-3.5">
              <input
                type="checkbox"
                checked={profile.github.enabled}
                onChange={(event) =>
                  setField("github", {
                    ...profile.github,
                    enabled: event.target.checked,
                  })
                }
                className="h-4 w-4 accent-accent"
              />
              <span className="text-sm font-semibold text-foreground">
                Enable GitHub activity
              </span>
            </label>

            <label className="rounded-[20px] bg-background/35 p-3.5">
              <span className="text-sm font-semibold text-foreground">GitHub username</span>
              <input
                value={profile.github.username}
                onChange={(event) =>
                  setField("github", {
                    ...profile.github,
                    username: event.target.value,
                  })
                }
                placeholder="octocat"
                className="mt-3 w-full rounded-2xl border border-border/15 bg-card/70 px-4 py-3 text-sm font-semibold text-foreground outline-none"
              />
              <p className="mt-3 text-xs leading-5 text-muted">
                This uses the public GitHub events feed, so private contributions are not included in this build.
              </p>
            </label>
          </div>
        </section>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:brightness-105"
        >
          <Save size={16} />
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
