# VibeForge_BDS Complete Context & Implementation Guide

**Project:** VibeForge_BDS (Internal Agent-Powered Development Workbench)  
**Version:** 0.1.0 (Pre-Alpha)  
**Status:** Phase 2 Implementation (31% Complete)  
**Stack:** SvelteKit 5, Svelte 5 Runes, TypeScript, Tauri 2.x  
**Target Launch:** January 2026  
**Test Coverage Requirement:** 100% (Non-negotiable)

---

## 📋 Executive Summary

VibeForge_BDS is the internal BDS fork of VibeForge, designed as a multi-agent development workbench. Unlike public VibeForge, this version integrates directly with backend Forge services:

- **ForgeAgents** (port 8787) - Agent orchestration & PAORT sessions
- **MAPO** (Multi-AI Pipeline Orchestrator) - Multi-step orchestration
- **NeuroForge** (port 8000) - Model routing & champion selection
- **DataForge** (port 8788) - Data persistence & evaluation metrics

The application is a **Tauri desktop app** with a SvelteKit 5 frontend enabling engineers to plan, execute, evaluate, and coordinate multi-agent workflows.

---

## 🏗️ Current Architecture

### Desktop Application Structure

```
VibeForge_BDS (Tauri Desktop)
├── Frontend: SvelteKit 5 + Svelte 5 Runes (TypeScript strict)
├── Desktop Bridge: Tauri 2.x (Rust backend)
└── State Management: Svelte stores with $state/$derived runes

Key Routes:
├── /                     (Main dashboard)
├── /planning/            (Planner agent UI)
├── /execution/           (Execution agent UI)
├── /evaluator/           (Evaluator agent UI)
├── /coordinator/         (Coordinator agent UI)
└── /settings/            (Configuration)
```

### Three-Tier Integration Architecture

```
┌─────────────────────────────────────────┐
│        VibeForge_BDS (Tauri Frontend)    │
│     SvelteKit 5 + Svelte 5 + TypeScript  │
└──────────┬──────────────────────────────┘
           │
           ├─── ForgeAgents API (8787)
           │    ├─ PAORT Session Management
           │    ├─ Agent-to-agent Communication
           │    └─ Event Streaming
           │
           ├─── DataForge API (8788)
           │    ├─ Session Persistence
           │    ├─ Evaluation Metrics
           │    └─ Audit Logging
           │
           ├─── MAPO (Multi-AI Orchestration)
           │    ├─ 4-stage Pipeline (default)
           │    ├─ 2-stage Quick (fast mode)
           │    └─ 6-stage Deep (comprehensive)
           │
           └─── NeuroForge (8000)
                ├─ Model Routing
                ├─ Safety Layer
                └─ Telemetry
```

---

## 🤖 Four Core Agents (PAORT-Based)

### 1. 🧠 Planner Agent

**Purpose:** Task decomposition and strategic planning

**Responsibilities:**
- Analyze user requests
- Break down complex tasks into steps
- Identify dependencies and prerequisites
- Estimate effort and complexity
- Generate execution strategy

**PAORT Cycle:**
- **Plan:** Understand request structure
- **Act:** Create step-by-step plan
- **Observe:** Review plan completeness
- **Reflect:** Identify gaps
- **Transition:** Output structured plan

**UI Panel Location:** `/planning/`

### 2. ⚙️ Execution Agent

**Purpose:** Code implementation and task execution

**Responsibilities:**
- Write code based on planner output
- Implement features and fix bugs
- Run tests and validate implementations
- Handle file operations
- Manage code generation

**PAORT Cycle:**
- **Plan:** Parse planner output
- **Act:** Implement code
- **Observe:** Verify implementation
- **Reflect:** Test results
- **Transition:** Report completion

**UI Panel Location:** `/execution/`

### 3. ✅ Evaluator Agent

**Purpose:** Quality assessment and validation

