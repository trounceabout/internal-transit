## Context

`src/styles/global.css` currently defines all color as flat semantic tokens (`--portfolio-bg`, `--portfolio-ink`, `--portfolio-muted`, `--portfolio-accent`, and 8 `--portfolio-category-*` pairs with hover variants) with literal hex/oklch values inline — no primitive tier exists. The project already depends on Tailwind v4 (`tailwindcss ^4.2.2`), whose `node_modules/tailwindcss/theme.css` ships a full OKLCH-based color palette (`gray`, `zinc`, `neutral`, `stone`, and all standard hues at steps 50–950). This design imports that palette as the primitive tier rather than hand-authoring a new one.

Direct investigation (OKLCH→sRGB conversion, done by hand for this design since Tailwind v4 stores steps in OKLCH, not hex) established:
- The 8 category colors' current hex values are Tailwind-v3-shaped (same hue families, same light≈600–700/dark≈300–400 weight pattern) but do not exactly match Tailwind v4's current OKLCH-derived hex output — v4 recomputed the whole palette in OKLCH during the v3→v4 migration, shifting nearly every step's exact hex.
- `--portfolio-ink` / `--portfolio-bg-dark` (`#18181b`) is an **exact** match for Tailwind's `zinc-900`.
- `--portfolio-bg-light` (`#fff9f2`, warm cream) and `--portfolio-muted` (`#6b6b6b` light / `#bbbbbb` dark) do **not** land near any Tailwind neutral-family (`gray`/`zinc`/`neutral`/`stone`) step.
- `--portfolio-accent`'s "expected" step (`teal-600`, matching the category colors' light-mode weight pattern) **fails WCAG AA** against the light background (3.51:1); `teal-700` passes (5.13:1).

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

### 3. Accent: `teal-700` (not `teal-600`) for light mode
`teal-600` — the step that would match the category colors' 600–700 weight pattern for light mode — fails WCAG AA against `--portfolio-bg-light` (3.51:1). `teal-700` (`#00786f`, 5.13:1) is used instead. This intentionally makes light-mode `--portfolio-accent` share a primitive with `culture`'s light-mode color (same hue + weight) — accepted as a reasonable overlap between a "brand" semantic and a "category" semantic, not treated as a conflict to resolve by picking a different hue.

Dark mode uses `teal-400` (`#00d5be`, 9.50:1 against `--portfolio-bg-dark`), which was already a comfortable pass.

### 4. Neutral tokens: `zinc` family, with two documented exceptions
- `--portfolio-ink` / `--portfolio-bg-dark` → `zinc-900` (`#18181b`), an exact match — pure rename, zero visual change.
- `--portfolio-bg-light` (`#fff9f2`) has no matching `zinc` (or `gray`/`neutral`/`stone`) step — it's a warm cream, not near-white-neutral. Kept as a bespoke primitive (`--cream-50` or similar), defined outside the imported scale.
- `--portfolio-muted` (`#6b6b6b` light / `#bbbbbb` dark) does not land near a `zinc` step either — the closest passing candidates are `zinc-600` (`#52525c`, 7.38:1 — passes comfortably but reads visibly darker/heavier than today's tuned `#6b6b6b`) and `zinc-500` (`#71717b`, 4.62:1 — closer visual match but only barely clears the 4.5:1 floor). **Open question, see below** — this one is a real design tradeoff, not a mechanical snap-to-step.

### 5. Primitives stay private CSS variables, not `@theme` entries
Primitives are declared in a plain `:root` block, separate from the `@theme inline` block where semantic tokens live. This means `bg-indigo-700`-style utility classes are never generated — only the existing `--color-portfolio-*` semantic names remain usable as Tailwind utilities. Prevents future code from bypassing the semantic layer and reaching for raw primitives directly.

### 6. Effect/surface tokens included, `--media-frame-shadow` excluded
`--lightbox-backdrop`, `--section-border-color`, and the inline `code` background get the same primitive-backing treatment (each is a single color value). `--media-frame-shadow` is left untouched — it's a composite multi-layer shadow (offsets + blur + spread + color, sometimes with an inset highlight), not a single token-able color.

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

- **`--portfolio-muted` primitive**: bespoke primitive (matching current values exactly, like `--portfolio-bg-light`) vs. snapping to `zinc-500` (barely-passing, closer visual match) vs. `zinc-600` (comfortable pass, visibly heavier)? Leaning bespoke for consistency with the `bg-light` precedent, but not yet decided.
- **Bespoke primitive naming convention**: what do non-Tailwind primitives (`bg-light` cream, `muted` grays if kept bespoke) get named as, to visually distinguish "borrowed from Tailwind" vs. "authored for this site" in the primitive tier?
