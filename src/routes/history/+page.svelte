<script lang="ts">
	import { onMount } from 'svelte';

	interface HistoryEntry {
		id: string;
		timestamp: string;
		skillId: string;
		skillName: string;
		section: string;
		category: string;
		inputs: Record<string, any>;
		output: string;
		metadata: {
			sessionId?: string;
			tokensUsed?: number;
			cost?: number;
			latency?: number;
			model?: string;
		};
		success: boolean;
		error?: string;
	}

	let history: HistoryEntry[] = $state([]);
	let filteredHistory: HistoryEntry[] = $state([]);
	let loading = $state(true);

	// Filters
	let searchQuery = $state('');
	let filterSection = $state('all');
	let filterStatus = $state('all');
	let sortBy = $state('recent');

	// Pagination
	let currentPage = $state(1);
	let itemsPerPage = 20;
	let totalPages = $derived(Math.ceil(filteredHistory.length / itemsPerPage));
	let paginatedHistory = $derived(
		filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	// Expanded entry details
	let expandedId: string | null = $state(null);

	onMount(() => {
		loadHistory();
		loading = false;
	});

	function loadHistory() {
		const stored = localStorage.getItem('execution_history');
		if (stored) {
			try {
				history = JSON.parse(stored);
				applyFilters();
			} catch (error) {
				console.error('Failed to load history:', error);
				history = [];
			}
		}
	}

	function applyFilters() {
		let filtered = [...history];

		// Search filter
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(entry) =>
					entry.skillName.toLowerCase().includes(q) ||
					entry.section.toLowerCase().includes(q) ||
					entry.category.toLowerCase().includes(q)
			);
		}

		// Section filter
		if (filterSection !== 'all') {
			filtered = filtered.filter((entry) => entry.section === filterSection);
		}

		// Status filter
		if (filterStatus !== 'all') {
			const isSuccess = filterStatus === 'success';
			filtered = filtered.filter((entry) => entry.success === isSuccess);
		}

		// Sort
		filtered.sort((a, b) => {
			switch (sortBy) {
				case 'recent':
					return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
				case 'oldest':
					return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
				case 'name':
					return a.skillName.localeCompare(b.skillName);
				case 'cost':
					return (b.metadata.cost || 0) - (a.metadata.cost || 0);
				default:
					return 0;
			}
		});

		filteredHistory = filtered;
		currentPage = 1; // Reset to first page when filters change
	}

	$effect(() => {
		searchQuery;
		filterSection;
		filterStatus;
		sortBy;
		applyFilters();
	});

	function toggleExpand(id: string) {
		expandedId = expandedId === id ? null : id;
	}

	function clearHistory() {
		if (confirm('Are you sure you want to clear all execution history?')) {
			localStorage.removeItem('execution_history');
			history = [];
			filteredHistory = [];
		}
	}

	function deleteEntry(id: string) {
		history = history.filter((entry) => entry.id !== id);
		localStorage.setItem('execution_history', JSON.stringify(history));
		applyFilters();
	}

	function formatDate(timestamp: string): string {
		return new Date(timestamp).toLocaleString();
	}

	function formatCost(cost?: number): string {
		return cost !== undefined ? `$${cost.toFixed(4)}` : 'N/A';
	}

	function formatLatency(latency?: number): string {
		return latency !== undefined ? `${latency}ms` : 'N/A';
	}

	// Get unique sections for filter dropdown
	const sections = $derived(Array.from(new Set(history.map((entry) => entry.section))).sort());
</script>

