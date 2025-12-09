/**
 * Planning Service Tests
 *
 * Tests for planning service business logic.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
	validatePlanningRequest,
	formatDuration,
	formatCost,
	formatTokens
} from './planningService';
import type { PlanningRequest } from '$lib/types/agents';

describe('Planning Service', () => {
	describe('Validation', () => {
		it('should validate a valid planning request', () => {
			const request: PlanningRequest = {
				title: 'Valid Title',
				description: 'Valid description with sufficient detail'
			};

			const error = validatePlanningRequest(request);
			expect(error).toBeNull();
		});

		it('should reject empty title', () => {
			const request: PlanningRequest = {
				title: '',
				description: 'Valid description'
			};

			const error = validatePlanningRequest(request);
			expect(error).not.toBeNull();
			expect(error?.message).toContain('Title is required');
		});

		it('should reject whitespace-only title', () => {
			const request: PlanningRequest = {
				title: '   ',
				description: 'Valid description'
			};

			const error = validatePlanningRequest(request);
			expect(error).not.toBeNull();
			expect(error?.message).toContain('Title is required');
		});

		it('should reject title exceeding 200 characters', () => {
			const request: PlanningRequest = {
				title: 'a'.repeat(201),
				description: 'Valid description'
			};

			const error = validatePlanningRequest(request);
			expect(error).not.toBeNull();
			expect(error?.message).toContain('200 characters');
		});

		it('should reject empty description', () => {
			const request: PlanningRequest = {
				title: 'Valid Title',
				description: ''
			};

			const error = validatePlanningRequest(request);
			expect(error).not.toBeNull();
			expect(error?.message).toContain('Description is required');
		});

		it('should reject whitespace-only description', () => {
			const request: PlanningRequest = {
				title: 'Valid Title',
				description: '   '
			};

			const error = validatePlanningRequest(request);
			expect(error).not.toBeNull();
			expect(error?.message).toContain('Description is required');
		});

		it('should reject description exceeding 5000 characters', () => {
			const request: PlanningRequest = {
				title: 'Valid Title',
				description: 'a'.repeat(5001)
			};

			const error = validatePlanningRequest(request);
			expect(error).not.toBeNull();
			expect(error?.message).toContain('5000 characters');
		});

		it('should accept title at exactly 200 characters', () => {
			const request: PlanningRequest = {
				title: 'a'.repeat(200),
				description: 'Valid description'
			};

			const error = validatePlanningRequest(request);
			expect(error).toBeNull();
		});

		it('should accept description at exactly 5000 characters', () => {
			const request: PlanningRequest = {
				title: 'Valid Title',
				description: 'a'.repeat(5000)
			};

			const error = validatePlanningRequest(request);
			expect(error).toBeNull();
		});
	});

	describe('Formatting Functions', () => {
		describe('formatDuration', () => {
			it('should format milliseconds', () => {
				expect(formatDuration(500)).toBe('500ms');
				expect(formatDuration(999)).toBe('999ms');
			});

			it('should format seconds', () => {
				expect(formatDuration(1000)).toBe('1.0s');
				expect(formatDuration(5500)).toBe('5.5s');
				expect(formatDuration(59999)).toBe('60.0s');
			});

			it('should format minutes', () => {
				expect(formatDuration(60000)).toBe('1.0m');
				expect(formatDuration(150000)).toBe('2.5m');
				expect(formatDuration(3599999)).toBe('60.0m');
			});

			it('should format hours', () => {
				expect(formatDuration(3600000)).toBe('1.0h');
				expect(formatDuration(7200000)).toBe('2.0h');
				expect(formatDuration(5400000)).toBe('1.5h');
			});
		});

		describe('formatCost', () => {
			it('should format small costs with 4 decimals', () => {
				expect(formatCost(0.001)).toBe('$0.0010');
				expect(formatCost(0.0099)).toBe('$0.0099');
			});

			it('should format larger costs with 2 decimals', () => {
				expect(formatCost(0.01)).toBe('$0.01');
				expect(formatCost(1.50)).toBe('$1.50');
				expect(formatCost(100.00)).toBe('$100.00');
			});

			it('should handle zero cost', () => {
				expect(formatCost(0)).toBe('$0.0000');
			});
		});

		describe('formatTokens', () => {
			it('should format small token counts', () => {
				expect(formatTokens(100)).toBe('100 tokens');
				expect(formatTokens(999)).toBe('999 tokens');
			});

			it('should format thousands', () => {
				expect(formatTokens(1000)).toBe('1.0K tokens');
				expect(formatTokens(5500)).toBe('5.5K tokens');
				expect(formatTokens(999999)).toBe('1000.0K tokens');
			});

			it('should format millions', () => {
				expect(formatTokens(1000000)).toBe('1.0M tokens');
				expect(formatTokens(2500000)).toBe('2.5M tokens');
			});

			it('should handle zero tokens', () => {
				expect(formatTokens(0)).toBe('0 tokens');
			});
		});
	});
});
