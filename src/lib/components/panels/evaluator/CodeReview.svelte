<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import type { CodeReviewItem } from '$lib/types/agents';

	interface Props {
		reviews: CodeReviewItem[];
	}

	let { reviews }: Props = $props();

	function getSeverityBadgeVariant(severity: string): 'danger' | 'warning' | 'neutral' | 'success' {
		switch (severity.toLowerCase()) {
			case 'critical':
			case 'error':
				return 'danger';
			case 'warning':
				return 'warning';
			case 'info':
				return 'neutral';
			case 'suggestion':
				return 'success';
			default:
				return 'neutral';
		}
	}

	function getSeverityIcon(severity: string): string {
		switch (severity.toLowerCase()) {
			case 'critical':
			case 'error':
				return '🔴';
			case 'warning':
				return '🟡';
			case 'info':
				return '🔵';
			case 'suggestion':
				return '💡';
			default:
				return '⚪';
		}
	}

	const groupedReviews = $derived(() => {
		const groups: Record<string, CodeReviewItem[]> = {};
		reviews.forEach((review) => {
			const severity = review.severity.toLowerCase();
			if (!groups[severity]) {
				groups[severity] = [];
			}
			groups[severity].push(review);
		});
		return groups;
	});

	const severityOrder = ['critical', 'error', 'warning', 'info', 'suggestion'];
</script>

<div class="code-review">
	{#if reviews.length > 0}
		<!-- Summary -->
		<div class="review-summary">
			<h3>Code Review Summary</h3>
			<div class="summary-stats">
				{#each severityOrder as severity}
					{@const count = groupedReviews()[severity]?.length || 0}
					{#if count > 0}
						<div class="summary-stat">
							<span class="stat-icon">{getSeverityIcon(severity)}</span>
							<span class="stat-count">{count}</span>
							<span class="stat-label">{severity}</span>
						</div>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Review Items -->
		<div class="reviews-list">
			{#each reviews as review}
				<div class="review-item">
					<div class="review-header">
						<div class="review-title">
							<span class="review-icon">{getSeverityIcon(review.severity)}</span>
							<span class="review-message">{review.message}</span>
						</div>
						<Badge variant={getSeverityBadgeVariant(review.severity)}>
							{review.severity}
						</Badge>
					</div>

					{#if review.file}
						<div class="review-location">
							<span class="location-icon">📄</span>
							<span class="location-file">{review.file}</span>
							{#if review.line}
								<span class="location-line">Line {review.line}</span>
							{/if}
						</div>
					{/if}

					{#if review.code}
						<div class="review-code">
							<div class="code-label">Code:</div>
							<pre class="code-block"><code>{review.code}</code></pre>
						</div>
					{/if}

					{#if review.suggestion}
						<div class="review-suggestion">
							<div class="suggestion-label">Suggestion:</div>
							<div class="suggestion-text">{review.suggestion}</div>
						</div>
					{/if}

					{#if review.category}
						<div class="review-category">
							<Badge variant="neutral" size="sm">{review.category}</Badge>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<div class="empty-icon">✅</div>
			<p class="empty-title">No Issues Found</p>
			<p class="empty-description">
				The code review found no critical issues or suggestions.
			</p>
		</div>
	{/if}
</div>

<style>
	.code-review {
		padding: 1rem;
	}

	.review-summary {
		padding: 1rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		margin-bottom: 1.5rem;
	}

	.review-summary h3 {
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
		text-transform: capitalize;
	}

	.reviews-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.review-item {
		padding: 1rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-left: 4px solid var(--border-color);
		border-radius: 6px;
		transition: all 0.2s ease;
	}

	.review-item:hover {
		border-color: var(--accent-color);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.review-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}

	.review-title {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		flex: 1;
	}

	.review-icon {
		font-size: 1rem;
		line-height: 1.5;
	}

	.review-message {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
		line-height: 1.5;
	}

	.review-location {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.location-icon {
		font-size: 0.875rem;
	}

	.location-file {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		color: var(--text-primary);
	}

	.location-line {
		padding: 0.125rem 0.5rem;
		background: var(--surface-1);
		border-radius: 3px;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.review-code,
	.review-suggestion {
		margin-bottom: 0.75rem;
	}

	.code-label,
	.suggestion-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.code-block {
		margin: 0;
		padding: 0.75rem;
		background: var(--surface-1);
		border: 1px solid var(--border-color);
		border-radius: 4px;
		overflow-x: auto;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--text-primary);
	}

	.suggestion-text {
		padding: 0.75rem;
		background: var(--surface-1);
		border-left: 3px solid var(--accent-color);
		border-radius: 4px;
		font-size: 0.8125rem;
		color: var(--text-primary);
		line-height: 1.5;
	}

	.review-category {
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

		.review-header {
			flex-direction: column;
		}
	}
</style>
