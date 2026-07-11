interface UcProgressTrackerProps {
  /** Percentage (0–100) of the track that renders as the solid fill segment. */
  value: number;
}

/* Visual clone of Undercurrent's ProgressTracker. The real component
   supports a fully generic N-milestone mode; the Figma reference for this
   demo only shows a fixed two-segment look (one solid fill + one dashed
   "incomplete" segment), so that's what this clone builds — no need to
   port the real component's generic segment-count logic for a demo that
   only ever shows one fixed split. */
export default function UcProgressTracker({ value }: UcProgressTrackerProps) {
  return (
    <div
      className="relative h-16 w-full overflow-hidden rounded-[var(--uc-demo-radius-sm)] border"
      style={{ borderColor: 'var(--uc-demo-active-border-main)' }}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-[var(--uc-demo-radius-sm)]"
        style={{
          width: `${value}%`,
          backgroundColor: 'var(--uc-demo-active-bg-main)',
        }}
      />
      <div
        className="absolute inset-y-0 rounded-[var(--uc-demo-radius-sm)]"
        style={{
          left: `${value}%`,
          right: 0,
        }}
      />
    </div>
  );
}
