export interface BurstRange {
  /** Character offset (into CODE_SNIPPET) where the burst starts. */
  start: number;
  /** Character offset where the burst ends (exclusive). */
  end: number;
}

/**
 * Scans `code` for editor-autocomplete-style closer patterns — a
 * self-closing tag's trailing "/>", a closing tag like "</Box>", and a
 * brace pair's closer immediately following its opener with nothing but
 * whitespace/other closers in between (e.g. "}}" right after "{{...}}"'s
 * content ends) — and returns the character ranges that should reveal as
 * one instant jump rather than character-by-character, mimicking an editor
 * auto-inserting the matching closer the moment you type the opener.
 *
 * Deliberately conservative: only exact closing-tag/brace-pair patterns are
 * detected, not general "autocomplete a whole identifier" behavior — false
 * positives here would visibly skip real typed content.
 */
/** Common short prefix an editor would realistically still hand-type before
 * a suggestion is confident enough to accept — e.g. typing "lab" then
 * accepting "el" to complete "label". Kept small (1-2 chars) so the burst
 * still reads as "mostly autocompleted," not "appeared from nothing." */
const MANUAL_PREFIX_CHARS = 2;

export function findBurstRanges(code: string): BurstRange[] {
  const ranges: BurstRange[] = [];

  // Self-closing tags: "/>" right after the tag's own attributes, e.g.
  // `<StatHighlight label="Total" value={totalLabel} />` — burst just the
  // final " />" (or "/>"), not the whole tag.
  const selfClosingPattern = /\s*\/>/g;
  for (const match of code.matchAll(selfClosingPattern)) {
    ranges.push({ start: match.index, end: match.index + match[0].length });
  }

  // Closing tags: "</Name>" — burst the whole closer as one unit.
  const closingTagPattern = /<\/[A-Za-z][A-Za-z0-9.]*>/g;
  for (const match of code.matchAll(closingTagPattern)) {
    ranges.push({ start: match.index, end: match.index + match[0].length });
  }

  // Matched double-brace pairs opened by "={{ " — burst the closing "}}"
  // once its matching opener has been typed (e.g. sx={{ display: "flex" }}
  // bursts in the trailing " }}").
  const doubleBraceClosePattern = / \}\}/g;
  for (const match of code.matchAll(doubleBraceClosePattern)) {
    ranges.push({ start: match.index, end: match.index + match[0].length });
  }

  // JSX attribute names — "label=", "value=", "unit=", "sx=", etc. — the
  // few leading chars are hand-typed, then the rest of the identifier
  // (plus the "=") bursts in as an accepted suggestion. Matches a bare
  // identifier immediately followed by "=" (not "=="), only where it reads
  // as an attribute (preceded by whitespace, i.e. inside a tag).
  const attrNamePattern = /(?<=[\s<])([A-Za-z][A-Za-z0-9]*)=(?!=)/g;
  for (const match of code.matchAll(attrNamePattern)) {
    const name = match[1];
    if (name.length > MANUAL_PREFIX_CHARS) {
      const nameStart = match.index;
      ranges.push({
        start: nameStart + MANUAL_PREFIX_CHARS,
        end: nameStart + name.length + 1, // +1 for the "="
      });
    }
  }

  // Property-access identifiers — ".value", ".unit", etc. — same
  // hand-type-a-prefix-then-accept pattern as attribute names.
  const propertyAccessPattern = /\.([A-Za-z][A-Za-z0-9]*)/g;
  for (const match of code.matchAll(propertyAccessPattern)) {
    const name = match[1];
    if (name.length > MANUAL_PREFIX_CHARS) {
      const nameStart = match.index + 1; // skip the "."
      ranges.push({
        start: nameStart + MANUAL_PREFIX_CHARS,
        end: nameStart + name.length,
      });
    }
  }

  return mergeOverlapping(ranges.sort((a, b) => a.start - b.start));
}

function mergeOverlapping(ranges: BurstRange[]): BurstRange[] {
  const merged: BurstRange[] = [];
  for (const range of ranges) {
    const last = merged.at(-1);
    if (last && range.start <= last.end) {
      last.end = Math.max(last.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }
  return merged;
}

/**
 * Given the reveal cursor sitting at `fromIndex`, returns the burst range
 * whose start exactly equals `fromIndex`, if any — the caller advances
 * straight to `range.end` in one step instead of one character at a time.
 */
export function findBurstAt(
  ranges: BurstRange[],
  fromIndex: number,
): BurstRange | undefined {
  return ranges.find((r) => r.start === fromIndex);
}
