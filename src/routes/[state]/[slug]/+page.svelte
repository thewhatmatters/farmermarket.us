<script lang="ts">
	import { SealCheck, ArrowUpRight, MapPin, Phone } from 'phosphor-svelte';
	import { slugify } from '$lib/utils/slugify';
	import { config } from '$lib/config';
	import Button from '$lib/components/ui/Button.svelte';
	import Ad from '$lib/components/ui/Ad.svelte';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
	import { getRandomAd } from '$lib/utils/ads';
	import type { CustomAd } from '$lib/utils/ads';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ resource, siteUrl } = data);

	// Generate breadcrumb items
	$: breadcrumbItems = resource
		? [
				{ label: 'Home', href: '/' },
				{
					label: resource.address.state,
					href: `/${slugify(resource.address.state)}`
				},
				{
					label: resource.title,
					current: true
				}
			]
		: [];

	// Generate the canonical URL using the site URL from load function
	$: canonicalUrl = `${siteUrl}/${slugify(resource.address.state)}/${slugify(resource.title)}`;

	// Randomize ad on component mount (for individual resource pages)
	let randomAd: CustomAd | null = null;

	// Set random ad on mount
	randomAd = getRandomAd();

	// Utility to add mt-4 to all <p> except the first
	function addMt4ToParagraphs(html: string): string {
		if (!html) return html;
		let count = 0;
		return html.replace(/<p(\s|>)/g, (match) => {
			count++;
			if (count === 1) return match;
			// Always close the tag properly
			return "<p class='mt-4'>";
		});
	}

	// Compute processed longDescription outside the render block
	let processedLongDescription = '';
	$: processedLongDescription = addMt4ToParagraphs(resource.longDescription);
</script>

