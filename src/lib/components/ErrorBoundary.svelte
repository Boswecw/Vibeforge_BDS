<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		fallback?: Snippet<[Error]>;
		onError?: (error: Error, errorInfo: any) => void;
		children?: Snippet;
	}

	let { fallback, onError, children }: Props = $props();

	let error: Error | null = $state(null);
	let errorInfo: any = $state(null);
	let hasError = $derived(error !== null);

	// Error handler for unhandled promise rejections
	let unhandledRejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;

	onMount(() => {
		// Handle unhandled promise rejections
		unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
			const err = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
			handleError(err, { type: 'unhandledRejection' });
			event.preventDefault();
		};

		window.addEventListener('unhandledrejection', unhandledRejectionHandler);
	});

	onDestroy(() => {
		if (unhandledRejectionHandler) {
			window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
		}
	});

	function handleError(err: Error, info: any = {}) {
		error = err;
		errorInfo = info;

		// Call onError callback if provided
		if (onError) {
			onError(err, info);
		}

		// Log to console for debugging
		console.error('ErrorBoundary caught error:', err, info);
	}

	function resetError() {
		error = null;
		errorInfo = null;
	}

	// Export method to manually trigger error handling
	export function catchError(err: Error, info: any = {}) {
		handleError(err, info);
	}
</script>

{#if hasError && error}
	{#if fallback}
		{@render fallback(error)}
	{:else}
		<div class="error-boundary">
			<div class="error-container">
				<div class="error-icon">⚠️</div>
				<h2>Something went wrong</h2>
				<p class="error-message">{error.message || 'An unexpected error occurred'}</p>

				{#if errorInfo?.componentStack}
					<details class="error-details">
						<summary>Error Details</summary>
						<pre class="error-stack">{errorInfo.componentStack}</pre>
					</details>
				{/if}

				{#if error.stack}
					<details class="error-details">
						<summary>Stack Trace</summary>
						<pre class="error-stack">{error.stack}</pre>
					</details>
				{/if}

				<div class="error-actions">
					<button onclick={resetError} class="btn-retry">Try Again</button>
					<button onclick={() => window.location.reload()} class="btn-reload">Reload Page</button>
				</div>
			</div>
		</div>
	{/if}
{:else if children}
	{@render children()}
{/if}

<style>
	.error-boundary {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		padding: 2rem;
	}

	.error-container {
		max-width: 600px;
		text-align: center;
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		border-radius: 8px;
		padding: 3rem 2rem;
	}

	.error-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	h2 {
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--text-primary, #e0e0e0);
		margin: 0 0 1rem 0;
	}

	.error-message {
		font-size: 1rem;
		color: var(--text-secondary, #9ca3af);
		margin: 0 0 2rem 0;
		line-height: 1.6;
	}

	.error-details {
		text-align: left;
		margin-bottom: 1.5rem;
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
		margin-bottom: 0.5rem;
		user-select: none;
	}

	.error-details summary:hover {
		color: var(--accent, #fb923c);
	}

	.error-stack {
		font-size: 0.75rem;
		color: var(--text-tertiary, #6b7280);
		overflow-x: auto;
		white-space: pre-wrap;
		word-break: break-word;
		margin: 0.5rem 0 0 0;
	}

	.error-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.btn-retry,
	.btn-reload {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-retry {
		background: var(--accent, #fb923c);
		color: #000;
	}

	.btn-retry:hover {
		background: #f97316;
	}

	.btn-reload {
		background: var(--bg-tertiary, #2a2a2a);
		color: var(--text-primary, #e0e0e0);
		border: 1px solid var(--border, #333);
	}

	.btn-reload:hover {
		background: var(--bg-primary, #0a0a0a);
	}
</style>
