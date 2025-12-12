<script lang="ts">
  import { onMount } from 'svelte';
  import { Panel, Input, Select, Button, Badge, Alert } from '$lib/components';
  import VirtualList from '$lib/components/VirtualList.svelte';

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
  let searchQuery = $state('');
  let filterSection = $state('all');
  let filterStatus = $state('all');
  let sortBy = $state('recent');
  let expandedId: string | null = $state(null);

  // Virtual scrolling configuration
  const collapsedItemHeight = 100;
  const expandedItemHeight = 600; // Approximate height when expanded

  const sections = $derived(Array.from(new Set(history.map((entry) => entry.section))).sort());

  const sectionOptions = $derived([
    { value: 'all', label: 'All Sections' },
    ...sections.map((s) => ({ value: s, label: s }))
  ]);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'success', label: 'Success Only' },
    { value: 'error', label: 'Errors Only' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Skill Name' },
    { value: 'cost', label: 'Highest Cost' }
  ];

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

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.skillName.toLowerCase().includes(q) ||
          entry.section.toLowerCase().includes(q) ||
          entry.category.toLowerCase().includes(q)
      );
    }

    if (filterSection !== 'all') {
      filtered = filtered.filter((entry) => entry.section === filterSection);
    }

    if (filterStatus !== 'all') {
      const isSuccess = filterStatus === 'success';
      filtered = filtered.filter((entry) => entry.success === isSuccess);
    }

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
</script>

