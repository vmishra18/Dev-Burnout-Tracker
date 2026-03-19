import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  tone?: "accent" | "success" | "warning" | "danger";
}

const toneMap = {
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warn/10 text-warn",
  danger: "bg-danger/10 text-danger",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "accent",
}: StatCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="showcase-panel glass-panel card-sheen rounded-[30px] p-4.5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-label">{title}</p>
          <p className="mt-2.5 font-display text-[1.95rem] font-bold tracking-tight">
            {value}
          </p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-[18px] ${toneMap[tone]}`}
        >
          <Icon size={17} />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{subtitle}</p>
    </motion.article>
  );
}
