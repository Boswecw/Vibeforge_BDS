<!--
  Update Banner Component

  Shows a banner when a new version of the app is available.
  Allows users to update to the new version immediately.
-->
<script lang="ts">
	import { serviceWorkerState, updateServiceWorker } from '$lib/utils/serviceWorker';

	let show = $derived(serviceWorkerState.updateAvailable);

	function handleUpdate() {
		updateServiceWorker();
	}

	function handleDismiss() {
		// User can dismiss the banner temporarily
		// It will show again on next page load if still waiting
		show = false;
	}
</script>

{#if show}
	<div class="update-banner">
		<div class="update-content">
			<div class="update-icon">🎉</div>
			<div class="update-text">
				<strong>New version available!</strong>
				<span>Click "Update" to get the latest features and improvements.</span>
			</div>
			<div class="update-actions">
				<button class="btn-update" onclick={handleUpdate}> Update Now </button>
				<button class="btn-dismiss" onclick={handleDismiss}> Later </button>
			</div>
		</div>
	</div>
{/if}

<style>
	.update-banner {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		background: linear-gradient(
			135deg,
			var(--color-brass) 0%,
			var(--color-brass-light) 100%
		);
		color: var(--color-midnight);
		padding: var(--spacing-md) var(--spacing-lg);
		box-shadow: var(--shadow-lg);
		animation: slideDown 0.3s ease-out;
	}

	@keyframes slideDown {
		from {
			transform: translateY(-100%);
		}
		to {
			transform: translateY(0);
		}
	}

	.update-content {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.update-icon {
		font-size: 2rem;
		flex-shrink: 0;
	}

	.update-text {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.update-text strong {
		font-family: var(--font-family-heading);
		font-size: 1rem;
		font-weight: 400;
		letter-spacing: 0.02em;
	}

	.update-text span {
		font-size: 0.875rem;
		opacity: 0.9;
	}

	.update-actions {
		display: flex;
		gap: var(--spacing-md);
		flex-shrink: 0;
	}

	.btn-update,
	.btn-dismiss {
		padding: var(--spacing-sm) var(--spacing-lg);
		border-radius: var(--radius-md);
		font-family: var(--font-family-heading);
		font-size: 0.875rem;
		font-weight: 300;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		cursor: pointer;
		transition: all var(--transition-fast);
		border: 2px solid transparent;
	}

	.btn-update {
		background-color: var(--color-midnight);
		color: var(--color-brass);
		border-color: var(--color-midnight);
	}

	.btn-update:hover {
		background-color: var(--color-surface-1);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.btn-dismiss {
		background-color: transparent;
		color: var(--color-midnight);
		border-color: var(--color-midnight);
	}

	.btn-dismiss:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 768px) {
		.update-content {
			flex-wrap: wrap;
			gap: var(--spacing-md);
		}

		.update-actions {
			width: 100%;
			justify-content: stretch;
		}

		.btn-update,
		.btn-dismiss {
			flex: 1;
		}
	}
</style>
