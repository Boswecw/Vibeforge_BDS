<div align="center">
  <h1>VibeForge_BDS</h1>

**Internal Agent-Powered Development Workbench**

_For Boswell Digital Solutions Internal Use Only_

</div>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen" alt="Production Ready">
  <img src="https://img.shields.io/badge/Tests-110%20Passing-brightgreen" alt="110 Tests Passing">
  <img src="https://img.shields.io/badge/TypeScript-0%20Errors-brightgreen" alt="0 TypeScript Errors">
  <img src="https://img.shields.io/badge/License-Internal%20BDS-red" alt="Internal BDS">
  <img src="https://img.shields.io/badge/SvelteKit-5-orange" alt="SvelteKit 5">
  <img src="https://img.shields.io/badge/Tauri-2.2-blue" alt="Tauri 2.2">
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
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │  4 Core Agents (PAORT Sessions)                │  │
│  │  • Planner    • Executor                       │  │
│  │  • Evaluator  • Coordinator                    │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────┬────────────────────────────────┘
                      │
          ┌───────────┴──────────┐
          │                      │
    ┌─────▼──────┐        ┌─────▼──────┐
    │ ForgeAgents │        │ DataForge  │
    │  (Port 8787)│        │ (Port 8788)│
    │             │        │             │
    │ • PAORT     │        │ • SAS       │
    │ • Sessions  │        │ • Logging   │
    │ • Agents    │        │ • Metrics   │
    └─────┬──────┘        └────────────┘
          │
    ┌─────▼──────┐
    │ NeuroForge  │  ← Model routing, champion selection
    │ (Port 8000) │
    │             │
    │ • LLM Routes│
    │ • Safety    │
    │ • Telemetry │
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

**ForgeAgents (Port 8787)** - Agent orchestration and PAORT session management

- Session lifecycle management
- Agent-to-agent communication
- Event streaming and logging
- Multi-step orchestration workflows

**NeuroForge (Port 8000)** - Model routing and safety

- Champion/fallback model selection
- Safety layer enforcement
- LLM request routing (OpenAI, Anthropic, etc.)
- Telemetry and performance tracking

**DataForge (Port 8788)** - Data persistence and retrieval

- SAS document storage
- Evaluation metrics
- Session logs and history
- Agent execution records

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
VITE_FORGE_AGENTS_URL=http://localhost:8787
VITE_NEUROFORGE_URL=http://localhost:8000
VITE_DATAFORGE_URL=http://localhost:8788

# Authentication
VITE_BDS_API_KEY=your-internal-api-key

