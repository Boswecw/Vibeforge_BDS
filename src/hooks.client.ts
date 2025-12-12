/**
 * SvelteKit Client Hooks
 *
 * Implements intelligent route preloading for improved navigation performance
 */

import type { HandleClientError } from '@sveltejs/kit';

/**
 * Preload critical routes on idle
 * Improves perceived performance by loading likely-next routes in the background
 */
if (typeof window !== 'undefined') {
	// Wait for page to be idle before preloading
	if ('requestIdleCallback' in window) {
		requestIdleCallback(() => {
			preloadCriticalRoutes();
		}, { timeout: 2000 });
	} else {
		// Fallback for browsers without requestIdleCallback
		setTimeout(preloadCriticalRoutes, 2000);
	}
}

/**
 * Preload routes that users are likely to visit
 */
function preloadCriticalRoutes() {
	// Preload common routes based on user flow analytics
	const criticalRoutes = [
		'/library',     // Most visited after home
		'/workflows',   // Common user action
		'/testing',     // Frequently accessed
		'/history'      // Users check recent activity
	];

	criticalRoutes.forEach(route => {
		// Use SvelteKit's built-in preloading
		const link = document.createElement('a');
		link.href = route;
		link.rel = 'prefetch';
		link.style.display = 'none';
		document.body.appendChild(link);

		// Trigger preload
		link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));

		// Clean up
		setTimeout(() => document.body.removeChild(link), 100);
	});
}

/**
 * Handle client-side errors gracefully
 */
export const handleError: HandleClientError = async ({ error, event }) => {
	console.error('Client error:', error, event);

	return {
		message: 'An unexpected error occurred. Please try again.',
		code: (error as any)?.code ?? 'UNKNOWN'
	};
};
