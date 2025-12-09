<script lang="ts">
	import { Panel, Badge, Button, Input } from '$lib/components';

	// Types
	interface AIModel {
		id: string;
		name: string;
		provider: 'OpenAI' | 'Anthropic' | 'Google' | 'Meta';
		version: string;
		description: string;
		capabilities: string[];
		contextWindow: number;
		maxTokens: number;
		pricing: {
			input: number; // per 1M tokens
			output: number; // per 1M tokens
		};
		performance: {
			avgResponseTime: number;
			successRate: number;
			usageCount: number;
		};
		recommended: boolean;
		available: boolean;
	}

	// State
	let searchQuery = $state('');
	let selectedProvider = $state<string>('all');

	// Model data
	const models: AIModel[] = [
		{
			id: 'gpt-4o',
			name: 'GPT-4o',
			provider: 'OpenAI',
			version: 'gpt-4o-2024-08-06',
			description:
				'Most capable GPT-4 model, excellent for complex reasoning, coding, and creative tasks.',
			capabilities: [
				'Text Generation',
				'Code Generation',
				'Analysis',
				'Vision',
				'Function Calling'
			],
			contextWindow: 128000,
			maxTokens: 16384,
			pricing: {
				input: 2.5,
				output: 10.0
			},
			performance: {
				avgResponseTime: 4.1,
				successRate: 91.4,
				usageCount: 186
			},
			recommended: false,
			available: true
		},
		{
			id: 'gpt-4o-mini',
			name: 'GPT-4o Mini',
			provider: 'OpenAI',
			version: 'gpt-4o-mini-2024-07-18',
			description:
				'Fast, affordable model for most tasks. Best balance of speed, capability, and cost.',
			capabilities: ['Text Generation', 'Code Generation', 'Analysis', 'Function Calling'],
			contextWindow: 128000,
			maxTokens: 16384,
			pricing: {
				input: 0.15,
				output: 0.6
			},
			performance: {
				avgResponseTime: 1.8,
				successRate: 96.1,
				usageCount: 687
			},
			recommended: true,
			available: true
		},
		{
			id: 'claude-3-5-sonnet',
			name: 'Claude 3.5 Sonnet',
			provider: 'Anthropic',
			version: 'claude-3-5-sonnet-20241022',
			description:
				'Anthropic\'s most intelligent model, excels at complex analysis, coding, and nuanced writing.',
			capabilities: [
				'Text Generation',
				'Code Generation',
				'Analysis',
				'Vision',
				'Long Context'
			],
			contextWindow: 200000,
			maxTokens: 8192,
			pricing: {
				input: 3.0,
				output: 15.0
			},
			performance: {
				avgResponseTime: 3.2,
				successRate: 95.8,
				usageCount: 324
			},
			recommended: true,
			available: true
		},
		{
			id: 'claude-3-5-haiku',
			name: 'Claude 3.5 Haiku',
			provider: 'Anthropic',
			version: 'claude-3-5-haiku-20241022',
			description: 'Fastest Claude model, ideal for quick tasks and high-volume processing.',
			capabilities: ['Text Generation', 'Code Generation', 'Analysis'],
			contextWindow: 200000,
			maxTokens: 8192,
			pricing: {
				input: 0.8,
				output: 4.0
			},
			performance: {
				avgResponseTime: 1.2,
				successRate: 94.0,
				usageCount: 50
			},
			recommended: false,
			available: true
		},
		{
			id: 'gemini-1.5-pro',
			name: 'Gemini 1.5 Pro',
			provider: 'Google',
			version: 'gemini-1.5-pro-latest',
			description:
				'Google\'s most capable model with massive context window for document analysis.',
			capabilities: [
				'Text Generation',
				'Code Generation',
				'Analysis',
				'Vision',
				'Ultra Long Context'
			],
			contextWindow: 2000000,
			maxTokens: 8192,
			pricing: {
				input: 1.25,
				output: 5.0
			},
			performance: {
				avgResponseTime: 5.8,
				successRate: 89.2,
				usageCount: 0
			},
			recommended: false,
			available: false
		},
		{
			id: 'llama-3.3-70b',
			name: 'Llama 3.3 70B',
			provider: 'Meta',
			version: 'llama-3.3-70b-instruct',
			description: 'Open source model from Meta, good for coding and reasoning tasks.',
			capabilities: ['Text Generation', 'Code Generation', 'Analysis'],
			contextWindow: 128000,
			maxTokens: 8192,
			pricing: {
				input: 0.5,
				output: 0.8
			},
			performance: {
				avgResponseTime: 2.1,
				successRate: 88.5,
				usageCount: 0
			},
			recommended: false,
			available: false
		}
	];

	// Derived
	let filteredModels = $derived.by(() => {
		let result = models;

		// Filter by provider
		if (selectedProvider !== 'all') {
			result = result.filter((m) => m.provider === selectedProvider);
		}

		// Filter by search
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(m) =>
					m.name.toLowerCase().includes(q) ||
					m.description.toLowerCase().includes(q) ||
					m.provider.toLowerCase().includes(q)
			);
		}

		return result;
	});

	let stats = $derived.by(() => ({
		total: models.length,
		available: models.filter((m) => m.available).length,
		recommended: models.filter((m) => m.recommended).length,
		openai: models.filter((m) => m.provider === 'OpenAI').length,
		anthropic: models.filter((m) => m.provider === 'Anthropic').length
	}));

	// Provider options
	const providerOptions = ['all', 'OpenAI', 'Anthropic', 'Google', 'Meta'];

	// Get provider badge variant
	function getProviderBadge(provider: string): 'info' | 'success' | 'warning' | 'accent' {
		const variants = {
			OpenAI: 'info' as const,
			Anthropic: 'accent' as const,
			Google: 'warning' as const,
			Meta: 'success' as const
		};
		return variants[provider as keyof typeof variants] || 'info';
	}

	// Format pricing
	function formatPricing(price: number): string {
		return `$${price.toFixed(2)} / 1M tokens`;
	}

	// Format context window
	function formatContextWindow(tokens: number): string {
		if (tokens >= 1000000) {
			return `${(tokens / 1000000).toFixed(1)}M`;
		}
		return `${(tokens / 1000).toFixed(0)}K`;
	}
