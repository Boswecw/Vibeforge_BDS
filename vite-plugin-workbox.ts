/**
 * Vite Plugin for Workbox Service Worker Generation
 *
 * Generates a service worker with Workbox during the build process.
 * Integrates with SvelteKit's build output to cache static assets.
 */

import { generateSW } from 'workbox-build';
import type { Plugin } from 'vite';

export function workboxPlugin(): Plugin {
	return {
		name: 'vite-plugin-workbox',
		apply: 'build',
		closeBundle: async () => {
			try {
				const { count, size, warnings } = await generateSW({
					globDirectory: 'build/client',
					globPatterns: [
						'**/*.{js,css,html,woff,woff2,png,jpg,jpeg,svg,webp,ico}',
						'_app/**/*.{js,css}'
					],
					swDest: 'build/client/sw.js',
					clientsClaim: true,
					skipWaiting: true,
					navigateFallback: null, // SvelteKit handles routing
					ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
					runtimeCaching: [
						{
							// Cache API responses with stale-while-revalidate
							urlPattern: /^https:\/\/localhost:8100\/api\/.*/i,
							handler: 'StaleWhileRevalidate',
							options: {
								cacheName: 'api-cache',
								expiration: {
									maxEntries: 100,
									maxAgeSeconds: 5 * 60 // 5 minutes
								},
								cacheableResponse: {
									statuses: [0, 200]
								}
							}
						},
						{
							// Cache images with cache-first strategy
							urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
							handler: 'CacheFirst',
							options: {
								cacheName: 'image-cache',
								expiration: {
									maxEntries: 50,
									maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
								}
							}
						},
						{
							// Cache fonts with cache-first strategy
							urlPattern: /\.(?:woff|woff2|ttf|eot)$/i,
							handler: 'CacheFirst',
							options: {
								cacheName: 'font-cache',
								expiration: {
									maxEntries: 20,
									maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
								}
							}
						},
						{
							// Cache CSS and JS with stale-while-revalidate
							urlPattern: /\.(?:js|css)$/i,
							handler: 'StaleWhileRevalidate',
							options: {
								cacheName: 'static-resources',
								expiration: {
									maxEntries: 100,
									maxAgeSeconds: 24 * 60 * 60 // 1 day
								}
							}
						}
					]
				});

				console.log(`\n✓ Service worker generated:`);
				console.log(`  - Files cached: ${count}`);
				console.log(`  - Cache size: ${(size / 1024 / 1024).toFixed(2)} MB`);

				if (warnings.length > 0) {
					console.warn('Workbox warnings:', warnings);
				}
			} catch (error) {
				console.error('Failed to generate service worker:', error);
			}
		}
	};
}
