# VibeForge BDS Phase 2 - TODO List

> Single source of truth for Phase 2 implementation
> Format: ID | Title | Status | Priority | Owner | Area | Files | Deps | Notes

## Setup & Infrastructure

### AF-001 | Setup Vitest Testing Framework | BACKLOG | P0 | Claude | Testing | package.json, vitest.config.ts | - | Required for 100% test coverage mandate

**Acceptance:**
- [ ] Vitest installed and configured
- [ ] Coverage reporting enabled
- [ ] Test scripts in package.json
- [ ] Sample test passing

**Files:** `package.json`, `vitest.config.ts`
**Notes:** Critical blocker - no testing framework currently installed

---

### AF-002 | Create Type Definitions for Agents | BACKLOG | P0 | Claude | Types | src/lib/types/agents.ts | - | Foundation for all agent components

**Acceptance:**
- [ ] PAORT session types defined
- [ ] Agent request/response types
- [ ] Stage progression types
- [ ] Workflow coordination types

**Files:** `src/lib/types/agents.ts`
**Notes:** Based on VIBEFORGE_BDS_CONTEXT.md specs

---

### AF-003 | Create Agent Stores (Svelte 5 Runes) | BACKLOG | P0 | Claude | State | src/lib/stores/*.svelte.ts | AF-002 | State management for all agents

**Acceptance:**
- [ ] planning.svelte.ts store
- [ ] execution.svelte.ts store
- [ ] evaluator.svelte.ts store
- [ ] coordinator.svelte.ts store
- [ ] All using Svelte 5 runes ($state, $derived)

**Files:** `src/lib/stores/planning.svelte.ts`, `src/lib/stores/execution.svelte.ts`, `src/lib/stores/evaluator.svelte.ts`, `src/lib/stores/coordinator.svelte.ts`
**Notes:** Follow pattern from existing errors.svelte.ts

---

### AF-004 | Create SSE Streaming Service | BACKLOG | P1 | Claude | Services | src/lib/services/streaming.ts | - | Server-Sent Events for real-time updates

**Acceptance:**
- [ ] EventSource wrapper with error handling
- [ ] Reconnection logic
- [ ] Chunk processing
- [ ] Complete/error callbacks
- [ ] 100% test coverage

**Files:** `src/lib/services/streaming.ts`, `src/lib/services/streaming.test.ts`
**Notes:** Critical for all agent panels

---

### AF-005 | Create Connectivity Store | BACKLOG | P1 | Claude | State | src/lib/stores/connectivity.svelte.ts | - | Online/offline detection

**Acceptance:**
- [ ] Online/offline state tracking
- [ ] Event listeners for connectivity changes
- [ ] Svelte 5 runes implementation
- [ ] 100% test coverage

**Files:** `src/lib/stores/connectivity.svelte.ts`, `src/lib/stores/connectivity.test.ts`
**Notes:** Required for offline banner

---

## Planning Agent Panel (Step 1)

### AF-101 | Planning Panel Main Component | BACKLOG | P1 | Claude | Components | src/routes/planning/+page.svelte | AF-002, AF-003 | Main planning interface

**Acceptance:**
- [ ] Page layout with navigation
- [ ] Panel integration
- [ ] Store integration
- [ ] Error boundary wrapping
- [ ] 100% test coverage

**Files:** `src/routes/planning/+page.svelte`, `src/routes/planning/+page.test.ts`
**Notes:** 4-stage PAORT visualization

---

### AF-102 | Planning Request Form Component | BACKLOG | P1 | Claude | Components | src/lib/components/panels/planning/RequestForm.svelte | AF-101 | Input form for planning requests

