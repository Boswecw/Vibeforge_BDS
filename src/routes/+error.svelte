<script lang="ts">
	import { page } from '$app/stores';

	// SvelteKit error page receives error via $page.error
	let error = $derived($page.error);
	let status = $derived($page.status);

	function getErrorTitle(status: number): string {
		switch (status) {
			case 404:
				return 'Page Not Found';
			case 403:
				return 'Access Denied';
			case 500:
				return 'Internal Server Error';
			case 503:
				return 'Service Unavailable';
			default:
				return 'Something Went Wrong';
		}
	}

	function getErrorMessage(status: number): string {
		switch (status) {
			case 404:
				return "The page you're looking for doesn't exist or has been moved.";
			case 403:
				return "You don't have permission to access this resource.";
			case 500:
				return 'An internal server error occurred. Please try again later.';
			case 503:
				return 'The service is temporarily unavailable. Please try again in a moment.';
			default:
				return 'An unexpected error occurred. Please try again.';
		}
	}

	function getErrorIcon(status: number): string {
		switch (status) {
			case 404:
				return '🔍';
			case 403:
				return '🔒';
			case 500:
				return '⚠️';
			case 503:
				return '🔧';
			default:
				return '❌';
		}
	}
</script>

<div class="error-page">
	<div class="error-container">
		<div class="error-icon">{getErrorIcon(status)}</div>

		<h1 class="error-title">{getErrorTitle(status)}</h1>

		<p class="error-status">Error {status}</p>

		<p class="error-message">{getErrorMessage(status)}</p>

		{#if error?.message}
			<div class="error-details">
				<details>
					<summary>Technical Details</summary>
					<pre>{error.message}</pre>
				</details>
			</div>
		{/if}

		<div class="error-actions">
			<a href="/" class="btn-home">Go Home</a>
			<button onclick={() => window.history.back()} class="btn-back">Go Back</button>
			<button onclick={() => window.location.reload()} class="btn-reload">Reload</button>
		</div>
	</div>
</div>

<style>
	.error-page {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem;
		background: var(--bg-primary, #0a0a0a);
	}

	.error-container {
		max-width: 600px;
		width: 100%;
		text-align: center;
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		border-radius: 8px;
		padding: 3rem 2rem;
	}

	.error-icon {
		font-size: 5rem;
		margin-bottom: 1.5rem;
		line-height: 1;
	}

	.error-title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-primary, #e0e0e0);
		margin: 0 0 0.5rem 0;
	}

	.error-status {
		font-size: 1rem;
		color: var(--accent, #fb923c);
		font-weight: 600;
		margin: 0 0 1.5rem 0;
	}

	.error-message {
		font-size: 1rem;
		color: var(--text-secondary, #9ca3af);
		line-height: 1.6;
		margin: 0 0 2rem 0;
	}

	.error-details {
		margin-bottom: 2rem;
		text-align: left;
	}

	.error-details details {
		background: var(--bg-primary, #0a0a0a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		padding: 1rem;
	}

	.error-details summary {
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary, #9ca3af);
		user-select: none;
	}

	.error-details summary:hover {
		color: var(--accent, #fb923c);
	}

	.error-details pre {
		margin-top: 0.75rem;
		font-size: 0.75rem;
		color: var(--text-tertiary, #6b7280);
		white-space: pre-wrap;
		word-break: break-word;
	}

	.error-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn-home,
	.btn-back,
	.btn-reload {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
		display: inline-block;
	}

	.btn-home {
		background: var(--accent, #fb923c);
		color: #000;
	}

	.btn-home:hover {
		background: #f97316;
	}

	.btn-back,
	.btn-reload {
		background: var(--bg-tertiary, #2a2a2a);
		color: var(--text-primary, #e0e0e0);
		border: 1px solid var(--border, #333);
	}

	.btn-back:hover,
	.btn-reload:hover {
		background: var(--bg-primary, #0a0a0a);
	}
</style>
