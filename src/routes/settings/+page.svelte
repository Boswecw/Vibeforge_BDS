<script lang="ts">
	import { onMount } from 'svelte';
	import { tokenManager } from '$lib/api/auth';
	import { forgeAgentsClient } from '$lib/api/forgeAgentsClient';
	import { ErrorBoundary } from '$lib/components';

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

<ErrorBoundary>
<div class="settings-container">
	<div class="settings-header">
		<h1>Settings</h1>
		<p class="settings-subtitle">Configure your VibeForge_BDS application</p>
	</div>

	<!-- API Configuration Section -->
	<section class="settings-section">
		<h2>API Configuration</h2>
		<p class="section-description">
			Configure the ForgeAgents API endpoint and connection settings.
		</p>

		<div class="form-group">
			<label for="api-url">API Base URL</label>
			<input
				id="api-url"
				type="text"
				bind:value={apiBaseUrl}
				placeholder="http://localhost:3000"
				class="input"
			/>
			<span class="field-hint">The base URL for the ForgeAgents 120-skill API</span>
		</div>

		<div class="form-group">
			<label for="api-timeout">Request Timeout (ms)</label>
			<input
				id="api-timeout"
				type="number"
				bind:value={apiTimeout}
				min="5000"
				max="120000"
				step="1000"
				class="input"
			/>
			<span class="field-hint">Maximum time to wait for API responses (5-120 seconds)</span>
		</div>

		<div class="button-group">
			<button onclick={saveSettings} class="btn btn-primary">Save Settings</button>
			<button onclick={resetSettings} class="btn btn-secondary">Reset to Defaults</button>
		</div>

		{#if saveSuccess}
			<div class="alert alert-success">Settings saved successfully!</div>
		{/if}
		{#if saveError}
			<div class="alert alert-error">{saveError}</div>
		{/if}
	</section>

	<!-- Authentication Section -->
	<section class="settings-section">
		<h2>Authentication</h2>
		<p class="section-description">Manage your BDS credentials and session.</p>

		{#if isAuthenticated}
			<div class="auth-status">
				<div class="status-indicator status-connected">
					<span class="status-dot"></span>
					<span>Connected</span>
				</div>
				{#if tokenExpiresAt}
					<p class="auth-info">Token expires: {tokenExpiresAt}</p>
				{/if}
			</div>

			<button onclick={handleLogout} class="btn btn-danger">Logout</button>
		{:else}
			<div class="auth-status">
				<div class="status-indicator status-disconnected">
					<span class="status-dot"></span>
					<span>Disconnected</span>
				</div>
			</div>

			{#if !showLoginForm}
				<button onclick={() => (showLoginForm = true)} class="btn btn-primary"
					>Login to BDS</button
				>
			{:else}
				<div class="login-form">
					<div class="form-group">
						<label for="login-email">Email</label>
						<input
							id="login-email"
							type="email"
							bind:value={loginEmail}
							placeholder="your@email.com"
							class="input"
						/>
					</div>

					<div class="form-group">
						<label for="login-password">Password</label>
						<input
							id="login-password"
							type="password"
							bind:value={loginPassword}
							placeholder="••••••••"
							class="input"
						/>
					</div>

					{#if loginError}
						<div class="alert alert-error">{loginError}</div>
					{/if}

					<div class="button-group">
						<button onclick={handleLogin} disabled={loginLoading} class="btn btn-primary">
							{loginLoading ? 'Logging in...' : 'Login'}
						</button>
						<button onclick={() => (showLoginForm = false)} class="btn btn-secondary"
							>Cancel</button
						>
					</div>
				</div>
			{/if}
		{/if}
	</section>

	<!-- About Section -->
	<section class="settings-section">
		<h2>About</h2>
		<p class="section-description">System information and version details.</p>

		<div class="info-grid">
			<div class="info-item">
				<span class="info-label">Application</span>
				<span class="info-value">VibeForge_BDS</span>
			</div>
			<div class="info-item">
				<span class="info-label">Version</span>
				<span class="info-value">v0.1.0</span>
			</div>
			<div class="info-item">
				<span class="info-label">Contract Version</span>
				<span class="info-value">FORGE_GLOBAL_EXECUTION_CONTRACT v1.0</span>
			</div>
			<div class="info-item">
				<span class="info-label">Access Level</span>
				<span class="info-value">BDS Only (Internal)</span>
			</div>
			<div class="info-item">
				<span class="info-label">Total Skills</span>
				<span class="info-value">120 (45 PUBLIC + 75 BDS_ONLY)</span>
			</div>
			<div class="info-item">
				<span class="info-label">Backend</span>
				<span class="info-value">ForgeAgents 120-Skill API</span>
			</div>
		</div>
	</section>

	<!-- System Information Section -->
	<section class="settings-section">
		<h2>System Components</h2>
		<p class="section-description">Integrated ForgeAgents infrastructure systems.</p>

		<ul class="component-list">
			<li>
				<strong>MAPO:</strong> Multi-step orchestration pipeline
			</li>
			<li>
				<strong>NeuroForge:</strong> Model routing and champion selection
			</li>
			<li>
				<strong>DataForge:</strong> Data persistence layer
			</li>
			<li>
				<strong>Token Management:</strong> Auto-refresh with 60s buffer
			</li>
			<li>
				<strong>Storage:</strong> Tauri secure token storage
			</li>
		</ul>
	</section>
</div>
</ErrorBoundary>

<style>
	.settings-container {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
	}

	.settings-header {
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--accent, #fb923c);
		margin: 0 0 0.5rem 0;
	}

	.settings-subtitle {
		font-size: 1rem;
		color: var(--text-secondary, #9ca3af);
		margin: 0;
	}

	.settings-section {
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		border-radius: 8px;
		padding: 2rem;
		margin-bottom: 2rem;
	}

	.settings-section h2 {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary, #e0e0e0);
		margin: 0 0 0.5rem 0;
	}

	.section-description {
		font-size: 0.875rem;
		color: var(--text-secondary, #9ca3af);
		margin: 0 0 1.5rem 0;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #e0e0e0);
		margin-bottom: 0.5rem;
	}

	.input {
		width: 100%;
		padding: 0.75rem;
		background: var(--bg-primary, #0a0a0a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		color: var(--text-primary, #e0e0e0);
		font-size: 0.875rem;
		font-family: inherit;
	}

	.input:focus {
		outline: none;
		border-color: var(--accent, #fb923c);
	}

	.field-hint {
		display: block;
		font-size: 0.75rem;
		color: var(--text-tertiary, #6b7280);
		margin-top: 0.25rem;
	}

	.button-group {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background: var(--accent, #fb923c);
		color: #000;
	}

	.btn-primary:hover {
		background: #f97316;
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: var(--bg-tertiary, #2a2a2a);
		color: var(--text-primary, #e0e0e0);
		border: 1px solid var(--border, #333);
	}

	.btn-secondary:hover {
		background: var(--bg-primary, #0a0a0a);
	}

	.btn-danger {
		background: #dc2626;
		color: white;
	}

	.btn-danger:hover {
		background: #b91c1c;
	}

	.alert {
		padding: 0.75rem 1rem;
		border-radius: 4px;
		margin-top: 1rem;
		font-size: 0.875rem;
	}

	.alert-success {
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.3);
		color: #22c55e;
	}

	.alert-error {
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		color: #ef4444;
	}

	.auth-status {
		margin-bottom: 1.5rem;
	}

	.status-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.status-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.status-connected {
		color: #22c55e;
	}

	.status-connected .status-dot {
		background: #22c55e;
	}

	.status-disconnected {
		color: #ef4444;
	}

	.status-disconnected .status-dot {
		background: #ef4444;
	}

	.auth-info {
		font-size: 0.75rem;
		color: var(--text-tertiary, #6b7280);
		margin: 0;
	}

	.login-form {
		background: var(--bg-primary, #0a0a0a);
		padding: 1.5rem;
		border-radius: 4px;
		border: 1px solid var(--border, #333);
		margin-bottom: 1rem;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 1rem;
		background: var(--bg-primary, #0a0a0a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
	}

	.info-label {
		font-size: 0.75rem;
		color: var(--text-tertiary, #6b7280);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.info-value {
		font-size: 0.875rem;
		color: var(--text-primary, #e0e0e0);
		font-weight: 600;
	}

	.component-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.75rem;
	}

	.component-list li {
		padding: 1rem;
		background: var(--bg-primary, #0a0a0a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		font-size: 0.875rem;
		color: var(--text-secondary, #9ca3af);
	}

	.component-list strong {
		color: var(--accent, #fb923c);
		font-weight: 600;
	}
</style>
