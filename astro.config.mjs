// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import sentry from "@sentry/astro";

// https://astro.build/config
export default defineConfig({
  // Update this to your real domain when you have one
  site: "https://internaltransit.com",
  integrations: [
    react(),
    mdx(),
    // Sentry monitors errors on both server and client.
    // DSN is now set in src/sentry.client.config.ts and src/sentry.server.config.ts
    // (passing dsn directly here is deprecated).
    // sourceMapsUploadOptions stays here because it controls the build-time
    // source map upload step, not the runtime SDK.
    sentry({
      sourceMapsUploadOptions: {
        project: "internal-transit",
        authToken: import.meta.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
  adapter: vercel(),
  vite: {
    // Tailwind v4 is a Vite plugin, not an Astro integration
    plugins: [tailwindcss()],
  },
  experimental: {
    // rustCompiler: true, — disabled: native binary fails to install on Vercel's build environment
    // Queued rendering replaces recursive rendering with a two-pass queue.
    // Planned to become the default in Astro v7 — safe to enable now.
    queuedRendering: { enabled: true },
  },
});
