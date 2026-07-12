import type { DocsTabId } from './types';

/* Redacted/trimmed content adapted from Undercurrent's real Storybook docs
   (Getting Started/Overview, Getting Started/Theming, Contributing/
   Development, Contributing/Component Standards, Contributing/Versioning).
   This is a portfolio demonstration of documentation quality and structure,
   not a verbatim mirror of the real docs site — each page is trimmed to a
   proportionate length and internal-only details (Slack channels, team
   handles, private git remotes, the real npm scope) have been removed or
   genericized. See the plan file for the exact confirmed redaction list. */

export const PACKAGE_NAME = '@undercurrent/core';

/* ─── Prose primitives ───────────────────────────────────────────────────
   Deliberately NOT real <p>/<h2>/<h3> tags — .article-body :global(p) and
   :global(h2) in ProjectLayout.astro force unwanted font/margin onto any
   bare tag of those types inside the MDX's rendered subtree (this bit the
   first two islands twice already). <ul>/<ol>/<li>, <strong>, and bare
   <code> are all safe (no global rule targets them) and used as real
   semantic tags below. */

function DocsHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-8 mb-3 text-lg font-semibold first:mt-0"
      style={{ color: 'var(--uc-demo-neutral-text-main)' }}
    >
      {children}
    </div>
  );
}

function DocsBody({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-4 text-sm leading-6 last:mb-0"
      style={{ color: 'var(--uc-demo-neutral-text-medium)' }}
    >
      {children}
    </div>
  );
}

function DocsList({ ordered, items }: { ordered?: boolean; items: React.ReactNode[] }) {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag
      className={`mb-4 space-y-1.5 pl-5 text-sm leading-6 last:mb-0 ${ordered ? 'list-decimal' : 'list-disc'}`}
      style={{ color: 'var(--uc-demo-neutral-text-medium)' }}
    >
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </Tag>
  );
}

function DocsCode({ children }: { children: React.ReactNode }) {
  return (
    <pre
      className="mb-4 overflow-x-auto rounded-lg p-4 text-xs leading-5 last:mb-0"
      style={{ backgroundColor: 'var(--uc-demo-neutral-bg-weak)', color: 'var(--uc-demo-neutral-text-main)' }}
    >
      <code className="bg-transparent p-0">{children}</code>
    </pre>
  );
}

/* ─── Overview ────────────────────────────────────────────────────────── */

function OverviewContent() {
  return (
    <>
      <DocsBody>
        Undercurrent is a customized Material UI component library that provides consistent styling and
        extended functionality across your applications. It's built on top of MUI and offers a consistent
        visual language, enhanced component functionality, and a simplified development experience through
        pre-styled components.
      </DocsBody>

      <DocsHeading>Component types</DocsHeading>
      <DocsBody>Undercurrent follows a component hierarchy:</DocsBody>
      <DocsList
        ordered
        items={[
          <>
            <strong className="font-semibold">Extended MUI components</strong> — add functionality to MUI
            components (e.g. <code>Button</code> with a loading state)
          </>,
          <>
            <strong className="font-semibold">Custom components</strong> — project-specific components (e.g.{' '}
            <code>Counter</code>, <code>Note</code>)
          </>,
          <>
            <strong className="font-semibold">Re-exported MUI components</strong> — MUI components exported
            directly with theme customizations (marked with an asterisk *)
          </>,
        ]}
      />

      <DocsHeading>Key features</DocsHeading>
      <DocsList
        items={[
          'Consistent theming — a unified visual language across all components',
          'Responsive design — components that work seamlessly on all device sizes',
          'Accessibility — built with accessibility in mind, following WCAG guidelines',
        ]}
      />
    </>
  );
}

/* ─── Theming ─────────────────────────────────────────────────────────── */

