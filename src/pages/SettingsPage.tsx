import { Database, Sparkles } from "lucide-react";
import type { UserProfile } from "../types";
import { ProfileForm } from "../components/ProfileForm";

interface SettingsPageProps {
  profile: UserProfile;
  onSubmit: (profile: UserProfile) => void;
}

export function SettingsPage({ profile, onSubmit }: SettingsPageProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_340px]">
      <ProfileForm
        initialValue={profile}
        title="Refine your settings"
        description="Adjust your profile, goals, and focus area as your workload changes. These settings feed the weekly summary and personalized recommendations."
        submitLabel="Save settings"
        onSubmit={onSubmit}
      />

      <div className="grid gap-6 xl:sticky xl:top-8 xl:self-start">
        <section className="glass-panel rounded-[40px] p-6">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />
            <p className="section-label">Personalization</p>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">
            Your goals change how summaries and alerts are generated. For example, a week can
            look “fine” globally but still miss the recovery targets you care about.
          </p>
        </section>

        <section className="glass-panel rounded-[40px] p-6">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />
            <p className="section-label">GitHub activity</p>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">
            Add a GitHub username to pull in public push, pull request, review, and repository activity from the last 7 days. The dashboard will then show coding intensity alongside your wellness signals.
          </p>
        </section>

        <section className="glass-panel rounded-[40px] p-6">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-accent" />
            <p className="section-label">Current storage mode</p>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">
            This build stores entries and profile settings locally. The next product phase would
            be syncing this profile to a backend and adding authentication.
          </p>
        </section>
      </div>
    </div>
  );
}
