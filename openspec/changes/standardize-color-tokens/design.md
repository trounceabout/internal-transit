## Context

`src/styles/global.css` currently defines all color as flat semantic tokens (`--portfolio-bg`, `--portfolio-text`, `--portfolio-muted`, `--portfolio-accent`, and 8 `--portfolio-category-*` pairs with hover variants) with literal hex/oklch values inline — no primitive tier exists. The project already depends on Tailwind v4 (`tailwindcss ^4.2.2`), whose `node_modules/tailwindcss/theme.css` ships a full OKLCH-based color palette (`gray`, `zinc`, `neutral`, `stone`, and all standard hues at steps 50–950). This design imports that palette as the primitive tier rather than hand-authoring a new one.

Direct investigation (OKLCH→sRGB conversion, done by hand for this design since Tailwind v4 stores steps in OKLCH, not hex) established:
- The 8 category colors' current hex values are Tailwind-v3-shaped (same hue families, same light≈600–700/dark≈300–400 weight pattern) but do not exactly match Tailwind v4's current OKLCH-derived hex output — v4 recomputed the whole palette in OKLCH during the v3→v4 migration, shifting nearly every step's exact hex.
- `--portfolio-text` (originally named `--portfolio-ink`; renamed for clarity — see Decision 7) / `--portfolio-bg-dark` (`#18181b`) is an **exact** match for Tailwind's `zinc-900`.
- `--portfolio-bg-light` (`#fff9f2`, warm cream) and `--portfolio-muted` (`#6b6b6b` light / `#bbbbbb` dark) do **not** land near any Tailwind neutral-family (`gray`/`zinc`/`neutral`/`stone`) step.
- `--portfolio-accent`'s "expected" step in its hue family (matching the category colors' light-mode weight pattern) **fails WCAG AA** against the light background; the step down passes. This held for `teal` originally and holds identically for `emerald` after the hue switch (see Decision 3).

**Follow-up revision** (same branch/PR as the original implementation, not re-opened as a separate change): primitives were converted from hex to native `oklch()` values, `--portfolio-accent` moved from the `teal` hue to `emerald`, and `--portfolio-ink` was renamed to `--portfolio-text`. See Decisions 3 and 7 for details.

## Goals / Non-Goals

**Goals:**
- Establish a 2-tier token architecture: primitives (raw palette steps, theme-agnostic) → semantics (`--portfolio-*`, theme-conditional, what components actually reference).
- Make intentional color reuse across tokens structurally visible (e.g. ink/bg-dark sharing `zinc-900`) instead of coincidental-looking.
- Preserve or improve WCAG AA (4.5:1) contrast for every re-derived color against its paired background.
- Keep all existing Tailwind utility class names (`bg-portfolio-bg`, `text-portfolio-category-design`, etc.) working unchanged — this is a refactor of what backs them, not their names.

**Non-Goals:**
- Not touching Undercurrent (the separate design-system repo) or `undercurrent-demo.css` — out of scope per explicit scoping decision.
- Not registering primitives in Tailwind's `@theme` block — they stay private `:root` variables so no new `bg-indigo-700`-style utilities leak into the codebase. Only the semantic layer is Tailwind-facing.
- Not pursuing pixel-perfect zero-visual-change — this design accepts small, verified-safe color shifts in the 8 category colors and the light-mode accent in exchange for a real, named scale.
- `--media-frame-shadow` is excluded from the token model — it's a multi-property shadow recipe, not a single color value.

## Decisions

### 1. Primitive source: import Tailwind v4's installed OKLCH palette, hand-copied
Rather than hand-authoring a custom scale or dynamically importing from `node_modules`, primitive values are copied as static OKLCH literals into `global.css`'s own `:root` block, sourced from `node_modules/tailwindcss/theme.css` at design time. This avoids a build-time coupling to Tailwind's internal file structure while still getting a real, externally-defined, non-arbitrary scale.

Primitives are declared as `oklch(L% C H)` literals — the exact syntax Tailwind's own `theme.css` uses — rather than a converted sRGB hex equivalent. The two are visually identical (hex was always just a converted rendering of the same underlying color), but storing oklch directly means the primitive tier is a literal copy of Tailwind's source values, and the existing `color-mix(in oklch, ...)` calls (`--lightbox-backdrop`, `--section-border-color`) blend against inputs already in their native color space rather than an implicitly-converted one.

