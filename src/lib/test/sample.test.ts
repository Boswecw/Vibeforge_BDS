/**
 * Sample Test
 *
 * Verifies that Vitest is configured correctly.
 */

import { describe, it, expect } from 'vitest';

describe('Vitest Setup', () => {
	it('should run tests successfully', () => {
		expect(true).toBe(true);
	});

	it('should have access to globals', () => {
		expect(window).toBeDefined();
		expect(document).toBeDefined();
		expect(localStorage).toBeDefined();
	});

	it('should support async tests', async () => {
		const result = await Promise.resolve(42);
		expect(result).toBe(42);
	});
});
