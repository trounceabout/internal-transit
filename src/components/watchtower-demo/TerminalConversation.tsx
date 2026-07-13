import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { RobotFacePleased } from "pixelarticons/react/RobotFacePleased";
import { RobotFaceWeirdHappy } from "pixelarticons/react/RobotFaceWeirdHappy";
import "@/styles/watchtower-demo-editor.css";
import { PROMPT_TEXT, RESPONSE_BLOCKS, type ResponseBlock } from "./conversationContent";
import { useStreamingReveal } from "./useStreamingReveal";
import { useTypewriter } from "./useTypewriter";

/** How often the working icon swaps between the two robot faces. */
const ICON_SWAP_MS = 500;

/** Rotating "working" verbs — matches Claude Code's own randomized status
 * line vocabulary (Galloping, Pondering, etc.), just enough variety to not
 * repeat within one run. */
const WORKING_VERBS = ["Galloping", "Percolating", "Noodling", "Marinating"];
/** Past-tense verbs for the completed summary line ("Sautéed for..."),
 * matching Claude Code's own habit of using an unrelated done-verb rather
 * than the past tense of whatever verb was showing while it worked. */
const DONE_VERBS = ["Sautéed", "Simmered", "Whisked", "Kneaded"];

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

/**
 * Live "working" status line while the response streams (an alternating
 * robot-face icon, rotating verb, live elapsed time + climbing fake token
 * count), then freezes into a static grayed-out "done" summary once
 * `isDone` flips — matching Claude Code's own status line, which never
 * disappears, just settles into a dimmed record of how long the turn took.
 */
function WorkingIndicator({
  isDone,
  reduceMotion,
}: {
  isDone: boolean;
  reduceMotion: boolean;
}) {
  const [verb] = useState(
    () => WORKING_VERBS[Math.floor(Math.random() * WORKING_VERBS.length)],
  );
  const [doneVerb] = useState(
    () => DONE_VERBS[Math.floor(Math.random() * DONE_VERBS.length)],
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [showPleased, setShowPleased] = useState(true);

  useEffect(() => {
    if (isDone) return;
    const start = Date.now();
    const id = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
      // Fake token count that climbs unevenly, like a real streaming counter.
      setTokens((prev) => prev + 15 + Math.floor(Math.random() * 40));
    }, 400);
    return () => clearInterval(id);
    // isDone stops the interval for good once true — elapsedSeconds/tokens
    // simply hold whatever their last tick left them at, which is exactly
    // the frozen "done" value the summary below reads.
  }, [isDone]);

  useEffect(() => {
    if (isDone || reduceMotion) return;
    const id = setInterval(() => setShowPleased((prev) => !prev), ICON_SWAP_MS);
    return () => clearInterval(id);
  }, [isDone, reduceMotion]);

  const WorkingIcon = showPleased ? RobotFacePleased : RobotFaceWeirdHappy;

  if (isDone) {
    return (
      <p
        className="my-2 flex items-center gap-1.5 font-mono text-[13px]"
        style={{ color: "var(--wt-editor-text-muted)" }}
      >
        <RobotFacePleased aria-hidden="true" width={16} height={16} />
        {doneVerb} for {formatDuration(elapsedSeconds)}
      </p>
    );
  }

  return (
    <p
      className="my-2 flex items-center gap-1.5 font-mono text-[13px]"
      style={{ color: "var(--wt-editor-text-muted)" }}
    >
      <WorkingIcon
        aria-hidden="true"
        width={16}
        height={16}
        style={{ color: "var(--wt-editor-accent)" }}
      />
      {verb}&hellip; ({elapsedSeconds}s &middot; &darr; {tokens} tokens)
    </p>
  );
}

function TrafficLights() {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#febc2e" }} />
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#28c840" }} />
    </div>
  );
}

