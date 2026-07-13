export interface MeasureBarProps {
  /** Current fill percentage, 0-100. */
  percentage: number;
}

/**
 * Segmented usage bar — three highlight-blue tones (light/medium/dark) per
 * the Figma reference, not a warning/critical color escalation. The bar
 * itself stays neutral; the danger-red state lives in the StatHighlight
 * value and footer above/below it instead.
 */
export default function MeasureBar({ percentage }: MeasureBarProps) {
  const value = Math.min(100, Math.max(0, percentage));
  const darkSegment = 6;
  const mediumSegment = 12;
  const lightSegment = Math.max(0, value - darkSegment - mediumSegment);

  return (
    <div
      className="relative flex h-10 w-full overflow-hidden rounded-[var(--wt-demo-radius-sm)] border"
      style={{ borderColor: "var(--wt-demo-neutral-border-weak)" }}
    >
      <div style={{ width: `${lightSegment}%`, backgroundColor: "#bfdbfe" }} />
      <div style={{ width: `${mediumSegment}%`, backgroundColor: "#3d7bf5" }} />
      <div style={{ width: `${darkSegment}%`, backgroundColor: "#1c42a8" }} />
    </div>
  );
}