**Responsibilities:**
- Evaluate code quality
- Run automated tests
- Validate SAS (Safety & Standards) compliance
- Provide detailed feedback
- Suggest improvements

**PAORT Cycle:**
- **Plan:** Define evaluation criteria
- **Act:** Run tests and checks
- **Observe:** Collect results
- **Reflect:** Assess against standards
- **Transition:** Report findings

**UI Panel Location:** `/evaluator/`

### 4. 🎯 Coordinator Agent

**Purpose:** Workflow orchestration and agent management

**Responsibilities:**
- Coordinate multi-agent workflows
- Manage PAORT session lifecycle
- Handle error recovery and retries
- Track overall task progress
- Manage dependencies

**PAORT Cycle:**
- **Plan:** Design workflow
- **Act:** Execute coordination logic
- **Observe:** Track progress
- **Reflect:** Adapt to changes
- **Transition:** Complete workflow

**UI Panel Location:** `/coordinator/`

---

## 📊 Phase 2 Implementation Status

### Completed (Phase 0-1)

- ✅ SvelteKit 5 + TypeScript foundation
- ✅ Tauri 2.x configuration
- ✅ Type definitions for agents
- ✅ Store infrastructure (basic)
- ✅ Route structure

### In Progress (Phase 2 - 31% Complete)

**Current Work:**
- License Store & Feature Gates (DONE)
- Planning Types & Data Models (DONE)
- Model Router Service (DONE)
- Planning Orchestrator (IN PROGRESS)

**Remaining Phase 2:**
- [ ] Planning UI Panel
- [ ] Execution UI Panel
- [ ] Evaluator UI Panel
- [ ] Coordinator UI Panel
- [ ] SSE streaming integration
- [ ] Error boundary & offline handling
- [ ] Comprehensive testing (100% coverage)

### Planned (Phase 3-5)

- Phase 3: PAORT Session Management
- Phase 4: SAS Integration
- Phase 5: Multi-Agent Coordination

---

## 🔧 Technology Stack Details

### Frontend

**Framework:** SvelteKit 5.x
- Server-side rendering capable
- File-based routing (`src/routes/`)
- Built-in API routes (`src/routes/+server.ts`)
- Hooks system for layout/page logic

**Component Framework:** Svelte 5 with Runes
```svelte
<script>
  // State (reactive)
  let count = $state(0);
  
  // Derived (computed)
  let doubled = $derived(count * 2);
  
  // Effects
  $effect(() => {
    console.log('Count changed to', count);
  });
</script>
```

**Styling:** Tailwind CSS v4
- Utility-first approach
- Custom configuration in `tailwind.config.js`
- Dark mode enabled by default

**Language:** TypeScript 5.9 (strict mode)
- All files must pass strict type checking
- No `any` types allowed
- Comprehensive type definitions required

### Desktop Framework

**Tauri 2.x**
- Rust backend for OS integration
- IPC (Inter-Process Communication) bridge
- File system access
- Window management

### State Management

**Svelte Stores** (5-based)
```svelte
// Using svelte/store with Svelte 5 runes
import { writable, derived } from 'svelte/store';

// Store definition
export const agentStore = writable({
  agents: [],
  currentSession: null
});

// Derived store
export const activeAgents = derived(agentStore, $store => 
  $store.agents.filter(a => a.active)
);
```

### API Integration

**Environment Configuration** (`.env`)
```
VITE_FORGE_AGENTS_BASE_URL=http://localhost:8787
VITE_DATAFORGE_BASE_URL=http://localhost:8788
VITE_NEUROFORGE_BASE_URL=http://localhost:8000
VITE_BDS_AUTH_TOKEN=internal-api-key
```

**HTTP Client:** Fetch API (built-in)
- All requests must include auth headers
- Implement retry logic with exponential backoff
- Handle 401/403 with graceful degradation

---

## 📁 Project File Structure

