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

Use the `last30days` skill to research what's trending and being discussed across Reddit, X/Twitter, YouTube, Hacker News, and the broader web. Example queries:

- "farmers market trends spring 2026"
- "seasonal produce what's in season now"
- "local food movement community sentiment"
- "farmers market recipes people are sharing"

The skill synthesizes findings into a grounded, cited report — use those sources and community discussions to pick a timely topic and inform the post's angle. Supplement with general web search if needed for specific facts or data.

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

### Step 1: Check What's Already in Use

Before selecting an image, run this command to see which images are already assigned to existing posts:

```bash
grep -h '^image:' src/lib/content/blog/*.md
```

**Do NOT reuse an image that is already assigned to another post.** Each blog post should have a unique hero image.

### Step 2: Browse Available Images

List all images by month folder:

```bash
ls static/images/blog/2026-03/
ls static/images/blog/2026-02/
ls static/images/blog/2025-07/
```

Format: `/images/blog/YYYY-MM/filename.jpg` (or `.avif`)

### Step 3: Match Image to Content

Choose an image whose filename clearly relates to the blog post topic. For example:

- A post about rhubarb → `rhubarb-spring.avif` (not a generic market shot)
- A post about spring greens → `spring-greens-spinach.avif` (not a fruit display)
- A post about herbs → `spring-herbs-*.avif` (not asparagus)

Prefer `.avif` files over `.jpg` when both exist — they're smaller and already optimized.

### Step 4: If No Suitable Image Exists

If no unused image matches the blog topic:

1. First, check if a new month folder is needed: `ls static/images/blog/`
2. Flag it as a **blocker** in the PR description — do not publish with a mismatched image
3. Use a placeholder path following the naming convention: `/images/blog/YYYY-MM/descriptive-name.avif`

### Quick Reference

```bash
# Full image audit: shows all images and which posts use them
grep -rh '^image:' src/lib/content/blog/*.md | sort
ls -R static/images/blog/
```

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
- [ ] Image is NOT already used by another post (run `grep -h '^image:' src/lib/content/blog/*.md`)
- [ ] Image content matches blog topic (filename should relate to subject matter)
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