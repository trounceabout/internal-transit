// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  // Update this to your real domain when you have one
  site: 'https://internaltransit.com',
  integrations: [
    react(),
    mdx(),
    // Sentry monitors errors on both server and client.
    // DSN is read from the SENTRY_DSN environment variable.
    sentry({
      dsn: import.meta.env.SENTRY_DSN,
      sourceMapsUploadOptions: {
        project: 'internal-transit',
        authToken: import.meta.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
  adapter: vercel(),
  vite: {
    // Tailwind v4 is a Vite plugin, not an Astro integration
    plugins: [tailwindcss()],
  },
});