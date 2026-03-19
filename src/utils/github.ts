import type {
  GitHubActivitySummary,
  GitHubDailyActivity,
  GitHubRepoActivity,
  GitHubActivityTone,
} from "../types";
import { addDays, formatShortDate, parseISODate, toISODate } from "./date";

interface GitHubUserResponse {
  avatar_url: string;
  html_url: string;
  login: string;
}

interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
  payload: {
    size?: number;
    action?: string;
  };
}

function getTone(activityScore: number): GitHubActivityTone {
  if (activityScore < 18) {
    return "quiet";
  }

  if (activityScore < 45) {
    return "steady";
  }

  return "intense";
}

function getSummary(tone: GitHubActivityTone, commits: number, reposTouched: number): string {
  if (tone === "quiet") {
    return `A gentler GitHub week so far, with ${commits} commits across ${reposTouched} repositories.`;
  }

  if (tone === "steady") {
    return `A healthy coding rhythm this week, with steady movement across ${reposTouched} repositories.`;
  }

  return `GitHub activity is running hot this week, which may be energizing or quietly exhausting depending on the rest of your recovery signals.`;
}

function getInsight(
  tone: GitHubActivityTone,
  pushes: number,
  reposTouched: number,
  pullRequests: number,
): string {
  if (tone === "intense" && reposTouched >= 6) {
    return `You touched ${reposTouched} repositories this week, which suggests a high context-switching load.`;
  }

  if (tone === "steady" && pullRequests >= 2) {
    return "Your GitHub rhythm looks active but fairly controlled, with visible progress across the week.";
  }

  if (pushes <= 4) {
    return "GitHub activity has been lighter recently, which may reflect a calmer week or less shipping-heavy work.";
  }

  return "Your coding rhythm looks active enough to matter, but not dominant enough to define the whole week by itself.";
}

function createDailyBuckets(): GitHubDailyActivity[] {
  return Array.from({ length: 7 }).map((_, index) => {
    const date = toISODate(addDays(new Date(), index - 6));
    return {
      date,
      label: formatShortDate(date),
      commits: 0,
      pushes: 0,
      pullRequests: 0,
      reviews: 0,
    };
  });
}

export async function fetchGitHubActivity(username: string): Promise<GitHubActivitySummary> {
  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    throw new Error("GitHub username is required.");
  }

  const [userResponse, eventsResponse] = await Promise.all([
    fetch(`https://api.github.com/users/${trimmedUsername}`),
    fetch(`https://api.github.com/users/${trimmedUsername}/events/public?per_page=100`),
  ]);

  if (!userResponse.ok) {
    throw new Error("GitHub profile could not be loaded.");
  }

  if (!eventsResponse.ok) {
    throw new Error("GitHub activity could not be loaded.");
  }

  const user = (await userResponse.json()) as GitHubUserResponse;
  const events = (await eventsResponse.json()) as GitHubEvent[];
  const since = parseISODate(toISODate(addDays(new Date(), -6))).getTime();
  const dailyBuckets = createDailyBuckets();
  const dailyMap = new Map(dailyBuckets.map((bucket) => [bucket.date, bucket]));
  const repoMap = new Map<string, GitHubRepoActivity>();

  let commits7d = 0;
  let pushes7d = 0;
  let pullRequests7d = 0;
  let reviews7d = 0;

  events.forEach((event) => {
    const eventTime = new Date(event.created_at).getTime();
    if (eventTime < since) {
      return;
    }

    const eventDate = toISODate(new Date(event.created_at));
    const bucket = dailyMap.get(eventDate);
    const repo = repoMap.get(event.repo.name) ?? {
      name: event.repo.name,
      pushes: 0,
      commits: 0,
      pullRequests: 0,
    };

    if (event.type === "PushEvent") {
      const commitCount = event.payload.size ?? 0;
      commits7d += commitCount;
      pushes7d += 1;
      repo.pushes += 1;
      repo.commits += commitCount;

      if (bucket) {
        bucket.pushes += 1;
        bucket.commits += commitCount;
      }
    }

    if (event.type === "PullRequestEvent" && event.payload.action === "opened") {
      pullRequests7d += 1;
      repo.pullRequests += 1;

      if (bucket) {
        bucket.pullRequests += 1;
      }
    }

    if (event.type === "PullRequestReviewEvent") {
      reviews7d += 1;

      if (bucket) {
        bucket.reviews += 1;
      }
    }

    repoMap.set(event.repo.name, repo);
  });

  const reposTouched7d = repoMap.size;
  const activityScore =
    commits7d * 1.2 + pushes7d * 2 + pullRequests7d * 4 + reviews7d * 2.5;
  const tone = getTone(activityScore);

  return {
    username: user.login,
    profileUrl: user.html_url,
    avatarUrl: user.avatar_url,
    commits7d,
    pushes7d,
    pullRequests7d,
    reviews7d,
    reposTouched7d,
    activityScore: Math.round(activityScore),
    tone,
    summary: getSummary(tone, commits7d, reposTouched7d),
    insight: getInsight(tone, pushes7d, reposTouched7d, pullRequests7d),
    topRepos: [...repoMap.values()]
      .sort(
        (left, right) =>
          right.commits + right.pullRequests * 3 - (left.commits + left.pullRequests * 3),
      )
      .slice(0, 3),
    dailyActivity: dailyBuckets,
  };
}
