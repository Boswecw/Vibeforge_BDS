/**
 * Debounce utility for delaying function execution
 * Useful for search inputs, resize handlers, etc.
 */

/**
 * Creates a debounced function that delays invoking `func` until after `delay` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay (default: 300ms)
 * @returns Debounced function with cancel method
 *
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * debouncedSearch('test'); // Will execute after 300ms
 * debouncedSearch('test2'); // Cancels previous, will execute after 300ms
 * debouncedSearch.cancel(); // Cancels pending execution
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	delay: number = 300
): T & { cancel: () => void } {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	const debounced = function (this: any, ...args: Parameters<T>) {
		// Clear existing timeout
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
		}

		// Set new timeout
		timeoutId = setTimeout(() => {
			func.apply(this, args);
			timeoutId = null;
		}, delay);
	} as T & { cancel: () => void };

	// Add cancel method
	debounced.cancel = () => {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	};

	return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per every `limit` milliseconds.
 * Useful for scroll handlers, window resize, etc.
 *
 * @param func - The function to throttle
 * @param limit - The number of milliseconds to throttle invocations to
 * @returns Throttled function
 *
 * @example
 * ```typescript
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll position:', window.scrollY);
 * }, 100);
 *
 * window.addEventListener('scroll', throttledScroll);
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle: boolean = false;
	let lastResult: ReturnType<T>;

	return function (this: any, ...args: Parameters<T>) {
		if (!inThrottle) {
			inThrottle = true;
			lastResult = func.apply(this, args);

			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}

		return lastResult;
	};
}

/**
 * Cache utility with TTL (Time To Live)
 * Useful for caching API responses, search results, etc.
 */
export class TTLCache<T> {
	private cache = new Map<string, { value: T; expires: number }>();
	private defaultTTL: number;

	/**
	 * @param defaultTTL - Default time to live in milliseconds (default: 5 minutes)
	 */
	constructor(defaultTTL: number = 5 * 60 * 1000) {
		this.defaultTTL = defaultTTL;
	}

	/**
	 * Set a value in the cache
	 * @param key - Cache key
	 * @param value - Value to cache
	 * @param ttl - Optional TTL override in milliseconds
	 */
	set(key: string, value: T, ttl?: number): void {
		const expires = Date.now() + (ttl ?? this.defaultTTL);
		this.cache.set(key, { value, expires });
	}

	/**
	 * Get a value from the cache
	 * @param key - Cache key
	 * @returns Cached value or undefined if expired/not found
	 */
	get(key: string): T | undefined {
		const entry = this.cache.get(key);

		if (!entry) {
			return undefined;
		}

		// Check if expired
		if (Date.now() > entry.expires) {
			this.cache.delete(key);
			return undefined;
		}

		return entry.value;
	}

	/**
	 * Check if a key exists in the cache and is not expired
	 * @param key - Cache key
	 * @returns True if key exists and is not expired
	 */
	has(key: string): boolean {
		const entry = this.cache.get(key);

		if (!entry) {
			return false;
		}

		if (Date.now() > entry.expires) {
			this.cache.delete(key);
			return false;
		}

		return true;
	}

	/**
	 * Delete a key from the cache
	 * @param key - Cache key
	 */
	delete(key: string): void {
		this.cache.delete(key);
	}

	/**
	 * Clear all cached values
	 */
	clear(): void {
		this.cache.clear();
	}

	/**
	 * Get cache size
	 */
	get size(): number {
		return this.cache.size;
	}

	/**
	 * Clean up expired entries
	 */
	cleanup(): number {
		const now = Date.now();
		let removedCount = 0;

		for (const [key, entry] of this.cache.entries()) {
			if (now > entry.expires) {
				this.cache.delete(key);
				removedCount++;
			}
		}

		return removedCount;
	}
}
