# Internal Transit

My personal home on the internet. Lives at [internaltransit.com](https://internaltransit.com).

This is a portfolio site for my work as a product designer and design engineer, a blog that doubles as a newsletter, and eventually a podcast home. The point is full ownership — no platform middleman, no algorithmic feed, no dependency on a service that might disappear or change its terms. Everything here is mine.

---

## What it is

- **Portfolio** — case studies and work samples for product design and design engineering
- **Blog / newsletter** — writing that goes out as email to subscribers and lives permanently on the site
- **Podcast** — planned, not yet built

---

## The stack and why

**[Astro 6](https://astro.build)**
This is a content-first site, not an app. Astro generates static HTML by default, ships zero JavaScript unless you need it, and has first-class support for MDX content collections. Next.js would have been overkill — you don't need a full app framework to publish writing and show work.

**[Tailwind CSS v4](https://tailwindcss.com)**
v4 runs as a Vite plugin, which plays well with Astro's build pipeline. The new CSS-native config (no `tailwind.config.js`) keeps things cleaner. Utility-first means the design tokens live directly in the markup, which suits a solo project where there's no need for a separate design token layer.

**[shadcn/ui](https://ui.shadcn.com) + React 19 islands**
Most of the site is static Astro components. When something needs interactivity — a newsletter signup form, a toggle, a dialog — React drops in as an island via `@astrojs/react`. shadcn provides accessible, unstyled-first components that are copied into the project (not imported from a package), so there's no library lock-in and the code is fully under my control.

**[Buttondown](https://buttondown.email)**
API-first newsletter tooling. Subscribers are mine — I can export them anytime, point them at a different service, or self-host if I need to. It's the opposite of building your audience inside someone else's platform. The integration is a single API call.

**[Vercel](https://vercel.com)**
Astro has an official Vercel adapter and the deployment integration is seamless — push to `main`, site updates. Preview deployments per PR make it easy to review changes before they go live. No server config to manage.

**[Sentry](https://sentry.io)**
Error monitoring in production. Lightweight to set up, catches real-world issues that don't show up locally, and source map uploads mean stack traces point to actual source lines rather than minified output.

---

## Running locally

**Prerequisites**

- Node >= 22.12.0
- [bun](https://bun.sh)

**Steps**

```sh
# 1. Clone the repo
git clone https://github.com/trounceabout/internal-transit.git
cd internal-transit

# 2. Copy the env file and fill in your values (see Environment variables below)
cp .env.example .env

# 3. Install dependencies
bun install

# 4. Start the dev server
bun run dev
```

The dev server runs at `http://localhost:4321`.

---

## Environment variables

Copy `.env.example` to `.env` and fill in the values. The file is git-ignored — never commit it.

| Variable | Where to get it |
| --- | --- |
| `BUTTONDOWN_API_KEY` | Buttondown account settings → API |
| `SENTRY_DSN` | Sentry project settings → Client Keys (DSN) |
| `SENTRY_AUTH_TOKEN` | Sentry account settings → Auth Tokens (used for source map uploads at build time) |

None of these are required to run the site locally — omitting them just disables the newsletter integration and error reporting.

---

## Deployment

Pushing to `main` triggers an automatic production deployment on Vercel. No manual steps needed.

The Vercel project is connected to this repo. Environment variables are configured in the Vercel dashboard under project settings.

---

## Project structure

```
/
├── public/              # Static assets served as-is (favicon, images)
├── src/
│   ├── assets/          # Assets processed by Astro (optimized images, etc.)
│   ├── components/      # Astro and React components
│   ├── content/         # MDX content collections (blog posts, work)
│   ├── layouts/         # Page layout wrappers
│   ├── lib/             # Utility functions and helpers
│   ├── pages/           # File-based routing (each file = a route)
│   └── styles/          # Global styles and Tailwind config
├── .env.example         # Template for required environment variables
├── astro.config.mjs     # Astro configuration
└── package.json
```

---

## Common commands

All commands run from the project root.

| Command | What it does |
| --- | --- |
| `bun install` | Install dependencies |
| `bun run dev` | Start local dev server at `localhost:4321` |
| `bun run build` | Build the production site to `./dist/` |
| `bun run preview` | Preview the production build locally |