```
vibeforge_bds/
├── src/
│   ├── routes/                      # SvelteKit routes
│   │   ├── +page.svelte             # Main dashboard
│   │   ├── +layout.svelte           # App layout
│   │   ├── planning/
│   │   │   ├── +page.svelte         # Planner UI
│   │   │   ├── +layout.svelte       # Layout
│   │   │   └── [...session]/+page.svelte  # Session detail
│   │   ├── execution/
│   │   │   ├── +page.svelte         # Execution UI
│   │   │   └── [...session]/+page.svelte
│   │   ├── evaluator/
│   │   │   ├── +page.svelte         # Evaluator UI
│   │   │   └── [...session]/+page.svelte
│   │   ├── coordinator/
│   │   │   ├── +page.svelte         # Coordinator UI
│   │   │   └── [...workflow]/+page.svelte
│   │   ├── settings/
│   │   │   └── +page.svelte         # Settings page
│   │   └── api/                     # Server routes
│   │       ├── auth/
│   │       │   └── +server.ts
│   │       ├── sessions/
│   │       │   └── +server.ts
│   │       └── metrics/
│   │           └── +server.ts
│   │
│   ├── lib/
│   │   ├── agents/                  # Agent system
│   │   │   ├── types.ts             # Type definitions
│   │   │   ├── templates.ts         # Agent templates
│   │   │   ├── registry.ts          # Agent registry
│   │   │   └── paort.ts             # PAORT cycle logic
│   │   │
│   │   ├── api/                     # Backend clients
│   │   │   ├── types.ts             # API types
│   │   │   ├── forgeAgentsClient.ts # ForgeAgents API
│   │   │   ├── dataForgeClient.ts   # DataForge API
│   │   │   ├── neuroForgeClient.ts  # NeuroForge API
│   │   │   └── httpClient.ts        # Base HTTP client
│   │   │
│   │   ├── stores/                  # Svelte stores
│   │   │   ├── license.svelte.ts    # License store
│   │   │   ├── planning.svelte.ts   # Planning sessions
│   │   │   ├── execution.svelte.ts  # Execution state
│   │   │   ├── evaluator.svelte.ts  # Evaluation state
│   │   │   ├── coordinator.svelte.ts # Coordination state
│   │   │   ├── auth.svelte.ts       # Authentication
│   │   │   └── ui.svelte.ts         # UI state (modals, etc)
│   │   │
│   │   ├── components/              # Reusable UI
│   │   │   ├── panels/
│   │   │   │   ├── PlannerPanel.svelte
│   │   │   │   ├── ExecutionPanel.svelte
│   │   │   │   ├── EvaluatorPanel.svelte
│   │   │   │   └── CoordinatorPanel.svelte
│   │   │   ├── common/
│   │   │   │   ├── Header.svelte
│   │   │   │   ├── Sidebar.svelte
│   │   │   │   ├── StatusBadge.svelte
│   │   │   │   ├── SessionCard.svelte
│   │   │   │   └── ErrorBoundary.svelte
│   │   │   └── streaming/
│   │   │       ├── StreamingOutput.svelte
│   │   │       ├── ProgressBar.svelte
│   │   │       └── StageIndicator.svelte
│   │   │
│   │   ├── services/                # Business logic
│   │   │   ├── planningService.ts
│   │   │   ├── executionService.ts
│   │   │   ├── evaluatorService.ts
│   │   │   └── coordinatorService.ts
│   │   │
│   │   ├── config/                  # Configuration
│   │   │   ├── backend.ts           # Backend URLs
│   │   │   ├── constants.ts         # Constants
│   │   │   └── theme.ts             # Theme colors
│   │   │
│   │   └── utils/                   # Utilities
│   │       ├── formatting.ts
│   │       ├── validation.ts
│   │       ├── streaming.ts
│   │       └── retry.ts
│   │
│   ├── tests/                       # Test files
│   │   ├── agents/
│   │   ├── api/
│   │   ├── stores/
│   │   ├── services/
│   │   └── components/
│   │
│   └── app.css                      # Global styles
│
├── src-tauri/                       # Tauri Rust backend
├── tests/                           # E2E tests
├── svelte.config.js                 # Svelte config
├── vite.config.ts                   # Vite config
├── tsconfig.json                    # TypeScript config
├── tailwind.config.js               # Tailwind config
├── package.json
└── pnpm-lock.yaml
```