# Feature Flags
VITE_ENABLE_PLANNER_AGENT=true
VITE_ENABLE_EXECUTION_AGENT=true
VITE_ENABLE_EVALUATOR_AGENT=true
VITE_ENABLE_COORDINATOR_AGENT=true
```

---

## ✨ Key Features

### 🎯 Multi-Agent Workflow System

- **Planner Agent**: Analyzes tasks and creates step-by-step implementation plans
- **Executor Agent**: Implements code based on plans, runs tests, handles file operations
- **Evaluator Agent**: Validates code quality, runs tests, provides detailed feedback
- **Coordinator Agent**: Orchestrates multi-agent workflows and manages PAORT sessions

### 📚 Prompt Patterns Library

- **20+ Built-in Patterns**: Pre-configured patterns across 10 categories (coding, writing, analysis, debugging, refactoring, documentation, testing, design, planning, learning)
- **AI-Powered Suggestions**: Intelligent pattern matching based on your prompt intent
- **Pattern Editor**: Create custom patterns with variable extraction and validation
- **Pattern Collections**: Organize patterns into reusable collections
- **Import/Export**: Share patterns as JSON files

### 🔧 Template System

- **40+ Built-in Filters**: String manipulation, formatting, conditional logic, arrays, objects
- **AST-Based Processor**: Parse and render templates with {{variable}} syntax
- **Auto-Variable Extraction**: Automatically detect variables in templates
- **Type-Safe Variables**: Support for string, number, boolean, array, and code types
- **Live Preview**: See rendered output as you type

### 🧠 Cortex Integration

- **Plan Comparison**: Compare multiple AI-generated plans side-by-side
- **Quality Scoring**: Automatic quality assessment with detailed breakdown
- **Plan Refinement**: Iteratively improve plans based on feedback
- **Version History**: Track plan evolution over time
- **AI Evaluation**: Get AI-powered insights on plan quality

### 🔍 Execution Panels

- **Code Generation**: View and manage generated code with syntax highlighting
- **Test Results**: See detailed test output with pass/fail status
- **Execution Requests**: Track agent execution history and status
- **Real-Time Updates**: Live progress tracking during agent execution

---

## 💻 Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build desktop app
pnpm tauri build

# Type checking (0 errors, 26 warnings)
pnpm check

# Lint code
pnpm lint

# Run unit tests (110 tests, 100% passing)
pnpm test:run

# Run integration tests (requires backend services)
pnpm test:integration
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

## 🔧 Implementation Status

The agent system has been implemented in phases. See [`.claude/todo.md`](../.claude/todo.md) for detailed task tracking.

### ✅ Phase 1: Foundation (COMPLETE)

- ✅ Project structure and Tauri desktop setup
- ✅ SvelteKit 5 + Svelte 5 runes configuration
- ✅ Backend API client layer (ForgeAgents, DataForge)
- ✅ Type system and configuration

### ✅ Phase 2: Core Agent System (COMPLETE)

- ✅ Agent templates and registry (4 agents: Planner, Executor, Evaluator, Coordinator)
- ✅ PAORT session management
- ✅ Svelte 5 runes-based state stores
- ✅ Agent communication infrastructure

### ✅ Phase 3: UI Components & Features (COMPLETE - 24/24 tasks)

**Track A: Prompt Patterns Library** ✅

- ✅ Pattern types and built-in patterns (20+ patterns across 10 categories)
- ✅ Pattern store with search, filter, sort, ratings
- ✅ Pattern library UI components (browser, editor, preview, cards)
- ✅ Template system with 40+ filters

**Track B: Enhanced Templates** ✅

- ✅ Template filters (40+ built-in)
- ✅ Template processor (AST-based engine)
- ✅ Pattern suggestions (AI-powered with learning)
- ✅ Pattern marketplace (community patterns)

**Track C: Cortex Integration** ✅

- ✅ Cortex plan comparison (quality scoring algorithm)
- ✅ Iterative plan refinement
- ✅ Plan versioning and history
- ✅ AI plan evaluation

**Track D: Execution Panels** ✅

- ✅ Code generation panel
- ✅ Execution request panel
- ✅ Test results panel
- ✅ Agent status tracking

**Track E: Testing & Quality** ✅

- ✅ 110 comprehensive tests (100% passing)
- ✅ Type safety validation (0 TypeScript errors)
- ✅ Integration test coverage (separated config)
- ✅ Performance benchmarks

**Track F: Documentation** ✅

- ✅ Component documentation
- ✅ API documentation
- ✅ Usage examples
- ✅ Architecture diagrams

**Total Development Time:** ~125 hours across all phases

### ✅ Phase 4: Production Hardening (COMPLETE)

- ✅ Secure authentication via Tauri token storage
- ✅ Telemetry pipeline to DataForge (buffered batching)
- ✅ TypeScript error resolution (55 → 0 errors)
- ✅ Svelte 5 event syntax migration (on:click → onclick)
- ✅ Accessibility improvements (form labels, dialog tabindex)
- ✅ Legacy archive cleanup

### 📋 Phase 5: Advanced Features (PLANNED)

- 📋 Multi-agent workflow orchestration UI
- 📋 Advanced SAS validation dashboards
- 📋 E2E testing with Playwright
- 📋 CI/CD pipeline configuration

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

- **ForgeAgents** (Port 8787) - Agent orchestration and PAORT sessions
- **NeuroForge** (Port 8000) - LLM routing, safety, and model selection
- **DataForge** (Port 8788) - Data persistence and metrics

---

## 📊 Current Status

**Version:** 0.4.0 (Production Ready)
**Status:** 🟢 Phase 4 Complete - Production Ready
**License:** Internal BDS Use Only

### ✅ Completed (100%)

- ✅ **Phase 1:** Foundation and project setup
- ✅ **Phase 2:** Core agent system (4 agents, PAORT sessions, stores)
- ✅ **Phase 3:** UI components and features (24/24 tasks across 6 tracks)
- ✅ **Phase 4:** Production hardening (auth, telemetry, type safety)
- ✅ **Testing:** 110 comprehensive unit tests (100% passing)
- ✅ **Type Safety:** 0 TypeScript errors, full Svelte 5 runes coverage
- ✅ **Authentication:** Secure Tauri token storage with browser fallback
- ✅ **Telemetry:** Buffered event pipeline to DataForge
- ✅ **Backend Integration:** ForgeAgents, NeuroForge, DataForge clients
- ✅ **Prompt Patterns:** 20+ built-in patterns with AI suggestions
- ✅ **Template System:** 40+ filters with AST-based processor
- ✅ **Cortex Integration:** Plan comparison and quality scoring

### 🎯 Ready to Use

The application is production-ready for internal BDS development workflows. All core features are implemented, tested, and hardened:

1. **4-Agent System**: Planner, Executor, Evaluator, Coordinator
2. **PAORT Workflow**: Full session management and tracking
3. **Pattern Library**: 20+ pre-built patterns across 10 categories
4. **Cortex Plans**: Compare and evaluate AI-generated plans
5. **Execution Panels**: Code generation, testing, and results
6. **Secure Auth**: Tauri-based token storage with automatic browser fallback
7. **Telemetry**: Buffered event batching to DataForge pipeline

### 📋 Future Enhancements (Phase 5)

- 📋 Advanced workflow orchestration UI
- 📋 SAS validation dashboards
- 📋 E2E tests with Playwright
- 📋 CI/CD pipeline automation
- 📋 Performance analytics and insights

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
- ForgeAgents (internal agent framework - Port 8787)
- NeuroForge (internal LLM routing - Port 8000)
- DataForge (internal data platform - Port 8788)
- Cortex BDS (context export and plan management)

---

## 📄 License

**© 2025 Boswell Digital Solutions LLC — All Rights Reserved.**

This is proprietary software for internal BDS use only. Unauthorized distribution, modification, or use is strictly prohibited.

---

## 🔗 Resources

**Internal Documentation:**

- [Task Tracking](../.claude/todo.md) - Detailed task and progress tracking
- [BDS SAS Guidelines](https://internal.bds/sas) - Safety and standards requirements
- [ForgeAgents API Docs](https://internal.bds/forgeagents) - Agent orchestration API
- [NeuroForge Documentation](https://internal.bds/neuroforge) - LLM routing and safety

**Related Projects:**

- [VibeForge Public](../vibeforge/) - Freeware version
- [Cortex BDS](../cortex_bds/) - Context export and plan management
- [Forge Monorepo](../) - Complete Forge ecosystem

---

**Built for BDS Internal Development Workflows**
