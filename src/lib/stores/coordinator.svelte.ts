/**
 * Coordinator Store
 *
 * Manages multi-agent workflow coordination using Svelte 5 runes.
 */

import type {
  CoordinationSession,
  WorkflowRequest,
  WorkflowExecution,
  WorkflowNodeExecution,
} from "$lib/types/agents";
import { SessionStatus, WorkflowStatus } from "$lib/types/agents";

// ═══════════════════════════════════════════════════════════════════════
// Coordinator Store State
// ═══════════════════════════════════════════════════════════════════════

interface CoordinatorState {
  sessions: CoordinationSession[];
  currentSession: CoordinationSession | null;
  isCoordinating: boolean;
}

const state = $state<CoordinatorState>({
  sessions: [],
  currentSession: null,
  isCoordinating: false,
});

// ═══════════════════════════════════════════════════════════════════════
// Coordinator Store
// ═══════════════════════════════════════════════════════════════════════

export const coordinatorStore = {
  // Getters
  get sessions() {
    return state.sessions;
  },

  get currentSession() {
    return state.currentSession;
  },

  get isCoordinating() {
    return state.isCoordinating;
  },

  get activeSessions() {
    return state.sessions.filter(
      (s) =>
        s.status === SessionStatus.RUNNING || s.status === SessionStatus.PENDING
    );
  },

  get completedSessions() {
    return state.sessions.filter((s) => s.status === SessionStatus.COMPLETED);
  },

  get failedSessions() {
    return state.sessions.filter((s) => s.status === SessionStatus.FAILED);
  },

  // Actions
  createSession(request: WorkflowRequest): CoordinationSession {
    // Initialize workflow node executions
    const nodeExecutions: WorkflowNodeExecution[] = request.agents.map(
      (agent) => ({
        nodeId: agent.id,
        status: "pending",
        progress: 0,
      })
    );

    const workflow: WorkflowExecution = {
      nodes: nodeExecutions,
      status: WorkflowStatus.PENDING,
    };

    const session: CoordinationSession = {
      id: generateSessionId(),
      type: "coordination",
      status: SessionStatus.PENDING,
      createdAt: new Date(),
      request,
      workflow,
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
    session.workflow.status = WorkflowStatus.RUNNING;
    session.workflow.startedAt = new Date();

    state.isCoordinating = true;

    // Trigger reactivity
    state.sessions = [...state.sessions];
  },

  updateNodeExecution(
    sessionId: string,
    nodeId: string,
    updates: Partial<WorkflowNodeExecution>
  ): void {
    const session = state.sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const node = session.workflow.nodes.find((n) => n.nodeId === nodeId);
    if (!node) return;

    // Apply updates
    Object.assign(node, updates);

    // Trigger reactivity
    state.sessions = [...state.sessions];
  },

  startNode(sessionId: string, nodeId: string, agentSessionId: string): void {
    const session = state.sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const node = session.workflow.nodes.find((n) => n.nodeId === nodeId);
    if (!node) return;

    node.status = "running";
    node.sessionId = agentSessionId;
    node.startedAt = new Date();
    node.progress = 0;

    // Trigger reactivity
    state.sessions = [...state.sessions];
  },

  updateNodeProgress(
    sessionId: string,
    nodeId: string,
    progress: number
  ): void {
    const session = state.sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const node = session.workflow.nodes.find((n) => n.nodeId === nodeId);
    if (!node) return;

    node.progress = Math.min(100, Math.max(0, progress));

    // Trigger reactivity
    state.sessions = [...state.sessions];
  },

  completeNode(sessionId: string, nodeId: string): void {
    const session = state.sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const node = session.workflow.nodes.find((n) => n.nodeId === nodeId);
    if (!node) return;

    node.status = "completed";
    node.completedAt = new Date();
    node.progress = 100;

    // Check if all nodes are completed
    const allCompleted = session.workflow.nodes.every(
      (n) => n.status === "completed"
    );
    if (allCompleted) {
      this.completeSession(sessionId);
    }

    // Trigger reactivity
    state.sessions = [...state.sessions];
  },

  failNode(sessionId: string, nodeId: string, error: string): void {
    const session = state.sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const node = session.workflow.nodes.find((n) => n.nodeId === nodeId);
    if (!node) return;

    node.status = "failed";
    node.completedAt = new Date();
    node.error = error;

    // Mark workflow as partial failure
    session.workflow.status = WorkflowStatus.PARTIAL;

    // Trigger reactivity
    state.sessions = [...state.sessions];
  },

  completeSession(sessionId: string): void {
    const session = state.sessions.find((s) => s.id === sessionId);
    if (!session) return;

    session.status = SessionStatus.COMPLETED;
    session.completedAt = new Date();
    session.workflow.status = WorkflowStatus.COMPLETED;
    session.workflow.completedAt = new Date();

    state.isCoordinating = false;

    // Trigger reactivity
    state.sessions = [...state.sessions];
  },

  failSession(sessionId: string, error: string): void {
    const session = state.sessions.find((s) => s.id === sessionId);
    if (!session) return;

    session.status = SessionStatus.FAILED;
    session.completedAt = new Date();
    session.error = error;
    session.workflow.status = WorkflowStatus.FAILED;
    session.workflow.error = error;
    session.workflow.completedAt = new Date();

    state.isCoordinating = false;

    // Trigger reactivity
    state.sessions = [...state.sessions];
  },

  cancelSession(sessionId: string): void {
    const session = state.sessions.find((s) => s.id === sessionId);
    if (!session) return;

    session.status = SessionStatus.CANCELLED;
    session.completedAt = new Date();
    session.workflow.status = WorkflowStatus.FAILED;
    session.workflow.error = "Workflow cancelled by user";
    session.workflow.completedAt = new Date();

    if (state.currentSession?.id === sessionId) {
      state.isCoordinating = false;
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
      state.isCoordinating = false;
    }
  },

  clearAll(): void {
    state.sessions = [];
    state.currentSession = null;
    state.isCoordinating = false;
  },

  // Additional methods for workflow coordination
  get isRunning() {
    return state.isCoordinating;
  },

  updateAgentStatus(sessionId: string, agentId: string, status: string): void {
    const session = state.sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const node = session.workflow.nodes.find((n) => n.nodeId === agentId);
    if (!node) return;

    node.status = status as "pending" | "running" | "completed" | "failed";

    // Trigger reactivity
    state.sessions = [...state.sessions];
  },

  updateAgentOutput(sessionId: string, agentId: string, output: string): void {
    const session = state.sessions.find((s) => s.id === sessionId);
    if (!session || !session.workflow.agent_states) return;

    const agentState = session.workflow.agent_states.find(
      (a) => a.id === agentId || a.agent_id === agentId
    );
    if (agentState) {
      agentState.output = output;
    }

    // Trigger reactivity
    state.sessions = [...state.sessions];
  },

  appendStreamingOutput(
    sessionId: string,
    agentId: string,
    chunk: string
  ): void {
    const session = state.sessions.find((s) => s.id === sessionId);
    if (!session || !session.workflow.agent_states) return;

    const agentState = session.workflow.agent_states.find(
      (a) => a.id === agentId || a.agent_id === agentId
    );
    if (agentState) {
      agentState.output = (agentState.output || "") + chunk;
    }

    // Trigger reactivity
    state.sessions = [...state.sessions];
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════

function generateSessionId(): string {
  return `coordination_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
}
