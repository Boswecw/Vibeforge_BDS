<script lang="ts">
	interface Props {
		error: Error | string | null;
		title?: string;
		onRetry?: () => void;
		onDismiss?: () => void;
	}

	let { error, title = 'Error', onRetry, onDismiss }: Props = $props();

	let errorMessage = $derived(
		error instanceof Error ? error.message : typeof error === 'string' ? error : 'An error occurred'
	);

	let hasError = $derived(error !== null);
</script>

{#if hasError}
	<div class="error-display" role="alert">
		<div class="error-header">
			<div class="error-title">
				<span class="error-icon">⚠️</span>
				<span>{title}</span>
			</div>
			{#if onDismiss}
				<button onclick={onDismiss} class="btn-dismiss" aria-label="Dismiss error">×</button>
			{/if}
		</div>

		<p class="error-message">{errorMessage}</p>

		{#if error instanceof Error && error.stack}
			<details class="error-stack-details">
				<summary>Technical Details</summary>
				<pre class="error-stack">{error.stack}</pre>
			</details>
		{/if}

		{#if onRetry}
			<div class="error-actions">
				<button onclick={onRetry} class="btn-retry">Try Again</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.error-display {
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 4px;
		padding: 1rem;
		margin-bottom: 1rem;
	}

	.error-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.error-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: #ef4444;
	}

	.error-icon {
		font-size: 1rem;
	}

	.btn-dismiss {
		background: none;
		border: none;
		color: #ef4444;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: background 0.2s;
	}

	.btn-dismiss:hover {
		background: rgba(239, 68, 68, 0.2);
	}

	.error-message {
		font-size: 0.875rem;
		color: #fca5a5;
		margin: 0 0 0.75rem 0;
		line-height: 1.5;
	}

	.error-stack-details {
		margin-bottom: 0.75rem;
	}

	.error-stack-details summary {
		cursor: pointer;
		font-size: 0.75rem;
		color: #fca5a5;
		user-select: none;
	}

	.error-stack-details summary:hover {
		color: #ef4444;
	}

	.error-stack {
		margin-top: 0.5rem;
		font-size: 0.7rem;
		color: #fca5a5;
		background: rgba(0, 0, 0, 0.3);
		padding: 0.5rem;
		border-radius: 4px;
		overflow-x: auto;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.error-actions {
		display: flex;
		gap: 0.5rem;
	}

	.btn-retry {
		padding: 0.5rem 1rem;
		background: #ef4444;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-retry:hover {
		background: #dc2626;
	}
</style>
