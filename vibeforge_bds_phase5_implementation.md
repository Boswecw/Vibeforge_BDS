# VibeForge_BDS Phase 5 Implementation Guide

**Document Version:** 1.0  
**Date:** December 13, 2025  
**Target:** Claude/Codex/AI Assistant Implementation  

---

## SECTION 1: PROJECT CONTEXT

### 1.1 What is VibeForge_BDS?

VibeForge_BDS is an **internal Tauri desktop application** for Boswell Digital Solutions (BDS) that implements a multi-agent development system. It is the internal fork of the public VibeForge product, with full agent orchestration and BDS backend integration.

**Current Version:** 0.4.0 (Production Ready)  
**Status:** Phase 4 Complete, Ready for Phase 5  

### 1.2 Technology Stack

```
Frontend:
├── SvelteKit 2.x (metaframework)
├── Svelte 5 (with runes: $state, $derived, $props, $effect)
├── TypeScript 5.9 (strict mode)
└── Tailwind CSS v4

Desktop:
├── Tauri 2.2 (Rust-based)
└── Secure token storage via Tauri APIs

Backend Services (External - DO NOT MODIFY):
├── ForgeAgents (Port 8787) - PAORT sessions, agent orchestration
├── NeuroForge (Port 8000) - LLM routing, model selection, safety
└── DataForge (Port 8788) - SAS docs, metrics, persistence
```

### 1.3 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│              VibeForge_BDS (Tauri Desktop)                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Routes (SvelteKit Pages)                           │   │
│  │  /planning, /workbench, /coordinator, /admin        │   │
│  │  [Phase 5: /workflows, /sas, /analytics]            │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Components Layer                                    │   │
│  │  planning/, workbench/, coordinator/, admin/         │   │
│  │  patterns/, templates/, cortex/, execution/          │   │
│  │  [Phase 5: workflows/, sas/, analytics/]             │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Stores (Svelte 5 Runes)                            │   │
│  │  agentSessions, patterns, templates, cortex          │   │
│  │  [Phase 5: workflows, sasMetrics, analytics]         │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Clients                                         │   │
│  │  forgeAgentsClient.ts, dataForgeClient.ts            │   │
│  │  [Phase 5: workflowClient.ts, analyticsClient.ts]    │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
      ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
      │ForgeAgents│   │NeuroForge │   │ DataForge │
      │  :8787    │   │  :8000    │   │  :8788    │
      └───────────┘   └───────────┘   └───────────┘
```

### 1.4 Current Project Structure

```
vibeforge_bds/
├── src/
│   ├── routes/                      # SvelteKit pages
│   │   ├── +layout.svelte           # Main layout with nav
│   │   ├── +page.svelte             # Home/dashboard
│   │   ├── planning/+page.svelte    # Planner agent UI
│   │   ├── workbench/+page.svelte   # Execution/evaluation
│   │   ├── coordinator/+page.svelte # Multi-repo coordination
│   │   └── admin/agents/+page.svelte # Agent template admin
│   │
│   ├── lib/
│   │   ├── agents/                  # Agent definitions
│   │   │   ├── types.ts             # AgentKind, AgentTemplate
│   │   │   ├── templates.ts         # AGENT_TEMPLATES registry
│   │   │   └── templateConfig.ts    # Config facade
│   │   │
│   │   ├── api/                     # Backend clients
│   │   │   ├── types.ts             # API types (PAORT, SAS, etc.)
│   │   │   ├── forgeAgentsClient.ts # ForgeAgents API
│   │   │   └── dataForgeClient.ts   # DataForge API
│   │   │
│   │   ├── config/
│   │   │   └── backend.ts           # Backend URLs, auth headers
│   │   │
│   │   ├── stores/
│   │   │   └── agentSessions.ts     # Session management store
│   │   │
│   │   ├── sas/
│   │   │   └── evaluation.ts        # SAS evaluation logic
│   │   │
│   │   ├── telemetry/
│   │   │   └── telemetry.ts         # Event logging
│   │   │
│   │   ├── patterns/                # Prompt patterns (20+)
│   │   ├── templates/               # Template system (40+ filters)
│   │   ├── cortex/                  # Plan comparison
│   │   │
│   │   └── components/
│   │       ├── planning/            # PlanningList, PlanningDetail
│   │       ├── workbench/           # ExecutionForm, ExecutionResult
│   │       ├── coordinator/         # CoordinatorForm, CoordinatorSummary
│   │       ├── admin/               # AgentTemplateTable, AgentTemplateForm
│   │       ├── patterns/            # PatternBrowser, PatternEditor
│   │       ├── templates/           # TemplateEditor, FilterPanel
│   │       └── cortex/              # PlanComparison, QualityScore
│   │
│   ├── app.css                      # Global styles
│   ├── app.html                     # HTML template
│   └── app.d.ts                     # Type declarations
│
├── src-tauri/                       # Tauri Rust backend
├── static/                          # Static assets
├── tests/                           # Unit tests (110 passing)
├── e2e/                             # E2E tests (Phase 5)
│
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
└── .env.example
```

### 1.5 Existing API Types

```typescript
// src/lib/api/types.ts