---

## 🎨 Design System

### Color Scheme (Dark Mode Only)

```
Primary Backgrounds:
- bg: #1B1E24 (main background)
- surface: #2A2D33 (cards, elevated)
- surfaceAlt: #353A42 (alternative surface)

Accents:
- brass: #C19745 (primary accent)
- violet: #7B5FF1 (secondary accent)

Text:
- text: #F5F6F7 (primary text)
- textMuted: #8A8F99 (secondary text)
- textLight: #5B6370 (tertiary text)

Semantic:
- success: #49C883 (green)
- error: #E8A64D (amber)
- warning: #F8A856 (orange)
- info: #6366F1 (indigo)

Borders:
- border: rgba(193, 151, 69, 0.15) (subtle brass)
- borderDark: rgba(193, 151, 69, 0.3) (prominent brass)
```

### Typography

**Fonts Loaded:**
- Cinzel Light (headings, display text)
- Inter (body, UI)
- JetBrains Mono (code, technical terms)

**Type Scale:**
```
h1: Cinzel, 32px, 1.2 line-height
h2: Cinzel, 24px, 1.3 line-height
h3: Cinzel, 20px, 1.4 line-height
body: Inter, 14px, 1.5 line-height
code: JetBrains Mono, 12px, 1.4 line-height
```

### Spacing

- Base unit: 12px (12px grid)
- Gaps: 12px, 24px, 36px
- Padding: 12px, 16px, 24px
- Margins: 12px, 24px, 36px

---

## 🧪 Testing Requirements

### Mandatory 100% Coverage

Every feature must have:
- Unit tests for services/utilities
- Component tests for UI elements
- Integration tests for flows
- E2E tests for critical paths

### Test Structure

```typescript
// Example test file
import { describe, it, expect, beforeEach } from 'vitest';
import { planningStore } from '$lib/stores/planning.svelte';

describe('Planning Store', () => {
  beforeEach(() => {
    // Reset state
  });

  it('should initialize with default state', () => {
    expect(planningStore.sessions).toEqual([]);
  });

  it('should add new session', async () => {
    await planningStore.createSession({
      title: 'Test task',
      description: 'Test description'
    });
    
    expect(planningStore.sessions.length).toBe(1);
  });
});
```

### Test Configuration

- Framework: Vitest
- Component testing: Svelte Testing Library
- E2E: Playwright (optional for Tauri)
- Coverage tool: c8 or Vitest built-in

---

## 🔌 Backend Integration

### ForgeAgents API (Port 8787)

**Session Management:**
```typescript
// Start PAORT session
POST /sessions
{
  "agent_type": "planner",
  "task": "...",
  "config": { ... }
}

// Get session status
GET /sessions/{sessionId}

// Stream session events
GET /sessions/{sessionId}/stream
```

### DataForge API (Port 8788)

**Persistence:**
```typescript
// Save session result
POST /sessions
{
  "session_id": "...",
  "result": { ... },
  "metadata": { ... }
}

// Retrieve metrics
GET /metrics/{sessionId}
```

### NeuroForge API (Port 8000)

**Model Routing:**
```typescript
// Route request to best model
POST /route
{
  "task": "planning",
  "context": "...",
  "budget": { ... }
}
```

---

## 🚀 Development Workflow

### Setup

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run tests
pnpm test

# Type check
pnpm check

# Build
pnpm build
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/description

# Make changes
# Run tests: pnpm test
# Type check: pnpm check

