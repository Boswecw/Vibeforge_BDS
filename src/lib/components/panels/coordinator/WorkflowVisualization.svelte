<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import { getAgentTypeIcon, getAgentStatusColor } from '$lib/services/coordinatorService';
	import type { WorkflowExecution, AgentState } from '$lib/types/agents';

	interface Props {
		workflow: WorkflowExecution | null;
	}

	let { workflow }: Props = $props();

	function getStatusIcon(status: string): string {
		switch (status) {
			case 'completed':
				return '✅';
			case 'running':
				return '⏳';
			case 'failed':
				return '❌';
			case 'pending':
				return '⏸️';
			default:
				return '⚪';
		}
	}
</script>

<div class="workflow-visualization">
	{#if workflow && workflow.agent_states}
		<div class="workflow-pipeline">
			{#each workflow.agent_states as agentState, index}
				<div class="pipeline-step">
					<div class="agent-node" class:active={agentState.status === 'running'} class:completed={agentState.status === 'completed'} class:failed={agentState.status === 'failed'}>
						<div class="node-icon">
							{getAgentTypeIcon(agentState.agent_id.split('_')[0])}
						</div>
						<div class="node-content">
							<div class="node-title">{agentState.agent_id}</div>
							<Badge variant={getAgentStatusColor(agentState.status)}>
								{getStatusIcon(agentState.status)} {agentState.status}
							</Badge>
						</div>
					</div>

					{#if index < workflow.agent_states.length - 1}
						<div class="pipeline-arrow">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
							</svg>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		{#if workflow.current_agent}
			<div class="current-agent-info">
				<div class="info-label">Currently Executing:</div>
				<div class="info-value">{workflow.current_agent}</div>
			</div>
		{/if}
	{:else}
		<div class="empty-state">
			<p class="text-muted">No workflow visualization available</p>
		</div>
	{/if}
</div>

<style>
	.workflow-visualization {
		padding: 1rem;
	}

	.workflow-pipeline {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
		justify-content: center;
		margin-bottom: 1.5rem;
	}

	.pipeline-step {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.agent-node {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--surface-2);
		border: 2px solid var(--border-color);
		border-radius: 8px;
		min-width: 200px;
		transition: all 0.3s ease;
	}

	.agent-node.active {
		border-color: var(--accent-color);
		background: rgba(var(--accent-rgb), 0.1);
		box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.1);
	}

	.agent-node.completed {
		border-color: var(--color-success);
		background: rgba(34, 197, 94, 0.05);
	}

	.agent-node.failed {
		border-color: var(--color-danger);
		background: rgba(239, 68, 68, 0.05);
	}

	.node-icon {
		font-size: 1.5rem;
	}

	.node-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.node-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.pipeline-arrow {
		color: var(--text-secondary);
	}

	.current-agent-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 6px;
	}

	.info-label {
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.info-value {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.empty-state {
		text-align: center;
		padding: 2rem 1rem;
	}

	.text-muted {
		color: var(--text-secondary);
	}

	@media (max-width: 768px) {
		.workflow-pipeline {
			flex-direction: column;
		}

		.pipeline-arrow {
			transform: rotate(90deg);
		}
	}
</style>
