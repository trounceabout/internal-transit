import type { ChangeResult, DataPoint } from "./types";

/** Mean of `key` across data points that have a value; skips null/missing readings. */
export function avg(data: DataPoint[], key: string): number {
  const present = data.filter((point) => point[key] != null);
  if (!present.length) return 0;
  return present.reduce((sum, point) => sum + point[key], 0) / present.length;
}

/**
 * Point-to-previous-point percentage change for `key` at `index`.
 * Returns undefined when there's no earlier point to compare against (index
 * 0 of the full series) or when either value is missing. Returns 'new' when
 * the previous point was a genuine zero and the current point is positive,
 * rather than hiding the spike as "unknown".
 */
export function computeChange(
  data: DataPoint[],
  key: string,
  index: number,
): ChangeResult {
  if (index < 1) return undefined;
  const current = data[index][key];
  const previous = data[index - 1][key];
  if (current == null || previous == null) return undefined;
  if (previous === 0) return current > 0 ? "new" : undefined;
  return Math.round(((current - previous) / previous) * 100);
}


/**
 * Period-over-period percentage change between a current and previous average.
 * See ChangeResult for the 'new'-baseline sentinel.
 */
export function periodChange(currentAvg: number, prevAvg: number): ChangeResult {
  if (prevAvg === 0) return currentAvg > 0 ? "new" : undefined;
  return Math.round(((currentAvg - prevAvg) / prevAvg) * 100);
}

/**
 * Resolves a change result to a CSS color var. `direction` controls whether
 * an increase reads as concerning (server load, disk usage) or unremarkable
 * (network throughput, where "incoming +20%" isn't inherently bad) — Wallaby's
 * server-health-only "increase is always danger" rule doesn't hold for every
 * card in this dashboard.
 */
export function changeColorForIncrease(
  changePercent: ChangeResult,
  direction: "increase-is-bad" | "increase-is-good",
): string | undefined {
  if (changePercent === undefined) return undefined;
  const isIncrease = changePercent === "new" || changePercent > 0;
  const isDecrease = typeof changePercent === "number" && changePercent < 0;
  if (!isIncrease && !isDecrease) return undefined;
  const goodColor = "var(--wt-demo-success-text)";
  const badColor = "var(--wt-demo-danger-text)";
  if (direction === "increase-is-bad") {
    return isIncrease ? badColor : goodColor;
  }
  return isIncrease ? goodColor : badColor;
}

/** Formats a unix-seconds timestamp as "May 9, 2026", matching the Figma hover label.
 * Use for series spanning weeks/months (e.g. Bandwidth's 31-day view), where every
 * hovered point falls on a distinct day. */
export function formatTooltipDate(unixSeconds: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(unixSeconds * 1000));
}

/** Formats a unix-seconds timestamp as "2:30 PM", for series spanning a day or two
 * (CPU, RAM, Network speed) — a date-only label would show the same value across
 * most of the hovered range and fail to communicate where on the graph you are. */
export function formatTooltipTime(unixSeconds: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(unixSeconds * 1000));
}
