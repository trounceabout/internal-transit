import { CheckCircle2 } from "lucide-react";
import type { UcTimelineStatus } from "./types";

interface UcTimelineItemData {
  status: UcTimelineStatus;
  label: string;
  duration: string;
  timestamp: string;
}

interface UcTimelineProps {
  items: UcTimelineItemData[];
}

const CONNECTOR_COLOR: Record<UcTimelineStatus, string> = {
  success: "var(--uc-demo-timeline-success-icon)",
  neutral: "var(--uc-demo-timeline-connector)",
};

/* A vertical status/audit log — new bespoke component, no analog among the
   real Undercurrent components (UcProgressTracker is a two-segment bar,
   not a list). The connecting line is drawn per-segment (one div between
   each pair of items, plus one leading into the first item from whatever
   sits above the timeline) rather than a single flat line, so each segment
   can carry its own status color — e.g. a danger-red segment leading down
   from an error banner into a run of success-green segments below it. */
export default function UcTimeline({ items }: UcTimelineProps) {
  return (
    <div className="relative flex flex-col">
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="relative flex flex-col">
            {/* Segment leading INTO this item — colored by the item above
                it (or, for the first item, by leadingColor, e.g. the
                danger-red coming down from an error banner). */}
            {!isFirst && (
              <div
                className="absolute top-0 left-2 h-1/2 w-px -translate-x-1/2"
                style={{
                  backgroundColor: CONNECTOR_COLOR[items[index - 1].status],
                }}
              />
            )}
            {/* Segment leading OUT of this item, colored by this item's
                own status — omitted after the last item, nothing to
                connect to below it. */}
            {!isLast && (
              <div
                className="absolute bottom-0 left-2 h-1/2 w-px -translate-x-1/2"
                style={{ backgroundColor: CONNECTOR_COLOR[item.status] }}
              />
            )}
            <UcTimelineItem {...item} />
          </div>
        );
      })}
    </div>
  );
}

function UcTimelineItem({
  status,
  label,
  duration,
  timestamp,
}: UcTimelineItemData) {
  const iconColor =
    status === "success"
      ? "var(--uc-demo-timeline-success-icon)"
      : "var(--uc-demo-timeline-neutral-icon)";

  return (
    <div className="relative flex items-center gap-[var(--uc-demo-space-100)] py-[var(--uc-demo-space-100)]">
      <CheckCircle2
        size={16}
        className="z-10 shrink-0"
        style={{
          color: iconColor,
          backgroundColor: "var(--uc-demo-neutral-bg-main)",
        }}
      />
      <span
        className="min-w-0 flex-1 truncate text-sm"
        style={{ color: "var(--uc-demo-neutral-text-main)" }}
      >
        {label}
      </span>
      <span
        className="inline-flex shrink-0 items-center rounded-[var(--uc-demo-radius-xs)] px-[var(--uc-demo-duration-tag-padding-x)] text-xs whitespace-nowrap"
        style={{
          height: "var(--uc-demo-duration-tag-height)",
          backgroundColor: "var(--uc-demo-neutral-bg-weak)",
          color: "var(--uc-demo-neutral-text-weak)",
        }}
      >
        {duration}
      </span>
      <span
        className="hidden shrink-0 truncate text-sm sm:block"
        style={{
          color: "var(--uc-demo-neutral-text-weak)",
          fontFamily: "'Geist Mono', monospace",
        }}
      >
        {timestamp}
      </span>
    </div>
  );
}
