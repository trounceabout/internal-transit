import { XCircle } from 'lucide-react';

interface UcRetryBannerProps {
  title: string;
  durationLabel: string;
  timestamp: string;
  actionLabel: string;
}

/* A sibling to UcAlert, not an extension of it — UcAlert already has a
   clean, single-purpose shape (icon + title + body + one dismiss button)
   used elsewhere in this case study's demo; bending it with more optional
   props for this differently-shaped banner (duration tag, retry action,
   no body copy) would turn it into a grab-bag. This copies UcAlert's
   structural DNA (bordered neutral surface, active-color border/icon)
   with its own prop shape instead. */
export default function UcRetryBanner({ title, durationLabel, timestamp, actionLabel }: UcRetryBannerProps) {
  return (
    <div
      className="flex w-full flex-col items-stretch gap-[var(--uc-demo-space-100)] rounded-[var(--uc-demo-radius-md)] border p-[var(--uc-demo-space-200)] sm:flex-row sm:items-center sm:justify-between"
      style={{
        backgroundColor: 'var(--uc-demo-neutral-bg-main)',
        borderColor: 'var(--uc-demo-active-border-medium)',
      }}
    >
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-[var(--uc-demo-space-100)]">
          <XCircle
            size={16}
            className="shrink-0"
            style={{ color: 'var(--uc-demo-active-icon-main)' }}
          />
          <span
            className="font-medium"
            style={{ color: 'var(--uc-demo-neutral-text-main)' }}
          >
            {title}
          </span>
          <span
            className="inline-flex items-center rounded-[var(--uc-demo-radius-xs)] px-[var(--uc-demo-duration-tag-padding-x)] text-xs"
            style={{
              height: 'var(--uc-demo-duration-tag-height)',
              backgroundColor: 'var(--uc-demo-neutral-bg-weak)',
              color: 'var(--uc-demo-neutral-text-weak)',
            }}
          >
            {durationLabel}
          </span>
        </div>
        <span className="text-sm" style={{ color: 'var(--uc-demo-neutral-text-weak)', fontFamily: "'Geist Mono', monospace" }}>
          {timestamp}
        </span>
      </div>
      <button
        type="button"
        className="inline-flex h-[var(--uc-demo-size-lg)] w-full shrink-0 items-center justify-center rounded-[var(--uc-demo-radius-full)] px-[var(--uc-demo-space-200)] text-sm font-medium sm:w-auto"
        style={{
          backgroundColor: 'var(--uc-demo-neutral-bg-strong)',
          color: 'var(--uc-demo-neutral-text-strong)',
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
}
