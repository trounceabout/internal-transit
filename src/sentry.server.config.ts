// Server-side Sentry initialization — runs in Node (SSR / API routes).
// Server environment variables do NOT need the PUBLIC_ prefix because
// they are never sent to the browser. This file is picked up automatically
// by the @sentry/astro integration at build time.
import * as Sentry from "@sentry/astro";

Sentry.init({
  // SENTRY_DSN is your private DSN, kept server-side only.
  // Set it in .env (and in your Vercel project environment variables).
  dsn: import.meta.env.SENTRY_DSN,
});
