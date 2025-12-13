<script lang="ts">
  import { page } from '$app/stores';

  // Props
  export let title: string = '';
  export let showSearch: boolean = true;
  export let showNotifications: boolean = true;
  export let showUser: boolean = true;

  // State
  let searchQuery = '';
  let notificationCount = 3;

  // Auto-generate title from route if not provided
  $: pageTitle = title || generateTitle($page.url.pathname);

  function generateTitle(pathname: string): string {
    if (pathname === '/') return 'Dashboard';
    const segments = pathname.split('/').filter(Boolean);
    return segments[segments.length - 1]
      ?.split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Dashboard';
  }

  function handleSearch(event: Event) {
    event.preventDefault();
    console.log('Search query:', searchQuery);
    // TODO: Implement search functionality
  }

  function handleNotifications() {
    console.log('Show notifications');
    // TODO: Implement notifications panel
  }

  function handleUserMenu() {
    console.log('Show user menu');
    // TODO: Implement user menu
  }
</script>

<!-- Header Container -->
<header class="header">
  <!-- Left Section: Title & Breadcrumbs -->
  <div class="header-left">
    <h2 class="header-title">{pageTitle}</h2>
  </div>

  <!-- Right Section: Actions -->
  <div class="header-right">
    <!-- Search Bar -->
    {#if showSearch}
      <form class="search-form" onsubmit={handleSearch}>
        <input
          type="text"
          class="search-input"
          placeholder="Search..."
          bind:value={searchQuery}
        />
        <button type="submit" class="search-button" aria-label="Search">
          <span class="search-icon">🔍</span>
        </button>
      </form>
    {/if}

    <!-- Notifications -->
    {#if showNotifications}
      <button
        class="icon-button"
        onclick={handleNotifications}
        aria-label="Notifications"
      >
        <span class="icon">🔔</span>
        {#if notificationCount > 0}
          <span class="badge-count">{notificationCount}</span>
        {/if}
      </button>
    {/if}

    <!-- User Menu -->
    {#if showUser}
      <button class="user-button" onclick={handleUserMenu} aria-label="User menu">
        <div class="avatar">
          <span class="avatar-text">U</span>
        </div>
        <span class="user-name">User</span>
      </button>
    {/if}
  </div>
</header>

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Header Styles
     ═══════════════════════════════════════════════════════════════════════ */

  .header {
    position: sticky;
    top: 0;
    left: 280px; /* Sidebar width */
    right: 0;
    height: 64px;
    background-color: var(--color-surface-1);
    border-bottom: 1px solid var(--color-border-subtle);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--spacing-xl);
    z-index: var(--z-sticky);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  /* Left Section */
  .header-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .header-title {
    font-family: var(--font-family-heading);
    font-size: 1.5rem;
    font-weight: 300;
    color: var(--color-text-primary);
    margin: 0;
    letter-spacing: 0.02em;
  }

  /* Right Section */
  .header-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  /* Search Form */
  .search-form {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-input {
    width: 280px;
    height: 40px;
    padding: 0 var(--spacing-md);
    padding-right: 40px; /* Space for button */
    background-color: var(--color-surface-2);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    font-family: var(--font-family-body);
    font-size: 0.875rem;
    transition: all var(--transition-fast);
  }

  .search-input::placeholder {
    color: var(--color-text-tertiary);
  }

  .search-input:focus {
    outline: none;
    border-color: var(--color-brass);
    background-color: var(--color-surface-3);
  }

  .search-button {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--color-text-tertiary);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .search-button:hover {
    background-color: var(--color-surface-3);
    color: var(--color-brass);
  }

  .search-icon {
    font-size: 1rem;
  }

  /* Icon Button */
  .icon-button {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-surface-2);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .icon-button:hover {
    background-color: var(--color-surface-3);
    border-color: var(--color-border-default);
    color: var(--color-text-primary);
  }

  .icon {
    font-size: 1.25rem;
  }

  .badge-count {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    background-color: var(--color-error);
    color: white;
    font-size: 0.6875rem;
    font-weight: 600;
    border-radius: var(--radius-full);
    border: 2px solid var(--color-surface-1);
  }

  /* User Button */
  .user-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    height: 40px;
    padding: 0 var(--spacing-md);
    background-color: var(--color-surface-2);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .user-button:hover {
    background-color: var(--color-surface-3);
    border-color: var(--color-border-default);
  }

  .avatar {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--color-brass) 0%, var(--color-gold) 100%);
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }

  .avatar-text {
    color: var(--color-text-inverse);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .user-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .header {
      left: 0;
      padding: 0 var(--spacing-md);
    }

    .search-input {
      width: 200px;
    }

    .user-name {
      display: none;
    }

    .search-form {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .header-title {
      font-size: 1.25rem;
    }

    .icon-button,
    .user-button {
      height: 36px;
      width: 36px;
      padding: 0;
      min-width: 36px;
    }

    .user-button {
      padding: 0;
      gap: 0;
    }

    .avatar {
      width: 28px;
      height: 28px;
    }
  }
</style>
