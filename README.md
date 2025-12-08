<div align="center">
  <h1>VibeForge_BDS</h1>

  **Internal Agent-Powered Development Workbench**

  *For Boswell Digital Solutions Internal Use Only*
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow" alt="In Development">
  <img src="https://img.shields.io/badge/License-Internal%20BDS-red" alt="Internal BDS">
  <img src="https://img.shields.io/badge/SvelteKit-5-orange" alt="SvelteKit 5">
  <img src="https://img.shields.io/badge/Tauri-2.x-blue" alt="Tauri 2">
</p>

---

## 📋 Overview

**VibeForge_BDS** is the **internal BDS fork** of VibeForge, designed for real development work across Forge repositories. Unlike the freeware VibeForge, this version includes full agent orchestration capabilities and deep integration with BDS backend infrastructure.

### 🎯 Purpose

A **Tauri desktop application** with a **SvelteKit + TypeScript** frontend that implements a multi-agent development system for:
- Automated planning and task decomposition
- Code execution and implementation
- Quality evaluation and testing
- Workflow coordination across agents

### 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│           VibeForge_BDS (Tauri Desktop)              │
│              SvelteKit 5 + TypeScript                │
└─────────────────────┬────────────────────────────────┘
                      │
          ┌───────────┴──────────┐
          │                      │
    ┌─────▼──────┐        ┌─────▼──────┐
    │ ForgeAgents │        │ DataForge  │
    │  (PAORT)    │        │  (SAS/DB)  │
    └─────┬──────┘        └────────────┘
          │
    ┌─────▼──────┐
    │    MAPO    │  ← Multi-step orchestration brain
    │            │
    └─────┬──────┘
          │
    ┌─────▼──────┐
    │ NeuroForge  │  ← Model routing, champion selection
    │            │
    └────────────┘
```

---

## 🤖 Agent System

### Four Core Agents

#### 1. 🧠 Planner Agent
- **Purpose**: Task decomposition and strategic planning
- **Capabilities**:
  - Analyzes user requests and breaks down complex tasks
  - Generates step-by-step implementation plans
  - Identifies dependencies and prerequisites
  - Estimates effort and complexity

#### 2. ⚙️ Execution Agent
- **Purpose**: Code implementation and task execution
- **Capabilities**:
  - Writes code based on planner output
  - Implements features and fixes bugs
  - Runs tests and validates implementations
  - Handles file operations and code generation

#### 3. ✅ Evaluator Agent
- **Purpose**: Quality assessment and validation
- **Capabilities**:
  - Evaluates code quality and correctness
  - Runs automated tests and checks
  - Validates against SAS (Safety and Standards) requirements
  - Provides detailed feedback and suggestions

#### 4. 🎯 Coordinator Agent
- **Purpose**: Workflow orchestration and agent management
- **Capabilities**:
  - Coordinates multi-agent workflows
  - Manages PAORT (Plan → Act → Observe → Reflect → Transition) sessions
  - Handles error recovery and retry logic
  - Tracks overall task progress

### PAORT Sessions

All multi-agent workflows follow the **PAORT** pattern:
- **Plan**: Agent analyzes task and creates execution plan
- **Act**: Agent performs actions (code generation, testing, etc.)
- **Observe**: Agent examines results and outcomes
- **Reflect**: Agent evaluates success/failure and learns
- **Transition**: Agent determines next steps or completion

---

## 🔐 BDS-SAS Compliance

### Non-Negotiable Rules

1. **No Direct LLM Calls**: Client must never call OpenAI/Anthropic APIs directly. All LLM access is via ForgeAgents → MAPO → NeuroForge.

2. **No Production Data Mutation**: Client cannot mutate production data directly. All writes go through DataForge APIs with proper validation.

3. **PAORT Session Model**: Multi-step reasoning flows must be modeled as ForgeAgents PAORT sessions.

4. **Safety/Evaluation Required**: SAS safety and evaluation steps cannot be bypassed.

### Backend Service Integration

**ForgeAgents** - Agent orchestration and PAORT session management
- Session lifecycle management
- Agent-to-agent communication
- Event streaming and logging

**MAPO** - Multi-step orchestration brain
- Sits between agents and NeuroForge
- Manages complex multi-turn workflows
- Handles context propagation and state

**NeuroForge** - Model routing and safety
- Champion/fallback model selection
- Safety layer enforcement
- Telemetry and performance tracking

**DataForge** - Data persistence and retrieval
- SAS document storage
- Evaluation metrics
- Session logs and history

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v20.x or later
- **pnpm**: v9.x or later
- **Rust**: Latest stable (for Tauri)
- **Tauri CLI**: v2.x
- **Git**: Latest version

### Installation

```bash
# Clone the repository
git clone https://github.com/bds/Forge.git
cd Forge/vibeforge_bds

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Environment Configuration

Create a `.env` file in the project root:

```bash
# Backend Service URLs
VITE_FORGE_AGENTS_URL=http://localhost:8100
VITE_MAPO_URL=http://localhost:8200
VITE_NEUROFORGE_URL=http://localhost:8000
VITE_DATAFORGE_URL=http://localhost:8001

# Authentication
VITE_BDS_API_KEY=your-internal-api-key

# Feature Flags
VITE_ENABLE_PLANNER_AGENT=true
VITE_ENABLE_EXECUTION_AGENT=true
VITE_ENABLE_EVALUATOR_AGENT=true
VITE_ENABLE_COORDINATOR_AGENT=true
```

---

## 💻 Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build desktop app
pnpm tauri build

# Type checking
pnpm check

# Lint code
pnpm lint

