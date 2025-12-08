<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	const links = [
		{ href: '/planning', label: 'Planning' },
		{ href: '/workbench', label: 'Workbench' },
		{ href: '/coordinator', label: 'Coordinator' },
		{ href: '/admin/agents', label: 'Admin' }
	];
</script>

<div class="min-h-screen bg-slate-950 text-white">
	<header class="border-b border-slate-800 bg-slate-900/70">
		<div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
			<div class="text-lg font-semibold">VibeForge_BDS</div>
			<nav class="flex items-center gap-3 text-sm">
				{#each links as link}
					<a
						class={`px-3 py-2 rounded ${
							$page.url.pathname.startsWith(link.href)
								? 'bg-amber-500 text-black font-semibold'
								: 'text-slate-200 hover:text-white hover:bg-slate-800'
						}`}
						href={link.href}
					>
						{link.label}
					</a>
				{/each}
			</nav>
		</div>
	</header>

	<main class="max-w-6xl mx-auto px-4 py-6">
		<slot />
	</main>
</div>