<svelte:head>
	<!-- Basic SEO -->
	<title>{resource.title} | {config.siteName}</title>
	<meta
		name="description"
		content={resource.description ||
			`Discover ${resource.title} and more resources on ${config.siteName}.`}
	/>
	<meta
		name="keywords"
		content={`${resource.title}, ${resource.address.state}, resources, tools, directory`}
	/>
	<meta name="author" content={config.siteName} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={`${resource.title} | ${config.siteName}`} />
	<meta
		property="og:description"
		content={resource.description ||
			`Discover ${resource.title} and more resources on ${config.siteName}.`}
	/>
	<meta property="og:image" content={`${siteUrl}${resource.image}`} />
	<meta property="og:image:width" content="364" />
	<meta property="og:image:height" content="340" />
	<meta property="og:site_name" content={config.siteName} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={canonicalUrl} />
	<meta property="twitter:title" content={`${resource.title} | ${config.siteName}`} />
	<meta
		property="twitter:description"
		content={resource.description ||
			`Discover ${resource.title} and more resources on ${config.siteName}.`}
	/>
	<meta property="twitter:image" content={`${siteUrl}${resource.image}`} />

	<!-- Additional SEO -->
	<meta name="robots" content="index, follow" />
	<meta name="googlebot" content="index, follow" />
	{#if resource.sponsored}
		<meta name="sponsored" content="true" />
	{/if}

	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">
${JSON.stringify({
	"@context": "https://schema.org",
	"@type": "FarmersMarket",
	"name": resource.title,
	"description": resource.description || `Discover ${resource.title} on ${config.siteName}`,
	"image": `${siteUrl}${resource.image}`,
	"url": canonicalUrl,
	"telephone": resource.phone || undefined,
	"address": {
		"@type": "PostalAddress",
		"streetAddress": resource.address.street,
		"addressLocality": resource.address.city,
		"addressRegion": resource.address.state,
		"postalCode": resource.address.zip,
		"addressCountry": "US"
	},
	"geo": resource.coordinates ? {
		"@type": "GeoCoordinates",
		"latitude": resource.coordinates.lat,
		"longitude": resource.coordinates.lng
	} : undefined,
	"openingHours": resource.hours || undefined,
	"priceRange": "$"
}, null, '	')}
	</script>`}
</svelte:head>

<main class="container mx-auto max-w-[900px] px-4 py-12 lg:px-0 lg:py-24">
	<!-- Breadcrumbs -->
	{#if resource}
		<Breadcrumbs items={breadcrumbItems} />
	{/if}

	<!-- Image section -->
	<div class="mb-8">
		<div class="relative overflow-hidden rounded-xl bg-slate-100">
			<img
				src={resource.image}
				alt={resource.title}
				class="h-auto w-full object-cover"
				style="aspect-ratio: 4/3;"
			/>
		</div>
	</div>

	<!-- State badge -->
	<span
		class="mb-4 inline-block rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700"
	>
		{resource.address.state
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')}
	</span>

	<!-- Title and Action button row -->
	<div class="mb-4 flex w-full flex-col items-start justify-between md:flex-row">
		<!-- Title & Address with sponsored badge -->
		<div class="flex flex-col">
			<div class="mb-2 flex items-center gap-2 md:mb-0">
				<h1 class="text-3xl font-bold text-slate-950 lg:text-4xl dark:text-slate-50">
					{resource.title}
				</h1>
				{#if resource.sponsored}
					<SealCheck size={24} class="text-blue-600" aria-label="Sponsored" />
				{/if}
			</div>
			<!-- Address -->
			{#if resource.address}
				<div class="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
					<MapPin size={16} class="text-slate-600 dark:text-slate-300" />
					{resource.address.street}, {resource.address.city}, {resource.address.state}
					{resource.address.zip}
				</div>
			{/if}
			<!-- Phone -->
			{#if resource.phone}
				<div class="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
					<Phone size={16} class="text-slate-600 dark:text-slate-300" />
					{resource.phone}
				</div>
			{/if}
		</div>

		<!-- Action button -->
		<div class="my-2 flex-shrink-0 md:mb-0">
			<Button
				variant="primary"
				size="md"
				href={resource.externalUrl}
				rightIcon={{ component: ArrowUpRight, props: { size: 20 } }}
			>
				Visit Resource
			</Button>
		</div>
	</div>

	{#if resource.longDescription}
		<div
			class="text-md max-w-full leading-normal font-normal text-slate-600 md:max-w-[80%] dark:text-slate-300"
		>
			{@html processedLongDescription}
		</div>
	{:else if resource.description}
		<div
			class="text-md max-w-full leading-normal font-normal text-slate-600 md:max-w-[80%] dark:text-slate-300"
		>
			{@html resource.description}
		</div>
	{/if}

	<!-- Hours -->
	{#if resource.hours}
		<div class="mt-4 text-sm text-slate-700 dark:text-slate-300">
			<ul
				class="max-w-full rounded-md border border-slate-200 p-4 md:max-w-[80%] dark:border-slate-700"
			>
				<li class="flex justify-between rounded-sm bg-slate-100 p-2 dark:bg-slate-800">
					<span>Monday</span><span>{resource.hours.monday}</span>
				</li>
				<li class="flex justify-between rounded-sm p-2">
					<span>Tuesday</span><span>{resource.hours.tuesday}</span>
				</li>
				<li class="flex justify-between rounded-sm bg-slate-100 p-2 dark:bg-slate-800">
					<span>Wednesday</span><span>{resource.hours.wednesday}</span>
				</li>
				<li class="flex justify-between rounded-sm p-2">
					<span>Thursday</span><span>{resource.hours.thursday}</span>
				</li>
				<li class="flex justify-between rounded-sm bg-slate-100 p-2 dark:bg-slate-800">
					<span>Friday</span><span>{resource.hours.friday}</span>
				</li>
				<li class="flex justify-between rounded-sm p-2">
					<span>Saturday</span><span>{resource.hours.saturday}</span>
				</li>
				<li class="flex justify-between rounded-sm bg-slate-100 p-2 dark:bg-slate-800">
					<span>Sunday</span><span>{resource.hours.sunday}</span>
				</li>
				<li class="mt-4 rounded-sm bg-blue-100 p-2 text-sm text-blue-900">
					Hours may vary. Please contact the market directly to verify current operating hours.
				</li>
			</ul>
		</div>
	{/if}

	<!-- Ad Section (if ads enabled and ad available) -->
	{#if config.ads.enabled && config.ads.showOnResourcePages && randomAd}
		<div class="mt-8">
			<Ad ad={randomAd} />
		</div>
	{/if}
</main>
