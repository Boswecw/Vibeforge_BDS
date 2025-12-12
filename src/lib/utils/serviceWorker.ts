/**
 * Service Worker Registration and Management
 *
 * Handles registration, updates, and lifecycle of the service worker.
 * Provides utilities for cache management and offline support.
 */

import { Workbox } from 'workbox-window';
import { browser } from '$app/environment';

let wb: Workbox | null = null;
let updateAvailable = $state(false);
let offlineReady = $state(false);

/**
 * Register the service worker
 * Should be called in the root +layout.svelte on mount
 */
export async function registerServiceWorker() {
	if (!browser) return;

	// Check if service workers are supported
	if (!('serviceWorker' in navigator)) {
		console.warn('Service workers are not supported in this browser');
		return;
	}

	try {
		wb = new Workbox('/sw.js', {
			scope: '/'
		});

		// Listen for updates
		wb.addEventListener('waiting', () => {
			console.log('New service worker waiting to activate');
			updateAvailable = true;
		});

		// Listen for activation
		wb.addEventListener('activated', (event) => {
			console.log('Service worker activated');

			// If this was an update, reload the page
			if (!event.isUpdate) {
				console.log('First time service worker activated');
				offlineReady = true;
			}
		});

		// Listen for controlling
		wb.addEventListener('controlling', () => {
			console.log('Service worker is now controlling');
			// Reload the page to ensure all tabs are using the new service worker
			window.location.reload();
		});

		// Register the service worker
		await wb.register();

		console.log('Service worker registered successfully');
	} catch (error) {
		console.error('Failed to register service worker:', error);
	}
}

/**
 * Update the service worker
 * Forces the waiting service worker to activate
 */
export function updateServiceWorker() {
	if (!wb) {
		console.warn('Workbox not initialized');
		return;
	}

	wb.messageSkipWaiting();
	updateAvailable = false;
}

/**
 * Unregister the service worker (for development)
 */
export async function unregisterServiceWorker() {
	if (!browser) return;

	const registrations = await navigator.serviceWorker.getRegistrations();
	for (const registration of registrations) {
		await registration.unregister();
	}

	console.log('Service worker unregistered');
}

/**
 * Check if the app is currently offline
 */
export function isOffline(): boolean {
	return !navigator.onLine;
}

/**
 * Get service worker registration
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
	if (!browser) return null;

	try {
		return await navigator.serviceWorker.getRegistration();
	} catch (error) {
		console.error('Failed to get service worker registration:', error);
		return null;
	}
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<void> {
	if (!browser) return;

	try {
		const cacheNames = await caches.keys();
		await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
		console.log('All caches cleared');
	} catch (error) {
		console.error('Failed to clear caches:', error);
	}
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
	cacheNames: string[];
	totalSize: number;
}> {
	if (!browser) return { cacheNames: [], totalSize: 0 };

	try {
		const cacheNames = await caches.keys();
		let totalSize = 0;

		for (const cacheName of cacheNames) {
			const cache = await caches.open(cacheName);
			const requests = await cache.keys();

			for (const request of requests) {
				const response = await cache.match(request);
				if (response) {
					const blob = await response.blob();
					totalSize += blob.size;
				}
			}
		}

		return {
			cacheNames,
			totalSize
		};
	} catch (error) {
		console.error('Failed to get cache stats:', error);
		return { cacheNames: [], totalSize: 0 };
	}
}

/**
 * Reactive stores for service worker state
 */
export const serviceWorkerState = {
	get updateAvailable() {
		return updateAvailable;
	},
	get offlineReady() {
		return offlineReady;
	}
};

/**
 * Online/Offline event listeners
 */
export function setupOnlineOfflineListeners(
	onOnline?: () => void,
	onOffline?: () => void
) {
	if (!browser) return;

	window.addEventListener('online', () => {
		console.log('App is online');
		if (onOnline) onOnline();
	});

	window.addEventListener('offline', () => {
		console.log('App is offline');
		if (onOffline) onOffline();
	});
}
