import { useEffect, useRef, useState, type RefObject } from "react";
import { useInView, useReducedMotion } from "motion/react";

const START_DELAY_MS = 1500;
const BASE_INTERVAL_MS = 28;
const JITTER_MS = 17;
const PAUSE_CHARS = new Set([",", ".", ":", ";"]);
const PAUSE_EXTRA_MS = 120;
const PAUSE_JITTER_MS = 130;
/** Occasional longer "thinking" pause, roughly 1 in 25 characters — more
 * frequent than the code-editor version since this is a single short
 * sentence, not a long snippet, so a pause or two reads as natural rather
 * than sparse. */
const THINKING_PAUSE_CHANCE = 1 / 25;
const THINKING_PAUSE_MS = 150;
const THINKING_PAUSE_JITTER_MS = 150;

function nextDelay(char: string): number {
  let delay = BASE_INTERVAL_MS + Math.random() * JITTER_MS;
  if (PAUSE_CHARS.has(char)) {
    delay += PAUSE_EXTRA_MS + Math.random() * PAUSE_JITTER_MS;
  }
  if (Math.random() < THINKING_PAUSE_CHANCE) {
    delay += THINKING_PAUSE_MS + Math.random() * THINKING_PAUSE_JITTER_MS;
  }
  return delay;
}

export interface UseTypewriterResult {
  /** Number of characters revealed so far, into the flattened `fullText`. */
  revealedCount: number;
  /** True once START_DELAY_MS has elapsed and typing has begun. */
  hasStartedTyping: boolean;
  /** True once every character has been revealed. */
  isDone: boolean;
}

/**
 * Drives a character-by-character typing reveal: waits for `rootRef` to
 * scroll into view, pauses START_DELAY_MS (so the terminal chrome shows
 * first), then reveals `fullText` one character at a time with non-linear
 * per-character timing (small jitter, extra pauses after punctuation,
 * occasional longer "thinking" pauses) so the cadence reads as a person
 * typing rather than a fixed-interval mechanical reveal. Runs once — does
 * not reset/retype if the element scrolls out and back into view.
 */
export function useTypewriter(
  rootRef: RefObject<Element | null>,
  fullText: string,
): UseTypewriterResult {
  const isInView = useInView(rootRef, { once: true, amount: 0.4 });
  const shouldReduceMotion = useReducedMotion();
  const [revealedCount, setRevealedCount] = useState(0);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isInView) return;

    if (shouldReduceMotion) {
      const id = setTimeout(() => {
        setHasStartedTyping(true);
        setRevealedCount(fullText.length);
      }, 0);
      return () => clearTimeout(id);
    }

    const startTimeout = setTimeout(() => {
      setHasStartedTyping(true);

      let count = 0;
      const revealNext = () => {
        count += 1;
        setRevealedCount(count);
        if (count >= fullText.length) return;
        const delay = nextDelay(fullText[count - 1]);
        timeoutRef.current = setTimeout(revealNext, delay);
      };
      revealNext();
    }, START_DELAY_MS);

    return () => {
      clearTimeout(startTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // fullText is fixed content for this component's lifetime; only isInView/shouldReduceMotion should retrigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, shouldReduceMotion]);

  return {
    revealedCount,
    hasStartedTyping,
    isDone: revealedCount >= fullText.length,
  };
}
