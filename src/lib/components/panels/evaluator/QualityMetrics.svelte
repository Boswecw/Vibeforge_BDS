<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import { formatScore, getScoreColor } from '$lib/services/evaluatorService';
	import type { QualityMetrics as QualityMetricsType } from '$lib/types/agents';

	interface Props {
		metrics: QualityMetricsType | null;
	}

	let { metrics }: Props = $props();

	function getScoreGrade(score: number): string {
		if (score >= 0.9) return 'A';
		if (score >= 0.8) return 'B';
		if (score >= 0.7) return 'C';
		if (score >= 0.6) return 'D';
		return 'F';
	}
</script>

<div class="quality-metrics">
	{#if metrics}
		<!-- Overall Score -->
		<div class="overall-score">
			<div class="score-circle" class:excellent={metrics.overall >= 0.8} class:good={metrics.overall >= 0.6 && metrics.overall < 0.8} class:poor={metrics.overall < 0.6}>
				<div class="score-grade">{getScoreGrade(metrics.overall)}</div>
				<div class="score-percent">{formatScore(metrics.overall)}</div>
			</div>
			<div class="score-label">Overall Quality Score</div>
		</div>

		<!-- Individual Metrics -->
		<div class="metrics-grid">
			<!-- Code Quality -->
			<div class="metric-card">
				<div class="metric-header">
					<div class="metric-title">Code Quality</div>
					<Badge variant={getScoreColor(metrics.code_quality)}>
						{formatScore(metrics.code_quality)}
					</Badge>
				</div>
				<div class="metric-bar">
					<div
						class="metric-bar-fill"
						class:success={metrics.code_quality >= 0.8}
						class:warning={metrics.code_quality >= 0.6 && metrics.code_quality < 0.8}
						class:danger={metrics.code_quality < 0.6}
						style="width: {metrics.code_quality * 100}%"
					></div>
				</div>
				<div class="metric-details">
					<span>Readability, organization, naming</span>
				</div>
			</div>

			<!-- Performance -->
			<div class="metric-card">
				<div class="metric-header">
					<div class="metric-title">Performance</div>
					<Badge variant={getScoreColor(metrics.performance)}>
						{formatScore(metrics.performance)}
					</Badge>
				</div>
				<div class="metric-bar">
					<div
						class="metric-bar-fill"
						class:success={metrics.performance >= 0.8}
						class:warning={metrics.performance >= 0.6 && metrics.performance < 0.8}
						class:danger={metrics.performance < 0.6}
						style="width: {metrics.performance * 100}%"
					></div>
				</div>
				<div class="metric-details">
					<span>Efficiency, optimization</span>
				</div>
			</div>

			<!-- Security -->
			<div class="metric-card">
				<div class="metric-header">
					<div class="metric-title">Security</div>
					<Badge variant={getScoreColor(metrics.security)}>
						{formatScore(metrics.security)}
					</Badge>
				</div>
				<div class="metric-bar">
					<div
						class="metric-bar-fill"
						class:success={metrics.security >= 0.8}
						class:warning={metrics.security >= 0.6 && metrics.security < 0.8}
						class:danger={metrics.security < 0.6}
						style="width: {metrics.security * 100}%"
					></div>
				</div>
				<div class="metric-details">
					<span>Vulnerabilities, best practices</span>
				</div>
			</div>

			<!-- Maintainability -->
			<div class="metric-card">
				<div class="metric-header">
					<div class="metric-title">Maintainability</div>
					<Badge variant={getScoreColor(metrics.maintainability)}>
						{formatScore(metrics.maintainability)}
					</Badge>
				</div>
				<div class="metric-bar">
					<div
						class="metric-bar-fill"
						class:success={metrics.maintainability >= 0.8}
						class:warning={metrics.maintainability >= 0.6 && metrics.maintainability < 0.8}
						class:danger={metrics.maintainability < 0.6}
						style="width: {metrics.maintainability * 100}%"
					></div>
				</div>
				<div class="metric-details">
					<span>Modularity, documentation</span>
				</div>
			</div>

			<!-- Test Coverage -->
			{#if metrics.test_coverage !== undefined}
				<div class="metric-card">
					<div class="metric-header">
						<div class="metric-title">Test Coverage</div>
						<Badge variant={getScoreColor(metrics.test_coverage)}>
							{formatScore(metrics.test_coverage)}
						</Badge>
					</div>
					<div class="metric-bar">
						<div
							class="metric-bar-fill"
							class:success={metrics.test_coverage >= 0.8}
							class:warning={metrics.test_coverage >= 0.6 && metrics.test_coverage < 0.8}
							class:danger={metrics.test_coverage < 0.6}
							style="width: {metrics.test_coverage * 100}%"
						></div>
					</div>
					<div class="metric-details">
						<span>Unit & integration tests</span>
					</div>
				</div>
			{/if}

			<!-- Complexity -->
			{#if metrics.complexity}
				<div class="metric-card">
					<div class="metric-header">
						<div class="metric-title">Complexity</div>
						<Badge variant={metrics.complexity === 'low' ? 'success' : metrics.complexity === 'medium' ? 'warning' : 'danger'}>
							{metrics.complexity.toUpperCase()}
						</Badge>
					</div>
					<div class="metric-details">
						<span>Cyclomatic complexity analysis</span>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<div class="empty-state">
			<p class="text-muted">No quality metrics available. Start an evaluation to see metrics.</p>
		</div>
	{/if}
</div>

<style>
	.quality-metrics {
		padding: 1rem;
	}

	.overall-score {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 12px;
	}

	.score-circle {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 4px solid var(--border-color);
		margin-bottom: 1rem;
		transition: all 0.3s ease;
	}

	.score-circle.excellent {
		border-color: var(--color-success);
		background: rgba(34, 197, 94, 0.1);
	}

	.score-circle.good {
		border-color: var(--color-warning);
		background: rgba(251, 191, 36, 0.1);
	}

	.score-circle.poor {
		border-color: var(--color-danger);
		background: rgba(239, 68, 68, 0.1);
	}

	.score-grade {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--text-primary);
		line-height: 1;
	}

	.score-percent {
		font-size: 1rem;
		font-weight: 500;
		color: var(--text-secondary);
	}

	.score-label {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
		text-align: center;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}

	.metric-card {
		padding: 1rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		transition: all 0.2s ease;
	}

	.metric-card:hover {
		border-color: var(--accent-color);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.metric-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.metric-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.metric-bar {
		height: 8px;
		background: var(--surface-1);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.metric-bar-fill {
		height: 100%;
		border-radius: 4px;
		transition: all 0.3s ease;
	}

	.metric-bar-fill.success {
		background: linear-gradient(90deg, var(--color-success), #10b981);
	}

	.metric-bar-fill.warning {
		background: linear-gradient(90deg, var(--color-warning), #f59e0b);
	}

	.metric-bar-fill.danger {
		background: linear-gradient(90deg, var(--color-danger), #dc2626);
	}

	.metric-details {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
	}

	.text-muted {
		color: var(--text-secondary);
	}

	@media (max-width: 768px) {
		.metrics-grid {
			grid-template-columns: 1fr;
		}

		.score-circle {
			width: 100px;
			height: 100px;
		}

		.score-grade {
			font-size: 2rem;
		}
	}
</style>
