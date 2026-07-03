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
  }),
});

// Projects collection — feeds the home page "Work" list. Data-only, no
// per-project pages. JSON rather than Markdown since there's no long-form
// body content, just structured fields.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/projects" }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    // Key name matching an export from @hugeicons/core-free-icons.
    icon: z.string(),
    // Icon color; omitted for the one plain-icon row.
    iconColor: z.string().optional(),
    // Badge background color; omitted for the one plain-icon row.
    badgeColor: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { blog, projects };
