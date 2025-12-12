<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { ImprovementSuggestion } from '$lib/types/agents';

	interface Props {
		suggestions: ImprovementSuggestion[];
	}

	let { suggestions }: Props = $props();

	function getPriorityBadgeVariant(priority: string): 'danger' | 'warning' | 'neutral' {
		switch (priority.toLowerCase()) {
			case 'high':
				return 'danger';
			case 'medium':
				return 'warning';
			case 'low':
				return 'neutral';
			default:
				return 'neutral';
		}
	}

	function getPriorityIcon(priority: string): string {
		switch (priority.toLowerCase()) {
			case 'high':
				return '🔴';
			case 'medium':
				return '🟡';
			case 'low':
				return '🟢';
			default:
				return '⚪';
		}
	}

	function getImpactIcon(impact: string): string {
		switch (impact.toLowerCase()) {
			case 'high':
				return '⚡';
			case 'medium':
				return '📊';
			case 'low':
				return '📈';
			default:
				return '📊';
		}
	}

	async function copyCode(code: string): Promise<void> {
		await navigator.clipboard.writeText(code);
	}

	const groupedByPriority = $derived(() => {
		const groups: Record<string, ImprovementSuggestion[]> = {
			high: [],
			medium: [],
			low: []
		};
		suggestions.forEach((suggestion) => {
			const priority = suggestion.priority.toLowerCase();
			if (groups[priority]) {
				groups[priority].push(suggestion);
			}
		});
		return groups;
	});
</script>

<div class="improvements">
	{#if suggestions.length > 0}
		<!-- Summary -->
		<div class="improvements-summary">
			<h3>Improvement Suggestions ({suggestions.length})</h3>
			<div class="summary-stats">
				{#if groupedByPriority().high.length > 0}
					<div class="summary-stat">
						<span class="stat-icon">🔴</span>
						<span class="stat-count">{groupedByPriority().high.length}</span>
						<span class="stat-label">High Priority</span>
					</div>
				{/if}
				{#if groupedByPriority().medium.length > 0}
					<div class="summary-stat">
						<span class="stat-icon">🟡</span>
						<span class="stat-count">{groupedByPriority().medium.length}</span>
						<span class="stat-label">Medium Priority</span>
					</div>
				{/if}
				{#if groupedByPriority().low.length > 0}
					<div class="summary-stat">
						<span class="stat-icon">🟢</span>
						<span class="stat-count">{groupedByPriority().low.length}</span>
						<span class="stat-label">Low Priority</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- Suggestions List -->
		<div class="suggestions-list">
			{#each suggestions as suggestion}
				<div class="suggestion-item">
					<div class="suggestion-header">
						<div class="suggestion-title">
							<span class="suggestion-icon">{getPriorityIcon(suggestion.priority)}</span>
							<span class="suggestion-text">{suggestion.title}</span>
						</div>
						<div class="suggestion-badges">
							<Badge variant={getPriorityBadgeVariant(suggestion.priority)}>
								{suggestion.priority}
							</Badge>
							{#if suggestion.impact}
								<Badge variant="neutral">
									{getImpactIcon(suggestion.impact)} {suggestion.impact} Impact
								</Badge>
							{/if}
						</div>
					</div>

					<div class="suggestion-description">
						{suggestion.description}
					</div>

					{#if suggestion.current_code}
						<div class="code-section">
							<div class="code-header">
								<span class="code-label">Current Code:</span>
							</div>
							<pre class="code-block"><code>{suggestion.current_code}</code></pre>
						</div>
					{/if}

					{#if suggestion.suggested_code}
						<div class="code-section">
							<div class="code-header">
								<span class="code-label">Suggested Code:</span>
								<Button
									variant="ghost"
									size="sm"
									onclick={() => copyCode(suggestion.suggested_code || '')}
								>
									Copy
								</Button>
							</div>
							<pre class="code-block suggested"><code>{suggestion.suggested_code}</code></pre>
						</div>
					{/if}

					{#if suggestion.rationale}
						<div class="suggestion-rationale">
							<div class="rationale-label">Rationale:</div>
							<div class="rationale-text">{suggestion.rationale}</div>
						</div>
					{/if}

					{#if suggestion.effort}
						<div class="suggestion-effort">
							<span class="effort-label">Estimated Effort:</span>
							<span class="effort-value">{suggestion.effort}</span>
						</div>
					{/if}

					{#if suggestion.category}
						<div class="suggestion-category">
							<Badge variant="neutral" size="sm">{suggestion.category}</Badge>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<div class="empty-icon">✨</div>
			<p class="empty-title">No Improvements Suggested</p>
			<p class="empty-description">
				The code is already optimized and follows best practices.
			</p>
		</div>
	{/if}
</div>

<style>
	.improvements {
		padding: 1rem;
	}

	.improvements-summary {
		padding: 1rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		margin-bottom: 1.5rem;
	}

	.improvements-summary h3 {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 1rem;
	}

	.summary-stats {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	.summary-stat {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.stat-icon {
		font-size: 1rem;
	}

	.stat-count {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.suggestions-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.suggestion-item {
		padding: 1.25rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		transition: all 0.2s ease;
	}

	.suggestion-item:hover {
		border-color: var(--accent-color);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.suggestion-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}

	.suggestion-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
	}

	.suggestion-icon {
		font-size: 1.125rem;
	}

	.suggestion-text {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.suggestion-badges {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.suggestion-description {
		font-size: 0.875rem;
		color: var(--text-secondary);
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	.code-section {
		margin-bottom: 1rem;
	}

	.code-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.code-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.code-block {
		margin: 0;
		padding: 0.875rem;
		background: var(--surface-1);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		overflow-x: auto;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--text-primary);
	}

	.code-block.suggested {
		border-left: 3px solid var(--color-success);
		background: rgba(34, 197, 94, 0.05);
	}

	.suggestion-rationale {
		padding: 0.875rem;
		background: var(--surface-1);
		border-left: 3px solid var(--accent-color);
		border-radius: 6px;
		margin-bottom: 1rem;
	}

	.rationale-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.rationale-text {
		font-size: 0.8125rem;
		color: var(--text-primary);
		line-height: 1.6;
	}

	.suggestion-effort {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		font-size: 0.8125rem;
	}

	.effort-label {
		color: var(--text-secondary);
	}

	.effort-value {
		font-weight: 600;
		color: var(--text-primary);
	}

	.suggestion-category {
		margin-top: 0.75rem;
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.empty-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	.empty-description {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0;
	}

	@media (max-width: 768px) {
		.summary-stats {
			flex-direction: column;
			gap: 0.75rem;
		}

		.suggestion-header {
			flex-direction: column;
		}

		.suggestion-badges {
			align-self: flex-start;
		}
	}
</style>
