/**
 * Agent Types Test
 *
 * Verifies type definitions for agents.
 */

import { describe, it, expect } from 'vitest';
import type {
	PAORTStage,
	SessionStatus,
	PlanningRequest,
	PlanningSession,
	ExecutionRequest,
	ExecutionSession,
	EvaluationRequest,
	EvaluationSession,
	WorkflowRequest,
	CoordinationSession,
	StreamChunk
} from './agents';
import {
	PAORTStage as PAORTStageEnum,
	SessionStatus as SessionStatusEnum,
	WorkflowStatus
} from './agents';

describe('Agent Type Definitions', () => {
	describe('PAORT Stage Enum', () => {
		it('should have all required stages', () => {
			expect(PAORTStageEnum.PLAN).toBe('PLAN');
			expect(PAORTStageEnum.ACT).toBe('ACT');
			expect(PAORTStageEnum.OBSERVE).toBe('OBSERVE');
			expect(PAORTStageEnum.REFLECT).toBe('REFLECT');
			expect(PAORTStageEnum.TRANSITION).toBe('TRANSITION');
		});
	});

	describe('Session Status Enum', () => {
		it('should have all required statuses', () => {
			expect(SessionStatusEnum.PENDING).toBe('PENDING');
			expect(SessionStatusEnum.RUNNING).toBe('RUNNING');
			expect(SessionStatusEnum.COMPLETED).toBe('COMPLETED');
			expect(SessionStatusEnum.FAILED).toBe('FAILED');
			expect(SessionStatusEnum.CANCELLED).toBe('CANCELLED');
		});
	});

	describe('Workflow Status Enum', () => {
		it('should have all required statuses', () => {
			expect(WorkflowStatus.PENDING).toBe('PENDING');
			expect(WorkflowStatus.RUNNING).toBe('RUNNING');
			expect(WorkflowStatus.COMPLETED).toBe('COMPLETED');
			expect(WorkflowStatus.FAILED).toBe('FAILED');
			expect(WorkflowStatus.PARTIAL).toBe('PARTIAL');
		});
	});

	describe('Type Exports', () => {
		it('should export PlanningRequest type', () => {
			const request: PlanningRequest = {
				title: 'Test Plan',
				description: 'Test Description'
			};
			expect(request.title).toBe('Test Plan');
		});

		it('should export ExecutionRequest type', () => {
			const request: ExecutionRequest = {
				planSessionId: 'test-id',
				plan: {
					plan: {
						title: 'Test',
						overview: 'Test',
						steps: [],
						estimatedEffort: '1h',
						risks: []
					},
					prompt: 'test',
					metadata: {
						totalTokens: 0,
						totalCost: 0,
						duration: 0
					}
				}
			};
			expect(request.planSessionId).toBe('test-id');
		});

		it('should export EvaluationRequest type', () => {
			const request: EvaluationRequest = {
				executionSessionId: 'test-id',
				result: {
					code: {
						filesModified: [],
						filesCreated: [],
						filesDeleted: []
					},
					tests: {
						passed: 0,
						failed: 0,
						skipped: 0,
						total: 0,
						failures: []
					},
					metrics: {
						tokensUsed: 0,
						cost: 0,
						duration: 0,
						modelUsed: 'test',
						linesOfCode: 0
					}
				}
			};
			expect(request.executionSessionId).toBe('test-id');
		});

		it('should export WorkflowRequest type', () => {
			const request: WorkflowRequest = {
				title: 'Test Workflow',
				description: 'Test',
				agents: [],
				dependencies: []
			};
			expect(request.title).toBe('Test Workflow');
		});
	});

	describe('Session Types', () => {
		it('should support PlanningSession type', () => {
			const session: Partial<PlanningSession> = {
				id: 'test-id',
				type: 'planning',
				status: SessionStatusEnum.PENDING,
				createdAt: new Date()
			};
			expect(session.type).toBe('planning');
		});

		it('should support ExecutionSession type', () => {
			const session: Partial<ExecutionSession> = {
				id: 'test-id',
				type: 'execution',
				status: SessionStatusEnum.PENDING,
				createdAt: new Date()
			};
			expect(session.type).toBe('execution');
		});

		it('should support EvaluationSession type', () => {
			const session: Partial<EvaluationSession> = {
				id: 'test-id',
				type: 'evaluation',
				status: SessionStatusEnum.PENDING,
				createdAt: new Date()
			};
			expect(session.type).toBe('evaluation');
		});

		it('should support CoordinationSession type', () => {
			const session: Partial<CoordinationSession> = {
				id: 'test-id',
				type: 'coordination',
				status: SessionStatusEnum.PENDING,
				createdAt: new Date()
			};
			expect(session.type).toBe('coordination');
		});
	});

	describe('Stream Chunk Types', () => {
		it('should support basic StreamChunk type', () => {
			const chunk: StreamChunk = {
				type: 'chunk',
				data: { test: 'data' },
				timestamp: new Date()
			};
			expect(chunk.type).toBe('chunk');
		});

		it('should support stage_start chunk type', () => {
			const chunk: StreamChunk = {
				type: 'stage_start',
				data: { stage: PAORTStageEnum.PLAN },
				timestamp: new Date()
			};
			expect(chunk.type).toBe('stage_start');
		});

		it('should support stage_end chunk type', () => {
			const chunk: StreamChunk = {
				type: 'stage_end',
				data: {
					stage: PAORTStageEnum.PLAN,
					output: {
						stage: PAORTStageEnum.PLAN,
						data: {},
						summary: 'test',
						status: 'success' as const
					}
				},
				timestamp: new Date()
			};
			expect(chunk.type).toBe('stage_end');
		});
	});
});
