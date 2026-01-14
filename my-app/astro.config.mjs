// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/static';

// https://astro.build/config
/**
 * Astro Configuration
 *
 * This configuration sets up:
 * - Tailwind CSS v3 for styling via @astrojs/tailwind integration
 * - Vercel adapter for static site generation and deployment
 * - RSS feed generation for blog and podcast
 *
 * To deploy to Vercel:
 * 1. Push this repository to GitHub
 * 2. Connect the repository to Vercel (https://vercel.com/new)
 * 3. Set PUBLIC_SITE_URL in Vercel's environment variables
 * 4. Vercel will automatically detect Astro and build appropriately
 */
export default defineConfig({
  // The public-facing URL where the site will be deployed
  // Update this to your actual domain
  // Default falls back to example.com if environment variable is not set
  site: import.meta.env.PUBLIC_SITE_URL || 'https://internal-transit.example.com',

  // Set output to static for optimal Vercel performance
  // This pre-renders all pages at build time
  output: 'static',

  // Astro integrations for enhanced functionality
  integrations: [tailwind()],

  // Vercel adapter configuration for static site deployment
  adapter: vercel({
    // Enable Vercel Web Analytics for performance monitoring
    analytics: true,
    webAnalytics: {
      enabled: true,
    },
  }),
});