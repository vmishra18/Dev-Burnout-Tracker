import type { DailyEntry, Insight, WeeklySummary } from "../types";
import { formatLongDate } from "./date";

export function exportWellnessReport(args: {
  entries: DailyEntry[];
  summary: WeeklySummary;
  insights: Insight[];
}): void {
  if (typeof window === "undefined") {
    return;
  }

  const latest = args.entries[args.entries.length - 1];
  const reportWindow = window.open("", "_blank", "width=1080,height=780");

  if (!reportWindow || !latest) {
    throw new Error("Report window could not be opened.");
  }

  const rows = args.entries
    .slice(-10)
    .reverse()
    .map(
      (entry) => `
        <tr>
          <td>${formatLongDate(entry.date)}</td>
          <td>${entry.burnoutScore}</td>
          <td>${entry.stress}/10</td>
          <td>${entry.sleepHours}h</td>
          <td>${entry.codingHours}h</td>
          <td>${entry.productivity}/10</td>
        </tr>
      `,
    )
    .join("");

  const insights = args.insights
    .slice(0, 4)
    .map(
      (insight) =>
        `<li><strong>${insight.title}:</strong> ${insight.description}</li>`,
    )
    .join("");

  reportWindow.document.write(`
    <html>
      <head>
        <title>Dev Burnout Tracker Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #111827; }
          h1 { margin-bottom: 8px; }
          .hero { background: #f3f7fb; border-radius: 18px; padding: 24px; margin: 24px 0; }
          .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
          .stat { background: white; border: 1px solid #dbe4f0; border-radius: 14px; padding: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; }
          ul { line-height: 1.6; }
        </style>
      </head>
      <body>
        <h1>Dev Burnout Tracker</h1>
        <p>Weekly wellness summary generated for ${formatLongDate(latest.date)}.</p>
        <div class="hero">
          <h2>Burnout Risk Snapshot</h2>
          <p><strong>Current Score:</strong> ${latest.burnoutScore}/100 (${latest.riskLevel})</p>
          <p>${latest.explanation}</p>
        </div>
        <div class="stats">
          <div class="stat"><strong>Avg Burnout</strong><br />${args.summary.averageBurnout}/100</div>
          <div class="stat"><strong>Avg Sleep</strong><br />${args.summary.averageSleep}h</div>
          <div class="stat"><strong>Avg Stress</strong><br />${args.summary.averageStress}/10</div>
          <div class="stat"><strong>Total Coding</strong><br />${args.summary.totalCodingHours}h</div>
        </div>
        <h2>Weekly Summary</h2>
        <p>${args.summary.summary}</p>
        <p><strong>Suggested reset:</strong> ${args.summary.takeBreakSuggestion}</p>
        <h2>Key Insights</h2>
        <ul>${insights}</ul>
        <h2>Recent Check-ins</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Burnout</th>
              <th>Stress</th>
              <th>Sleep</th>
              <th>Coding</th>
              <th>Productivity</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `);
  reportWindow.document.close();
  reportWindow.focus();
  reportWindow.print();
}
