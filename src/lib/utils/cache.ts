/**
 * LRU Cache Implementation
 *
 * Least Recently Used (LRU) cache for in-memory caching of API responses.
 * Automatically evicts least recently used entries when max size is reached.
 *
 * Features:
 * - Generic type support for any cached value
 * - TTL (time-to-live) per entry
 * - Automatic eviction of expired entries
 * - Size-based eviction (LRU algorithm)
 * - Cache statistics (hits, misses, size)
 *
 * Usage:
 * ```typescript
 * const cache = new LRUCache<User>({ maxSize: 100, ttl: 5 * 60 * 1000 });
 * cache.set('user:123', userData);
 * const user = cache.get('user:123'); // Returns userData or null if expired/missing
 * ```
 */

export interface CacheEntry<T> {
	value: T;
	expiresAt: number;
}

export interface CacheOptions {
	maxSize?: number; // Maximum number of entries (default: 100)
	ttl?: number; // Time to live in milliseconds (default: 5 minutes)
}

export interface CacheStats {
	hits: number;
	misses: number;
	size: number;
	maxSize: number;
}

export class LRUCache<T> {
	private cache: Map<string, CacheEntry<T>>;
	private maxSize: number;
	private ttl: number;
	private hits: number = 0;
	private misses: number = 0;

	constructor(options: CacheOptions = {}) {
		this.cache = new Map();
		this.maxSize = options.maxSize ?? 100;
		this.ttl = options.ttl ?? 5 * 60 * 1000; // Default 5 minutes
	}

	/**
	 * Get a value from the cache
	 * Returns null if key doesn't exist or entry has expired
	 */
	get(key: string): T | null {
		const entry = this.cache.get(key);

		if (!entry) {
			this.misses++;
			return null;
		}

		// Check if expired
		if (Date.now() > entry.expiresAt) {
			this.cache.delete(key);
			this.misses++;
			return null;
		}

		// Move to end (most recently used)
		this.cache.delete(key);
		this.cache.set(key, entry);

		this.hits++;
		return entry.value;
	}

	/**
	 * Set a value in the cache
	 * If cache is full, removes the least recently used entry
	 */
	set(key: string, value: T, customTtl?: number): void {
		// If key already exists, delete it first to update position
		if (this.cache.has(key)) {
			this.cache.delete(key);
		}

		// Evict LRU entry if at max size
		if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value;
			if (firstKey !== undefined) {
				this.cache.delete(firstKey);
			}
		}

		// Add new entry
		const ttl = customTtl ?? this.ttl;
		const entry: CacheEntry<T> = {
			value,
			expiresAt: Date.now() + ttl
		};

		this.cache.set(key, entry);
	}

	/**
	 * Check if a key exists and is not expired
	 */
	has(key: string): boolean {
		const entry = this.cache.get(key);
		if (!entry) return false;

		if (Date.now() > entry.expiresAt) {
			this.cache.delete(key);
			return false;
		}

		return true;
	}

	/**
	 * Delete a specific key from the cache
	 */
	delete(key: string): boolean {
		return this.cache.delete(key);
	}

	/**
	 * Clear all entries from the cache
	 */
	clear(): void {
		this.cache.clear();
		this.hits = 0;
		this.misses = 0;
	}

	/**
	 * Remove all expired entries
	 */
	prune(): number {
		const now = Date.now();
		let pruned = 0;

		for (const [key, entry] of this.cache.entries()) {
			if (now > entry.expiresAt) {
				this.cache.delete(key);
				pruned++;
			}
		}

		return pruned;
	}

	/**
	 * Get cache statistics
	 */
	getStats(): CacheStats {
		return {
			hits: this.hits,
			misses: this.misses,
			size: this.cache.size,
			maxSize: this.maxSize
		};
	}

	/**
	 * Get hit rate percentage
	 */
	getHitRate(): number {
		const total = this.hits + this.misses;
		return total === 0 ? 0 : (this.hits / total) * 100;
	}

	/**
	 * Get all keys in the cache (for debugging)
	 */
	keys(): string[] {
		return Array.from(this.cache.keys());
	}

	/**
	 * Get cache size
	 */
	size(): number {
		return this.cache.size;
	}
}

/**
 * Cache key generator utility
 * Generates consistent cache keys from request parameters
 */
export function generateCacheKey(
	endpoint: string,
	params?: Record<string, any>,
	userId?: string
): string {
	const parts = [endpoint];

	if (userId) {
		parts.push(`user:${userId}`);
	}

	if (params) {
		const sortedParams = Object.keys(params)
			.sort()
			.map((key) => `${key}=${JSON.stringify(params[key])}`)
			.join('&');
		parts.push(sortedParams);
	}

	return parts.join('|');
}

/**
 * Stale-While-Revalidate Cache Wrapper
 *
 * Returns cached data immediately (if available) while fetching fresh data in the background.
 * Updates cache with fresh data when available.
 *
 * Usage:
 * ```typescript
 * const data = await staleWhileRevalidate(
 *   'skills-list',
 *   () => fetchSkills(),
 *   cache
 * );
 * ```
 */
export async function staleWhileRevalidate<T>(
	key: string,
	fetchFn: () => Promise<T>,
	cache: LRUCache<T>,
	onRevalidate?: (data: T) => void
): Promise<T> {
	// Try to get cached value
	const cached = cache.get(key);

	if (cached !== null) {
		// Return cached value immediately
		// Revalidate in background
		fetchFn()
			.then((fresh) => {
				cache.set(key, fresh);
				if (onRevalidate) {
					onRevalidate(fresh);
				}
			})
			.catch((error) => {
				console.warn(`Failed to revalidate cache for key: ${key}`, error);
			});

		return cached;
	}

	// No cached value, fetch fresh data
	const fresh = await fetchFn();
	cache.set(key, fresh);
	return fresh;
}

/**
 * Cache invalidation utilities
 */
export class CacheInvalidator {
	private cache: LRUCache<any>;

	constructor(cache: LRUCache<any>) {
		this.cache = cache;
	}

	/**
	 * Invalidate all keys matching a pattern (glob-style)
	 * Example: invalidatePattern('skills/*') invalidates all skill-related cache entries
	 */
	invalidatePattern(pattern: string): number {
		const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
		let invalidated = 0;

		for (const key of this.cache.keys()) {
			if (regex.test(key)) {
				this.cache.delete(key);
				invalidated++;
			}
		}

		return invalidated;
	}

	/**
	 * Invalidate all keys containing a substring
	 */
	invalidateContaining(substring: string): number {
		let invalidated = 0;

		for (const key of this.cache.keys()) {
			if (key.includes(substring)) {
				this.cache.delete(key);
				invalidated++;
			}
		}

		return invalidated;
	}

	/**
	 * Invalidate all cache entries
	 */
	invalidateAll(): void {
		this.cache.clear();
	}
}

/**
 * Global cache instance for API responses
 * Can be imported and used across the application
 */
export const apiCache = new LRUCache<any>({
	maxSize: 100,
	ttl: 5 * 60 * 1000 // 5 minutes
});

/**
 * Cache for skills list (longer TTL)
 */
export const skillsCache = new LRUCache<any>({
	maxSize: 50,
	ttl: 10 * 60 * 1000 // 10 minutes
});

/**
 * Cache for user-specific data (shorter TTL)
 */
export const userCache = new LRUCache<any>({
	maxSize: 50,
	ttl: 2 * 60 * 1000 // 2 minutes
});
