export type MoodValue = 1 | 2 | 3 | 4 | 5;
export type BreakQuality = 1 | 2 | 3 | 4 | 5;
export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";
export type InsightTone = "positive" | "neutral" | "warning";
export type AppView = "dashboard" | "checkin" | "history" | "settings";
export type HistoryFilter = "7d" | "30d" | "all";
export type ThemeMode = "dark" | "light";
export type WellnessFocus = "balance" | "sleep" | "stress" | "focus";
export type GitHubActivityTone = "quiet" | "steady" | "intense";

export interface BurnoutFactor {
  key:
    | "stress"
    | "sleep"
    | "codingHours"
    | "mood"
    | "productivity"
    | "meetings"
    | "breakQuality";
  label: string;
  contribution: number;
}

export interface BurnoutAssessment {
  score: number;
  riskLevel: RiskLevel;
  explanation: string;
  factors: BurnoutFactor[];
}

export interface DailyEntryInput {
  date: string;
  mood: MoodValue;
  stress: number;
  productivity: number;
  codingHours: number;
  sleepHours: number;
  breakQuality: BreakQuality;
  meetings: number;
  notes: string;
}

export interface DailyEntry extends DailyEntryInput {
  id: string;
  burnoutScore: number;
  riskLevel: RiskLevel;
  explanation: string;
  createdAt: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  tone: InsightTone;
}

export interface WeeklySummary {
  averageBurnout: number;
  averageSleep: number;
  averageStress: number;
  averageProductivity: number;
  totalCodingHours: number;
  deltaBurnout: number;
  summary: string;
  takeBreakSuggestion: string;
  focusArea?: string;
}

export interface StatusBadge {
  id: string;
  label: string;
  description: string;
  tone: "accent" | "success" | "warning";
}

export interface ChartPoint {
  [key: string]: string | number;
  date: string;
  label: string;
  mood: number;
  stress: number;
  productivity: number;
  codingHours: number;
  sleepHours: number;
  burnoutScore: number;
}

export interface UserGoals {
  sleepTarget: number;
  maxCodingHours: number;
  stressCeiling: number;
  productivityTarget: number;
}

export interface GitHubIntegrationSettings {
  enabled: boolean;
  username: string;
}

export interface UserProfile {
  name: string;
  role: string;
  team: string;
  focus: WellnessFocus;
  goals: UserGoals;
  github: GitHubIntegrationSettings;
}

export interface GitHubRepoActivity {
  name: string;
  pushes: number;
  commits: number;
  pullRequests: number;
}

export interface GitHubDailyActivity {
  date: string;
  label: string;
  commits: number;
  pushes: number;
  pullRequests: number;
  reviews: number;
}

export interface GitHubActivitySummary {
  username: string;
  profileUrl: string;
  avatarUrl: string;
  commits7d: number;
  pushes7d: number;
  pullRequests7d: number;
  reviews7d: number;
  reposTouched7d: number;
  activityScore: number;
  tone: GitHubActivityTone;
  summary: string;
  insight: string;
  topRepos: GitHubRepoActivity[];
  dailyActivity: GitHubDailyActivity[];
}
