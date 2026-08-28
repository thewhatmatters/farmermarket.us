<script lang="ts">
	import '../app.css';
	import Navigation from '$lib/components/layout/Navigation.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { children, data } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Navigation latestBlogPost={data.latestBlogPost} />
	<main class="flex flex-1 flex-col">
		{@render children()}
	</main>
	<Footer />
</div>
