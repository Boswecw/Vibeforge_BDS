<script lang="ts">
	import ExecutionForm from '$lib/components/workbench/ExecutionForm.svelte';
	import ExecutionResult from '$lib/components/workbench/ExecutionResult.svelte';
	import { agentSessionDetails } from '$lib/stores/agentSessions';
	import { writable, derived } from 'svelte/store';

	const activeSessionId = writable<string | null>(null);

	const activeDetail = derived(
		[activeSessionId, agentSessionDetails],
		([$id, $details]) => ($id ? $details[$id] : null)
	);

	const handleStarted = (event: CustomEvent<string>) => {
		activeSessionId.set(event.detail);
	};
</script>

<div class="space-y-4">
	<section class="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
		<h1 class="text-lg font-semibold text-white mb-3">Workbench Execution</h1>
		<ExecutionForm on:sessionStarted={handleStarted} />
	</section>

	<section class="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
		<h2 class="text-md font-semibold text-white mb-2">Latest Result</h2>
		{#if $activeDetail}
			<ExecutionResult session={$activeDetail} />
		{:else}
			<p class="text-slate-400 text-sm">Run an execution or evaluation to see results.</p>
		{/if}
	</section>
</div>
