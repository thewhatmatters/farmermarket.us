# FarmerMarket.us — Product Requirements Document

**Last Updated:** 2026-03-22
**Analyzed by:** Conan AIF
**Repo:** https://github.com/thewhatmatters/farmermarket.us
**Live Site:** https://farmermarket.us
**Owner:** Randy Daniel

---

## Project Overview

**FarmerMarket.us** is a static, SEO-first directory and content platform for farmers markets across the United States. It combines:

- **Market Directory** — Curated database of 397 farmers markets across all 50 states
- **Content Hub** — SEO-optimized blog with seasonal guides, recipes, and trend reporting
- **Automated Content Pipeline** — AI-driven blog post generation via scheduled cron jobs (Mon/Wed/Fri 8am CT)

The site is fully static (pre-rendered at build time) and auto-deploys to Vercel on every `main` push.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | SvelteKit 2.x (Svelte 5) with Vite 6 |
| Adapter | `@sveltejs/adapter-static` — full SSG |
| Styling | Tailwind CSS 4.x + `@tailwindcss/typography` |
| Markdown | `gray-matter` (frontmatter) + `marked` (rendering) |
| Icons | `phosphor-svelte` v3 |
| Maps | Google Maps API (`@types/google.maps`) |
| Hosting | Vercel (auto-deploy from GitHub `main`) |
| Build | `npm run build` → `/build` output directory |

**Key config:**
- `svelte.config.js` — static adapter, prerender entries sourced from `prerender-config.cjs`
- `vercel.json` — `cleanUrls: true`, framework set to `null` (pure static)
- `prerender-config.cjs` — generates all route entries from `resources.json` at build time
- TypeScript throughout; `svelte-check` for type validation

---

## Architecture

### Data Layer

**Market data** (`src/lib/data/resources.json`)
- 397 markets across all 50 states (~700KB)
- Flat JSON array — no CMS, no database
- Each entry: `id`, `title`, `description`, `longDescription` (HTML), `image`, `phone`, `hours` (by day), `externalUrl`, `sponsored`, `address`, `coordinates`
- Edits require direct JSON manipulation or `fixResourceIds.cjs` script
- `usedImages.ts` lives at `src/lib/data/usedImages.ts` — flat array of all image filenames ever used

**Blog content** (`src/lib/content/blog/`)
- Markdown files with YAML frontmatter
- Processed via `src/lib/utils/markdown.ts` (gray-matter + marked)
- Registered manually in `src/lib/services/blog.ts` — **every new post must be imported and added to `blogPostsData` array**
- Sorted by date descending at runtime

**Images** (`static/images/blog/YYYY-MM/`)
- Organized by month
- AVIF preferred (some .jpg/.png fallbacks remain)
- Existing months: `2025-07/`, `2026-02/`, `2026-03/`
- Market images: `static/images/resources/[state]/`

### Routing

| Route | Description |
|---|---|
| `/` | Homepage — hero, filter bar (by state), market card grid, map view toggle |
| `/[state]` | State page — filtered list of markets for that state |
| `/[state]/[slug]` | Individual market detail page with address, hours, map, ad |
| `/blog` | Blog index — paginated (7 on p1 with featured hero, 6 on p2+) |
| `/blog/[slug]` | Individual blog post |
| `/faq` | FAQ page |
| `/privacy`, `/terms` | Legal pages |
| `/sitemap.xml` | Auto-generated XML sitemap (prerendered) |
| `/llms.txt` | LLM-readable site summary |

All routes are statically pre-rendered. Blog post routes must be explicitly listed in `prerender-config.cjs`.

### Blog System

**Registration flow (required for every new post):**
1. Write markdown to `src/lib/content/blog/[slug].md`
2. Add `import` in `src/lib/services/blog.ts`
3. Add `{ slug, content }` entry to `blogPostsData` array in the same file
4. Add `/blog/[slug]` to `prerender-config.cjs`
5. Run `npm run build` to validate
6. Commit and push — Vercel auto-deploys

**Pagination:**
- Page 1: 7 posts (1 featured hero + 6 grid)
- Page 2+: 6 posts each
- Featured post = most recent by date

