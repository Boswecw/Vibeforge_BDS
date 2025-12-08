<div class="space-y-3">
	<h1 class="text-2xl font-semibold text-white">VibeForge_BDS (Local)</h1>
	<p class="text-slate-300 text-sm">
		BDS-focused VibeForge variant for agent planning/execution, SAS checks, and coordination.
	</p>
	<ul class="list-disc list-inside text-slate-200 text-sm space-y-1">
		<li>Use the Planning tab to inspect planner sessions and PAORT steps.</li>
		<li>Use the Workbench tab to run execution/evaluator sessions.</li>
		<li>Use the Coordinator tab for multi-repo rollout coordination.</li>
		<li>Use Admin to view/edit agent templates (unlocked only).</li>
	</ul>
	<p class="text-xs text-slate-500">
		Configure backend URLs in <code>src/lib/config/backend.ts</code>. Streaming PAORT and real SAS
		comparison are TODOs once services are wired.
	</p>
</div>
