<script lang="ts">
	import { page } from '$app/stores';
	import { tokenManager } from '$lib/api/auth';

	let isAuthenticated = $state(false);

	// Check auth status
	$effect(() => {
		isAuthenticated = tokenManager.isAuthenticated();
	});

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/library', label: 'Skills Library' },
		{ href: '/history', label: 'History' },
		{ href: '/settings', label: 'Settings' }
	];

	function isActive(href: string): boolean {
		return $page.url.pathname === href;
	}
</script>

<nav class="navigation">
	<div class="nav-container">
		<div class="nav-brand">
			<a href="/">
				<span class="brand-icon">⚒️</span>
				<span class="brand-name">VibeForge BDS</span>
			</a>
		</div>

		<div class="nav-links">
			{#each navLinks as link}
				<a href={link.href} class="nav-link" class:active={isActive(link.href)}>
					{link.label}
				</a>
			{/each}
		</div>

		<div class="nav-actions">
			{#if isAuthenticated}
				<span class="auth-status">Connected</span>
			{:else}
				<a href="/login" class="btn-login">Login</a>
			{/if}
		</div>
	</div>
</nav>

<style>
	.navigation {
		background: var(--bg-secondary, #1a1a1a);
		border-bottom: 1px solid var(--border, #333);
		padding: 0.75rem 1.5rem;
	}

	.nav-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 1600px;
		margin: 0 auto;
	}

	.nav-brand a {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		color: var(--text-primary, #e0e0e0);
		font-weight: 700;
		font-size: 1.25rem;
	}

	.brand-icon {
		font-size: 1.5rem;
	}

	.brand-name {
		color: var(--accent, #fb923c);
	}

	.nav-links {
		display: flex;
		gap: 0.5rem;
	}

	.nav-link {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		text-decoration: none;
		color: var(--text-secondary, #9ca3af);
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.2s;
	}

	.nav-link:hover {
		color: var(--text-primary, #e0e0e0);
		background: var(--bg-tertiary, #0a0a0a);
	}

	.nav-link.active {
		color: var(--accent, #fb923c);
		background: var(--bg-tertiary, #0a0a0a);
	}

	.nav-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.auth-status {
		padding: 0.375rem 0.75rem;
		background: rgba(34, 197, 94, 0.2);
		color: #22c55e;
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: 4px;
	}

	.btn-login {
		padding: 0.5rem 1rem;
		background: var(--accent, #fb923c);
		border-radius: 4px;
		color: #0a0a0a;
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.2s;
	}

	.btn-login:hover {
		background: #f97316;
	}
</style>
