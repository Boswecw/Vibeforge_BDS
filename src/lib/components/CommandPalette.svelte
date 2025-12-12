<!--
  Command Palette Component (Cmd+K / Ctrl+K)

  Features:
  - Fuzzy search across routes, skills, workflows, history
  - Keyboard shortcuts: Cmd+K / Ctrl+K to open, Esc to close
  - Arrow keys for navigation, Enter to select
  - Recent items at top
  - Quick actions support
  - Usage analytics tracking
-->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Fuse from 'fuse.js';

	interface CommandItem {
		id: string;
		title: string;
		description?: string;
		type: 'route' | 'skill' | 'workflow' | 'action' | 'recent';
		icon: string;
		url?: string;
		action?: () => void;
		keywords?: string[];
	}

	// State
	let isOpen = $state(false);
	let query = $state('');
	let selectedIndex = $state(0);
	let recentItems = $state<string[]>([]);
	let fuse: Fuse<CommandItem> | null = null;

	// Searchable items
	const commandItems: CommandItem[] = [
		// Routes
		{
			id: 'route-home',
			title: 'Home',
			description: 'Dashboard and overview',
			type: 'route',
			icon: '🏠',
			url: '/',
			keywords: ['dashboard', 'overview', 'home']
		},
		{
			id: 'route-library',
			title: 'Skill Library',
			description: 'Browse and manage skills',
			type: 'route',
			icon: '📚',
			url: '/library',
			keywords: ['skills', 'browse', 'library', 'catalog']
		},
		{
			id: 'route-testing',
			title: 'Testing Lab',
			description: 'Test and execute skills',
			type: 'route',
			icon: '🧪',
			url: '/testing',
			keywords: ['test', 'execute', 'run', 'lab']
		},
		{
			id: 'route-workflows',
			title: 'Workflows',
			description: 'Create and manage workflows',
			type: 'route',
			icon: '🔄',
			url: '/workflows',
			keywords: ['workflow', 'automation', 'pipeline']
		},
		{
			id: 'route-agents',
			title: 'Agents',
			description: 'Manage AI agents',
			type: 'route',
			icon: '🤖',
			url: '/agents',
			keywords: ['agent', 'ai', 'assistant']
		},
		{
			id: 'route-models',
			title: 'Models',
			description: 'Configure AI models',
			type: 'route',
			icon: '🧠',
			url: '/models',
			keywords: ['model', 'llm', 'gpt', 'claude']
		},
		{
			id: 'route-history',
			title: 'Execution History',
			description: 'View past executions',
			type: 'route',
			icon: '📜',
			url: '/history',
			keywords: ['history', 'logs', 'past', 'executions']
		},
		{
			id: 'route-analytics',
			title: 'Analytics',
			description: 'View usage metrics',
			type: 'route',
			icon: '📊',
			url: '/analytics',
			keywords: ['analytics', 'metrics', 'stats', 'usage']
		},
		{
			id: 'route-architecture',
			title: 'Architecture',
			description: 'System architecture overview',
			type: 'route',
			icon: '🏗️',
			url: '/architecture',
			keywords: ['architecture', 'system', 'structure']
		},
		{
			id: 'route-planning',
			title: 'Planning',
			description: 'Plan and strategy',
			type: 'route',
			icon: '📋',
			url: '/planning',
			keywords: ['plan', 'strategy', 'roadmap']
		},
		{
			id: 'route-execution',
			title: 'Execution',
			description: 'Execution status',
			type: 'route',
			icon: '⚡',
			url: '/execution',
			keywords: ['execution', 'running', 'status']
		},
		{
			id: 'route-evaluator',
			title: 'Evaluator',
			description: 'Evaluate results',
			type: 'route',
			icon: '⚖️',
			url: '/evaluator',
			keywords: ['evaluate', 'judge', 'assess']
		},
		{
			id: 'route-coordinator',
			title: 'Coordinator',
			description: 'Coordinate tasks',
			type: 'route',
			icon: '🎯',
			url: '/coordinator',
			keywords: ['coordinate', 'manage', 'orchestrate']
		},
		{
			id: 'route-settings',
			title: 'Settings',
			description: 'Application settings',
			type: 'route',
			icon: '⚙️',
			url: '/settings',
			keywords: ['settings', 'config', 'preferences']
		},
		{
			id: 'route-admin',
			title: 'Admin',
			description: 'Admin dashboard',
			type: 'route',
			icon: '👨‍💼',
			url: '/admin',
			keywords: ['admin', 'management', 'control']
		},
		{
			id: 'route-admin-agents',
			title: 'Admin Agents',
			description: 'Manage agents (admin)',
			type: 'route',
			icon: '🔧',
			url: '/admin/agents',
			keywords: ['admin', 'agents', 'manage']
		},

		// Quick Actions
		{
			id: 'action-new-workflow',
			title: 'Create New Workflow',
			description: 'Start a new workflow',
			type: 'action',
			icon: '➕',
			action: () => goto('/workflows?new=true'),
			keywords: ['new', 'create', 'workflow']
		},
		{
			id: 'action-test-skill',
			title: 'Test a Skill',
			description: 'Open testing lab',
			type: 'action',
			icon: '🧪',
			action: () => goto('/testing'),
			keywords: ['test', 'run', 'execute', 'skill']
		},
		{
			id: 'action-view-analytics',
			title: 'View Analytics',
			description: 'Open analytics dashboard',
			type: 'action',
			icon: '📊',
			action: () => goto('/analytics'),
			keywords: ['analytics', 'stats', 'metrics']
		}
	];

	// Filtered results
	let filteredItems = $derived.by(() => {
		if (!query.trim()) {
			// Show recent items when no query
			return commandItems
				.filter((item) => recentItems.includes(item.id))
				.sort((a, b) => recentItems.indexOf(a.id) - recentItems.indexOf(b.id))
				.slice(0, 5);
		}

		// Fuzzy search
		if (fuse) {
			const results = fuse.search(query);
			return results.map((result) => result.item).slice(0, 10);
		}

		return [];
	});

	// Initialize Fuse.js
	onMount(() => {
		// Load recent items from localStorage
		const stored = localStorage.getItem('command_palette_recent');
		if (stored) {
			try {
				recentItems = JSON.parse(stored);
			} catch (e) {
				recentItems = [];
			}
		}

		// Initialize Fuse.js
		fuse = new Fuse(commandItems, {
			keys: [
				{ name: 'title', weight: 2 },
				{ name: 'description', weight: 1 },
				{ name: 'keywords', weight: 1.5 }
			],
			threshold: 0.3,
			includeScore: true,
			minMatchCharLength: 2
		});

		// Listen for keyboard shortcuts
		window.addEventListener('keydown', handleGlobalKeydown);

		return () => {
			window.removeEventListener('keydown', handleGlobalKeydown);
		};
	});

	function handleGlobalKeydown(e: KeyboardEvent) {
		// Open with Cmd+K (Mac) or Ctrl+K (Windows/Linux)
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			isOpen = true;
			selectedIndex = 0;
			// Focus input after opening
			setTimeout(() => {
				document.getElementById('command-palette-input')?.focus();
			}, 10);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		switch (e.key) {
			case 'Escape':
				e.preventDefault();
				close();
				break;

			case 'ArrowDown':
				e.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, filteredItems.length - 1);
				scrollSelectedIntoView();
				break;

			case 'ArrowUp':
				e.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, 0);
				scrollSelectedIntoView();
				break;

			case 'Enter':
				e.preventDefault();
				if (filteredItems[selectedIndex]) {
					selectItem(filteredItems[selectedIndex]);
				}
				break;

			case 'Tab':
				e.preventDefault();
				if (e.shiftKey) {
					selectedIndex = Math.max(selectedIndex - 1, 0);
				} else {
					selectedIndex = Math.min(selectedIndex + 1, filteredItems.length - 1);
				}
				scrollSelectedIntoView();
				break;
		}
	}

	function scrollSelectedIntoView() {
		setTimeout(() => {
			const selected = document.querySelector('.command-item.selected');
			selected?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
		}, 10);
	}

	function selectItem(item: CommandItem) {
		// Track recent items
		addToRecent(item.id);

		// Execute action or navigate
		if (item.action) {
			item.action();
		} else if (item.url) {
			goto(item.url);
		}

		// Track usage (optional analytics)
		trackUsage(item);

		close();
	}

	function addToRecent(id: string) {
		// Remove if already exists
		recentItems = recentItems.filter((itemId) => itemId !== id);

		// Add to front
		recentItems = [id, ...recentItems].slice(0, 10);

		// Save to localStorage
		localStorage.setItem('command_palette_recent', JSON.stringify(recentItems));
	}

	function trackUsage(item: CommandItem) {
		// Track command usage in localStorage for analytics
		const usage = JSON.parse(localStorage.getItem('command_palette_usage') || '{}');
		usage[item.id] = (usage[item.id] || 0) + 1;
		localStorage.setItem('command_palette_usage', JSON.stringify(usage));

		console.log(`[CommandPalette] Used: ${item.title}`);
	}

	function close() {
		isOpen = false;
		query = '';
		selectedIndex = 0;
	}

	function handleBackdropClick() {
		close();
	}

	// Reset selected index when query changes
	$effect(() => {
		query;
		selectedIndex = 0;
	});
