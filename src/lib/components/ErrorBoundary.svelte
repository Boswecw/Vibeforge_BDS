<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Snippet } from 'svelte';
	import { classifyError, type AppError } from '$lib/utils/errors';
	import { errorStore } from '$lib/stores/errors.svelte';
	import { Alert, Button, Panel } from '$lib/components';

	interface Props {
		fallback?: Snippet<[AppError]>;
		onError?: (error: AppError) => void;
		showDetails?: boolean;
		children?: Snippet;
	}

	let { fallback, onError, showDetails = false, children }: Props = $props();

	let error: AppError | null = $state(null);
	let errorInfo: string = $state('');
	let hasError = $derived(error !== null);

	// Error handler for unhandled errors
	let errorHandler: ((event: ErrorEvent) => void) | null = null;
	let unhandledRejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;

	onMount(() => {
		// Handle window errors
		errorHandler = (event: ErrorEvent) => {
			const appError = classifyError(event.error);
			handleError(appError, event.error?.stack || '');
			event.preventDefault();
		};

		// Handle unhandled promise rejections
		unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
			const appError = classifyError(event.reason);
			handleError(appError, event.reason?.stack || '');
			event.preventDefault();
		};

		window.addEventListener('error', errorHandler);
		window.addEventListener('unhandledrejection', unhandledRejectionHandler);
	});

	onDestroy(() => {
		if (errorHandler) {
			window.removeEventListener('error', errorHandler);
		}
		if (unhandledRejectionHandler) {
			window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
		}
	});

	function handleError(appError: AppError, stack: string = '') {
		error = appError;
		errorInfo = stack;

		// Add to global error store
		errorStore.addError(appError);

		// Call onError callback if provided
		if (onError) {
			onError(appError);
		}
	}

	function resetError() {
		error = null;
		errorInfo = '';
	}

	// Export method to manually trigger error handling
	export function catchError(err: unknown) {
		const appError = classifyError(err);
		handleError(appError, err instanceof Error ? err.stack || '' : '');
	}
</script>

{#if hasError && error}
	{#if fallback}
		{@render fallback(error)}
	{:else}
		<div class="error-boundary">
			<Panel variant="elevated" padding="lg">
				<div class="error-container">
					<div class="error-icon">⚠️</div>
					<h2>Something went wrong</h2>

					<Alert variant="error" title={error.category}>
						{error.userMessage}
					</Alert>

					{#if showDetails && errorInfo}
						<details class="error-details">
							<summary>Technical Details</summary>
							<pre class="error-stack">{errorInfo}</pre>
						</details>
					{/if}

					<div class="error-actions">
						<Button variant="primary" on:click={resetError}>Try Again</Button>
						<Button variant="secondary" on:click={() => window.location.reload()}>
							Reload Page
						</Button>
					</div>

					<p class="error-id">Error ID: {error.id}</p>
				</div>
			</Panel>
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
		padding: var(--spacing-xl);
	}

	.error-container {
		max-width: 600px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-lg);
		text-align: center;
	}

	.error-icon {
		font-size: 4rem;
	}

	h2 {
		font-family: var(--font-family-heading);
		font-size: 2rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0;
		letter-spacing: 0.02em;
	}

	.error-details {
		width: 100%;
		margin-top: var(--spacing-md);
		text-align: left;
	}

	.error-details summary {
		cursor: pointer;
		font-weight: 500;
		color: var(--color-text-secondary);
		padding: var(--spacing-sm);
		user-select: none;
	}

	.error-details summary:hover {
		color: var(--color-brass);
	}

	.error-stack {
		margin-top: var(--spacing-md);
		padding: var(--spacing-md);
		background-color: var(--color-surface-2);
		border-radius: var(--radius-md);
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		overflow-x: auto;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.error-actions {
		display: flex;
		gap: var(--spacing-md);
		margin-top: var(--spacing-md);
	}

	.error-id {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-family: var(--font-family-mono);
		margin: 0;
	}
</style>
