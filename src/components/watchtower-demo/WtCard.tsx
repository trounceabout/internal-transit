import type { ReactNode } from "react";
import WtInfoTooltip from "./WtInfoTooltip";

export interface WtCardProps {
  title: string;
  /** Tooltip message for the (i) info icon in the header. Omit to hide the icon. */
  infoMessage?: string;
  children: ReactNode;
  /** Optional footer row, e.g. Disk space's red "Full by" bar. Rendered as
   * its own layer behind the card body (which has its own independent
   * border/rounded corners), so the footer reads as peeking out from
   * underneath rather than being inset flush inside the card's border. */
  footer?: ReactNode;
  /** Background color for the footer layer (danger red when disk is critical). */
  footerBgColor?: string;
  /** CSS background-image override for the card body, e.g. a gradient wash
   * (CPU Utilization's amber tint). Falls back to the flat neutral surface
   * every other card uses when omitted. */
  backgroundImage?: string;
}

export default function WtCard({
  title,
  infoMessage,
  children,
  footer,
  footerBgColor,
  backgroundImage,
}: WtCardProps) {
  return (
    <div
      className="flex h-full flex-col rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[var(--wt-demo-radius-md)] rounded-br-[var(--wt-demo-radius-md)]"
      style={{ backgroundColor: footer ? footerBgColor : undefined }}
    >
      <div
        className="flex flex-1 flex-col rounded-[var(--wt-demo-radius-md)] border"
        style={{
          backgroundColor: "var(--wt-demo-neutral-bg-main)",
          backgroundImage,
          borderColor: "var(--wt-demo-neutral-border-weak)",
        }}
      >
        <div className="relative flex items-center justify-between px-[var(--wt-demo-space-200)] pt-[var(--wt-demo-space-200)]">
          <span
            className="text-sm font-medium"
            style={{ color: "var(--wt-demo-neutral-text-main)" }}
          >
            {title}
          </span>
          {infoMessage && <WtInfoTooltip message={infoMessage} />}
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </div>

      {footer && (
        <div className="shrink-0 px-3.5 py-2.5 leading-none">{footer}</div>
      )}
    </div>
  );
}