function BlinkingCursor({ show, reduceMotion }: { show: boolean; reduceMotion: boolean }) {
  if (!show) return null;
  return (
    <motion.span
      aria-hidden="true"
      className="ml-[1px] inline-block h-[15px] w-[7px] translate-y-[2px] align-middle"
      style={{ backgroundColor: "var(--wt-editor-cursor)" }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
      transition={
        reduceMotion ? undefined : { duration: 1, repeat: Infinity, times: [0, 0.5, 0.51, 1] }
      }
    />
  );
}

function ResponseBlockView({
  block,
  wordsRevealed,
}: {
  block: ResponseBlock;
  wordsRevealed: number;
}) {
  if (wordsRevealed < 0) return null;

  if (block.type === "diff") {
    const visibleLines = block.lines.slice(0, wordsRevealed);
    return (
      <div className="my-3">
        <p className="mb-1 font-mono text-[13px]" style={{ color: "var(--wt-editor-text-strong)" }}>
          <span style={{ color: "var(--wt-editor-diff-add-text)" }}>&bull; </span>
          <span className="font-semibold">Update</span>
          <span style={{ color: "var(--wt-editor-text-muted)" }}>({block.filePath})</span>
        </p>
        <p
          className="mb-2 pl-4 font-mono text-[12px]"
          style={{ color: "var(--wt-editor-text-muted)" }}
        >
          &#8318; Added {block.addedCount} line{block.addedCount === 1 ? "" : "s"}, removed{" "}
          {block.removedCount} line{block.removedCount === 1 ? "" : "s"}
        </p>
        <div className="overflow-hidden font-mono text-[12px] leading-6">
          {visibleLines.map((line, i) => {
            const isAdd = line.kind === "add";
            const isRemove = line.kind === "remove";
            return (
              <div
                key={i}
                className="flex"
                style={{
                  backgroundColor: isAdd
                    ? "var(--wt-editor-diff-add-bg)"
                    : isRemove
                      ? "var(--wt-editor-diff-remove-bg)"
                      : undefined,
                }}
              >
                <span
                  className="w-10 shrink-0 pl-3 text-right select-none"
                  style={{ color: "var(--wt-editor-text-muted)" }}
                >
                  {line.lineNumber}
                </span>
                <span
                  className="w-5 shrink-0 text-center select-none"
                  style={{
                    color: isAdd
                      ? "var(--wt-editor-diff-add-text)"
                      : isRemove
                        ? "var(--wt-editor-diff-remove-text)"
                        : "var(--wt-editor-text-muted)",
                  }}
                >
                  {isAdd ? "+" : isRemove ? "-" : ""}
                </span>
                <span
                  className="flex-1 pr-3 whitespace-pre"
                  style={{
                    color: isAdd
                      ? "var(--wt-editor-diff-add-text)"
                      : isRemove
                        ? "var(--wt-editor-diff-remove-text)"
                        : "var(--wt-editor-text-muted)",
                  }}
                >
                  {line.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const words = block.text.split(/\s+/).filter(Boolean);
  const visibleText = words.slice(0, wordsRevealed).join(" ");

  if (block.type === "heading") {
    return (
      <p
        className="mt-4 mb-1 font-mono text-[13px] font-semibold first:mt-0"
        style={{ color: "var(--wt-editor-text-strong)" }}
      >
        {visibleText}
      </p>
    );
  }

  if (block.type === "bullet") {
    return (
      <p
        className="my-1 pl-4 font-mono text-[13px] leading-6"
        style={{ color: "var(--wt-editor-text-main)" }}
      >
        <span style={{ color: "var(--wt-editor-accent)" }}>&bull; </span>
        {visibleText}
      </p>
    );
  }

  return (
    <p className="my-2 font-mono text-[13px] leading-6" style={{ color: "var(--wt-editor-text-main)" }}>
      {visibleText}
    </p>
  );
}

export default function TerminalConversation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollbackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = Boolean(useReducedMotion());

  const {
    revealedCount: promptRevealedCount,
    hasStartedTyping: promptStarted,
    isDone: promptDone,
  } = useTypewriter(rootRef, PROMPT_TEXT);

  const { revealedPerBlock, isDone: responseDone } = useStreamingReveal(
    RESPONSE_BLOCKS,
    promptDone,
  );

  const visiblePrompt = PROMPT_TEXT.slice(0, promptRevealedCount);

  // Real terminal/chat behavior: scrollback is bottom-anchored, growing
  // content pushes older lines up and out of view rather than the frame
  // resizing to fit. Re-runs on every reveal tick (prompt typing and
  // response streaming both drive this via their changing dependencies).
  useEffect(() => {
    const el = scrollbackRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [promptRevealedCount, revealedPerBlock]);

  return (
    <div
      ref={rootRef}
      className="wt-editor relative mt-10 h-145 w-full overflow-hidden rounded-lg border"
      style={{ borderColor: "var(--wt-editor-border)" }}
    >
      <div className="flex h-full flex-col pt-10 pr-10 pl-10">
        <div
          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-xl border border-b-0"
          style={{
            backgroundColor: "var(--wt-editor-bg)",
            borderColor: "var(--wt-editor-border)",
          }}
        >
          <div
            className="flex shrink-0 items-center gap-3 border-b px-4 py-3"
            style={{ borderColor: "var(--wt-editor-border)" }}
          >
            <TrafficLights />
            <span className="text-xs" style={{ color: "var(--wt-editor-text-muted)" }}>
              project-watchtower
            </span>
          </div>

          {/* Scrollback — only the SUBMITTED prompt + streamed response
             live here; the in-progress typed prompt renders in the input
             row below until it's "submitted" (promptDone). Bottom-anchored
             via the scroll effect above, so new content pushes old content
             up and out rather than growing the frame. */}
          <div
            ref={scrollbackRef}
            className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-5 py-4 font-mono"
          >
            {promptDone && (
              <p
                className="-mx-5 mb-3 px-5 py-2 font-mono text-[13px] leading-6"
                style={{
                  backgroundColor: "var(--wt-editor-prompt-bg)",
                  color: "var(--wt-editor-text-strong)",
                }}
              >
                <span style={{ color: "var(--wt-editor-accent)" }}>&#10095; </span>
                {PROMPT_TEXT}
              </p>
            )}

            {promptDone &&
              RESPONSE_BLOCKS.map((block, i) => (
                <ResponseBlockView key={i} block={block} wordsRevealed={revealedPerBlock[i]} />
              ))}
          </div>

          {/* Working status row — its own row above the input, not part of
             the scrollback. Shows a live spinner/verb/timer/token count
             while the response streams, then freezes into a static grayed
             summary once done (never disappears entirely). */}
          {promptDone && (
            <div className="shrink-0 px-5">
              <WorkingIndicator isDone={responseDone} reduceMotion={shouldReduceMotion} />
            </div>
          )}

          {/* Input row — shows the prompt typing in place, character by
             character, until it's done; then clears back to an idle
             prompt marker (the "submitted" prompt has already moved to
             the scrollback above by that point). */}
          <div
            className="flex shrink-0 items-center gap-2 border-t px-4 py-2.5 font-mono text-[13px]"
            style={{ borderColor: "oklch(57.8% 0.103 227deg)" }}
          >
            <span style={{ color: "oklch(78.2% 0.00782 261deg)" }}>&#10095;</span>
            {!promptDone && promptStarted && (
              <span style={{ color: "var(--wt-editor-text-strong)" }}>
                {visiblePrompt}
                <BlinkingCursor show reduceMotion={shouldReduceMotion} />
              </span>
            )}
            {promptDone && (
              <span style={{ color: "var(--wt-editor-text-muted)" }}>
                {responseDone ? "Full send it" : ""}
              </span>
            )}
          </div>

          <div
            className="flex shrink-0 items-center gap-2 border-t px-4 py-2 text-[11px]"
            style={{
              borderColor: "oklch(57.8% 0.103 227deg)",
              color: "var(--wt-editor-text-muted)",
            }}
          >
            <span>
              [<span style={{ color: "var(--wt-editor-model-text)" }}>Sonnet 5</span>]
            </span>
            <span>|</span>
            <span style={{ color: "oklch(53.4% 0.063 186deg)" }}>⏸ plan mode on</span>
            <span>|</span>
            <span>📁 wallaby</span>
            <span>|</span>
            <span>🌿 feat/watchtower</span>
          </div>
        </div>
      </div>
    </div>
  );
}
