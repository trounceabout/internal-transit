/**
 * Fake terminal conversation content — an invented Claude Code-style
 * exchange, not a real transcript. Component/prop names throughout are
 * generic/invented (matching the same IP-safety reasoning as the earlier
 * typing-code-editor snippet this replaces): nothing here references any
 * real system, company, or business logic.
 */
export const PROMPT_TEXT =
  "Take a look at this Figma file and work up a plan for how to implement it: figma.com/design/9f3k2p/dashboard-v2";

export interface DiffLine {
  /** Line number as it appears in the file after the change (matches how
   * Claude Code's own diff view numbers both removed and added lines
   * against the post-change line count). */
  lineNumber: number;
  kind: "remove" | "add" | "context";
  text: string;
}

export type ResponseBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "bullet"; text: string }
  | {
      type: "diff";
      filePath: string;
      addedCount: number;
      removedCount: number;
      lines: DiffLine[];
    };

export const RESPONSE_BLOCKS: ResponseBlock[] = [
  {
    type: "paragraph",
    text: "I'll look at the Figma frames and check the existing component library before planning.",
  },
  { type: "heading", text: "Approach" },
  {
    type: "bullet",
    text: "Reuse the existing card shell and stat-highlight primitive rather than building a new layout from scratch.",
  },
  {
    type: "bullet",
    text: "Add a shared hover state so the chart and the summary numbers stay in sync when scrubbing.",
  },
  {
    type: "bullet",
    text: "Match the light and dark token values already defined for the rest of the dashboard.",
  },
  { type: "heading", text: "Changes" },
  {
    type: "diff",
    filePath: "src/components/dashboard/StatCard.tsx",
    addedCount: 2,
    removedCount: 1,
    lines: [
      { lineNumber: 42, kind: "remove", text: "  const [value, setValue] = useState(0);" },
      {
        lineNumber: 42,
        kind: "add",
        text: "  const [value, setValue] = useState<number | null>(null);",
      },
      { lineNumber: 43, kind: "add", text: "  const isHovering = value !== null;" },
    ],
  },
  {
    type: "paragraph",
    text: "This keeps the idle and hovered states explicit instead of overloading zero as a sentinel.",
  },
];
