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

export const collections = { blog };
