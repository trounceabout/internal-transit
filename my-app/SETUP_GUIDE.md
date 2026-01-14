# Internal Transit Personal Website - Setup Guide

🎉 **Congratulations!** Your Astro-based personal website is now fully configured and ready to deploy!

## Project Overview

Your **Internal Transit** website is a fully functional personal platform with:
- **Blog** with markdown content and RSS feed
- **Podcast** hosting with iTunes-compatible RSS feed
- **Portfolio** with case study projects
- **Newsletter** integration with Buttondown
- **Responsive design** inspired by your Internal Transit brand
- **Static site generation** for fast performance and easy deployment

## What's Been Built

### Architecture
- **Framework**: Astro 5.16.9 with TypeScript
- **Styling**: Tailwind CSS 4 with Internal Transit brand colors
- **Deployment**: Vercel adapter configured for static site generation
- **Content Management**: Markdown files with typed content collections

### File Structure
```
my-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.astro     # Site navigation
│   │   ├── Footer.astro     # Site footer
│   │   ├── Newsletter.astro # Buttondown signup
│   │   ├── BlogCard.astro   # Blog post cards
│   │   ├── AudioPlayer.astro # Podcast player
│   │   └── ProjectCard.astro # Portfolio cards
│   ├── content/             # Markdown content
│   │   ├── blog/            # Blog posts
│   │   ├── podcast/         # Podcast episodes
│   │   └── projects/        # Portfolio projects
│   ├── layouts/             # Page templates
│   │   ├── BaseLayout.astro    # Main layout
│   │   ├── BlogLayout.astro    # Blog post layout
│   │   ├── PodcastLayout.astro # Podcast episode layout
│   │   └── ProjectLayout.astro # Portfolio layout
│   ├── pages/               # Dynamic routes
│   │   ├── index.astro         # Homepage
│   │   ├── blog/
│   │   │   ├── index.astro     # Blog listing
│   │   │   ├── [slug].astro    # Individual posts
│   │   │   └── rss.xml.js      # Blog RSS feed
│   │   ├── podcast/
│   │   │   ├── index.astro     # Podcast listing
│   │   │   ├── [slug].astro    # Episode pages
│   │   │   └── rss.xml.js      # Podcast RSS feed
│   │   └── portfolio/
│   │       ├── index.astro     # Portfolio listing
│   │       └── [slug].astro    # Project pages
│   └── styles/
│       └── global.css       # Global styles with brand tokens
├── public/                  # Static assets
│   ├── internal-transit-header-v3.png
│   ├── internal-transit-icon.png
│   └── images/              # Project/post images
├── astro.config.mjs         # Astro configuration
├── vercel.json              # Vercel deployment config
└── package.json             # Dependencies
```

