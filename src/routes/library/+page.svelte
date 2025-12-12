<script lang="ts">
  import { onMount } from 'svelte';
  import { skillRegistry } from '$lib/api/skillRegistry';
  import type { Skill } from '$lib/api/types';
  import { Panel, Input, Select, Button, Badge, Alert, Pagination } from '$lib/components';
  import { debounce } from '$lib/utils';

  let skills: Skill[] = $state([]);
  let paginatedSkills: Skill[] = $state([]);
  let filteredSkills: Skill[] = $state([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  // Filter states
  let searchQuery = $state('');
  let debouncedSearchQuery = $state('');
  let selectedSection = $state<string>('all');
  let selectedCategory = $state<string>('all');
  let selectedAccess = $state<'all' | 'PUBLIC' | 'BDS_ONLY'>('all');

  // Pagination
  let currentPage = $state(1);
  const itemsPerPage = 50;

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

  // Dropdown options
  let sectionOptions = $derived(sections.map((s) => ({
    value: s,
    label: s === 'all' ? 'All Sections' : s
  })));

  let categoryOptions = $derived(categories.map((c) => ({
    value: c,
    label: c === 'all' ? 'All Categories' : c
  })));

  const accessOptions = [
    { value: 'all', label: 'All Access' },
    { value: 'PUBLIC', label: 'Public' },
    { value: 'BDS_ONLY', label: 'BDS Only' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'section', label: 'Section' },
    { value: 'category', label: 'Category' }
  ];

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

  // Debounced search handler
  const debouncedSearch = debounce((query: string) => {
    debouncedSearchQuery = query;
  }, 300);

  // Filter logic
  function applyFilters() {
    let result = [...skills];

    // Search filter
    if (debouncedSearchQuery.trim()) {
      const q = debouncedSearchQuery.toLowerCase();
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

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    paginatedSkills = result.slice(startIndex, endIndex);
  }

  // Reactive filtering
  $effect(() => {
    debouncedSearchQuery;
    selectedSection;
    selectedCategory;
    selectedAccess;
    sortBy;
    currentPage;
    applyFilters();
  });

  // Watch search query and debounce it
  $effect(() => {
    debouncedSearch(searchQuery);
  });

  function clearFilters() {
    searchQuery = '';
    debouncedSearchQuery = '';
    selectedSection = 'all';
    selectedCategory = 'all';
    selectedAccess = 'all';
    currentPage = 1;
  }

  function handlePageChange(page: number) {
    currentPage = page;
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<div class="library-container">
  <!-- Page Header -->
  <div class="page-header">
    <div class="header-content">
      <h1 class="page-title">Skill Library</h1>
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-value">{stats.total}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item">
          <span class="stat-value success">{stats.public}</span>
          <span class="stat-label">Public</span>
        </div>
        <div class="stat-item">
          <span class="stat-value warning">{stats.bdsOnly}</span>
          <span class="stat-label">BDS Only</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Filters Panel -->
  <Panel variant="bordered" padding="lg">
    <div class="filters-section">
      <!-- Search and Dropdowns Row -->
      <div class="filter-row">
        <Input
          type="search"
          bind:value={searchQuery}
          placeholder="Search skills by name, description, or tags..."
          fullWidth
        />
      </div>

      <div class="filter-row">
        <Select
          bind:value={selectedSection}
          options={sectionOptions}
          placeholder="All Sections"
          fullWidth
        />
        <Select
          bind:value={selectedCategory}
          options={categoryOptions}
          placeholder="All Categories"
          fullWidth
        />
        <Select
          bind:value={selectedAccess}
          options={accessOptions}
          placeholder="All Access"
          fullWidth
        />
        <Button variant="secondary" on:click={clearFilters}>Clear</Button>
      </div>

      <!-- Controls Row -->
      <div class="controls-row">
        <div class="sort-section">
          <Select bind:value={sortBy} options={sortOptions} />
        </div>

        <div class="view-section">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            on:click={() => (viewMode = 'grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            on:click={() => (viewMode = 'list')}
          >
            List
          </Button>
        </div>

        <div class="result-count">
          <Badge variant="default">{stats.filtered} skills</Badge>
        </div>
      </div>
    </div>
  </Panel>

  <!-- Content -->
  <div class="library-content">
    {#if loading}
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading skills...</p>
      </div>
    {:else if error}
      <Alert variant="error" title="Failed to Load Skills">
        {error}
      </Alert>
    {:else if filteredSkills.length === 0}
      <Panel variant="elevated" padding="lg">
        <div class="empty-state">
          <p class="empty-message">No skills found matching your filters.</p>
          <Button variant="primary" on:click={clearFilters}>Clear Filters</Button>
        </div>
      </Panel>
    {:else}
      <div class="skills-{viewMode}">
        {#each paginatedSkills as skill (skill.id)}
          <a href="/library/{skill.id}" class="skill-link">
            <Panel variant="bordered" padding="lg">
              <div class="skill-header">
                <h3 class="skill-name">{skill.name}</h3>
                <Badge
                  variant={skill.access === 'PUBLIC' ? 'success' : 'warning'}
                  size="sm"
                >
                  {skill.access}
                </Badge>
              </div>

              <p class="skill-description">{skill.description}</p>

              <div class="skill-meta">
                <div class="meta-item">
                  <span class="meta-label">Section:</span>
                  <Badge variant="default" size="sm">{skill.section}</Badge>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Category:</span>
                  <Badge variant="default" size="sm">{skill.category}</Badge>
                </div>
              </div>

              <div class="skill-tags">
                {#each skill.tags.slice(0, 4) as tag}
                  <Badge variant="info" size="sm" outline>{tag}</Badge>
                {/each}
                {#if skill.tags.length > 4}
                  <span class="tag-more">+{skill.tags.length - 4}</span>
                {/if}
              </div>

              <div class="skill-footer">
                <div class="cost-info">
                  <span class="cost-label">Est. Cost:</span>
                  <Badge variant="accent" size="sm">
                    ${skill.estimatedCost.min.toFixed(3)} - ${skill.estimatedCost.max.toFixed(3)}
                  </Badge>
                </div>
              </div>
            </Panel>
          </a>
        {/each}

      <!-- Pagination -->
      {#if filteredSkills.length > itemsPerPage}
        <Pagination
          bind:currentPage
          totalItems={filteredSkills.length}
          {itemsPerPage}
          onPageChange={handlePageChange}
        />
      {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Library Container
     ═══════════════════════════════════════════════════════════════════════ */

  .library-container {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  /* Page Header */
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
    margin: 0 0 var(--spacing-lg) 0;
    letter-spacing: 0.02em;
  }

  .stats-row {
    display: flex;
    gap: var(--spacing-xl);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-text-primary);
    font-family: var(--font-family-mono);
  }

  .stat-value.success {
    color: var(--color-success);
  }

  .stat-value.warning {
    color: var(--color-warning);
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Filters Section */
  .filters-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .filter-row {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
  }

  .controls-row {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
  }

  .sort-section {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
  }

  .view-section {
    display: flex;
    gap: var(--spacing-xs);
    margin-left: auto;
  }

  .result-count {
    margin-left: var(--spacing-md);
  }

  /* Library Content */
  .library-content {
    flex: 1;
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

  .empty-message {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  /* Skills Grid */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: var(--spacing-lg);
  }

  .skills-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .skill-link {
    text-decoration: none;
    color: inherit;
  }

  .skill-link :global(.panel) {
    height: 100%;
    transition: all var(--transition-fast);
  }

  .skill-link:hover :global(.panel) {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-brass);
  }

  .skill-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  .skill-name {
    font-family: var(--font-family-heading);
    font-size: 1.25rem;
    font-weight: 300;
    color: var(--color-text-primary);
    margin: 0;
    letter-spacing: 0.02em;
  }

  .skill-description {
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0 0 var(--spacing-md) 0;
  }

  .skill-meta {
    display: flex;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: 0.875rem;
  }

  .meta-label {
    color: var(--color-text-tertiary);
  }

  .skill-tags {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
    margin-bottom: var(--spacing-md);
  }

  .tag-more {
    font-size: 0.75rem;
    color: var(--color-brass);
    font-weight: 500;
  }

  .skill-footer {
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border-subtle);
    margin-top: auto;
  }

  .cost-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.875rem;
  }

  .cost-label {
    color: var(--color-text-tertiary);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .page-title {
      font-size: 2rem;
    }

    .stats-row {
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .filter-row,
    .controls-row {
      flex-direction: column;
      align-items: stretch;
    }

    .view-section {
      margin-left: 0;
    }

    .skills-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
