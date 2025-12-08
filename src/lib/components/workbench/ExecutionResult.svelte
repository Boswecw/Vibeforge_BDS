<script lang="ts">
	import type { AgentSessionDetail } from '$lib/stores/agentSessions';

	export let session: AgentSessionDetail;

	const meta = session.metadata ?? {};
	const execMeta = (meta.executionMetadata as Record<string, unknown>) ?? {};
</script>

<div class="space-y-3">
	<div class="p-3 rounded bg-slate-800/40 border border-slate-800">
		<div class="text-sm text-slate-300">
			<strong>Pipeline:</strong> {meta.pipelineId ?? 'unknown'}
		</div>
		<div class="text-sm text-slate-300">
			<strong>Model(s):</strong> {(execMeta.models as string[])?.join(', ') ?? 'n/a'}
		</div>
		<div class="text-sm text-slate-300">
			<strong>Token usage:</strong> {execMeta.tokenUsage ?? 'n/a'}
		</div>
		<div class="text-sm text-slate-300">
			<strong>Latency:</strong> {execMeta.latencyMs ?? 'n/a'} ms
		</div>
		<div class="text-sm text-amber-300">
			<strong>Safety / SAS:</strong> {execMeta.safetyNotes ?? 'pending'}
		</div>
	</div>

	<div class="p-3 rounded bg-slate-800/60 border border-slate-800">
		<h3 class="text-sm font-semibold text-white mb-2">Output</h3>
		<pre class="text-sm text-slate-100 whitespace-pre-wrap font-mono">{JSON.stringify(session.output, null, 2)}</pre>
	</div>
</div>
