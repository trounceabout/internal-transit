import { Ship } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UcDynamicBadgeProps {
  primaryInfo: string;
  secondaryInfo: string;
  className?: string;
}

/* Visual clone of Undercurrent's DynamicBadge. The real component expands
   on hover to reveal its text (collapsed = just the icon); this demo shows
   the expanded state permanently since hover-to-reveal doesn't add anything
   worth explaining in a static case-study screenshot/demo.

   Uses lucide-react's Ship icon — a scoped exception to this site's usual
   pixelarticons icon convention. This one component (plus UcNote/UcAlert,
   which use lucide's Info/Flag) intentionally clones specific icons the
   real Undercurrent design system uses in its Figma reference; it's not a
   precedent for using Lucide elsewhere on the site. */
export default function UcDynamicBadge({ primaryInfo, secondaryInfo, className }: UcDynamicBadgeProps) {
  return (
    <div
      className={cn(
        'flex h-[var(--uc-demo-size-md)] min-w-0 max-w-full items-center gap-[var(--uc-demo-space-100)] rounded-[var(--uc-demo-radius-full)] border-2 p-[var(--uc-demo-space-100)]',
        className,
      )}
      style={{
        backgroundColor: 'var(--uc-demo-neutral-bg-main)',
        borderColor: 'var(--uc-demo-active-border-weak)',
        boxShadow: '0px 2px 2px rgba(0,0,0,0.15), 0px 0px 0.25px rgba(0,0,0,0.25)',
      }}
    >
      <Ship
        size={16}
        className="shrink-0"
        style={{ color: 'var(--uc-demo-active-icon-main)' }}
      />
      <span
        className="shrink-0 text-sm font-medium whitespace-nowrap"
        style={{ color: 'var(--uc-demo-neutral-text-main)' }}
      >
        {primaryInfo}
      </span>
      <span
        className="min-w-0 flex-1 truncate text-[13px]"
        style={{ color: 'var(--uc-demo-neutral-text-medium)', fontFamily: "'Geist Mono', monospace" }}
      >
        {secondaryInfo}
      </span>
    </div>
  );
}
