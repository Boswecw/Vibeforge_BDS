/**
 * Coordinator Service
 *
 * Business logic for coordinator agent operations
 */

import { coordinatorStore } from "$lib/stores/coordinator.svelte";
import { streamingService } from "./streaming";
import type {
  WorkflowRequest,
  WorkflowExecution,
  AgentNode,
  Dependency,
} from "$lib/types/agents";
import {
  createValidationError,
  classifyError,
  type AppError,
} from "$lib/utils/errors";

// ═══════════════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════════════

const API_BASE_URL =
  import.meta.env.VITE_FORGE_AGENTS_URL || "http://localhost:8787";

// ═══════════════════════════════════════════════════════════════════════
// Validation Functions
// ═══════════════════════════════════════════════════════════════════════

export function validateWorkflowRequest(
  request: WorkflowRequest
): AppError | null {
  // Validate task description
  if (!request.task || request.task.trim().length === 0) {
    return createValidationError("Task description is required");
  }

  // Validate agent nodes
  if (!request.agents || request.agents.length === 0) {
    return createValidationError("At least one agent node is required");
  }

  // Validate agent types
  const validTypes = ["planning", "execution", "evaluation"];
  for (const agent of request.agents) {
    if (!validTypes.includes(agent.type)) {
      return createValidationError(`Invalid agent type: ${agent.type}`);
    }
  }

  // Validate dependencies don't create cycles
  const hasCycle = detectCycle(request.agents, request.dependencies || []);
  if (hasCycle) {
    return createValidationError("Workflow contains circular dependencies");
  }

  return null;
}

function detectCycle(nodes: AgentNode[], edges: Dependency[]): boolean {
  const graph = new Map<string, Set<string>>();

  // Build adjacency list
  nodes.forEach((node) => graph.set(node.id, new Set()));
  edges.forEach((edge) => {
    const deps = graph.get(edge.from);
    if (deps) deps.add(edge.to);
  });

  const visited = new Set<string>();
  const recStack = new Set<string>();

  function hasCycleUtil(nodeId: string): boolean {
    if (recStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = graph.get(nodeId);
    if (neighbors) {
      for (const neighbor of neighbors) {
        if (hasCycleUtil(neighbor)) return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  }

  for (const nodeId of graph.keys()) {
    if (hasCycleUtil(nodeId)) return true;
  }

  return false;
}

// ═══════════════════════════════════════════════════════════════════════
// Workflow Session Management
// ═══════════════════════════════════════════════════════════════════════

export async function startWorkflowSession(
  request: WorkflowRequest
): Promise<{ success: boolean; sessionId?: string; error?: AppError }> {
  // Validate request
  const validationError = validateWorkflowRequest(request);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    // Start session on backend
    const startResponse = await fetch(
      `${API_BASE_URL}/api/v1/bds/workflow/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: request.task,
          agents: request.agents,
          dependencies: request.dependencies || [],
          options: request.options || {},
        }),
      }
    );

    if (!startResponse.ok) {
      const error = await startResponse.json();
      return {
        success: false,
        error: createValidationError(
          error.detail || "Failed to start workflow session"
        ),
      };
    }

    const { sessionId } = await startResponse.json();

    // Create local session with backend session ID
    const session = coordinatorStore.createSession(request);
    session.id = sessionId;

    // Start the session
    coordinatorStore.startSession(session.id);

    // Subscribe to SSE stream
    const streamUrl = `${API_BASE_URL}/api/v1/bds/workflow/${sessionId}/stream`;

    let currentAgentId: string | null = null;

    streamingService.subscribe(streamUrl, {
      onChunk: (content: string) => {
        if (currentAgentId) {
          coordinatorStore.appendStreamingOutput(
            session.id,
            currentAgentId,
            content
          );
        }
      },
      onStageStart: (agentId: string) => {
        currentAgentId = agentId;
        coordinatorStore.updateAgentStatus(session.id, agentId, "running");
      },
      onStageEnd: (agentId: string, output: unknown) => {
        coordinatorStore.updateAgentStatus(session.id, agentId, "completed");
        coordinatorStore.updateAgentOutput(
          session.id,
          agentId,
          typeof output === "string" ? output : JSON.stringify(output)
        );
        currentAgentId = null;
      },
      onComplete: (_result: unknown) => {
        coordinatorStore.completeSession(session.id);
      },
      onError: (error: AppError) => {
        coordinatorStore.failSession(session.id, error.message);
      },
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

export function getAgentTypeIcon(type: string): string {
  switch (type) {
    case "planning":
      return "📝";
    case "execution":
      return "⚡";
    case "evaluation":
      return "✓";
    default:
      return "🤖";
  }
}

export function getAgentStatusColor(
  status: string
): "success" | "warning" | "danger" | "neutral" {
  switch (status) {
    case "completed":
      return "success";
    case "running":
      return "warning";
    case "failed":
      return "danger";
    default:
      return "neutral";
  }
}

export function calculateWorkflowProgress(workflow: WorkflowExecution): number {
  const total = workflow.agent_states.length;
  if (total === 0) return 0;

  const completed = workflow.agent_states.filter(
    (s) => s.status === "completed"
  ).length;
  return (completed / total) * 100;
}
