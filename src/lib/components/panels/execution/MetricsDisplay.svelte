<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import type { ExecutionMetrics } from '$lib/types/agents';

	interface Props {
		metrics: ExecutionMetrics | null;
	}

	let { metrics }: Props = $props();

	function formatCost(cost: number): string {
		return `$${cost.toFixed(4)}`;
	}

	function formatDuration(ms: number): string {
		if (ms < 1000) return `${ms}ms`;
		if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
		return `${(ms / 60000).toFixed(1)}m`;
	}

	function formatTokens(tokens: number): string {
		if (tokens < 1000) return tokens.toString();
		if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`;
		return `${(tokens / 1000000).toFixed(1)}M`;
	}
</script>

<div class="metrics-display">
	{#if metrics}
		<div class="metrics-grid">
			<!-- Token Usage -->
			<div class="metric-card">
				<div class="metric-icon">🔢</div>
				<div class="metric-content">
					<div class="metric-label">Tokens Used</div>
					<div class="metric-value">{formatTokens(metrics.tokensUsed)}</div>
					<div class="metric-detail">
						<span class="text-muted">Input: {formatTokens(metrics.inputTokens)}</span>
						<span class="text-muted">Output: {formatTokens(metrics.outputTokens)}</span>
					</div>
				</div>
			</div>

			<!-- Cost -->
			<div class="metric-card">
				<div class="metric-icon">💰</div>
				<div class="metric-content">
					<div class="metric-label">Estimated Cost</div>
					<div class="metric-value">{formatCost(metrics.cost)}</div>
					<div class="metric-detail">
						<span class="text-muted">Per 1M tokens</span>
					</div>
				</div>
			</div>

			<!-- Duration -->
			<div class="metric-card">
				<div class="metric-icon">⏱️</div>
				<div class="metric-content">
					<div class="metric-label">Execution Time</div>
					<div class="metric-value">{formatDuration(metrics.duration)}</div>
					<div class="metric-detail">
						<span class="text-muted">
							{metrics.startTime ? new Date(metrics.startTime).toLocaleTimeString() : ''} -
							{metrics.endTime ? new Date(metrics.endTime).toLocaleTimeString() : ''}
						</span>
					</div>
				</div>
			</div>

			<!-- Model Info -->
			<div class="metric-card">
				<div class="metric-icon">🤖</div>
				<div class="metric-content">
					<div class="metric-label">Model</div>
					<div class="metric-value">{metrics.modelUsed || 'Unknown'}</div>
					<div class="metric-detail">
						{#if metrics.provider}
							<Badge variant="neutral">{metrics.provider}</Badge>
						{/if}
					</div>
				</div>
			</div>

			<!-- Files Modified -->
			{#if metrics.filesModified !== undefined}
				<div class="metric-card">
					<div class="metric-icon">📁</div>
					<div class="metric-content">
						<div class="metric-label">Files Modified</div>
						<div class="metric-value">{metrics.filesModified}</div>
						<div class="metric-detail">
							{#if metrics.linesAdded !== undefined && metrics.linesRemoved !== undefined}
								<span class="text-success">+{metrics.linesAdded}</span>
								<span class="text-danger">-{metrics.linesRemoved}</span>
							{/if}
						</div>
					</div>
				</div>
			{/if}

			<!-- Test Execution -->
			{#if metrics.testsRun !== undefined}
				<div class="metric-card">
					<div class="metric-icon">🧪</div>
					<div class="metric-content">
						<div class="metric-label">Tests Executed</div>
						<div class="metric-value">{metrics.testsRun}</div>
						<div class="metric-detail">
							{#if metrics.testsPassed !== undefined && metrics.testsFailed !== undefined}
								<span class="text-success">{metrics.testsPassed} passed</span>
								<span class="text-danger">{metrics.testsFailed} failed</span>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Performance Insights -->
		{#if metrics.tokensUsed > 100000}
			<div class="insights">
				<div class="insight-card warning">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
						<path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM7 4h2v5H7V4zm0 6h2v2H7v-2z"/>
					</svg>
					<span>High token usage detected. Consider breaking down complex tasks.</span>
				</div>
			</div>
		{/if}

		{#if metrics.duration > 300000}
			<div class="insights">
				<div class="insight-card info">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
						<path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm1 12H7V7h2v5zm0-6H7V4h2v2z"/>
					</svg>
					<span>Long execution time. Consider optimizing prompts or breaking into smaller steps.</span>
				</div>
			</div>
		{/if}
	{:else}
		<div class="empty-state">
			<p class="text-muted">No metrics available yet. Start an execution to see metrics.</p>
		</div>
	{/if}
</div>

<style>
	.metrics-display {
		padding: 1rem;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.metric-card {
		display: flex;
		gap: 0.75rem;
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

	.metric-icon {
		font-size: 1.5rem;
		line-height: 1;
	}

	.metric-content {
		flex: 1;
		min-width: 0;
	}

	.metric-label {
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-secondary);
		margin-bottom: 0.25rem;
	}

	.metric-value {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
	}

	.metric-detail {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-size: 0.75rem;
	}

	.text-muted {
		color: var(--text-secondary);
	}

	.text-success {
		color: var(--color-success);
	}

	.text-danger {
		color: var(--color-danger);
	}

	.insights {
		margin-top: 1rem;
	}

	.insight-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-radius: 6px;
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
	}

	.insight-card.warning {
		background: rgba(255, 193, 7, 0.1);
		border: 1px solid rgba(255, 193, 7, 0.3);
		color: var(--color-warning);
	}

	.insight-card.info {
		background: rgba(33, 150, 243, 0.1);
		border: 1px solid rgba(33, 150, 243, 0.3);
		color: var(--color-info);
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
	}

	@media (max-width: 768px) {
		.metrics-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
