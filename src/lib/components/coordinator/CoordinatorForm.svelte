<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { createCoordinatorSession } from '$lib/stores/agentSessions';
	import { AGENT_TEMPLATES } from '$lib/agents/templates';

	const dispatch = createEventDispatcher<{ sessionStarted: string }>();

	let description = '';
	let selectedRepos: string[] = [];
	const coordinatorTemplate = AGENT_TEMPLATES.coordinator[0];

	const toggleRepo = (repo: string) => {
		selectedRepos = selectedRepos.includes(repo)
			? selectedRepos.filter((r) => r !== repo)
			: [...selectedRepos, repo];
	};

	const submit = async () => {
		const sessionId = await createCoordinatorSession({
			templateId: coordinatorTemplate?.id,
			input: {
				description,
				repos: selectedRepos
			}
		});
		dispatch('sessionStarted', sessionId);
	};
</script>

<div class="space-y-3">
	<div>
		<label for="coord-description" class="text-sm text-slate-300">High-level change description</label>
		<textarea
			id="coord-description"
			class="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 text-sm"
			rows="3"
			bind:value={description}
		></textarea>
	</div>

	<div>
		<p class="text-sm text-slate-300">Repos / services</p>
		<div class="flex flex-wrap gap-2 mt-1">
			{#each coordinatorTemplate?.allowedRepos ?? [] as repo}
				<button
					type="button"
					class={`px-2 py-1 rounded border text-sm ${
						selectedRepos.includes(repo)
							? 'border-amber-400 text-amber-200'
							: 'border-slate-700 text-slate-200'
					}`}
					on:click={() => toggleRepo(repo)}
				>
					{repo}
				</button>
			{/each}
		</div>
	</div>

	<div class="pt-2">
		<button
			class="px-4 py-2 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400"
			on:click={submit}
		>
			Start Coordinator Session
		</button>
	</div>
</div>
