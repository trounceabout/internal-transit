import type { TooltipProps } from "recharts";
import { formatTooltipDate } from "./graphMeasurements";

interface HoverDateTooltipProps extends TooltipProps<number, string> {
  /** Formats the hovered point's unix-seconds timestamp for display.
   * Defaults to a full date; pass formatTooltipTime for series spanning a
   * day or two, where a date-only label would repeat across most of the
   * hovered range (e.g. CPU, RAM, Network speed). */
  formatLabel?: (unixSeconds: number) => string;
}

/**
 * Tooltip `content` renderer showing only the hovered point's date/time —
 * the line + dot are recharts' own default Tooltip cursor + Area/Line
 * activeDot, left un-suppressed (no cursor={false}, no dot={false}
 * override), matching Wallaby's RamUsageGraph pattern exactly. This
 * component only supplies the floating label text; recharts positions and
 * layers it above the chart automatically.
 */
export default function HoverDateTooltip({
  active,
  payload,
  formatLabel = formatTooltipDate,
}: HoverDateTooltipProps) {
  if (!active || !payload?.length) return null;
  const time = payload[0]?.payload?.time as number | undefined;
  if (time == null) return null;

  return (
    <div
      className="rounded-[var(--wt-demo-radius-xs)] px-2 py-1 font-mono text-xs whitespace-nowrap shadow-lg"
      style={{
        backgroundColor: "var(--wt-demo-hover-label-bg)",
        color: "var(--wt-demo-hover-label-text)",
      }}
    >
      {formatLabel(time)}
    </div>
  );
}
