import { Info } from "lucide-react";

export interface WtInfoTooltipProps {
  message: string;
}

/**
 * The (i) info icon in a card header. A hand-rolled CSS-only tooltip rather
 * than the native `title` attribute — browsers apply their own fixed
 * ~1-1.5s delay to `title` with no way to shorten it. `transition-delay`
 * on opacity gives a real, tunable open delay (500ms) while keeping the
 * tooltip itself simple absolutely-positioned CSS, no portal/positioning
 * library needed for a fixed top-anchored popup this small.
 */
export default function WtInfoTooltip({ message }: WtInfoTooltipProps) {
  return (
    <span className="group/tooltip relative flex shrink-0">
      <Info
        size={16}
        className="shrink-0 cursor-default"
        style={{ color: "var(--wt-demo-neutral-text-weak)" }}
        aria-label={message}
        tabIndex={0}
      />
      <span
        role="tooltip"
        className="pointer-events-none absolute top-full right-0 z-10 mt-1.5 w-max max-w-[220px] rounded-[var(--wt-demo-radius-xs)] px-2 py-1 font-mono text-xs opacity-0 transition-opacity delay-500 duration-100 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100"
        style={{
          backgroundColor: "var(--wt-demo-hover-label-bg)",
          color: "var(--wt-demo-hover-label-text)",
        }}
      >
        {message}
      </span>
    </span>
  );
}
