<script lang="ts">
  import { onMount } from 'svelte';
  import { tokenManager } from '$lib/api/auth';
  import { forgeAgentsClient } from '$lib/api/forgeAgentsClient';
  import { Panel, Input, Button, Alert, Badge, Select } from '$lib/components';

  let apiBaseUrl = 'http://localhost:3000';
  let apiTimeout = 30000;
  let isAuthenticated = false;
  let tokenExpiresAt: string | null = null;

  // Login form
  let showLoginForm = false;
  let loginEmail = '';
  let loginPassword = '';
  let loginError = '';
  let loginLoading = false;

  // Settings state
  let saveSuccess = false;
  let saveError = '';

  // Timeout options for select
  const timeoutOptions = [
    { value: 5000, label: '5 seconds' },
    { value: 10000, label: '10 seconds' },
    { value: 15000, label: '15 seconds' },
    { value: 30000, label: '30 seconds' },
    { value: 60000, label: '60 seconds' },
    { value: 120000, label: '120 seconds' }
  ];

  onMount(async () => {
    await tokenManager.initialize();
    isAuthenticated = tokenManager.isAuthenticated();

    // Load token expiry if authenticated
    if (isAuthenticated) {
      const expiresAt = localStorage.getItem('token_expires_at');
      if (expiresAt) {
        tokenExpiresAt = new Date(expiresAt).toLocaleString();
      }
    }

    // Load saved settings from localStorage
    const savedApiUrl = localStorage.getItem('api_base_url');
    if (savedApiUrl) apiBaseUrl = savedApiUrl;

    const savedTimeout = localStorage.getItem('api_timeout');
    if (savedTimeout) apiTimeout = parseInt(savedTimeout, 10);
  });

  async function handleLogin() {
    loginError = '';
    loginLoading = true;

    try {
      await forgeAgentsClient.login(loginEmail, loginPassword);
      isAuthenticated = true;
      showLoginForm = false;
      loginEmail = '';
      loginPassword = '';

      // Update token expiry display
      const expiresAt = localStorage.getItem('token_expires_at');
      if (expiresAt) {
        tokenExpiresAt = new Date(expiresAt).toLocaleString();
      }
    } catch (error: any) {
      loginError = error.message || 'Login failed';
    } finally {
      loginLoading = false;
    }
  }

  async function handleLogout() {
    try {
      await forgeAgentsClient.logout();
      isAuthenticated = false;
      tokenExpiresAt = null;
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  function saveSettings() {
    saveSuccess = false;
    saveError = '';

    try {
      localStorage.setItem('api_base_url', apiBaseUrl);
      localStorage.setItem('api_timeout', apiTimeout.toString());
      saveSuccess = true;

      // Clear success message after 3s
      setTimeout(() => {
        saveSuccess = false;
      }, 3000);
    } catch (error: any) {
      saveError = error.message || 'Failed to save settings';
    }
  }

  function resetSettings() {
    apiBaseUrl = 'http://localhost:3000';
    apiTimeout = 30000;
    localStorage.removeItem('api_base_url');
    localStorage.removeItem('api_timeout');
    saveSuccess = true;
    setTimeout(() => {
      saveSuccess = false;
    }, 3000);
  }
</script>

<div class="settings-container">
  <!-- Page Header -->
  <div class="page-header">
    <h1 class="page-title">Settings</h1>
    <p class="page-description">Configure your VibeForge_BDS application</p>
  </div>

  <!-- API Configuration Section -->
  <Panel title="API Configuration" subtitle="Configure the ForgeAgents API endpoint and connection settings" variant="bordered" padding="lg">
    <div class="form-section">
      <Input
        label="API Base URL"
        bind:value={apiBaseUrl}
        placeholder="http://localhost:3000"
        helperText="The base URL for the ForgeAgents 120-skill API"
        fullWidth
      />

      <Select
        label="Request Timeout"
        bind:value={apiTimeout}
        options={timeoutOptions}
        helperText="Maximum time to wait for API responses"
        fullWidth
      />

      <div class="button-group">
        <Button variant="primary" on:click={saveSettings}>Save Settings</Button>
        <Button variant="secondary" on:click={resetSettings}>Reset to Defaults</Button>
      </div>

      {#if saveSuccess}
        <Alert variant="success" dismissible on:dismiss={() => (saveSuccess = false)}>
          Settings saved successfully!
        </Alert>
      {/if}
      {#if saveError}
        <Alert variant="error" dismissible on:dismiss={() => (saveError = '')}>
          {saveError}
        </Alert>
      {/if}
    </div>
  </Panel>

  <!-- Authentication Section -->
  <Panel title="Authentication" subtitle="Manage your BDS credentials and session" variant="bordered" padding="lg">
    <div class="auth-section">
      {#if isAuthenticated}
        <div class="status-row">
          <div class="status-indicator">
            <Badge variant="success" dot>Connected</Badge>
          </div>
          {#if tokenExpiresAt}
            <p class="auth-info">Token expires: {tokenExpiresAt}</p>
          {/if}
        </div>

        <Button variant="danger" on:click={handleLogout}>Logout</Button>
      {:else}
        <div class="status-row">
          <Badge variant="error" dot>Disconnected</Badge>
        </div>

        {#if !showLoginForm}
          <Button variant="primary" on:click={() => (showLoginForm = true)}>
            Login to BDS
          </Button>
        {:else}
          <Panel variant="elevated" padding="lg">
            <div class="login-form">
              <Input
                label="Email"
                type="email"
                bind:value={loginEmail}
                placeholder="your@email.com"
                required
                fullWidth
              />

              <Input
                label="Password"
                type="password"
                bind:value={loginPassword}
                placeholder="••••••••"
                required
                fullWidth
              />

              {#if loginError}
                <Alert variant="error">{loginError}</Alert>
              {/if}

              <div class="button-group">
                <Button variant="primary" loading={loginLoading} on:click={handleLogin}>
                  Login
                </Button>
                <Button variant="ghost" on:click={() => (showLoginForm = false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Panel>
        {/if}
      {/if}
    </div>
  </Panel>

  <!-- About Section -->
  <Panel title="About" subtitle="System information and version details" variant="bordered" padding="lg">
    <div class="info-grid">
      <div class="info-card">
        <div class="info-label">Application</div>
        <div class="info-value">VibeForge_BDS</div>
      </div>
      <div class="info-card">
        <div class="info-label">Version</div>
        <div class="info-value">
          <Badge variant="accent">v0.1.0</Badge>
        </div>
      </div>
      <div class="info-card">
        <div class="info-label">Contract Version</div>
        <div class="info-value">FORGE_GLOBAL_EXECUTION_CONTRACT v1.0</div>
      </div>
      <div class="info-card">
        <div class="info-label">Access Level</div>
        <div class="info-value">
          <Badge variant="warning">BDS Only (Internal)</Badge>
        </div>
      </div>
      <div class="info-card">
        <div class="info-label">Total Skills</div>
        <div class="info-value">120 (45 PUBLIC + 75 BDS_ONLY)</div>
      </div>
      <div class="info-card">
        <div class="info-label">Backend</div>
        <div class="info-value">ForgeAgents 120-Skill API</div>
      </div>
    </div>
  </Panel>

  <!-- System Components Section -->
  <Panel title="System Components" subtitle="Integrated ForgeAgents infrastructure systems" variant="bordered" padding="lg">
    <div class="component-list">
      <div class="component-item">
        <Badge variant="info" size="sm">MAPO</Badge>
        <span class="component-desc">Multi-step orchestration pipeline</span>
      </div>
      <div class="component-item">
        <Badge variant="info" size="sm">NeuroForge</Badge>
        <span class="component-desc">Model routing and champion selection</span>
      </div>
      <div class="component-item">
        <Badge variant="info" size="sm">DataForge</Badge>
        <span class="component-desc">Data persistence layer</span>
      </div>
      <div class="component-item">
        <Badge variant="success" size="sm">Token Management</Badge>
        <span class="component-desc">Auto-refresh with 60s buffer</span>
      </div>
      <div class="component-item">
        <Badge variant="success" size="sm">Storage</Badge>
        <span class="component-desc">Tauri secure token storage</span>
      </div>
    </div>
  </Panel>
</div>

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Settings Container
     ═══════════════════════════════════════════════════════════════════════ */

  .settings-container {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  /* Page Header */
  .page-header {
    margin-bottom: var(--spacing-lg);
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

  /* Form Section */
  .form-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .button-group {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }

  /* Auth Section */
  .auth-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .status-row {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .auth-info {
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
    font-family: var(--font-family-mono);
    margin: 0;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  /* Info Grid */
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-md);
  }

  .info-card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background-color: var(--color-surface-3);
    border-radius: var(--radius-md);
    transition: background-color var(--transition-fast);
  }

  .info-card:hover {
    background-color: var(--color-surface-elevated);
  }

  .info-label {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .info-value {
    font-size: 0.9375rem;
    color: var(--color-text-primary);
    font-weight: 500;
  }

  /* Component List */
  .component-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .component-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--color-surface-3);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }

  .component-item:hover {
    background-color: var(--color-surface-elevated);
    transform: translateX(4px);
  }

  .component-desc {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .page-title {
      font-size: 2rem;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }

    .button-group {
      flex-direction: column;
    }

    .button-group :global(button) {
      width: 100%;
    }
  }
</style>
