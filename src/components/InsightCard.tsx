import { motion } from "framer-motion";
import { Activity, Brain, Sparkles, TriangleAlert } from "lucide-react";
import type { Insight } from "../types";

interface InsightCardProps {
  insight: Insight;
}

const toneStyles = {
  positive: {
    icon: Sparkles,
    wrap: "border-success/10 bg-success/5",
    iconWrap: "bg-success/10 text-success",
  },
  neutral: {
    icon: Activity,
    wrap: "border-calm/10 bg-calm/5",
    iconWrap: "bg-calm/10 text-calm",
  },
  warning: {
    icon: TriangleAlert,
    wrap: "border-warn/10 bg-warn/5",
    iconWrap: "bg-warn/10 text-warn",
  },
};

export function InsightCard({ insight }: InsightCardProps) {
  const style = toneStyles[insight.tone];
  const Icon = style.icon ?? Brain;

  return (
    <motion.article
      whileHover={{ y: -2 }}
      className={`rounded-[24px] border p-4.5 ${style.wrap}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${style.iconWrap}`}
        >
          <Icon size={18} />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold tracking-tight">
            {insight.title}
          </h3>
          <p className="mt-2 text-sm leading-7 text-muted">{insight.description}</p>
        </div>
      </div>
    </motion.article>
  );
}
