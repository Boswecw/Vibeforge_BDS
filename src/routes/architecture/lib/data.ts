import type { Service, Pipeline, Tier } from './types';

export const services: Record<string, Service> = {
	neuroforge: {
		name: 'NeuroForge',
		port: '8000',
		version: 'v1.0 API',
		tier: 'provider',
		category: 'ai-engines',
		status: 'production',
		description: 'AI orchestration & model routing',
		hasContract: true
	},
	mapo: {
		name: 'M.A.P.O.',
		port: '8003',
		version: 'v1.0 Pipeline',
		tier: 'provider',
		category: 'ai-engines',
		status: 'production',
		description: 'Multi-AI Pipeline Orchestrator',
		hasContract: true
	},
	dataforge: {
		name: 'DataForge',
		port: '8001',
		version: 'v5.2 API',
		tier: 'provider',
		category: 'knowledge',
		status: 'production',
		description: 'Vector storage & semantic search',
		hasContract: true
	},
	rake: {
		name: 'Rake',
		port: '8002',
		version: 'v1.0',
		tier: 'provider',
		category: 'knowledge',
		status: 'production',
		description: '5-stage ingestion pipeline'
	},
	forgeagents: {
		name: 'ForgeAgents',
		port: '8004',
		version: 'v0.9 Preview',
		tier: 'provider',
		category: 'ai-engines',
		status: 'beta',
		description: 'Autonomous agent orchestration'
	}
};

export const pipelines: Record<string, Pipeline> = {
	mapo: {
		name: 'M.A.P.O. Pipeline',
		version: 'v1.0 Pipeline',
		description: 'Multi-AI orchestration for structured reasoning',
		stages: [
			{ name: 'Initial', model: 'GPT-4o-mini', color: '#22c55e' },
			{ name: 'Review', model: 'Claude', color: '#3b82f6' },
			{ name: 'Refinement', model: 'GPT-4', color: '#a855f7' },
			{ name: 'Final', model: 'Claude', color: '#f97316' }
		],
		invocation: 'SSE-only',
		contract: {
			request: {
				pipeline_version: 'string',
				pipeline_id: 'uuid',
				input: 'string',
				system_prompt: 'string (optional)'
			},
			response: {
				pipeline_id: 'uuid',
				stage: 'number (1-4)',
				output: 'string',
				tokens: 'number',
				timestamp: 'ISO8601'
			},
			errors: ['invalid_pipeline_version', 'rate_limit', 'timeout']
		}
	},
	neuroforge: {
		name: 'NeuroForge Pipeline',
		version: 'v1.0 API',
		description: '5-stage LLM pipeline with context retrieval',
		stages: [
			{ name: 'Retrieve', color: '#6366f1' },
			{ name: 'Prepare', color: '#8b5cf6' },
			{ name: 'Execute', color: '#d946ef' },
			{ name: 'Score', color: '#ec4899' },
			{ name: 'Return', color: '#f43f5e' }
		],
		invocation: 'REST + SSE',
		contract: {
			request: {
				model: 'string (claude, gpt-4, etc)',
				prompt: 'string',
				context_ids: 'array<uuid>'
			},
			response: {
				completion: 'string',
				tokens_used: 'number',
				model_used: 'string',
				latency_ms: 'number'
			},
			errors: ['invalid_model', 'context_not_found', 'rate_limit']
		}
	},
	dataforge: {
		name: 'DataForge API',
		version: 'v5.2 API',
		description: 'Vector storage & semantic search',
		stages: [
			{ name: 'Query', color: '#06b6d4' },
			{ name: 'Embed', color: '#0891b2' },
			{ name: 'Search', color: '#0e7490' }
		],
		invocation: 'REST',
		contract: {
			request: {
				query: 'string',
				limit: 'number (default 10)',
				threshold: 'number (0-1, default 0.5)'
			},
			response: {
				results: 'array<{id, text, similarity}>',
				total: 'number'
			},
			errors: ['invalid_query', 'not_found', 'embedding_failed']
		}
	}
};

export const tiers: Tier[] = [
	{
		id: 'consumer',
		name: 'Consumer Tier',
		subtitle: 'Top Layer — User-Facing Applications',
		description: 'User-facing applications built on the ecosystem',
		categories: [
			{
				id: 'workbench',
				name: 'Workbench Applications',
				products: [
					{ name: 'VibeForge', version: 'v5.6' },
					{ name: 'AuthorForge', version: 'v0.1-alpha' }
				],
				traits: ['Multi-panel UI', 'Plugin systems', 'M.A.P.O. required']
			},
			{
				id: 'domain',
				name: 'Domain Applications',
				products: [
					{ name: 'TradeForge', version: 'Planned' },
					{ name: 'Leopold', version: 'Planned' },
					{ name: 'Livy', version: 'Planned'  }
				],
				traits: ['Simplified UX', 'Mobile-friendly']
			}
		]
	},
	{
		id: 'intelligence',
		name: 'Intelligence Tier',
		subtitle: 'Middle Layer — Reusable AI Reasoning',
		description: 'Domain-specific reasoning modules',
		categories: [
			{
				id: 'modules',
				name: 'Intelligence Modules',
				products: [
					{ name: 'Arc Trajectory Engine', version: 'v1.0 Module' },
					{ name: 'MoneyAI Forecast Engine', version: 'v1.0 Module' },
					{ name: 'TradeForge Market Engine', version: 'v1.0 Module' }
				],
				traits: ['Route through M.A.P.O.', 'Semantic versioning']
			}
		]
	},
	{
		id: 'provider',
		name: 'Provider Tier',
		subtitle: 'Bottom of Stack — Core Backend Services',
		description: 'Core backend systems powering everything',
		categories: [
			{
				id: 'ai-engines',
				name: 'AI Engine Services',
				products: [
					{ name: 'NeuroForge', port: '8000', version: 'v1.0 API', hasContract: true },
					{ name: 'M.A.P.O.', port: '8003', version: 'v1.0 Pipeline', hasContract: true },
					{ name: 'ForgeAgents', port: '8004', version: 'v0.9 Preview' }
				],
				traits: ['Brain Stem / Cortex / Muscle', 'SSE streaming', 'Worker pools']
			},
			{
				id: 'knowledge',
				name: 'Knowledge & Ingestion',
				products: [
					{ name: 'DataForge', port: '8001', version: 'v5.2 API', hasContract: true },
					{ name: 'Rake', port: '8002', version: 'v1.0' }
				],
				traits: ['Vector storage', '5-stage pipeline', 'Schema versioning']
			}
		]
	}
];
