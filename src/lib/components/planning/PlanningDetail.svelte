<script lang="ts">
	import type { AgentSessionDetail } from '$lib/stores/agentSessions';
	import { createEventDispatcher } from 'svelte';

	export let session: AgentSessionDetail;

	const dispatch = createEventDispatcher<{ replan: { sessionId: string; constraints: unknown } }>();

	let allowedRepos: string[] = [];
	let maxSteps = 10;
	let showModal = false;

	const toggleRepo = (repo: string) => {
		allowedRepos = allowedRepos.includes(repo)
			? allowedRepos.filter((r) => r !== repo)
			: [...allowedRepos, repo];
	};

	const submitReplan = () => {
		dispatch('replan', { sessionId: session.id, constraints: { allowedRepos, maxSteps } });
		showModal = false;
	};
</script>

<div class="space-y-4">
	<header class="border-b border-slate-800 pb-3">
		<h2 class="text-xl font-semibold text-white">{session.label}</h2>
		<p class="text-sm text-slate-400">Template: {session.templateId ?? 'unknown'}</p>
	</header>

	<section>
		<h3 class="text-sm font-semibold text-slate-200 mb-2">PAORT Steps</h3>
		<div class="space-y-2">
			{#if session.paortEvents.length === 0}
				<p class="text-slate-400 text-sm">No PAORT events recorded yet.</p>
			{:else}
				{#each session.paortEvents as event (event.id)}
					<div class="p-3 rounded-md bg-slate-800/50 border border-slate-800">
						<div class="text-xs uppercase text-amber-300 font-semibold">{event.phase}</div>
						<div class="text-sm text-slate-100 mt-1">{event.message}</div>
						<div class="text-xs text-slate-500 mt-1">{new Date(event.timestamp).toLocaleString()}</div>
					</div>
				{/each}
			{/if}
		</div>
	</section>

	<section class="border-t border-slate-800 pt-3">
		<h3 class="text-sm font-semibold text-slate-200 mb-2">Tasks by Repo</h3>
		{#if session.metadata?.tasksByRepo}
			<div class="space-y-3">
				{#each (session.metadata?.tasksByRepo as any[]) ?? [] as repoBlock, idx (idx)}
					<div class="p-3 rounded-md bg-slate-800/40 border border-slate-800">
						<div class="font-medium text-white">{repoBlock.repo ?? 'Unknown repo'}</div>
						<ul class="list-disc list-inside text-slate-200 text-sm mt-1 space-y-1">
							{#each (repoBlock.tasks ?? []) as task, tIdx (tIdx)}
								<li>{task}</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-slate-400 text-sm">No task breakdown available.</p>
		{/if}
	</section>

	<section class="border-t border-slate-800 pt-3">
		<button
			class="px-4 py-2 rounded-md bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
			on:click={() => (showModal = true)}
		>
			Re-plan with Updated Constraints
		</button>
	</section>

	{#if showModal}
		<div class="fixed inset-0 bg-black/60 flex items-center justify-center z-10">
			<div class="bg-slate-900 border border-slate-700 rounded-lg p-4 w-full max-w-md space-y-3">
				<h4 class="text-lg font-semibold text-white">Update Constraints</h4>
				<div class="space-y-2">
					<label class="text-sm text-slate-300">Allowed Repos (toggle)</label>
					<div class="flex flex-wrap gap-2">
						{#each (session.metadata?.allowedRepos as string[]) ?? [] as repo}
							<button
								type="button"
								class={`px-2 py-1 rounded border ${
									allowedRepos.includes(repo)
										? 'border-amber-400 text-amber-300'
										: 'border-slate-700 text-slate-300'
								}`}
								on:click={() => toggleRepo(repo)}
							>
								{repo}
							</button>
						{/each}
					</div>
				</div>
				<div>
					<label class="text-sm text-slate-300">Max steps</label>
					<input
						class="mt-1 w-full bg-slate-800 text-white border border-slate-700 rounded px-2 py-1 text-sm"
						type="number"
						min="1"
						bind:value={maxSteps}
					/>
				</div>
				<div class="flex justify-end gap-2 pt-2">
					<button
						class="px-3 py-1 rounded border border-slate-700 text-slate-200"
						on:click={() => (showModal = false)}
					>
						Cancel
					</button>
					<button
						class="px-3 py-1 rounded bg-amber-500 text-black font-semibold"
						on:click={submitReplan}
					>
						Apply
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
