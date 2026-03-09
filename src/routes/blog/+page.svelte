<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Calendar, Clock, User, ArrowUpRight } from 'phosphor-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { paginatePosts } from '$lib/services/blog';
	import { formatDate } from '$lib/utils/markdown';
	import type { PageData } from './$types';

	export let data: PageData;

	// Get URL parameters for pagination only
	$: currentPage = browser ? parseInt($page.url.searchParams.get('page') || '1') : 1;

	// Paginate all posts - first page has featured post so show 6 grid, subsequent pages show 6
	$: pagination = paginatePosts(data.allPosts, currentPage, currentPage === 1 ? 7 : 6);

	// Handle pagination
	function handlePageChange(newPage: number) {
		if (!browser) return;

		const url = new URL($page.url);
		if (newPage === 1) {
			url.searchParams.delete('page');
		} else {
			url.searchParams.set('page', newPage.toString());
		}
		goto(url.toString());
	}

	// Get featured post (first/latest post)
	$: featuredPost = data.allPosts[0];
	$: otherPosts = pagination.posts.slice(currentPage === 1 ? 1 : 0);

	// Navigation handlers for overlay buttons
	function goToPost(slug: string) {
		goto(`/blog/${slug}`);
	}
</script>

<svelte:head>
	<title>Blog - FarmerMarket.us</title>
	<meta
		name="description"
		content="Discover expert tips, seasonal guides, and insights about farmers markets, local produce, and supporting your community through our comprehensive blog."
	/>
	<meta property="og:title" content="Blog - FarmerMarket.us" />
	<meta
		property="og:description"
		content="Discover expert tips, seasonal guides, and insights about farmers markets, local produce, and supporting your community through our comprehensive blog."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://farmermarket.us/blog" />
	<meta property="og:image" content="https://farmermarket.us/farmermarket-og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Blog - FarmerMarket.us" />
	<meta
		name="twitter:description"
		content="Discover expert tips, seasonal guides, and insights about farmers markets, local produce, and supporting your community through our comprehensive blog."
	/>
	<meta name="twitter:image" content="https://farmermarket.us/farmermarket-og.png" />
</svelte:head>

