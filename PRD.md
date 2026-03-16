# Farmermarket.us - Product Requirements Document

## Project Overview

**Farmermarket.us** is a directory and content platform for farmers markets across the United States. It combines:
- **Market Directory**: Searchable database of ~7,000+ farmers markets
- **Content Hub**: SEO-optimized blog with seasonal guides and recipes
- **Auto-Content Pipeline**: Automated blog post generation via cron jobs

**Tech Stack**: SvelteKit (static adapter), TypeScript, Tailwind CSS
**Hosting**: Vercel (auto-deploy from GitHub)
**Repo**: https://github.com/thewhatmatters/farmermarket.us

---

## Architecture

### Frontend
- **Framework**: SvelteKit with `@sveltejs/adapter-static`
- **Styling**: Tailwind CSS + custom color palette (farmers market vibes)
- **UI Components**: Custom components in `/src/lib/components/ui/`
- **Icons**: Phosphor Icons (`phosphor-svelte`)

### Data Layer
- **Market Data**: `src/lib/data/resources.json` (~700KB, ~7,000 markets)
- **Blog Content**: Markdown files in `src/lib/content/blog/`
- **Images**: Static assets in `static/images/blog/YYYY-MM/`

### Content Pipeline
- **Cron Jobs**: OpenClaw agents generate blog posts daily
- **Auto-Publish**: Git commits trigger Vercel deploys
- **Image Strategy**: Download unique images per post from Pexels/Wikimedia

---

## Directory Structure

```
/src
  /lib
    /components/ui/       # Reusable UI components
    /content/blog/        # Markdown blog posts
    /data
      resources.json      # Market database
    /services
      blog.ts             # Blog service with pagination
    /utils
      markdown.ts         # Markdown processing
  /routes
    /[state]/             # State pages (e.g., /texas)
    /[state]/[slug]/      # Individual market pages
    /blog/                # Blog index with pagination
    /blog/[slug]/         # Individual blog posts
/static
  /images/blog/           # Blog images organized by month
```

---

## Key Features

### 1. Market Directory
- Browse markets by state (`/[state]`)
- Individual market pages with details
- Search/filter capabilities
- Data sourced from USDA and manual curation

### 2. Blog System
**Current Posts** (8 total):
- Rhubarb: The Spring Treasure (Mar 2026)
- Planning Your March Farmers Market Visit (Mar 2026)
- Beyond Salad: Creative Ways to Use Spring Greens (Mar 2026)
- Spring Farmers Market Shopping Guide (Mar 2026)
- First Signs of Spring (Feb 2026)
- Farmer's Cheese 2026 Trend (Feb 2026)
- July 4th Recipes (Jul 2025)
- Your Local Food Adventure Starts Here (Jun 2025)

**Pagination**:
- Page 1: 7 posts (1 featured + 6 grid)
- Page 2+: 6 posts each
- Featured post is always the most recent

### 3. Auto-Content Pipeline
**Active Cron Jobs**:
| Job | Schedule | Purpose |
|-----|----------|---------|
| Daily Trends Research | 4:00 AM | Research trending topics |
| Farmers Market Discovery | 7:00 AM | Find new market data |
| Farmermarket Blog | 9:00 AM | Generate blog post |

**Content Strategy**:
- Seasonal focus (spring produce, holiday recipes)
- Trending topics from social/web
- Unique images downloaded per post
- Manual review before publishing

---

## Image Management

### Directory Structure
```
/static/images/blog/
  /2025-07/           # July 2025 posts
  /2026-02/           # February 2026 posts
  /2026-03/           # March 2026 posts
```

### Image Sources
- **Pexels**: Primary source for free stock photos
- **Wikimedia Commons**: Backup for specific subjects
- **Never**: Use generic/repeated images for different posts

### Process
1. Search for relevant CC0/public domain images
2. Download to correct month folder
3. Reference in blog post frontmatter:
   ```yaml
   image: '/images/blog/2026-03/march-market.jpg'
   ```

---

## Blog Post Format

### Frontmatter
```yaml
---
title: 'Post Title'
description: 'SEO meta description'
date: '2026-03-16'
author: 'FarmerMarket.us Team'
image: '/images/blog/2026-03/image-name.jpg'
excerpt: 'Short preview text'
tags: ['spring', 'produce', 'guide']
---
```

### Registration
Every blog post MUST be registered in `src/lib/services/blog.ts`:
```typescript
import postMd from '$lib/content/blog/post-slug.md?raw';

const blogPostsData = [
  { slug: 'post-slug', content: postMd },
  // ... other posts
];
```

---

## Known Issues & TODOs

### In Progress
- [ ] Fix Vercel build caching for image path updates
- [ ] Improve pagination for large post counts
- [ ] Add search to blog

### Ideas
- [ ] Newsletter signup
- [ ] Market owner dashboard
- [ ] User reviews/ratings
- [ ] Recipe index separate from blog

---

## Deployment

### Vercel Config (`vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "cleanUrls": true
}
```

### Build Process
1. `pnpm install` (or npm)
2. `pnpm build` → generates static site in `/build`
3. Vercel serves from `/build`

---

## Content Guidelines

### Blog Topics
- Seasonal produce guides
- Farmers market shopping tips
- Recipes using seasonal ingredients
- Vendor/farmer spotlights
- Market trends and news

### SEO Focus
- Long-tail keywords ("spring farmers market produce")
- Local SEO (state-specific content)
- Recipe schema markup
- Fast loading images (AVIF format preferred)

---

## Handoff Checklist

For another LLM taking over:

1. **Clone repo**: `git clone https://github.com/thewhatmatters/farmermarket.us`
2. **Install deps**: `pnpm install`
3. **Test build**: `pnpm build` (should complete without errors)
4. **Preview**: `pnpm preview`
5. **Check cron jobs**: Review OpenClaw cron jobs if maintaining auto-content
6. **Image workflow**: Always use unique images, never repeat generic ones
7. **Blog registration**: Remember to register new posts in `blog.ts`

---

## Contact & Resources

- **Owner**: Randy Digital (@randydigital)
- **Repo**: https://github.com/thewhatmatters/farmermarket.us
- **Live Site**: https://farmermarket.us
- **OpenClaw Workspace**: `~/.openclaw/workspace/skills/farmermarket-site-maintenance/`

---

*Last Updated: March 16, 2026*