**Acceptance:**
- [ ] Title input field
- [ ] Description textarea
- [ ] Validation (required fields, max length)
- [ ] Submit button with loading state
- [ ] License check integration
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/planning/RequestForm.svelte`, `src/lib/components/panels/planning/RequestForm.test.ts`
**Notes:** Follow design system from VIBEFORGE_BDS_CONTEXT.md

---

### AF-103 | Stage Progress Visualization | BACKLOG | P1 | Claude | Components | src/lib/components/panels/planning/StageProgress.svelte | AF-101 | Visual progress for 4 stages

**Acceptance:**
- [ ] 4-stage linear progress bar
- [ ] Current stage highlighting
- [ ] Stage labels (Plan → Act → Observe → Reflect)
- [ ] Completion indicators
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/planning/StageProgress.svelte`, `src/lib/components/panels/planning/StageProgress.test.ts`
**Notes:** Brass accent color for active stage

---

### AF-104 | Stage Output Streaming Component | BACKLOG | P1 | Claude | Components | src/lib/components/panels/planning/StageOutput.svelte | AF-101, AF-004 | Real-time output display

**Acceptance:**
- [ ] Streaming text display
- [ ] Auto-scroll to bottom
- [ ] Code highlighting
- [ ] Loading indicator
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/planning/StageOutput.svelte`, `src/lib/components/panels/planning/StageOutput.test.ts`
**Notes:** SSE integration required

---

### AF-105 | Session History Component | BACKLOG | P2 | Claude | Components | src/lib/components/panels/planning/SessionHistory.svelte | AF-101 | List of past planning sessions

**Acceptance:**
- [ ] Session list with timestamps
- [ ] Click to load session details
- [ ] Status badges
- [ ] Empty state
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/planning/SessionHistory.svelte`, `src/lib/components/panels/planning/SessionHistory.test.ts`
**Notes:** DataForge integration for persistence

---

### AF-106 | Deliverable Viewer Component | BACKLOG | P2 | Claude | Components | src/lib/components/panels/planning/DeliverableViewer.svelte | AF-101 | Display final plan output

**Acceptance:**
- [ ] Formatted plan display
- [ ] Prompt output
- [ ] Copy to clipboard
- [ ] Download option
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/planning/DeliverableViewer.svelte`, `src/lib/components/panels/planning/DeliverableViewer.test.ts`
**Notes:** Markdown formatting support

---

### AF-107 | Planning Service Implementation | BACKLOG | P1 | Claude | Services | src/lib/services/planningService.ts | AF-002, AF-004 | Business logic for planning

**Acceptance:**
- [ ] Session creation
- [ ] SSE subscription
- [ ] Stage progression tracking
- [ ] Error handling
- [ ] 100% test coverage

**Files:** `src/lib/services/planningService.ts`, `src/lib/services/planningService.test.ts`
**Notes:** Integrate with ForgeAgents and DataForge APIs

---

### AF-108 | Planning Panel Git Checkpoint | BACKLOG | P1 | Claude | Git | - | AF-101-107 | Commit completed planning panel

**Acceptance:**
- [ ] All planning components implemented
- [ ] All tests passing
- [ ] 100% test coverage verified
- [ ] Git commit created

**Notes:** Commit message: "feat: planning agent panel (100% coverage)"

---

## Execution Agent Panel (Step 2)

### AF-201 | Execution Panel Main Component | BACKLOG | P1 | Claude | Components | src/routes/execution/+page.svelte | AF-002, AF-003 | Main execution interface

**Acceptance:**
- [ ] Page layout
- [ ] Store integration
- [ ] Error boundary wrapping
- [ ] 100% test coverage

**Files:** `src/routes/execution/+page.svelte`, `src/routes/execution/+page.test.ts`
**Notes:** Code generation and testing UI

---

### AF-202 | Execution Request Component | BACKLOG | P1 | Claude | Components | src/lib/components/panels/execution/ExecutionRequest.svelte | AF-201 | Load request from planning

**Acceptance:**
- [ ] Request details display
- [ ] Edit capability
- [ ] Execute button
- [ ] License check
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/execution/ExecutionRequest.svelte`, `src/lib/components/panels/execution/ExecutionRequest.test.ts`
**Notes:** Load from planning session output

---

### AF-203 | Code Generation Streaming Component | BACKLOG | P1 | Claude | Components | src/lib/components/panels/execution/CodeGeneration.svelte | AF-201, AF-004 | Real-time code output

