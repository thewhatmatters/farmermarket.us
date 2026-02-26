<script>
	import Button from '$lib/components/ui/Button.svelte';
	import { EnvelopeSimple, Barn } from 'phosphor-svelte';
	import { page } from '$app/stores';
	import { config } from '$lib/config';
</script>

<footer class="border-t border-slate-200 py-11 dark:border-slate-800 dark:bg-slate-950">
	<div class="container mx-auto px-4 xl:px-0">
		<div class="flex flex-col justify-between md:flex-row">
			<!-- Left Side -->
			<div class="flex flex-col gap-4">
				<div class="flex max-w-sm flex-col gap-2">
					<a
						href="/"
						class="flex items-center gap-1 text-lg leading-none font-medium text-slate-950 transition-colors duration-300 hover:text-slate-700 dark:text-slate-50 hover:dark:text-slate-100"
					>
						<Barn size={24} />
						{config.siteName}
					</a>
					<p class="text-sm leading-normal font-light text-slate-600 dark:text-slate-300">
						Your complete directory of farmers markets across America. Find fresh, local produce and
						artisanal goods in your area with market hours, locations, and vendor information.
					</p>
				</div>
				<div class="flex max-w-sm flex-col gap-2">
					<p class="text-sm leading-normal font-light text-slate-600 dark:text-slate-300">
						Looking to promote your resource or sponsor your service? Contact us.
					</p>
					<Button
						variant="primary"
						size="md"
						href="mailto:{config.contactEmail}?subject=Resource Directory Inquiry"
						leftIcon={{ component: EnvelopeSimple, props: { size: 16 } }}
					>
						Contact</Button
					>
				</div>
			</div>
			<!-- Right Side -->
			<div class="mt-8 flex flex-col gap-8 lg:mt-0">
				<div class="flex flex-row gap-24">
					<div class="flex flex-col gap-2">
						<h3 class="text-lg leading-none font-medium text-slate-950 dark:text-slate-50">
							Links
						</h3>
						<ul class="flex flex-col gap-1">
							<li>
								<a
									href="/"
									class={`text-sm leading-normal font-light transition-all duration-300
								${$page.url.pathname === '/' ? 'underline-dotted text-slate-950 underline dark:text-slate-50' : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 hover:dark:text-slate-50'}`}
								>
									Directory
								</a>
							</li>
							<li>
								<a
									href="/blog"
									class={`text-sm leading-normal font-light transition-all duration-300
								${$page.url.pathname === '/faq' ? 'underline-dotted text-slate-950 underline dark:text-slate-50' : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 hover:dark:text-slate-50'}`}
								>
									Blog
								</a>
							</li>
							<li>
								<a
									href="/faq"
									class={`text-sm leading-normal font-light transition-all duration-300
								${$page.url.pathname === '/faq' ? 'underline-dotted text-slate-950 underline dark:text-slate-50' : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 hover:dark:text-slate-50'}`}
								>
									FAQ
								</a>
							</li>
						</ul>
					</div>
					<div class="flex flex-col gap-2">
						<h3 class="text-lg leading-none font-medium text-slate-950 dark:text-slate-50">
							Sites
						</h3>
						<ul class="flex flex-col gap-1">
							<li>
								<a
									href="/terms"
									class={`text-sm leading-normal font-light transition-all duration-300
								${$page.url.pathname === '/terms' ? 'underline-dotted text-slate-950 underline dark:text-slate-50' : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 hover:dark:text-slate-50'}`}
								>
									Terms of Use
								</a>
							</li>
							<li>
								<a
									href="/privacy"
									class={`text-sm leading-normal font-light transition-all duration-300
								${$page.url.pathname === '/privacy' ? 'underline-dotted text-slate-950 underline dark:text-slate-50' : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 hover:dark:text-slate-50'}`}
								>
									Privacy Policy
								</a>
							</li>
						</ul>
					</div>
				</div>

				<p class="text-sm leading-normal font-light text-slate-600 dark:text-slate-300">
					🇺🇸 Made in Austin, TX, USA &amp; <br />⚡ Powered by
					<a
						href="https://axcai.gumroad.com/l/axc-0002"
						target="_blank"
						class="underline-dotted text-slate-950 underline dark:text-slate-50"
						>Direx — Web Directory.</a
					>
				</p>
			</div>
		</div>
	</div>
</footer>
