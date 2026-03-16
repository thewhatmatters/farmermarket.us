import { processMarkdown, type BlogPost } from '$lib/utils/markdown';

// Import markdown files as raw strings
import yourLocalFoodAdventureMd from '$lib/content/blog/your-local-food-adventure-starts-here.md?raw';
import july4thRecipesMd from '$lib/content/blog/july-4th-farmers-market-recipes.md?raw';
import farmersCheeseMd from '$lib/content/blog/farmers-cheese-2026-trend.md?raw';
import springProduceMd from '$lib/content/blog/spring-produce-march-2026.md?raw';
import springShoppingMd from '$lib/content/blog/spring-farmers-market-shopping-guide-2026.md?raw';
import springGreensMd from '$lib/content/blog/spring-greens-creative-uses-2026.md?raw';
import marchPlanningMd from '$lib/content/blog/planning-march-farmers-market-visit.md?raw';
import rhubarbTreasureMd from '$lib/content/blog/rhubarb-spring-treasure-2026.md?raw';
import springHerbsMd from '$lib/content/blog/spring-herbs-kitchen-2026.md?raw';
import hyperlocalMd from '$lib/content/blog/hyperlocal-sourcing-spring-2026.md?raw';

// Define the blog posts with their content
const blogPostsData = [
	{ slug: 'july-4th-farmers-market-recipes', content: july4thRecipesMd },
	{ slug: 'your-local-food-adventure-starts-here', content: yourLocalFoodAdventureMd },
	{ slug: 'farmers-cheese-2026-trend', content: farmersCheeseMd },
	{ slug: 'spring-produce-march-2026', content: springProduceMd },
	{ slug: 'spring-farmers-market-shopping-guide-2026', content: springShoppingMd },
	{ slug: 'spring-greens-creative-uses-2026', content: springGreensMd },
	{ slug: 'planning-march-farmers-market-visit', content: marchPlanningMd },
	{ slug: 'rhubarb-spring-treasure-2026', content: rhubarbTreasureMd },
	{ slug: 'spring-herbs-kitchen-2026', content: springHerbsMd },
	{ slug: 'hyperlocal-sourcing-spring-2026', content: hyperlocalMd }
];

// Cache for processed posts
let processedPosts: BlogPost[] | null = null;

export async function getAllBlogPosts(): Promise<BlogPost[]> {
	if (processedPosts) {
		return processedPosts;
	}

	const posts: BlogPost[] = [];

	for (const { slug, content } of blogPostsData) {
		const post = await processMarkdown(slug, content);
		posts.push(post);
	}

	// Sort posts by date (newest first)
	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	processedPosts = posts;
	return posts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
	const posts = await getAllBlogPosts();
	return posts.find((post) => post.slug === slug) || null;
}

export function paginatePosts(posts: BlogPost[], page: number, postsPerPage: number = 7) {
	const totalPages = Math.ceil(posts.length / postsPerPage);
	const startIndex = (page - 1) * postsPerPage;
	const endIndex = startIndex + postsPerPage;

	return {
		posts: posts.slice(startIndex, endIndex),
		totalPages,
		currentPage: page,
		hasNextPage: page < totalPages,
		hasPrevPage: page > 1
	};
}
