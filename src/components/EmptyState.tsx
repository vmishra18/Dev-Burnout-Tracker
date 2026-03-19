import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  eyebrow?: string;
}

export function EmptyState({
  title,
  description,
  eyebrow = "Nothing here yet",
}: EmptyStateProps) {
  return (
    <div className="showcase-panel glass-panel rounded-[32px] p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/10 bg-accent/10 text-accent">
        <Inbox size={24} />
      </div>
      <p className="section-label mt-5">{eyebrow}</p>
      <h3 className="mt-5 font-display text-2xl font-bold">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
        {description}
      </p>
    </div>
  );
}
