// Skill Definition
export interface Skill {
	id: string;
	name: string;
	section: string;
	description: string;
	inputs: Record<string, SkillInput>;
	access: 'PUBLIC' | 'BDS_ONLY';
	category: string;
	tags: string[];
	estimatedCost: { min: number; max: number };
}

export type SkillInput = {
	type: 'string' | 'number' | 'boolean' | 'array' | 'object';
	required: boolean;
	description?: string;
};

// API Responses
export interface AuthResponse {
	access_token: string;
	refresh_token: string;
	expires_at: string;
}

export interface ListSkillsResponse {
	skills: Skill[];
	total: number;
}

export interface SkillInvocationRequest {
	inputs: Record<string, any>;
	options?: {
		model?: string;
		temperature?: number;
		max_tokens?: number;
	};
}

export interface SkillInvocationResponse {
	sessionId: string;
	status: 'success' | 'error';
	output?: string;
	error?: string;
	metadata: {
		tokens_used: number;
		cost: number;
		latency_ms: number;
		model_used: string;
	};
}

// Session tracking
export interface ExecutionSession {
	sessionId: string;
	skillId: string;
	status: 'pending' | 'running' | 'completed' | 'failed';
	startedAt: Date;
	completedAt?: Date;
	output?: string;
	error?: string;
}

// Error handling
export class ForgeAgentsError extends Error {
	constructor(
		public statusCode: number,
		public message: string,
		public originalError?: any
	) {
		super(message);
		this.name = 'ForgeAgentsError';
	}
}
