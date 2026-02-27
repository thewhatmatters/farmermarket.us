import { error } from '@sveltejs/kit';
import { slugify } from '$lib/utils/slugify';
import { config } from '$lib/config';
import resources from '$lib/data/resources.json';
import type { PageLoad } from './$types';

export const prerender = true;

// Generate all possible entries for prerendering
export function entries() {
	return resources
		.filter((r) => r.address && r.address.state && r.title)
		.map((r) => ({
			state: slugify(r.address.state),
			slug: slugify(r.title)
		}));
}

export const load: PageLoad = ({ params, url }) => {
	const { state, slug } = params;

	// Find the resource that matches both slugified state and slugified title
	// Handle both structured address objects and string addresses
	const resource = resources.find((r) => {
		// Check if resource has title
		if (!r.title) return false;

		// Handle different address formats
		let resourceState = '';
		if (typeof r.address === 'object' && r.address && 'state' in r.address) {
			resourceState = String(r.address.state || '');
		} else if (typeof r.address === 'string' && r.address) {
			// For string addresses, try to extract state from the end
			// This is a simple heuristic - addresses typically end with "State ZIP"
			const addressStr: string = r.address;
			const parts = addressStr.split(',').map((part: string) => part.trim());
			if (parts.length >= 2) {
				// Look for state in the second-to-last part
				const statePart = parts[parts.length - 2];
				// Extract state name (assuming format like "Virginia 23185" or just "Virginia")
				resourceState = statePart.split(' ')[0] || '';
			}
		}

		return slugify(resourceState) === state && slugify(r.title) === slug;
	});

	if (!resource) {
		throw error(404, 'Resource not found');
	}

	return {
		resource,
		siteUrl: url.origin || config.defaultSiteUrl
	};
};
