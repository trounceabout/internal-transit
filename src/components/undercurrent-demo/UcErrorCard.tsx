interface UcErrorCardProps {
  title: string;
  dismissLabel: string;
  children: React.ReactNode;
}

/* The mock "server reboot error" card shell — new bespoke component, not
   the fixed-layout UcCard (that clone's stat-card shape doesn't fit a
   headline + field-grid body). Same outer bg-weak / inner bg-main surface
   pattern as UcCard, though.

   Only the top corners are rounded (not all four) — in ThemeRevealSandbox
   this card sits flush against its containing frame's own bottom edge, so
   rounded bottom corners would show as a visual gap/mismatch against that
   flush edge, per the Figma reference this card is meant to look like it's
   overhanging the frame from.

   The Dismiss button is hand-rolled rather than reusing UcButton: UcButton's
   colors come from --uc-demo-active-*, which would tint a plain dismiss
   action with whatever color variant happens to be active (danger, here) —
   the same reason UcAlert's own dismiss button doesn't use UcButton either. */
export default function UcErrorCard({ title, dismissLabel, children }: UcErrorCardProps) {
  return (
    <div
      className="flex w-full flex-col rounded-t-[var(--uc-demo-radius-md)]"
      style={{ backgroundColor: 'var(--uc-demo-neutral-bg-weak)' }}
    >
      <div
        className="flex flex-col gap-[var(--uc-demo-space-200)] rounded-t-[var(--uc-demo-radius-md)] border p-[var(--uc-demo-space-300)]"
        style={{
          backgroundColor: 'var(--uc-demo-neutral-bg-main)',
          borderColor: 'var(--uc-demo-neutral-border-weak)',
        }}
      >
        <div className="flex items-start justify-between gap-[var(--uc-demo-space-200)]">
          <span
            className="text-lg font-medium"
            style={{ color: 'var(--uc-demo-neutral-text-main)' }}
          >
            {title}
          </span>
          <button
            type="button"
            className="inline-flex h-[var(--uc-demo-size-sm)] shrink-0 items-center justify-center rounded-[var(--uc-demo-radius-full)] px-[var(--uc-demo-space-150)] text-sm font-medium"
            style={{
              backgroundColor: 'var(--uc-demo-neutral-bg-weak)',
              color: 'var(--uc-demo-neutral-text-main)',
            }}
          >
            {dismissLabel}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
