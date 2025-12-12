<script lang="ts">
  import { onMount } from 'svelte';
  import { filterStore } from '$lib/stores/filters.svelte';
  import { Button, Input, Badge, Panel, Modal } from '$lib/components';
  import { announceToScreenReader, generateAriaId } from '$lib/utils/accessibility';
  import type { FilterState } from '$lib/stores/filters.svelte';

  // Props
  interface Props {
    availableCategories?: string[];
    availableTags?: string[];
    availableAccessLevels?: string[];
    showDateRange?: boolean;
    placeholder?: string;
    onFilterChange?: (filters: FilterState) => void;
  }

  let {
    availableCategories = [],
    availableTags = [],
    availableAccessLevels = [],
    showDateRange = false,
    placeholder = 'Search... (use AND, OR, NOT for complex queries)',
    onFilterChange
  }: Props = $props();

  // Local state
  let showSuggestions = $state(false);
  let showFilters = $state(false);
  let showPresetModal = $state(false);
  let newPresetName = $state('');
  let searchInput: HTMLInputElement;
  let searchInputId = generateAriaId('search-input');
  let suggestionsId = generateAriaId('search-suggestions');

  // Derived state from filter store
  let filters = $derived(filterStore.filters);
  let suggestions = $derived(filterStore.suggestions);
  let activeFiltersCount = $derived(filterStore.activeFiltersCount);
  let hasActiveFilters = $derived(filterStore.hasActiveFilters);
  let savedPresets = $derived(filterStore.savedPresets);

  // Effect to notify parent of filter changes
  $effect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  });

  // Global keyboard shortcut (Cmd+F / Ctrl+F)
  onMount(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        searchInput?.focus();
        showFilters = true;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  /**
   * Handlers
   */
  function handleQueryInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    filterStore.setQuery(value);

    // Show suggestions if query is long enough
    if (value.length >= 2) {
      showSuggestions = true;
    } else {
      showSuggestions = false;
    }
  }

  function handleQueryFocus() {
    if (filters.query.length >= 2) {
      showSuggestions = true;
    }
  }

  function handleQueryBlur() {
    // Delay to allow clicking suggestions
    setTimeout(() => {
      showSuggestions = false;
    }, 200);
  }

  function selectSuggestion(text: string) {
    filterStore.setQuery(text);
    showSuggestions = false;
    searchInput?.focus();
  }

  function handleSavePreset() {
    if (newPresetName.trim()) {
      filterStore.savePreset(newPresetName);
      newPresetName = '';
      showPresetModal = false;
    }
  }

  function formatDate(date: Date | null): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  function parseDate(dateString: string): Date | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }
</script>

