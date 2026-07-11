import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Eye } from 'pixelarticons/react/Eye';
import '@/styles/undercurrent-demo.css';
import UcAlert from './UcAlert';
import UcButton from './UcButton';
import UcCard from './UcCard';
import UcChip from './UcChip';
import UcDynamicBadge from './UcDynamicBadge';
import UcNote from './UcNote';
import UcProgressTracker from './UcProgressTracker';
import type { UcColorVariant } from './types';

const VARIANTS: { value: UcColorVariant; label: string }[] = [
  { value: 'highlight', label: 'Highlight' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'danger', label: 'Danger' },
];

export default function UndercurrentSandbox() {
  const [variant, setVariant] = useState<UcColorVariant>('highlight');
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="uc-demo flex flex-col items-center gap-4 pt-16">
      <div className="flex items-center gap-4">
        {VARIANTS.map((option) => {
          const isActive = option.value === variant;
          return (
            <motion.button
              key={option.value}
              layout
              type="button"
              onClick={() => setVariant(option.value)}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-sm tracking-[-0.14px] transition-colors"
              style={{
                backgroundColor: `color-mix(in srgb, var(--uc-demo-swatch-${option.value}-bg) ${isActive ? 75 : 25}%, transparent)`,
                color: `var(--uc-demo-swatch-${option.value}-text)`,
              }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.span
                    layout
                    className="inline-flex"
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.6, width: 0 }}
                    animate={{ opacity: 1, scale: 1, width: 16 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.6, width: 0 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    <Eye width={16} height={16} />
                  </motion.span>
                )}
              </AnimatePresence>
              <span>{option.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="uc-demo bg-white dark:bg-neutral-900 w-full rounded-xl border p-6" data-uc-variant={variant} style={{ borderColor: 'var(--uc-demo-active-border-main)' }}>
        <div className="flex flex-col items-center gap-6">
          <UcNote>This is a note, a string of text that may contain a link action</UcNote>
          <div className="flex w-full flex-col items-stretch gap-6 sm:flex-row sm:items-start">
            <div className="flex min-w-0 flex-1 flex-col gap-6 sm:w-1/2">
              <div className="flex items-center gap-4">
                <UcDynamicBadge className="min-w-0 flex-1" primaryInfo="Deploying" secondaryInfo="Installing OS ..." />
                <UcChip>New</UcChip>
                <UcChip>Watched</UcChip>
              </div>
              <UcProgressTracker value={25} />
              <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <UcButton variant="primary">Primary</UcButton>
                <UcButton variant="secondary">Secondary</UcButton>
              </div>
            </div>
            <UcCard
              title="Important stat"
              headlineValue="75%"
              headlineDetail="4 vCPUs avg"
              trend="↗ +20%"
              stats={[
                { label: 'User', value: '59%' },
                { label: 'System', value: '18%' }
              ]}
              footerNote="This is not a note in the footer"
            />
          </div>
          <UcAlert
            title="Checkout the new version of Projects"
            body="This is a message to the user in an effort to inform them about something"
            dismissLabel="Dismiss"
          />
        </div>
      </div>
    </div>
  );
}
