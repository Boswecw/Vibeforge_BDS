/**
 * Planning Service
 *
 * Business logic for planning agent operations.
 */

import type { PlanningRequest, PlanningDeliverable, StageOutput } from '$lib/types/agents';
import { PAORTStage } from '$lib/types/agents';
import { planningStore } from '$lib/stores/planning.svelte';
import { streamingService } from './streaming';
import { classifyError, createValidationError, type AppError } from '$lib/utils/errors';

// ═══════════════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════════════

const API_BASE_URL = 'http://localhost:8787'; // ForgeAgents API

// ═══════════════════════════════════════════════════════════════════════
// Validation
// ═══════════════════════════════════════════════════════════════════════

export function validatePlanningRequest(request: PlanningRequest): AppError | null {
	if (!request.title || request.title.trim().length === 0) {
		return createValidationError('Title is required');
	}

	if (request.title.length > 200) {
		return createValidationError('Title must be 200 characters or less');
	}

	if (!request.description || request.description.trim().length === 0) {
		return createValidationError('Description is required');
	}

	if (request.description.length > 5000) {
		return createValidationError('Description must be 5000 characters or less');
	}

	return null;
}

// ═══════════════════════════════════════════════════════════════════════
// Planning Operations
// ═══════════════════════════════════════════════════════════════════════

export async function startPlanningSession(
	request: PlanningRequest
): Promise<{ success: boolean; sessionId?: string; error?: AppError }> {
	// Validate request
	const validationError = validatePlanningRequest(request);
	if (validationError) {
		return { success: false, error: validationError };
	}

	try {
		// Create session
		const session = planningStore.createSession(request);

		// Start session
		planningStore.startSession(session.id);

		// Subscribe to streaming updates
		const streamUrl = `${API_BASE_URL}/api/v1/bds/planning/${session.id}/stream`;

		streamingService.subscribe(streamUrl, {
			onChunk: (content: string) => {
				planningStore.appendStreamingOutput(content);
			},

			onStageStart: (stage: string) => {
				const paortStage = stage as PAORTStage;
				planningStore.advanceStage(session.id, paortStage);
			},

			onStageEnd: (stage: string, output: unknown) => {
				const paortStage = stage as PAORTStage;
				const stageOutput = output as StageOutput;
				planningStore.updateStageOutput(session.id, paortStage, stageOutput);
				planningStore.clearStreamingOutput();
			},

			onComplete: (result: unknown) => {
				const deliverable = result as PlanningDeliverable;
				planningStore.completeSession(session.id, deliverable);
			},

			onError: (error: AppError) => {
				planningStore.failSession(session.id, error.message);
			}
		});

		return { success: true, sessionId: session.id };
	} catch (error) {
		const appError = classifyError(error);
		return { success: false, error: appError };
	}
}

export function cancelPlanningSession(sessionId: string): void {
	planningStore.cancelSession(sessionId);
	// TODO: Call API to cancel server-side session
}

export function deletePlanningSession(sessionId: string): void {
	planningStore.deleteSession(sessionId);
	// TODO: Call API to delete session from DataForge
}

// ═══════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════

export function formatDuration(ms: number): string {
	if (ms < 1000) return `${ms}ms`;
	if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
	if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
	return `${(ms / 3600000).toFixed(1)}h`;
}

export function formatCost(cost: number): string {
	if (cost < 0.01) return `$${cost.toFixed(4)}`;
	return `$${cost.toFixed(2)}`;
}

export function formatTokens(tokens: number): string {
	if (tokens < 1000) return `${tokens} tokens`;
	if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K tokens`;
	return `${(tokens / 1000000).toFixed(1)}M tokens`;
}
