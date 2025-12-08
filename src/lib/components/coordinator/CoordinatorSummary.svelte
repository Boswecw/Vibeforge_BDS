<script lang="ts">
	import type { AgentSessionDetail } from '$lib/stores/agentSessions';
	import type { SASEvaluationResult } from '$lib/sas/evaluation';

	export let session: AgentSessionDetail;

	const perRepoPlans = (session.metadata?.perRepoPlans as any[]) ?? [];
	const globalChecklist = (session.metadata?.globalChecklist as string[]) ?? [];
	const sasSummary = (session.sasResults as SASEvaluationResult[]) ?? [];
</script>

<div class="space-y-3">
	<section>
		<h3 class="text-sm font-semibold text-white mb-1">Per-repo plans</h3>
		{#if perRepoPlans.length === 0}
			<p class="text-slate-400 text-sm">No per-repo plans yet.</p>
		{:else}
			<div class="space-y-2">
				{#each perRepoPlans as plan, idx (idx)}
					<div class="p-3 rounded bg-slate-800/50 border border-slate-800">
						<div class="font-semibold text-white">{plan.repo ?? 'Unknown repo'}</div>
						<ul class="list-disc list-inside text-sm text-slate-200 space-y-1 mt-1">
							{#each (plan.tasks ?? []) as task, tIdx (tIdx)}
								<li>{task}</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<section class="border-t border-slate-800 pt-2">
		<h3 class="text-sm font-semibold text-white mb-1">Cross-repo checklist</h3>
		{#if globalChecklist.length === 0}
			<p class="text-slate-400 text-sm">No checklist items yet.</p>
		{:else}
			<ul class="list-disc list-inside text-sm text-slate-200 space-y-1">
				{#each globalChecklist as item, idx (idx)}
					<li>{item}</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section class="border-t border-slate-800 pt-2">
		<h3 class="text-sm font-semibold text-white mb-1">SAS summary</h3>
		{#if sasSummary.length === 0}
			<p class="text-slate-400 text-sm">SAS evaluation pending.</p>
		{:else}
			<div class="space-y-2">
				{#each sasSummary as result (result.sectionId)}
					<div class="p-2 rounded bg-slate-800/40 border border-slate-700">
						<div class="flex items-center justify-between text-sm">
							<span class="font-semibold text-white">{result.sectionTitle}</span>
							<span class="text-xs uppercase text-amber-300">{result.status}</span>
						</div>
						<p class="text-xs text-slate-300 mt-1">{result.explanation}</p>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