**Acceptance:**
- [ ] Streaming code display
- [ ] Syntax highlighting
- [ ] File diff view
- [ ] Copy button
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/execution/CodeGeneration.svelte`, `src/lib/components/panels/execution/CodeGeneration.test.ts`
**Notes:** JetBrains Mono font

---

### AF-204 | Test Results Component | BACKLOG | P1 | Claude | Components | src/lib/components/panels/execution/TestResults.svelte | AF-201 | Test execution output

**Acceptance:**
- [ ] Pass/fail indicators
- [ ] Test count summary
- [ ] Detailed test output
- [ ] Coverage metrics
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/execution/TestResults.svelte`, `src/lib/components/panels/execution/TestResults.test.ts`
**Notes:** Green/red status colors

---

### AF-205 | Metrics Display Component | BACKLOG | P2 | Claude | Components | src/lib/components/panels/execution/MetricsDisplay.svelte | AF-201 | Token and cost tracking

**Acceptance:**
- [ ] Tokens used display
- [ ] Cost calculation
- [ ] Duration tracking
- [ ] Model info
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/execution/MetricsDisplay.svelte`, `src/lib/components/panels/execution/MetricsDisplay.test.ts`
**Notes:** Real-time updates during execution

---

### AF-206 | File Changes Component | BACKLOG | P2 | Claude | Components | src/lib/components/panels/execution/FileChanges.svelte | AF-201 | List of modified files

**Acceptance:**
- [ ] File list with paths
- [ ] Addition/deletion counts
- [ ] Click to view diff
- [ ] Rollback option
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/execution/FileChanges.svelte`, `src/lib/components/panels/execution/FileChanges.test.ts`
**Notes:** Git-style diff visualization

---

### AF-207 | Execution History Component | BACKLOG | P2 | Claude | Components | src/lib/components/panels/execution/ExecutionHistory.svelte | AF-201 | Past executions

**Acceptance:**
- [ ] Execution list
- [ ] Status badges
- [ ] Click to view details
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/execution/ExecutionHistory.svelte`, `src/lib/components/panels/execution/ExecutionHistory.test.ts`
**Notes:** DataForge integration

---

### AF-208 | Execution Service Implementation | BACKLOG | P1 | Claude | Services | src/lib/services/executionService.ts | AF-002, AF-004 | Business logic for execution

**Acceptance:**
- [ ] Session creation from plan
- [ ] SSE subscription
- [ ] Test result parsing
- [ ] Error handling
- [ ] 100% test coverage

**Files:** `src/lib/services/executionService.ts`, `src/lib/services/executionService.test.ts`
**Notes:** Integrate with ForgeAgents API

---

### AF-209 | Execution Panel Git Checkpoint | BACKLOG | P1 | Claude | Git | - | AF-201-208 | Commit completed execution panel

**Acceptance:**
- [ ] All execution components implemented
- [ ] All tests passing
- [ ] 100% test coverage verified
- [ ] Git commit created

**Notes:** Commit message: "feat: execution agent panel (100% coverage)"

---

## Evaluator Agent Panel (Step 3)

### AF-301 | Evaluator Panel Main Component | BACKLOG | P1 | Claude | Components | src/routes/evaluator/+page.svelte | AF-002, AF-003 | Main evaluation interface

**Acceptance:**
- [ ] Page layout
- [ ] Store integration
- [ ] Error boundary wrapping
- [ ] 100% test coverage

**Files:** `src/routes/evaluator/+page.svelte`, `src/routes/evaluator/+page.test.ts`
**Notes:** Quality assessment and SAS compliance UI

---

### AF-302 | Evaluation Request Component | BACKLOG | P1 | Claude | Components | src/lib/components/panels/evaluator/EvaluationRequest.svelte | AF-301 | Load from execution results

**Acceptance:**
- [ ] Execution result summary
- [ ] Evaluate button
- [ ] License check
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/evaluator/EvaluationRequest.svelte`, `src/lib/components/panels/evaluator/EvaluationRequest.test.ts`
**Notes:** Load from execution session