<div class="history-container">
  <div class="page-header">
    <div class="header-content">
      <h1 class="page-title">Execution History</h1>
      <p class="page-description">{filteredHistory.length} execution entries</p>
    </div>
    {#if history.length > 0}
      <Button variant="danger" on:click={clearHistory}>Clear All History</Button>
    {/if}
  </div>

  {#if history.length > 0}
    <Panel variant="bordered" padding="lg">
      <div class="filters-section">
        <Input
          type="search"
          bind:value={searchQuery}
          placeholder="Search by skill name, section, or category..."
          fullWidth
        />

        <div class="filter-row">
          <Select bind:value={filterSection} options={sectionOptions} fullWidth />
          <Select bind:value={filterStatus} options={statusOptions} fullWidth />
          <Select bind:value={sortBy} options={sortOptions} fullWidth />
        </div>
      </div>
    </Panel>
  {/if}

  {#if loading}
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading history...</p>
    </div>
  {:else if filteredHistory.length === 0}
    <Panel variant="elevated" padding="lg">
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <p class="empty-message">No execution history found</p>
        <p class="empty-hint">
          {searchQuery || filterSection !== 'all' || filterStatus !== 'all'
            ? 'Try adjusting your filters'
            : 'Execute skills to see them appear here'}
        </p>
      </div>
    </Panel>
  {:else}
    <div class="virtual-container">
      <VirtualList
        items={filteredHistory}
        itemHeight={collapsedItemHeight}
        height="calc(100vh - 400px)"
        gap={16}
      >
        {#snippet children({ item: entry, index })}
          <div class="history-item-wrapper">
            <Panel variant="bordered" padding="none">
              <button class="entry-header" onclick={() => toggleExpand(entry.id)}>
                <div class="entry-info">
                  <div class="entry-title">
                    <span class="skill-name">{entry.skillName}</span>
                    <Badge variant={entry.success ? 'success' : 'error'} size="sm">
                      {entry.success ? 'Success' : 'Error'}
                    </Badge>
                  </div>
                  <div class="entry-meta">
                    <span>{formatDate(entry.timestamp)}</span>
                    <span class="separator">•</span>
                    <Badge variant="default" size="sm">{entry.section}</Badge>
                    <span class="separator">•</span>
                    <Badge variant="default" size="sm">{entry.category}</Badge>
                    {#if entry.metadata.cost}
                      <span class="separator">•</span>
                      <Badge variant="accent" size="sm">{formatCost(entry.metadata.cost)}</Badge>
                    {/if}
                  </div>
                </div>
                <span class="expand-icon">{expandedId === entry.id ? '▼' : '▶'}</span>
              </button>

              {#if expandedId === entry.id}
                <div class="entry-details">
                  {#if entry.metadata}
                    <div class="details-section">
                      <h3 class="section-title">Metadata</h3>
                      <div class="metadata-grid">
                        {#if entry.metadata.sessionId}
                          <div class="meta-item">
                            <span class="meta-label">Session ID</span>
                            <code>{entry.metadata.sessionId}</code>
                          </div>
                        {/if}
                        {#if entry.metadata.model}
                          <div class="meta-item">
                            <span class="meta-label">Model</span>
                            <code>{entry.metadata.model}</code>
                          </div>
                        {/if}
                        {#if entry.metadata.tokensUsed}
                          <div class="meta-item">
                            <span class="meta-label">Tokens</span>
                            <code>{entry.metadata.tokensUsed}</code>
                          </div>
                        {/if}
                        {#if entry.metadata.latency}
                          <div class="meta-item">
                            <span class="meta-label">Latency</span>
                            <code>{formatLatency(entry.metadata.latency)}</code>
                          </div>
                        {/if}
                      </div>
                    </div>
                  {/if}

                  {#if Object.keys(entry.inputs).length > 0}
                    <div class="details-section">
                      <h3 class="section-title">Inputs</h3>
                      <pre class="code-block">{JSON.stringify(entry.inputs, null, 2)}</pre>
                    </div>
                  {/if}

                  <div class="details-section">
                    <h3 class="section-title">{entry.success ? 'Output' : 'Error'}</h3>
                    {#if entry.success}
                      <div class="output-box">{entry.output}</div>
                    {:else}
                      <Alert variant="error">{entry.error || 'Unknown error occurred'}</Alert>
                    {/if}
                  </div>

                  <div class="entry-actions">
                    <Button variant="danger" size="sm" on:click={() => deleteEntry(entry.id)}>
                      Delete Entry
                    </Button>
                  </div>
                </div>
              {/if}
            </Panel>
          </div>
        {/snippet}
      </VirtualList>
    </div>
  {/if}
</div>

<style>
  .history-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-lg);
  }

  .header-content {
    flex: 1;
  }

  .page-title {
    font-family: var(--font-family-heading);
    font-size: 2.5rem;
    font-weight: 300;
    color: var(--color-text-primary);
    margin: 0 0 var(--spacing-sm) 0;
    letter-spacing: 0.02em;
  }

  .page-description {
    font-size: 1.125rem;
    color: var(--color-text-tertiary);
    margin: 0;
  }

  .filters-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .filter-row {
    display: flex;
    gap: var(--spacing-md);
  }

  .loading-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-3xl) var(--spacing-xl);
    text-align: center;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--color-border-subtle);
    border-top-color: var(--color-brass);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .empty-icon {
    font-size: 4rem;
  }

  .empty-message {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .empty-hint {
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
    margin: 0;
  }

  .virtual-container {
    width: 100%;
  }

  .history-item-wrapper {
    width: 100%;
    height: 100%;
  }

  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-lg);
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: background-color var(--transition-fast);
  }

  .entry-header:hover {
    background-color: var(--color-surface-3);
  }

  .entry-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .entry-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .skill-name {
    font-family: var(--font-family-heading);
    font-size: 1.125rem;
    font-weight: 300;
    color: var(--color-text-primary);
    letter-spacing: 0.02em;
  }

  .entry-meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
  }

  .separator {
    color: var(--color-border-default);
  }

  .expand-icon {
    font-size: 1rem;
    color: var(--color-text-tertiary);
  }

  .entry-details {
    padding: 0 var(--spacing-lg) var(--spacing-lg);
    border-top: 1px solid var(--color-border-subtle);
  }

  .details-section {
    margin-top: var(--spacing-lg);
  }

  .section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 var(--spacing-md) 0;
  }

  .metadata-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .meta-label {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
  }

  code {
    font-family: var(--font-family-mono);
    font-size: 0.875rem;
    color: var(--color-text-primary);
  }

  .code-block {
    background-color: var(--color-surface-1);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    overflow-x: auto;
    font-family: var(--font-family-mono);
    font-size: 0.75rem;
    line-height: 1.5;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .output-box {
    background-color: var(--color-surface-3);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    color: var(--color-text-primary);
    white-space: pre-wrap;
    font-size: 0.875rem;
    line-height: 1.6;
    max-height: 400px;
    overflow-y: auto;
  }

  .entry-actions {
    margin-top: var(--spacing-lg);
    display: flex;
    gap: var(--spacing-md);
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg) 0;
  }

  @media (max-width: 768px) {
    .page-title {
      font-size: 2rem;
    }

    .filter-row {
      flex-direction: column;
    }

    .entry-meta {
      flex-wrap: wrap;
    }
  }
</style>
