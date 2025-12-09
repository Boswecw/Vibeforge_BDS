<script lang="ts">
  import { page } from '$app/stores';

  interface NavItem {
    label: string;
    href: string;
    icon?: string;
  }

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/', icon: '📊' },
    { label: 'Planning Agent', href: '/planning', icon: '📝' },
    { label: 'Execution Agent', href: '/execution', icon: '⚡' },
    { label: 'Evaluator Agent', href: '/evaluator', icon: '✓' },
    { label: 'Coordinator Agent', href: '/coordinator', icon: '🎯' },
    { label: 'Skill Library', href: '/library', icon: '📚' },
    { label: 'Agents', href: '/agents', icon: '🤖' },
    { label: 'Workflows', href: '/workflows', icon: '🔄' },
    { label: 'Testing Lab', href: '/testing', icon: '🧪' },
    { label: 'Models', href: '/models', icon: '🧠' },
    { label: 'Analytics', href: '/analytics', icon: '📈' },
    { label: 'History', href: '/history', icon: '📜' },
    { label: 'Architecture', href: '/architecture', icon: '🏗️' },
    { label: 'Settings', href: '/settings', icon: '⚙️' },
    { label: 'Admin', href: '/admin', icon: '👤' }
  ];

  $: currentPath = $page.url.pathname;

  function isActive(href: string): boolean {
    if (href === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(href);
  }
</script>

<!-- Sidebar Container -->
<aside class="sidebar">
  <!-- Logo Section -->
  <div class="sidebar-header">
    <h1 class="logo">
      <span class="logo-vibe">Vibe</span><span class="logo-forge">Forge</span>
    </h1>
    <p class="tagline">Building Design System</p>
  </div>

  <!-- Navigation -->
  <nav class="sidebar-nav">
    <ul class="nav-list">
      {#each navItems as item}
        <li class="nav-item">
          <a
            href={item.href}
            class="nav-link"
            class:active={isActive(item.href)}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            {#if item.icon}
              <span class="nav-icon">{item.icon}</span>
            {/if}
            <span class="nav-label">{item.label}</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <!-- Sidebar Footer -->
  <div class="sidebar-footer">
    <div class="version-info">
      <span class="version-label">Version</span>
      <span class="version-number">1.0.0</span>
    </div>
  </div>
</aside>

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Sidebar Styles
     ═══════════════════════════════════════════════════════════════════════ */

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background-color: var(--color-surface-2);
    border-right: 1px solid var(--color-border-subtle);
    display: flex;
    flex-direction: column;
    z-index: var(--z-fixed);
    overflow-y: auto;
  }

  /* Header Section */
  .sidebar-header {
    padding: var(--spacing-xl) var(--spacing-lg);
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .logo {
    font-family: var(--font-family-heading);
    font-size: 1.75rem;
    font-weight: 300;
    letter-spacing: 0.05em;
    margin: 0 0 var(--spacing-xs) 0;
  }

  .logo-vibe {
    color: var(--color-brass);
  }

  .logo-forge {
    color: var(--color-steel-blue);
  }

  .tagline {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  /* Navigation */
  .sidebar-nav {
    flex: 1;
    padding: var(--spacing-lg) 0;
    overflow-y: auto;
  }

  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-item {
    margin: 0;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md) var(--spacing-lg);
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: 0.9375rem;
    font-weight: 500;
    transition: all var(--transition-fast);
    position: relative;
  }

  .nav-link::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: var(--color-brass);
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  .nav-link:hover {
    background-color: var(--color-surface-3);
    color: var(--color-text-primary);
  }

  .nav-link.active {
    background-color: var(--color-surface-3);
    color: var(--color-brass);
  }

  .nav-link.active::before {
    opacity: 1;
  }

  .nav-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
    width: 1.5rem;
    text-align: center;
  }

  .nav-label {
    flex: 1;
  }

  /* Footer */
  .sidebar-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-border-subtle);
  }

  .version-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
  }

  .version-label {
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .version-number {
    color: var(--color-text-secondary);
    font-family: var(--font-family-mono);
  }

  /* Scrollbar styling for sidebar */
  .sidebar::-webkit-scrollbar {
    width: 6px;
  }

  .sidebar::-webkit-scrollbar-track {
    background: var(--color-surface-2);
  }

  .sidebar::-webkit-scrollbar-thumb {
    background: var(--color-border-subtle);
    border-radius: var(--radius-sm);
  }

  .sidebar::-webkit-scrollbar-thumb:hover {
    background: var(--color-border-default);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .sidebar {
      width: 240px;
      transform: translateX(-100%);
      transition: transform var(--transition-base);
    }
  }
</style>
