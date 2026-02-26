# FarmerMarket.us — Technical Analysis

**Analyzed:** 2026-02-26  
**Repo:** https://github.com/thewhatmatters/farmermarket.us

---

## Overview

A SvelteKit-based website for discovering farmers markets across the US. Static site (SSG) with 50 state pages and individual market listing pages.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | SvelteKit 2.x with Vite |
| Styling | Tailwind CSS 4.x + @tailwindcss/typography |
| Markdown | marked + gray-matter |
| Icons | phosphor-svelte |
| Maps | Google Maps API (@types/google.maps) |
| Adapter | @sveltejs/adapter-static (SSG) |

---

## Data Architecture

### Market Listings (`resources.json`)

**Location:** `src/lib/data/resources.json` (~700KB, 719K rows)

Single source of truth for all market data. Each entry contains:

```typescript
interface Resource {
  id: string
  title: string
  description: string        // Short description
  longDescription: string    // HTML (from markdown)
  image: string             // Path to image
  phone: string
  hours: {                  // By day
    monday: string
    tuesday: string
    // ...
  }
  externalUrl: string
  sponsored: boolean
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  coordinates: {
    lat: number
    lng: number
  }
}
```

**Key observation:** Data is manually maintained in JSON. No CMS. Edits require direct JSON manipulation or the `fixResourceIds.cjs` script.

---

## Page Structure

### 1. Homepage (`/`)

- **File:** `src/routes/+page.svelte`
- **Content:** Hero, filter bar, market cards grid
- **Filtering:** Client-side (by state, search)
- **Map:** `ResourceMap.svelte` component using Google Maps

### 2. State Pages (`/[state]`)

- **Route:** `src/routes/[state]/+page.svelte`
- **Generation:** Prerendered for all 50 US states
- **URL pattern:** `/alabama`, `/texas`, etc.
- **Content:** List of markets in that state

### 3. Market Detail Pages (`/[state]/[slug]`)

- **Route:** `src/routes/[state]/[slug]/+page.svelte`
- **Data loading:** Client-side filter from `resources.json`
- **URL pattern:** `/alabama/alabama-farmers-market`
- **Pristine:** Yes (static generation)

### 4. Blog (`/blog`)

- **Route:** `src/routes/blog/`
- **Content:** Markdown files in `src/lib/content/blog/`
- **Posts:**
  - `your-local-food-adventure-starts-here.md`
  - `july-4th-farmers-market-recipes.md`

---

## Blog System

### How Blog Posts Work

1. **Source:** Markdown files in `src/lib/content/blog/`
2. **Processing:** `src/lib/services/blog.ts` + `src/lib/utils/markdown.ts`
3. **Frontmatter:**
   ```yaml
   ---
   title: 'Your Local Food Adventure Starts Here'
   description: '...'
   date: '2025-06-23'
   author: 'FarmerMarket.us Team'
   image: '/farmermarket-og.png'
   excerpt: '...'
   ---
   ```
4. **Rendering:** `marked` converts MD → HTML, `gray-matter` extracts frontmatter
5. **Reading time:** Auto-calculated (200 words/min)

### Adding a New Blog Post

1. Create `.md` file in `src/lib/content/blog/`
2. Add frontmatter (title, description, date, etc.)
3. Write content in Markdown
4. Rebuild — automatically picked up

---

## Component Architecture

### Key Components

| Component | Purpose |
|-----------|---------|
| `ResourceMap.svelte` | Google Maps integration with market markers |
| `FilterBar.svelte` | Search/filter UI |
| `ResourceCard.svelte` | Market preview card |
| `BlogCard.svelte` | Blog post preview |
| `Hero.svelte` | Homepage hero section |
| `Navigation.svelte` | Site navigation |

### UI Components (`src/lib/components/ui/`)

- Accordion, Ad, Breadcrumbs, Button, Chip
- FloatingViewToggle, GoogleAd, OptimizedImage
- Pagination, ResourceCard, ResourceMap, SEO, TabGroup

---

## Static Generation (SSG)

All pages are prerendered at build time:

```typescript
// src/routes/[state]/+page.ts
export const prerender = true;

export function entries() {
  return states.map((state) => ({ state: slugify(state) }));
}
```

This means:
- No server-side rendering at runtime
- Fast page loads
- No dynamic data fetching on page load

---

## State Management

- **Svelte stores:** Minimal (likely for UI state like filters)
- **No external state:** Everything is local to each page

---

## SEO

- `SEO.svelte` component for meta tags
- `sitemap.xml` route
- `llms.txt` route (for AI indexing)

---

## How to Add a New Market

1. **Add to `resources.json`:**
   ```json
   {
     "id": "999",
     "title": "New Market Name",
     "description": "...",
     "address": { "city": "...", "state": "..." },
     "coordinates": { "lat": 0, "lng": 0 }
   }
   ```

2. **Add image:** Place in `/images/resources/[state]/`

3. **Rebuild:** `pnpm build`

---

## How to Add a New Blog Post

1. Create `src/lib/content/blog/my-new-post.md`
2. Add frontmatter + content
3. Rebuild

---

## Dependencies

### Production
- `marked` — Markdown parsing
- `gray-matter` — Frontmatter extraction
- `phosphor-svelte` — Icons

### Dev
- SvelteKit 2.x
- Tailwind CSS 4.x
- TypeScript
- Vite

---

## Strengths

- Fast (static generation)
- Simple (no CMS, no database)
- SEO-friendly
- Easy to deploy (static files)

---

## Limitations

- **Manual data entry** — No CMS, edit JSON directly
- **No dynamic content** — Blog posts require rebuild
- **Large JSON file** — 700KB+ can slow editor
- **No search API** — Client-side filtering only

---

## Future Considerations

- Add CMS (Sanity, Contentful, or Strapi) for easier content management
- Implement incremental builds for faster rebuilds
- Add Algolia or similar for search
- Consider dynamic data fetching for market hours (real-time)
