# Quick Start

## Local Development
```bash
# Install dependencies (already done)
bun install

# Start dev server
bun run dev

# Visit http://localhost:4321
```

## Build for Production
```bash
# Build static site
bun run build

# Preview production build
bun run preview
```

## Deploy to Vercel

### Option 1: GitHub + Vercel (Recommended)
1. Push to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Click "Deploy"
5. Set env vars if needed (see below)

### Option 2: Vercel CLI
```bash
bun add -g vercel
vercel
```

## Environment Variables

Create `.env.local` in project root:
```env
PUBLIC_BUTTONDOWN_USERNAME=your_username
PUBLIC_SITE_URL=https://yourdomain.com
```

Set same variables in Vercel dashboard: Settings → Environment Variables

## Content Management

### Add Blog Post
1. Create `src/content/blog/your-post.md`
2. Add frontmatter:
```yaml
---
title: "Post Title"
description: "Description"
pubDate: 2026-01-14
tags: ["tag1"]
---
```
3. Write markdown content
4. Run `bun run build` - post appears automatically

### Add Podcast Episode
1. Create `src/content/podcast/episode-2.md`
2. Add frontmatter with audio URL:
```yaml
---
title: "Episode Title"
episode: 2
pubDate: 2026-01-14
description: "Description"
audioUrl: "https://example.com/episode2.mp3"
duration: "45:32"
fileSize: 54525952
---
```
3. Run `bun run build`

### Add Portfolio Project
1. Create `src/content/projects/project-name.md`
2. Add frontmatter:
```yaml
---
title: "Project Name"
description: "Description"
date: 2026-01-14
tags: ["design"]
client: "Client"
role: "Designer"
featured: true
images: ["/images/img1.png"]
---
```
3. Run `bun run build`

## Useful Commands

```bash
# Development
bun run dev       # Start dev server
bun run build     # Build for production
bun run preview   # Preview production build

# Content validation
bun astro sync    # Regenerate content type definitions

# Clean
rm -rf dist       # Remove build output
rm -rf .astro     # Remove cache
bun install       # Reinstall dependencies
```

## URLs After Deploy

- **Homepage**: `https://yourdomain.com`
- **Blog**: `https://yourdomain.com/blog`
- **Blog Post**: `https://yourdomain.com/blog/welcome`
- **Blog RSS**: `https://yourdomain.com/blog/rss.xml`
- **Podcast**: `https://yourdomain.com/podcast`
- **Podcast Episode**: `https://yourdomain.com/podcast/episode-1`
- **Podcast RSS**: `https://yourdomain.com/podcast/rss.xml`
- **Portfolio**: `https://yourdomain.com/portfolio`
- **Project**: `https://yourdomain.com/portfolio/project-name`

## Brand Customization

**Colors** (`src/styles/global.css`):
```css
--transit-orange: #FF6B00;
--transit-beige: #F5F3F0;
--transit-charcoal: #2D2D2D;
```

**Header/Footer** (`src/components/Header.astro`, `src/components/Footer.astro`):
- Update navigation links
- Add social media links
- Change copyright year

**Logo/Icon**:
- Replace `public/internal-transit-header-v3.png`
- Replace `public/internal-transit-icon.png`

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 4321
lsof -i :4321
# Kill it
kill -9 <PID>
```

### Cache Issues
```bash
# Clear Astro cache
rm -rf .astro
bun run dev
```

### Build Fails
```bash
# Full rebuild from scratch
rm -rf dist .astro node_modules
bun install
bun run build
```

### Content Not Appearing
1. Check file is in correct folder (`src/content/blog/`, etc.)
2. Verify frontmatter has all required fields
3. Run `bun astro sync` to regenerate types
4. Check for YAML syntax errors

---

**Questions?** See `SETUP_GUIDE.md` for detailed documentation.