export type AgentSessionType = 'planner' | 'execution' | 'evaluator' | 'coordinator';
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
```

### 1.6 Existing Agent Templates

```typescript
// src/lib/agents/templates.ts

export const AGENT_TEMPLATES = {
  planner: [
    {
      id: 'planner.cross-repo.feature-plan',
      label: 'Cross-Repo Feature Plan',
      description: 'Generates a multi-repo implementation plan with PAORT steps.',
      kind: 'planner',
      pipelineId: 'nf.mapo.plan.cross_repo.v1',
      allowedRepos: ['vibeforge', 'authorforge', 'dataforge', 'forgeagents'],
      autoEvaluateWithSAS: true,
      locked: true
    }
  ],
  execution: [
    {
      id: 'execution.prompt.neuroforge',
      label: 'Prompt Exec via NeuroForge',
      kind: 'execution',
      pipelineId: 'nf.mapo.prompt_exec.v1',
      allowedRepos: ['vibeforge', 'authorforge'],
      autoEvaluateWithSAS: true,
      locked: false
    }
  ],
  evaluator: [
    {
      id: 'evaluator.sas.compliance',
      label: 'SAS Compliance Check',
      kind: 'evaluator',
      pipelineId: 'nf.mapo.eval.sas.v1',
      allowedRepos: ['vibeforge', 'authorforge', 'websafe'],
      autoEvaluateWithSAS: true,
      locked: true
    }
  ],
  coordinator: [
    {
      id: 'coordinator.multi-app.provider-rollout',
      label: 'Multi-App Provider API Rollout',
      kind: 'coordinator',
      pipelineId: 'nf.mapo.coordinator.provider_rollout.v1',
      allowedRepos: ['vibeforge', 'authorforge', 'websafe', 'dataforge'],
      autoEvaluateWithSAS: true,
      locked: true
    }
  ]
};
```

### 1.7 Backend Configuration

```typescript
// src/lib/config/backend.ts

export const FORGE_AGENTS_BASE_URL = 
  import.meta.env?.VITE_FORGE_AGENTS_BASE_URL ?? 'http://localhost:8787';
export const DATAFORGE_BASE_URL = 
  import.meta.env?.VITE_DATAFORGE_BASE_URL ?? 'http://localhost:8788';

export interface BackendConfig {
  forgeAgentsBaseUrl: string;
  dataForgeBaseUrl: string;
  getAuthHeaders?: () => Record<string, string>;
}

