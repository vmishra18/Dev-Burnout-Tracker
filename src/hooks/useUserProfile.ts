import { useEffect, useState } from "react";
import type { UserProfile } from "../types";
import { loadProfile, persistProfile } from "../utils/storage";

export const defaultProfile: UserProfile = {
  name: "",
  role: "Frontend Engineer",
  team: "Product Engineering",
  focus: "balance",
  goals: {
    sleepTarget: 7.5,
    maxCodingHours: 8.5,
    stressCeiling: 6,
    productivityTarget: 8,
  },
  github: {
    enabled: false,
    username: "",
  },
};

function normalizeProfile(profile: UserProfile | null): UserProfile | null {
  if (!profile) {
    return null;
  }

  return {
    ...defaultProfile,
    ...profile,
    goals: {
      ...defaultProfile.goals,
      ...profile.goals,
    },
    github: {
      ...defaultProfile.github,
      ...profile.github,
    },
  };
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(() =>
    normalizeProfile(loadProfile()),
  );

  useEffect(() => {
    if (!profile) {
      return;
    }

    persistProfile(profile);
  }, [profile]);

  return {
    profile,
    hasProfile: Boolean(profile?.name),
    saveProfile: (nextProfile: UserProfile) => setProfile(normalizeProfile(nextProfile)),
  };
}
