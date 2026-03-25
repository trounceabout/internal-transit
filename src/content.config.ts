import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Astro 6 uses loader-based collections instead of type: 'content'.
// glob() scans the given directory and loads all matching files.

// Blog collection — for posts that also go out as newsletter issues
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

// Work collection — for portfolio case studies
const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    year: z.number(),
    tags: z.array(z.string()).default([]),
    // Optional external URL if the project lives elsewhere
    url: z.string().url().optional(),
    // Optional cover image path (relative to /public)
    coverImage: z.string().optional(),
  }),
});

export const collections = { blog, work };
