## Why

`src/styles/global.css` defines every color as a semantic name pointing directly at a hand-picked hex value (e.g. `--portfolio-ink: #18181b`, `--portfolio-category-design: #4338ca`) with no primitive layer underneath. There is no structural way to tell when two tokens share a color on purpose (`--portfolio-ink` and `--portfolio-bg-dark` are both `#18181b`, coincidentally-looking but actually intentional) versus by accident, and no reusable, inspectable palette to draw from when adding future tokens (e.g. a 9th blog category). Introducing a primitive tier — backed by Tailwind v4's real installed OKLCH palette, since the project already depends on `tailwindcss` — makes these relationships explicit and gives the site a real, auditable color scale instead of scattered literals.

## What Changes

- Add a primitive token tier: private `:root` CSS custom properties (not registered in `@theme`, so they do not become new Tailwind utility classes) holding raw palette steps imported from Tailwind v4's installed OKLCH scale (`node_modules/tailwindcss/theme.css`), plus any bespoke primitives that don't fit the imported scale.
- Re-point every existing semantic `--portfolio-*` token to reference a primitive instead of a literal hex/oklch value.
- **BREAKING (visual)**: re-derive the 8 blog category colors (and their hover variants) from Tailwind's actual palette steps instead of their current Tailwind-v3-shaped-but-not-exact hex values. All 8 categories' light/dark pairs have been verified to still clear WCAG AA (≥4.5:1) against `--portfolio-bg-light`/`--portfolio-bg-dark` at their nearest matching step — see design.md for the full table.
- **BREAKING (visual)**: re-derive `--portfolio-accent` from Tailwind's teal scale. `teal-600` (the "expected" step matching the category colors' weight pattern) fails WCAG AA in light mode (3.51:1); `teal-700` (`#00786f`, 5.13:1) is used instead. This makes light-mode accent share a primitive with the "culture" category color (same hue+weight) — an accepted overlap, not a bug.
- Re-derive `--portfolio-ink` / `--portfolio-bg-dark` from Tailwind's `zinc-900` (`#18181b`) — an exact match, confirmed by direct OKLCH→sRGB conversion, so this one is a pure rename with zero visual change.
- `--portfolio-bg-light` (`#fff9f2`, a warm cream) and `--portfolio-muted` (both themes) do not land on any Tailwind neutral-family step; these become bespoke primitives defined outside the imported scale rather than forced onto an ill-fitting step.
- Extend the same primitive/semantic treatment to the effect/surface tokens currently defined as raw literals: `--lightbox-backdrop`, `--section-border-color`, and the inline `code` block background. `--media-frame-shadow` is excluded — it is a multi-layer shadow recipe, not a single color value, and doesn't fit a token model.
- No component, class name, or Tailwind utility usage changes. `bg-portfolio-bg`, `text-portfolio-ink`, etc. keep working identically; only what backs them changes.

## Capabilities

### New Capabilities
- `color-tokens`: Defines the two-tier (primitive + semantic) color token architecture for the site's design tokens — where primitives live, how semantic tokens must reference them, and the contrast/consistency rules new tokens must satisfy.

### Modified Capabilities
(none — no existing specs)

## Impact

- **Affected code**: `src/styles/global.css` only. No component files change, since all consumers reference semantic token names (`--color-portfolio-*` Tailwind utilities) that keep their existing names.
- **Visual impact**: 8 category colors + hover variants (16 values) shift slightly in both themes; `--portfolio-accent` shifts in light mode only (dark mode's `teal-400` match is exact-equivalent in contrast, values close). `--portfolio-ink`/`bg-dark` are pixel-identical. `--portfolio-bg-light` and `--portfolio-muted` are pixel-identical (kept as bespoke primitives).
- **Dependencies**: no new packages — primitive values are read from the already-installed `tailwindcss` package's shipped OKLCH steps, then hand-copied into `global.css` (not imported at build time, to keep the primitive tier private/static rather than coupled to Tailwind's internal file layout).
- **Verification**: every re-derived color pair has been checked against WCAG AA (4.5:1) contrast for normal text against its corresponding background, using direct OKLCH→sRGB conversion (see design.md for the full computed table).
