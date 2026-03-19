import { AlertTriangle } from "lucide-react";
import type { BurnoutFactor, RiskLevel } from "../types";
import { getRiskColor } from "../utils/burnout";

interface BurnoutGaugeProps {
  score: number;
  riskLevel: RiskLevel;
  explanation: string;
  factors: BurnoutFactor[];
}

export function BurnoutGauge({
  score,
  riskLevel,
  explanation,
  factors,
}: BurnoutGaugeProps) {
  const color = getRiskColor(riskLevel);
  const topFactors = factors.slice(0, 3);
  const formatFactorLabel = (label: string) => `${label.charAt(0).toUpperCase()}${label.slice(1)}`;

  return (
    <section className="showcase-panel glass-panel min-w-0 rounded-[40px] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="section-label">Burnout score</p>
          <h2 className="mt-2 font-display text-[2.15rem] font-bold leading-[0.95] tracking-tight">
            Today&apos;s burnout score
          </h2>
        </div>
        <span className="metric-chip">{riskLevel}</span>
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        <div
          className="spotlight-ring relative flex h-64 w-64 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${color} ${score}%, rgba(255,255,255,0.07) ${score}% 100%)`,
          }}
        >
          <div className="flex h-[calc(100%-20px)] w-[calc(100%-20px)] flex-col items-center justify-center rounded-full bg-background/95">
                <span className="font-display text-8xl font-bold tracking-tight">{score}</span>
                <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                  score out of 100
                </span>
          </div>
          <div className="absolute inset-[18px] rounded-full border border-white/10" />
        </div>

        <p className="mt-6 max-w-md text-sm leading-7 text-muted">{explanation}</p>
      </div>

      <div className="mt-6 grid gap-3">
        {topFactors.map((factor, index) => (
          <div key={factor.key} className="soft-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <AlertTriangle
                    size={15}
                    style={{ color, opacity: index === 0 ? 1 : 0.8 }}
                  />
                  {formatFactorLabel(factor.label)}
                </div>
                <p className="mt-1 text-xs leading-5 text-muted">
                  A meaningful contributor to today&apos;s score
                </p>
              </div>
              <span className="font-display text-2xl font-bold tracking-tight">
                {Math.round(factor.contribution)} pts
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/6">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((factor.contribution / 28) * 100, 100)}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
