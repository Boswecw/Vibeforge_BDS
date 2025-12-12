/**
 * Tests for LRU Cache Implementation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	LRUCache,
	generateCacheKey,
	staleWhileRevalidate,
	CacheInvalidator
} from './cache';

describe('LRUCache', () => {
	let cache: LRUCache<string>;

	beforeEach(() => {
		cache = new LRUCache<string>({ maxSize: 3, ttl: 1000 });
	});

	describe('Basic Operations', () => {
		it('should store and retrieve values', () => {
			cache.set('key1', 'value1');
			expect(cache.get('key1')).toBe('value1');
		});

		it('should return null for non-existent keys', () => {
			expect(cache.get('nonexistent')).toBeNull();
		});

		it('should update existing keys', () => {
			cache.set('key1', 'value1');
			cache.set('key1', 'value2');
			expect(cache.get('key1')).toBe('value2');
			expect(cache.size()).toBe(1);
		});

		it('should check if key exists', () => {
			cache.set('key1', 'value1');
			expect(cache.has('key1')).toBe(true);
			expect(cache.has('key2')).toBe(false);
		});

		it('should delete keys', () => {
			cache.set('key1', 'value1');
			expect(cache.delete('key1')).toBe(true);
			expect(cache.get('key1')).toBeNull();
			expect(cache.delete('key1')).toBe(false);
		});

		it('should clear all entries', () => {
			cache.set('key1', 'value1');
			cache.set('key2', 'value2');
			cache.clear();
			expect(cache.size()).toBe(0);
			expect(cache.get('key1')).toBeNull();
		});
	});

	describe('LRU Eviction', () => {
		it('should evict least recently used item when full', () => {
			cache.set('key1', 'value1');
			cache.set('key2', 'value2');
			cache.set('key3', 'value3');
			cache.set('key4', 'value4'); // Should evict key1

			expect(cache.get('key1')).toBeNull();
			expect(cache.get('key2')).toBe('value2');
			expect(cache.get('key3')).toBe('value3');
			expect(cache.get('key4')).toBe('value4');
			expect(cache.size()).toBe(3);
		});

		it('should update LRU order on get', () => {
			cache.set('key1', 'value1');
			cache.set('key2', 'value2');
			cache.set('key3', 'value3');

			// Access key1 (moves to end)
			cache.get('key1');

			// Add key4 (should evict key2, not key1)
			cache.set('key4', 'value4');

			expect(cache.get('key1')).toBe('value1');
			expect(cache.get('key2')).toBeNull();
			expect(cache.get('key3')).toBe('value3');
			expect(cache.get('key4')).toBe('value4');
		});
	});

	describe('TTL Expiration', () => {
		it('should return null for expired entries', async () => {
			const shortCache = new LRUCache<string>({ maxSize: 10, ttl: 50 });
			shortCache.set('key1', 'value1');

			expect(shortCache.get('key1')).toBe('value1');

			// Wait for expiration
			await new Promise((resolve) => setTimeout(resolve, 100));

			expect(shortCache.get('key1')).toBeNull();
		});

		it('should support custom TTL per entry', async () => {
			cache.set('key1', 'value1', 50); // 50ms TTL
			cache.set('key2', 'value2', 5000); // 5s TTL

			await new Promise((resolve) => setTimeout(resolve, 100));

			expect(cache.get('key1')).toBeNull();
			expect(cache.get('key2')).toBe('value2');
		});

		it('should prune expired entries', async () => {
			const shortCache = new LRUCache<string>({ maxSize: 10, ttl: 50 });
			shortCache.set('key1', 'value1');
			shortCache.set('key2', 'value2');
			shortCache.set('key3', 'value3');

			await new Promise((resolve) => setTimeout(resolve, 100));

			const pruned = shortCache.prune();
			expect(pruned).toBe(3);
			expect(shortCache.size()).toBe(0);
		});
	});

	describe('Statistics', () => {
		it('should track hits and misses', () => {
			cache.set('key1', 'value1');

			cache.get('key1'); // hit
			cache.get('key2'); // miss
			cache.get('key1'); // hit
			cache.get('key3'); // miss

			const stats = cache.getStats();
			expect(stats.hits).toBe(2);
			expect(stats.misses).toBe(2);
			expect(stats.size).toBe(1);
			expect(stats.maxSize).toBe(3);
		});

		it('should calculate hit rate', () => {
			cache.set('key1', 'value1');

			cache.get('key1'); // hit
			cache.get('key2'); // miss

			expect(cache.getHitRate()).toBe(50);
		});

		it('should return 0 hit rate when no accesses', () => {
			expect(cache.getHitRate()).toBe(0);
		});

		it('should reset stats on clear', () => {
			cache.set('key1', 'value1');
			cache.get('key1');
			cache.get('key2');

			cache.clear();

			const stats = cache.getStats();
			expect(stats.hits).toBe(0);
			expect(stats.misses).toBe(0);
		});
	});

	describe('Utility Methods', () => {
		it('should return all keys', () => {
			cache.set('key1', 'value1');
			cache.set('key2', 'value2');

			const keys = cache.keys();
			expect(keys).toEqual(['key1', 'key2']);
		});

		it('should return cache size', () => {
			expect(cache.size()).toBe(0);
			cache.set('key1', 'value1');
			expect(cache.size()).toBe(1);
			cache.set('key2', 'value2');
			expect(cache.size()).toBe(2);
		});
	});
});

describe('generateCacheKey', () => {
	it('should generate key from endpoint only', () => {
		const key = generateCacheKey('/api/v1/skills');
		expect(key).toBe('/api/v1/skills');
	});

	it('should include userId in key', () => {
		const key = generateCacheKey('/api/v1/skills', undefined, 'user123');
		expect(key).toBe('/api/v1/skills|user:user123');
	});

	it('should include params in key', () => {
		const key = generateCacheKey('/api/v1/skills', { category: 'code', limit: 10 });
		expect(key).toContain('category="code"');
		expect(key).toContain('limit=10');
	});

	it('should sort params for consistent keys', () => {
		const key1 = generateCacheKey('/api/v1/skills', { b: 2, a: 1 });
		const key2 = generateCacheKey('/api/v1/skills', { a: 1, b: 2 });
		expect(key1).toBe(key2);
	});

	it('should generate complex keys', () => {
		const key = generateCacheKey(
			'/api/v1/skills/search',
			{ query: 'test', limit: 20 },
			'user456'
		);
		expect(key).toContain('/api/v1/skills/search');
		expect(key).toContain('user:user456');
		expect(key).toContain('query="test"');
		expect(key).toContain('limit=20');
	});
});

describe('staleWhileRevalidate', () => {
	it('should fetch fresh data when cache is empty', async () => {
		const cache = new LRUCache<string>({ maxSize: 10, ttl: 1000 });
		const fetchFn = vi.fn(async () => 'fresh-data');

		const result = await staleWhileRevalidate('test-key', fetchFn, cache);

		expect(result).toBe('fresh-data');
		expect(fetchFn).toHaveBeenCalledTimes(1);
		expect(cache.get('test-key')).toBe('fresh-data');
	});

	it('should return cached data immediately and revalidate in background', async () => {
		const cache = new LRUCache<string>({ maxSize: 10, ttl: 1000 });
		cache.set('test-key', 'cached-data');

		const fetchFn = vi.fn(async () => {
			await new Promise((resolve) => setTimeout(resolve, 100));
			return 'fresh-data';
		});

		const result = await staleWhileRevalidate('test-key', fetchFn, cache);

		// Should return cached data immediately
		expect(result).toBe('cached-data');
		expect(fetchFn).toHaveBeenCalledTimes(1);

		// Wait for background revalidation
		await new Promise((resolve) => setTimeout(resolve, 150));

		// Cache should now have fresh data
		expect(cache.get('test-key')).toBe('fresh-data');
	});

	it('should call onRevalidate callback with fresh data', async () => {
		const cache = new LRUCache<string>({ maxSize: 10, ttl: 1000 });
		cache.set('test-key', 'cached-data');

		const fetchFn = vi.fn(async () => 'fresh-data');
		const onRevalidate = vi.fn();

		await staleWhileRevalidate('test-key', fetchFn, cache, onRevalidate);

		// Wait for background revalidation
		await new Promise((resolve) => setTimeout(resolve, 50));

		expect(onRevalidate).toHaveBeenCalledWith('fresh-data');
	});

	it('should handle revalidation errors gracefully', async () => {
		const cache = new LRUCache<string>({ maxSize: 10, ttl: 1000 });
		cache.set('test-key', 'cached-data');

		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const fetchFn = vi.fn(async () => {
			throw new Error('Network error');
		});

		const result = await staleWhileRevalidate('test-key', fetchFn, cache);

		// Should still return cached data
		expect(result).toBe('cached-data');

		// Wait for background revalidation attempt
		await new Promise((resolve) => setTimeout(resolve, 50));

		// Should log warning
		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringContaining('Failed to revalidate cache'),
			expect.any(Error)
		);

		consoleSpy.mockRestore();
	});
});

describe('CacheInvalidator', () => {
	let cache: LRUCache<string>;
	let invalidator: CacheInvalidator;

	beforeEach(() => {
		cache = new LRUCache<string>({ maxSize: 10, ttl: 1000 });
		invalidator = new CacheInvalidator(cache);

		cache.set('skills/list', 'data1');
		cache.set('skills/search', 'data2');
		cache.set('users/profile', 'data3');
		cache.set('users/settings', 'data4');
	});

	it('should invalidate keys matching pattern', () => {
		const count = invalidator.invalidatePattern('skills/*');

		expect(count).toBe(2);
		expect(cache.get('skills/list')).toBeNull();
		expect(cache.get('skills/search')).toBeNull();
		expect(cache.get('users/profile')).toBe('data3');
		expect(cache.get('users/settings')).toBe('data4');
	});

	it('should invalidate keys containing substring', () => {
		const count = invalidator.invalidateContaining('profile');

		expect(count).toBe(1);
		expect(cache.get('users/profile')).toBeNull();
		expect(cache.get('users/settings')).toBe('data4');
	});

	it('should invalidate all cache entries', () => {
		invalidator.invalidateAll();

		expect(cache.size()).toBe(0);
		expect(cache.get('skills/list')).toBeNull();
		expect(cache.get('users/profile')).toBeNull();
	});

	it('should return 0 when no keys match pattern', () => {
		const count = invalidator.invalidatePattern('nonexistent/*');
		expect(count).toBe(0);
	});
});
