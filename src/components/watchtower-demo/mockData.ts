import type { DataPoint } from "./types";

/* All series share a common time axis (30-minute intervals, ~1 day of
 * history split into a "previous" half and a "current" half so idle-state
 * cards can show period-over-period change) so hovering conceptually lines
 * up across cards, even though each card manages its own hover state. */
const INTERVAL_SECONDS = 1800;
const POINTS_PER_PERIOD = 24;
const BASE_TIME =
  Math.floor(Date.UTC(2026, 4, 9, 0, 0, 0) / 1000) -
  INTERVAL_SECONDS * POINTS_PER_PERIOD;

function withTime<T extends Record<string, number>>(values: T[]): DataPoint[] {
  return values.map((value, i) => ({
    time: BASE_TIME + INTERVAL_SECONDS * i,
    ...value,
  }));
}

/* ─── CPU Utilization — % used, previous period (idx 0-23) + current (24-47).
 * The current period's average sits above the 80% warning threshold (not
 * just individual spikes) so the elevated color shows by default, before
 * any hovering — a server that's been running hot, not just briefly busy. */
export const cpuData: DataPoint[] = withTime(
  [
    58, 60, 63, 61, 59, 62, 65, 68, 70, 66, 63, 61, 59, 62, 64, 67, 69, 65, 62,
    60, 63, 66, 68, 64,
    // current period
    76, 79, 82, 85, 87, 84, 81, 78, 80, 88, 91, 93, 87, 82, 80, 77, 75, 78, 81,
    84, 86, 83, 80, 89,
  ].map((cpu) => ({ cpu })),
);

/* ─── RAM usage — bytes used out of 16 GB total.
 *
 * Real server memory graphs are a "sawtooth": usage climbs as the app
 * allocates and caches, then drops sharply when garbage collection (or a
 * cache eviction) reclaims it, then climbs again — not a smooth ramp and
 * not a symmetric wobble. generateSawtoothGB builds a handful of
 * rise-then-drop cycles of varying length/height, each with small
 * point-to-point jitter layered on top of the climb (allocator noise,
 * background processes), rather than hand-typing every value. */
const GB = 1024 * 1024 * 1024;

interface SawtoothCycle {
  /** How many points this rise-then-drop cycle spans. */
  length: number;
  /** GB level the cycle climbs to just before it drops. */
  peakGB: number;
  /** GB level the cycle drops back down to after the peak. */
  floorGB: number;
}

function generateSawtoothGB(cycles: SawtoothCycle[], seed = 1): number[] {
  const values: number[] = [];
  // Simple deterministic PRNG (mulberry32) so the "randomness" is stable
  // across reloads instead of shifting every time this module re-evaluates.
  let state = seed;
  const jitter = (amplitude: number) => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return ((state / 0xffffffff) * 2 - 1) * amplitude;
  };

  for (const { length, peakGB, floorGB } of cycles) {
    const start = values.at(-1) ?? floorGB;
    for (let i = 0; i < length; i++) {
      const t = i / (length - 1);
      const climbing = start + (peakGB - start) * t;
      values.push(Math.round((climbing + jitter(0.15)) * 100) / 100);
    }
    // Sharp GC-style drop at the end of the cycle, not a gradual descent.
    values.push(Math.round((floorGB + jitter(0.1)) * 100) / 100);
  }
  return values;
}

/* Each cycle contributes (length + 1) points (the climb, plus one sharp
 * drop point at the end) — the two groups below sum to 24 points each so
 * the 48-point total splits evenly at the midpoint, matching every other
 * series and the "previous period vs. current period" comparison logic
 * every card relies on. */
export const ramData: DataPoint[] = withTime(
  generateSawtoothGB(
    [
      { length: 7, peakGB: 13.6, floorGB: 11.4 },
      { length: 6, peakGB: 14.1, floorGB: 11.8 },
      { length: 8, peakGB: 13.9, floorGB: 12.0 },
      // current period — same climb/drop pattern, trending a bit higher
      { length: 7, peakGB: 14.4, floorGB: 12.2 },
      { length: 6, peakGB: 14.9, floorGB: 12.6 },
      { length: 8, peakGB: 14.7, floorGB: 12.4 },
    ],
    7,
  ).map((gb) => ({ memory: gb * GB })),
);
export const RAM_TOTAL_BYTES = 16 * GB;

/* ─── Disk space — static snapshot, no chart. Values live directly on the card. */
export const diskSpace = {
  usedGB: 186,
  totalGB: 200,
  percentUsed: 93,
  growthGBPerDay: 1.5,
  projectedFullDate: "Jun 26, 2026",
  projectedDaysLeft: 9,
};