# Commit with meaningful message
git commit -m "feat: description (100% coverage)"

# Push to origin
git push origin feature/description

# Create PR with tests passing
```

### Claude Code Execution

```bash
# In VSCode, run Claude Code prompt
claude --dangerously-skip-permissions

# Claude will:
# 1. Create/modify files
# 2. Run tests after each change
# 3. Ensure 100% coverage
# 4. Create git checkpoint on success
```

---

## ⚠️ Critical Constraints

### Non-Negotiable Rules

1. **100% Test Coverage** - Every line of code must be tested
2. **TypeScript Strict Mode** - No `any` types, all strict checks enabled
3. **No Direct LLM Calls** - All model access goes through backend services
4. **PAORT Model** - Multi-step workflows use PAORT sessions
5. **SAS Compliance** - All data handling follows SAS guidelines
6. **Dark Mode Only** - No light mode support
7. **Tauri Desktop** - Web-only features not supported

### Common Pitfalls to Avoid

- ❌ Using `any` type in TypeScript
- ❌ Skipping tests for "simple" features
- ❌ Direct API calls from frontend to OpenAI/Anthropic
- ❌ Using localStorage (use Svelte stores)
- ❌ Synchronous operations (always async)
- ❌ Magic strings (use constants)
- ❌ Missing error handling

---

## 📊 Current Implementation Details

### License Store (COMPLETED)

```typescript
// Manages freemium feature gating
- Tracks subscription tier (free/pro)
- Controls feature access
- Manages usage limits
- Integration points for monetization
```

### Planning Types (COMPLETED)

```typescript
// Type definitions for planning system
PlanningRequest: { title, description, context }
PlanningSession: { id, request, stages[], status }
PlanningStage: { type, model, prompt, output, status }
Deliverable: { plan, prompt, metadata }
```

### Model Router Service (COMPLETED)

```typescript
// Routes requests to optimal model
- ChatGPT for Stage 1 (initial planning)
- Claude for Stage 2 (review)
- ChatGPT for Stage 3 (refinement)
- Claude for Stage 4 (final plan)
- Handles fallbacks and retries
```

### Planning Orchestrator (IN PROGRESS)

```typescript
// Manages multi-stage collaborative planning
- Orchestrates 4-stage default pipeline
- Handles streaming responses
- Manages session lifecycle
- Tracks metrics and costs
```

---

## 🎯 Success Criteria for Phase 2 Completion

- [ ] All 4 agent UI panels functional (Planning, Execution, Evaluator, Coordinator)
- [ ] SSE streaming working for real-time updates
- [ ] License gating enforced across features
- [ ] Error boundary catching errors gracefully
- [ ] Offline detection with user-friendly banner
- [ ] 100% test coverage across all code
- [ ] TypeScript strict mode passing
- [ ] All types properly defined (no `any`)
- [ ] Git checkpoints created for each step
- [ ] Build succeeding without warnings
- [ ] Development server running without errors

---

## 📞 Support & Resources

### Internal Documentation
- Backend service contracts (ForgeAgents, DataForge, NeuroForge)
- PAORT session specification
- SAS compliance guidelines
- Architecture decision records

### Development Tools
- VSCode with Svelte extension
- Tauri CLI
- pnpm for package management
- Vitest for testing

### Key Contacts
- Charles Boswell (Project Lead)
- BDS Engineering Team
- AI Pair Programming (Claude Code)

---

## 🔄 Next Steps

1. **Review this context** - Ensure understanding of full scope
2. **Run existing tests** - `pnpm test` to verify current state
3. **Start Phase 2 UI Implementation** - Build agent panels
4. **Maintain 100% coverage** - Test every feature
5. **Create git checkpoints** - Save progress at each milestone
6. **Iterate and refine** - Get feedback from team

---

**Ready to implement Phase 2 of VibeForge_BDS? Use the accompanying Claude Code prompt.**
