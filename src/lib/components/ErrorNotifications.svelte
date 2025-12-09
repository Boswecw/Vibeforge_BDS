<script lang="ts">
	import { errorStore } from '$lib/stores/errors.svelte';
	import { getErrorBadgeVariant } from '$lib/utils/errors';
	import { Alert, Button, Badge } from '$lib/components';

	// Get errors from store
	let errors = $derived(errorStore.errors);
	let criticalErrors = $derived(errorStore.criticalErrors);
	let highErrors = $derived(errorStore.highErrors);

	function dismissError(id: string) {
		errorStore.dismissError(id);
	}

	function clearError(id: string) {
		errorStore.clearError(id);
	}

	function clearAll() {
		errorStore.clearAll();
	}
</script>

<div class="error-notifications">
	{#if errors.length > 0}
		<div class="notifications-container">
			{#if errors.length > 3}
				<div class="notification-header">
					<Badge variant="error">{errors.length} Errors</Badge>
					<Button variant="ghost" size="sm" on:click={clearAll}>Clear All</Button>
				</div>
			{/if}

			{#each errors.slice(0, 5) as error (error.id)}
				<div class="notification-item" class:critical={error.severity === 'CRITICAL'}>
					<Alert
						variant={getErrorBadgeVariant(error.severity)}
						title={`${error.category} Error`}
						dismissible
						on:dismiss={() => dismissError(error.id)}
					>
						<div class="error-content">
							<p class="error-message">{error.userMessage}</p>

							{#if error.details}
								<details class="error-details">
									<summary>Details</summary>
									<p>{error.details}</p>
								</details>
							{/if}

							<div class="error-meta">
								<span class="error-time">
									{error.timestamp.toLocaleTimeString('en-US', {
										hour: '2-digit',
										minute: '2-digit'
									})}
								</span>
								<span class="error-id">ID: {error.id.slice(-8)}</span>
								{#if error.retryable}
									<Badge variant="info" size="sm">Retryable</Badge>
								{/if}
							</div>

							{#if error.retryable && error.retryAfter}
								<p class="retry-hint">
									Will retry automatically in {Math.round(error.retryAfter / 1000)}s
								</p>
							{/if}
						</div>
					</Alert>
				</div>
			{/each}

			{#if errors.length > 5}
				<div class="notification-footer">
					<p class="more-errors">+{errors.length - 5} more errors</p>
					<Button variant="secondary" size="sm" on:click={clearAll}>Clear All</Button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.error-notifications {
		position: fixed;
		top: var(--spacing-lg);
		right: var(--spacing-lg);
		z-index: var(--z-index-toast, 9999);
		max-width: 480px;
		width: 100%;
		pointer-events: none;
	}

	.notifications-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		pointer-events: auto;
	}

	.notification-header,
	.notification-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-sm) var(--spacing-md);
		background-color: var(--color-surface-2);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
	}

	.notification-item {
		animation: slideIn 0.3s ease-out;
	}

	.notification-item.critical {
		animation: slideIn 0.3s ease-out, pulse 1s ease-in-out infinite;
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(var(--color-error-rgb, 239, 68, 68), 0.4);
		}
		50% {
			box-shadow: 0 0 0 8px rgba(var(--color-error-rgb, 239, 68, 68), 0);
		}
	}

	.error-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.error-message {
		font-size: 0.9375rem;
		color: var(--color-text-primary);
		margin: 0;
		line-height: 1.5;
	}

	.error-details {
		margin-top: var(--spacing-xs);
	}

	.error-details summary {
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		user-select: none;
	}

	.error-details summary:hover {
		color: var(--color-brass);
	}

	.error-details p {
		margin-top: var(--spacing-xs);
		font-size: 0.8125rem;
		color: var(--color-text-tertiary);
		font-family: var(--font-family-mono);
	}

	.error-meta {
		display: flex;
		gap: var(--spacing-md);
		align-items: center;
		flex-wrap: wrap;
		margin-top: var(--spacing-xs);
	}

	.error-time,
	.error-id {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-family: var(--font-family-mono);
	}

	.retry-hint {
		font-size: 0.8125rem;
		color: var(--color-info);
		margin: var(--spacing-xs) 0 0 0;
		font-style: italic;
	}

	.more-errors {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.error-notifications {
			top: var(--spacing-sm);
			right: var(--spacing-sm);
			left: var(--spacing-sm);
			max-width: none;
		}
	}
</style>
