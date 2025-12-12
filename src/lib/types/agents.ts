/**
 * Agent Type Definitions for VibeForge BDS
 *
 * Defines types for all agent workflows following the PAORT cycle.
 */

// ═══════════════════════════════════════════════════════════════════════
// PAORT Stage Types
// ═══════════════════════════════════════════════════════════════════════

export enum PAORTStage {
	PLAN = 'PLAN',
	ACT = 'ACT',
	OBSERVE = 'OBSERVE',
	REFLECT = 'REFLECT',
	TRANSITION = 'TRANSITION'
}

export interface StageInput {
	stage: PAORTStage;
	data: Record<string, unknown>;
	previousStageOutput?: StageOutput;
}

export interface StageOutput {
	stage: PAORTStage;
	data: Record<string, unknown>;
	summary: string;
	status: 'success' | 'failure' | 'partial';
	metrics?: StageMetrics;
}

export interface StageMetrics {
	tokensUsed: number;
	cost: number;
	latencyMs: number;
	modelUsed: string;
}

// ═══════════════════════════════════════════════════════════════════════
// Session Types
// ═══════════════════════════════════════════════════════════════════════

export enum SessionStatus {
	PENDING = 'PENDING',
	RUNNING = 'RUNNING',
	COMPLETED = 'COMPLETED',
	FAILED = 'FAILED',
	CANCELLED = 'CANCELLED'
}

export interface BaseSession {
	id: string;
	type: 'planning' | 'execution' | 'evaluation' | 'coordination';
	status: SessionStatus;
	createdAt: Date;
	startedAt?: Date;
	completedAt?: Date;
	currentStage?: PAORTStage;
	error?: string;
}

// ═══════════════════════════════════════════════════════════════════════
// Planning Agent Types
// ═══════════════════════════════════════════════════════════════════════

export interface PlanningRequest {
	title: string;
	description: string;
	context?: Record<string, unknown>;
	requirements?: string[];
	constraints?: string[];
}

export interface PlanningSession extends BaseSession {
	type: 'planning';
	request: PlanningRequest;
	stages: PlanningStages;
	deliverable?: PlanningDeliverable;
}

export interface PlanningStages {
	plan?: StageOutput;
	act?: StageOutput;
	observe?: StageOutput;
	reflect?: StageOutput;
}

export interface PlanningDeliverable {
	plan: {
		title: string;
		overview: string;
		steps: PlanStep[];
		estimatedEffort: string;
		risks: string[];
	};
	prompt: string;
	metadata: {
		totalTokens: number;
		totalCost: number;
		duration: number;
	};
}

export interface PlanStep {
	id: string;
	title: string;
	description: string;
	dependencies: string[];
	estimatedEffort: string;
	acceptanceCriteria: string[];
}

// ═══════════════════════════════════════════════════════════════════════
// Execution Agent Types
// ═══════════════════════════════════════════════════════════════════════

export interface ExecutionRequest {
	planSessionId: string;
	plan: PlanningDeliverable;
	options?: ExecutionOptions;
}

export interface ExecutionOptions {
	runTests: boolean;
	generateDocs: boolean;
	autoCommit: boolean;
}

export interface ExecutionSession extends BaseSession {
	type: 'execution';
	request: ExecutionRequest;
	stages: ExecutionStages;
	result?: ExecutionResult;
}

export interface ExecutionStages {
	plan?: StageOutput;
	act?: StageOutput;
	observe?: StageOutput;
	reflect?: StageOutput;
}

export interface ExecutionResult {
	code: {
		filesModified: FileModification[];
		filesCreated: FileCreation[];
		filesDeleted: string[];
	};
	tests: TestResults;
	metrics: ExecutionMetrics;
	rollbackPoint?: string;
}

export interface FileModification {
	path: string;
	additions: number;
	deletions: number;
	diff: string;
}

export interface FileCreation {
	path: string;
	content: string;
	lines: number;
}

export interface TestResults {
	passed: number;
	failed: number;
	skipped: number;
	total: number;
	coverage?: {
		lines: number;
		functions: number;
		branches: number;
		statements: number;
	};
	failures: TestFailure[];
}

export interface TestFailure {
	testName: string;
	filePath: string;
	error: string;
	stack?: string;
}

export interface ExecutionMetrics {
	tokensUsed: number;
	cost: number;
	duration: number;
	modelUsed: string;
	linesOfCode: number;
}

// ═══════════════════════════════════════════════════════════════════════
// Evaluator Agent Types
// ═══════════════════════════════════════════════════════════════════════

export interface EvaluationRequest {
	executionSessionId: string;
	result: ExecutionResult;
	criteria?: EvaluationCriteria;
}