**Alternative considered**: author a from-scratch custom scale matching today's exact hex values (zero visual change). Rejected per explicit decision — the value of adopting a *real, named* scale (making future additions easier to reason about) was judged worth small, verified-safe visual shifts.

### 2. Category color re-derivation: nearest passing step, not forced-600/400
Each category's light-mode color maps to whichever step in its hue family clears 4.5:1 against `--portfolio-bg-light`, and dark-mode to whichever clears 4.5:1 against `--portfolio-bg-dark` — not a blanket "light=700/dark=400" rule. Computed mapping (all verified via direct OKLCH→sRGB conversion + WCAG contrast formula):

| Category    | Light step   | Light hex | Contrast | Dark step    | Dark hex  | Contrast |
|-------------|--------------|-----------|----------|--------------|-----------|----------|
| design      | indigo-700   | `#432dd7` | 7.74:1   | indigo-400   | `#7c86ff` | 5.66:1   |
| philosophy  | purple-700   | `#8200db` | 6.76:1   | purple-400   | `#c27aff` | 6.35:1   |
| craft       | orange-700   | `#ca3500` | 5.00:1   | orange-400   | `#ff8904` | 7.45:1   |
| creativity  | amber-800    | `#973c00` | 6.78:1   | amber-400    | `#ffb900` | 10.29:1  |
| culture     | teal-700     | `#00786f` | 5.13:1   | teal-400     | `#00d5be` | 9.50:1   |
| games       | green-700    | `#008236` | 4.73:1   | green-400    | `#05df72` | 9.96:1   |
| art         | fuchsia-700  | `#a800b7` | 6.00:1   | fuchsia-400  | `#ed6aff` | 6.84:1   |
| outdoors    | amber-700    | `#bb4d00` | 4.81:1   | amber-300    | `#ffd230` | 12.24:1  |

Hover variants use one step darker (light mode) / one step lighter (dark mode) than the base, mirroring the existing file's pattern of "hover = adjacent shade, same hue."

Note: `creativity` and `outdoors` both land in the `amber` family, distinguished by weight only (800 vs 700 light, 400 vs 300 dark). This is an accepted overlap — both passed contrast cleanly at adjacent-but-distinct steps, and no other hue in the available set fit the remaining palette better without creating a closer clash elsewhere.

### 3. Accent: `emerald-700` (not `emerald-600`) for light mode, hue changed from `teal`
`--portfolio-accent` was originally derived from `teal` (`teal-700` light / `teal-400` dark) and was later switched to `emerald` at the user's request, as a deliberate brand hue change rather than a contrast-driven decision. The same weight-step reasoning from the original `teal` derivation carries over unchanged: `emerald-600` — the step that would match the category colors' 600–700 weight pattern for light mode — fails WCAG AA against `--portfolio-bg-light` (3.49:1). `emerald-700` (`#007a55`, 5.13:1) is used instead — the same contrast margin `teal-700` had.

Dark mode uses `emerald-400` (`#00d492`, 9.14:1 against `--portfolio-bg-dark`), a comfortable pass (`teal-400` computed to 9.50:1 for comparison).

Unlike the original `teal` derivation, `--portfolio-accent` does **not** share a primitive with any category color — `culture` was deliberately kept on `teal-700`/`teal-400` rather than following accent to `emerald`, so the two are now visually and structurally distinct (a user decision made when the hue switch was requested, reversing the earlier "accepted overlap" reasoning).

### 4. Neutral tokens: `zinc` family, with two documented exceptions
- `--portfolio-text` (`--portfolio-ink` originally) / `--portfolio-bg-dark` → `zinc-900`, an exact match — pure rename, zero visual change.
- `--portfolio-bg-light` (`#fff9f2`) has no matching `zinc` (or `gray`/`neutral`/`stone`) step — it's a warm cream, not near-white-neutral. Kept as a bespoke primitive (`--brand-cream`), defined outside the imported scale.
- `--portfolio-muted`: **Resolved** — uses real `zinc-600` (light) / `zinc-400` (dark) steps, not a bespoke primitive. `zinc-600` computes to 7.38:1 against `--portfolio-bg-light` (vs. the original hand-tuned `#6b6b6b`'s 5.1:1) and `zinc-400` computes to 6.75:1 against `--portfolio-bg-dark` (vs. the original `#bbbbbb`'s 9.23:1) — both a comfortable pass, accepted as visibly heavier than the original tuning in exchange for landing on a real scale step rather than a bespoke one.

