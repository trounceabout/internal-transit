import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'motion/react';
import '@/styles/undercurrent-demo.css';
import UcErrorCard from './UcErrorCard';
import UcFieldRow from './UcFieldRow';
import UcRetryBanner from './UcRetryBanner';
import UcTimeline from './UcTimeline';
import { History, XCircle, Ship, Tag } from 'lucide-react';
import { MEDIA_FRAME_SHADOW } from '@/lib/media';

/* Static mock content only, for now — no light/dark stacking or drag yet
   (that's added in later build stages). Hardcoded to the "danger" color
   variant since this island has no working color-variant switcher (see
   plan: the first sandbox already told that story); this is simply what a
   real server-reboot error state looks like. */
function MockErrorUI() {
  return (
    <UcErrorCard title="Server unable to reboot" dismissLabel="Dismiss">
      <UcFieldRow
        fields={[
          { icon: History, label: 'Time', value: '10/31/25 11:30:00 PM' },
          { icon: XCircle, label: 'Level', value: 'Error' },
          { icon: Ship, label: 'Server', value: 'cold-parent-duo.metalseed.internal' },
          { icon: Tag, label: 'Category', value: 'Server Ops' },
        ]}
      />
      <div className="flex flex-col gap-1">
        <span className="text-xs" style={{ color: 'var(--uc-demo-neutral-text-weak)' }}>
          Elapsed time
        </span>
        <span className="text-sm" style={{ color: 'var(--uc-demo-neutral-text-main)' }}>
          00:16 secs
        </span>
      </div>
      <div className="flex flex-col gap-[var(--uc-demo-space-200)]">
        <div className="relative">
          <UcRetryBanner
            title="Reboot unable to complete"
            durationLabel="2 secs"
            timestamp="10/31/24 11:30:00 PM"
            actionLabel="Retry reboot"
          />
          {/* Connects the retry banner down into the timeline's first
              entry — danger-red, since it's leading out of an error state.
              Anchored to the banner's own box (top-full = right where the
              banner ends). Height = the flex gap (--uc-demo-space-200) plus
              the first timeline item's own top padding and half its icon
              height (space-100 + 8px), so this reaches the icon's actual
              vertical center, not just the gap between the two components. */}
          <div
            className="absolute top-full left-2 w-px -translate-x-1/2"
            style={{
              height: 'calc(var(--uc-demo-space-200) + var(--uc-demo-space-100) + 8px)',
              backgroundColor: 'var(--uc-demo-danger-border-main)',
            }}
          />
        </div>
        <UcTimeline
          items={[
            { status: 'success', label: 'Server has been started', duration: '2 secs', timestamp: '10/31/25 11:30:19 PM' },
            { status: 'success', label: 'Starting server', duration: '6 secs', timestamp: '10/31/25 11:30:17 PM' },
            { status: 'success', label: 'Starting server', duration: '0 secs', timestamp: '10/31/25 11:30:11 PM' },
            { status: 'success', label: 'Server has been stopped', duration: '0 secs', timestamp: '10/31/25 11:30:11 PM' },
          ]}
        />
      </div>
    </UcErrorCard>
  );
}

export default function ThemeRevealSandbox() {
  const frameRef = useRef<HTMLDivElement>(null);

  /* Single source of truth for the reveal position, as a percentage (0-100)
     of the frame's width — not pixels, so it stays meaningful across
     resizes (see Stage 7) and doesn't need to know the frame's width to
     have a sensible starting value. A plain useMotionValue (not useState)
     so drag updates never trigger a React re-render — motion writes
     straight to the DOM on every pointer-move frame instead. */
  const percent = useMotionValue(50);

  /* The dark copy's clip-path, derived from percent. inset(top right
     bottom left) — clipping back from the right edge by (100 - percent)%
     reveals more of the light copy underneath as percent decreases. */
  const clipPath = useTransform(percent, (value) => `inset(0 ${100 - value}% 0 0)`);

  /* The handle's own horizontal position as a percentage-based left offset,
     matching how the clip-path is expressed — keeps both derived from the
     same single percent value rather than maintaining the handle's pixel
     position separately and syncing the two. */
  const handleLeft = useTransform(percent, (value) => `${value}%`);

  /* aria-valuenow needs to be a real, current DOM attribute for assistive
     tech to read — a plain useState, not the `percent` motion value itself
     (which deliberately bypasses React's render cycle for drag). This is
     fine performance-wise because keyboard nudges are discrete, low-
     frequency events, unlike the continuous per-frame updates drag
     produces — re-rendering once per keypress is not the same cost as
     re-rendering on every pointer-move. */
  const [ariaValue, setAriaValue] = useState(50);

  function setPercent(nextPercent: number) {
    const clamped = Math.min(100, Math.max(0, nextPercent));
    percent.set(clamped);
    setAriaValue(Math.round(clamped));
  }

  function handlePan(_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    const frame = frameRef.current;
    if (!frame) return;

    const { left, width } = frame.getBoundingClientRect();
    setPercent(((info.point.x - left) / width) * 100);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const current = percent.get();
    const step = 5;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        setPercent(current - step);
        break;
      case 'ArrowRight':
        event.preventDefault();
        setPercent(current + step);
        break;
      case 'Home':
        event.preventDefault();
        setPercent(0);
        break;
      case 'End':
        event.preventDefault();
        setPercent(100);
        break;
    }
  }

  return (
    <div
      ref={frameRef}
      className="uc-demo relative w-full overflow-hidden rounded-lg select-none"
      style={{ boxShadow: MEDIA_FRAME_SHADOW }}
    >
      {/* Light copy sits underneath, unclipped — always fully rendered. */}
      <div className="uc-demo light w-full p-6" data-uc-variant="danger">
        <MockErrorUI />
      </div>

      {/* Dark copy sits on top, clipped back from the right edge to reveal
          the light copy underneath — clipPath is a motion value, so it
          updates via direct DOM writes on every drag frame, bypassing
          React's render cycle entirely (the standard reason motion values
          exist, per motion/react's own docs). */}
      <motion.div
        className="uc-demo dark absolute inset-0 z-10 w-full p-6"
        data-uc-variant="danger"
        style={{ clipPath }}
      >
        <MockErrorUI />
      </motion.div>

      {/* The drag handle — a full-height connecting line plus a pill-shaped
          grip in the middle. Uses onPan (not drag="x") deliberately: drag="x"
          applies its own transform: translateX(...) to track the gesture,
          which fought with this handle's `left` percentage positioning —
          the two offsets compounded, so the handle visually drifted away
          from the actual clip-path position the longer you dragged. onPan
          reports pointer movement without motion touching the element's
          transform at all, so `left: handleLeft` (driven by the same
          `percent` value as the clip-path) is the only thing moving it —
          one source of truth, no compounding. select-none + touch-none
          stop the browser from treating the drag as a text-selection or
          page-scroll gesture. */}
      <motion.div
        onPan={handlePan}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-label="Reveal light or dark theme"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={ariaValue}
        tabIndex={0}
        className="uc-demo absolute inset-y-0 z-20 w-1 -translate-x-1/2 cursor-ew-resize touch-none select-none focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ backgroundColor: 'var(--uc-demo-handle-color)', left: handleLeft, outlineColor: 'var(--uc-demo-handle-color)' }}
      >
        <div
          className="absolute top-1/2 left-1/2 h-16 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: 'var(--uc-demo-handle-color)' }}
        />
      </motion.div>
    </div>
  );
}
