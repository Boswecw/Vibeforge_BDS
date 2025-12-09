<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { AGENT_TEMPLATES } from '$lib/agents/templates';
	import { createExecutionSession, createEvaluatorSession } from '$lib/stores/agentSessions';

	const dispatch = createEventDispatcher<{ sessionStarted: string }>();

	const executionTemplates = [...AGENT_TEMPLATES.execution, ...AGENT_TEMPLATES.evaluator];

	let templateId = executionTemplates[0]?.id ?? '';
	let promptText = '';
	let codeSnippet = '';
	let repo = '';
	let branch = '';
	let filePath = '';
	let submitting = false;

	const submit = async () => {
		if (!templateId) return;
		submitting = true;
		const payload = {
			templateId,
			input: {
				promptText: promptText || undefined,
				codeSnippet: codeSnippet || undefined,
				repo: repo || undefined,
				branch: branch || undefined,
				filePath: filePath || undefined
			}
		};

		const template = executionTemplates.find((t) => t.id === templateId);
		const isEvaluator = template?.kind === 'evaluator';
		const sessionId = isEvaluator
			? await createEvaluatorSession(payload)
			: await createExecutionSession(payload);

		dispatch('sessionStarted', sessionId);
		submitting = false;
	};
</script>

<form class="space-y-3" on:submit|preventDefault={submit}>
	<div>
		<label class="block text-sm text-slate-300 mb-1" for="agent-template">Agent Template</label>
		<select
			id="agent-template"
			class="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 text-sm"
			bind:value={templateId}
		>
			{#each executionTemplates as template (template.id)}
				<option value={template.id}>
					{template.label} ({template.kind})
				</option>
			{/each}
		</select>
	</div>

	<div>
		<label class="block text-sm text-slate-300 mb-1" for="prompt-text">Prompt Text</label>
		<textarea
			id="prompt-text"
			class="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 text-sm"
			rows="3"
			placeholder="Describe the task or question"
			bind:value={promptText}
		></textarea>
	</div>

	<div>
		<label class="block text-sm text-slate-300 mb-1" for="code-snippet">Code Snippet (optional)</label>
		<textarea
			id="code-snippet"
			class="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 text-sm font-mono"
			rows="3"
			placeholder="// paste relevant code for refactor/eval"
			bind:value={codeSnippet}
		></textarea>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-2">
		<div>
			<label class="block text-sm text-slate-300 mb-1" for="repo">Repo</label>
			<input
				id="repo"
				class="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 text-sm"
				placeholder="vibeforge"
				bind:value={repo}
			/>
		</div>
		<div>
			<label class="block text-sm text-slate-300 mb-1" for="branch">Branch</label>
			<input
				id="branch"
				class="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 text-sm"
				placeholder="main"
				bind:value={branch}
			/>
		</div>
		<div>
			<label class="block text-sm text-slate-300 mb-1" for="file-path">File Path</label>
			<input
				id="file-path"
				class="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 text-sm"
				placeholder="src/lib/feature.ts"
				bind:value={filePath}
			/>
		</div>
	</div>

	<div class="pt-2">
		<button
			class="px-4 py-2 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400 disabled:opacity-60"
			type="submit"
			disabled={submitting}
		>
			{submitting ? 'Running…' : 'Run'}
		</button>
	</div>
</form>
