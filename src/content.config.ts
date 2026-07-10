import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Astro 6 uses loader-based collections instead of type: 'content'.
// glob() scans the given directory and loads all matching files.

// Blog collection — for posts that also go out as newsletter issues
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    // Word or short phrase from `title` to render italicized, in the post's
    // primary-category color, on the article page's headline. Optional —
    // posts without it just render the plain title with no accent.
    accentWord: z.string().optional(),
  }),
});

// Projects collection — feeds the home page "Work" list AND individual
// case-study pages at /projects/[slug]. MDX rather than JSON since finished
// case studies carry a long-form body, not just structured list fields.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    // Key into projectIconMap (src/lib/projectIconMap.ts), which resolves it to a pixelarticons/react component.
    icon: z.string(),
    // Icon color; omitted for the one plain-icon row. Used as-is in both
    // themes unless iconColorDark is also set.
    iconColor: z.string().optional(),
    // Dark-mode override for iconColor — only needed when the light-mode
    // value doesn't have enough contrast against the dark background too.
    iconColorDark: z.string().optional(),
    // Badge background color; omitted for the one plain-icon row.
    badgeColor: z.string().optional(),
    // Dark-mode override for badgeColor, same reasoning as iconColorDark.
    badgeColorDark: z.string().optional(),
    order: z.number().default(0),

    // --- Case-study page only — all optional so a project can appear in the
    // home page list before its case-study page is written. ---
    // Longer dek paragraph shown on the case-study page; falls back to
    // `tagline` when omitted, since the home-page-list tagline is often too
    // short to work as full intro copy.
    description: z.string().optional(),
    // Substring of `description` (or `tagline`, as a fallback) to render
    // italicized in the project's own `iconColor` — same technique as the
    // blog's `accentWord`, just colored per-project instead of by category.
    accentPhrase: z.string().optional(),
    // Loom share URL, e.g. https://www.loom.com/share/<id>. Hidden by
    // default on the case-study page until the reader clicks "Watch the
    // overview" — see ProjectLayout.astro.
    loomUrl: z.string().url().optional(),
    embedCaption: z.string().optional(),
    // Case-study "properties" row shown next to the overview toggle —
    // matches the fixed Role/Scope fields every finished case study carries.
    role: z.string().optional(),
    scope: z.string().optional(),
    // Whether the case-study page is finished and should be linked to from
    // the home page list. Stub projects stay `false` until written.
    published: z.boolean().default(false),
  }),
});

export const collections = { blog, projects };
