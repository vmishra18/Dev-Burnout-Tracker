# Dev Burnout Tracker

Dev Burnout Tracker is a polished React + TypeScript wellness dashboard for developers. It helps users log mood, stress, sleep, coding hours, meetings, breaks, and notes, then turns those check-ins into a believable burnout score with focused analytics, history, and rule-based insights.

The current version is intentionally positioned as a strong frontend MVP: real product behavior, real local persistence, real scoring logic, and a portfolio-friendly UI, without pretending to be a clinically validated system or a fully backend-powered SaaS.

## Highlights

- Calm, portfolio-grade UI with a dedicated welcome screen and a more focused dashboard
- Daily check-in flow with live burnout-score preview
- Rule-based burnout scoring using stress, sleep, coding load, mood, productivity, meetings, and break quality
- Weekly summaries, focused recommendations, and pattern-based insights
- Searchable history timeline with filters
- Optional GitHub public-activity integration as a secondary signal
- Route-based app structure with onboarding and settings
- Local-first persistence via `localStorage`
- Exportable weekly recap

## Screens

<img width="200" height="300" alt="Screenshot 2026-03-19 at 10 56 18 AM" src="https://github.com/user-attachments/assets/e300b296-2712-460e-9172-3d610baef04f" />

<img width="200" height="300" alt="Screenshot 2026-03-19 at 10 56 29 AM" src="https://github.com/user-attachments/assets/f8977aca-22a6-4ff1-bc3f-15941432922e" />

<img width="200" height="300" alt="Screenshot 2026-03-19 at 10 58 09 AM" src="https://github.com/user-attachments/assets/81454737-9a5f-4b09-b0b1-4b5ceb69105c" />

<img width="200" height="300" alt="Screenshot 2026-03-19 at 10 58 18 AM" src="https://github.com/user-attachments/assets/71da40d0-b1a4-4fb0-a5a8-5f0f095d190f" />

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Recharts
- Framer Motion
- Lucide React
- React Router
- localStorage persistence

## Run Locally

```bash
npm install
npm run dev
```

Open the local Vite URL printed in the terminal, usually `http://localhost:5173`.

### Other Scripts

```bash
npm run build
npm run preview
npm run lint
npm run format
```

## Product Structure

```text
src/
  components/   Reusable UI primitives and feature components
  data/         Seed mock data so the app is complete on first launch
  hooks/        Entry, profile, and GitHub activity state
  pages/        Welcome, onboarding, dashboard, check-in, history, settings
  types/        Shared TypeScript models
  utils/        Burnout scoring, insights, storage, report export, dates
```

## How The App Works

### 1. Daily Check-In

Users log:

- mood
- stress
- productivity
- coding hours
- sleep hours
- break quality
- meetings
- notes

The check-in form previews the burnout score live so users can immediately see how the day is trending.

### 2. Burnout Score Logic

The scoring model is simple on purpose, but not random.

Signals used:

- higher stress increases risk heavily
- sleep debt raises risk when sleep falls below the target range
- long coding sessions add workload pressure
- lower mood adds emotional strain
- lower productivity acts as a softer fatigue signal
- more meetings add interruption and context-switching cost
- poor breaks weaken recovery

Those weighted factors are normalized into a `0-100` burnout score and mapped to:

- `Low`: under 30
- `Moderate`: 30 to 54
- `High`: 55 to 74
- `Critical`: 75+

The UI also explains the score by surfacing the strongest contributing factors for the current day.

### 3. Insights Engine

The insight engine looks for patterns such as:

- sleep dropping week over week
- stress trending upward
- long coding sessions increasing risk
- better breaks improving mood
- lower sleep correlating with lower productivity

Insights are rule-based rather than AI-generated so the behavior is deterministic and easy to understand.

### 4. GitHub Activity

Users can optionally add a GitHub username in settings.

The app then reads recent public GitHub events and derives:

- pushes
- pull requests
- repositories touched
- a compact 7-day activity pulse

This is intentionally treated as a supporting signal, not the main story of the product.

## Architecture Notes

- `useBurnoutEntries` handles seeded data, entry loading, updates, and persistence
- `useUserProfile` handles onboarding data, user goals, and profile persistence
- `useGitHubActivity` fetches recent public GitHub activity for the configured username
- `utils/burnout.ts` owns the scoring model and risk mapping
- `utils/insights.ts` owns chart data, weekly summaries, badges, and pattern generation

The structure is designed to be easy to extend later with a backend like Supabase or Firebase.

## Why This Is Good For GitHub

This project demonstrates more than CRUD:

- product thinking
- React architecture
- TypeScript modeling
- reusable component design
- state and persistence
- chart-driven UI
- polished dashboard design
- feature integration with external data

It is best understood as a strong frontend MVP or portfolio-grade product build rather than a fully productionized SaaS.

## Current Limitations

- no authentication
- no backend or cloud sync
- no automated tests yet
- no clinical validation for burnout scoring
- GitHub data uses public events only, so private contributions are excluded

## Next Good Upgrades

- Supabase auth and database
- unit tests for scoring and insights
- deployment to Vercel
- analytics and monitoring
- calendar integration for meeting load
- AI-generated weekly summaries