# Run tests (when implemented)
pnpm test
```

### Project Structure

```
vibeforge_bds/
├── src/
│   ├── routes/              # SvelteKit pages
│   │   ├── +page.svelte     # Main agent workbench
│   │   ├── planner/         # Planner agent UI
│   │   ├── execution/       # Execution agent UI
│   │   ├── evaluator/       # Evaluator agent UI
│   │   └── coordinator/     # Coordinator agent UI
│   │
│   ├── lib/
│   │   ├── agents/          # Agent system core
│   │   │   ├── templates.ts # Agent definitions
│   │   │   ├── types.ts     # Type definitions
│   │   │   └── registry.ts  # Agent registry
│   │   │
│   │   ├── api/             # Backend client layer
│   │   │   ├── forgeAgentsClient.ts
│   │   │   ├── dataForgeClient.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── config/          # Configuration
│   │   │   └── backend.ts   # Backend URLs
│   │   │
│   │   ├── stores/          # Svelte stores
│   │   │   ├── agents.svelte.ts
│   │   │   ├── sessions.svelte.ts
│   │   │   └── sas.svelte.ts
│   │   │
│   │   └── components/      # UI components
│   │       ├── AgentPanel.svelte
│   │       ├── SessionViewer.svelte
│   │       └── PAORTTracker.svelte
│   │
│   └── tests/               # Test files (future)
│
├── src-tauri/               # Tauri backend (Rust)
├── static/                  # Static assets
├── .env.example             # Environment template
└── package.json
```

---

## 🔧 Implementation Phases

The agent system is being implemented in phases. See [VIBEFORGE_BDS_AGENTS_Codex_PLAN.md](../vibeforge/VIBEFORGE_BDS_AGENTS_Codex_PLAN.md) for the complete implementation plan.

### Phase 0: Backend Client Layer ⏳
- [ ] ForgeAgents API client
- [ ] DataForge API client
- [ ] Backend configuration
- [ ] Type definitions

### Phase 1: Agent Templates & Registry ⏳
- [ ] Define AgentTemplate type
- [ ] Create agent registry
- [ ] Configure pipeline IDs
- [ ] SAS integration points

### Phase 2: Agent UI Panels ⏳
- [ ] Planner panel
- [ ] Execution panel
- [ ] Evaluator panel
- [ ] Coordinator panel

### Phase 3: PAORT Session Management ⏳
- [ ] Session lifecycle
- [ ] Event streaming
- [ ] Progress tracking
- [ ] Error handling

### Phase 4: SAS Integration ⏳
- [ ] Safety validation
- [ ] Standards compliance
- [ ] Evaluation metrics
- [ ] Audit logging

### Phase 5: Multi-Agent Coordination ⏳
- [ ] Agent-to-agent communication
- [ ] Workflow orchestration
- [ ] Dependency management
- [ ] State synchronization

---

## 🛠️ Tech Stack

**Frontend:**
- **SvelteKit 2.x** - Full-stack metaframework
- **Svelte 5** - Latest with runes (`$state`, `$derived`, `$props`)
- **TypeScript 5.9** - Full type safety
- **Tailwind CSS v4** - Utility-first styling

**Desktop:**
- **Tauri 2.x** - Rust-based desktop framework
- **Rust** - Backend logic and system integration

**Backend Integration:**
- **ForgeAgents** - Agent orchestration (internal)
- **MAPO** - Multi-step orchestration (internal)
- **NeuroForge** - Model routing (internal)
- **DataForge** - Data persistence (internal)

---

## 📊 Current Status

**Version:** 0.1.0 (Pre-Alpha)
**Status:** 🟡 Active Development
**License:** Internal BDS Use Only

### Completed

- ✅ Initial project setup
- ✅ SvelteKit + TypeScript foundation
- ✅ Tauri desktop configuration

### In Progress

- ⏳ Backend client layer (Phase 0)
- ⏳ Agent template registry (Phase 1)

### Planned

- 📋 Agent UI panels (Phase 2)
- 📋 PAORT session management (Phase 3)
- 📋 SAS integration (Phase 4)
- 📋 Multi-agent coordination (Phase 5)

---

## 🔒 Security & Compliance

### Internal Use Only

**VibeForge_BDS** is strictly for **internal BDS development use**. It is **not** part of the freeware VibeForge distribution.

- ❌ Not for public release
- ❌ Not for client/customer use
- ❌ Contains proprietary BDS infrastructure code
- ❌ Requires internal API keys and credentials

### Data Handling

- All LLM interactions logged to DataForge
- PII and sensitive data handled per BDS SAS policies
- Session recordings stored with encryption
- Audit trails maintained for compliance

---

## 🤝 Development Team

**Primary Developers:**
- Charles Boswell (BDS)
- AI Pair Programming (Codex, Claude, Copilot)

**Related Projects:**
- VibeForge (public freeware version)
- ForgeAgents (internal agent framework)
- MAPO (internal orchestration)
- NeuroForge (internal LLM routing)
- DataForge (internal data platform)

---

## 📄 License

**© 2025 Boswell Digital Solutions LLC — All Rights Reserved.**

This is proprietary software for internal BDS use only. Unauthorized distribution, modification, or use is strictly prohibited.

---

## 🔗 Resources

**Internal Documentation:**
- [Implementation Plan](../vibeforge/VIBEFORGE_BDS_AGENTS_Codex_PLAN.md) - Phase-by-phase agent system plan
- [BDS SAS Guidelines](https://internal.bds/sas) - Safety and standards requirements
- [ForgeAgents API Docs](https://internal.bds/forgeagents) - Agent orchestration API
- [MAPO Documentation](https://internal.bds/mapo) - Multi-step orchestration guide

**Related Projects:**
- [VibeForge Public](../vibeforge/) - Freeware version
- [Forge Monorepo](../) - Complete Forge ecosystem

---

**Built for BDS Internal Development Workflows**
