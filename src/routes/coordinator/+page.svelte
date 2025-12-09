<script lang="ts">
	import { coordinatorStore } from '$lib/stores/coordinator.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import Panel from '$lib/components/Panel.svelte';

	const currentSession = $derived(coordinatorStore.currentSession);
</script>

<ErrorBoundary>
	<div class="coordinator-page">
		<header class="page-header">
			<h1>Coordinator Agent</h1>
			<p class="text-muted">Orchestrate multi-agent workflows</p>
		</header>

		<Panel title="Welcome">
			<div class="empty-state">
				<h2>Create a Workflow</h2>
				<p>Design and execute multi-agent coordination workflows.</p>
			</div>
		</Panel>
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
