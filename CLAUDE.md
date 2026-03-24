# CLAUDE.md - Farmermarket.us Blog Automation

Instructions for AI assistants helping with blog post creation on Farmermarket.us.

## Project Overview

- **Type:** SvelteKit website with blog
- **Stack:** Svelte, TypeScript, Tailwind, Vercel
- **Content:** Farmers markets directory + blog posts

## Key Files

```
src/lib/content/blog/      # Blog markdown files
src/lib/services/blog.ts   # Post registry (MUST update)
static/images/blog/        # Blog images by month
prerender-config.cjs       # Pre-render slugs (MUST update)
```

## Creating a Blog Post

### Step 1: Research Topic

Use web search to find trending topics:
- "farmers market trends 2026"
- "seasonal produce [season]"
- "farmers market [topic]"

### Step 2: Write Post

Create markdown file in `src/lib/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "Brief description for SEO"
date: "2026-03-24"
author: "Farmermarket.us"
image: "/images/blog/2026-03/your-image.jpg"
excerpt: "Short preview for listings"
slug: "your-post-slug"
---

Your content here...
```

### Step 3: Register Post (CRITICAL)

Edit `src/lib/services/blog.ts`:
1. Import the new post: `import yourPost from '$lib/content/blog/your-file.md?raw';`
2. Add to `blogPostsData`: `{ slug: 'your-slug', content: yourPost }`

### Step 4: Add to Prerender (CRITICAL)

Edit `prerender-config.cjs` — add slug to `slugs` array.

### Step 5: Commit & Deploy

```bash
git add -A
git commit -m "Add blog post: [title]"
git push
```

Vercel auto-deploys on push.

## Image Guidelines

- Use existing images from `static/images/blog/`
- Check available months: `ls static/images/blog/`
- Format: `/images/blog/YYYY-MM/filename.jpg`
- If no existing image fits, note it in the PR

## Available Tools

- `Read` —查看现有博客文章格式
- `Write` —创建新博客文章
- `Edit` —更新 blog.ts 或 prerender-config.cjs
- `Bash` — git 操作

## Code Review Checklist

Before committing:
- [ ] Frontmatter complete (title, description, date, author, image, excerpt, slug)
- [ ] Registered in blog.ts
- [ ] Slug added to prerender-config.cjs
- [ ] Image path valid (file exists)
- [ ] Content is SEO-optimized with keywords

## Common Patterns

**Seasonal content:**
- Spring: asparagus, strawberries, radishes
- Summer: tomatoes, corn, berries
- Fall: apples, pumpkin, squash
- Winter: root vegetables, preserved goods

**Trending topics to check:**
- Local food movement
- Sustainable agriculture
- Farmers market recipes
- Seasonal eating benefits
- Community supported agriculture (CSA)