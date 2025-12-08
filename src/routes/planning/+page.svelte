<script lang="ts">
	import { agentSessionSummaries, agentSessionDetails } from '$lib/stores/agentSessions';
	import PlanningList from '$lib/components/planning/PlanningList.svelte';
	import PlanningDetail from '$lib/components/planning/PlanningDetail.svelte';
	import { derived, writable } from 'svelte/store';

	const plannerSessions = derived(agentSessionSummaries, ($summaries) =>
		$summaries.filter((s) => s.kind === 'planner')
	);

	const selectedId = writable<string | null>(null);

	const selectedDetail = derived(
		[selectedId, agentSessionDetails],
		([$selectedId, $details]) => ($selectedId ? $details[$selectedId] : null)
	);

	const handleSelect = (id: string) => {
		selectedId.set(id);
	};
</script>

<div class="grid grid-cols-1 gap-4 lg:grid-cols-3 h-full">
	<section class="col-span-1 bg-slate-900/50 border border-slate-800 rounded-lg p-4">
		<h1 class="text-lg font-semibold text-white mb-3">Planning Sessions</h1>
		<PlanningList sessions={$plannerSessions} on:selectSession={(e) => handleSelect(e.detail)} />
	</section>

	<section class="col-span-1 lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-lg p-4">
		{#if $selectedDetail}
			<PlanningDetail session={$selectedDetail} />
		{:else}
			<p class="text-slate-400 text-sm">Select a planning session to view details.</p>
		{/if}
	</section>
</div>
