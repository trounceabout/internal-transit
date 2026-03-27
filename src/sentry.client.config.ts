// Client-side Sentry initialization — runs in the browser.
// In Astro, environment variables must be prefixed with PUBLIC_ to be
// exposed to the browser. This file is picked up automatically by the
// @sentry/astro integration at build time.
import * as Sentry from "@sentry/astro";

Sentry.init({
  // PUBLIC_SENTRY_DSN is the browser-safe copy of your DSN.
  // Set it in .env (and in your Vercel project environment variables).
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
});
