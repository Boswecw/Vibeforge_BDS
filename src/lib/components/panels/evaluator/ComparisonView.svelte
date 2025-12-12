<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { EvaluationSession } from '$lib/types/agents';

	interface Props {
		current: EvaluationSession | null;
		previous: EvaluationSession | null;
	}

	let { current, previous }: Props = $props();

	function calculateImprovement(currentScore: number, previousScore: number): number {
		return ((currentScore - previousScore) / previousScore) * 100;
	}

	function formatImprov(improvement: number): string {
		const sign = improvement >= 0 ? '+' : '';
		return `${sign}${improvement.toFixed(1)}%`;
	}

	const hasImproved = $derived(
		current &&
		previous &&
		current.assessment &&
		previous.assessment &&
		current.assessment.quality_metrics.overall > previous.assessment.quality_metrics.overall
	);
</script>

<div class="comparison-view">
	{#if current && previous && current.assessment && previous.assessment}
		<div class="comparison-header">
			<h3>Before & After Comparison</h3>
			<div class="comparison-meta">
				<Badge variant={hasImproved ? 'success' : 'warning'}>
					{hasImproved ? 'Improved' : 'Declined'}
				</Badge>
			</div>
		</div>

		<div class="comparison-grid">
			<!-- Previous Version -->
			<div class="comparison-column">
				<div class="column-header">
					<h4>Previous Evaluation</h4>
					<span class="column-date">
						{new Date(previous.createdAt).toLocaleDateString()}
					</span>
				</div>

				<div class="metrics-list">
					<div class="metric-item">
						<span class="metric-label">Overall Quality</span>
						<span class="metric-value">
							{(previous.assessment.quality_metrics.overall * 100).toFixed(1)}%
						</span>
					</div>
					<div class="metric-item">
						<span class="metric-label">Code Quality</span>
						<span class="metric-value">
							{(previous.assessment.quality_metrics.code_quality * 100).toFixed(1)}%
						</span>
					</div>
					<div class="metric-item">
						<span class="metric-label">Performance</span>
						<span class="metric-value">
							{(previous.assessment.quality_metrics.performance * 100).toFixed(1)}%
						</span>
					</div>
					<div class="metric-item">
						<span class="metric-label">Security</span>
						<span class="metric-value">
							{(previous.assessment.quality_metrics.security * 100).toFixed(1)}%
						</span>
					</div>
					<div class="metric-item">
						<span class="metric-label">Maintainability</span>
						<span class="metric-value">
							{(previous.assessment.quality_metrics.maintainability * 100).toFixed(1)}%
						</span>
					</div>
				</div>
			</div>

			<!-- Current Version -->
			<div class="comparison-column current">
				<div class="column-header">
					<h4>Current Evaluation</h4>
					<span class="column-date">
						{new Date(current.createdAt).toLocaleDateString()}
					</span>
				</div>

				<div class="metrics-list">
					<div class="metric-item">
						<span class="metric-label">Overall Quality</span>
						<div class="metric-with-change">
							<span class="metric-value">
								{(current.assessment.quality_metrics.overall * 100).toFixed(1)}%
							</span>
							<span class="metric-change" class:positive={calculateImprovement(current.assessment.quality_metrics.overall, previous.assessment.quality_metrics.overall) >= 0} class:negative={calculateImprovement(current.assessment.quality_metrics.overall, previous.assessment.quality_metrics.overall) < 0}>
								{formatImprovement(calculateImprovement(current.assessment.quality_metrics.overall, previous.assessment.quality_metrics.overall))}
							</span>
						</div>
					</div>
					<div class="metric-item">
						<span class="metric-label">Code Quality</span>
						<div class="metric-with-change">
							<span class="metric-value">
								{(current.assessment.quality_metrics.code_quality * 100).toFixed(1)}%
							</span>
							<span class="metric-change" class:positive={calculateImprovement(current.assessment.quality_metrics.code_quality, previous.assessment.quality_metrics.code_quality) >= 0} class:negative={calculateImprovement(current.assessment.quality_metrics.code_quality, previous.assessment.quality_metrics.code_quality) < 0}>
								{formatImprovement(calculateImprovement(current.assessment.quality_metrics.code_quality, previous.assessment.quality_metrics.code_quality))}
							</span>
						</div>
					</div>
					<div class="metric-item">
						<span class="metric-label">Performance</span>
						<div class="metric-with-change">
							<span class="metric-value">
								{(current.assessment.quality_metrics.performance * 100).toFixed(1)}%
							</span>
							<span class="metric-change" class:positive={calculateImprovement(current.assessment.quality_metrics.performance, previous.assessment.quality_metrics.performance) >= 0} class:negative={calculateImprovement(current.assessment.quality_metrics.performance, previous.assessment.quality_metrics.performance) < 0}>
								{formatImprovement(calculateImprovement(current.assessment.quality_metrics.performance, previous.assessment.quality_metrics.performance))}
							</span>
						</div>
					</div>
					<div class="metric-item">
						<span class="metric-label">Security</span>
						<div class="metric-with-change">
							<span class="metric-value">
								{(current.assessment.quality_metrics.security * 100).toFixed(1)}%
							</span>
							<span class="metric-change" class:positive={calculateImprovement(current.assessment.quality_metrics.security, previous.assessment.quality_metrics.security) >= 0} class:negative={calculateImprovement(current.assessment.quality_metrics.security, previous.assessment.quality_metrics.security) < 0}>
								{formatImprovement(calculateImprovement(current.assessment.quality_metrics.security, previous.assessment.quality_metrics.security))}
							</span>
						</div>
					</div>
					<div class="metric-item">
						<span class="metric-label">Maintainability</span>
						<div class="metric-with-change">
							<span class="metric-value">
								{(current.assessment.quality_metrics.maintainability * 100).toFixed(1)}%
							</span>
							<span class="metric-change" class:positive={calculateImprovement(current.assessment.quality_metrics.maintainability, previous.assessment.quality_metrics.maintainability) >= 0} class:negative={calculateImprovement(current.assessment.quality_metrics.maintainability, previous.assessment.quality_metrics.maintainability) < 0}>
								{formatImprovement(calculateImprovement(current.assessment.quality_metrics.maintainability, previous.assessment.quality_metrics.maintainability))}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="empty-state">
			<div class="empty-icon">📊</div>
			<p class="empty-title">No Comparison Available</p>
			<p class="empty-description">
				Run at least two evaluations to compare results.
			</p>
		</div>
	{/if}
</div>

<style>
	.comparison-view {
		padding: 1rem;
	}

	.comparison-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.comparison-header h3 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.comparison-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	.comparison-column {
		padding: 1.25rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 8px;
	}

	.comparison-column.current {
		border: 2px solid var(--accent-color);
	}

	.column-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--border-color);
	}

	.column-header h4 {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.column-date {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.metrics-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.metric-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		background: var(--surface-1);
		border-radius: 6px;
	}

	.metric-label {
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.metric-value {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.metric-with-change {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.metric-change {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	.metric-change.positive {
		color: var(--color-success);
		background: rgba(34, 197, 94, 0.1);
	}

	.metric-change.negative {
		color: var(--color-danger);
		background: rgba(239, 68, 68, 0.1);
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

	@media (max-width: 1024px) {
		.comparison-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
