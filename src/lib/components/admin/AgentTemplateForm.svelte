<script lang="ts">
	import type { AgentTemplate } from '$lib/agents/types';
	import { createEventDispatcher } from 'svelte';

	export let template: AgentTemplate;

	const dispatch = createEventDispatcher<{ save: AgentTemplate; cancel: void }>();

	let allowedReposText = template.allowedRepos.join(', ');
	let autoEvaluateWithSAS = template.autoEvaluateWithSAS;

	const save = () => {
		const allowedRepos = allowedReposText
			.split(',')
			.map((r) => r.trim())
			.filter(Boolean);
		dispatch('save', { ...template, allowedRepos, autoEvaluateWithSAS });
	};
</script>

<div class="space-y-3">
	<div>
		<label for="allowed-repos" class="text-sm text-slate-300">Allowed Repos (comma-separated)</label>
		<input
			id="allowed-repos"
			class="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 text-sm mt-1"
			bind:value={allowedReposText}
		/>
	</div>

	<div class="flex items-center gap-2">
		<input id="sas" type="checkbox" bind:checked={autoEvaluateWithSAS} class="accent-amber-400" />
		<label for="sas" class="text-sm text-slate-200">Auto evaluate with SAS</label>
	</div>

	<div class="flex justify-end gap-2">
		<button
			type="button"
			class="px-3 py-1 rounded border border-slate-700 text-slate-200"
			on:click={() => dispatch('cancel')}
		>
			Cancel
		</button>
		<button
			type="button"
			class="px-3 py-1 rounded bg-amber-500 text-black font-semibold"
			on:click={save}
		>
			Save
		</button>
	</div>
</div>
