<script lang="ts">
	import { AGENT_TEMPLATES } from '$lib/agents/templates';
	import type { AgentTemplate, AgentKind } from '$lib/agents/types';
	import { Panel, Badge, Button, Input, Select } from '$lib/components';

	// State
	let selectedKind = $state<AgentKind | 'all'>('all');
	let searchQuery = $state('');
	let selectedAgent = $state<AgentTemplate | null>(null);

	// Derived
	let allAgents = $derived([
		...AGENT_TEMPLATES.planner,
		...AGENT_TEMPLATES.execution,
		...AGENT_TEMPLATES.evaluator,
		...AGENT_TEMPLATES.coordinator
	]);

	let filteredAgents = $derived.by(() => {
		let result = allAgents;

		// Filter by kind
		if (selectedKind !== 'all') {
			result = result.filter((a) => a.kind === selectedKind);
		}

		// Filter by search
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(a) =>
					a.label.toLowerCase().includes(q) ||
					a.description.toLowerCase().includes(q) ||
					a.id.toLowerCase().includes(q)
			);
		}

		return result;
	});

	let stats = $derived.by(() => ({
		total: allAgents.length,
		planner: AGENT_TEMPLATES.planner.length,
		execution: AGENT_TEMPLATES.execution.length,
		evaluator: AGENT_TEMPLATES.evaluator.length,
		coordinator: AGENT_TEMPLATES.coordinator.length,
		locked: allAgents.filter((a) => a.locked).length
	}));

	// Kind options
	const kindOptions = [
		{ value: 'all', label: 'All Types' },
		{ value: 'planner', label: 'Planner' },
		{ value: 'execution', label: 'Execution' },
		{ value: 'evaluator', label: 'Evaluator' },
		{ value: 'coordinator', label: 'Coordinator' }
	];

	function getKindVariant(kind: AgentKind): 'info' | 'success' | 'warning' | 'accent' {
		const variants = {
			planner: 'info' as const,
			execution: 'success' as const,
			evaluator: 'warning' as const,
			coordinator: 'accent' as const
		};
		return variants[kind];
	}

	function clearFilters() {
		searchQuery = '';
		selectedKind = 'all';
	}
</script>

