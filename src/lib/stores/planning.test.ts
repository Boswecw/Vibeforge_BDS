/**
 * Planning Store Tests
 *
 * Comprehensive tests for planning agent session management.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { planningStore } from './planning.svelte';
import type { PlanningRequest, StageOutput } from '$lib/types/agents';
import { SessionStatus, PAORTStage } from '$lib/types/agents';

describe('Planning Store', () => {
	beforeEach(() => {
		// Clear all sessions before each test
		planningStore.clearAll();
	});

	describe('Session Creation', () => {
		it('should create a new planning session', () => {
			const request: PlanningRequest = {
				title: 'Test Feature',
				description: 'Add user authentication'
			};

			const session = planningStore.createSession(request);

			expect(session.id).toMatch(/^planning_\d+_/);
			expect(session.type).toBe('planning');
			expect(session.status).toBe(SessionStatus.PENDING);
			expect(session.request).toEqual(request);
			expect(planningStore.sessions).toHaveLength(1);
			expect(planningStore.currentSession).toEqual(session);
		});

		it('should add session to sessions list', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			planningStore.createSession(request);
			expect(planningStore.sessions).toHaveLength(1);

			planningStore.createSession(request);
			expect(planningStore.sessions).toHaveLength(2);
		});
	});

	describe('Session Management', () => {
		it('should start a session', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			const session = planningStore.createSession(request);
			planningStore.startSession(session.id);

			const updatedSession = planningStore.sessions.find((s) => s.id === session.id);
			expect(updatedSession?.status).toBe(SessionStatus.RUNNING);
			expect(updatedSession?.startedAt).toBeDefined();
			expect(updatedSession?.currentStage).toBe(PAORTStage.PLAN);
			expect(planningStore.isStreaming).toBe(true);
			expect(planningStore.currentStage).toBe(PAORTStage.PLAN);
		});

		it('should handle starting non-existent session', () => {
			planningStore.startSession('non-existent');
			expect(planningStore.isStreaming).toBe(false);
		});

		it('should complete a session', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			const session = planningStore.createSession(request);
			planningStore.startSession(session.id);

			const deliverable = {
				plan: {
					title: 'Test Plan',
					overview: 'Overview',
					steps: [],
					estimatedEffort: '2h',
					risks: []
				},
				prompt: 'Test prompt',
				metadata: {
					totalTokens: 100,
					totalCost: 0.01,
					duration: 1000
				}
			};

			planningStore.completeSession(session.id, deliverable);

			const updatedSession = planningStore.sessions.find((s) => s.id === session.id);
			expect(updatedSession?.status).toBe(SessionStatus.COMPLETED);
			expect(updatedSession?.completedAt).toBeDefined();
			expect(updatedSession?.deliverable).toEqual(deliverable);
			expect(planningStore.isStreaming).toBe(false);
			expect(planningStore.currentStage).toBeNull();
		});

		it('should fail a session', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			const session = planningStore.createSession(request);
			planningStore.startSession(session.id);

			planningStore.failSession(session.id, 'Test error');

			const updatedSession = planningStore.sessions.find((s) => s.id === session.id);
			expect(updatedSession?.status).toBe(SessionStatus.FAILED);
			expect(updatedSession?.error).toBe('Test error');
			expect(planningStore.isStreaming).toBe(false);
		});

		it('should cancel a session', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			const session = planningStore.createSession(request);
			planningStore.startSession(session.id);

			planningStore.cancelSession(session.id);

			const updatedSession = planningStore.sessions.find((s) => s.id === session.id);
			expect(updatedSession?.status).toBe(SessionStatus.CANCELLED);
			expect(planningStore.isStreaming).toBe(false);
		});
	});

	describe('Stage Management', () => {
		it('should update stage output', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			const session = planningStore.createSession(request);
			planningStore.startSession(session.id);

			const output: StageOutput = {
				stage: PAORTStage.PLAN,
				data: { test: 'data' },
				summary: 'Test summary',
				status: 'success'
			};

			planningStore.updateStageOutput(session.id, PAORTStage.PLAN, output);

			const updatedSession = planningStore.sessions.find((s) => s.id === session.id);
			expect(updatedSession?.stages.plan).toEqual(output);
		});

		it('should advance to next stage', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			const session = planningStore.createSession(request);
			planningStore.startSession(session.id);

			planningStore.advanceStage(session.id, PAORTStage.ACT);

			const updatedSession = planningStore.sessions.find((s) => s.id === session.id);
			expect(updatedSession?.currentStage).toBe(PAORTStage.ACT);
			expect(planningStore.currentStage).toBe(PAORTStage.ACT);
			expect(planningStore.streamingOutput).toBe('');
		});

		it('should handle final stage transition', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			const session = planningStore.createSession(request);
			planningStore.startSession(session.id);

			planningStore.advanceStage(session.id, null);

			const updatedSession = planningStore.sessions.find((s) => s.id === session.id);
			expect(updatedSession?.currentStage).toBeUndefined();
			expect(planningStore.currentStage).toBeNull();
			expect(planningStore.isStreaming).toBe(false);
		});
	});

	describe('Streaming Output', () => {
		it('should append streaming output', () => {
			planningStore.appendStreamingOutput('Hello');
			expect(planningStore.streamingOutput).toBe('Hello');

			planningStore.appendStreamingOutput(' World');
			expect(planningStore.streamingOutput).toBe('Hello World');
		});

		it('should clear streaming output', () => {
			planningStore.appendStreamingOutput('Test');
			expect(planningStore.streamingOutput).toBe('Test');

			planningStore.clearStreamingOutput();
			expect(planningStore.streamingOutput).toBe('');
		});
	});

	describe('Session Queries', () => {
		it('should get active sessions', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			planningStore.createSession(request);
			const session2 = planningStore.createSession(request);
			planningStore.startSession(session2.id);

			expect(planningStore.activeSessions).toHaveLength(2);
		});

		it('should get completed sessions', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			const session = planningStore.createSession(request);
			planningStore.startSession(session.id);

			const deliverable = {
				plan: {
					title: 'Test',
					overview: 'Test',
					steps: [],
					estimatedEffort: '1h',
					risks: []
				},
				prompt: 'test',
				metadata: { totalTokens: 0, totalCost: 0, duration: 0 }
			};

			planningStore.completeSession(session.id, deliverable);

			expect(planningStore.completedSessions).toHaveLength(1);
		});

		it('should get failed sessions', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			const session = planningStore.createSession(request);
			planningStore.startSession(session.id);
			planningStore.failSession(session.id, 'Error');

			expect(planningStore.failedSessions).toHaveLength(1);
		});
	});

	describe('Session Selection', () => {
		it('should set current session', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			const session1 = planningStore.createSession(request);
			const session2 = planningStore.createSession(request);

			planningStore.setCurrentSession(session1.id);
			expect(planningStore.currentSession?.id).toBe(session1.id);

			planningStore.setCurrentSession(session2.id);
			expect(planningStore.currentSession?.id).toBe(session2.id);
		});

		it('should clear current session', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			planningStore.createSession(request);
			expect(planningStore.currentSession).not.toBeNull();

			planningStore.setCurrentSession(null);
			expect(planningStore.currentSession).toBeNull();
		});
	});

	describe('Session Deletion', () => {
		it('should delete a session', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			const session = planningStore.createSession(request);
			expect(planningStore.sessions).toHaveLength(1);

			planningStore.deleteSession(session.id);
			expect(planningStore.sessions).toHaveLength(0);
		});

		it('should clear current session when deleting active session', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			const session = planningStore.createSession(request);
			expect(planningStore.currentSession?.id).toBe(session.id);

			planningStore.deleteSession(session.id);
			expect(planningStore.currentSession).toBeNull();
		});
	});

	describe('Clear All', () => {
		it('should clear all sessions and state', () => {
			const request: PlanningRequest = {
				title: 'Test',
				description: 'Test'
			};

			planningStore.createSession(request);
			planningStore.createSession(request);
			planningStore.appendStreamingOutput('Test');

			expect(planningStore.sessions).toHaveLength(2);
			expect(planningStore.streamingOutput).toBe('Test');

			planningStore.clearAll();

			expect(planningStore.sessions).toHaveLength(0);
			expect(planningStore.currentSession).toBeNull();
			expect(planningStore.streamingOutput).toBe('');
			expect(planningStore.isStreaming).toBe(false);
			expect(planningStore.currentStage).toBeNull();
		});
	});
});