function ThemingContent() {
  return (
    <>
      <DocsBody>
        Undercurrent is intended to be used with a pre-configured theme that provides consistent styling
        across all components. It currently supports two themes — a default theme and an alternate brand
        theme — each extending MUI's theme with custom color palettes, typography, spacing, shadows, and
        component styles.
      </DocsBody>

      <DocsHeading>Using the default theme</DocsHeading>
      <DocsBody>
        Wrapping your application with the <code>ThemeProvider</code> applies the default theme in light
        mode:
      </DocsBody>
      <DocsCode>{`import { CssBaseline, ThemeProvider } from "${PACKAGE_NAME}";

const App = () => (
  <ThemeProvider>
    <CssBaseline />
    {/* Your application content */}
  </ThemeProvider>
);`}</DocsCode>

      <DocsHeading>Modes</DocsHeading>
      <DocsBody>
        The theme provides <code>light</code>, <code>dark</code>, and <code>system</code> modes. By default,
        mode is set to <code>system</code>, deriving from the OS preference. Use the <code>defaultMode</code>{' '}
        prop to change it, or the <code>useColorScheme</code> hook to read and update it at runtime:
      </DocsBody>
      <DocsCode>{`const { mode, setMode } = useColorScheme();

<Select value={mode} onChange={(e) => setMode(e.target.value)}>
  <MenuItem value="system">System</MenuItem>
  <MenuItem value="light">Light</MenuItem>
  <MenuItem value="dark">Dark</MenuItem>
</Select>`}</DocsCode>

      <DocsHeading>Customizing a theme</DocsHeading>
      <DocsBody>
        You can customize the theme by deep-merging your overrides on top of its options — semantic tokens,
        typography variants, and component styles can all be overridden without touching the base theme:
      </DocsBody>
      <DocsCode>{`const customTheme = createTheme(
  deepmerge(options, {
    colorSchemes: {
      light: { palette: { uc: { bg: { active: "red" } } } },
      dark: { palette: { uc: { bg: { active: "pink" } } } },
    },
    typography: {
      "body-md": { fontSize: "2rem", lineHeight: "2rem" },
    },
  })
);`}</DocsCode>
    </>
  );
}

/* ─── Development ─────────────────────────────────────────────────────── */

function DevelopmentContent() {
  return (
    <>
      <DocsBody>This guide outlines the process for developing and contributing to Undercurrent.</DocsBody>

      <DocsHeading>Development setup</DocsHeading>
      <DocsList
        ordered
        items={[
          <>
            Clone the repository and install dependencies:
            <DocsCode>{`git clone git@repo/undercurrent.git
cd undercurrent
npm install`}</DocsCode>
          </>,
          <>
            Launch Storybook:
            <DocsCode>{`npm run storybook`}</DocsCode>
          </>,
        ]}
      />

      <DocsHeading>Component creation guidelines</DocsHeading>
      <DocsBody>Each component should have its own directory:</DocsBody>
      <DocsCode>{`ComponentName/
├── ComponentName.tsx
├── ComponentName.stories.tsx
└── index.ts`}</DocsCode>
      <DocsBody>Components should extend MUI's own props interface and use forwardRef for proper ref handling:</DocsBody>
      <DocsCode>{`export interface ComponentNameProps extends MuiComponentNameProps {
  customProp?: boolean;
}

const ComponentName = forwardRef<
  React.ElementRef<typeof MuiComponentName>,
  ComponentNameProps
>((props, ref) => {
  return <MuiComponentName ref={ref} {...props} />;
});`}</DocsCode>

      <DocsHeading>Pull request process</DocsHeading>
      <DocsList
        ordered
        items={[
          <>
            Create a branch from <code>main</code>, referencing the corresponding ticket:
            <DocsCode>{`git checkout -b TICKET-123 origin/main`}</DocsCode>
          </>,
          'Make your changes, commit, and push to your branch',
          'Open a pull request against main and address review feedback',
        ]}
      />

      <DocsHeading>Release candidates</DocsHeading>
      <DocsBody>
        Before features land in a stable release, they can go through an RC process — a branch published
        under a pre-release npm tag so real consuming projects can test it before it merges. RC branches
        follow the naming convention <code>rc-&lt;feat-name&gt;</code>:
      </DocsBody>
      <DocsCode>{`npm version preminor --preid=rc-<feat-name>
git push -u origin rc-<feat-name>

# Consuming projects can then test it directly:
npm install ${PACKAGE_NAME}@rc-<feat-name>`}</DocsCode>
    </>
  );
}