<div class="agents-container">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">ForgeAgents Templates</h1>
			<p class="page-description">
				Manage agent templates for planning, execution, evaluation, and coordination
			</p>
		</div>

		<div class="stats-row">
			<div class="stat-item">
				<span class="stat-value">{stats.total}</span>
				<span class="stat-label">Total</span>
			</div>
			<div class="stat-item">
				<span class="stat-value info">{stats.planner}</span>
				<span class="stat-label">Planner</span>
			</div>
			<div class="stat-item">
				<span class="stat-value success">{stats.execution}</span>
				<span class="stat-label">Execution</span>
			</div>
			<div class="stat-item">
				<span class="stat-value warning">{stats.evaluator}</span>
				<span class="stat-label">Evaluator</span>
			</div>
			<div class="stat-item">
				<span class="stat-value accent">{stats.coordinator}</span>
				<span class="stat-label">Coordinator</span>
			</div>
		</div>
	</div>

	<!-- Filters -->
	<Panel variant="bordered" padding="lg">
		<div class="filters-section">
			<div class="filter-row">
				<Input
					type="search"
					bind:value={searchQuery}
					placeholder="Search agents by name, description, or ID..."
					fullWidth
				/>
			</div>

			<div class="filter-row">
				<Select
					bind:value={selectedKind}
					options={kindOptions}
					placeholder="All Types"
					fullWidth
				/>
				<Button variant="secondary" on:click={clearFilters}>Clear Filters</Button>
			</div>

			<div class="result-count">
				<Badge variant="default">{filteredAgents.length} agents</Badge>
			</div>
		</div>
	</Panel>

	<!-- Agent Grid -->
	{#if filteredAgents.length === 0}
		<Panel variant="elevated" padding="lg">
			<div class="empty-state">
				<p class="empty-message">No agents found matching your filters.</p>
				<Button variant="primary" on:click={clearFilters}>Clear Filters</Button>
			</div>
		</Panel>
	{:else}
		<div class="agents-grid">
			{#each filteredAgents as agent (agent.id)}
				<Panel variant="bordered" padding="lg">
					<div class="agent-card">
						<!-- Header -->
						<div class="agent-header">
							<div class="agent-title">
								<h3>{agent.label}</h3>
								<div class="badges">
									<Badge variant={getKindVariant(agent.kind)} size="sm">
										{agent.kind}
									</Badge>
									{#if agent.locked}
										<Badge variant="default" size="sm" outline>🔒 Locked</Badge>
									{/if}
									{#if agent.autoEvaluateWithSAS}
										<Badge variant="success" size="sm" outline>✓ SAS Auto-Eval</Badge>
									{/if}
								</div>
							</div>
						</div>

						<!-- Description -->
						<p class="agent-description">{agent.description}</p>

						<!-- Details -->
						<div class="agent-details">
							<div class="detail-item">
								<span class="detail-label">Pipeline ID</span>
								<code class="detail-value">{agent.pipelineId}</code>
							</div>
							<div class="detail-item">
								<span class="detail-label">Agent ID</span>
								<code class="detail-value">{agent.id}</code>
							</div>
						</div>

						<!-- Allowed Repos -->
						{#if agent.allowedRepos.length > 0}
							<div class="repos-section">
								<span class="repos-label">Allowed Repos</span>
								<div class="repos-list">
									{#each agent.allowedRepos as repo}
										<Badge variant="default" size="sm" outline>{repo}</Badge>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Actions -->
						<div class="agent-actions">
							<Button variant="primary" size="sm" on:click={() => (selectedAgent = agent)}>
								View Details
							</Button>
							<Button variant="ghost" size="sm" disabled={agent.locked}>
								Edit Template
							</Button>
						</div>
					</div>
				</Panel>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* ═══════════════════════════════════════════════════════════════════════
     Agents Container
     ═══════════════════════════════════════════════════════════════════════ */

	.agents-container {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	/* Page Header */
	.page-header {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.header-content {
		flex: 1;
	}

	.page-title {
		font-family: var(--font-family-heading);
		font-size: 2.5rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-sm) 0;
		letter-spacing: 0.02em;
	}

	.page-description {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.stats-row {
		display: flex;
		gap: var(--spacing-xl);
		flex-wrap: wrap;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 600;
		color: var(--color-text-primary);
		font-family: var(--font-family-mono);
	}

	.stat-value.info {
		color: var(--color-info);
	}

	.stat-value.success {
		color: var(--color-success);
	}

	.stat-value.warning {
		color: var(--color-warning);
	}

	.stat-value.accent {
		color: var(--color-brass);
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Filters Section */
	.filters-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.filter-row {
		display: flex;
		gap: var(--spacing-md);
		align-items: center;
	}

	.result-count {
		display: flex;
		justify-content: flex-end;
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-lg);
		padding: var(--spacing-3xl) var(--spacing-xl);
		text-align: center;
	}

	.empty-message {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* Agents Grid */
	.agents-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: var(--spacing-lg);
	}

	/* Agent Card */
	.agent-card {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.agent-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--spacing-md);
	}

	.agent-title {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		flex: 1;
	}

	.agent-title h3 {
		font-family: var(--font-family-heading);
		font-size: 1.25rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0;
		letter-spacing: 0.02em;
	}

	.badges {
		display: flex;
		gap: var(--spacing-xs);
		flex-wrap: wrap;
	}

	.agent-description {
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin: 0;
	}

	.agent-details {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		padding: var(--spacing-md);
		background-color: var(--color-surface-3);
		border-radius: var(--radius-md);
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.detail-label {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.detail-value {
		font-family: var(--font-family-mono);
		font-size: 0.875rem;
		color: var(--color-text-primary);
		background-color: var(--color-surface-2);
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
	}

	.repos-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.repos-label {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.repos-list {
		display: flex;
		gap: var(--spacing-xs);
		flex-wrap: wrap;
	}

	.agent-actions {
		display: flex;
		gap: var(--spacing-md);
		padding-top: var(--spacing-md);
		border-top: 1px solid var(--color-border-subtle);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.page-title {
			font-size: 2rem;
		}

		.stats-row {
			flex-direction: column;
			gap: var(--spacing-md);
		}

		.filter-row {
			flex-direction: column;
			align-items: stretch;
		}

		.agents-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
