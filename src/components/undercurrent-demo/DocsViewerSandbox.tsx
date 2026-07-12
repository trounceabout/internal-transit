import { Tabs } from '@base-ui/react/tabs';
import '@/styles/undercurrent-demo.css';
import { DOCS_CONTENT } from './docsContent';
import type { DocsTabId } from './types';

const TABS: { value: DocsTabId; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'theming', label: 'Theming' },
  { value: 'development', label: 'Development' },
  { value: 'component-standards', label: 'Component standards' },
  { value: 'versioning', label: 'Versioning' },
];

/* Storybook-style docs viewer for the "Make the system easier to use and
   trust" subsection — a tabbed card showing redacted/trimmed content from
   the real Undercurrent Storybook docs. Follows the site's actual light/
   dark theme (not forced, unlike ThemeRevealSandbox's two halves) — the
   global inline-`code` styling in global.css keys off the page's real
   .dark class on <html>, so forcing this card to a fixed theme independent
   of that class caused code pills to render with the wrong background/
   text-color combination whenever the page's real theme disagreed with the
   card's forced one. No data-uc-variant here: this content has no inherent
   color category, so nothing borrows the variant-redirection system used
   by the other two islands.

   Outer frame + inset card follows the same "overhang" pattern as
   ThemeRevealSandbox: an outer neutral frame, with the actual content card
   padded away from the top/left/right (pt-10/px-10) but flush with the
   frame's bottom edge (no bottom padding, square bottom corners) — reads as
   the card "poking past" the frame's own boundary, matching the Figma
   reference, rather than sitting centered with even breathing room on all
   sides.

   Uses @base-ui/react/tabs directly (not a generic src/components/ui/tabs.tsx
   wrapper) — same reasoning as every other component in this folder: this is
   a one-off visual clone scoped to this case study, not a reusable site
   primitive. Unlike src/components/ui/button.tsx (which wraps Base UI's
   Button because Button IS reused site-wide), there's no second consumer
   for a docs-tabs component today. */
export default function DocsViewerSandbox() {
  return (
    <div
      className="uc-demo relative mt-10 h-[580px] w-full overflow-hidden rounded-lg border"
      style={{ borderColor: 'oklch(35.9% 0.0137 286deg)' }}
    >
      <div className="flex h-full flex-col pt-10 pr-10 pl-10">
        <Tabs.Root
          defaultValue="overview"
          className="flex min-h-0 flex-1 flex-col rounded-t-lg border border-b-0"
          style={{
            backgroundColor: 'var(--uc-demo-neutral-bg-main)',
            borderColor: 'var(--uc-demo-neutral-border-weak)',
          }}
        >
          <Tabs.List
            className="relative flex shrink-0 overflow-x-auto rounded-t-lg px-6"
            style={{ borderBottom: '1px solid var(--uc-demo-neutral-border-weak)' }}
          >
            {TABS.map((tab) => (
              <Tabs.Tab
                key={tab.value}
                value={tab.value}
                className="shrink-0 cursor-pointer px-4 py-3 text-sm font-medium whitespace-nowrap outline-none"
                style={{ color: 'var(--uc-demo-neutral-text-main)' }}
              >
                {tab.label}
              </Tabs.Tab>
            ))}
            {/* Base UI's indicator only supplies the active tab's measured
                position/size as CSS custom properties (--active-tab-left,
                --active-tab-width, etc.) — it doesn't position itself.
                Translating by --active-tab-left and sizing by
                --active-tab-width is what actually places the underline. */}
            <Tabs.Indicator
              className="absolute bottom-0 left-0 h-0.5 transition-all duration-200"
              style={{
                backgroundColor: 'var(--uc-demo-neutral-text-main)',
                width: 'var(--active-tab-width)',
                transform: 'translateX(var(--active-tab-left))',
              }}
            />
          </Tabs.List>

          <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
            {TABS.map((tab) => (
              <Tabs.Panel key={tab.value} value={tab.value} keepMounted>
                {DOCS_CONTENT[tab.value]}
              </Tabs.Panel>
            ))}
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}