**Frontmatter schema:**
```yaml
---
title: 'Title (60-70 chars for SEO)'
description: 'Meta description (150-160 chars)'
date: 'YYYY-MM-DD'
author: 'FarmerMarket.us Team'
image: '/images/blog/YYYY-MM/filename.avif'
excerpt: 'Short preview (under 200 chars)'
tags: ['tag1', 'tag2']
---
```

### Ad System

Configured in `src/lib/config.ts`:
- Custom ad pool (currently: Root Cellar — `root-cellar.avif`)
- Inserted after row 1 in grid (after 4 items in a 4-col layout)
- Also shown on individual resource pages
- Google Ads slot configured (`5218673632`) but not yet active — `enabled: true` but logic is commented out
- `getRandomAd()` / `shouldDisplayAd()` / `getAdInsertIndex()` utility functions in `src/lib/utils/ads.ts`

### Image Pipeline (Blog)

For new blog posts:
1. Check `src/lib/data/usedImages.ts` — skip any filename already listed
2. Download new images via Scrapling (stealthy headers)
3. Convert to AVIF via `ffmpeg` (codec: `libavc1`)
4. Place in `static/images/blog/YYYY-MM/`
5. Register filenames in `src/lib/data/usedImages.ts`
6. Reference in post frontmatter as `/images/blog/YYYY-MM/filename.avif`

Image sources (priority order): Pexels → Wikimedia Commons → Unsplash

---

## Component Inventory

**Layout components** (`src/lib/components/layout/`):
- `Navigation.svelte` — top nav, accepts `latestBlogPost` prop
- `Footer.svelte`
- `Hero.svelte`
- `FilterBar.svelte` — state/search filter controls

**UI components** (`src/lib/components/ui/`):
- `ResourceCard.svelte` — market listing card
- `ResourceMap.svelte` — Google Maps embed
- `BlogCard.svelte` — blog post card (inferred from blog index)
- `Pagination.svelte`
- `Ad.svelte` — custom ad renderer
- `GoogleAd.svelte` — Google Ads renderer (built, not yet active)
- `Chip.svelte` — filter pill
- `Button.svelte`
- `Breadcrumbs.svelte`
- `FloatingViewToggle.svelte` — map/list view toggle (has own CSS chunk)
- `TabGroup.svelte`
- `Accordion.svelte`
- `OptimizedImage.svelte`
- `SEO.svelte`
- `SkipLink.svelte` — accessibility

---

## Content Inventory

### Blog Posts (13 total, as of 2026-03-22)

| Slug | Date | Topic |
|---|---|---|
| `spring-market-season-opens-2026` | 2026-03-22 | Spring opening — what to buy now |
| `hyperlocal-sourcing-spring-2026` | 2026-03-17 | Hyper-local revolution / USDA funding |
| `7-farmers-market-trends-spring-2026` | 2026-03-16 | Spring 2026 market trends |
| `spring-herbs-kitchen-2026` | 2026-03-11 | Spring herbs guide |
| `rhubarb-spring-treasure-2026` | 2026-03-09 | Rhubarb deep-dive |
| `spring-greens-creative-uses-2026` | 2026-03-04 | Beyond salad — spring greens |
| `spring-farmers-market-shopping-guide-2026` | 2026-03-02 | Shopping guide |
| `planning-march-farmers-market-visit` | 2026-03-06 | March visit planning |
| `spring-awakening-first-fresh-finds` | 2026-02-27 | First spring finds |
| `spring-produce-march-2026` | 2026-02-27 | First signs of spring |
| `farmers-cheese-2026-trend` | 2026-02-26 | Farmer's cheese trend |
| `july-4th-farmers-market-recipes` | 2025-07-01 | July 4th recipes |
| `your-local-food-adventure-starts-here` | 2025-06-23 | Site intro post |

**Note:** `7-farmers-market-trends-spring-2026` and `spring-awakening-first-fresh-finds` are present as markdown files but are **NOT registered** in `blog.ts` or `prerender-config.cjs`. They will not render unless registered.

### Market Data (397 markets, 50 states)

Evenly distributed across all states. Each market has: title, description, long description (HTML), image, phone, hours, external URL, address, coordinates, sponsored flag.

---

## Deployment

```
git push origin main
  → Vercel webhook triggers
  → npm run build
  → Static site output to /build
  → Deployed globally via Vercel CDN
```

Build validates all prerender entries. If a route is referenced in `prerender-config.cjs` but not registered in `blog.ts`, the build will fail.

---

## Known Issues & Gaps

