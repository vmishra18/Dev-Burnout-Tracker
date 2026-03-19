import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { DashboardSkeleton } from "./components/LoadingSkeleton";
import { Toast } from "./components/Toast";
import { TopNav } from "./components/TopNav";
import { useBurnoutEntries } from "./hooks/useBurnoutEntries";
import { useGitHubActivity } from "./hooks/useGitHubActivity";
import { defaultProfile, useUserProfile } from "./hooks/useUserProfile";
import { CheckInPage } from "./pages/CheckInPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HistoryPage } from "./pages/HistoryPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { SettingsPage } from "./pages/SettingsPage";
import { WelcomePage } from "./pages/WelcomePage";
import type { AppView, ThemeMode, UserProfile } from "./types";
import { calculateBurnoutScore } from "./utils/burnout";
import { formatLongDate, getContinuousStreak } from "./utils/date";
import {
  buildChartData,
  generateInsights,
  getBestDay,
  getMotivationalBadges,
  getPersonalizedRecommendations,
  getWeeklySummary,
} from "./utils/insights";
import { exportWellnessReport } from "./utils/report";
import { loadTheme, persistTheme } from "./utils/storage";

function getActiveView(pathname: string): AppView {
  if (pathname.startsWith("/checkin")) {
    return "checkin";
  }

  if (pathname.startsWith("/history")) {
    return "history";
  }

  if (pathname.startsWith("/settings")) {
    return "settings";
  }

  return "dashboard";
}

function AppRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  const { entries, isLoading, latestEntry, saveEntry } = useBurnoutEntries();
  const { profile, hasProfile, saveProfile } = useUserProfile();
  const githubActivity = useGitHubActivity(profile);
  const [theme, setTheme] = useState<ThemeMode>(() => loadTheme());
  const [toast, setToast] = useState<{
    message: string;
    variant?: "success" | "error";
  } | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    persistTheme(theme);
  }, [theme]);

  useEffect(() => {
    const isOnboarding = location.pathname === "/onboarding";
    const isWelcome = location.pathname === "/welcome";
    const isRoot = location.pathname === "/";

    if (!hasProfile && !isOnboarding) {
      navigate("/onboarding", { replace: true });
    }

    if (hasProfile && (isOnboarding || isRoot)) {
      navigate("/welcome", { replace: true });
    }

    if (!hasProfile && (isWelcome || isRoot)) {
      navigate("/onboarding", { replace: true });
    }
  }, [hasProfile, location.pathname, navigate]);

  const assessment = useMemo(() => {
    if (!latestEntry) {
      return null;
    }

    return calculateBurnoutScore(latestEntry);
  }, [latestEntry]);

  const chartData = useMemo(() => buildChartData(entries, 7), [entries]);
  const insights = useMemo(() => generateInsights(entries, profile), [entries, profile]);
  const weeklySummary = useMemo(
    () => getWeeklySummary(entries, profile),
    [entries, profile],
  );
  const personalizedRecommendations = useMemo(
    () => getPersonalizedRecommendations(entries, profile),
    [entries, profile],
  );
  const streak = useMemo(() => getContinuousStreak(entries), [entries]);
  const bestDay = useMemo(() => getBestDay(entries), [entries]);
  const badges = useMemo(
    () => getMotivationalBadges(entries, streak),
    [entries, streak],
  );

  const handleSaveEntry = (entry: Parameters<typeof saveEntry>[0]) => {
    const saved = saveEntry(entry);
    setToast({
      message: `Check-in saved for ${formatLongDate(saved.date)}`,
      variant: "success",
    });
    navigate("/dashboard");
  };

  const handleThemeToggle = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const handleExport = () => {
    try {
      exportWellnessReport({
        entries,
        summary: weeklySummary,
        insights,
      });
      setToast({
        message: "PDF export opened in a print-friendly view",
        variant: "success",
      });
    } catch {
      setToast({
        message: "Allow pop-ups to export the report",
        variant: "error",
      });
    }
  };

  const handleProfileSave = (nextProfile: UserProfile) => {
    saveProfile(nextProfile);
    setToast({
      message: "Profile settings saved",
      variant: "success",
    });
    navigate("/dashboard");
  };

  if (!hasProfile && location.pathname === "/onboarding") {
    return (
      <>
        <OnboardingPage
          onSubmit={(nextProfile) => handleProfileSave({ ...defaultProfile, ...nextProfile })}
        />
        {toast ? (
          <Toast
            message={toast.message}
            variant={toast.variant}
            onClose={() => setToast(null)}
          />
        ) : null}
      </>
    );
  }

  if (hasProfile && location.pathname === "/welcome") {
    return (
      <>
        <WelcomePage
          profile={profile ?? defaultProfile}
          latestEntry={latestEntry}
          assessment={assessment}
          weeklySummary={weeklySummary}
          streak={streak}
          githubActivity={githubActivity.activity}
          onEnterDashboard={() => navigate("/dashboard")}
          onStartCheckIn={() => navigate("/checkin")}
          onOpenHistory={() => navigate("/history")}
        />
        {toast ? (
          <Toast
            message={toast.message}
            variant={toast.variant}
            onClose={() => setToast(null)}
          />
        ) : null}
      </>
    );
  }

  const activeView = getActiveView(location.pathname);

  const dashboardContent = isLoading ? (
    <DashboardSkeleton />
  ) : latestEntry && assessment ? (
    <DashboardPage
      latestEntry={latestEntry}
      assessment={assessment}
      chartData={chartData}
      insights={insights}
      weeklySummary={weeklySummary}
      bestDay={bestDay}
      badges={badges}
      streak={streak}
      onGoToCheckin={() => navigate("/checkin")}
      profile={profile}
      recommendations={personalizedRecommendations}
      githubActivity={githubActivity.activity}
      githubLoading={githubActivity.isLoading}
      githubError={githubActivity.error}
    />
  ) : (
    <HistoryPage entries={entries} />
  );

  return (
    <div className="shell-grid min-h-screen lg:grid lg:grid-cols-[292px_minmax(0,1fr)]">
      <TopNav
        activeView={activeView}
        onChangeView={(view) => navigate(view === "dashboard" ? "/dashboard" : `/${view}`)}
        onExport={handleExport}
        streak={streak}
        theme={theme}
        onToggleTheme={handleThemeToggle}
        currentScore={latestEntry?.burnoutScore ?? 0}
        riskLevel={latestEntry?.riskLevel ?? "Low"}
        profileName={profile?.name}
      />

      <main className="mx-auto min-w-0 w-full max-w-[1440px] overflow-x-clip px-3 pb-10 pt-4 sm:px-6 lg:px-8 lg:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            className="min-w-0"
            key={`${location.pathname}-${isLoading ? "loading" : "ready"}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/welcome" replace />} />
              <Route path="/welcome" element={<Navigate to="/dashboard" replace />} />
              <Route path="/onboarding" element={<Navigate to="/welcome" replace />} />
              <Route path="/dashboard" element={dashboardContent} />
              <Route
                path="/checkin"
                element={<CheckInPage entries={entries} onSubmit={handleSaveEntry} />}
              />
              <Route path="/history" element={<HistoryPage entries={entries} />} />
              <Route
                path="/settings"
                element={
                  profile ? (
                    <SettingsPage profile={profile} onSubmit={handleProfileSave} />
                  ) : null
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {toast ? (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      ) : null}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
