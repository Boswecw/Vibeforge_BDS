<script lang="ts">
	import { onMount } from 'svelte';
	import { skillRegistry } from '$lib/api/skillRegistry';
	import { forgeAgentsClient } from '$lib/api/forgeAgentsClient';
	import type { Skill } from '$lib/api/types';

	let skills: Skill[] = $state([]);
	let filteredSkills: Skill[] = $state([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Filter states
	let searchQuery = $state('');
	let selectedSection = $state<string>('all');
	let selectedCategory = $state<string>('all');
	let selectedAccess = $state<'all' | 'PUBLIC' | 'BDS_ONLY'>('all');

	// View modes
	let viewMode = $state<'grid' | 'list'>('grid');
	let sortBy = $state<'name' | 'section' | 'category'>('name');

	// Sections and categories (derived from skills)
	let sections = $derived.by(() => {
		const sectionSet = new Set(skills.map((s) => s.section));
		return ['all', ...Array.from(sectionSet)];
	});

	let categories = $derived.by(() => {
		const categorySet = new Set(skills.map((s) => s.category));
		return ['all', ...Array.from(categorySet)];
	});

	// Stats
	let stats = $derived.by(() => ({
		total: skills.length,
		public: skills.filter((s) => s.access === 'PUBLIC').length,
		bdsOnly: skills.filter((s) => s.access === 'BDS_ONLY').length,
		filtered: filteredSkills.length
	}));

	onMount(async () => {
		try {
			skills = await skillRegistry.getAllSkills();
			applyFilters();
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load skills';
			loading = false;
		}
	});

	// Filter logic
	function applyFilters() {
		let result = [...skills];

		// Search filter
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(s) =>
					s.name.toLowerCase().includes(q) ||
					s.description.toLowerCase().includes(q) ||
					s.tags.some((tag) => tag.toLowerCase().includes(q))
			);
		}

		// Section filter
		if (selectedSection !== 'all') {
			result = result.filter((s) => s.section === selectedSection);
		}

		// Category filter
		if (selectedCategory !== 'all') {
			result = result.filter((s) => s.category === selectedCategory);
		}

		// Access filter
		if (selectedAccess !== 'all') {
			result = result.filter((s) => s.access === selectedAccess);
		}

		// Sort
		result.sort((a, b) => {
			if (sortBy === 'name') return a.name.localeCompare(b.name);
			if (sortBy === 'section') return a.section.localeCompare(b.section);
			if (sortBy === 'category') return a.category.localeCompare(b.category);
			return 0;
		});

		filteredSkills = result;
	}

	// Reactive filtering
	$effect(() => {
		searchQuery;
		selectedSection;
		selectedCategory;
		selectedAccess;
		sortBy;
		applyFilters();
	});

	function clearFilters() {
		searchQuery = '';
		selectedSection = 'all';
		selectedCategory = 'all';
		selectedAccess = 'all';
	}
</script>

