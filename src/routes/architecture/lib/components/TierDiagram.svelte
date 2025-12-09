<script lang="ts">
	import type { Tier, Product } from '../types';

	interface Props {
		tiers: Tier[];
	}

	let { tiers }: Props = $props();

	// Tier color mapping
	const tierColors: Record<string, { bg: string; border: string; accent: string }> = {
		consumer: {
			bg: '#1e3a8a',
			border: '#3b82f6',
			accent: '#60a5fa'
		},
		intelligence: {
			bg: '#581c87',
			border: '#a855f7',
			accent: '#c084fc'
		},
		provider: {
			bg: 'var(--color-graphite)',
			border: 'var(--color-brass)',
			accent: 'var(--color-gold)'
		}
	};

	function handleProductClick(product: Product) {
		if (product.hasContract) {
			// Dispatch custom event to parent
			const event = new CustomEvent('show-contract', {
				detail: { product },
				bubbles: true,
				composed: true
			});
			document.dispatchEvent(event);
		}
	}
</script>

<div class="tier-diagram">
	{#each tiers as tier}
		<div class="tier-container" style="border-color: {tierColors[tier.id]?.border || tierColors.provider.border};">
			<!-- Tier Header -->
			<div class="tier-header" style="background: linear-gradient(135deg, {tierColors[tier.id]?.bg || tierColors.provider.bg} 0%, {tierColors[tier.id]?.accent || tierColors.provider.accent}22 100%);">
				<div>
					<h3 class="tier-name">{tier.name}</h3>
					<p class="tier-subtitle">{tier.subtitle}</p>
				</div>
				<p class="tier-description">{tier.description}</p>
			</div>

			<!-- Categories -->
			<div class="categories-grid">
				{#each tier.categories as category}
					<div class="category-card">
						<h4 class="category-name">{category.name}</h4>

						<!-- Products -->
						<div class="products-list">
							{#each category.products as product}
								<button
									class="product-card"
									class:has-contract={product.hasContract}
									onclick={() => handleProductClick(product)}
									style="border-left-color: {tierColors[tier.id]?.accent || tierColors.provider.accent};"
								>
									<div class="product-header">
										<span class="product-name">{product.name}</span>
										{#if product.hasContract}
											<span class="contract-badge">Contract</span>
										{/if}
									</div>
									<div class="product-details">
										<span class="product-version">{product.version}</span>
										{#if product.port}
											<span class="product-port">Port {product.port}</span>
										{/if}
									</div>
								</button>
							{/each}
						</div>

						<!-- Traits -->
						{#if category.traits.length > 0}
							<div class="traits-list">
								{#each category.traits as trait}
									<span class="trait-badge">{trait}</span>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.tier-diagram {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
		padding: var(--spacing-md);
	}

	.tier-container {
		background: var(--color-surface-2);
		border: 2px solid;
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
	}

	.tier-header {
		padding: var(--spacing-lg);
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.tier-name {
		font-family: var(--font-family-heading);
		font-size: 1.75rem;
		font-weight: 400;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-xs) 0;
		letter-spacing: 0.02em;
	}

	.tier-subtitle {
		font-family: var(--font-family-mono);
		font-size: 0.875rem;
		color: var(--color-brass);
		margin: 0 0 var(--spacing-md) 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.tier-description {
		font-size: 0.95rem;
		color: var(--color-text-secondary);
		margin: 0;
		line-height: 1.5;
	}

	.categories-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: var(--spacing-lg);
		padding: var(--spacing-lg);
	}

	.category-card {
		background: var(--color-surface-3);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		padding: var(--spacing-md);
	}

	.category-name {
		font-family: var(--font-family-heading);
		font-size: 1.125rem;
		font-weight: 400;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-md) 0;
		letter-spacing: 0.02em;
	}

	.products-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-md);
	}

	.product-card {
		background: var(--color-midnight);
		border: 1px solid var(--color-border-subtle);
		border-left: 3px solid;
		border-radius: var(--radius-sm);
		padding: var(--spacing-md);
		cursor: default;
		transition: all var(--transition-base);
		text-align: left;
		width: 100%;
	}

	.product-card.has-contract {
		cursor: pointer;
	}

	.product-card.has-contract:hover {
		border-color: var(--color-brass);
		background: var(--color-surface-2);
		transform: translateX(4px);
	}

	.product-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--spacing-xs);
	}

	.product-name {
		font-family: var(--font-family-body);
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.contract-badge {
		font-family: var(--font-family-mono);
		font-size: 0.7rem;
		background: var(--color-brass);
		color: var(--color-midnight);
		padding: 0.15rem 0.5rem;
		border-radius: var(--radius-full);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
	}

	.product-details {
		display: flex;
		gap: var(--spacing-md);
		flex-wrap: wrap;
	}

	.product-version,
	.product-port {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-tertiary);
	}

	.product-port {
		color: var(--color-steel-blue);
	}

	.traits-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-xs);
		padding-top: var(--spacing-sm);
		border-top: 1px solid var(--color-border-subtle);
	}

	.trait-badge {
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		background: var(--color-graphite);
		color: var(--color-text-secondary);
		padding: 0.25rem 0.6rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border-subtle);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.categories-grid {
			grid-template-columns: 1fr;
		}

		.tier-name {
			font-size: 1.5rem;
		}
	}
</style>
