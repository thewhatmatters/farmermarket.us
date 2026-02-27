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

// Add blog post routes
entries.push('/blog/your-local-food-adventure-starts-here');
entries.push('/blog/farmers-cheese-2026-trend');
entries.push('/blog/spring-produce-march-2026');

module.exports = { entries };
