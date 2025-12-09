<script lang="ts">
	import type { Pipeline, Product } from '../types';

	interface Props {
		isOpen: boolean;
		contract: {
			name: string;
			version: string;
			port?: string;
			contract?: {
				request: Record<string, unknown>;
				response: Record<string, unknown>;
				errors: string[];
			};
		} | null;
		onClose: () => void;
	}

	let { isOpen = $bindable(), contract, onClose }: Props = $props();

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	function formatJSON(obj: unknown): string {
		return JSON.stringify(obj, null, 2);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen && contract}
	<div class="modal-backdrop" onclick={handleBackdropClick} role="presentation">
		<div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title">
			<!-- Modal Header -->
			<div class="modal-header">
				<div>
					<h2 id="modal-title" class="modal-title">{contract.name}</h2>
					<div class="modal-subtitle">
						<span class="version-badge">{contract.version}</span>
						{#if contract.port}
							<span class="port-badge">Port {contract.port}</span>
						{/if}
					</div>
				</div>
				<button class="close-button" onclick={onClose} aria-label="Close modal">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

			<!-- Modal Content -->
			<div class="modal-content">
				{#if contract.contract}
					<!-- Request Schema -->
					<div class="contract-section">
						<h3 class="section-title">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
								<polyline points="17 8 12 3 7 8"></polyline>
								<line x1="12" y1="3" x2="12" y2="15"></line>
							</svg>
							Request Schema
						</h3>
						<pre class="json-display"><code>{formatJSON(contract.contract.request)}</code></pre>
					</div>

					<!-- Response Schema -->
					<div class="contract-section">
						<h3 class="section-title">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
							</svg>
							Response Schema
						</h3>
						<pre class="json-display"><code>{formatJSON(contract.contract.response)}</code></pre>
					</div>

					<!-- Error Codes -->
					<div class="contract-section">
						<h3 class="section-title">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle cx="12" cy="12" r="10"></circle>
								<line x1="12" y1="8" x2="12" y2="12"></line>
								<line x1="12" y1="16" x2="12.01" y2="16"></line>
							</svg>
							Error Codes
						</h3>
						<ul class="error-list">
							{#each contract.contract.errors as error}
								<li class="error-item">
									<code class="error-code">{error}</code>
								</li>
							{/each}
						</ul>
					</div>
				{:else}
					<div class="no-contract">
						<p>No contract available for this service.</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: var(--z-modal-backdrop);
		padding: var(--spacing-md);
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-container {
		background: var(--color-surface-2);
		border: 2px solid var(--color-brass);
		border-radius: var(--radius-xl);
		width: 100%;
		max-width: 800px;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		box-shadow: var(--shadow-xl);
		z-index: var(--z-modal);
		animation: slideUp 0.3s ease-out;
	}

	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: var(--spacing-xl);
		border-bottom: 1px solid var(--color-border-subtle);
		gap: var(--spacing-lg);
	}

	.modal-title {
		font-family: var(--font-family-heading);
		font-size: 1.75rem;
		font-weight: 400;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-sm) 0;
		letter-spacing: 0.02em;
	}

	.modal-subtitle {
		display: flex;
		gap: var(--spacing-md);
		flex-wrap: wrap;
	}

	.version-badge,
	.port-badge {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		padding: 0.3rem 0.7rem;
		border-radius: var(--radius-full);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.version-badge {
		background: var(--color-brass);
		color: var(--color-midnight);
		font-weight: 600;
	}

	.port-badge {
		background: var(--color-graphite);
		color: var(--color-steel-blue);
		border: 1px solid var(--color-border-subtle);
	}

	.close-button {
		background: transparent;
		border: none;
		color: var(--color-text-secondary);
		cursor: pointer;
		padding: var(--spacing-sm);
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
		flex-shrink: 0;
	}

	.close-button:hover {
		background: var(--color-graphite);
		color: var(--color-brass);
	}

	.modal-content {
		overflow-y: auto;
		padding: var(--spacing-xl);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	.contract-section {
		background: var(--color-surface-3);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		padding: var(--spacing-lg);
	}

	.section-title {
		font-family: var(--font-family-heading);
		font-size: 1.125rem;
		font-weight: 400;
		color: var(--color-brass);
		margin: 0 0 var(--spacing-md) 0;
		letter-spacing: 0.02em;
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.section-title svg {
		flex-shrink: 0;
	}

	.json-display {
		background: var(--color-midnight);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		padding: var(--spacing-md);
		overflow-x: auto;
		margin: 0;
	}

	.json-display code {
		font-family: var(--font-family-mono);
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.error-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.error-item {
		background: var(--color-midnight);
		border: 1px solid var(--color-border-subtle);
		border-left: 3px solid var(--color-error);
		border-radius: var(--radius-sm);
		padding: var(--spacing-sm) var(--spacing-md);
	}

	.error-code {
		font-family: var(--font-family-mono);
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.no-contract {
		text-align: center;
		padding: var(--spacing-2xl);
		color: var(--color-text-tertiary);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.modal-container {
			max-height: 95vh;
			margin: var(--spacing-sm);
		}

		.modal-header {
			padding: var(--spacing-lg);
		}

		.modal-content {
			padding: var(--spacing-lg);
		}

		.modal-title {
			font-size: 1.5rem;
		}
	}
</style>
