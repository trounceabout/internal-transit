import { defineCollection, z } from 'astro:content';

// Blog posts collection
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('Cody'),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    image: z.string().optional(), // Featured image path
  }),
});

// Podcast episodes collection
const podcast = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    episode: z.number(),
    pubDate: z.date(),
    description: z.string(),
    audioUrl: z.string().url(), // External hosting URL
    duration: z.string(), // Format: "45:23"
    fileSize: z.number(), // In bytes for RSS
    guests: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    transcript: z.string().optional(),
  }),
});

// Portfolio projects collection
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(), // Project completion/publish date
    tags: z.array(z.string()),
    client: z.string().optional(),
    role: z.string(), // e.g., "Designer", "Developer"
    link: z.string().url().optional(), // Live project URL
    featured: z.boolean().default(false),
    images: z.array(z.string()), // Array of image paths
  }),
});

export const collections = { blog, podcast, projects };