<div class="container mx-auto max-w-6xl px-4 py-12">
	{#if data.allPosts.length > 0}
		<!-- Featured Post (only on first page) -->
		{#if currentPage === 1 && featuredPost}
			<article class="mb-16 pb-16">
				<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
					<!-- Content -->
					<div class="order-2 lg:order-1">
						<!-- Meta info -->
						<div
							class="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400"
						>
							<div class="flex items-center gap-1">
								<Calendar size={16} />
								<time datetime={featuredPost.date}>{formatDate(featuredPost.date)}</time>
							</div>
							{#if featuredPost.readingTime}
								<div class="flex items-center gap-1">
									<Clock size={16} />
									<span>{featuredPost.readingTime} min read</span>
								</div>
							{/if}
							{#if featuredPost.author}
								<div class="flex items-center gap-1">
									<User size={16} />
									<span>{featuredPost.author}</span>
								</div>
							{/if}
						</div>

						<!-- Title -->
						<h2 class="mb-4 text-3xl font-bold text-slate-950 lg:text-4xl dark:text-slate-50">
							<a href="/blog/{featuredPost.slug}" class="transition-colors hover:text-red-600">
								{featuredPost.title}
							</a>
						</h2>

						<!-- Excerpt -->
						<p class="mb-6 text-lg leading-6 text-slate-600 dark:text-slate-300">
							{featuredPost.excerpt || featuredPost.description}
						</p>
					</div>

					<!-- Image -->
					{#if featuredPost.image}
						<div class="order-1 lg:order-2">
							<!-- Featured post image with overlay -->
							<div class="group w-full">
								<div
									class="relative block w-full cursor-pointer overflow-hidden rounded-lg"
									style="aspect-ratio: 4/3;"
									tabindex="0"
									aria-label={`Read article: ${featuredPost.title}`}
									on:click={() => goToPost(featuredPost.slug)}
									on:keydown={(e) =>
										e.key === 'Enter' || e.key === ' ' ? goToPost(featuredPost.slug) : null}
									role="link"
								>
									<img
										src={featuredPost.image}
										alt={featuredPost.title}
										class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
										loading="eager"
									/>
									<!-- Overlay on hover -->
									<div
										class="pointer-events-none absolute inset-0 z-10 bg-slate-950/50 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 dark:bg-slate-50/60"
									></div>
									<!-- Button on hover -->
									<div
										class="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
									>
										<button
											type="button"
											class="pointer-events-auto flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-slate-50 shadow transition hover:bg-slate-800 focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 dark:focus:ring-slate-50"
											aria-label={`Read article: ${featuredPost.title}`}
											on:click|stopPropagation={() => goToPost(featuredPost.slug)}
										>
											Read Full Article <ArrowUpRight size={18} />
										</button>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</article>
		{/if}

		<!-- Other Posts -->
		{#if otherPosts.length > 0}
			<section>
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
					{#each otherPosts as post}
						<article class="group">
							<!-- Image with overlay -->
							{#if post.image}
								<div class="group mb-4 w-full">
									<div
										class="relative block w-full cursor-pointer overflow-hidden rounded-lg"
										style="aspect-ratio: 16/9;"
										tabindex="0"
										aria-label={`Read article: ${post.title}`}
										on:click={() => goToPost(post.slug)}
										on:keydown={(e) =>
											e.key === 'Enter' || e.key === ' ' ? goToPost(post.slug) : null}
										role="link"
									>
										<img
											src={post.image}
											alt={post.title}
											class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
											loading="lazy"
										/>
										<!-- Overlay on hover -->
										<div
											class="pointer-events-none absolute inset-0 z-10 bg-slate-950/50 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 dark:bg-slate-50/60"
										></div>
										<!-- Button on hover -->
										<div
											class="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
										>
											<button
												type="button"
												class="pointer-events-auto flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-slate-50 shadow transition hover:bg-slate-800 focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 dark:focus:ring-slate-50"
												aria-label={`Read article: ${post.title}`}
												on:click|stopPropagation={() => goToPost(post.slug)}
											>
												Read Full Article <ArrowUpRight size={18} />
											</button>
										</div>
									</div>
								</div>
							{/if}

							<!-- Content -->
							<div class="space-y-3">
								<!-- Meta info -->
								<div
									class="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400"
								>
									<div class="flex items-center gap-1">
										<Calendar size={14} />
										<time datetime={post.date}>{formatDate(post.date)}</time>
									</div>
									{#if post.readingTime}
										<div class="flex items-center gap-1">
											<Clock size={14} />
											<span>{post.readingTime} min read</span>
										</div>
									{/if}
									{#if post.author}
										<div class="flex items-center gap-1">
											<User size={14} />
											<span>{post.author}</span>
										</div>
									{/if}
								</div>

								<!-- Title -->
								<h3 class="text-xl font-semibold text-slate-950 dark:text-slate-50">
									<a href="/blog/{post.slug}" class="transition-colors hover:text-red-600">
										{post.title}
									</a>
								</h3>

								<!-- Excerpt -->
								<p class="leading-6 text-slate-600 dark:text-slate-300">
									{post.excerpt || post.description}
								</p>
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Pagination -->
		{#if pagination.totalPages > 1}
			<div class="mt-16 flex justify-center">
				<Pagination
					currentPage={pagination.currentPage}
					totalPages={pagination.totalPages}
					onPageChange={handlePageChange}
				/>
			</div>
		{/if}
	{:else}
		<div class="py-24 text-center">
			<h2 class="mb-4 text-2xl font-semibold text-slate-950 dark:text-slate-50">No posts yet</h2>
			<p class="text-lg text-slate-600 dark:text-slate-400">
				Check back soon for fresh content about farmers markets and local produce.
			</p>
		</div>
	{/if}
</div>
