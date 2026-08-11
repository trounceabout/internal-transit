## ADDED Requirements

### Requirement: Two-tier token architecture
The color system SHALL separate primitive tokens (raw palette values, theme-agnostic, not tied to a semantic role) from semantic tokens (theme-conditional, named for the role they serve — e.g. `bg`, `ink`, `muted`, `accent`, `category-*`). Every semantic token's value SHALL be expressed as a reference to a primitive token, not as a literal color value, except where a semantic token is a documented bespoke primitive itself (see Bespoke primitives requirement).

#### Scenario: Semantic token references a primitive
- **WHEN** a semantic token such as `--portfolio-ink` is defined
- **THEN** its value SHALL be `var(--<primitive-name>)`, not a literal hex/oklch/rgb value

#### Scenario: Shared color is structurally visible
- **WHEN** two semantic tokens resolve to the same color (e.g. `--portfolio-ink` in light mode and `--portfolio-bg-dark`)
- **THEN** both SHALL reference the same primitive token, making the shared identity visible in the token definitions rather than only discoverable by comparing literal values

### Requirement: Primitive tokens are not Tailwind utilities
Primitive tokens SHALL be declared as plain `:root` custom properties and SHALL NOT be registered inside a Tailwind `@theme` block.

#### Scenario: Primitive has no corresponding utility class
- **WHEN** a primitive token such as `--indigo-700` is defined
- **THEN** no Tailwind utility class (e.g. `bg-indigo-700`, `text-indigo-700`) SHALL be generated from it
- **AND** the primitive SHALL only be reachable by other CSS referencing `var(--indigo-700)` directly

### Requirement: Existing semantic utility names are preserved
All existing Tailwind utility classes generated from semantic tokens (e.g. `bg-portfolio-bg`, `text-portfolio-ink`, `text-portfolio-category-design`) SHALL continue to exist under the same class names after primitives are introduced.

#### Scenario: Component markup is unaffected
- **WHEN** a component currently uses a class such as `bg-portfolio-bg` or `text-portfolio-category-craft`
- **THEN** that class SHALL remain valid and SHALL resolve to the same visual color family as before (allowing for the specific, verified value changes described in the Contrast requirement)
- **AND** no component file SHALL need to change its class names as a result of this change

### Requirement: WCAG AA contrast is verified for every re-derived color
Every semantic color token that is re-derived from a primitive during this change SHALL meet or exceed a 4.5:1 contrast ratio (WCAG AA, normal text) against the background it is intended to be read against in that theme.

#### Scenario: Category color passes contrast in both themes
- **WHEN** a blog category's light-mode color is re-derived from a primitive
- **THEN** its contrast ratio against `--portfolio-bg-light` SHALL be ≥ 4.5:1
- **AND** the corresponding dark-mode color's contrast ratio against `--portfolio-bg-dark` SHALL be ≥ 4.5:1

#### Scenario: A palette step fails contrast and a different step is chosen
- **WHEN** the "expected" primitive step for a token (e.g. matching an established weight pattern) fails the 4.5:1 threshold
- **THEN** a different step from the same hue family that does clear 4.5:1 SHALL be selected instead
- **AND** the reason for the deviation SHALL be documented in a comment alongside the token definition

### Requirement: Bespoke primitives for non-matching colors
A semantic color that does not closely match any available imported primitive step SHALL be defined as its own bespoke primitive (a named `:root` custom property holding a literal value), rather than being forced onto an ill-fitting imported step.

#### Scenario: Warm background has no matching neutral step
- **WHEN** a semantic token's target color (e.g. `--portfolio-bg-light`, a warm cream) has no reasonably close match in the imported neutral palette family
- **THEN** a bespoke primitive SHALL be defined holding that exact color value
- **AND** the semantic token SHALL reference that bespoke primitive, not an imported one

### Requirement: Effect tokens follow the same primitive-backing model where applicable
Single-value color tokens used for effects/surfaces (e.g. `--lightbox-backdrop`, `--section-border-color`, inline code background) SHALL reference a primitive the same way `--portfolio-*` semantic tokens do. Composite, multi-property values that are not a single color (e.g. `--media-frame-shadow`) are excluded from this requirement.

#### Scenario: Backdrop color references a primitive
- **WHEN** `--lightbox-backdrop` is defined for a given theme
- **THEN** its value SHALL reference a primitive token (imported or bespoke) rather than a literal color/opacity value written inline

#### Scenario: Composite shadow recipe is unaffected
- **WHEN** `--media-frame-shadow` is defined
- **THEN** it is explicitly out of scope for primitive-referencing, since it is a multi-layer shadow recipe rather than a single color value
