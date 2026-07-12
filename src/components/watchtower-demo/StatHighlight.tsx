import { TrendingDown, TrendingUp } from "lucide-react";

export interface StatHighlightProps {
  /** Monospace label above the value, e.g. "Incoming". Omit when the card header serves as the label. */
  label?: string;
  /** Large formatted value string, e.g. "64%", "7.08". */
  value: string;
  /** Secondary value shown stacked above the change row, e.g. "14.2/16 GB". */
  unit?: string;
  /** % change — drives "+N%"/"-N%" with a trend icon. */
  changePercent?: number;
  /** Custom text instead of "±N%", e.g. "Monitor closely", "+1.5 GB/day". */
  changeLabel?: string;
  /** Explicit icon direction when changeLabel is used without changePercent. Defaults to sign of changePercent, else 'up'. */
  changeDirection?: "up" | "down";
  /** CSS color for the change text + icon. Defaults to the weak text color. */
  changeColor?: string;
  /** Small 12x12 color swatch shown next to the label (multi-series cards). */
  iconColor?: string;
  /** Override color for the big value (e.g. red for a critical disk %). */
  valueColor?: string;
}

export default function StatHighlight({
  label,
  value,
  unit,
  changePercent,
  changeLabel,
  changeDirection,
  changeColor,
  iconColor,
  valueColor,
}: StatHighlightProps) {
  const hasChange =
    (changePercent !== undefined && changePercent !== null) || Boolean(changeLabel);
  const isPositive =
    changeDirection === "up" ||
    (changeDirection === undefined &&
      (changePercent !== undefined ? changePercent >= 0 : true));
  const hasExtras = Boolean(unit) || hasChange;

  return (
    <div className="flex flex-col gap-[var(--wt-demo-space-100)]">
      {(label || iconColor) && (
        <div className="flex items-center gap-[var(--wt-demo-space-100)]">
          {iconColor && (
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-[var(--wt-demo-radius-xs)]"
              style={{ backgroundColor: iconColor }}
            />
          )}
          <span
            className="font-mono text-xs"
            style={{ color: "var(--wt-demo-neutral-text-weak)" }}
          >
            {label}
          </span>
        </div>
      )}

      <div className="flex w-full items-center gap-[var(--wt-demo-space-100)]">
        <span
          className="leading-[30px] tracking-[-0.48px] whitespace-nowrap"
          style={{
            fontSize: "32px",
            color: valueColor ?? "var(--wt-demo-neutral-text-main)",
          }}
        >
          {value}
        </span>

        {hasExtras && (
          <div className="flex flex-col items-start justify-center gap-[var(--wt-demo-space-50)]">
            {unit && (
              <span
                className="font-mono text-xs whitespace-nowrap"
                style={{ color: "var(--wt-demo-neutral-text-weak)" }}
              >
                {unit}
              </span>
            )}
            {hasChange && (
              <div
                className="flex items-center gap-[var(--wt-demo-space-50)]"
                style={{ color: changeColor ?? "var(--wt-demo-neutral-text-weak)" }}
              >
                {isPositive ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                <span className="font-mono text-xs">
                  {changeLabel ??
                    `${isPositive ? "+" : "-"}${Math.abs(changePercent ?? 0)}%`}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
