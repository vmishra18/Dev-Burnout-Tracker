import { Compass, HeartHandshake, ShieldCheck } from "lucide-react";
import { defaultProfile } from "../hooks/useUserProfile";
import type { UserProfile } from "../types";
import { ProfileForm } from "../components/ProfileForm";

interface OnboardingPageProps {
  onSubmit: (profile: UserProfile) => void;
}

export function OnboardingPage({ onSubmit }: OnboardingPageProps) {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-7xl items-start gap-5 px-4 py-7 lg:grid-cols-[0.82fr_minmax(0,1.18fr)] lg:px-8">
      <section className="self-start rounded-[38px] border border-border/15 bg-card/35 p-6 shadow-glass">
        <div>
          <p className="section-label">Welcome</p>
          <h1 className="mt-4 font-display text-[3.3rem] font-bold leading-[0.95] tracking-tight">
            Build a healthier engineering rhythm from day one.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            A quick setup lets the app personalize your weekly summaries, recovery guidance,
            and burnout recommendations around your actual working style.
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="rounded-[24px] border border-border/15 bg-background/35 p-4.5">
            <Compass size={18} className="text-accent" />
            <p className="mt-3 font-display text-2xl font-bold tracking-tight">
              Goal-aware guidance
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Sleep, stress, coding load, and productivity are measured against the targets you set.
            </p>
          </div>
          <div className="rounded-[24px] border border-border/15 bg-background/35 p-4.5">
            <HeartHandshake size={18} className="text-accent" />
            <p className="mt-3 font-display text-2xl font-bold tracking-tight">
              Personalized summaries
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Weekly reviews become specific to your role, your team rhythm, and the kind of week you want.
            </p>
          </div>
          <div className="rounded-[24px] border border-border/15 bg-background/35 p-4.5">
            <ShieldCheck size={18} className="text-accent" />
            <p className="mt-3 font-display text-2xl font-bold tracking-tight">
              Private by default
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Everything still runs locally in this build, so you can set it up and use it immediately.
            </p>
          </div>
        </div>
      </section>

      <div className="min-w-0">
        <ProfileForm
          initialValue={defaultProfile}
          title="Set up your operator profile"
          description="Tell the product what sustainable looks like for you so the analytics can start acting more like a coach and less like a generic dashboard."
          submitLabel="Save profile and enter app"
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
