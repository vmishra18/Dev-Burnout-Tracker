import { useEffect, useState } from "react";
import type { GitHubActivitySummary, UserProfile } from "../types";
import { fetchGitHubActivity } from "../utils/github";

export function useGitHubActivity(profile?: UserProfile | null) {
  const [activity, setActivity] = useState<GitHubActivitySummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const username = profile?.github.username.trim();
    const isEnabled = Boolean(profile?.github.enabled && username);

    if (!isEnabled || !username) {
      setActivity(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchGitHubActivity(username)
      .then((result) => {
        if (!cancelled) {
          setActivity(result);
        }
      })
      .catch((fetchError: unknown) => {
        if (!cancelled) {
          setActivity(null);
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "GitHub activity could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [profile?.github.enabled, profile?.github.username]);

  return {
    activity,
    isLoading,
    error,
  };
}