<div class="history-container">
	<div class="history-header">
		<div>
			<h1>Execution History</h1>
			<p class="history-subtitle">
				View and manage your skill invocation history ({filteredHistory.length} entries)
			</p>
		</div>
		{#if history.length > 0}
			<button onclick={clearHistory} class="btn-clear-history">Clear All History</button>
		{/if}
	</div>

	<!-- Filters and Search -->
	{#if history.length > 0}
		<div class="controls">
			<div class="search-box">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search by skill name, section, or category..."
					class="search-input"
				/>
			</div>

			<div class="filters">
				<select bind:value={filterSection} class="filter-select">
					<option value="all">All Sections</option>
					{#each sections as section}
						<option value={section}>{section}</option>
					{/each}
				</select>

				<select bind:value={filterStatus} class="filter-select">
					<option value="all">All Status</option>
					<option value="success">Success Only</option>
					<option value="error">Errors Only</option>
				</select>

				<select bind:value={sortBy} class="filter-select">
					<option value="recent">Most Recent</option>
					<option value="oldest">Oldest First</option>
					<option value="name">Skill Name</option>
					<option value="cost">Highest Cost</option>
				</select>
			</div>
		</div>
	{/if}

	<!-- History List -->
	{#if loading}
		<div class="empty-state">
			<p>Loading history...</p>
		</div>
	{:else if paginatedHistory.length === 0}
		<div class="empty-state">
			<div class="empty-icon">📋</div>
			<p>No execution history found</p>
			{#if searchQuery || filterSection !== 'all' || filterStatus !== 'all'}
				<p class="empty-hint">Try adjusting your filters</p>
			{:else}
				<p class="empty-hint">Execute skills to see them appear here</p>
			{/if}
		</div>
	{:else}
		<div class="history-list">
			{#each paginatedHistory as entry (entry.id)}
				<div class="history-entry">
					<div
						class="entry-header"
						role="button"
						tabindex="0"
						onclick={() => toggleExpand(entry.id)}
						onkeydown={(e) => e.key === 'Enter' && toggleExpand(entry.id)}
					>
						<div class="entry-info">
							<div class="entry-title">
								<span class="skill-name">{entry.skillName}</span>
								<span class="entry-status" class:success={entry.success} class:error={!entry.success}>
									{entry.success ? '✓ Success' : '✗ Error'}
								</span>
							</div>
							<div class="entry-meta">
								<span class="meta-item">{formatDate(entry.timestamp)}</span>
								<span class="meta-separator">•</span>
								<span class="meta-item">{entry.section}</span>
								<span class="meta-separator">•</span>
								<span class="meta-item">{entry.category}</span>
								{#if entry.metadata.cost}
									<span class="meta-separator">•</span>
									<span class="meta-item">{formatCost(entry.metadata.cost)}</span>
								{/if}
							</div>
						</div>

						<button class="expand-btn" class:expanded={expandedId === entry.id}>
							{expandedId === entry.id ? '▼' : '▶'}
						</button>
					</div>

					{#if expandedId === entry.id}
						<div class="entry-details">
							<!-- Metadata -->
							{#if entry.metadata}
								<div class="details-section">
									<h3>Metadata</h3>
									<div class="metadata-grid">
										{#if entry.metadata.sessionId}
											<div class="meta-field">
												<span class="meta-label">Session ID:</span>
												<span class="meta-value">{entry.metadata.sessionId}</span>
											</div>
										{/if}
										{#if entry.metadata.model}
											<div class="meta-field">
												<span class="meta-label">Model:</span>
												<span class="meta-value">{entry.metadata.model}</span>
											</div>
										{/if}
										{#if entry.metadata.tokensUsed}
											<div class="meta-field">
												<span class="meta-label">Tokens:</span>
												<span class="meta-value">{entry.metadata.tokensUsed}</span>
											</div>
										{/if}
										{#if entry.metadata.latency}
											<div class="meta-field">
												<span class="meta-label">Latency:</span>
												<span class="meta-value">{formatLatency(entry.metadata.latency)}</span>
											</div>
										{/if}
									</div>
								</div>
							{/if}

							<!-- Inputs -->
							{#if Object.keys(entry.inputs).length > 0}
								<div class="details-section">
									<h3>Inputs</h3>
									<pre class="code-block">{JSON.stringify(entry.inputs, null, 2)}</pre>
								</div>
							{/if}

							<!-- Output -->
							<div class="details-section">
								<h3>{entry.success ? 'Output' : 'Error'}</h3>
								{#if entry.success}
									<div class="output-box">
										{entry.output}
									</div>
								{:else}
									<div class="error-box">
										{entry.error || 'Unknown error occurred'}
									</div>
								{/if}
							</div>

							<!-- Actions -->
							<div class="entry-actions">
								<button onclick={() => deleteEntry(entry.id)} class="btn-delete">
									Delete Entry
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="pagination">
				<button
					onclick={() => (currentPage = Math.max(1, currentPage - 1))}
					disabled={currentPage === 1}
					class="pagination-btn"
				>
					Previous
				</button>
				<span class="pagination-info">
					Page {currentPage} of {totalPages}
				</span>
				<button
					onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
					disabled={currentPage === totalPages}
					class="pagination-btn"
				>
					Next
				</button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.history-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.history-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--accent, #fb923c);
		margin: 0 0 0.5rem 0;
	}

	.history-subtitle {
		font-size: 1rem;
		color: var(--text-secondary, #9ca3af);
		margin: 0;
	}

	.btn-clear-history {
		padding: 0.75rem 1.5rem;
		background: #dc2626;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-clear-history:hover {
		background: #b91c1c;
	}

	.controls {
		margin-bottom: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.search-box {
		flex: 1;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 1rem;
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		color: var(--text-primary, #e0e0e0);
		font-size: 0.875rem;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--accent, #fb923c);
	}

	.filters {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.filter-select {
		padding: 0.75rem 1rem;
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		color: var(--text-primary, #e0e0e0);
		font-size: 0.875rem;
		cursor: pointer;
	}

	.history-list {
		display: grid;
		gap: 1rem;
	}

	.history-entry {
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		border-radius: 8px;
		overflow: hidden;
	}

	.entry-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	.entry-header:hover {
		background: var(--bg-tertiary, #2a2a2a);
	}

	.entry-info {
		flex: 1;
	}

	.entry-title {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.skill-name {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary, #e0e0e0);
	}

	.entry-status {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
	}

	.entry-status.success {
		background: rgba(34, 197, 94, 0.1);
		color: #22c55e;
	}

	.entry-status.error {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
	}

	.entry-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		color: var(--text-tertiary, #6b7280);
	}

	.meta-separator {
		color: var(--border, #333);
	}

	.expand-btn {
		padding: 0.5rem 1rem;
		background: none;
		border: none;
		color: var(--text-secondary, #9ca3af);
		cursor: pointer;
		font-size: 1rem;
		transition: transform 0.2s;
	}

	.expand-btn.expanded {
		transform: rotate(0deg);
	}

	.entry-details {
		padding: 0 1.5rem 1.5rem 1.5rem;
		border-top: 1px solid var(--border, #333);
	}

	.details-section {
		margin-top: 1.5rem;
	}

	.details-section h3 {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary, #9ca3af);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 0.75rem 0;
	}

	.metadata-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.meta-field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.meta-label {
		font-size: 0.75rem;
		color: var(--text-tertiary, #6b7280);
	}

	.meta-value {
		font-size: 0.875rem;
		color: var(--text-primary, #e0e0e0);
		font-family: monospace;
	}

	.code-block {
		background: var(--bg-primary, #0a0a0a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		padding: 1rem;
		overflow-x: auto;
		font-size: 0.75rem;
		line-height: 1.5;
		color: var(--text-secondary, #9ca3af);
		margin: 0;
	}

	.output-box {
		background: var(--bg-primary, #0a0a0a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		padding: 1rem;
		color: var(--text-primary, #e0e0e0);
		white-space: pre-wrap;
		font-size: 0.875rem;
		line-height: 1.6;
		max-height: 400px;
		overflow-y: auto;
	}

	.error-box {
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 4px;
		padding: 1rem;
		color: #ef4444;
		font-size: 0.875rem;
		line-height: 1.6;
	}

	.entry-actions {
		margin-top: 1.5rem;
		display: flex;
		gap: 1rem;
	}

	.btn-delete {
		padding: 0.5rem 1rem;
		background: none;
		border: 1px solid #dc2626;
		color: #dc2626;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-delete:hover {
		background: #dc2626;
		color: white;
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		color: var(--text-secondary, #9ca3af);
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.empty-state p {
		margin: 0.5rem 0;
	}

	.empty-hint {
		font-size: 0.875rem;
		color: var(--text-tertiary, #6b7280);
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		margin-top: 2rem;
		padding: 1.5rem;
	}

	.pagination-btn {
		padding: 0.5rem 1rem;
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		color: var(--text-primary, #e0e0e0);
		border-radius: 4px;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.pagination-btn:hover:not(:disabled) {
		background: var(--accent, #fb923c);
		color: #000;
	}

	.pagination-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.pagination-info {
		font-size: 0.875rem;
		color: var(--text-secondary, #9ca3af);
	}
</style>
