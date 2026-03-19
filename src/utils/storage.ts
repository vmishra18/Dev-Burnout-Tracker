import type { DailyEntry, ThemeMode, UserProfile } from "../types";

export const STORAGE_KEYS = {
  entries: "dev-burnout-tracker:entries",
  theme: "dev-burnout-tracker:theme",
  profile: "dev-burnout-tracker:profile",
};

export function loadEntries(): DailyEntry[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEYS.entries);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DailyEntry[];
  } catch {
    return null;
  }
}

export function persistEntries(entries: DailyEntry[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries));
}

export function loadTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = window.localStorage.getItem(STORAGE_KEYS.theme);
  return stored === "light" ? "light" : "dark";
}

export function persistTheme(theme: ThemeMode): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.theme, theme);
}

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEYS.profile);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function persistProfile(profile: UserProfile): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}
