<script lang="ts">
	import { planningStore } from '$lib/stores/planning.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import RequestForm from '$lib/components/panels/planning/RequestForm.svelte';
	import StageProgress from '$lib/components/panels/planning/StageProgress.svelte';
	import StageOutput from '$lib/components/panels/planning/StageOutput.svelte';
	import SessionHistory from '$lib/components/panels/planning/SessionHistory.svelte';
	import DeliverableViewer from '$lib/components/panels/planning/DeliverableViewer.svelte';
	import { SessionStatus } from '$lib/types/agents';

	const currentSession = $derived(planningStore.currentSession);
	const isStreaming = $derived(planningStore.isStreaming);
	const currentStage = $derived(planningStore.currentStage);
	const streamingOutput = $derived(planningStore.streamingOutput);
</script>

<ErrorBoundary>
	<div class="planning-page">
		<header class="page-header">
			<h1>Planning Agent</h1>
			<p class="text-muted">Define and plan complex implementation tasks</p>
		</header>

		<div class="content-grid">
			<!-- Left Column: Input & Controls -->
			<div class="left-column">
				<Panel title="New Planning Request">
					<RequestForm />
				</Panel>

				{#if currentSession}
					<Panel title="Session History" class="mt-6">
						<SessionHistory />
					</Panel>
				{/if}
			</div>

			<!-- Right Column: Output & Progress -->
			<div class="right-column">
				{#if currentSession}
					{#if currentSession.status === SessionStatus.RUNNING || currentSession.status === SessionStatus.PENDING}
						<!-- Active Session -->
						<Panel title="Planning in Progress">
							<StageProgress stage={currentStage} />
							<StageOutput output={streamingOutput} isStreaming={isStreaming} />
						</Panel>
					{:else if currentSession.status === SessionStatus.COMPLETED && currentSession.deliverable}
						<!-- Completed Session -->
						<Panel title="Planning Complete">
							<DeliverableViewer deliverable={currentSession.deliverable} />
						</Panel>
					{:else if currentSession.status === SessionStatus.FAILED}
						<!-- Failed Session -->
						<Panel title="Planning Failed" variant="error">
							<div class="error-message">
								<h3>Error</h3>
								<p>{currentSession.error || 'An unknown error occurred'}</p>
							</div>
						</Panel>
					{/if}
				{:else}
					<!-- No Session -->
					<Panel title="Welcome">
						<div class="empty-state">
							<h2>Start a Planning Session</h2>
							<p>Fill out the form on the left to begin planning a new task.</p>
						</div>
					</Panel>
				{/if}
			</div>
		</div>
	</div>
</ErrorBoundary>

<style>
	.planning-page {
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
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}

	@media (max-width: 1024px) {
		.content-grid {
			grid-template-columns: 1fr;
		}
	}

	.mt-6 {
		margin-top: 24px;
	}

	.error-message {
		padding: 16px;
		background: rgba(232, 166, 77, 0.1);
		border: 1px solid #e8a64d;
		border-radius: 4px;
	}

	.error-message h3 {
		color: #e8a64d;
		margin-bottom: 8px;
	}

	.empty-state {
		text-align: center;
		padding: 48px 24px;
		color: var(--color-text-muted);
	}

	.empty-state h2 {
		font-size: 1.5rem;
		color: var(--color-text);
		margin-bottom: 12px;
	}
</style>
