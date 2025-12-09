<script lang="ts">
  import { onMount } from 'svelte';
  import { skillRegistry } from '$lib/api/skillRegistry';
  import { tokenManager } from '$lib/api/auth';
  import { Panel, Button } from '$lib/components';

  let skillCount = 0;
  let isAuthenticated = false;
  let loading = true;

  onMount(async () => {
    try {
      const skills = await skillRegistry.getAllSkills();
      skillCount = skills.length;
      isAuthenticated = tokenManager.isAuthenticated();
    } catch (err) {
      console.error('Failed to load home data:', err);
    } finally {
      loading = false;
    }
  });
</script>

<div class="dashboard-container">
  <!-- Hero Section -->
  <div class="hero-section">
    <div class="hero-icon">⚒️</div>
    <h1 class="hero-title">
      <span class="text-gradient-brass">VibeForge</span> BDS
    </h1>
    <p class="hero-subtitle">Internal Agent-Powered Development Workbench</p>
    <p class="hero-description">
      Access to 120 AI-powered skills across ForgeAgents infrastructure
    </p>
  </div>

  <!-- Stats Grid -->
  <div class="stats-grid">
    <Panel variant="elevated" padding="lg">
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-content">
          <div class="stat-value">{loading ? '...' : skillCount}</div>
          <div class="stat-label">Skills Available</div>
        </div>
      </div>
    </Panel>

    <Panel variant="elevated" padding="lg">
      <div class="stat-card">
        <div class="stat-icon">{isAuthenticated ? '✅' : '⚠️'}</div>
        <div class="stat-content">
          <div class="stat-value">{isAuthenticated ? 'Connected' : 'Disconnected'}</div>
          <div class="stat-label">Status</div>
        </div>
      </div>
    </Panel>

    <Panel variant="elevated" padding="lg">
      <div class="stat-card">
        <div class="stat-icon">🔒</div>
        <div class="stat-content">
          <div class="stat-value">BDS Only</div>
          <div class="stat-label">Access Level</div>
        </div>
      </div>
    </Panel>
  </div>

  <!-- Quick Links -->
  <section class="features-section">
    <h2 class="section-title">Quick Links</h2>

    <div class="features-grid">
      <Panel variant="bordered" padding="lg">
        <a href="/library" class="feature-card">
          <div class="feature-icon">📚</div>
          <h3 class="feature-title">Skills Library</h3>
          <p class="feature-description">Browse and invoke all 120 AI skills</p>
          <div class="feature-action">
            <Button variant="outline" size="sm">View Library →</Button>
          </div>
        </a>
      </Panel>

      <Panel variant="bordered" padding="lg">
        <a href="/history" class="feature-card">
          <div class="feature-icon">📊</div>
          <h3 class="feature-title">History</h3>
          <p class="feature-description">View execution logs and session history</p>
          <div class="feature-action">
            <Button variant="outline" size="sm">View History →</Button>
          </div>
        </a>
      </Panel>

      <Panel variant="bordered" padding="lg">
        <a href="/settings" class="feature-card">
          <div class="feature-icon">⚙️</div>
          <h3 class="feature-title">Settings</h3>
          <p class="feature-description">Configure API keys and preferences</p>
          <div class="feature-action">
            <Button variant="outline" size="sm">Configure →</Button>
          </div>
        </a>
      </Panel>
    </div>
  </section>

  <!-- System Information -->
  <section class="info-section">
    <Panel title="System Information" variant="bordered" padding="lg">
      <ul class="info-list">
        <li>
          <strong>Backend:</strong> ForgeAgents 120-Skill API
        </li>
        <li>
          <strong>Orchestration:</strong> MAPO Multi-step Pipeline
        </li>
        <li>
          <strong>Model Routing:</strong> NeuroForge Champion Selection
        </li>
        <li>
          <strong>Data Storage:</strong> DataForge Persistence Layer
        </li>
        <li>
          <strong>Compliance:</strong> FORGE_GLOBAL_EXECUTION_CONTRACT v1.0
        </li>
      </ul>
    </Panel>
  </section>

  <!-- Version Info -->
  <div class="version-info">
    <p>VibeForge BDS v0.1.0 | Internal Use Only</p>
    <p class="copyright">© 2025 Boswell Digital Solutions LLC</p>
  </div>
</div>

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Dashboard Container
     ═══════════════════════════════════════════════════════════════════════ */

  .dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Hero Section
     ───────────────────────────────────────────────────────────────────── */

  .hero-section {
    text-align: center;
    padding: var(--spacing-3xl) 0 var(--spacing-2xl);
  }

  .hero-icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-lg);
    filter: drop-shadow(0 4px 12px rgba(193, 151, 69, 0.3));
  }

  .hero-title {
    font-family: var(--font-family-heading);
    font-size: 3.5rem;
    font-weight: 300;
    margin: 0 0 var(--spacing-md) 0;
    letter-spacing: 0.05em;
    color: var(--color-text-primary);
  }

  .hero-subtitle {
    font-size: 1.5rem;
    color: var(--color-text-secondary);
    margin: 0 0 var(--spacing-sm) 0;
    font-weight: 500;
  }

  .hero-description {
    font-size: 1.125rem;
    color: var(--color-text-tertiary);
    margin: 0;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Stats Grid
     ───────────────────────────────────────────────────────────────────── */

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-3xl);
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .stat-icon {
    font-size: 3rem;
    flex-shrink: 0;
  }

  .stat-content {
    flex: 1;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-brass);
    margin-bottom: var(--spacing-xs);
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Features Section
     ───────────────────────────────────────────────────────────────────── */

  .features-section {
    margin-bottom: var(--spacing-3xl);
  }

  .section-title {
    font-family: var(--font-family-heading);
    font-size: 2rem;
    font-weight: 300;
    margin: 0 0 var(--spacing-xl) 0;
    color: var(--color-text-primary);
    letter-spacing: 0.02em;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--spacing-lg);
  }

  .feature-card {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    height: 100%;
    transition: transform var(--transition-fast);
  }

  .feature-card:hover {
    transform: translateY(-4px);
  }

  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: var(--spacing-md);
  }

  .feature-title {
    font-family: var(--font-family-heading);
    font-size: 1.5rem;
    font-weight: 300;
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--color-brass);
    letter-spacing: 0.02em;
  }

  .feature-description {
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
    margin: 0 0 var(--spacing-lg) 0;
    line-height: 1.6;
    flex: 1;
  }

  .feature-action {
    margin-top: auto;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Info Section
     ───────────────────────────────────────────────────────────────────── */

  .info-section {
    margin-bottom: var(--spacing-3xl);
  }

  .info-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: var(--spacing-md);
  }

  .info-list li {
    padding: var(--spacing-md);
    background-color: var(--color-surface-3);
    border-radius: var(--radius-md);
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
    transition: background-color var(--transition-fast);
  }

  .info-list li:hover {
    background-color: var(--color-surface-elevated);
  }

  .info-list strong {
    color: var(--color-brass);
    font-weight: 600;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Version Info
     ───────────────────────────────────────────────────────────────────── */

  .version-info {
    text-align: center;
    padding: var(--spacing-xl) 0;
    border-top: 1px solid var(--color-border-subtle);
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
  }

  .version-info p {
    margin: 0 0 var(--spacing-xs) 0;
  }

  .copyright {
    font-size: 0.75rem;
    opacity: 0.8;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Responsive Design
     ───────────────────────────────────────────────────────────────────── */

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
    }

    .hero-description {
      font-size: 1rem;
    }

    .stats-grid,
    .features-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