<!-- Advanced Search Component -->
<div class="advanced-search">
  <!-- Search Bar -->
  <div class="search-bar">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input
        bind:this={searchInput}
        type="text"
        class="search-input"
        value={filters.query}
        oninput={handleQueryInput}
        onfocus={handleQueryFocus}
        onblur={handleQueryBlur}
        {placeholder}
      />

      {#if filters.query}
        <button
          class="clear-query-btn"
          onclick={() => filterStore.clearFilter('query')}
          aria-label="Clear search"
        >
          ✕
        </button>
      {/if}

      <!-- Search Suggestions Dropdown -->
      {#if showSuggestions && suggestions.length > 0}
        <div class="suggestions-dropdown">
          {#each suggestions as suggestion}
            <button
              class="suggestion-item"
              onclick={() => selectSuggestion(suggestion.text)}
            >
              <span class="suggestion-icon">
                {#if suggestion.type === 'category'}📁
                {:else if suggestion.type === 'tag'}🏷️
                {:else if suggestion.type === 'skill'}⚡
                {:else}🔍{/if}
              </span>
              <span class="suggestion-text">{suggestion.text}</span>
              {#if suggestion.count}
                <span class="suggestion-count">({suggestion.count})</span>
              {/if}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <div class="search-actions">
      <Button
        variant={showFilters ? 'primary' : 'ghost'}
        size="sm"
        onclick={() => (showFilters = !showFilters)}
      >
        <span class="filter-icon">🔧</span>
        Filters
        {#if activeFiltersCount > 0}
          <Badge variant="info" size="sm">{activeFiltersCount}</Badge>
        {/if}
      </Button>

      {#if hasActiveFilters}
        <Button variant="ghost" size="sm" onclick={() => filterStore.clearAll()}>
          Clear All
        </Button>
      {/if}

      <Button
        variant="ghost"
        size="sm"
        onclick={() => (showPresetModal = true)}
        title="Save current filters as preset"
      >
        💾
      </Button>
    </div>
  </div>

  <!-- Active Filter Chips -->
  {#if hasActiveFilters}
    <div class="filter-chips">
      {#if filters.query}
        <div class="filter-chip">
          <span class="chip-label">Query:</span>
          <span class="chip-value">{filters.query}</span>
          <button
            class="chip-remove"
            onclick={() => filterStore.clearFilter('query')}
            aria-label="Remove query filter"
          >
            ✕
          </button>
        </div>
      {/if}

      {#each filters.categories as category}
        <div class="filter-chip category">
          <span class="chip-icon">📁</span>
          <span class="chip-value">{category}</span>
          <button
            class="chip-remove"
            onclick={() => filterStore.toggleCategory(category)}
            aria-label="Remove category filter"
          >
            ✕
          </button>
        </div>
      {/each}

      {#each filters.tags as tag}
        <div class="filter-chip tag">
          <span class="chip-icon">🏷️</span>
          <span class="chip-value">{tag}</span>
          <button
            class="chip-remove"
            onclick={() => filterStore.toggleTag(tag)}
            aria-label="Remove tag filter"
          >
            ✕
          </button>
        </div>
      {/each}

      {#each filters.accessLevels as level}
        <div class="filter-chip access">
          <span class="chip-icon">🔒</span>
          <span class="chip-value">{level}</span>
          <button
            class="chip-remove"
            onclick={() => filterStore.toggleAccessLevel(level)}
            aria-label="Remove access level filter"
          >
            ✕
          </button>
        </div>
      {/each}

      {#if filters.dateFrom}
        <div class="filter-chip date">
          <span class="chip-label">From:</span>
          <span class="chip-value">{formatDate(filters.dateFrom)}</span>
          <button
            class="chip-remove"
            onclick={() => filterStore.clearFilter('dateFrom')}
            aria-label="Remove date from filter"
          >
            ✕
          </button>
        </div>
      {/if}

      {#if filters.dateTo}
        <div class="filter-chip date">
          <span class="chip-label">To:</span>
          <span class="chip-value">{formatDate(filters.dateTo)}</span>
          <button
            class="chip-remove"
            onclick={() => filterStore.clearFilter('dateTo')}
            aria-label="Remove date to filter"
          >
            ✕
          </button>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Filter Panel (Expandable) -->
  {#if showFilters}
    <Panel variant="elevated" padding="md">
      <div class="filter-panel">
        <!-- Categories Filter -->
        {#if availableCategories.length > 0}
          <div class="filter-group">
            <h4 class="filter-group-title">Categories</h4>
            <div class="filter-options">
              {#each availableCategories as category}
                <label class="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onchange={() => filterStore.toggleCategory(category)}
                  />
                  <span class="option-label">{category}</span>
                </label>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Tags Filter -->
        {#if availableTags.length > 0}
          <div class="filter-group">
            <h4 class="filter-group-title">Tags</h4>
            <div class="filter-options">
              {#each availableTags.slice(0, 10) as tag}
                <label class="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.tags.includes(tag)}
                    onchange={() => filterStore.toggleTag(tag)}
                  />
                  <span class="option-label">{tag}</span>
                </label>
              {/each}
              {#if availableTags.length > 10}
                <span class="more-options">+{availableTags.length - 10} more...</span>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Access Levels Filter -->
        {#if availableAccessLevels.length > 0}
          <div class="filter-group">
            <h4 class="filter-group-title">Access Levels</h4>
            <div class="filter-options">
              {#each availableAccessLevels as level}
                <label class="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.accessLevels.includes(level)}
                    onchange={() => filterStore.toggleAccessLevel(level)}
                  />
                  <span class="option-label">{level}</span>
                </label>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Date Range Filter -->
        {#if showDateRange}
          <div class="filter-group">
            <h4 class="filter-group-title">Date Range</h4>
            <div class="date-range">
              <div class="date-input-group">
                <label for="date-from">From:</label>
                <input
                  id="date-from"
                  type="date"
                  class="date-input"
                  value={formatDate(filters.dateFrom)}
                  onchange={(e) => {
                    const date = parseDate((e.target as HTMLInputElement).value);
                    filterStore.setDateRange(date, filters.dateTo);
                  }}
                />
              </div>

              <div class="date-input-group">
                <label for="date-to">To:</label>
                <input
                  id="date-to"
                  type="date"
                  class="date-input"
                  value={formatDate(filters.dateTo)}
                  onchange={(e) => {
                    const date = parseDate((e.target as HTMLInputElement).value);
                    filterStore.setDateRange(filters.dateFrom, date);
                  }}
                />
              </div>
            </div>
          </div>
        {/if}

        <!-- Sort Options -->
        <div class="filter-group">
          <h4 class="filter-group-title">Sort By</h4>
          <div class="sort-options">
            <select
              class="sort-select"
              value={filters.sortBy}
              onchange={(e) => {
                const sortBy = (e.target as HTMLSelectElement).value as FilterState['sortBy'];
                filterStore.setSort(sortBy, filters.sortOrder);
              }}
            >
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="usage">Usage</option>
              <option value="rating">Rating</option>
            </select>

            <button
              class="sort-order-btn"
              onclick={() => {
                const newOrder = filters.sortOrder === 'asc' ? 'desc' : 'asc';
                filterStore.setSort(filters.sortBy, newOrder);
              }}
              title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <!-- Saved Presets -->
        {#if savedPresets.length > 0}
          <div class="filter-group">
            <h4 class="filter-group-title">Saved Presets</h4>
            <div class="preset-list">
              {#each savedPresets as preset}
                <div class="preset-item">
                  <button
                    class="preset-load-btn"
                    onclick={() => filterStore.loadPreset(preset.id)}
                  >
                    📋 {preset.name}
                  </button>
                  <button
                    class="preset-delete-btn"
                    onclick={() => filterStore.deletePreset(preset.id)}
                    title="Delete preset"
                  >
                    🗑️
                  </button>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </Panel>
  {/if}
</div>

<!-- Save Preset Modal -->
{#if showPresetModal}
  <Modal
    title="Save Filter Preset"
    open={showPresetModal}
    onClose={() => { showPresetModal = false; newPresetName = ''; }}
  >
    <div class="preset-modal">
      <p>Save the current filter settings as a reusable preset.</p>

      <Input
        label="Preset Name"
        bind:value={newPresetName}
        placeholder="e.g., My Favorite Filters"
        fullWidth
      />

      <div class="modal-actions">
        <Button variant="ghost" onclick={() => { showPresetModal = false; newPresetName = ''; }}>
          Cancel
        </Button>
        <Button variant="primary" onclick={handleSavePreset} disabled={!newPresetName.trim()}>
          Save Preset
        </Button>
      </div>
    </div>
  </Modal>
{/if}

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Advanced Search Component
     ═══════════════════════════════════════════════════════════════════════ */

  .advanced-search {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  /* Search Bar */
  .search-bar {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
  }

  .search-input-wrapper {
    position: relative;
    flex: 1;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.125rem;
    opacity: 0.6;
  }

  .search-input {
    width: 100%;
    padding: 12px 40px 12px 40px;
    font-size: 0.9375rem;
    background: var(--color-midnight-light);
    border: 1px solid var(--color-brass-dark);
    border-radius: 8px;
    color: var(--color-pearl);
    transition: all 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--color-brass);
    box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.1);
  }

  .clear-query-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--color-pearl-dark);
    cursor: pointer;
    padding: 4px;
    font-size: 1.125rem;
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  .clear-query-btn:hover {
    opacity: 1;
  }

  .search-actions {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
  }

  .filter-icon {
    margin-right: 4px;
  }

  /* Search Suggestions Dropdown */
  .suggestions-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: var(--color-midnight);
    border: 1px solid var(--color-brass);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
  }

  .suggestion-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    background: none;
    border: none;
    color: var(--color-pearl);
    text-align: left;
    cursor: pointer;
    transition: background 0.2s;
    font-size: 0.9375rem;
  }

  .suggestion-item:hover {
    background: rgba(184, 134, 11, 0.1);
  }

  .suggestion-icon {
    font-size: 1rem;
  }

  .suggestion-text {
    flex: 1;
  }

  .suggestion-count {
    font-size: 0.8125rem;
    opacity: 0.6;
  }

  /* Filter Chips */
  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .filter-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: var(--color-midnight-light);
    border: 1px solid var(--color-brass-dark);
    border-radius: 16px;
    font-size: 0.8125rem;
    color: var(--color-pearl);
  }

  .filter-chip.category {
    border-color: var(--color-info);
    background: rgba(90, 200, 250, 0.1);
  }

  .filter-chip.tag {
    border-color: var(--color-success);
    background: rgba(52, 199, 89, 0.1);
  }

  .filter-chip.access {
    border-color: var(--color-warning);
    background: rgba(255, 204, 0, 0.1);
  }

  .filter-chip.date {
    border-color: var(--color-brass);
  }

  .chip-icon {
    font-size: 0.875rem;
  }

  .chip-label {
    font-weight: 500;
    opacity: 0.7;
  }

  .chip-value {
    font-weight: 500;
  }

  .chip-remove {
    background: none;
    border: none;
    color: var(--color-pearl);
    cursor: pointer;
    padding: 0;
    margin-left: 4px;
    opacity: 0.6;
    transition: opacity 0.2s;
    font-size: 1rem;
  }

  .chip-remove:hover {
    opacity: 1;
  }

  /* Filter Panel */
  .filter-panel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-lg);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .filter-group-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-brass);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
  }

  .filter-options {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    cursor: pointer;
  }

  .filter-option input[type="checkbox"] {
    cursor: pointer;
  }

  .option-label {
    font-size: 0.9375rem;
    color: var(--color-pearl);
  }

  .more-options {
    font-size: 0.8125rem;
    color: var(--color-pearl-dark);
    font-style: italic;
  }

  /* Date Range */
  .date-range {
    display: flex;
    gap: var(--spacing-md);
  }

  .date-input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .date-input-group label {
    font-size: 0.8125rem;
    color: var(--color-pearl-dark);
  }

  .date-input {
    padding: 8px 12px;
    font-size: 0.875rem;
    background: var(--color-midnight);
    border: 1px solid var(--color-brass-dark);
    border-radius: 6px;
    color: var(--color-pearl);
  }

  .date-input:focus {
    outline: none;
    border-color: var(--color-brass);
  }

  /* Sort Options */
  .sort-options {
    display: flex;
    gap: var(--spacing-sm);
  }

  .sort-select {
    flex: 1;
    padding: 8px 12px;
    font-size: 0.875rem;
    background: var(--color-midnight);
    border: 1px solid var(--color-brass-dark);
    border-radius: 6px;
    color: var(--color-pearl);
    cursor: pointer;
  }

  .sort-select:focus {
    outline: none;
    border-color: var(--color-brass);
  }

  .sort-order-btn {
    padding: 8px 16px;
    background: var(--color-midnight);
    border: 1px solid var(--color-brass-dark);
    border-radius: 6px;
    color: var(--color-pearl);
    cursor: pointer;
    font-size: 1.125rem;
    transition: all 0.2s;
  }

  .sort-order-btn:hover {
    border-color: var(--color-brass);
    background: rgba(184, 134, 11, 0.1);
  }

  /* Preset List */
  .preset-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .preset-item {
    display: flex;
    gap: var(--spacing-sm);
  }

  .preset-load-btn {
    flex: 1;
    padding: 8px 12px;
    background: var(--color-midnight);
    border: 1px solid var(--color-brass-dark);
    border-radius: 6px;
    color: var(--color-pearl);
    cursor: pointer;
    text-align: left;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .preset-load-btn:hover {
    border-color: var(--color-brass);
    background: rgba(184, 134, 11, 0.1);
  }

  .preset-delete-btn {
    padding: 8px 12px;
    background: none;
    border: 1px solid transparent;
    color: var(--color-error);
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
    border-radius: 6px;
  }

  .preset-delete-btn:hover {
    border-color: var(--color-error);
    background: rgba(255, 59, 48, 0.1);
  }

  /* Preset Modal */
  .preset-modal {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .search-bar {
      flex-direction: column;
      align-items: stretch;
    }

    .search-actions {
      justify-content: space-between;
    }

    .filter-panel {
      grid-template-columns: 1fr;
    }

    .date-range {
      flex-direction: column;
    }
  }
</style>
