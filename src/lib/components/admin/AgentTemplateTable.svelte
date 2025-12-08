<script lang="ts">
	import type { AgentTemplate } from '$lib/agents/types';
	import AgentTemplateForm from './AgentTemplateForm.svelte';

	export let templates: AgentTemplate[] = [];
	export let onUpdate: (template: AgentTemplate) => void;

	let editingId: string | null = null;
</script>

<div class="overflow-auto">
	<table class="min-w-full text-sm text-left text-slate-200">
		<thead class="bg-slate-800 text-xs uppercase text-slate-400">
			<tr>
				<th class="px-4 py-2">Kind</th>
				<th class="px-4 py-2">Label</th>
				<th class="px-4 py-2">Pipeline</th>
				<th class="px-4 py-2">Allowed Repos</th>
				<th class="px-4 py-2">Auto SAS</th>
				<th class="px-4 py-2">Locked</th>
				<th class="px-4 py-2">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each templates as template (template.id)}
				<tr class="border-b border-slate-800">
					<td class="px-4 py-2">{template.kind}</td>
					<td class="px-4 py-2">{template.label}</td>
					<td class="px-4 py-2">{template.pipelineId}</td>
					<td class="px-4 py-2 text-slate-300">{template.allowedRepos.join(', ')}</td>
					<td class="px-4 py-2">{template.autoEvaluateWithSAS ? 'Yes' : 'No'}</td>
					<td class="px-4 py-2">{template.locked ? 'Locked' : 'Editable'}</td>
					<td class="px-4 py-2">
						{#if !template.locked}
							<button
								class="px-3 py-1 rounded bg-amber-500 text-black text-xs font-semibold"
								on:click={() => (editingId = template.id)}
							>
								Edit
							</button>
						{:else}
							<span class="text-xs text-slate-500">Locked</span>
						{/if}
					</td>
				</tr>
				{#if editingId === template.id}
					<tr class="border-b border-slate-800">
						<td colspan="7" class="px-4 py-3 bg-slate-900/70">
							<AgentTemplateForm
								{template}
								on:save={(e) => {
									onUpdate(e.detail);
									editingId = null;
								}}
								on:cancel={() => (editingId = null)}
							/>
							<p class="text-xs text-slate-500 mt-2">
								TODO: persist to config (Tauri) instead of in-memory once available.
							</p>
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>
