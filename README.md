# Internal Transit

Personal site for a product designer. Includes a home page, portfolio work, and a blog/newsletter.

Live at [internaltransit.com](https://internaltransit.com).

---

## Stack

| Layer | Technology |
| --- | --- |
| Framework | [Astro 6](https://astro.build) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (Vite plugin) |
| UI components | [shadcn/ui](https://ui.shadcn.com) with [Base UI](https://base-ui.com) |
| Interactive islands | React 19 via `@astrojs/react` |
| Hosting | [Vercel](https://vercel.com) |
| Newsletter | [Buttondown](https://buttondown.email) |
| Error monitoring | [Sentry](https://sentry.io) |

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
