## 1. Resolve open questions before implementation

- [x] 1.1 Decide `--portfolio-muted` primitive: bespoke (exact current values) vs. `zinc-500` (barely-passing, closer match) vs. `zinc-600` (comfortable pass, visibly heavier) — see design.md Open Questions. **Decided: `zinc-600` (light) / `zinc-400` (dark)** — comfortable contrast margin (7.38:1 / 6.75:1), accepted as visibly heavier than today's tuned values.
- [x] 1.2 Decide naming convention distinguishing imported Tailwind primitives (e.g. `--indigo-700`) from bespoke primitives (e.g. cream background, and `--portfolio-muted` if kept bespoke). **Decided: `--brand-<role>` prefix** for bespoke primitives (e.g. `--brand-cream`).

## 2. Add the primitive tier

- [x] 2.1 Add a new `:root` block (separate from the existing `@theme inline` block) holding imported Tailwind primitives actually used: `--zinc-900`, `--teal-400`, `--teal-700`, `--indigo-400/700`, `--purple-400/700`, `--orange-400/700`, `--amber-300/400/700/800`, `--green-400/700`, `--fuchsia-400/700` (plus hover-step primitives: `--indigo-300/800`, `--purple-300/800`, `--orange-300/800`, `--amber-200/500/600/900`, `--teal-300/800`, `--green-300/800`, `--fuchsia-300/800`, `--zinc-400/600`)
- [x] 2.2 Add bespoke primitives for colors with no matching imported step: `--brand-cream` (`--portfolio-bg-light`'s current `#fff9f2`). (`--portfolio-muted` resolved to real `--zinc-600`/`--zinc-400` steps per task 1.1's decision, not a bespoke primitive.)
- [x] 2.3 Add primitives for the effect/surface tokens in scope: `--brand-warm-white` (lightbox backdrop light base), `--brand-section-border-dark` (Figma dark-mode stroke, no clean zinc match), `--brand-warm-tan`/`--brand-cool-dark` (inline code background, light/dark)

## 3. Re-point neutral semantic tokens

- [x] 3.1 Re-point `--portfolio-ink` (light) and `--portfolio-bg-dark` to `var(--zinc-900)`
- [x] 3.2 Re-point `--portfolio-bg-light` to its bespoke cream primitive
- [x] 3.3 Re-point `--portfolio-muted` (both themes) to `var(--zinc-600)` (light) / `var(--zinc-400)` (dark) per task 1.1
- [ ] 3.4 Visually verify: home page, blog list, and a blog post in both light and dark mode — **NOT DONE: Chrome browser automation extension unavailable in this session.** Verified numerically instead: compiled CSS confirms `--portfolio-ink`/`--portfolio-bg-dark` resolve to the pixel-identical `#18181b`; `--portfolio-muted` intentionally shifts (see 3.3) — user should eyeball this specifically, it's the one non-cosmetic-parity change in this group.

## 4. Re-point accent token

- [x] 4.1 Re-point `--portfolio-accent` light mode to `var(--teal-700)`, dark mode to `var(--teal-400)`
- [ ] 4.2 Visually verify accent usage — **NOT DONE: browser automation unavailable.** Contrast verified numerically (5.13:1 light, 9.50:1 dark, both WCAG AA); user should eyeball the light-mode shift from `#0f7a6b` to `#00786f` specifically.

## 5. Re-point category colors

