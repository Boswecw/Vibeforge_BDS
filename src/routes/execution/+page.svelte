<script lang="ts">
	import { executionStore } from '$lib/stores/execution.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import { SessionStatus } from '$lib/types/agents';

	const currentSession = $derived(executionStore.currentSession);
	const isExecuting = $derived(executionStore.isExecuting);
</script>

<ErrorBoundary>
	<div class="execution-page">
		<header class="page-header">
			<h1>Execution Agent</h1>
			<p class="text-muted">Execute code generation and implementation tasks</p>
		</header>

		<div class="content-grid">
			<div class="left-column">
				<Panel title="Execution Request">
					<p>Load from Planning Panel or create new execution request</p>
				</Panel>
			</div>

			<div class="right-column">
				{#if currentSession}
					<Panel title="Execution Output">
						<p>Session {currentSession.id}</p>
						<p>Status: {currentSession.status}</p>
					</Panel>
				{:else}
					<Panel title="Welcome">
						<div class="empty-state">
							<h2>Start an Execution Session</h2>
							<p>Load a plan from the Planning Agent to begin execution.</p>
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
		grid-template-columns: 1fr 1fr;
		gap: 24px;
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
