/**
 * Execution Store
 *
 * Manages execution agent sessions using Svelte 5 runes.
 */

import type {
	ExecutionSession,
	ExecutionRequest,
	ExecutionResult,
	PAORTStage,
	StageOutput
} from '$lib/types/agents';
import { SessionStatus, PAORTStage as Stage } from '$lib/types/agents';

// ═══════════════════════════════════════════════════════════════════════
// Execution Store State
// ═══════════════════════════════════════════════════════════════════════

interface ExecutionState {
	sessions: ExecutionSession[];
	currentSession: ExecutionSession | null;
	isExecuting: boolean;
	streamingOutput: string;
	currentStage: PAORTStage | null;
}

const state = $state<ExecutionState>({
	sessions: [],
	currentSession: null,
	isExecuting: false,
	streamingOutput: '',
	currentStage: null
});

// ═══════════════════════════════════════════════════════════════════════
// Execution Store
// ═══════════════════════════════════════════════════════════════════════

export const executionStore = {
	// Getters
	get sessions() {
		return state.sessions;
	},

	get currentSession() {
		return state.currentSession;
	},

	get isExecuting() {
		return state.isExecuting;
	},

	get streamingOutput() {
		return state.streamingOutput;
	},

	get currentStage() {
		return state.currentStage;
	},

	get activeSessions() {
		return state.sessions.filter(
			(s) => s.status === SessionStatus.RUNNING || s.status === SessionStatus.PENDING
		);
	},

	get completedSessions() {
		return state.sessions.filter((s) => s.status === SessionStatus.COMPLETED);
	},

	get failedSessions() {
		return state.sessions.filter((s) => s.status === SessionStatus.FAILED);
	},

	// Actions
	createSession(request: ExecutionRequest): ExecutionSession {
		const session: ExecutionSession = {
			id: generateSessionId(),
			type: 'execution',
			status: SessionStatus.PENDING,
			createdAt: new Date(),
			request,
			stages: {}
		};

		state.sessions = [...state.sessions, session];
		state.currentSession = session;

		return session;
	},

	startSession(sessionId: string): void {
		const session = state.sessions.find((s) => s.id === sessionId);
		if (!session) return;

		session.status = SessionStatus.RUNNING;
		session.startedAt = new Date();
		session.currentStage = Stage.PLAN;

		state.currentStage = Stage.PLAN;
		state.isExecuting = true;
		state.streamingOutput = '';

		// Trigger reactivity
		state.sessions = [...state.sessions];
	},

	updateStageOutput(sessionId: string, stage: PAORTStage, output: StageOutput): void {
		const session = state.sessions.find((s) => s.id === sessionId);
		if (!session) return;

		// Update stage output
		switch (stage) {
			case Stage.PLAN:
				session.stages.plan = output;
				break;
			case Stage.ACT:
				session.stages.act = output;
				break;
			case Stage.OBSERVE:
				session.stages.observe = output;
				break;
			case Stage.REFLECT:
				session.stages.reflect = output;
				break;
		}

		// Trigger reactivity
		state.sessions = [...state.sessions];
	},

	appendStreamingOutput(content: string): void {
		state.streamingOutput += content;
	},

	clearStreamingOutput(): void {
		state.streamingOutput = '';
	},

	advanceStage(sessionId: string, nextStage: PAORTStage | null): void {
		const session = state.sessions.find((s) => s.id === sessionId);
		if (!session) return;

		if (nextStage) {
			session.currentStage = nextStage;
			state.currentStage = nextStage;
			state.streamingOutput = '';
		} else {
			session.currentStage = undefined;
			state.currentStage = null;
			state.isExecuting = false;
		}

		// Trigger reactivity
		state.sessions = [...state.sessions];
	},

	completeSession(sessionId: string, result: ExecutionResult): void {
		const session = state.sessions.find((s) => s.id === sessionId);
		if (!session) return;

		session.status = SessionStatus.COMPLETED;
		session.completedAt = new Date();
		session.result = result;
		session.currentStage = undefined;

		state.currentStage = null;
		state.isExecuting = false;
		state.streamingOutput = '';

		// Trigger reactivity
		state.sessions = [...state.sessions];
	},

	failSession(sessionId: string, error: string): void {
		const session = state.sessions.find((s) => s.id === sessionId);
		if (!session) return;

		session.status = SessionStatus.FAILED;
		session.completedAt = new Date();
		session.error = error;
		session.currentStage = undefined;

		state.currentStage = null;
		state.isExecuting = false;
		state.streamingOutput = '';

		// Trigger reactivity
		state.sessions = [...state.sessions];
	},

	cancelSession(sessionId: string): void {
		const session = state.sessions.find((s) => s.id === sessionId);
		if (!session) return;

		session.status = SessionStatus.CANCELLED;
		session.completedAt = new Date();
		session.currentStage = undefined;

		if (state.currentSession?.id === sessionId) {
			state.currentStage = null;
			state.isExecuting = false;
			state.streamingOutput = '';
		}

		// Trigger reactivity
		state.sessions = [...state.sessions];
	},

	setCurrentSession(sessionId: string | null): void {
		if (sessionId === null) {
			state.currentSession = null;
			return;
		}

		const session = state.sessions.find((s) => s.id === sessionId);
		if (session) {
			state.currentSession = session;
		}
	},

	deleteSession(sessionId: string): void {
		state.sessions = state.sessions.filter((s) => s.id !== sessionId);

		if (state.currentSession?.id === sessionId) {
			state.currentSession = null;
			state.currentStage = null;
			state.isExecuting = false;
			state.streamingOutput = '';
		}
	},

	clearAll(): void {
		state.sessions = [];
		state.currentSession = null;
		state.isExecuting = false;
		state.streamingOutput = '';
		state.currentStage = null;
	}
};

// ═══════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════

function generateSessionId(): string {
	return `execution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
