/**
 * Fake terminal conversation content — an invented Claude Code-style
 * exchange, not a real transcript. Component/prop names throughout are
 * generic/invented (matching the same IP-safety reasoning as the earlier
 * typing-code-editor snippet this replaces): nothing here references any
 * real system, company, or business logic.
 */
export const PROMPT_TEXT =
  "Take a look at this Figma file for the monitoring modules and work up a plan for how to implement it: figma.com/design/9f3k2p/watchtower-modules";

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
  { type: "heading", text: "Context" },
  {
    type: "paragraph",
    text: "The frame covers five live modules — CPU, RAM, disk space, bandwidth, and network speed — each with a hover state that swaps the headline stat from a period average to the exact point under the cursor. I'll check what's already built before adding anything new.",
  },
  { type: "heading", text: "Approach" },
  {
    type: "bullet",
    text: "Reuse CpuUtilizationCard, RamUsageCard, and NetworkSpeedCard as the base — they already share one hover-driven StatHighlight pattern, so the new modules should follow the same shape rather than inventing another.",
  },
  {
    type: "bullet",
    text: "DiskSpaceCard has no chart in the Figma frame, just a segmented usage bar — that one can skip the hover wiring entirely instead of forcing it into the shared pattern.",
  },
  {
    type: "bullet",
    text: "Bandwidth's stacked bars need a dual-axis chart for the cumulative line, so it can't reuse the single-series chart setup the others use.",
  },
  {
    type: "bullet",
    text: "Pull the color and spacing tokens from watchtower-demo.css rather than hardcoding new values, so light and dark mode stay correct for free.",
  },
  { type: "heading", text: "Changes" },
  {
    type: "diff",
    filePath: "src/components/watchtower-demo/BandwidthCard.tsx",
    addedCount: 2,
    removedCount: 1,
    lines: [
      { lineNumber: 27, kind: "remove", text: "  const [hoverIndex, setHoverIndex] = useState(0);" },
      {
        lineNumber: 27,
        kind: "add",
        text: "  const [hoverIndex, setHoverIndex] = useState<number | null>(null);",
      },
      { lineNumber: 28, kind: "add", text: "  const isHovering = hoverIndex !== null;" },
    ],
  },
  {
    type: "paragraph",
    text: "This keeps the idle and hovered states explicit instead of overloading index 0 as a stand-in for \"nothing is hovered.\"",
  },
];
