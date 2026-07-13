import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { ResponseBlock } from "./conversationContent";

const CHUNK_INTERVAL_MS = 25;
const CHUNK_JITTER_MS = 20;
/** Extra pause before a new block starts, mimicking the visible beat
 * between paragraphs/bullets in real streamed responses. */
const BLOCK_PAUSE_MS = 150;
const BLOCK_PAUSE_JITTER_MS = 100;
const MIN_WORDS_PER_CHUNK = 1;
const MAX_WORDS_PER_CHUNK = 4;

/** Splits a block into the ordered list of reveal steps within it — words
 * for prose blocks, whole lines for diff blocks (revealing a diff
 * word-by-word would look wrong; each line lands as a unit). */
function blockUnitCount(block: ResponseBlock): number {
  if (block.type === "diff") return block.lines.length;
  return block.text.split(/\s+/).filter(Boolean).length;
}

export interface UseStreamingRevealResult {
  /** For each block, how many words (or diff lines) are currently revealed. -1 means the block hasn't started yet. */
  revealedPerBlock: number[];
  isDone: boolean;
}

/**
 * Reveals `blocks` in order, word-by-word within prose blocks and
 * line-by-line within diff blocks, in fast randomized chunks rather than
 * one-at-a-time — mimics how streamed LLM output actually renders (bursts
 * of a few tokens at once), which reads as much faster than character-by-
 * character typing for the same amount of content. Starts only once
 * `start` becomes true (the caller sequences this after the prompt line
 * finishes) and runs once.
 */
export function useStreamingReveal(
  blocks: ResponseBlock[],
  start: boolean,
): UseStreamingRevealResult {
  const shouldReduceMotion = useReducedMotion();
  const [revealedPerBlock, setRevealedPerBlock] = useState<number[]>(() =>
    blocks.map(() => -1),
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!start || hasStartedRef.current) return;
    hasStartedRef.current = true;

    const totalUnitsPerBlock = blocks.map(blockUnitCount);

    if (shouldReduceMotion) {
      const id = setTimeout(() => {
        setRevealedPerBlock(totalUnitsPerBlock.map((n) => n));
      }, 0);
      return () => clearTimeout(id);
    }

    let blockIndex = 0;
    let unitsRevealed = 0;
    const progress: number[] = blocks.map(() => -1);

    const revealNext = () => {
      if (blockIndex >= blocks.length) return;

      const block = blocks[blockIndex];
      const totalUnits = totalUnitsPerBlock[blockIndex];
      const isDiffBlock = block.type === "diff";

      const chunkSize = isDiffBlock
        ? 1
        : Math.min(
            totalUnits - unitsRevealed,
            MIN_WORDS_PER_CHUNK +
              Math.floor(Math.random() * (MAX_WORDS_PER_CHUNK - MIN_WORDS_PER_CHUNK + 1)),
          );

      unitsRevealed += chunkSize;
      progress[blockIndex] = unitsRevealed;
      setRevealedPerBlock([...progress]);

      if (unitsRevealed >= totalUnits) {
        blockIndex += 1;
        unitsRevealed = 0;
        if (blockIndex >= blocks.length) return;
        const delay = BLOCK_PAUSE_MS + Math.random() * BLOCK_PAUSE_JITTER_MS;
        timeoutRef.current = setTimeout(revealNext, delay);
        return;
      }

      const delay = CHUNK_INTERVAL_MS + Math.random() * CHUNK_JITTER_MS;
      timeoutRef.current = setTimeout(revealNext, delay);
    };

    revealNext();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [start, shouldReduceMotion, blocks]);

  const isDone =
    revealedPerBlock.length > 0 &&
    revealedPerBlock.every((count, i) => count >= blockUnitCount(blocks[i]));

  return { revealedPerBlock, isDone };
}