</script>

<div class="models-container">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">AI Models</h1>
			<p class="page-description">
				Manage and compare AI models available for skill execution
			</p>
		</div>

		<div class="stats-row">
			<div class="stat-item">
				<span class="stat-value">{stats.total}</span>
				<span class="stat-label">Total</span>
			</div>
			<div class="stat-item">
				<span class="stat-value success">{stats.available}</span>
				<span class="stat-label">Available</span>
			</div>
			<div class="stat-item">
				<span class="stat-value accent">{stats.recommended}</span>
				<span class="stat-label">Recommended</span>
			</div>
		</div>
	</div>

	<!-- Filters -->
	<Panel variant="bordered" padding="lg">
		<div class="filters-section">
			<Input
				type="search"
				bind:value={searchQuery}
				placeholder="Search models by name, description, or provider..."
				fullWidth
			/>

			<div class="provider-filters">
				{#each providerOptions as provider}
					<Button
						variant={selectedProvider === provider ? 'primary' : 'ghost'}
						size="sm"
						on:click={() => (selectedProvider = provider)}
					>
						{provider === 'all' ? 'All Providers' : provider}
					</Button>
				{/each}
			</div>

			<div class="result-count">
				<Badge variant="default">{filteredModels.length} models</Badge>
			</div>
		</div>
	</Panel>

	<!-- Models Grid -->
	{#if filteredModels.length === 0}
		<Panel variant="elevated" padding="lg">
			<div class="empty-state">
				<p class="empty-message">No models found matching your filters.</p>
				<Button variant="primary" on:click={() => ((searchQuery = ''), (selectedProvider = 'all'))}>
					Clear Filters
				</Button>
			</div>
		</Panel>
	{:else}
		<div class="models-grid">
			{#each filteredModels as model (model.id)}
				<Panel variant="bordered" padding="lg">
					<div class="model-card">
						<!-- Header -->
						<div class="model-header">
							<div class="model-title-section">
								<h3 class="model-name">{model.name}</h3>
								<div class="model-badges">
									<Badge variant={getProviderBadge(model.provider)} size="sm">
										{model.provider}
									</Badge>
									{#if model.recommended}
										<Badge variant="success" size="sm" outline>⭐ Recommended</Badge>
									{/if}
									{#if !model.available}
										<Badge variant="default" size="sm" outline>Coming Soon</Badge>
									{/if}
								</div>
							</div>
						</div>

						<!-- Description -->
						<p class="model-description">{model.description}</p>

						<!-- Capabilities -->
						<div class="capabilities-section">
							<span class="section-label">Capabilities</span>
							<div class="capabilities-list">
								{#each model.capabilities as capability}
									<Badge variant="info" size="sm" outline>{capability}</Badge>
								{/each}
							</div>
						</div>

						<!-- Specs -->
						<div class="specs-section">
							<div class="spec-item">
								<span class="spec-label">Context Window</span>
								<span class="spec-value">{formatContextWindow(model.contextWindow)}</span>
							</div>
							<div class="spec-item">
								<span class="spec-label">Max Output</span>
								<span class="spec-value">{formatContextWindow(model.maxTokens)}</span>
							</div>
							<div class="spec-item">
								<span class="spec-label">Version</span>
								<span class="spec-value mono">{model.version}</span>
							</div>
						</div>

						<!-- Pricing -->
						<div class="pricing-section">
							<span class="section-label">Pricing</span>
							<div class="pricing-grid">
								<div class="pricing-item">
									<span class="pricing-label">Input</span>
									<span class="pricing-value">{formatPricing(model.pricing.input)}</span>
								</div>
								<div class="pricing-item">
									<span class="pricing-label">Output</span>
									<span class="pricing-value">{formatPricing(model.pricing.output)}</span>
								</div>
							</div>
						</div>

						<!-- Performance (if available) -->
						{#if model.available && model.performance.usageCount > 0}
							<div class="performance-section">
								<span class="section-label">Performance Stats</span>
								<div class="performance-grid">
									<div class="perf-item">
										<span class="perf-label">Avg Response</span>
										<span class="perf-value">{model.performance.avgResponseTime.toFixed(1)}s</span>
									</div>
									<div class="perf-item">
										<span class="perf-label">Success Rate</span>
										<span class="perf-value success"
											>{model.performance.successRate.toFixed(1)}%</span
										>
									</div>
									<div class="perf-item">
										<span class="perf-label">Usage</span>
										<span class="perf-value">{model.performance.usageCount.toLocaleString()}</span>
									</div>
								</div>
							</div>
						{/if}

						<!-- Actions -->
						<div class="model-actions">
							<Button variant="primary" size="sm" disabled={!model.available}>
								{model.available ? 'Use Model' : 'Not Available'}
							</Button>
							<Button variant="ghost" size="sm">View Details</Button>
						</div>
					</div>
				</Panel>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* ═══════════════════════════════════════════════════════════════════════
     Models Container
     ═══════════════════════════════════════════════════════════════════════ */

	.models-container {
		max-width: 1600px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	/* Page Header */
	.page-header {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.header-content {
		flex: 1;
	}

	.page-title {
		font-family: var(--font-family-heading);
		font-size: 2.5rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-sm) 0;
		letter-spacing: 0.02em;
	}

	.page-description {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.stats-row {
		display: flex;
		gap: var(--spacing-xl);
		flex-wrap: wrap;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 600;
		color: var(--color-text-primary);
		font-family: var(--font-family-mono);
	}

	.stat-value.success {
		color: var(--color-success);
	}

	.stat-value.accent {
		color: var(--color-brass);
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Filters */
	.filters-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.provider-filters {
		display: flex;
		gap: var(--spacing-sm);
		flex-wrap: wrap;
	}

	.result-count {
		display: flex;
		justify-content: flex-end;
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-lg);
		padding: var(--spacing-3xl) var(--spacing-xl);
		text-align: center;
	}

	.empty-message {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* Models Grid */
	.models-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
		gap: var(--spacing-lg);
	}

	/* Model Card */
	.model-card {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.model-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--spacing-md);
	}

	.model-title-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.model-name {
		font-family: var(--font-family-heading);
		font-size: 1.5rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0;
		letter-spacing: 0.02em;
	}

	.model-badges {
		display: flex;
		gap: var(--spacing-xs);
		flex-wrap: wrap;
	}

	.model-description {
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin: 0;
	}

	/* Capabilities */
	.capabilities-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.section-label {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
	}

	.capabilities-list {
		display: flex;
		gap: var(--spacing-xs);
		flex-wrap: wrap;
	}

	/* Specs */
	.specs-section {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		background-color: var(--color-surface-3);
		border-radius: var(--radius-md);
	}

	.spec-item {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.spec-label {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.spec-value {
		font-size: 1rem;
		color: var(--color-text-primary);
		font-weight: 600;
	}

	.spec-value.mono {
		font-family: var(--font-family-mono);
		font-size: 0.875rem;
	}

	/* Pricing */
	.pricing-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.pricing-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-md);
	}

	.pricing-item {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		padding: var(--spacing-sm);
		background-color: var(--color-surface-3);
		border-radius: var(--radius-sm);
	}

	.pricing-label {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.pricing-value {
		font-size: 0.875rem;
		color: var(--color-brass);
		font-family: var(--font-family-mono);
		font-weight: 600;
	}

	/* Performance */
	.performance-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.performance-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--spacing-md);
	}

	.perf-item {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		padding: var(--spacing-sm);
		background-color: var(--color-surface-3);
		border-radius: var(--radius-sm);
	}

	.perf-label {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.perf-value {
		font-size: 0.875rem;
		color: var(--color-text-primary);
		font-family: var(--font-family-mono);
		font-weight: 600;
	}

	.perf-value.success {
		color: var(--color-success);
	}

	/* Actions */
	.model-actions {
		display: flex;
		gap: var(--spacing-md);
		padding-top: var(--spacing-md);
		border-top: 1px solid var(--color-border-subtle);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.page-title {
			font-size: 2rem;
		}

		.stats-row {
			flex-direction: column;
			gap: var(--spacing-md);
		}

		.provider-filters {
			flex-direction: column;
		}

		.models-grid {
			grid-template-columns: 1fr;
		}

		.specs-section,
		.performance-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