### 5. Primitives stay private CSS variables, not `@theme` entries
Primitives are declared in a plain `:root` block, separate from the `@theme inline` block where semantic tokens live. This means `bg-indigo-700`-style utility classes are never generated — only the existing `--color-portfolio-*` semantic names remain usable as Tailwind utilities. Prevents future code from bypassing the semantic layer and reaching for raw primitives directly.

### 6. Effect/surface tokens included, `--media-frame-shadow` excluded
`--lightbox-backdrop`, `--section-border-color`, and the inline `code` background get the same primitive-backing treatment (each is a single color value). `--media-frame-shadow` is left untouched — it's a composite multi-layer shadow (offsets + blur + spread + color, sometimes with an inset highlight), not a single token-able color. `--portfolio-bg-gradient`'s dark-mode stops (`linear-gradient(to bottom, ...)`) were brought into the same model in the oklch follow-up revision: the bottom stop was already an exact `zinc-900` match and now references it directly; the top stop became a new bespoke primitive, `--brand-gradient-dark-top`.

### 7. Naming: bespoke primitives use `--brand-<role>`; `--portfolio-ink` renamed to `--portfolio-text`
Bespoke (non-Tailwind-imported) primitives use a `--brand-<role>` prefix — e.g. `--brand-cream`, `--brand-warm-tan`, `--brand-section-border-dark` — to visually distinguish "authored for this site" from "imported Tailwind step" at a glance in the primitives block.

Separately, `--portfolio-ink` (the semantic token, and its `text-portfolio-ink` Tailwind utility) was renamed to `--portfolio-text` / `text-portfolio-text` in the oklch/emerald follow-up revision. "Ink" was a metaphor; the token controls text color specifically (see its usage across `.portfolio-headline`, article body copy, labels), so "text" names it directly. This is a pure rename — no value change — but touches every component file that referenced the old utility class name, since (per the "Existing semantic utility names are preserved" requirement) the *name itself* was being revised, not just its backing value.

## Risks / Trade-offs

- **[Risk] Visual shift on a live site.** 16 category values + light-mode accent change slightly. → **Mitigation**: every changed pair has been verified ≥4.5:1 WCAG AA against its actual background via direct computation (table above); changes are subtle same-hue shifts, not hue changes.
- **[Risk] `--portfolio-muted` has no clean primitive match.** Forcing it onto `zinc-500`/`zinc-600` either barely clears contrast or visibly darkens the tone from what was deliberately tuned to compute to exactly 5.1:1. → **Mitigation**: treat as an open question (below) rather than silently picking one; likely resolution is a bespoke primitive, matching the `--portfolio-bg-light` precedent.
- **[Risk] Hand-copying primitive values from `node_modules` means silent drift if Tailwind is upgraded.** The primitive tier won't auto-update when `tailwindcss` bumps versions, since these are copied literals, not imports. → **Mitigation**: acceptable — primitives are meant to be a stable, curated subset, not a live mirror; a future Tailwind upgrade is a separate, deliberate re-audit, not an automatic cascade.
- **[Trade-off] Amber reused for two categories (`creativity`, `outdoors`).** Slightly reduces at-a-glance distinctiveness between those two tags. → Accepted; both are already visually differentiated by weight, and no cleaner alternative hue was found without disturbing the rest of the mapping.

## Migration Plan

1. Add the primitive `:root` block to `global.css` (new declarations only, no changes to existing behavior yet).
2. Re-point each semantic token to its primitive, one group at a time (neutrals → accent → categories → effect tokens), verifying visually after each group.
3. Remove now-unused literal values and stale comments describing raw hex math (e.g. the "computes to 5.1:1" contrast-audit comments can be simplified once contrast is re-verified against the new values, but the underlying rationale comments should be preserved/updated, not deleted, since they document *why* a step was chosen).
4. No rollback complexity — this is a CSS-only change with no data migration; reverting is a straight `git revert`.

## Open Questions

Both original open questions are resolved — see Decisions 4 and 7 above (`--portfolio-muted` uses real `zinc-600`/`zinc-400` steps; bespoke primitives use the `--brand-<role>` prefix). No open questions remain as of the oklch/emerald/rename follow-up revision.
