const resources = require('./src/lib/data/resources.json');

// Simple slugify function (duplicated here to avoid import issues)
function slugify(text) {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim();
}

// Generate all possible routes for prerendering
const entries = [
	'/',
	'/blog',
	'/faq',
	'/privacy',
	'/terms',
	'/sitemap.xml',
	'/llms.txt',
	...resources
		.filter((resource) => resource.address && resource.address.state)
		.map((resource) => `/${slugify(resource.address.state)}/${slugify(resource.title)}`)
];

// Blog post routes — keep in sync with src/lib/services/blog.ts
entries.push('/blog/your-local-food-adventure-starts-here');
entries.push('/blog/july-4th-farmers-market-recipes');
entries.push('/blog/farmers-cheese-2026-trend');
entries.push('/blog/spring-awakening-first-fresh-finds');
entries.push('/blog/spring-produce-march-2026');
entries.push('/blog/spring-farmers-market-shopping-guide-2026');
entries.push('/blog/spring-greens-creative-uses-2026');
entries.push('/blog/planning-march-farmers-market-visit');
entries.push('/blog/rhubarb-spring-treasure-2026');
entries.push('/blog/spring-herbs-kitchen-2026');
entries.push('/blog/hyperlocal-sourcing-spring-2026');
entries.push('/blog/spring-market-season-opens-2026');
entries.push('/blog/7-farmers-market-trends-spring-2026');
entries.push('/blog/spring-produce-guide-late-march-2026');
entries.push('/blog/fresh-peas-farmers-market-spring-2026');
entries.push('/blog/april-farmers-market-guide-2026');
entries.push('/blog/spring-arrives-early-2026-farmers-market');

module.exports = { entries };