export const backendConfig: BackendConfig = {
  forgeAgentsBaseUrl: FORGE_AGENTS_BASE_URL,
  dataForgeBaseUrl: DATAFORGE_BASE_URL,
  getAuthHeaders: () => {
    // Uses Tauri secure storage with browser fallback
    const token = localStorage.getItem('bdsAuthToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};
```

### 1.8 Code Conventions

**Svelte 5 Runes (REQUIRED):**
```svelte
<script lang="ts">
  // ✅ Use runes
  let count = $state(0);
  let doubled = $derived(count * 2);
  
  // ✅ Use $props() for component props
  let { session, onSelect }: { session: Session; onSelect: (id: string) => void } = $props();
  
  // ✅ Use onclick not on:click
  <button onclick={() => count++}>Click</button>
  
  // ❌ DO NOT use legacy syntax
  // export let session;  // Wrong
  // on:click={handler}   // Wrong
</script>
```

**TypeScript:**
```typescript
// ✅ Explicit types for all function parameters and returns
async function createSession(payload: SessionPayload): Promise<string> { }

// ✅ Use type imports
import type { AgentTemplate } from './types';

// ✅ Prefer interfaces for objects
interface WorkflowNode {
  id: string;
  type: AgentSessionType;
  position: { x: number; y: number };
  connections: string[];
}
```

**Component Structure:**
```svelte
<!-- ComponentName.svelte -->
<script lang="ts">
  import type { SomeType } from '$lib/types';
  import { someStore } from '$lib/stores/someStore';
  import ChildComponent from './ChildComponent.svelte';
  
  // Props
  let { propA, propB = 'default' }: { propA: string; propB?: string } = $props();
  
  // State
  let localState = $state('');
  
  // Derived
  let computed = $derived(localState.toUpperCase());
  
  // Functions
  function handleAction() { }
</script>

<div class="component-wrapper">
  <!-- Template -->
</div>

<style>
  /* Scoped styles if needed, prefer Tailwind */
</style>
```

**File Naming:**
- Components: `PascalCase.svelte`
- Stores: `camelCase.ts`
- Types: `types.ts` or `camelCase.types.ts`
- Utils: `camelCase.ts`

---

## SECTION 2: PHASE 5 SPECIFICATIONS

### 2.1 Track A: Multi-Agent Workflow Orchestration UI

**Goal:** Visual workflow builder for connecting agents into automated pipelines.

#### New Files to Create:

```
src/lib/
├── workflows/
│   ├── types.ts              # Workflow, Node, Edge, ExecutionState types
│   ├── workflowStore.ts      # Svelte 5 store for workflow state
│   ├── workflowEngine.ts     # Execution engine for running workflows
│   └── presets.ts            # Pre-built workflow templates
│
├── api/
│   └── workflowClient.ts     # API client for workflow persistence
│
└── components/
    └── workflows/
        ├── WorkflowCanvas.svelte      # Main drag-drop canvas
        ├── WorkflowNode.svelte        # Individual agent node
        ├── WorkflowEdge.svelte        # Connection line between nodes
        ├── WorkflowToolbar.svelte     # Add nodes, save, load, run
        ├── WorkflowSidebar.svelte     # Node properties panel
        ├── WorkflowPresets.svelte     # Template picker
        ├── WorkflowExecutionView.svelte # Live execution monitor
        └── NodeConfigModal.svelte     # Configure node parameters

src/routes/
└── workflows/
    └── +page.svelte           # Workflow editor page
```

#### Type Definitions:

```typescript
// src/lib/workflows/types.ts

export type NodeType = 'planner' | 'execution' | 'evaluator' | 'coordinator' | 'condition' | 'merge';

export interface Position {
  x: number;
  y: number;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  position: Position;
  templateId?: string;           // Reference to agent template
  config: Record<string, unknown>; // Node-specific configuration
  inputs: string[];              // Input port IDs
  outputs: string[];             // Output port IDs
}

export interface WorkflowEdge {
  id: string;
  source: string;                // Source node ID
  sourcePort: string;            // Output port ID
  target: string;                // Target node ID
  targetPort: string;            // Input port ID
  condition?: string;            // For conditional edges
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export type WorkflowExecutionStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed';

export interface NodeExecutionState {
  nodeId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  sessionId?: string;            // ForgeAgents session ID
  output?: unknown;
  error?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: WorkflowExecutionStatus;
  nodeStates: Record<string, NodeExecutionState>;
  startedAt: string;
  completedAt?: string;
  input: Record<string, unknown>;
  output?: unknown;
}

export interface WorkflowPreset {
  id: string;
  name: string;
  description: string;
  category: 'code-review' | 'feature-impl' | 'refactoring' | 'testing' | 'documentation';
  workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'version'>;
}
```

#### Store Implementation:

```typescript
// src/lib/workflows/workflowStore.ts

import { writable, derived, get } from 'svelte/store';
import type { Workflow, WorkflowNode, WorkflowEdge, WorkflowExecution } from './types';

// Current workflow being edited
export const currentWorkflow = writable<Workflow | null>(null);

// All saved workflows
export const savedWorkflows = writable<Workflow[]>([]);

// Current execution state
export const currentExecution = writable<WorkflowExecution | null>(null);

// Selected node for editing
export const selectedNodeId = writable<string | null>(null);

// Derived: selected node details
export const selectedNode = derived(
  [currentWorkflow, selectedNodeId],
  ([$workflow, $nodeId]) => {
    if (!$workflow || !$nodeId) return null;
    return $workflow.nodes.find(n => n.id === $nodeId) ?? null;
  }
);

// Actions
export function addNode(node: WorkflowNode) {
  currentWorkflow.update(w => {
    if (!w) return w;
    return { ...w, nodes: [...w.nodes, node] };
  });
}

export function updateNode(nodeId: string, updates: Partial<WorkflowNode>) {
  currentWorkflow.update(w => {
    if (!w) return w;
    return {
      ...w,
      nodes: w.nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n)
    };
  });
}

export function removeNode(nodeId: string) {
  currentWorkflow.update(w => {
    if (!w) return w;
    return {
      ...w,
      nodes: w.nodes.filter(n => n.id !== nodeId),
      edges: w.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
    };
  });
}

export function addEdge(edge: WorkflowEdge) {
  currentWorkflow.update(w => {
    if (!w) return w;
    // Prevent duplicate edges
    const exists = w.edges.some(
      e => e.source === edge.source && e.target === edge.target
    );
    if (exists) return w;
    return { ...w, edges: [...w.edges, edge] };
  });
}

export function removeEdge(edgeId: string) {
  currentWorkflow.update(w => {
    if (!w) return w;
    return { ...w, edges: w.edges.filter(e => e.id !== edgeId) };
  });
}

export function createNewWorkflow(name: string): Workflow {
  const workflow: Workflow = {
    id: crypto.randomUUID(),
    name,
    description: '',
    nodes: [],
    edges: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  };
  currentWorkflow.set(workflow);
  return workflow;
}
```

#### Pre-built Workflow Presets:

```typescript
// src/lib/workflows/presets.ts

import type { WorkflowPreset } from './types';

export const WORKFLOW_PRESETS: WorkflowPreset[] = [
  {
    id: 'preset.code-review',
    name: 'Code Review Pipeline',
    description: 'Analyze code, check for issues, suggest improvements',
    category: 'code-review',
    workflow: {
      name: 'Code Review',
      description: 'Automated code review with SAS compliance',
      nodes: [
        {
          id: 'node-1',
          type: 'planner',
          label: 'Analyze Code Structure',
          position: { x: 100, y: 100 },
          templateId: 'planner.cross-repo.feature-plan',
          config: { focusAreas: ['structure', 'patterns'] },
          inputs: ['in-1'],
          outputs: ['out-1']
        },
        {
          id: 'node-2',
          type: 'evaluator',
          label: 'SAS Compliance Check',
          position: { x: 350, y: 100 },
          templateId: 'evaluator.sas.compliance',
          config: {},
          inputs: ['in-2'],
          outputs: ['out-2']
        },
        {
          id: 'node-3',
          type: 'execution',
          label: 'Generate Review Report',
          position: { x: 600, y: 100 },
          templateId: 'execution.prompt.neuroforge',
          config: { outputFormat: 'markdown' },
          inputs: ['in-3'],
          outputs: ['out-3']
        }
      ],
      edges: [
        { id: 'edge-1', source: 'node-1', sourcePort: 'out-1', target: 'node-2', targetPort: 'in-2' },
        { id: 'edge-2', source: 'node-2', sourcePort: 'out-2', target: 'node-3', targetPort: 'in-3' }
      ]
    }
  },
  {
    id: 'preset.feature-implementation',
    name: 'Feature Implementation',
    description: 'Plan, implement, test, and document a new feature',
    category: 'feature-impl',
    workflow: {
      name: 'Feature Implementation',
      description: 'End-to-end feature development workflow',
      nodes: [
        {
          id: 'node-1',
          type: 'planner',
          label: 'Plan Feature',
          position: { x: 100, y: 150 },
          templateId: 'planner.cross-repo.feature-plan',
          config: {},
          inputs: ['in-1'],
          outputs: ['out-1']
        },
        {
          id: 'node-2',
          type: 'execution',
          label: 'Implement Code',
          position: { x: 350, y: 100 },
          templateId: 'execution.prompt.neuroforge',
          config: {},
          inputs: ['in-2'],
          outputs: ['out-2']
        },
        {
          id: 'node-3',
          type: 'execution',
          label: 'Write Tests',
          position: { x: 350, y: 200 },
          templateId: 'execution.prompt.neuroforge',
          config: { taskType: 'testing' },
          inputs: ['in-3'],
          outputs: ['out-3']
        },
        {
          id: 'node-4',
          type: 'evaluator',
          label: 'Validate Quality',
          position: { x: 600, y: 150 },
          templateId: 'evaluator.sas.compliance',
          config: {},
          inputs: ['in-4a', 'in-4b'],
          outputs: ['out-4']
        }
      ],
      edges: [
        { id: 'edge-1', source: 'node-1', sourcePort: 'out-1', target: 'node-2', targetPort: 'in-2' },
        { id: 'edge-2', source: 'node-1', sourcePort: 'out-1', target: 'node-3', targetPort: 'in-3' },
        { id: 'edge-3', source: 'node-2', sourcePort: 'out-2', target: 'node-4', targetPort: 'in-4a' },
        { id: 'edge-4', source: 'node-3', sourcePort: 'out-3', target: 'node-4', targetPort: 'in-4b' }
      ]
    }
  },
  {
    id: 'preset.refactoring',
    name: 'Refactoring Pipeline',
    description: 'Analyze, refactor, and validate code improvements',
    category: 'refactoring',
    workflow: {
      name: 'Code Refactoring',
      description: 'Safe refactoring with validation',
      nodes: [
        {
          id: 'node-1',
          type: 'planner',
          label: 'Identify Refactor Targets',
          position: { x: 100, y: 100 },
          config: {},
          inputs: ['in-1'],
          outputs: ['out-1']
        },
        {
          id: 'node-2',
          type: 'execution',
          label: 'Apply Refactoring',
          position: { x: 350, y: 100 },
          config: {},
          inputs: ['in-2'],
          outputs: ['out-2']
        },
        {
          id: 'node-3',
          type: 'evaluator',
          label: 'Verify No Regressions',
          position: { x: 600, y: 100 },
          config: {},
          inputs: ['in-3'],
          outputs: ['out-3']
        },
        {
          id: 'node-4',
          type: 'condition',
          label: 'Tests Pass?',
          position: { x: 850, y: 100 },
          config: { condition: 'output.testsPass === true' },
          inputs: ['in-4'],
          outputs: ['out-pass', 'out-fail']
        }
      ],
      edges: [
        { id: 'edge-1', source: 'node-1', sourcePort: 'out-1', target: 'node-2', targetPort: 'in-2' },
        { id: 'edge-2', source: 'node-2', sourcePort: 'out-2', target: 'node-3', targetPort: 'in-3' },
        { id: 'edge-3', source: 'node-3', sourcePort: 'out-3', target: 'node-4', targetPort: 'in-4' }
      ]
    }
  }
];
```

---

### 2.2 Track B: Advanced SAS Validation Dashboards

**Goal:** Comprehensive SAS compliance monitoring and violation tracking.

#### New Files to Create:

```
src/lib/
├── sas/
│   ├── types.ts              # Extended SAS types
│   ├── sasStore.ts           # SAS metrics and violations store
│   ├── sasAnalytics.ts       # Aggregation and trend calculations
│   └── sasReports.ts         # Report generation utilities
│
├── api/
│   └── sasClient.ts          # Extended SAS API client
│
└── components/
    └── sas/
        ├── SASDashboard.svelte        # Main dashboard view
        ├── SASOverviewCards.svelte    # Summary metric cards
        ├── SASComplianceChart.svelte  # Trend line chart
        ├── SASViolationTable.svelte   # Searchable violation list
        ├── SASViolationDetail.svelte  # Individual violation view
        ├── SASSectionBreakdown.svelte # Per-section compliance
        ├── SASReportGenerator.svelte  # Export reports
        └── SASAlertBanner.svelte      # Real-time violation alerts

src/routes/
└── sas/
    ├── +page.svelte           # SAS dashboard page
    └── violations/
        └── +page.svelte       # Violation explorer
```

#### Extended Types:

```typescript
// src/lib/sas/types.ts

export type SASComplianceLevel = 'compliant' | 'warning' | 'violation' | 'critical';

export interface SASViolation {
  id: string;
  sessionId: string;
  sectionId: string;
  sectionTitle: string;
  level: SASComplianceLevel;
  message: string;
  context: string;                // Code/prompt that caused violation
  suggestedFix?: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface SASMetrics {
  totalSessions: number;
  compliantSessions: number;
  warningCount: number;
  violationCount: number;
  criticalCount: number;
  complianceRate: number;         // 0-100
  trendDirection: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
}

export interface SASSectionMetrics {
  sectionId: string;
  sectionTitle: string;
  totalChecks: number;
  passCount: number;
  warnCount: number;
  failCount: number;
  complianceRate: number;
}

export interface SASTimeSeriesPoint {
  date: string;
  complianceRate: number;
  violationCount: number;
  sessionCount: number;
}

export interface SASReport {
  id: string;
  title: string;
  dateRange: { start: string; end: string };
  generatedAt: string;
  summary: SASMetrics;
  sectionBreakdown: SASSectionMetrics[];
  topViolations: SASViolation[];
  recommendations: string[];
}
```

---

### 2.3 Track C: E2E Testing with Playwright

**Goal:** Comprehensive browser-based testing for all UI flows.

#### Configuration:

```typescript
// playwright.config.ts

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Test Structure:

```
e2e/
├── fixtures/
│   ├── auth.ts               # Authentication helpers
│   ├── mockApi.ts            # API mocking utilities
│   └── testData.ts           # Test data factories
│
├── pages/
│   ├── BasePage.ts           # Base page object
│   ├── PlanningPage.ts       # Planning page object
│   ├── WorkbenchPage.ts      # Workbench page object
│   ├── CoordinatorPage.ts    # Coordinator page object
│   └── WorkflowsPage.ts      # Workflows page object
│
├── planning.spec.ts          # Planning flow tests
├── workbench.spec.ts         # Workbench flow tests
├── coordinator.spec.ts       # Coordinator flow tests
├── workflows.spec.ts         # Workflow editor tests
├── patterns.spec.ts          # Pattern library tests
├── sas-dashboard.spec.ts     # SAS dashboard tests
└── visual-regression.spec.ts # Screenshot comparisons
```

#### Sample Test:

```typescript
// e2e/planning.spec.ts

import { test, expect } from '@playwright/test';
import { PlanningPage } from './pages/PlanningPage';

test.describe('Planning Flow', () => {
  let planningPage: PlanningPage;

  test.beforeEach(async ({ page }) => {
    planningPage = new PlanningPage(page);
    await planningPage.goto();
  });

  test('should create a new planning session', async () => {
    await planningPage.createSession({
      description: 'Implement user authentication feature',
      repos: ['vibeforge', 'dataforge']
    });

    await expect(planningPage.sessionList).toContainText('Cross-Repo Feature Plan');
    await expect(planningPage.sessionStatus).toHaveText('pending');
  });

  test('should display PAORT events as they occur', async () => {
    await planningPage.selectSession('test-session-id');
    
    await expect(planningPage.paortTimeline).toBeVisible();
    await expect(planningPage.paortEvents).toHaveCount(5);
    
    const phases = await planningPage.getPhaseLabels();
    expect(phases).toEqual(['plan', 'act', 'observe', 'reflect', 'transition']);
  });

  test('should allow re-planning with updated constraints', async () => {
    await planningPage.selectSession('test-session-id');
    await planningPage.openReplanModal();
    
    await planningPage.setMaxSteps(15);
    await planningPage.toggleRepo('websafe');
    await planningPage.submitReplan();

    await expect(planningPage.sessionStatus).toHaveText('running');
  });
});
```

---

### 2.4 Track D: CI/CD Pipeline Configuration

**Goal:** Automated build, test, and release pipeline.

#### GitHub Actions Workflow:

```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm check
      - run: pnpm lint

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:run --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: npx playwright install --with-deps
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  build:
    needs: [lint-and-type-check, unit-tests]
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - uses: dtolnay/rust-toolchain@stable
      - run: pnpm install --frozen-lockfile
      - run: pnpm tauri build
      - uses: actions/upload-artifact@v3
        with:
          name: tauri-build-${{ matrix.os }}
          path: |
            src-tauri/target/release/bundle/
```

---

### 2.5 Track E: Performance & Analytics Dashboard

**Goal:** Observability for agent performance and usage patterns.

#### New Types:

```typescript
// src/lib/analytics/types.ts

export interface AgentPerformanceMetrics {
  agentType: AgentSessionType;
  avgExecutionTimeMs: number;
  p50ExecutionTimeMs: number;
  p95ExecutionTimeMs: number;
  p99ExecutionTimeMs: number;
  totalInvocations: number;
  successRate: number;
  avgTokenUsage: number;
}

export interface LLMCostMetrics {
  provider: 'openai' | 'anthropic' | 'local';
  model: string;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  estimatedCostUSD: number;
  requestCount: number;
}

export interface UsageMetrics {
  period: 'day' | 'week' | 'month';
  sessionCount: number;
  uniqueWorkflows: number;
  mostUsedPatterns: Array<{ patternId: string; count: number }>;
  mostUsedAgents: Array<{ agentType: string; count: number }>;
  peakUsageHour: number;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorRate: number;
  errorsByType: Record<string, number>;
  topErrors: Array<{
    message: string;
    count: number;
    lastOccurred: string;
  }>;
  avgRecoveryTimeMs: number;
}
```

---

### 2.6 Track F: Advanced Agent Features

**Goal:** Enhanced agent capabilities including memory and plugins.

#### Agent Memory Types:

```typescript
// src/lib/agents/memory/types.ts

export interface AgentMemoryEntry {
  id: string;
  agentType: AgentSessionType;
  scope: 'user' | 'repo' | 'global';
  scopeId: string;                  // userId, repoName, or 'global'
  key: string;
  value: unknown;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentMemoryQuery {
  agentType?: AgentSessionType;
  scope?: 'user' | 'repo' | 'global';
  scopeId?: string;
  keyPrefix?: string;
  limit?: number;
}

export interface AgentPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  hooks: AgentPluginHooks;
  config?: Record<string, unknown>;
}

export interface AgentPluginHooks {
  beforePlan?: (context: PluginContext) => Promise<void>;
  afterPlan?: (context: PluginContext, plan: unknown) => Promise<unknown>;
  beforeAct?: (context: PluginContext) => Promise<void>;
  afterAct?: (context: PluginContext, result: unknown) => Promise<unknown>;
  beforeEvaluate?: (context: PluginContext) => Promise<void>;
  afterEvaluate?: (context: PluginContext, evaluation: unknown) => Promise<unknown>;
  onError?: (context: PluginContext, error: Error) => Promise<void>;
}

export interface PluginContext {
  sessionId: string;
  agentType: AgentSessionType;
  input: Record<string, unknown>;
  memory: AgentMemoryEntry[];
  config: Record<string, unknown>;
}
```

---

## SECTION 3: IMPLEMENTATION PROMPT

Copy the prompt below and use it with an AI assistant to implement Phase 5.

---

```
# IMPLEMENTATION PROMPT: VibeForge_BDS Phase 5

You are implementing Phase 5 of VibeForge_BDS, an internal Tauri desktop application for Boswell Digital Solutions.

## CRITICAL CONSTRAINTS

1. **Svelte 5 Runes ONLY** - Use $state, $derived, $props, $effect. NO legacy syntax.
2. **TypeScript Strict Mode** - All functions must have explicit types.
3. **Event Syntax** - Use `onclick={handler}` NOT `on:click={handler}`.
4. **No Direct LLM Calls** - All AI goes through ForgeAgents API.
5. **SAS Compliance Required** - All agent outputs must be evaluated.

## TECHNOLOGY STACK

- SvelteKit 2.x + Svelte 5 with runes
- TypeScript 5.9 strict mode
- Tailwind CSS v4
- Tauri 2.2 (desktop)
- Backend: ForgeAgents (:8787), NeuroForge (:8000), DataForge (:8788)

## CURRENT STATE

- Version: 0.4.0 (Production Ready)
- 110 tests passing, 0 TypeScript errors
- 4 agents operational: Planner, Executor, Evaluator, Coordinator
- PAORT session management complete
- 20+ prompt patterns, 40+ template filters

## PHASE 5 TRACKS

### Track A: Workflow Orchestration UI (Priority: HIGH)
Create visual workflow builder at `/routes/workflows/`:
- Drag-drop canvas with WorkflowNode components
- Edge connections between agent nodes
- Pre-built workflow presets (code review, feature impl, refactoring)
- Live execution visualization with PAORT step highlighting
- Save/load workflows to DataForge

Files to create:
- src/lib/workflows/types.ts
- src/lib/workflows/workflowStore.ts
- src/lib/workflows/workflowEngine.ts
- src/lib/workflows/presets.ts
- src/lib/components/workflows/*.svelte
- src/routes/workflows/+page.svelte

### Track B: SAS Dashboards (Priority: HIGH)
Create compliance monitoring at `/routes/sas/`:
- Overview dashboard with compliance rate, violation counts
- Time-series trend charts
- Searchable violation explorer with filtering
- Per-section compliance breakdown
- Report generation (PDF/Markdown export)

Files to create:
- src/lib/sas/types.ts (extended)
- src/lib/sas/sasStore.ts
- src/lib/sas/sasAnalytics.ts
- src/lib/components/sas/*.svelte
- src/routes/sas/+page.svelte

### Track C: E2E Testing (Priority: MEDIUM)
Set up Playwright testing:
- Configure playwright.config.ts
- Create page objects for each route
- Write tests for planning, workbench, coordinator flows
- Add visual regression tests

Files to create:
- playwright.config.ts
- e2e/fixtures/*.ts
- e2e/pages/*.ts
- e2e/*.spec.ts

### Track D: CI/CD Pipeline (Priority: MEDIUM)
Configure GitHub Actions:
- Lint and type checking stage
- Unit test stage with coverage
- E2E test stage
- Cross-platform Tauri builds
- Release automation

Files to create:
- .github/workflows/ci.yml
- .github/workflows/release.yml

### Track E: Analytics Dashboard (Priority: LOW)
Create performance monitoring at `/routes/analytics/`:
- Agent execution time metrics
- LLM token usage and cost tracking
- Usage patterns and trends
- Error rate monitoring

### Track F: Advanced Agent Features (Priority: LOW)
Enhance agent system:
- Persistent agent memory (per-user, per-repo, global)
- Plugin system with lifecycle hooks
- Multi-model comparison tools
- Batch operation queuing

## IMPLEMENTATION ORDER

1. Start with Track A (Workflows) - highest business value
2. Then Track B (SAS Dashboards) - critical for compliance
3. Then Tracks C+D together (Testing + CI/CD) - locks in quality
4. Finally Tracks E+F (Analytics + Advanced Features) - nice-to-haves

## CODE PATTERNS TO FOLLOW

### Component Template:
```svelte
<script lang="ts">
  import type { SomeType } from '$lib/types';
  
  let { prop1, prop2 = 'default' }: { prop1: string; prop2?: string } = $props();
  
  let localState = $state('');
  let computed = $derived(localState.toUpperCase());
  
  function handleClick() {
    // handler logic
  }
</script>

<div class="...">
  <button onclick={handleClick}>Click</button>
</div>
```

### Store Template:
```typescript
import { writable, derived } from 'svelte/store';
import type { MyType } from './types';

export const myStore = writable<MyType[]>([]);

export const filteredItems = derived(myStore, ($items) => 
  $items.filter(item => item.active)
);

export function addItem(item: MyType) {
  myStore.update(items => [...items, item]);
}
```

### API Client Template:
```typescript
import { backendConfig } from '../config/backend';
import type { ResponseType } from './types';

export async function fetchData(id: string): Promise<ResponseType> {
  const res = await fetch(
    `${backendConfig.forgeAgentsBaseUrl}/endpoint/${id}`,
    { headers: backendConfig.getAuthHeaders?.() ?? {} }
  );
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}
```

## BEGIN IMPLEMENTATION

Start with Track A, Task A.1: Create the workflow types and store foundation.

Create:
1. src/lib/workflows/types.ts - All workflow-related types
2. src/lib/workflows/workflowStore.ts - Svelte store for workflow state
3. src/lib/workflows/presets.ts - Pre-built workflow templates

Then proceed to implement the UI components and route.
```

---

## SECTION 4: CHECKLIST

Use this checklist to track implementation progress:

### Track A: Workflow Orchestration UI
- [ ] A.1 Create workflow types (types.ts)
- [ ] A.2 Create workflow store (workflowStore.ts)
- [ ] A.3 Create workflow engine (workflowEngine.ts)
- [ ] A.4 Create workflow presets (presets.ts)
- [ ] A.5 Create WorkflowCanvas component
- [ ] A.6 Create WorkflowNode component
- [ ] A.7 Create WorkflowEdge component
- [ ] A.8 Create WorkflowToolbar component
- [ ] A.9 Create WorkflowSidebar component
- [ ] A.10 Create WorkflowPresets component
- [ ] A.11 Create WorkflowExecutionView component
- [ ] A.12 Create NodeConfigModal component
- [ ] A.13 Create /routes/workflows/+page.svelte
- [ ] A.14 Add navigation link to layout
- [ ] A.15 Write unit tests for workflow store
- [ ] A.16 Write unit tests for workflow engine

### Track B: SAS Dashboards
- [ ] B.1 Extend SAS types
- [ ] B.2 Create SAS store (sasStore.ts)
- [ ] B.3 Create SAS analytics utilities
- [ ] B.4 Create SASDashboard component
- [ ] B.5 Create SASOverviewCards component
- [ ] B.6 Create SASComplianceChart component
- [ ] B.7 Create SASViolationTable component
- [ ] B.8 Create SASViolationDetail component
- [ ] B.9 Create SASSectionBreakdown component
- [ ] B.10 Create SASReportGenerator component
- [ ] B.11 Create SASAlertBanner component
- [ ] B.12 Create /routes/sas/+page.svelte
- [ ] B.13 Create /routes/sas/violations/+page.svelte
- [ ] B.14 Write unit tests

### Track C: E2E Testing
- [ ] C.1 Install and configure Playwright
- [ ] C.2 Create test fixtures
- [ ] C.3 Create page objects
- [ ] C.4 Write planning flow tests
- [ ] C.5 Write workbench flow tests
- [ ] C.6 Write coordinator flow tests
- [ ] C.7 Write workflow editor tests
- [ ] C.8 Write pattern library tests
- [ ] C.9 Write SAS dashboard tests
- [ ] C.10 Add visual regression tests

### Track D: CI/CD Pipeline
- [ ] D.1 Create ci.yml workflow
- [ ] D.2 Add lint/type-check job
- [ ] D.3 Add unit test job
- [ ] D.4 Add E2E test job
- [ ] D.5 Add Tauri build matrix
- [ ] D.6 Create release.yml workflow
- [ ] D.7 Add changelog generation
- [ ] D.8 Add artifact upload

### Track E: Analytics Dashboard
- [ ] E.1 Create analytics types
- [ ] E.2 Create analytics store
- [ ] E.3 Create PerformanceDashboard component
- [ ] E.4 Create UsageMetrics component
- [ ] E.5 Create CostTracking component
- [ ] E.6 Create ErrorAnalytics component
- [ ] E.7 Create /routes/analytics/+page.svelte

### Track F: Advanced Agent Features
- [ ] F.1 Create agent memory types
- [ ] F.2 Create agent memory store
- [ ] F.3 Create agent memory API client
- [ ] F.4 Create plugin system types
- [ ] F.5 Create plugin loader
- [ ] F.6 Create multi-model comparison component
- [ ] F.7 Create batch operations queue

---

**Document End**
