// Site configuration - customize these values for your deployment
export const config = {
	siteName: 'FarmerMarket.us',
	siteDescription: `Your complete directory of farmer's markets across America. Find fresh, local produce and artisanal goods in your area with market hours, locations, and vendor information.`,
	// Default site URL - update this for your domain
	defaultSiteUrl: 'https://farmermarket.us/',
	contactEmail: 'hqdirectory@gmail.com',
	// Ad placement configuration
	ads: {
		enabled: true,
		// Directory page ads
		placementRow: 1, // Insert ad after this row (1-based)
		itemsPerRow: 4, // Should match your grid columns (lg:grid-cols-4)
		// Individual resource page ads
		showOnResourcePages: true, // Enable/disable ads on individual resource pages
		// Custom ads pool - randomly selected
		customAds: [
			{
				id: 'custom-og',
				image: '/ads/root-cellar.png',
				url: 'https://rootcellar.co?ref=farmermarket.us'
			}
		],
		// Google Ads configuration (for future use)
		googleAds: {
			enabled: true,
			adSlotId: '5218673632', // Will be set when Google Ads is implemented
			frequency: 0.3 // 30% chance to show Google Ad vs custom ad
		}
	}
};
