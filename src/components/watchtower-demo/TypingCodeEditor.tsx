import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import "@/styles/watchtower-demo-editor.css";
import {
  CODE_SNIPPET,
  FILE_PATH,
  getTokenizedLines,
  type TokenizedLine,
} from "./typingCodeSnippet";
import { useTypewriter } from "./useTypewriter";

/**
 * Tracks the site's real light/dark state (the `.dark` class on
 * <html>, toggled by Footer.astro) — there's no React state for this
 * anywhere in the codebase to subscribe to, since the toggle is plain DOM
 * classList manipulation, so this reads it directly on mount and watches
 * for changes via MutationObserver.
 */
function useIsDarkTheme(): boolean {
  // Lazy initializer runs during render (not inside an effect), so the
  // very first client render already reflects the real theme instead of
  // flashing the default before an effect catches up. Guarded for SSR,
  // where `document` doesn't exist yet — BaseLayout.astro's inline script
  // already sets the .dark class before hydration, so this only runs
  // client-side anyway.
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

const INDENT_SIZE = 2;

function countLeadingIndent(line: string): number {
  const match = /^ */.exec(line);
  const spaces = match ? match[0].length : 0;
  return Math.floor(spaces / INDENT_SIZE);
}

const SNIPPET_LINES = CODE_SNIPPET.replace(/\n$/, "").split("\n");
const LINE_INDENTS = SNIPPET_LINES.map(countLeadingIndent);

/**
 * Strips the first `count` characters of leading whitespace from a
 * tokenized line. Indentation is rendered structurally (line-wrapper
 * padding + absolutely-positioned guide lines keyed off each line's
 * indent level), not via the literal space characters Shiki bakes into
 * each line's first token — those still need to exist for the typewriter's
 * character-count timing to match CODE_SNIPPET exactly, so they're
 * stripped here at render time rather than removed from the source.
 */
function stripLeadingWhitespace(tokens: TokenizedLine, count: number): TokenizedLine {
  if (count <= 0 || tokens.length === 0) return tokens;
  const [first, ...rest] = tokens;
  const stripped = first.text.slice(count);
  return stripped ? [{ ...first, text: stripped }, ...rest] : rest;
}

interface VisibleLine {
  lineNumber: number;
  indent: number;
  tokens: TokenizedLine;
  /** True for the single line currently mid-reveal — this is where the cursor renders. */
  isCurrentLine: boolean;
}

/**
 * Walks tokenLines against revealedCount (a character offset into the
 * flattened CODE_SNIPPET, newlines included) and returns only the lines
 * that should render, with the in-progress line's tokens trimmed to its
 * exact revealed character count. Single source of truth for "how much of
 * the snippet is visible right now" — everything downstream just renders
 * what this returns.
 */
function computeVisibleLines(
  tokenLines: TokenizedLine[],
  revealedCount: number,
): VisibleLine[] {
  const result: VisibleLine[] = [];
  let budget = revealedCount;

  for (let i = 0; i < tokenLines.length; i++) {
    if (budget <= 0) break;
    const line = tokenLines[i];
    const lineLength = line.reduce((sum, t) => sum + t.text.length, 0);
    const lineWithNewlineLength = lineLength + 1; // +1 for the \n joining this line to the next

    const indentChars = (LINE_INDENTS[i] ?? 0) * INDENT_SIZE;

    if (budget >= lineWithNewlineLength) {
      result.push({
        lineNumber: i + 1,
        indent: LINE_INDENTS[i] ?? 0,
        tokens: stripLeadingWhitespace(line, indentChars),
        isCurrentLine: false,
      });
      budget -= lineWithNewlineLength;
    } else {
      // Partially revealed — this is the current line, trim its tokens.
      const trimmed: TokenizedLine = [];
      let consumed = 0;
      for (const token of line) {
        if (consumed >= budget) break;
        const remaining = budget - consumed;
        if (token.text.length <= remaining) {
          trimmed.push(token);
          consumed += token.text.length;
        } else {
          trimmed.push({ ...token, text: token.text.slice(0, remaining) });
          consumed += remaining;
        }
      }
      // Cap indent stripping at what's actually been typed so far, so the
      // line's indentation visually "types in" rather than snapping to
      // full depth before the rest of the line has appeared.
      const strippableIndent = Math.min(indentChars, consumed);
      result.push({
        lineNumber: i + 1,
        indent: LINE_INDENTS[i] ?? 0,
        tokens: stripLeadingWhitespace(trimmed, strippableIndent),
        isCurrentLine: true,
      });
      budget = 0;
    }
  }

  return result;
}

export default function TypingCodeEditor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isDarkTheme = useIsDarkTheme();
  const [tokenLines, setTokenLines] = useState<{
    dark: TokenizedLine[];
    light: TokenizedLine[];
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTokenizedLines().then((lines) => {
      if (!cancelled) setTokenLines(lines);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const { revealedCount, hasStartedTyping, isDone } = useTypewriter(
    rootRef,
    CODE_SNIPPET,
  );

  // Dark and light are pre-tokenized separately (Shiki resolves each
  // token's color against its own theme at tokenization time) — line/
  // indent structure is identical between them, only the colors baked
  // into each token differ, so switching sets is enough to retheme.
  const visibleLines =
    tokenLines && hasStartedTyping
      ? computeVisibleLines(
          isDarkTheme ? tokenLines.dark : tokenLines.light,
          revealedCount,
        )
      : [];

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
            className="border-b px-5 py-3 text-sm italic"
            style={{
              borderColor: "var(--wt-editor-border)",
              color: "var(--wt-editor-text-muted)",
            }}
          >
            {FILE_PATH}
          </div>

          <div className="min-h-0 flex-1 overflow-hidden px-5 py-4 font-mono text-[13px] leading-6 whitespace-pre">
            {visibleLines.map((line) => (
              <CodeLine
                key={line.lineNumber}
                lineNumber={line.lineNumber}
                indent={line.indent}
                tokens={line.tokens}
                showCursor={line.isCurrentLine && !isDone}
                reduceMotion={Boolean(shouldReduceMotion)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeLine({
  lineNumber,
  indent,
  tokens,
  showCursor,
  reduceMotion,
}: {
  lineNumber: number;
  indent: number;
  tokens: TokenizedLine;
  showCursor: boolean;
  reduceMotion: boolean;
}) {
  return (
    <div className="flex">
      <span
        className="w-8 shrink-0 pr-4 text-right select-none"
        style={{ color: "var(--wt-editor-line-number)" }}
      >
        {lineNumber}
      </span>
      <span className="relative flex-1" style={{ paddingLeft: `${indent * 16}px` }}>
        {Array.from({ length: indent }).map((_, guideIndex) => (
          <span
            key={guideIndex}
            aria-hidden="true"
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${guideIndex * 16}px`,
              backgroundColor: "var(--wt-editor-wrap-guide)",
            }}
          />
        ))}
        {tokens.map((token, i) => (
          <span
            key={i}
            style={{
              color: token.color || "var(--wt-editor-text-main)",
              fontStyle: token.italic ? "italic" : undefined,
            }}
          >
            {token.text}
          </span>
        ))}
        {showCursor && (
          <motion.span
            aria-hidden="true"
            className="ml-[1px] inline-block h-[15px] w-[7px] translate-y-[2px] align-middle"
            style={{ backgroundColor: "var(--wt-editor-cursor)" }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 1, repeat: Infinity, times: [0, 0.5, 0.51, 1] }
            }
          />
        )}
      </span>
    </div>
  );
}