<div class="library-container">
	<!-- Header -->
	<div class="library-header">
		<div class="header-top">
			<h1>Skill Library</h1>
			<div class="stats">
				<span class="stat">
					<span class="stat-label">Total:</span>
					<span class="stat-value">{stats.total}</span>
				</span>
				<span class="stat">
					<span class="stat-label">Public:</span>
					<span class="stat-value public">{stats.public}</span>
				</span>
				<span class="stat">
					<span class="stat-label">BDS Only:</span>
					<span class="stat-value bds">{stats.bdsOnly}</span>
				</span>
			</div>
		</div>

		<!-- Filters -->
		<div class="filters">
			<div class="filter-row">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search skills..."
					class="search-input"
				/>

				<select bind:value={selectedSection} class="filter-select">
					<option value="all">All Sections</option>
					{#each sections.slice(1) as section}
						<option value={section}>{section}</option>
					{/each}
				</select>

				<select bind:value={selectedCategory} class="filter-select">
					<option value="all">All Categories</option>
					{#each categories.slice(1) as category}
						<option value={category}>{category}</option>
					{/each}
				</select>

				<select bind:value={selectedAccess} class="filter-select">
					<option value="all">All Access</option>
					<option value="PUBLIC">Public</option>
					<option value="BDS_ONLY">BDS Only</option>
				</select>

				<button onclick={clearFilters} class="btn-clear">Clear Filters</button>
			</div>

			<div class="controls-row">
				<div class="sort-controls">
					<label>Sort by:</label>
					<select bind:value={sortBy} class="sort-select">
						<option value="name">Name</option>
						<option value="section">Section</option>
						<option value="category">Category</option>
					</select>
				</div>

				<div class="view-controls">
					<button
						onclick={() => (viewMode = 'grid')}
						class:active={viewMode === 'grid'}
						class="btn-view"
					>
						Grid
					</button>
					<button
						onclick={() => (viewMode = 'list')}
						class:active={viewMode === 'list'}
						class="btn-view"
					>
						List
					</button>
				</div>

				<div class="result-count">
					{stats.filtered} skill{stats.filtered !== 1 ? 's' : ''}
				</div>
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="library-content">
		{#if loading}
			<div class="loading-state">
				<div class="spinner"></div>
				<p>Loading skills...</p>
			</div>
		{:else if error}
			<div class="error-state">
				<p class="error-message">{error}</p>
				<button onclick={() => window.location.reload()} class="btn-retry">Retry</button>
			</div>
		{:else if filteredSkills.length === 0}
			<div class="empty-state">
				<p>No skills found matching your filters.</p>
				<button onclick={clearFilters} class="btn-clear">Clear Filters</button>
			</div>
		{:else}
			<div class="skills-{viewMode}">
				{#each filteredSkills as skill (skill.id)}
					<a href="/library/{skill.id}" class="skill-card {viewMode}">
						<div class="skill-header">
							<h3 class="skill-name">{skill.name}</h3>
							<span class="skill-access {skill.access.toLowerCase()}">{skill.access}</span>
						</div>

						<p class="skill-description">{skill.description}</p>

						<div class="skill-meta">
							<span class="meta-item">
								<span class="meta-label">Section:</span>
								{skill.section}
							</span>
							<span class="meta-item">
								<span class="meta-label">Category:</span>
								{skill.category}
							</span>
						</div>

						<div class="skill-tags">
							{#each skill.tags.slice(0, 3) as tag}
								<span class="tag">{tag}</span>
							{/each}
							{#if skill.tags.length > 3}
								<span class="tag-more">+{skill.tags.length - 3}</span>
							{/if}
						</div>

						<div class="skill-cost">
							<span class="cost-label">Est. Cost:</span>
							<span class="cost-value"
								>${skill.estimatedCost.min.toFixed(3)} - ${skill.estimatedCost.max.toFixed(3)}</span
							>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.library-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		padding: 1rem;
		background: var(--bg-primary, #0a0a0a);
		color: var(--text-primary, #e0e0e0);
	}

	.library-header {
		margin-bottom: 1.5rem;
	}

	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0;
		color: var(--accent, #fb923c);
	}

	.stats {
		display: flex;
		gap: 1.5rem;
	}

	.stat {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.stat-label {
		color: var(--text-secondary, #9ca3af);
		font-size: 0.875rem;
	}

	.stat-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary, #e0e0e0);
	}

	.stat-value.public {
		color: #22c55e;
	}

	.stat-value.bds {
		color: #f59e0b;
	}

	.filters {
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		border-radius: 8px;
		padding: 1rem;
	}

	.filter-row,
	.controls-row {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.filter-row {
		margin-bottom: 0.75rem;
	}

	.search-input,
	.filter-select,
	.sort-select {
		padding: 0.5rem 0.75rem;
		background: var(--bg-tertiary, #0a0a0a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		color: var(--text-primary, #e0e0e0);
		font-size: 0.875rem;
	}

	.search-input {
		flex: 1;
		max-width: 400px;
	}

	.filter-select,
	.sort-select {
		min-width: 150px;
	}

	.btn-clear,
	.btn-view,
	.btn-retry {
		padding: 0.5rem 1rem;
		background: var(--bg-tertiary, #0a0a0a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		color: var(--text-primary, #e0e0e0);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-clear:hover,
	.btn-view:hover,
	.btn-retry:hover {
		background: var(--bg-secondary, #1a1a1a);
		border-color: var(--accent, #fb923c);
	}

	.btn-view.active {
		background: var(--accent, #fb923c);
		color: var(--bg-primary, #0a0a0a);
		border-color: var(--accent, #fb923c);
	}

	.sort-controls {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.sort-controls label {
		font-size: 0.875rem;
		color: var(--text-secondary, #9ca3af);
	}

	.view-controls {
		display: flex;
		gap: 0.25rem;
	}

	.result-count {
		margin-left: auto;
		font-size: 0.875rem;
		color: var(--text-secondary, #9ca3af);
	}

	.library-content {
		flex: 1;
		overflow-y: auto;
	}

	.loading-state,
	.error-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 4rem 2rem;
		text-align: center;
		color: var(--text-secondary, #9ca3af);
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--border, #333);
		border-top-color: var(--accent, #fb923c);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.error-message {
		color: #ef4444;
	}

	.skills-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1rem;
		padding: 1rem 0;
	}

	.skills-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem 0;
	}

	.skill-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		border-radius: 8px;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
	}

	.skill-card:hover {
		border-color: var(--accent, #fb923c);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(251, 146, 60, 0.1);
	}

	.skill-card.list {
		flex-direction: row;
		align-items: center;
		gap: 1.5rem;
	}

	.skill-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.skill-name {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
		color: var(--text-primary, #e0e0e0);
	}

	.skill-access {
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		border-radius: 4px;
		white-space: nowrap;
	}

	.skill-access.public {
		background: rgba(34, 197, 94, 0.2);
		color: #22c55e;
	}

	.skill-access.bds_only {
		background: rgba(245, 158, 11, 0.2);
		color: #f59e0b;
	}

	.skill-description {
		font-size: 0.875rem;
		color: var(--text-secondary, #9ca3af);
		line-height: 1.5;
		margin: 0;
	}

	.skill-meta {
		display: flex;
		gap: 1rem;
		font-size: 0.75rem;
	}

	.meta-item {
		color: var(--text-secondary, #9ca3af);
	}

	.meta-label {
		color: var(--text-tertiary, #6b7280);
	}

	.skill-tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tag {
		padding: 0.25rem 0.5rem;
		background: var(--bg-tertiary, #0a0a0a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		font-size: 0.75rem;
		color: var(--text-secondary, #9ca3af);
	}

	.tag-more {
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		color: var(--accent, #fb923c);
	}

	.skill-cost {
		display: flex;
		gap: 0.5rem;
		font-size: 0.75rem;
		padding-top: 0.5rem;
		border-top: 1px solid var(--border, #333);
	}

	.cost-label {
		color: var(--text-tertiary, #6b7280);
	}

	.cost-value {
		color: var(--accent, #fb923c);
		font-weight: 600;
	}
</style>
