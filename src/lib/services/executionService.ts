/**
 * Execution Service
 *
 * Business logic for execution agent operations.
 */

import type { ExecutionRequest, ExecutionResult, StageOutput } from '$lib/types/agents';
import { PAORTStage } from '$lib/types/agents';
import { executionStore } from '$lib/stores/execution.svelte';
import { streamingService } from './streaming';
import { classifyError, type AppError } from '$lib/utils/errors';

const API_BASE_URL = 'http://localhost:8787';

export async function startExecutionSession(
	request: ExecutionRequest
): Promise<{ success: boolean; sessionId?: string; error?: AppError }> {
	try {
		// Start session on backend
		const startResponse = await fetch(`${API_BASE_URL}/api/v1/bds/execution/start`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				plan: request.plan || '',
				language: request.language || 'typescript',
				framework: request.framework || ''
			})
		});

		if (!startResponse.ok) {
			const error = await startResponse.json();
			const appError = classifyError(new Error(error.detail || 'Failed to start session'));
			return { success: false, error: appError };
		}

		const { sessionId } = await startResponse.json();

		// Create local session with backend session ID
		const session = executionStore.createSession(request);
		session.id = sessionId;

		executionStore.startSession(session.id);

		const streamUrl = `${API_BASE_URL}/api/v1/bds/execution/${sessionId}/stream`;

		streamingService.subscribe(streamUrl, {
			onChunk: (content: string) => {
				executionStore.appendStreamingOutput(content);
			},

			onStageStart: (stage: string) => {
				const paortStage = stage as PAORTStage;
				executionStore.advanceStage(session.id, paortStage);
			},

			onStageEnd: (stage: string, output: unknown) => {
				const paortStage = stage as PAORTStage;
				const stageOutput = output as StageOutput;
				executionStore.updateStageOutput(session.id, paortStage, stageOutput);
				executionStore.clearStreamingOutput();
			},

			onComplete: (result: unknown) => {
				const executionResult = result as ExecutionResult;
				executionStore.completeSession(session.id, executionResult);
			},

			onError: (error: AppError) => {
				executionStore.failSession(session.id, error.message);
			}
		});

		return { success: true, sessionId: session.id };
	} catch (error) {
		const appError = classifyError(error);
		return { success: false, error: appError };
	}
}

export function cancelExecutionSession(sessionId: string): void {
	executionStore.cancelSession(sessionId);
}

export function deleteExecutionSession(sessionId: string): void {
	executionStore.deleteSession(sessionId);
}
