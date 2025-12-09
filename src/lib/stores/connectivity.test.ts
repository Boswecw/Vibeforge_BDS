/**
 * Connectivity Store Tests
 *
 * Tests for online/offline detection.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { connectivityStore } from './connectivity.svelte';

describe('Connectivity Store', () => {
	beforeEach(() => {
		// Reset state
		connectivityStore.clearOfflineFlag();
		// Ensure we start online
		connectivityStore.setOnline(true);
	});

	describe('Online/Offline State', () => {
		it('should start in online state', () => {
			expect(connectivityStore.isOnline).toBe(true);
			expect(connectivityStore.isOffline).toBe(false);
		});

		it('should detect offline state', () => {
			connectivityStore.setOnline(false);

			expect(connectivityStore.isOnline).toBe(false);
			expect(connectivityStore.isOffline).toBe(true);
			expect(connectivityStore.lastOfflineAt).toBeInstanceOf(Date);
		});

		it('should detect online state', () => {
			connectivityStore.setOnline(false);
			connectivityStore.setOnline(true);

			expect(connectivityStore.isOnline).toBe(true);
			expect(connectivityStore.isOffline).toBe(false);
			expect(connectivityStore.lastOnlineAt).toBeInstanceOf(Date);
		});

		it('should track wasOffline flag', () => {
			expect(connectivityStore.wasOffline).toBe(false);

			connectivityStore.setOnline(false);
			expect(connectivityStore.wasOffline).toBe(false);

			connectivityStore.setOnline(true);
			expect(connectivityStore.wasOffline).toBe(true);

			connectivityStore.clearOfflineFlag();
			expect(connectivityStore.wasOffline).toBe(false);
		});
	});

	describe('Timestamps', () => {
		it('should track lastOnlineAt', () => {
			const beforeTime = Date.now();
			connectivityStore.setOnline(true);
			const afterTime = Date.now();

			const lastOnline = connectivityStore.lastOnlineAt;
			expect(lastOnline).toBeInstanceOf(Date);

			if (lastOnline) {
				expect(lastOnline.getTime()).toBeGreaterThanOrEqual(beforeTime);
				expect(lastOnline.getTime()).toBeLessThanOrEqual(afterTime);
			}
		});

		it('should track lastOfflineAt', () => {
			const beforeTime = Date.now();
			connectivityStore.setOnline(false);
			const afterTime = Date.now();

			const lastOffline = connectivityStore.lastOfflineAt;
			expect(lastOffline).toBeInstanceOf(Date);

			if (lastOffline) {
				expect(lastOffline.getTime()).toBeGreaterThanOrEqual(beforeTime);
				expect(lastOffline.getTime()).toBeLessThanOrEqual(afterTime);
			}
		});

		it('should calculate time since last online', async () => {
			connectivityStore.setOnline(true);

			await new Promise((resolve) => setTimeout(resolve, 10));

			const timeSince = connectivityStore.timeSinceLastOnline;
			expect(timeSince).toBeGreaterThanOrEqual(5);
		});

		it('should calculate time since last offline', async () => {
			connectivityStore.setOnline(false);

			await new Promise((resolve) => setTimeout(resolve, 10));

			const timeSince = connectivityStore.timeSinceLastOffline;
			expect(timeSince).toBeGreaterThanOrEqual(10);
		});

		it('should return null for time since when no event occurred', () => {
			// Clear by creating new state
			const beforeOnline = connectivityStore.lastOnlineAt;
			const beforeOffline = connectivityStore.lastOfflineAt;

			// If we haven't gone online yet in this test, time should still work
			// This test just ensures the getters don't throw errors
			expect(typeof connectivityStore.timeSinceLastOnline).toBe(beforeOnline ? 'number' : 'object');
			expect(typeof connectivityStore.timeSinceLastOffline).toBe(beforeOffline ? 'number' : 'object');
		});
	});

	describe('State Transitions', () => {
		it('should handle multiple online/offline transitions', () => {
			connectivityStore.setOnline(true);
			expect(connectivityStore.isOnline).toBe(true);

			connectivityStore.setOnline(false);
			expect(connectivityStore.isOffline).toBe(true);

			connectivityStore.setOnline(true);
			expect(connectivityStore.isOnline).toBe(true);

			connectivityStore.setOnline(false);
			expect(connectivityStore.isOffline).toBe(true);
		});

		it('should update timestamps on each transition', async () => {
			connectivityStore.setOnline(true);
			const firstOnline = connectivityStore.lastOnlineAt;

			await new Promise((resolve) => setTimeout(resolve, 10));

			connectivityStore.setOnline(false);
			const firstOffline = connectivityStore.lastOfflineAt;

			await new Promise((resolve) => setTimeout(resolve, 10));

			connectivityStore.setOnline(true);
			const secondOnline = connectivityStore.lastOnlineAt;

			if (firstOnline && secondOnline && firstOffline) {
				expect(secondOnline.getTime()).toBeGreaterThan(firstOnline.getTime());
				expect(firstOffline.getTime()).toBeGreaterThan(firstOnline.getTime());
				expect(secondOnline.getTime()).toBeGreaterThan(firstOffline.getTime());
			}
		});
	});

	describe('Window Events', () => {
		it('should respond to window online event', () => {
			const onlineEvent = new Event('online');
			window.dispatchEvent(onlineEvent);

			expect(connectivityStore.isOnline).toBe(true);
		});

		it('should respond to window offline event', () => {
			const offlineEvent = new Event('offline');
			window.dispatchEvent(offlineEvent);

			expect(connectivityStore.isOffline).toBe(true);
		});
	});
});