---

### AF-303 | Quality Metrics Component | BACKLOG | P1 | Claude | Components | src/lib/components/panels/evaluator/QualityMetrics.svelte | AF-301 | Quality score display

**Acceptance:**
- [ ] Score visualization (0-100)
- [ ] Metric breakdown
- [ ] Trend indicators
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/evaluator/QualityMetrics.svelte`, `src/lib/components/panels/evaluator/QualityMetrics.test.ts`
**Notes:** Brass/violet color coding

---

### AF-304 | SAS Compliance Component | BACKLOG | P1 | Claude | Components | src/lib/components/panels/evaluator/SasCompliance.svelte | AF-301 | SAS checklist display

**Acceptance:**
- [ ] Compliance checklist
- [ ] Pass/fail indicators
- [ ] Violation details
- [ ] Recommendations
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/evaluator/SasCompliance.svelte`, `src/lib/components/panels/evaluator/SasCompliance.test.ts`
**Notes:** Per SAS (Svelte Architectural Standards)

---

### AF-305 | Code Review Component | BACKLOG | P1 | Claude | Components | src/lib/components/panels/evaluator/CodeReview.svelte | AF-301 | Review findings

**Acceptance:**
- [ ] Finding list
- [ ] Severity indicators
- [ ] Code snippets
- [ ] Suggestions
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/evaluator/CodeReview.svelte`, `src/lib/components/panels/evaluator/CodeReview.test.ts`
**Notes:** Categorized by severity

---

### AF-306 | Improvements Component | BACKLOG | P2 | Claude | Components | src/lib/components/panels/evaluator/Improvements.svelte | AF-301 | Suggested improvements

**Acceptance:**
- [ ] Improvement list
- [ ] Priority indicators
- [ ] Before/after examples
- [ ] Apply suggestion button
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/evaluator/Improvements.svelte`, `src/lib/components/panels/evaluator/Improvements.test.ts`
**Notes:** Actionable suggestions

---

### AF-307 | Comparison View Component | BACKLOG | P2 | Claude | Components | src/lib/components/panels/evaluator/ComparisonView.svelte | AF-301 | Before/after comparison

**Acceptance:**
- [ ] Side-by-side diff
- [ ] Metric comparison
- [ ] Improvement highlights
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/evaluator/ComparisonView.svelte`, `src/lib/components/panels/evaluator/ComparisonView.test.ts`
**Notes:** Visual diff display

---

### AF-308 | Evaluation History Component | BACKLOG | P2 | Claude | Components | src/lib/components/panels/evaluator/EvaluationHistory.svelte | AF-301 | Past evaluations

**Acceptance:**
- [ ] Evaluation list
- [ ] Score trends
- [ ] Click to view details
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/evaluator/EvaluationHistory.svelte`, `src/lib/components/panels/evaluator/EvaluationHistory.test.ts`
**Notes:** DataForge integration

---

### AF-309 | Evaluator Service Implementation | BACKLOG | P1 | Claude | Services | src/lib/services/evaluatorService.ts | AF-002, AF-004 | Business logic for evaluation

**Acceptance:**
- [ ] Session creation from execution
- [ ] SSE subscription
- [ ] Metric calculation
- [ ] Error handling
- [ ] 100% test coverage

**Files:** `src/lib/services/evaluatorService.ts`, `src/lib/services/evaluatorService.test.ts`
**Notes:** Integrate with ForgeAgents API

---

### AF-310 | Evaluator Panel Git Checkpoint | BACKLOG | P1 | Claude | Git | - | AF-301-309 | Commit completed evaluator panel

**Acceptance:**
- [ ] All evaluator components implemented
- [ ] All tests passing
- [ ] 100% test coverage verified
- [ ] Git commit created

**Notes:** Commit message: "feat: evaluator agent panel (100% coverage)"

---

## Coordinator Agent Panel (Step 4)

### AF-401 | Coordinator Panel Main Component | BACKLOG | P1 | Claude | Components | src/routes/coordinator/+page.svelte | AF-002, AF-003 | Main coordination interface