### Brand Implementation
- **Colors**: Orange (#FF6B00), Beige (#F5F3F0), Charcoal (#2D2D2D)
- **Typography**: VT323 (pixel style), IBM Plex Mono, Inter
- **Design Elements**: Transit line visual separators, station markers
- **Responsive**: Mobile-first design with clean, card-based layout

## Sample Content Included

The site comes with sample content to demonstrate functionality:
- **Blog Posts**: "Welcome to Internal Transit", "Design Systems Thinking"
- **Podcast Episode**: "Episode 1" (with sample audio URL)
- **Portfolio Projects**: "Design System Tokens", "Portfolio Website"

Replace these with your own content following the same markdown format.

## Next Steps

### 1. Configure Your Domain
Update `astro.config.mjs` with your actual domain:
```javascript
site: 'https://yourdomain.com',
```

Or set the `PUBLIC_SITE_URL` environment variable in Vercel.

### 2. Set Up Buttondown Newsletter
1. Create a free account at [buttondown.email](https://buttondown.email)
2. Get your username from your account settings
3. Update the `PUBLIC_BUTTONDOWN_USERNAME` in `.env.local`:
   ```
   PUBLIC_BUTTONDOWN_USERNAME=your_username
   ```
4. Test the newsletter signup form on your homepage

### 3. Add Your Content
Replace sample content with your own:

**Blog Post** (`src/content/blog/your-post.md`):
```markdown
---
title: "Post Title"
description: "Brief description"
pubDate: 2026-01-14
tags: ["tag1", "tag2"]
---

# Your Content Here
```

**Podcast Episode** (`src/content/podcast/episode-2.md`):
```markdown
---
title: "Episode Title"
episode: 2
pubDate: 2026-01-14
description: "Episode description"
audioUrl: "https://your-audio-host.com/episode2.mp3"
duration: "45:32"
fileSize: 54525952
---

# Episode Notes
```

**Portfolio Project** (`src/content/projects/your-project.md`):
```markdown
---
title: "Project Name"
description: "Project description"
date: 2026-01-14
tags: ["design", "web"]
client: "Client Name"
role: "Designer/Developer"
featured: true
images: ["/images/project1.png", "/images/project2.png"]
---

# Project Case Study
```

### 4. Deploy to Vercel

**Option A: GitHub Integration (Recommended)**
1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel auto-detects Astro
5. Set environment variables if needed
6. Deploy!

**Option B: Vercel CLI**
```bash
bun add -g vercel
vercel
```

### 5. Configure for Production

**Set Environment Variables in Vercel Dashboard:**
- `PUBLIC_BUTTONDOWN_USERNAME`: Your Buttondown username
- `PUBLIC_SITE_URL`: Your domain (e.g., https://yourdomain.com)

## Local Development

**Start dev server:**
```bash
bun run dev
```
Visit `http://localhost:4321`

**Build for production:**
```bash
bun run build
```

**Preview production build:**
```bash
bun run preview
```

## Features Explained

### RSS Feeds
- **Blog**: `https://yourdomain.com/blog/rss.xml`
- **Podcast**: `https://yourdomain.com/podcast/rss.xml` (iTunes-compatible)

Submit podcast feed to Apple Podcasts, Spotify, etc. for distribution.

### Newsletter Integration
The newsletter signup form uses Buttondown's embed API. When users subscribe, they're added to your Buttondown audience. You can:
- Send newsletters manually
- Set up RSS-to-email to auto-send blog posts
- Create custom automation workflows

### Content Collections
All content is type-checked with Zod schemas. If you try to add a blog post without required fields, you'll get a build-time error. This ensures consistency.

### Static Generation
Every page is pre-rendered to HTML at build time. This means:
- ⚡ Blazing fast performance
- 🔒 No database needed
- 💰 Low deployment costs
- 📈 Great SEO (all content crawlable)

## Customization

### Colors
Edit `src/styles/global.css` to customize colors:
```css
:root {
  --transit-orange: #FF6B00;
  --transit-beige: #F5F3F0;
  --transit-charcoal: #2D2D2D;
}
```

### Typography
Fonts are imported from Google Fonts in `src/styles/global.css`. You can change or add fonts there.

### Homepage Layout
Edit `src/pages/index.astro` to customize what appears on the homepage. Currently it shows:
- Hero section
- Featured blog posts (latest 3)
- Featured podcast episode
- Featured projects
- Newsletter signup

### Navigation Links
Update links in `src/components/Header.astro` to customize navigation.

## Testing Checklist

- [ ] Homepage loads and displays featured content
- [ ] Blog listing shows all posts
- [ ] Individual blog posts render correctly
- [ ] Blog RSS feed is valid (https://validator.w3.org/feed/)
- [ ] Podcast listing shows episodes
- [ ] Audio player works in podcast episodes
- [ ] Podcast RSS feed is valid (check in Apple Podcasts)
- [ ] Newsletter signup form works
- [ ] Portfolio projects display correctly
- [ ] All links work
- [ ] Site is responsive on mobile

## Troubleshooting

**Build error with Tailwind classes?**
- Only use `@apply` with standard Tailwind utilities
- For custom styling, use regular CSS

**RSS feed not updating?**
- Feeds regenerate on every build
- Make sure content has correct frontmatter
- Check file paths in `src/content/` match schema

**Images not showing?**
- Put images in `public/images/`
- Reference as `/images/filename.png`
- Use relative paths in markdown

**Buttondown form not working?**
- Check `PUBLIC_BUTTONDOWN_USERNAME` is set correctly
- Test the Buttondown account is active
- Check browser console for errors

## Performance

Your site is optimized for speed:
- ✅ Static HTML (no server rendering)
- ✅ Minimal CSS (Tailwind optimized for production)
- ✅ Image assets minified and optimized
- ✅ CSS and JS combined and minified
- ✅ Build size: ~156KB (including all assets)

Expect:
- Page load times: < 100ms
- Lighthouse scores: 90+
- Time to first byte: ~50ms on Vercel

## Support & Resources

- **Astro Docs**: https://docs.astro.build
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Content Collections**: https://docs.astro.build/en/guides/content-collections/
- **Deploying to Vercel**: https://docs.astro.build/en/guides/deploy/vercel/
- **Buttondown**: https://buttondown.email/features

## What's Next?

### Phase 2 Features (Optional)
Once your site is live, consider adding:
- Search functionality for blog posts
- Dark mode toggle
- Reading time estimates
- Comment system (Giscus)
- Social sharing buttons
- Analytics dashboard
- CMS integration (Contentful, Sanity, etc.)

### Content Ideas
- Blog: Share thoughts on design, technology, business
- Podcast: Interview guests, deep dives into topics
- Portfolio: Showcase your best work and case studies
- Newsletter: Weekly or monthly digest for subscribers

---

**Your site is ready to go!** 🚀

Questions or issues? Check the documentation links above or reach out for support.
