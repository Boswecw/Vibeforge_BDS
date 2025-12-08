import { backendConfig } from '../config/backend';
import type { AgentSessionRequest, AgentSessionResponse } from './types';

const jsonHeaders = { 'Content-Type': 'application/json' };

async function postSession(
	path: string,
	payload: AgentSessionRequest
): Promise<AgentSessionResponse> {
	const res = await fetch(`${backendConfig.forgeAgentsBaseUrl}${path}`, {
		method: 'POST',
		headers: jsonHeaders,
		body: JSON.stringify(payload)
	});

	if (!res.ok) {
		throw new Error(`ForgeAgents request failed (${res.status}): ${await res.text()}`);
	}

	return (await res.json()) as AgentSessionResponse;
}

export const startPlannerSession = (payload: AgentSessionRequest) =>
	postSession('/agents/planner/sessions', { ...payload, type: 'planner' });

export const startExecutionSession = (payload: AgentSessionRequest) =>
	postSession('/agents/execution/sessions', { ...payload, type: 'execution' });

export const startEvaluatorSession = (payload: AgentSessionRequest) =>
	postSession('/agents/evaluator/sessions', { ...payload, type: 'evaluator' });

export const startCoordinatorSession = (payload: AgentSessionRequest) =>
	postSession('/agents/coordinator/sessions', { ...payload, type: 'coordinator' });

// TODO: add streaming PAORT event subscription when ForgeAgents exposes an SSE/WebSocket endpoint.
