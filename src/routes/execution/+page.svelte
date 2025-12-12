<script lang="ts">
	import { executionStore } from '$lib/stores/execution.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import { SessionStatus } from '$lib/types/agents';
	import ExecutionRequest from '$lib/components/panels/execution/ExecutionRequest.svelte';
	import CodeGeneration from '$lib/components/panels/execution/CodeGeneration.svelte';
	import TestResults from '$lib/components/panels/execution/TestResults.svelte';
	import MetricsDisplay from '$lib/components/panels/execution/MetricsDisplay.svelte';
	import FileChanges from '$lib/components/panels/execution/FileChanges.svelte';
	import ExecutionHistory from '$lib/components/panels/execution/ExecutionHistory.svelte';

	const currentSession = $derived(executionStore.currentSession);
	const isExecuting = $derived(executionStore.isExecuting);
	const streamingOutput = $derived(executionStore.streamingOutput);
</script>

<ErrorBoundary>
	<div class="execution-page">
		<header class="page-header">
			<h1>Execution Agent</h1>
			<p class="text-muted">Execute code generation and implementation tasks</p>
		</header>

		<div class="content-grid">
			<div class="left-column">
				<Panel title="New Execution Request">
					<ExecutionRequest />
				</Panel>

				{#if currentSession}
					<Panel title="Execution History" class="mt-6">
						<ExecutionHistory />
					</Panel>
				{/if}
			</div>

			<div class="right-column">
				{#if currentSession}
					{#if currentSession.status === SessionStatus.RUNNING}
						<Panel title="Execution in Progress">
							{#if streamingOutput}
								<CodeGeneration code={streamingOutput} isStreaming={isExecuting} />
							{:else}
								<div class="progress-message">
									<div class="spinner"></div>
									<p>Initializing execution...</p>
								</div>
							{/if}
						</Panel>
					{:else if currentSession.status === SessionStatus.COMPLETED && currentSession.result}
						<Panel title="Execution Complete">
							<div class="results-section">
								{#if currentSession.result.code}
									<div class="section-block">
										<h3>Generated Code</h3>
										<CodeGeneration
											code={currentSession.result.code}
											isStreaming={false}
										/>
									</div>
								{/if}

								{#if currentSession.result.testResults}
									<div class="section-block">
										<h3>Test Results</h3>
										<TestResults results={currentSession.result.testResults} />
									</div>
								{/if}

								{#if currentSession.result.filesModified && currentSession.result.filesModified.length > 0}
									<div class="section-block">
										<h3>File Changes</h3>
										<FileChanges changes={currentSession.result.filesModified} />
									</div>
								{/if}

								{#if currentSession.result.metrics}
									<div class="section-block">
										<h3>Execution Metrics</h3>
										<MetricsDisplay metrics={currentSession.result.metrics} />
									</div>
								{/if}
							</div>
						</Panel>
					{:else if currentSession.status === SessionStatus.FAILED}
						<Panel title="Execution Failed">
							<div class="error-state">
								<svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
									<path
										d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM7 4h2v5H7V4zm0 6h2v2H7v-2z"
									/>
								</svg>
								<h3>Execution Failed</h3>
								{#if currentSession.error}
									<p class="error-message">{currentSession.error}</p>
								{/if}
							</div>
						</Panel>
					{/if}
				{:else}
					<Panel title="Welcome">
						<div class="empty-state">
							<div class="empty-icon">⚡</div>
							<h2>Start an Execution Session</h2>
							<p>Load a plan from the Planning Agent or create a new execution request to begin.</p>
						</div>
					</Panel>
				{/if}
			</div>
		</div>
	</div>
</ErrorBoundary>

<style>
	.execution-page {
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

	.results-section {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.section-block {
		padding: 16px 0;
	}

	.section-block:not(:last-child) {
		border-bottom: 1px solid var(--border-color);
	}

	.section-block h3 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 12px;
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

	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 48px 24px;
		text-align: center;
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

	@media (max-width: 1024px) {
		.content-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