- [x] 5.1 Re-point all 8 categories' base + hover tokens (light and dark) per the mapping table in design.md — confirmed via compiled CSS output, matches design.md table exactly
- [ ] 5.2 Visually verify each of the 8 category tags — **NOT DONE: browser automation unavailable.**
- [ ] 5.3 Spot-check `creativity`/`outdoors` distinguishability — **NOT DONE: browser automation unavailable.** Numerically distinct (amber-800 #973c00 vs amber-700 #bb4d00 light; amber-400 #ffb900 vs amber-300 #ffd230 dark) but a visual gut-check is still warranted.

## 6. Re-point effect/surface tokens

- [x] 6.1 Re-point `--lightbox-backdrop` (both themes) to `color-mix(in oklch, <primitive> <pct>, transparent)`
- [x] 6.2 Re-point `--section-border-color` (both themes) to its primitive (light: `color-mix` tint of `--zinc-900`; dark: `--brand-section-border-dark`)
- [x] 6.3 Re-point the inline `code` block background (both themes) to `--brand-warm-tan`/`--brand-cool-dark`
- [ ] 6.4 Visually verify — **NOT DONE: browser automation unavailable.** Verified by construction instead: each `color-mix()` base color was confirmed to exactly match the original literal's base hex before substitution (see design notes / conversation record), so these should be pixel-identical, not just close.

## 7. Cleanup and verification

- [x] 7.1 Remove now-dead literal hex/oklch values from `global.css`; rationale comments preserved and updated to reference new primitive names instead of raw values (e.g. "computes to 5.1:1" comments rewritten to explain the zinc-step tradeoff)
- [x] 7.2 Run the project's linter (`bun run lint`) and Prettier (`bunx prettier --check`) — ESLint clean; Prettier flagged formatting on `global.css` from the new edits, fixed via `bunx prettier --write`, both clean now
- [ ] 7.3 Full visual pass — **NOT DONE: browser automation unavailable in this session.** `bun run build` and `bun run dev` both verified clean (see task 7.2 mechanical checks); actual visual review still needed from the user.
- [x] 7.4 Confirmed no component/`.astro`/`.tsx` file needed changes — only `src/styles/global.css` was touched; verified rendered HTML still emits all original utility class names (`bg-portfolio-page`, `text-portfolio-ink`, `text-portfolio-category-*`, etc.) unchanged

## 8. Issues found and fixed during implementation (not in original plan)

- [x] 8.1 First build attempt failed: `Unterminated string` errors from Tailwind's Lightning-CSS-based parser, triggered by apostrophe/backtick-heavy prose inside a large CSS comment block sitting directly above a `:root` property block. Fixed by simplifying that comment's punctuation. Worth remembering for future edits near `@theme`/`:root` blocks in this file.
- [x] 8.2 A documentation comment containing the literal string `bg-indigo-700` (written as a negative example, "there is no bg-indigo-700 utility") was picked up by Tailwind's content scanner anyway — Tailwind scans all files including CSS comments for class-shaped strings and generates the utility regardless of surrounding negation. This produced a real spec violation (a primitive-derived utility class appearing in compiled output). Fixed by rewriting the comment to avoid any literal valid-Tailwind-class-shaped string.

## 9. Follow-up revision: oklch primitives, emerald accent, `-ink` → `-text` rename

Same branch/PR as the original implementation (`feat/color-token-primitives-61` / PR #62) — not a new change, since the original hadn't merged yet.

- [x] 9.1 Convert every primitive in the `:root` block from hex to native `oklch(L% C H)` literals, sourced directly from `node_modules/tailwindcss/theme.css` (values already read off during the original implementation). Round-trip-verified the conversion math against Tailwind's own published `zinc-900` value before trusting it for the rest of the scale.
- [x] 9.2 Add `--emerald-700`/`--emerald-400` primitives; re-point `--portfolio-accent` (light/dark) from `teal-700`/`teal-400` to `emerald-700`/`emerald-400`. Verified WCAG AA holds: `emerald-700` vs. `--brand-cream` = 5.13:1 (same margin as `teal-700` had), `emerald-400` vs. `--zinc-900` = 9.14:1. Per user decision, `--portfolio-category-culture` stays on `teal-700`/`teal-400` — does not follow accent to emerald, so the two are no longer sharing a primitive.
- [x] 9.3 Add `--brand-gradient-dark-top` bespoke primitive for `.dark`'s `--portfolio-bg-gradient` top stop (`#242429`, no matching Tailwind step); re-point the gradient's bottom stop to `var(--zinc-900)` (was already an exact hex match, previously left as a literal).
- [x] 9.4 Rename `--portfolio-ink` → `--portfolio-text` (and `--color-portfolio-ink` → `--color-portfolio-text`) in `global.css`, plus every `text-portfolio-ink` Tailwind utility usage and raw `var(--portfolio-ink)` reference across `Lightbox.astro`, `LightboxImage.astro`, `LabeledRow.astro`, `PillButton.astro`, `LoopVideo.astro`, `Postscript.astro`, `index.astro`, `BlogLayout.astro`, `ProjectLayout.astro`, `blog/index.astro`. Verified via `grep -rn "portfolio-ink" src/` returning zero matches after the rename.
- [x] 9.5 Rebuilt (`bun run build`) — no Lightning CSS errors despite re-editing the same comment block that broke the build twice during the original implementation. Confirmed via compiled-CSS grep: no `portfolio-ink` leftovers, no leaked `bg-emerald-*`/`text-emerald-*` utility classes, `--portfolio-accent` resolves to `var(--emerald-700)`/`var(--emerald-400)` as expected.
- [x] 9.6 `bun run lint` clean; `bunx prettier --check` flagged `global.css` (fixed via `--write`), all other touched files (`sed`-only edits) already clean.
- [ ] 9.7 Visual verification (light + dark mode) — **NOT DONE: browser automation unavailable in this session**, same limitation as the original implementation. Specifically needs a human check: the accent color's hue change (teal → emerald) is a deliberate, visible shift across every place `--portfolio-accent` is used (hover states, links), and `culture` should now read as clearly distinct from accent again (previously they shared a primitive).