/* ─── Component standards ─────────────────────────────────────────────── */

function ComponentStandardsContent() {
  return (
    <>
      <DocsBody>
        This document outlines the standard property types and values used consistently across all
        Undercurrent components.
      </DocsBody>

      <DocsHeading>Semantic color values</DocsHeading>
      <DocsBody>Use these semantic color values for any component's color prop:</DocsBody>
      <DocsCode>{`type SemanticColor = 'default' | 'success' | 'warning' | 'danger' | 'highlight';`}</DocsCode>

      <DocsHeading>Typography variants</DocsHeading>
      <DocsBody>
        All Typography components use a standardized variant system. Default Material UI variants (
        <code>h1</code>, <code>body1</code>, etc.) are not used:
      </DocsBody>
      <DocsCode>{`type TypographyVariant =
  | 'title-xs' | 'title-sm' | 'title-md' | 'title-lg' | 'title-xl' | 'title-2xl'
  | 'body-xs'  | 'body-sm'  | 'body-md'  | 'body-lg'  | 'body-xl'
  | 'label-xs' | 'label-sm' | 'label-md' | 'label-lg' | 'label-xl';`}</DocsCode>

      <DocsHeading>Implementation guidelines</DocsHeading>
      <DocsList
        items={[
          <>
            Always provide a default and use the semantic color system for any <code>color</code> prop
          </>,
          <>
            Always use the custom typography variants — never Material UI's defaults (<code>h1</code>,{' '}
            <code>body1</code>, etc.)
          </>,
          <>
            Keep prop naming consistent: <code>color</code> for semantic variants, <code>variant</code> for
            style variants, <code>size</code> for size, <code>disabled</code> for disabled state
          </>,
        ]}
      />
    </>
  );
}

/* ─── Versioning ──────────────────────────────────────────────────────── */

function VersioningContent() {
  return (
    <>
      <DocsBody>
        Undercurrent follows Semantic Versioning 2.0.0 (<code>MAJOR.MINOR.PATCH</code>), and maintains a
        single active major version at any given time. When a new major version ships, the previous one
        enters a limited support window before it's sunset.
      </DocsBody>

      <DocsHeading>Understanding version numbers</DocsHeading>
      <DocsList
        items={[
          <>
            <strong className="font-semibold">Major</strong> — large, foundational changes that require
            teams to update their implementation (e.g. reworking how theming works across all components)
          </>,
          <>
            <strong className="font-semibold">Minor</strong> — significant new features or localized
            breaking changes (e.g. adding a new component, or breaking a single component's API)
          </>,
          <>
            <strong className="font-semibold">Patch</strong> — small, safe updates with no breaking changes
            (bug fixes, minor layout adjustments, documentation updates)
          </>,
        ]}
      />

      <DocsHeading>Release candidates</DocsHeading>
      <DocsBody>
        Before a feature merges to the main branch, the team may publish a release candidate for real-world
        testing in a consuming project — useful when Storybook can't reproduce an issue, or when multiple
        developers need to test simultaneously:
      </DocsBody>
      <DocsCode>{`npm install ${PACKAGE_NAME}@rc-<feat-name>
# Example: npm install ${PACKAGE_NAME}@rc-dark-mode`}</DocsCode>
    </>
  );
}

export const DOCS_CONTENT: Record<DocsTabId, React.ReactNode> = {
  overview: <OverviewContent />,
  theming: <ThemingContent />,
  development: <DevelopmentContent />,
  'component-standards': <ComponentStandardsContent />,
  versioning: <VersioningContent />,
};