export interface EvaluationCriteria {
	checkSASCompliance: boolean;
	checkTestCoverage: boolean;
	checkCodeQuality: boolean;
	checkPerformance: boolean;
}

export interface EvaluationSession extends BaseSession {
	type: 'evaluation';
	request: EvaluationRequest;
	stages: EvaluationStages;
	assessment?: EvaluationAssessment;
}

export interface EvaluationStages {
	plan?: StageOutput;
	act?: StageOutput;
	observe?: StageOutput;
	reflect?: StageOutput;
}

export interface EvaluationAssessment {
	qualityScore: number; // 0-100
	sasCompliance: SASCompliance;
	codeReview: CodeReview;
	improvements: Improvement[];
	metrics: EvaluationMetrics;
}

export interface SASCompliance {
	compliant: boolean;
	violations: SASViolation[];
	passedChecks: string[];
	failedChecks: string[];
}

export interface SASViolation {
	rule: string;
	severity: 'error' | 'warning' | 'info';
	filePath: string;
	lineNumber?: number;
	description: string;
	suggestion: string;
}

export interface CodeReview {
	findings: CodeFinding[];
	summary: string;
	overallRating: number; // 0-10
}

export interface CodeFinding {
	id: string;
	type: 'bug' | 'smell' | 'security' | 'performance' | 'style';
	severity: 'critical' | 'high' | 'medium' | 'low';
	filePath: string;
	lineNumber?: number;
	description: string;
	suggestion: string;
	codeSnippet?: string;
}

export interface Improvement {
	id: string;
	priority: 'critical' | 'high' | 'medium' | 'low';
	category: string;
	description: string;
	before: string;
	after: string;
	impact: string;
	effort: string;
}

export interface EvaluationMetrics {
	tokensUsed: number;
	cost: number;
	duration: number;
	modelUsed: string;
}

// ═══════════════════════════════════════════════════════════════════════
// Coordinator Agent Types
// ═══════════════════════════════════════════════════════════════════════

export interface WorkflowRequest {
	task: string;
	agents: AgentNode[];
	dependencies: Dependency[];
	options?: Record<string, unknown>;
}

export interface AgentNode {
	id: string;
	type: 'planning' | 'execution' | 'evaluation';
	config: Record<string, unknown>;
	position: { x: number; y: number };
}

export interface Dependency {
	from: string; // Agent node ID
	to: string; // Agent node ID
	dataMapping?: Record<string, string>;
}

export interface CoordinationSession extends BaseSession {
	type: 'coordination';
	request: WorkflowRequest;
	workflow: WorkflowExecution;
}

export interface WorkflowExecution {
	nodes: WorkflowNodeExecution[];
	status: WorkflowStatus;
	startedAt?: Date;
	completedAt?: Date;
	error?: string;
}

export interface WorkflowNodeExecution {
	nodeId: string;
	sessionId?: string;
	status: 'pending' | 'running' | 'completed' | 'failed';
	startedAt?: Date;
	completedAt?: Date;
	error?: string;
	progress?: number; // 0-100
}

export enum WorkflowStatus {
	PENDING = 'PENDING',
	RUNNING = 'RUNNING',
	COMPLETED = 'COMPLETED',
	FAILED = 'FAILED',
	PARTIAL = 'PARTIAL'
}

// ═══════════════════════════════════════════════════════════════════════
// Streaming Types
// ═══════════════════════════════════════════════════════════════════════

export interface StreamChunk {
	type: 'chunk' | 'stage_start' | 'stage_end' | 'complete' | 'error';
	data: unknown;
	timestamp: Date;
}

export interface StageStreamChunk extends StreamChunk {
	type: 'chunk';
	data: {
		stage: PAORTStage;
		content: string;
	};
}

export interface StageStartChunk extends StreamChunk {
	type: 'stage_start';
	data: {
		stage: PAORTStage;
	};
}

export interface StageEndChunk extends StreamChunk {
	type: 'stage_end';
	data: {
		stage: PAORTStage;
		output: StageOutput;
	};
}

export interface CompleteChunk extends StreamChunk {
	type: 'complete';
	data: {
		sessionId: string;
		result: unknown;
	};
}

export interface ErrorChunk extends StreamChunk {
	type: 'error';
	data: {
		error: string;
		stage?: PAORTStage;
	};
}

// ═══════════════════════════════════════════════════════════════════════
// Union Types
// ═══════════════════════════════════════════════════════════════════════

export type AgentSession = PlanningSession | ExecutionSession | EvaluationSession | CoordinationSession;

export type AgentRequest = PlanningRequest | ExecutionRequest | EvaluationRequest | WorkflowRequest;

export type AgentResult = PlanningDeliverable | ExecutionResult | EvaluationAssessment | WorkflowExecution;
