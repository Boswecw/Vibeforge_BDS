<script lang="ts">
	import type { AgentSessionSummary } from '$lib/stores/agentSessions';
	import { createEventDispatcher } from 'svelte';

	export let sessions: AgentSessionSummary[] = [];

	const dispatch = createEventDispatcher<{ selectSession: string }>();

	const formatDate = (value: string) => new Date(value).toLocaleString();
</script>

<div class="space-y-2">
	{#if sessions.length === 0}
		<p class="text-slate-400 text-sm">No planner sessions yet.</p>
	{:else}
		{#each sessions as session (session.id)}
			<button
				class="w-full text-left p-3 rounded-md border border-slate-800 hover:border-slate-600 bg-slate-800/40 text-slate-100 transition"
				on:click={() => dispatch('selectSession', session.id)}
			>
				<div class="flex items-center justify-between">
					<div class="font-medium">{session.label}</div>
					<span class="text-xs uppercase tracking-wide text-slate-400">{session.status}</span>
				</div>
				<div class="text-xs text-slate-400 mt-1">{formatDate(session.createdAt)}</div>
			</button>
		{/each}
	{/if}
</div>
