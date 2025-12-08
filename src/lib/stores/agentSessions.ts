import { writable, get } from 'svelte/store';
import {
	startCoordinatorSession,
	startEvaluatorSession,
	startExecutionSession,
	startPlannerSession
} from '../api/forgeAgentsClient';
import type {
	AgentSessionStatus,
	AgentSessionResponse,
	PAORTEvent
} from '../api/types';
import type { AgentTemplate } from '../agents/types';
import { AGENT_TEMPLATES } from '../agents/templates';
import { evaluateAgainstSAS } from '$lib/sas/evaluation';
import { logEvent } from '$lib/telemetry/telemetry';

export type AgentSessionKind = 'planner' | 'execution' | 'evaluator' | 'coordinator';

export interface AgentSessionSummary {
	id: string;
	kind: AgentSessionKind;
	label: string;
	status: AgentSessionStatus;
	createdAt: string;
	templateId?: string;
}

export interface AgentSessionDetail extends AgentSessionSummary {
	input?: Record<string, unknown>;
	output?: unknown;
	paortEvents: PAORTEvent[];
	metadata?: Record<string, unknown>;
	// SAS-aware evaluations can be attached later
	sasResults?: unknown;
}

const toSummary = (session: AgentSessionResponse): AgentSessionSummary => ({
	id: session.id,
	kind: session.type,
	label: session.label,
	status: session.status,
	createdAt: session.createdAt,
	templateId: session.metadata?.templateId as string | undefined
});

const agentSessionSummaries = writable<AgentSessionSummary[]>([]);
const agentSessionDetails = writable<Record<string, AgentSessionDetail>>({});

const addSession = (session: AgentSessionResponse, input?: Record<string, unknown>) => {
	const summary = toSummary(session);
	agentSessionSummaries.update((items) => [summary, ...items]);
	agentSessionDetails.update((items) => ({
		...items,
		[session.id]: {
			...summary,
			input,
			output: session.output,
			paortEvents: session.paortEvents ?? [],
			metadata: session.metadata
		}
	}));
	logEvent('session.created', summary.id, { kind: summary.kind, templateId: summary.templateId });
};

type SessionPayload = {
	label?: string;
	templateId?: string;
	input: Record<string, unknown>;
	metadata?: Record<string, unknown>;
};

const findTemplate = (id?: string): AgentTemplate | undefined => {
	if (!id) return undefined;
	const all = [
		...AGENT_TEMPLATES.planner,
		...AGENT_TEMPLATES.execution,
		...AGENT_TEMPLATES.evaluator,
		...AGENT_TEMPLATES.coordinator
	];
	return all.find((t) => t.id === id);
};

const maybeRunSAS = async (sessionId: string, template?: AgentTemplate) => {
	if (!template?.autoEvaluateWithSAS) return;
	const details = get(agentSessionDetails)[sessionId];
	if (!details) return;
	const results = await evaluateAgainstSAS(details);
	agentSessionDetails.update((items) => ({
		...items,
		[sessionId]: {
			...items[sessionId],
			sasResults: results
		}
	}));
	logEvent('sas.evaluated', sessionId, { templateId: template.id });
};

export async function createPlannerSession(payload: SessionPayload) {
	const template = findTemplate(payload.templateId);
	const res = await startPlannerSession({
		type: 'planner',
		templateId: payload.templateId,
		label: payload.label ?? template?.label ?? 'Planner Session',
		input: payload.input,
		metadata: {
			...payload.metadata,
			templateId: payload.templateId
		}
	});
	addSession(res, payload.input);
	void maybeRunSAS(res.id, template);
	logEvent('session.started', res.id, { kind: 'planner' });
	return res.id;
}

export async function createExecutionSession(payload: SessionPayload) {
	const template = findTemplate(payload.templateId);
	const res = await startExecutionSession({
		type: 'execution',
		templateId: payload.templateId,
		label: payload.label ?? template?.label ?? 'Execution Session',
		input: payload.input,
		metadata: {
			...payload.metadata,
			templateId: payload.templateId
		}
	});
	addSession(res, payload.input);
	void maybeRunSAS(res.id, template);
	logEvent('session.started', res.id, { kind: 'execution' });
	return res.id;
}

export async function createEvaluatorSession(payload: SessionPayload) {
	const template = findTemplate(payload.templateId);
	const res = await startEvaluatorSession({
		type: 'evaluator',
		templateId: payload.templateId,
		label: payload.label ?? template?.label ?? 'Evaluator Session',
		input: payload.input,
		metadata: {
			...payload.metadata,
			templateId: payload.templateId
		}
	});
	addSession(res, payload.input);
	void maybeRunSAS(res.id, template);
	logEvent('session.started', res.id, { kind: 'evaluator' });
	return res.id;
}

export async function createCoordinatorSession(payload: SessionPayload) {
	const template = findTemplate(payload.templateId);
	const res = await startCoordinatorSession({
		type: 'coordinator',
		templateId: payload.templateId,
		label: payload.label ?? template?.label ?? 'Coordinator Session',
		input: payload.input,
		metadata: {
			...payload.metadata,
			templateId: payload.templateId
		}
	});
	addSession(res, payload.input);
	void maybeRunSAS(res.id, template);
	logEvent('session.started', res.id, { kind: 'coordinator' });
	return res.id;
}

export { agentSessionSummaries, agentSessionDetails };

// TODO: add streaming PAORT event subscription when ForgeAgents exposes SSE/WebSocket.
