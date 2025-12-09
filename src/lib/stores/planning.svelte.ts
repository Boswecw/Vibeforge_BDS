/**
 * Planning Store
 *
 * Manages planning agent sessions using Svelte 5 runes.
 */

import type {
	PlanningSession,
	PlanningRequest,
	PlanningDeliverable,
	PAORTStage,
	StageOutput
} from '$lib/types/agents';
import { SessionStatus, PAORTStage as Stage } from '$lib/types/agents';

// ═══════════════════════════════════════════════════════════════════════
// Planning Store State
// ═══════════════════════════════════════════════════════════════════════

interface PlanningState {
	sessions: PlanningSession[];
	currentSession: PlanningSession | null;
	isStreaming: boolean;
	streamingOutput: string;
	currentStage: PAORTStage | null;
}

const state = $state<PlanningState>({
	sessions: [],
	currentSession: null,
	isStreaming: false,
	streamingOutput: '',
	currentStage: null
});

// ═══════════════════════════════════════════════════════════════════════
// Planning Store
// ═══════════════════════════════════════════════════════════════════════

export const planningStore = {
	// Getters
	get sessions() {
		return state.sessions;
	},

	get currentSession() {
		return state.currentSession;
	},

	get isStreaming() {
		return state.isStreaming;
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
	createSession(request: PlanningRequest): PlanningSession {
		const session: PlanningSession = {
			id: generateSessionId(),
			type: 'planning',
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
		state.isStreaming = true;
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
			// No next stage means we're done
			session.currentStage = undefined;
			state.currentStage = null;
			state.isStreaming = false;
		}

		// Trigger reactivity
		state.sessions = [...state.sessions];
	},

	completeSession(sessionId: string, deliverable: PlanningDeliverable): void {
		const session = state.sessions.find((s) => s.id === sessionId);
		if (!session) return;

		session.status = SessionStatus.COMPLETED;
		session.completedAt = new Date();
		session.deliverable = deliverable;
		session.currentStage = undefined;

		state.currentStage = null;
		state.isStreaming = false;
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
		state.isStreaming = false;
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
			state.isStreaming = false;
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
			state.isStreaming = false;
			state.streamingOutput = '';
		}
	},

	clearAll(): void {
		state.sessions = [];
		state.currentSession = null;
		state.isStreaming = false;
		state.streamingOutput = '';
		state.currentStage = null;
	}
};

// ═══════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════

function generateSessionId(): string {
	return `planning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
