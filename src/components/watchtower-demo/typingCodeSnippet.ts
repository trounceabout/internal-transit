import { createHighlighter } from "shiki";
import { linearDarkTheme, linearLightTheme } from "./editorThemes";

/**
 * Original snippet (not real Wallaby/employer code) shaped to mirror the
 * pattern from the case study's reference screenshot: a couple of imports,
 * a small bit of derived-state logic, then a GraphCard/StatHighlight JSX
 * return block. Long enough to overflow the editor frame once fully typed,
 * per the "only need enough code to go out of the frame" brief — no scroll
 * container, it just runs past the visible bottom edge.
 */
export const FILE_PATH = "src/components/BandwidthGraph/BandwidthGraph.tsx";

export const CODE_SNIPPET = `import { ResponsiveContainer, ComposedChart } from "recharts";
import { StatHighlight } from "../StatHighlight";

const incomingChange = computeChange(series, "incoming");
const outgoingChange = computeChange(series, "outgoing");
const totalLabel = formatTotal(series);

return (
  <GraphCard {...CARD} {...rest}>
    <Box sx={{ display: "flex", flexDirection: "column", p: 200, gap: 150 }}>
      {/* Three StatHighlights in a row */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 400 }}>
        <StatHighlight
          label="Incoming"
          value={formattedIncoming.value}
          unit={formattedIncoming.unit}
          change={incomingChange}
        />
        <StatHighlight
          label="Outgoing"
          value={formattedOutgoing.value}
          unit={formattedOutgoing.unit}
          change={outgoingChange}
        />
        <StatHighlight label="Total" value={totalLabel} />
      </Box>
    </Box>

    {/* Chart — full bleed */}
    <Box sx={{ flexGrow: 1, pt: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={series}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="time" hide />
`;

export interface CodeToken {
  text: string;
  color: string;
  italic: boolean;
}

export type TokenizedLine = CodeToken[];

let cachedTokens: { dark: TokenizedLine[]; light: TokenizedLine[] } | null = null;

/**
 * Tokenizes CODE_SNIPPET once against both themes and caches the result —
 * this is fixed, build-time-known content, so there's no reason to
 * re-tokenize per render or per component instance.
 */
export async function getTokenizedLines(): Promise<{
  dark: TokenizedLine[];
  light: TokenizedLine[];
}> {
  if (cachedTokens) return cachedTokens;

  const highlighter = await createHighlighter({
    themes: [linearDarkTheme, linearLightTheme],
    langs: ["tsx"],
  });

  const toLines = (themeName: string): TokenizedLine[] => {
    const { tokens } = highlighter.codeToTokens(CODE_SNIPPET, {
      lang: "tsx",
      theme: themeName,
    });
    return tokens.map((line) =>
      line.map((token) => ({
        text: token.content,
        color: token.color ?? "",
        italic: (token.fontStyle ?? 0) === 1,
      })),
    );
  };

  cachedTokens = {
    dark: toLines("linear-dark"),
    light: toLines("linear-light"),
  };
  return cachedTokens;
}
