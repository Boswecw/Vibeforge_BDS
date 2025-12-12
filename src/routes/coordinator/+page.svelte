<script lang="ts">
	import { coordinatorStore } from '$lib/stores/coordinator.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import { SessionStatus } from '$lib/types/agents';
	import WorkflowRequest from '$lib/components/panels/coordinator/WorkflowRequest.svelte';
	import WorkflowVisualization from '$lib/components/panels/coordinator/WorkflowVisualization.svelte';
	import WorkflowHistory from '$lib/components/panels/coordinator/WorkflowHistory.svelte';
	import { calculateWorkflowProgress } from '$lib/services/coordinatorService';

	const currentSession = $derived(coordinatorStore.currentSession);
	const isRunning = $derived(coordinatorStore.isRunning);
</script>

<ErrorBoundary>
	<div class="coordinator-page">
		<header class="page-header">
			<h1>Coordinator Agent</h1>
			<p class="text-muted">Orchestrate multi-agent workflows</p>
		</header>

		<div class="content-grid">
			<div class="left-column">
				<Panel title="New Workflow">
					<WorkflowRequest />
				</Panel>

				{#if currentSession}
					<Panel title="Workflow History" class="mt-6">
						<WorkflowHistory />
					</Panel>
				{/if}
			</div>

			<div class="right-column">
				{#if currentSession}
					{#if currentSession.status === SessionStatus.RUNNING}
						<Panel title="Workflow Executing">
							{#if currentSession.workflow}
								<WorkflowVisualization workflow={currentSession.workflow} />
								<div class="workflow-progress">
									<div class="progress-label">Overall Progress</div>
									<div class="progress-bar">
										<div
											class="progress-bar-fill"
											style="width: {calculateWorkflowProgress(currentSession.workflow)}%"
										></div>
									</div>
									<div class="progress-percent">
										{calculateWorkflowProgress(currentSession.workflow).toFixed(0)}%
									</div>
								</div>
							{:else}
								<div class="progress-message">
									<div class="spinner"></div>
									<p>Initializing workflow...</p>
								</div>
							{/if}
						</Panel>
					{:else if currentSession.status === SessionStatus.COMPLETED && currentSession.workflow}
						<Panel title="Workflow Completed">
							<div class="success-state">
								<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<polyline points="22 4 12 14.01 9 11.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
								<h3>Workflow Executed Successfully</h3>
								<p>All agents have completed their tasks.</p>
							</div>

							<div class="workflow-results">
								<WorkflowVisualization workflow={currentSession.workflow} />
							</div>
						</Panel>
					{:else if currentSession.status === SessionStatus.FAILED}
						<Panel title="Workflow Failed">
							<div class="error-state">
								<svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
									<path
										d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM7 4h2v5H7V4zm0 6h2v2H7v-2z"
									/>
								</svg>
								<h3>Workflow Failed</h3>
								{#if currentSession.error}
									<p class="error-message">{currentSession.error}</p>
								{/if}
							</div>

							{#if currentSession.workflow}
								<div class="workflow-results">
									<WorkflowVisualization workflow={currentSession.workflow} />
								</div>
							{/if}
						</Panel>
					{/if}
				{:else}
					<Panel title="Welcome">
						<div class="empty-state">
							<div class="empty-icon">🎯</div>
							<h2>Create a Workflow</h2>
							<p>Design and execute multi-agent coordination workflows to handle complex tasks.</p>
						</div>
					</Panel>
				{/if}
			</div>
		</div>
	</div>
</ErrorBoundary>

<style>
	.coordinator-page {
		padding: 24px;
		max-width: 1400px;
		margin: 0 auto;
	}

	.page-header {
		margin-bottom: 24px;
	}

	.page-header h1 {
		font-family: 'Cinzel', serif;
		font-weight: 300;
		font-size: 2rem;
		color: var(--color-text);
		margin-bottom: 8px;
	}

	.text-muted {
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 450px 1fr;
		gap: 24px;
		align-items: start;
	}

	.left-column,
	.right-column {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	:global(.mt-6) {
		margin-top: 24px;
	}

	.workflow-progress {
		padding: 1rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		margin-top: 1.5rem;
	}

	.progress-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.75rem;
	}

	.progress-bar {
		height: 12px;
		background: var(--surface-1);
		border-radius: 6px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.progress-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--accent-color), #10b981);
		border-radius: 6px;
		transition: width 0.5s ease;
	}

	.progress-percent {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary);
		text-align: center;
	}

	.progress-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 48px 24px;
		text-align: center;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--border-color);
		border-top-color: var(--accent-color);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 16px;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.progress-message p {
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	.success-state,
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 48px 24px;
		text-align: center;
	}

	.success-state svg {
		color: var(--color-success);
		margin-bottom: 16px;
	}

	.success-state h3 {
		font-size: 1.25rem;
		color: var(--text-primary);
		margin-bottom: 8px;
	}

	.success-state p {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0;
	}

	.error-state svg {
		color: var(--color-danger);
		margin-bottom: 16px;
	}

	.error-state h3 {
		font-size: 1.25rem;
		color: var(--text-primary);
		margin-bottom: 12px;
	}

	.error-message {
		color: var(--color-danger);
		font-size: 0.875rem;
		padding: 12px 16px;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 6px;
		max-width: 500px;
	}

	.workflow-results {
		margin-top: 1.5rem;
		padding: 1rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 8px;
	}

	.empty-state {
		text-align: center;
		padding: 48px 24px;
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 16px;
	}

	.empty-state h2 {
		font-size: 1.5rem;
		color: var(--color-text);
		margin-bottom: 12px;
	}

	.empty-state p {
		color: var(--color-text-muted);
		font-size: 0.875rem;
		max-width: 400px;
		margin: 0 auto;
	}

	@media (max-width: 1024px) {
		.content-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
