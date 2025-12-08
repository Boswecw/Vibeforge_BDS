<script lang="ts">
	import { onMount } from 'svelte';
	import { skillRegistry } from '$lib/api/skillRegistry';
	import { tokenManager } from '$lib/api/auth';

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

<div class="home-container">
	<div class="hero-section">
		<div class="hero-icon">⚒️</div>
		<h1>VibeForge BDS</h1>
		<p class="hero-subtitle">Internal Agent-Powered Development Workbench</p>
		<p class="hero-description">
			Access to 120 AI-powered skills across ForgeAgents infrastructure
		</p>
	</div>

	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-icon">📚</div>
			<div class="stat-content">
				<div class="stat-value">{loading ? '...' : skillCount}</div>
				<div class="stat-label">Skills Available</div>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon">{isAuthenticated ? '✅' : '⚠️'}</div>
			<div class="stat-content">
				<div class="stat-value">{isAuthenticated ? 'Connected' : 'Disconnected'}</div>
				<div class="stat-label">Status</div>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon">🔒</div>
			<div class="stat-content">
				<div class="stat-value">BDS Only</div>
				<div class="stat-label">Access Level</div>
			</div>
		</div>
	</div>

	<div class="features-section">
		<h2>Quick Links</h2>

		<div class="features-grid">
			<a href="/library" class="feature-card">
				<div class="feature-icon">📚</div>
				<h3>Skills Library</h3>
				<p>Browse and invoke all 120 AI skills</p>
			</a>

			<a href="/history" class="feature-card">
				<div class="feature-icon">📊</div>
				<h3>History</h3>
				<p>View execution logs and session history</p>
			</a>

			<a href="/settings" class="feature-card">
				<div class="feature-icon">⚙️</div>
				<h3>Settings</h3>
				<p>Configure API keys and preferences</p>
			</a>
		</div>
	</div>

	<div class="info-section">
		<h2>System Information</h2>
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
	</div>

	<div class="version-info">
		<p>VibeForge BDS v0.1.0 | Internal Use Only</p>
		<p class="text-sm">© 2025 Boswell Digital Solutions LLC</p>
	</div>
</div>

<style>
	.home-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.hero-section {
		text-align: center;
		padding: 3rem 0 4rem;
	}

	.hero-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	h1 {
		font-size: 3rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
		color: var(--accent, #fb923c);
	}

	.hero-subtitle {
		font-size: 1.25rem;
		color: var(--text-secondary, #9ca3af);
		margin: 0 0 0.5rem 0;
	}

	.hero-description {
		font-size: 1rem;
		color: var(--text-tertiary, #6b7280);
		margin: 0;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		border-radius: 8px;
	}

	.stat-icon {
		font-size: 2.5rem;
	}

	.stat-content {
		flex: 1;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary, #e0e0e0);
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--text-secondary, #9ca3af);
	}

	.features-section {
		margin-bottom: 3rem;
	}

	h2 {
		font-size: 1.75rem;
		font-weight: 600;
		margin: 0 0 1.5rem 0;
		color: var(--text-primary, #e0e0e0);
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.feature-card {
		padding: 2rem;
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		border-radius: 8px;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
	}

	.feature-card:hover {
		border-color: var(--accent, #fb923c);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(251, 146, 60, 0.1);
	}

	.feature-icon {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.feature-card h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
		color: var(--text-primary, #e0e0e0);
	}

	.feature-card p {
		font-size: 0.875rem;
		color: var(--text-secondary, #9ca3af);
		margin: 0;
		line-height: 1.5;
	}

	.info-section {
		margin-bottom: 3rem;
	}

	.info-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.75rem;
	}

	.info-list li {
		padding: 1rem;
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		font-size: 0.875rem;
		color: var(--text-secondary, #9ca3af);
	}

	.info-list strong {
		color: var(--accent, #fb923c);
		font-weight: 600;
	}

	.version-info {
		text-align: center;
		padding: 2rem 0;
		border-top: 1px solid var(--border, #333);
		color: var(--text-tertiary, #6b7280);
		font-size: 0.875rem;
	}

	.version-info .text-sm {
		font-size: 0.75rem;
		margin-top: 0.25rem;
	}
</style>
