<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';
  import { Sidebar, Header, ErrorBoundary, ErrorNotifications } from '$lib/components';
  import OfflineBanner from '$lib/components/OfflineBanner.svelte';
  import UpdateBanner from '$lib/components/UpdateBanner.svelte';
  import { registerServiceWorker, setupOnlineOfflineListeners } from '$lib/utils/serviceWorker';

  // Show error details in development mode
  const showErrorDetails = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  // Register service worker on mount (production only)
  onMount(() => {
    if (import.meta.env.PROD) {
      registerServiceWorker();
    }

    // Setup online/offline listeners
    setupOnlineOfflineListeners(
      () => console.log('App is now online'),
      () => console.log('App is now offline')
    );
  });
</script>

<!-- VibeForge_BDS Layout Structure -->
<ErrorBoundary showDetails={showErrorDetails}>
  <!-- Update Banner (new version available) -->
  <UpdateBanner />

  <!-- Offline Banner -->
  <OfflineBanner />

  <div class="app-layout">
    <!-- Fixed Sidebar (280px) -->
    <Sidebar />

    <!-- Main Content Area -->
    <div class="app-content">
      <!-- Sticky Header -->
      <Header />

      <!-- Page Content -->
      <main class="main-content">
        <slot />
      </main>
    </div>

    <!-- Global Error Notifications -->
    <ErrorNotifications />
  </div>
</ErrorBoundary>

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Application Layout
     ═══════════════════════════════════════════════════════════════════════ */

  .app-layout {
    display: flex;
    min-height: 100vh;
    background-color: var(--color-midnight);
  }

  .app-content {
    flex: 1;
    margin-left: 280px; /* Sidebar width */
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    padding: var(--spacing-xl);
    overflow-x: hidden;
  }

  /* Responsive Layout */
  @media (max-width: 768px) {
    .app-content {
      margin-left: 0;
    }

    .main-content {
      padding: var(--spacing-md);
    }
  }
</style>
