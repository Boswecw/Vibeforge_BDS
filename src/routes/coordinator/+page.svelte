<script lang="ts">
	import CoordinatorForm from '$lib/components/coordinator/CoordinatorForm.svelte';
	import CoordinatorSummary from '$lib/components/coordinator/CoordinatorSummary.svelte';
	import { agentSessionDetails } from '$lib/stores/agentSessions';
	import { writable, derived } from 'svelte/store';

	const activeId = writable<string | null>(null);

	const activeDetail = derived(
		[activeId, agentSessionDetails],
		([$id, $details]) => ($id ? $details[$id] : null)
	);

	const handleStarted = (event: CustomEvent<string>) => {
		activeId.set(event.detail);
	};
</script>

<div class="space-y-4">
	<section class="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
		<h1 class="text-lg font-semibold text-white mb-2">Coordinator</h1>
		<p class="text-sm text-slate-400 mb-3">
			Plan and coordinate multi-repo changes with SAS summaries.
		</p>
		<CoordinatorForm on:sessionStarted={handleStarted} />
	</section>

	<section class="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
		<h2 class="text-md font-semibold text-white mb-2">Summary</h2>
		{#if $activeDetail}
			<CoordinatorSummary session={$activeDetail} />
		{:else}
			<p class="text-slate-400 text-sm">Start a coordinator session to see results.</p>
		{/if}
	</section>
</div>