**Acceptance:**
- [ ] Page layout
- [ ] Store integration
- [ ] Error boundary wrapping
- [ ] 100% test coverage

**Files:** `src/routes/coordinator/+page.svelte`, `src/routes/coordinator/+page.test.ts`
**Notes:** Multi-agent workflow orchestration UI

---

### AF-402 | Workflow Builder Component | BACKLOG | P1 | Claude | Components | src/lib/components/panels/coordinator/WorkflowBuilder.svelte | AF-401 | Visual DAG builder

**Acceptance:**
- [ ] Drag-and-drop agent nodes
- [ ] Connection drawing
- [ ] Dependency validation
- [ ] Save/load workflows
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/coordinator/WorkflowBuilder.svelte`, `src/lib/components/panels/coordinator/WorkflowBuilder.test.ts`
**Notes:** SVG-based visualization

---

### AF-403 | Agent Nodes Component | BACKLOG | P1 | Claude | Components | src/lib/components/panels/coordinator/AgentNodes.svelte | AF-402 | Agent representation in DAG

**Acceptance:**
- [ ] Draggable nodes
- [ ] Status indicators
- [ ] Connection points
- [ ] Configure button
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/coordinator/AgentNodes.svelte`, `src/lib/components/panels/coordinator/AgentNodes.test.ts`
**Notes:** Color-coded by agent type

---

### AF-404 | Dependency Lines Component | BACKLOG | P1 | Claude | Components | src/lib/components/panels/coordinator/DependencyLines.svelte | AF-402 | Connection visualization

**Acceptance:**
- [ ] Bezier curves
- [ ] Arrow indicators
- [ ] Hover highlighting
- [ ] Delete option
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/coordinator/DependencyLines.svelte`, `src/lib/components/panels/coordinator/DependencyLines.test.ts`
**Notes:** SVG path rendering

---

### AF-405 | Execution Progress Component | BACKLOG | P1 | Claude | Components | src/lib/components/panels/coordinator/ExecutionProgress.svelte | AF-401 | Real-time workflow progress

**Acceptance:**
- [ ] Progress bars per agent
- [ ] Overall completion percentage
- [ ] Current step highlighting
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/coordinator/ExecutionProgress.svelte`, `src/lib/components/panels/coordinator/ExecutionProgress.test.ts`
**Notes:** Real-time updates via SSE

---

### AF-406 | Failure Handling Component | BACKLOG | P2 | Claude | Components | src/lib/components/panels/coordinator/FailureHandling.svelte | AF-401 | Error recovery UI

