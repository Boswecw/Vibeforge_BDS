<script lang="ts">
	import { writable } from 'svelte/store';
	import { AGENT_TEMPLATES } from '$lib/agents/templates';
	import type { AgentTemplate } from '$lib/agents/types';
	import AgentTemplateTable from '$lib/components/admin/AgentTemplateTable.svelte';

	const initialTemplates: AgentTemplate[] = [
		...AGENT_TEMPLATES.planner,
		...AGENT_TEMPLATES.execution,
		...AGENT_TEMPLATES.evaluator,
		...AGENT_TEMPLATES.coordinator
	];

	const templatesStore = writable<AgentTemplate[]>(initialTemplates);

	const handleUpdate = (updated: AgentTemplate) => {
		templatesStore.update((items) =>
			items.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
		);
	};
</script>

<section class="space-y-4">
	<header class="flex items-center justify-between">
		<div>
			<h1 class="text-xl font-semibold text-white">Agent Templates (Admin)</h1>
			<p class="text-sm text-slate-400">
				Manage in-memory templates. Locked templates are view-only. TODO: persist via Tauri config.
			</p>
		</div>
	</header>

	<AgentTemplateTable templates={$templatesStore} onUpdate={handleUpdate} />
</section>
