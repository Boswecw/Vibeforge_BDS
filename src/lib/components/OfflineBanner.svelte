<script lang="ts">
	import { connectivityStore } from '$lib/stores/connectivity.svelte';

	const isOffline = $derived(connectivityStore.isOffline);
</script>

{#if isOffline}
	<div class="offline-banner" role="alert">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<path
				d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z"
				stroke="currentColor"
				stroke-width="2"
			/>
			<path
				d="M10 6V10"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			/>
			<circle cx="10" cy="14" r="1" fill="currentColor" />
		</svg>
		<span>You are offline. Some features may not work.</span>
	</div>
{/if}

<style>
	.offline-banner {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 12px 24px;
		background: #e8a64d;
		color: var(--color-bg);
		font-weight: 600;
		font-size: 0.875rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.offline-banner svg {
		flex-shrink: 0;
	}

	@media (prefers-reduced-motion: no-preference) {
		.offline-banner {
			animation: slideDown 0.3s ease;
		}
	}

	@keyframes slideDown {
		from {
			transform: translateY(-100%);
		}
		to {
			transform: translateY(0);
		}
	}
</style>
