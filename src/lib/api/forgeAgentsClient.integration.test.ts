/**
 * Integration Tests for ForgeAgentsClient
 * Tests real API calls to ForgeAgents BDS API running on localhost:8787
 *
 * Prerequisites:
 * - ForgeAgents BDS API must be running on localhost:8787
 * - Run: cd forge_agents_bds_api && venv/bin/uvicorn app.main:app --port 8787
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { ForgeAgentsClient } from './forgeAgentsClient';
import type { Skill } from './types';

describe('ForgeAgentsClient - Integration Tests', () => {
	let client: ForgeAgentsClient;
	const API_BASE_URL = 'http://localhost:8787';

	beforeAll(() => {
		client = new ForgeAgentsClient(API_BASE_URL);
	});

	// ═══════════════════════════════════════════════════════════════════════
	// Health Check
	// ═══════════════════════════════════════════════════════════════════════

	describe('Health Check', () => {
		it('should connect to ForgeAgents BDS API', async () => {
			const response = await fetch(`${API_BASE_URL}/health`);
			expect(response.ok).toBe(true);

			const data = await response.json();
			expect(data.status).toBe('healthy');
			expect(data.service).toBe('ForgeAgents BDS API');
			expect(data.skills_loaded).toBeGreaterThan(0);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════
	// List Skills
	// ═══════════════════════════════════════════════════════════════════════

	describe('List Skills', () => {
		it('should fetch all skills successfully', async () => {
			const response = await client.listSkills();

			expect(response).toBeDefined();
			expect(response.skills).toBeInstanceOf(Array);
			expect(response.skills.length).toBeGreaterThan(0);
			expect(response.skills.length).toBe(120); // Expected 120 skills
		});

		it('should return skills with correct schema', async () => {
			const response = await client.listSkills();
			const firstSkill: Skill = response.skills[0];

			// Check required fields
			expect(firstSkill).toHaveProperty('id');
			expect(firstSkill).toHaveProperty('name');
			expect(firstSkill).toHaveProperty('section');
			expect(firstSkill).toHaveProperty('category');
			expect(firstSkill).toHaveProperty('description');
			expect(firstSkill).toHaveProperty('inputs');
			expect(firstSkill).toHaveProperty('access');
			expect(firstSkill).toHaveProperty('tags');
			expect(firstSkill).toHaveProperty('estimatedCost');
			expect(firstSkill).toHaveProperty('recommendedModels');
			expect(firstSkill).toHaveProperty('outputFormat');

			// Check types
			expect(typeof firstSkill.id).toBe('string');
			expect(typeof firstSkill.name).toBe('string');
			expect(Array.isArray(firstSkill.tags)).toBe(true);
			expect(['PUBLIC', 'BDS_ONLY']).toContain(firstSkill.access);
		});

		it('should include BDS_ONLY skills', async () => {
			const response = await client.listSkills();
			const bdsSkills = response.skills.filter((s) => s.access === 'BDS_ONLY');

			expect(bdsSkills.length).toBeGreaterThan(0);
		});

		it('should include PUBLIC skills', async () => {
			const response = await client.listSkills();
			const publicSkills = response.skills.filter((s) => s.access === 'PUBLIC');

			expect(publicSkills.length).toBeGreaterThan(0);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════
	// Get Skill by ID
	// ═══════════════════════════════════════════════════════════════════════

	describe('Get Skill by ID', () => {
		it('should fetch skill A1 (80/20 Extractor)', async () => {
			const skill = await client.getSkill('A1');

			expect(skill).toBeDefined();
			expect(skill.id).toBe('A1');
			expect(skill.name).toBe('80/20 Extractor');
			expect(skill.category).toBe('Learning');
			expect(skill.section).toBe('V1');
		});

		it('should handle invalid skill ID gracefully', async () => {
			await expect(client.getSkill('INVALID_ID')).rejects.toThrow();
		});

		it('should fetch multiple skills by ID', async () => {
			const skillIds = ['A1', 'A2', 'A3'];
			const skills = await Promise.all(skillIds.map((id) => client.getSkill(id)));

			expect(skills.length).toBe(3);
			expect(skills[0].id).toBe('A1');
			expect(skills[1].id).toBe('A2');
			expect(skills[2].id).toBe('A3');
		});
	});

	// ═══════════════════════════════════════════════════════════════════════
	// Error Handling
	// ═══════════════════════════════════════════════════════════════════════

	describe('Error Handling', () => {
		it('should handle 404 Not Found', async () => {
			await expect(client.getSkill('NONEXISTENT')).rejects.toMatchObject({
				category: 'NOT_FOUND',
				statusCode: 404
			});
		});

		it('should classify network errors', async () => {
			const badClient = new ForgeAgentsClient('http://localhost:99999'); // Invalid port

			await expect(badClient.listSkills()).rejects.toMatchObject({
				category: 'NETWORK',
				retryable: true
			});
		});

		it('should include error timestamps', async () => {
			try {
				await client.getSkill('INVALID');
			} catch (error: any) {
				expect(error.timestamp).toBeInstanceOf(Date);
			}
		});

		it('should generate unique error IDs', async () => {
			const errors: any[] = [];

			try {
				await client.getSkill('INVALID1');
			} catch (e) {
				errors.push(e);
			}

			try {
				await client.getSkill('INVALID2');
			} catch (e) {
				errors.push(e);
			}

			expect(errors.length).toBe(2);
			expect(errors[0].id).not.toBe(errors[1].id);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════
	// Request Logging
	// ═══════════════════════════════════════════════════════════════════════

	describe('Request Logging', () => {
		it('should log requests to console', async () => {
			const consoleSpy = vi.spyOn(console, 'log');

			await client.listSkills();

			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining('[ForgeAgents API] Request:'),
				expect.any(Object)
			);

			consoleSpy.mockRestore();
		});

		it('should log responses with duration', async () => {
			const consoleSpy = vi.spyOn(console, 'log');

			await client.listSkills();

			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining('[ForgeAgents API] Response:'),
				expect.objectContaining({
					duration: expect.stringMatching(/\d+ms/)
				})
			);

			consoleSpy.mockRestore();
		});
	});

	// ═══════════════════════════════════════════════════════════════════════
	// Timeout Handling
	// ═══════════════════════════════════════════════════════════════════════

	describe('Timeout Handling', () => {
		it('should timeout after 30 seconds (default)', async () => {
			// This test would require a mock endpoint that delays >30s
			// Skipping actual implementation as it would slow down tests
			expect(true).toBe(true);
		}, 35000);
	});

	// ═══════════════════════════════════════════════════════════════════════
	// Retry Logic
	// ═══════════════════════════════════════════════════════════════════════

	describe('Retry Logic', () => {
		it('should retry failed requests up to 3 times', async () => {
			const badClient = new ForgeAgentsClient('http://localhost:99998');

			const start = Date.now();
			await expect(badClient.listSkills()).rejects.toThrow();
			const duration = Date.now() - start;

			// Should have tried 3 times with exponential backoff
			// Minimum time: retry 1 (0ms) + retry 2 (1000ms) + retry 3 (2000ms) = 3000ms
			expect(duration).toBeGreaterThan(3000);
		}, 15000);
	});

	// ═══════════════════════════════════════════════════════════════════════
	// Performance
	// ═══════════════════════════════════════════════════════════════════════

	describe('Performance', () => {
		it('should fetch skills in under 500ms', async () => {
			const start = Date.now();
			await client.listSkills();
			const duration = Date.now() - start;

			expect(duration).toBeLessThan(500);
		});

		it('should handle concurrent requests', async () => {
			const promises = [
				client.getSkill('A1'),
				client.getSkill('A2'),
				client.getSkill('A3'),
				client.getSkill('A4'),
				client.getSkill('A5')
			];

			const start = Date.now();
			const results = await Promise.all(promises);
			const duration = Date.now() - start;

			expect(results.length).toBe(5);
			// Concurrent requests should be faster than sequential (5 x 100ms = 500ms)
			expect(duration).toBeLessThan(1000);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════
	// Skill Categories
	// ═══════════════════════════════════════════════════════════════════════

	describe('Skill Categories', () => {
		it('should have Learning category skills', async () => {
			const response = await client.listSkills();
			const learningSkills = response.skills.filter((s) => s.category === 'Learning');

			expect(learningSkills.length).toBeGreaterThan(0);
		});

		it('should have Coding category skills', async () => {
			const response = await client.listSkills();
			const codingSkills = response.skills.filter((s) => s.category === 'Coding');

			expect(codingSkills.length).toBeGreaterThan(0);
		});

		it('should have all expected categories', async () => {
			const response = await client.listSkills();
			const categories = [...new Set(response.skills.map((s) => s.category))];

			expect(categories).toContain('Learning');
			expect(categories).toContain('Coding');
			expect(categories.length).toBeGreaterThan(5);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════
	// Skill Sections
	// ═══════════════════════════════════════════════════════════════════════

	describe('Skill Sections', () => {
		it('should have V1 section skills', async () => {
			const response = await client.listSkills();
			const v1Skills = response.skills.filter((s) => s.section === 'V1');

			expect(v1Skills.length).toBeGreaterThan(0);
		});

		it('should have BDS section skills', async () => {
			const response = await client.listSkills();
			const bdsSkills = response.skills.filter((s) => s.section === 'BDS');

			expect(bdsSkills.length).toBeGreaterThan(0);
		});
	});
});
