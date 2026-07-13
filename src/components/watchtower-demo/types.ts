/** A single chart data point. `time` is a unix timestamp in seconds; every
 * other field is a numeric series value (e.g. `memory`, `cpu`, `incoming`). */
export type DataPoint = { time: number } & Record<string, number>;

/** Result of a change computation: a rounded percent, `'new'` when the
 * previous period/point was a genuine zero and the current value is
 * positive (a real signal, not a percentage), or undefined when unknown. */
export type ChangeResult = number | "new" | undefined;
