<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import { startWorkflowSession, getAgentTypeIcon } from '$lib/services/coordinatorService';
	import type { AgentNode, DependencyEdge } from '$lib/types/agents';

	// Form state
	let taskDescription = $state('');
	let selectedAgents = $state<Set<string>>(new Set(['planning', 'execution', 'evaluation']));
	let parallelExecution = $state(false);
	let retryFailures = $state(true);
	let maxRetries = $state(3);

	// Error state
	let error = $state<string | null>(null);
	let isSubmitting = $state(false);

	const availableAgents = [
		{ type: 'planning', label: 'Planning Agent', icon: '📝', description: 'Define task strategy' },
		{ type: 'execution', label: 'Execution Agent', icon: '⚡', description: 'Generate code' },
		{ type: 'evaluation', label: 'Evaluator Agent', icon: '✓', description: 'Assess quality' }
	];

	function toggleAgent(type: string): void {
		if (selectedAgents.has(type)) {
			selectedAgents.delete(type);
		} else {
			selectedAgents.add(type);
		}
		selectedAgents = new Set(selectedAgents);
	}

	async function handleStartWorkflow(): Promise<void> {
		if (!taskDescription.trim()) {
			error = 'Task description is required';
			return;
		}

		if (selectedAgents.size === 0) {
			error = 'Select at least one agent';
			return;
		}

		error = null;
		isSubmitting = true;

		try {
			// Build agent nodes
			const agents: AgentNode[] = Array.from(selectedAgents).map((type, index) => ({
				id: `${type}_${index}`,
				type,
				status: 'pending'
			}));

			// Build dependencies (linear workflow)
			const dependencies: DependencyEdge[] = [];
			const agentOrder = ['planning', 'execution', 'evaluation'];
			const orderedAgents = agents.sort(
				(a, b) => agentOrder.indexOf(a.type) - agentOrder.indexOf(b.type)
			);

			for (let i = 1; i < orderedAgents.length; i++) {
				dependencies.push({
					from: orderedAgents[i - 1].id,
					to: orderedAgents[i].id
				});
			}

			const result = await startWorkflowSession({
				task: taskDescription,
				agents,
				dependencies,
				options: {
					parallel_execution: parallelExecution,
					retry_on_failure: retryFailures,
					max_retries: maxRetries
				}
			});

			if (!result.success) {
				error = result.error?.message || 'Failed to start workflow';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="workflow-request">
	<div class="form-section">
		<label class="form-label" for="task">
			Task Description
		</label>
		<textarea
			id="task"
			bind:value={taskDescription}
			placeholder="Describe the multi-step task to be executed by the agent workflow..."
			rows="4"
		></textarea>
	</div>

	<div class="form-section">
		<label class="form-label">Agent Pipeline</label>
		<p class="text-muted">Select agents to include in the workflow</p>

		<div class="agents-grid">
			{#each availableAgents as agent}
				<label class="agent-card" class:selected={selectedAgents.has(agent.type)}>
					<input
						type="checkbox"
						checked={selectedAgents.has(agent.type)}
						onchange={() => toggleAgent(agent.type)}
					/>
					<div class="agent-content">
						<div class="agent-header">
							<span class="agent-icon">{agent.icon}</span>
							<span class="agent-label">{agent.label}</span>
						</div>
						<div class="agent-description">{agent.description}</div>
					</div>
				</label>
			{/each}
		</div>
	</div>

	<div class="form-section">
		<label class="form-label">Workflow Options</label>

		<div class="options-list">
			<label class="option">
				<input type="checkbox" bind:checked={retryFailures} />
				<div class="option-content">
					<span class="option-title">Retry on Failure</span>
					<span class="option-description">Automatically retry failed agents</span>
				</div>
			</label>

			{#if retryFailures}
				<div class="option-detail">
					<label for="maxRetries">Max Retries:</label>
					<input
						type="number"
						id="maxRetries"
						bind:value={maxRetries}
						min="1"
						max="10"
					/>
				</div>
			{/if}
		</div>
	</div>

	{#if error}
		<Alert variant="error">{error}</Alert>
	{/if}

	<Button
		onclick={handleStartWorkflow}
		disabled={isSubmitting || selectedAgents.size === 0}
		fullWidth
	>
		{isSubmitting ? 'Starting Workflow...' : 'Start Workflow'}
	</Button>
</div>

<style>
	.workflow-request {
		padding: 1rem;
	}

	.form-section {
		margin-bottom: 1.5rem;
	}

	.form-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	.text-muted {
		font-size: 0.75rem;
		color: var(--text-secondary);
		margin-bottom: 0.75rem;
	}

	textarea {
		width: 100%;
		padding: 0.75rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		color: var(--text-primary);
		font-size: 0.875rem;
		line-height: 1.5;
		resize: vertical;
		font-family: inherit;
	}

	textarea:focus {
		outline: none;
		border-color: var(--accent-color);
	}

	.agents-grid {
		display: grid;
		gap: 0.75rem;
	}

	.agent-card {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--surface-2);
		border: 2px solid var(--border-color);
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.agent-card:hover {
		border-color: var(--accent-color);
		background: var(--surface-3);
	}

	.agent-card.selected {
		border-color: var(--accent-color);
		background: rgba(var(--accent-rgb), 0.05);
	}

	.agent-card input[type='checkbox'] {
		margin-top: 2px;
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	.agent-content {
		flex: 1;
		min-width: 0;
	}

	.agent-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}

	.agent-icon {
		font-size: 1.125rem;
	}

	.agent-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.agent-description {
		font-size: 0.75rem;
		color: var(--text-secondary);
		line-height: 1.4;
	}

	.options-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.option {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		cursor: pointer;
	}

	.option input[type='checkbox'] {
		margin-top: 2px;
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	.option-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.option-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	.option-description {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.option-detail {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding-left: 2.5rem;
		font-size: 0.875rem;
		color: var(--text-primary);
	}

	.option-detail input[type='number'] {
		width: 80px;
		padding: 0.375rem 0.5rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 4px;
		color: var(--text-primary);
		font-size: 0.875rem;
	}

	@media (max-width: 768px) {
		.agents-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
