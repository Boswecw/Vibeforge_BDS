export type AgentSessionType = 'planner' | 'execution' | 'evaluator' | 'coordinator';

export interface AgentSessionRequest {
	type: AgentSessionType;
	templateId?: string;
	label?: string;
	input: Record<string, unknown>;
	metadata?: Record<string, unknown>;
}

export interface AgentSessionResponse {
	id: string;
	type: AgentSessionType;
	label: string;
	status: AgentSessionStatus;
	createdAt: string;
	paortEvents?: PAORTEvent[];
	output?: unknown;
	metadata?: Record<string, unknown>;
}

export type AgentSessionStatus = 'pending' | 'running' | 'completed' | 'failed';

export type PAORTPhase = 'plan' | 'act' | 'observe' | 'reflect' | 'transition';

export interface PAORTEvent {
	id: string;
	sessionId: string;
	phase: PAORTPhase;
	message: string;
	timestamp: string;
	metadata?: Record<string, unknown>;
}

export interface SASSection {
	id: string;
	title: string;
	body: string;
	tags: string[];
	lastUpdated: string;
}

export interface EvaluationHistoryItem {
	id: string;
	entityId: string;
	score: number;
	notes?: string;
	timestamp: string;
}
