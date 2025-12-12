/**
 * Evaluator Service
 *
 * Business logic for evaluator agent operations
 */

import { evaluatorStore } from '$lib/stores/evaluator.svelte';
import { streamingService } from './streaming';
import { PAORTStage } from '$lib/types/agents';
import type {
	EvaluationRequest,
	EvaluationAssessment,
	PAORTStage as PAORTStageType,
	StageOutput
} from '$lib/types/agents';
import { createValidationError, classifyError, type AppError } from '$lib/utils/errors';

// ═══════════════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════════════

const API_BASE_URL = import.meta.env.VITE_FORGE_AGENTS_URL || 'http://localhost:8787';

// ═══════════════════════════════════════════════════════════════════════
// Validation Functions
// ═══════════════════════════════════════════════════════════════════════

export function validateEvaluationRequest(request: EvaluationRequest): AppError | null {
	// Validate execution result
	if (!request.executionResult) {
		return createValidationError('Execution result is required');
	}

	// Validate code is present
	if (!request.executionResult.code || request.executionResult.code.trim().length === 0) {
		return createValidationError('No code to evaluate');
	}

	// Validate evaluation criteria
	if (!request.criteria || request.criteria.length === 0) {
		return createValidationError('At least one evaluation criterion is required');
	}

	return null;
}

// ═══════════════════════════════════════════════════════════════════════
// Evaluator Session Management
// ═══════════════════════════════════════════════════════════════════════

export async function startEvaluationSession(
	request: EvaluationRequest
): Promise<{ success: boolean; sessionId?: string; error?: AppError }> {
	// Validate request
	const validationError = validateEvaluationRequest(request);
	if (validationError) {
		return { success: false, error: validationError };
	}

	try {
		// Create new evaluation session
		const session = evaluatorStore.createSession(request);

		// Start the session
		evaluatorStore.startSession(session.id);

		// Subscribe to SSE stream
		const streamUrl = `${API_BASE_URL}/api/v1/bds/evaluation/${session.id}/stream`;

		streamingService.subscribe(streamUrl, {
			onChunk: (content: string) => {
				evaluatorStore.appendStreamingOutput(content);
			},
			onStageStart: (stage: string) => {
				const paortStage = stage as PAORTStageType;
				evaluatorStore.advanceStage(session.id, paortStage);
			},
			onStageEnd: (stage: string, output: unknown) => {
				const paortStage = stage as PAORTStageType;
				const stageOutput = output as StageOutput;
				evaluatorStore.updateStageOutput(session.id, paortStage, stageOutput);
			},
			onComplete: (result: unknown) => {
				const assessment = result as EvaluationAssessment;
				evaluatorStore.completeSession(session.id, assessment);
			},
			onError: (error: AppError) => {
				evaluatorStore.failSession(session.id, error.message);
			}
		});

		return { success: true, sessionId: session.id };
	} catch (error) {
		const appError = classifyError(error);
		return { success: false, error: appError };
	}
}

// ═══════════════════════════════════════════════════════════════════════
// Formatting Utilities
// ═══════════════════════════════════════════════════════════════════════

export function formatScore(score: number): string {
	return `${(score * 100).toFixed(1)}%`;
}

export function formatComplexity(complexity: string): string {
	return complexity.charAt(0).toUpperCase() + complexity.slice(1).toLowerCase();
}

export function getScoreColor(score: number): 'success' | 'warning' | 'danger' {
	if (score >= 0.8) return 'success';
	if (score >= 0.6) return 'warning';
	return 'danger';
}

export function getComplianceStatus(
	score: number
): 'compliant' | 'partial' | 'non-compliant' {
	if (score >= 0.9) return 'compliant';
	if (score >= 0.7) return 'partial';
	return 'non-compliant';
}
