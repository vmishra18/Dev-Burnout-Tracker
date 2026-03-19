import type { BurnoutAssessment, BurnoutFactor, DailyEntryInput, RiskLevel } from "../types";

const MAX_RAW_SCORE = 128;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getRiskLevel(score: number): RiskLevel {
  if (score < 30) {
    return "Low";
  }

  if (score < 55) {
    return "Moderate";
  }

  if (score < 75) {
    return "High";
  }

  return "Critical";
}

function describeFactors(topFactors: BurnoutFactor[]): string {
  if (!topFactors.length) {
    return "Your recent habits look sustainable and balanced.";
  }

  const labels = topFactors.map((factor) => factor.label.toLowerCase());

  if (labels.length === 1) {
    return `Your score is mostly influenced by ${labels[0]}.`;
  }

  if (labels.length === 2) {
    return `Your score is mainly driven by ${labels[0]} and ${labels[1]}.`;
  }

  return `Your score is mainly driven by ${labels[0]}, ${labels[1]}, and ${labels[2]}.`;
}

export function calculateBurnoutScore(entry: DailyEntryInput): BurnoutAssessment {
  const factors: BurnoutFactor[] = [
    {
      key: "stress",
      label: "elevated stress",
      contribution: entry.stress * 2.8,
    },
    {
      key: "sleep",
      label: "sleep debt",
      contribution: clamp((8 - entry.sleepHours) * 6, 0, 18),
    },
    {
      key: "codingHours",
      label: "long coding sessions",
      contribution: clamp((entry.codingHours - 8) * 4.5, 0, 18),
    },
    {
      key: "mood",
      label: "lower mood",
      contribution: (5 - entry.mood) * 5,
    },
    {
      key: "productivity",
      label: "reduced productivity",
      contribution: (10 - entry.productivity) * 1.4,
    },
    {
      key: "meetings",
      label: "meeting overload",
      contribution: clamp((entry.meetings - 2) * 2.8, 0, 14),
    },
    {
      key: "breakQuality",
      label: "poor breaks",
      contribution: (5 - entry.breakQuality) * 4,
    },
  ];

  const raw = factors.reduce((sum, factor) => sum + factor.contribution, 0);
  const score = clamp(Math.round((raw / MAX_RAW_SCORE) * 100), 0, 100);
  const riskLevel = getRiskLevel(score);
  const topFactors = [...factors]
    .sort((a, b) => b.contribution - a.contribution)
    .filter((factor) => factor.contribution >= 8)
    .slice(0, 3);
  const explanation = describeFactors(topFactors);

  return {
    score,
    riskLevel,
    explanation,
    factors: [...factors].sort((a, b) => b.contribution - a.contribution),
  };
}

export function getRiskColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case "Low":
      return "rgb(var(--success))";
    case "Moderate":
      return "rgb(var(--calm))";
    case "High":
      return "rgb(var(--warn))";
    case "Critical":
      return "rgb(var(--danger))";
    default:
      return "rgb(var(--accent))";
  }
}