</script>

{#if isOpen}
	<div class="command-palette-backdrop" onclick={handleBackdropClick}>
		<div class="command-palette-container" onclick={(e) => e.stopPropagation()}>
			<!-- Search Input -->
			<div class="command-palette-input-wrapper">
				<span class="search-icon">🔍</span>
				<input
					id="command-palette-input"
					type="text"
					bind:value={query}
					onkeydown={handleKeydown}
					placeholder="Type a command or search..."
					class="command-palette-input"
					autocomplete="off"
					spellcheck={false}
				/>
				<kbd class="shortcut-hint">esc</kbd>
			</div>

			<!-- Results -->
			<div class="command-palette-results">
				{#if filteredItems.length === 0 && !query}
					<div class="empty-state">
						<p class="empty-icon">⌨️</p>
						<p class="empty-message">Type to search...</p>
						<p class="empty-hint">
							Search for routes, skills, workflows, or actions
						</p>
					</div>
				{:else if filteredItems.length === 0}
					<div class="empty-state">
						<p class="empty-icon">🔍</p>
						<p class="empty-message">No results found</p>
						<p class="empty-hint">Try a different search term</p>
					</div>
				{:else}
					{#each filteredItems as item, index (item.id)}
						<button
							class="command-item"
							class:selected={index === selectedIndex}
							onclick={() => selectItem(item)}
							onmouseenter={() => (selectedIndex = index)}
						>
							<span class="item-icon">{item.icon}</span>
							<div class="item-content">
								<div class="item-title">{item.title}</div>
								{#if item.description}
									<div class="item-description">{item.description}</div>
								{/if}
							</div>
							<span class="item-type">{item.type}</span>
						</button>
					{/each}
				{/if}
			</div>

			<!-- Footer -->
			<div class="command-palette-footer">
				<div class="shortcuts">
					<kbd>↑↓</kbd> Navigate
					<kbd>↵</kbd> Select
					<kbd>esc</kbd> Close
				</div>
				<div class="hint">
					Tip: Press <kbd>?</kbd> for help
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.command-palette-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		z-index: 10000;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 20vh;
		animation: fadeIn 0.15s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.command-palette-container {
		width: 100%;
		max-width: 640px;
		background: var(--color-midnight);
		border: 2px solid var(--color-brass);
		border-radius: var(--radius-lg);
		box-shadow:
			var(--shadow-xl),
			0 0 40px rgba(var(--color-brass-rgb), 0.3);
		overflow: hidden;
		animation: slideDown 0.2s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-20px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.command-palette-input-wrapper {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-lg);
		border-bottom: 1px solid var(--color-border-default);
	}

	.search-icon {
		font-size: 1.25rem;
		opacity: 0.5;
	}

	.command-palette-input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		font-family: var(--font-family-body);
		font-size: 1rem;
		color: var(--color-text-primary);
		padding: 0;
	}

	.command-palette-input::placeholder {
		color: var(--color-text-tertiary);
	}

	.shortcut-hint {
		padding: var(--spacing-xs) var(--spacing-sm);
		background: var(--color-surface-2);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-family: var(--font-family-mono);
		text-transform: uppercase;
	}

	.command-palette-results {
		max-height: 400px;
		overflow-y: auto;
		padding: var(--spacing-sm);
	}

	.command-palette-results::-webkit-scrollbar {
		width: 8px;
	}

	.command-palette-results::-webkit-scrollbar-track {
		background: var(--color-surface-1);
	}

	.command-palette-results::-webkit-scrollbar-thumb {
		background: var(--color-brass);
		border-radius: 4px;
	}

	.empty-state {
		padding: var(--spacing-3xl) var(--spacing-xl);
		text-align: center;
	}

	.empty-icon {
		font-size: 3rem;
		margin-bottom: var(--spacing-md);
	}

	.empty-message {
		font-size: 1rem;
		color: var(--color-text-secondary);
		margin-bottom: var(--spacing-sm);
	}

	.empty-hint {
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
	}

	.command-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		width: 100%;
		padding: var(--spacing-md);
		background: transparent;
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-fast);
		text-align: left;
		color: var(--color-text-primary);
	}

	.command-item:hover,
	.command-item.selected {
		background: var(--color-surface-3);
		border-color: var(--color-brass);
	}

	.item-icon {
		font-size: 1.5rem;
		flex-shrink: 0;
	}

	.item-content {
		flex: 1;
		min-width: 0;
	}

	.item-title {
		font-family: var(--font-family-heading);
		font-size: 1rem;
		font-weight: 300;
		letter-spacing: 0.02em;
		margin-bottom: var(--spacing-xs);
	}

	.item-description {
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.item-type {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		padding: var(--spacing-xs) var(--spacing-sm);
		background: var(--color-surface-2);
		border-radius: var(--radius-sm);
		font-family: var(--font-family-mono);
	}

	.command-palette-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-md) var(--spacing-lg);
		border-top: 1px solid var(--color-border-default);
		background: var(--color-surface-1);
	}

	.shortcuts {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
	}

	.shortcuts kbd,
	.hint kbd {
		padding: 2px 6px;
		background: var(--color-surface-3);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		font-family: var(--font-family-mono);
		margin: 0 2px;
	}

	.hint {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
	}

	@media (max-width: 768px) {
		.command-palette-backdrop {
			padding-top: 10vh;
		}

		.command-palette-container {
			max-width: calc(100vw - var(--spacing-xl));
		}

		.command-palette-results {
			max-height: 300px;
		}
	}
</style>
