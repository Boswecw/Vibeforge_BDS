<script lang="ts">
	// Dependency rules for BDS-SAS architecture
	const dependencyRules = [
		{
			category: 'Tier Flow Rules',
			rules: [
				'Never skip tiers: Consumer ’ Intelligence ’ Provider (no direct Consumer ’ Provider)',
				'Intelligence modules MUST route through M.A.P.O. (Multi-AI Pipeline Orchestrator)',
				'Provider services can call other Provider services directly',
				'Consumer apps can call multiple Intelligence modules, but each routes through M.A.P.O.'
			]
		},
		{
			category: 'Intelligence Layer Rules',
			rules: [
				'All Intelligence modules use M.A.P.O. as their execution engine',
				'Intelligence modules are stateless and versioned (semantic versioning)',
				'Domain-specific reasoning stays in Intelligence tier',
				'Intelligence modules cannot directly access Provider services'
			]
		},
		{
			category: 'Provider Layer Rules',
			rules: [
				'Provider services expose versioned APIs (v1.0, v2.0, etc.)',
				'NeuroForge handles AI model routing and orchestration',
				'DataForge manages vector storage and semantic search',
				'M.A.P.O. orchestrates multi-stage AI pipelines',
				'Provider services can be called by Intelligence modules via M.A.P.O.'
			]
		},
		{
			category: 'Communication Protocols',
			rules: [
				'REST APIs for synchronous operations',
				'Server-Sent Events (SSE) for streaming responses',
				'All services must define contracts (request/response/errors)',
				'Port standardization: 8000-8010 range for Provider services'
			]
		},
		{
			category: 'Versioning Rules',
			rules: [
				'APIs use explicit version numbers (v1.0 API, v2.0 API)',
				'Pipelines use semantic versioning (v1.0 Pipeline)',
				'Breaking changes require new major version',
				'Intelligence modules must specify compatible M.A.P.O. version'
			]
		}
	];
</script>

<div class="dependency-rules">
	<div class="rules-header">
		<h2 class="rules-title">BDS-SAS Dependency Rules</h2>
		<p class="rules-subtitle">
			Three-Tier Architecture Guidelines for the Forge Ecosystem
		</p>
	</div>

	<div class="rules-grid">
		{#each dependencyRules as section}
			<div class="rule-section">
				<h3 class="section-title">{section.category}</h3>
				<ul class="rules-list">
					{#each section.rules as rule}
						<li class="rule-item">{rule}</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<!-- Architecture Summary -->
	<div class="architecture-summary">
		<h3 class="summary-title">Architecture Summary</h3>
		<div class="summary-content">
			<div class="summary-tier">
				<span class="tier-label consumer">Consumer Tier</span>
				<p class="tier-desc">User-facing applications (VibeForge, AuthorForge, etc.)</p>
			</div>
			<div class="arrow-down">“</div>
			<div class="summary-tier">
				<span class="tier-label intelligence">Intelligence Tier</span>
				<p class="tier-desc">Domain-specific reasoning modules routed through M.A.P.O.</p>
			</div>
			<div class="arrow-down">“</div>
			<div class="summary-tier">
				<span class="tier-label provider">Provider Tier</span>
				<p class="tier-desc">Core backend services (NeuroForge, DataForge, M.A.P.O., etc.)</p>
			</div>
		</div>
	</div>
</div>

<style>
	.dependency-rules {
		padding: var(--spacing-md);
		max-width: 1200px;
		margin: 0 auto;
	}

	.rules-header {
		text-align: center;
		margin-bottom: var(--spacing-2xl);
	}

	.rules-title {
		font-family: var(--font-family-heading);
		font-size: 2rem;
		font-weight: 400;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-sm) 0;
		letter-spacing: 0.02em;
	}

	.rules-subtitle {
		font-family: var(--font-family-mono);
		font-size: 0.95rem;
		color: var(--color-brass);
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.rules-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: var(--spacing-lg);
		margin-bottom: var(--spacing-2xl);
	}

	.rule-section {
		background: var(--color-surface-2);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		padding: var(--spacing-lg);
		box-shadow: var(--shadow-md);
		transition: all var(--transition-base);
	}

	.rule-section:hover {
		border-color: var(--color-brass);
		box-shadow: var(--shadow-lg);
	}

	.section-title {
		font-family: var(--font-family-heading);
		font-size: 1.25rem;
		font-weight: 400;
		color: var(--color-brass);
		margin: 0 0 var(--spacing-md) 0;
		letter-spacing: 0.02em;
		border-bottom: 2px solid var(--color-border-subtle);
		padding-bottom: var(--spacing-sm);
	}

	.rules-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.rule-item {
		font-size: 0.95rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
		padding-left: var(--spacing-lg);
		position: relative;
	}

	.rule-item::before {
		content: '¸';
		position: absolute;
		left: 0;
		color: var(--color-brass);
		font-size: 1.1rem;
		font-weight: bold;
	}

	/* Architecture Summary */
	.architecture-summary {
		background: var(--color-surface-3);
		border: 2px solid var(--color-brass);
		border-radius: var(--radius-lg);
		padding: var(--spacing-xl);
		box-shadow: var(--shadow-lg);
	}

	.summary-title {
		font-family: var(--font-family-heading);
		font-size: 1.5rem;
		font-weight: 400;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-xl) 0;
		letter-spacing: 0.02em;
		text-align: center;
	}

	.summary-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
	}

	.summary-tier {
		background: var(--color-surface-2);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		padding: var(--spacing-lg);
		width: 100%;
		max-width: 500px;
		text-align: center;
	}

	.tier-label {
		font-family: var(--font-family-mono);
		font-size: 0.9rem;
		font-weight: 700;
		padding: 0.4rem 1rem;
		border-radius: var(--radius-full);
		display: inline-block;
		margin-bottom: var(--spacing-sm);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.tier-label.consumer {
		background: #1e3a8a;
		color: #60a5fa;
		border: 1px solid #3b82f6;
	}

	.tier-label.intelligence {
		background: #581c87;
		color: #c084fc;
		border: 1px solid #a855f7;
	}

	.tier-label.provider {
		background: var(--color-graphite);
		color: var(--color-brass);
		border: 1px solid var(--color-brass);
	}

	.tier-desc {
		font-size: 0.95rem;
		color: var(--color-text-secondary);
		margin: 0;
		line-height: 1.5;
	}

	.arrow-down {
		font-size: 2rem;
		color: var(--color-brass);
		font-weight: bold;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.rules-grid {
			grid-template-columns: 1fr;
		}

		.rules-title {
			font-size: 1.5rem;
		}

		.summary-content {
			padding: 0;
		}
	}
</style>
