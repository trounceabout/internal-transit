import { Info } from 'lucide-react';

interface UcCardStat {
  label: string;
  value: string;
}

interface UcCardProps {
  title: string;
  headlineValue: string;
  headlineDetail: string;
  trend: string;
  stats: UcCardStat[];
  footerNote: string;
}

/* Visual clone of Undercurrent's Card, shown here with the same "Important
   stat" demo content used in the Figma reference: a header title, a large
   highlighted stat with supporting detail/trend text, a row of smaller
   stats, and a footer note row. The real Card is a generic container (the
   header/content/footer regions are actually separate composable
   components); this demo bakes the one layout it needs directly into a
   single component since nothing else on the site needs a reusable Card. */
export default function UcCard({
  title,
  headlineValue,
  headlineDetail,
  trend,
  stats,
  footerNote,
}: UcCardProps) {
  return (
    <div
      className="flex min-w-0 flex-1 flex-col rounded-[var(--uc-demo-radius-md)] sm:w-1/2"
      style={{ backgroundColor: 'var(--uc-demo-neutral-bg-weak)' }}
    >
      <div
        className="flex flex-1 flex-col rounded-[var(--uc-demo-radius-md)] border"
        style={{
          backgroundColor: 'var(--uc-demo-neutral-bg-main)',
          borderColor: 'var(--uc-demo-neutral-border-weak)',
        }}
      >
        <div className="px-[var(--uc-demo-space-200)] pt-[var(--uc-demo-space-200)] leading-none">
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--uc-demo-neutral-text-main)' }}
          >
            {title}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-[var(--uc-demo-space-150)] p-[var(--uc-demo-space-200)]">
          <div className="flex items-center gap-[var(--uc-demo-space-100)]">
            <span
              className="tracking-tight"
              style={{
                color: 'var(--uc-demo-active-text-main)',
                fontSize: '40px',
                lineHeight: '38px',
              }}
            >
              {headlineValue}
            </span>
            <div className="flex flex-col gap-0">
              <span className="text-sm" style={{ color: 'var(--uc-demo-neutral-text-weak)', fontFamily: "'Geist Mono', monospace" }}>
                {headlineDetail}
              </span>
              <span className="text-sm" style={{ color: 'var(--uc-demo-neutral-text-weak)', fontFamily: "'Geist Mono', monospace" }}>
                {trend}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {stats.map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-xs" style={{ color: 'var(--uc-demo-neutral-text-weak)' }}>
                    •
                  </span>
                )}
                <span className="text-xs" style={{ color: 'var(--uc-demo-neutral-text-weak)' }}>
                  {stat.label}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--uc-demo-neutral-text-main)' }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-[var(--uc-demo-space-100)] px-[var(--uc-demo-space-200)] py-[var(--uc-demo-space-150)]">
          <Info
            size={16}
            className="shrink-0"
            style={{ color: 'var(--uc-demo-active-text-main)' }}
          />
          <span className="text-sm leading-6" style={{ color: 'var(--uc-demo-active-text-main)' }}>
            {footerNote}
          </span>
        </div>
      </div>
    </div>
  );
}