### Critical
- **`prerender-config.cjs` is out of sync** — only 3 blog posts explicitly listed (`your-local-food-adventure-starts-here`, `farmers-cheese-2026-trend`, `spring-produce-march-2026`). Most newer posts are NOT listed. Build may be generating routes via another mechanism or some posts are not being prerendered correctly.
- **`7-farmers-market-trends-spring-2026` not registered** in `blog.ts` — file exists but is unreachable
- **`spring-awakening-first-fresh-finds` not registered** in `blog.ts` — file exists but is unreachable
- **`usedImages.ts` is incomplete** — only 9 filenames tracked, but 48+ images exist in `2026-02/` alone. Deduplication is not enforced in practice.

### Technical Debt
- `prerender-config.cjs` uses CommonJS `require()` — inconsistent with the ES module project
- Some blog posts have `.jpg` fallbacks alongside `.avif` in static folder — not cleaned up
- `shopping-guide-2.jpg` exists in `2026-02/` without an `.avif` counterpart
- Google Ads integration is half-built (slot configured, component exists, but logic commented out)
- `spring-herbs-kitchen-2026` uses `march-market.jpg` as its hero image — shares with `planning-march-farmers-market-visit`; not a unique image

### Missing Features
- No `usedImages.ts` enforcement in the automation pipeline (manual check required)
- No automated `prerender-config.cjs` update — must be done manually per post
- No search within blog
- No tag/category filtering on blog index
- No newsletter/email capture
- No market owner dashboard or review system

---

## Automated Content Pipeline

**Schedule:** Mon / Wed / Fri at 8:00 AM CT
**Skill:** `fm-blog-automation` (defined in Conan AIF project skills)
**Execution:** Conan agent → research → write → images → register → build validate → git push

**Pipeline steps:**
1. `last30days` research — seasonal produce + farmers market trends
2. Topic selection — highest engagement signal, not recently covered
3. Write markdown (800–1,200 words, warm tone, 2nd person)
4. Source 3–4 images (Pexels → Wikimedia → Unsplash via Brave Image API + Scrapling)
5. Convert to AVIF via ffmpeg
6. Register images in `src/lib/data/usedImages.ts`
7. Register post in `src/lib/services/blog.ts`
8. Add route to `prerender-config.cjs`
9. `npm run build` — validate before committing
10. `git commit` + `git push origin main`

---

## SEO Strategy

- Static HTML for all pages — fully crawlable
- Individual market pages: title = `[Market Name] | FarmerMarket.us`
- Blog posts: full Open Graph + Twitter card meta
- XML sitemap auto-generated at `/sitemap.xml` (includes markets, states, blog posts)
- `/llms.txt` for LLM discoverability
- Canonical URLs on all pages
- AVIF images for performance (Core Web Vitals)
- `@tailwindcss/typography` for blog post readability

---

## Handoff Checklist

For any developer or agent taking over:

1. **Clone:** `git clone https://github.com/thewhatmatters/farmermarket.us`
2. **Install:** `npm install`
3. **Test build:** `npm run build` — must complete with zero errors
4. **Preview:** `npm run preview`
5. **Add a blog post:** Follow 5-step registration process (markdown → blog.ts → prerender-config.cjs → build → push)
6. **Image deduplication:** Always check `src/lib/data/usedImages.ts` before sourcing images
7. **Never reuse images** across blog posts — filename must be unique
8. **Ad config:** `src/lib/config.ts` — add custom ads to `customAds` array
9. **Market data:** Edit `src/lib/data/resources.json` directly; run `fixResourceIds.cjs` after bulk edits
10. **Cron jobs:** Managed via Conan AIF — `fm-blog-automation` skill handles full pipeline

---

## Future Roadmap

- [ ] Automate `prerender-config.cjs` updates in blog pipeline
- [ ] Enforce `usedImages.ts` deduplication in pipeline (fail if duplicate found)
- [ ] Activate Google Ads (slot `5218673632` already configured)
- [ ] Blog tag/category filtering
- [ ] Newsletter / email capture integration
- [ ] Search across markets and blog
- [ ] Market owner claim + update flow
- [ ] Recipe index separate from blog
- [ ] SNAP/EBT filter for market directory
- [ ] Seasonal produce calendar feature

---

*Generated by Conan AIF analysis — 2026-03-22*