**Acceptance:**
- [ ] Failure detection
- [ ] Retry options
- [ ] Rollback options
- [ ] Error details
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/coordinator/FailureHandling.svelte`, `src/lib/components/panels/coordinator/FailureHandling.test.ts`
**Notes:** Graceful degradation

---

### AF-407 | Workflow History Component | BACKLOG | P2 | Claude | Components | src/lib/components/panels/coordinator/WorkflowHistory.svelte | AF-401 | Past workflows

**Acceptance:**
- [ ] Workflow list
- [ ] Success/failure indicators
- [ ] Click to view/replay
- [ ] 100% test coverage

**Files:** `src/lib/components/panels/coordinator/WorkflowHistory.svelte`, `src/lib/components/panels/coordinator/WorkflowHistory.test.ts`
**Notes:** DataForge integration

---

### AF-408 | Coordinator Service Implementation | BACKLOG | P1 | Claude | Services | src/lib/services/coordinatorService.ts | AF-002, AF-004 | Business logic for coordination

**Acceptance:**
- [ ] Workflow DAG validation
- [ ] Dependency resolution
- [ ] Multi-session coordination
- [ ] Error handling
- [ ] 100% test coverage

**Files:** `src/lib/services/coordinatorService.ts`, `src/lib/services/coordinatorService.test.ts`
**Notes:** Complex orchestration logic

---

### AF-409 | Coordinator Panel Git Checkpoint | BACKLOG | P1 | Claude | Git | - | AF-401-408 | Commit completed coordinator panel

**Acceptance:**
- [ ] All coordinator components implemented
- [ ] All tests passing
- [ ] 100% test coverage verified
- [ ] Git commit created

**Notes:** Commit message: "feat: coordinator agent panel (100% coverage)"

---

## Integration & Polish (Step 5)

### AF-501 | Offline Banner Component | BACKLOG | P1 | Claude | Components | src/lib/components/OfflineBanner.svelte | AF-005 | Connectivity status display

**Acceptance:**
- [ ] Visible when offline
- [ ] Auto-hide when online
- [ ] Prominent styling
- [ ] 100% test coverage

**Files:** `src/lib/components/OfflineBanner.svelte`, `src/lib/components/OfflineBanner.test.ts`
**Notes:** Warning color, top of page

---

### AF-502 | Settings Page Updates | BACKLOG | P2 | Claude | Routes | src/routes/settings/+page.svelte | - | Configuration options

**Acceptance:**
- [ ] Agent settings
- [ ] API endpoints configuration
- [ ] Theme settings (dark mode only)
- [ ] 100% test coverage

**Files:** `src/routes/settings/+page.svelte`, `src/routes/settings/+page.test.ts`
**Notes:** Save to localStorage

---

### AF-503 | Navigation Updates | BACKLOG | P2 | Claude | Components | src/lib/components/Navigation.svelte | - | Add agent panel links

**Acceptance:**
- [ ] Planning link
- [ ] Execution link
- [ ] Evaluator link
- [ ] Coordinator link
- [ ] Active state indicators

**Files:** `src/lib/components/Navigation.svelte`
**Notes:** Update existing navigation component

---

### AF-504 | Dashboard Updates | BACKLOG | P2 | Claude | Routes | src/routes/+page.svelte | - | Quick access to agents

**Acceptance:**
- [ ] Agent cards
- [ ] Recent sessions
- [ ] Quick start buttons
- [ ] 100% test coverage

**Files:** `src/routes/+page.svelte`, `src/routes/+page.test.ts`
**Notes:** Overview of all agents

---

### AF-505 | Final Testing Pass | BACKLOG | P0 | Claude | Testing | All files | All previous | Comprehensive testing

**Acceptance:**
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] 100% test coverage verified
- [ ] No console errors
- [ ] TypeScript strict mode passing
- [ ] Lighthouse performance > 80

**Notes:** Critical before final commit

---

### AF-506 | Documentation Updates | BACKLOG | P2 | Claude | Docs | README.md, USER_GUIDE.md | - | User documentation

**Acceptance:**
- [ ] README updated with Phase 2 features
- [ ] USER_GUIDE created with screenshots
- [ ] API documentation
- [ ] Type documentation (JSDoc)

**Files:** `README.md`, `USER_GUIDE.md`
**Notes:** Clear usage instructions

---

### AF-507 | Final Git Checkpoint | BACKLOG | P0 | Claude | Git | - | All previous | Phase 2 completion

**Acceptance:**
- [ ] All code committed
- [ ] All tests passing
- [ ] 100% coverage verified
- [ ] No build warnings
- [ ] Tag created: v0.2.0

**Notes:** Commit message: "feat: phase 2 complete - all panels functional (100% coverage)"

---

## Summary

**Total Tasks:** 50+
**Critical Path:** AF-001 → AF-002 → AF-003 → AF-004 → Panel implementations → AF-505 → AF-507
**Estimated Duration:** 6-8 hours
**Success Metrics:** 100% test coverage, all TypeScript strict mode passing, no console errors

## Priority Legend

- **P0:** Critical - Must complete
- **P1:** High - Core functionality
- **P2:** Normal - Polish and enhancements
- **P3:** Nice-to-have - Future improvements

## Status Legend

- **BACKLOG:** Not started
- **READY:** Clarified, no blockers
- **DOING:** Actively in progress
- **REVIEW:** Needs human review
- **BLOCKED:** Waiting on dependency
- **DONE:** Merged/verified