/* ─── Shared deterministic PRNG + diurnal-curve helper ───────────────────
 * Both Bandwidth and Network speed follow the same real-world shape: low
 * overnight (~1am-10am), rising through the day, peaking in the evening
 * "internet rush hour" (~6-10pm) at roughly 1.5-2x the daily average, per
 * published traffic-pattern research — not flat noise around a baseline. */
function makeJitter(seed: number) {
  let state = seed;
  return (amplitude: number) => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return ((state / 0xffffffff) * 2 - 1) * amplitude;
  };
}

/** 0-1 diurnal weight for a given hour-of-day (0-23): low overnight, peaks ~20:00. */
function diurnalWeight(hour: number): number {
  // Cosine centered on hour 20, so the trough falls ~08:00 and the peak ~20:00.
  const radians = ((hour - 20) / 24) * Math.PI * 2;
  return 0.5 + 0.5 * Math.cos(radians);
}

/* ─── Bandwidth — incoming/outgoing MB per day. Its own daily time axis
 * (rather than the shared 30-min one above) since a monthly bar chart needs
 * one point per calendar day, not per half-hour — 31 "previous month" days
 * followed by 31 "current month" days so the idle-state period comparison
 * still works, and the chart itself shows a full 31-day month.
 *
 * Real traffic is higher on weekdays overall, but weekends see relatively
 * more daytime traffic; approximated here with a 7-day weekday/weekend
 * rhythm (every 6th/7th day dips) rather than exact calendar lookups, plus
 * jitter and a gentle month-long upward drift. */
const BANDWIDTH_INTERVAL_SECONDS = 86400;
const BANDWIDTH_BASE_TIME =
  Math.floor(Date.UTC(2026, 4, 9, 0, 0, 0) / 1000) - BANDWIDTH_INTERVAL_SECONDS * 31;

function generateBandwidthMonth(
  baseIncomingMB: number,
  baseOutgoingMB: number,
  driftPerDay: number,
  seed: number,
): [number, number][] {
  const jitter = makeJitter(seed);
  const days: [number, number][] = [];
  for (let day = 0; day < 31; day++) {
    const dayOfWeek = day % 7; // 0-4 weekday-ish, 5-6 weekend-ish
    const isWeekend = dayOfWeek >= 5;
    const weekendFactor = isWeekend ? 0.72 : 1.0;
    const drift = 1 + (driftPerDay * day) / 31;
    const incoming = baseIncomingMB * weekendFactor * drift + jitter(0.8);
    const outgoing = baseOutgoingMB * weekendFactor * drift + jitter(1.5);
    days.push([
      Math.round(Math.max(2, incoming) * 100) / 100,
      Math.round(Math.max(4, outgoing) * 100) / 100,
    ]);
  }
  return days;
}

export const bandwidthData: DataPoint[] = [
  ...generateBandwidthMonth(5.6, 10.8, 0.1, 11),
  // Current month — same weekday/weekend rhythm, trending up over the month
  ...generateBandwidthMonth(5.8, 11.2, 0.35, 23),
].map(([incoming, outgoing], i) => ({
  time: BANDWIDTH_BASE_TIME + BANDWIDTH_INTERVAL_SECONDS * i,
  incoming,
  outgoing,
}));

/* ─── Network speed — received/sent in kbps, 30-min intervals. Follows the
 * same diurnal curve as Bandwidth but sampled every 30 minutes across a
 * 12-hour window per period, so the peak/trough is visible within a single
 * chart rather than smoothed out across a month of daily totals.
 * startHour anchors the window to include a full rise-and-fall arc (late
 * morning trough through the evening peak) rather than only the
 * descending half of the curve. */
function generateNetworkSpeedWindow(
  baseReceivedKbps: number,
  baseSentKbps: number,
  startHour: number,
  seed: number,
): [number, number][] {
  const jitter = makeJitter(seed);
  const points: [number, number][] = [];
  for (let i = 0; i < 24; i++) {
    const hour = (startHour + i * 0.5) % 24;
    const weight = diurnalWeight(hour);
    // Peak-to-average ratio ~1.8x at the evening high, per traffic research.
    const scale = 0.55 + weight * 1.25;
    const received = baseReceivedKbps * scale + jitter(15);
    const sent = baseSentKbps * scale + jitter(25);
    points.push([Math.round(Math.max(40, received)), Math.round(Math.max(80, sent))]);
  }
  return points;
}

export const networkSpeedData: DataPoint[] = withTime(
  [
    ...generateNetworkSpeedWindow(300, 560, 10, 3),
    // current period — same diurnal shape, slightly higher baseline
    ...generateNetworkSpeedWindow(320, 590, 10, 17),
  ].map(([received, sent]) => ({ received, sent })),
);
