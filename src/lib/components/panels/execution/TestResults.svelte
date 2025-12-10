<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import type { TestResults as TestResultsType } from '$lib/types/agents';

	interface Props {
		results: TestResultsType | null;
	}

	let { results }: Props = $props();

	const passRate = $derived(
		results && results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : '0'
	);
</script>

<div class="test-results">
	<h4>Test Results</h4>

	{#if results}
		<div class="results-summary">
			<div class="summary-card passed">
				<span class="count">{results.passed}</span>
				<span class="label">Passed</span>
			</div>

			<div class="summary-card failed">
				<span class="count">{results.failed}</span>
				<span class="label">Failed</span>
			</div>

			<div class="summary-card skipped">
				<span class="count">{results.skipped}</span>
				<span class="label">Skipped</span>
			</div>

			<div class="summary-card total">
				<span class="count">{results.total}</span>
				<span class="label">Total</span>
			</div>
		</div>

		<div class="pass-rate">
			<div class="pass-rate-bar">
				<div class="pass-rate-fill" style="width: {passRate}%"></div>
			</div>
			<span class="pass-rate-text">{passRate}% Pass Rate</span>
		</div>

		{#if results.coverage}
			<div class="coverage">
				<h5>Coverage</h5>
				<div class="coverage-items">
					<div class="coverage-item">
						<span class="coverage-label">Lines:</span>
						<Badge variant={results.coverage.lines >= 80 ? 'success' : 'warning'}>
							{results.coverage.lines}%
						</Badge>
					</div>
					<div class="coverage-item">
						<span class="coverage-label">Functions:</span>
						<Badge variant={results.coverage.functions >= 80 ? 'success' : 'warning'}>
							{results.coverage.functions}%
						</Badge>
					</div>
					<div class="coverage-item">
						<span class="coverage-label">Branches:</span>
						<Badge variant={results.coverage.branches >= 80 ? 'success' : 'warning'}>
							{results.coverage.branches}%
						</Badge>
					</div>
					<div class="coverage-item">
						<span class="coverage-label">Statements:</span>
						<Badge variant={results.coverage.statements >= 80 ? 'success' : 'warning'}>
							{results.coverage.statements}%
						</Badge>
					</div>
				</div>
			</div>
		{/if}

		{#if results.failures.length > 0}
			<div class="failures">
				<h5>Failed Tests</h5>
				{#each results.failures as failure}
					<div class="failure-card">
						<div class="failure-header">
							<span class="failure-name">{failure.testName}</span>
							<span class="failure-path">{failure.filePath}</span>
						</div>
						<pre class="failure-error">{failure.error}</pre>
						{#if failure.stack}
							<details class="failure-stack">
								<summary>Stack Trace</summary>
								<pre>{failure.stack}</pre>
							</details>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	{:else}
		<div class="empty-state">
			<p>Test results will appear here after execution.</p>
		</div>
	{/if}
</div>

<style>
	.test-results {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.test-results h4 {
		margin: 0;
		color: var(--color-brass);
		font-size: 1rem;
	}

	.test-results h5 {
		margin: 0 0 12px 0;
		color: var(--color-text);
		font-size: 0.9375rem;
	}

	.results-summary {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;
	}

	.summary-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 4px;
	}

	.summary-card.passed {
		border-left: 3px solid var(--color-success);
	}

	.summary-card.failed {
		border-left: 3px solid #e8a64d;
	}

	.summary-card.skipped {
		border-left: 3px solid var(--color-text-muted);
	}

	.summary-card.total {
		border-left: 3px solid var(--color-brass);
	}

	.summary-card .count {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.summary-card .label {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.pass-rate {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.pass-rate-bar {
		height: 8px;
		background: var(--color-surface);
		border-radius: 4px;
		overflow: hidden;
	}

	.pass-rate-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-success), var(--color-brass));
		transition: width 0.3s ease;
	}

	.pass-rate-text {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		text-align: center;
	}

	.coverage {
		padding: 16px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 4px;
	}

	.coverage-items {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}

	.coverage-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.coverage-label {
		color: var(--color-text);
		font-size: 0.875rem;
	}

	.failures {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.failure-card {
		padding: 16px;
		background: rgba(232, 166, 77, 0.05);
		border: 1px solid #e8a64d;
		border-radius: 4px;
	}

	.failure-header {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-bottom: 12px;
	}

	.failure-name {
		font-weight: 600;
		color: var(--color-text);
	}

	.failure-path {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		font-family: 'JetBrains Mono', monospace;
	}

	.failure-error {
		margin: 0;
		padding: 12px;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 4px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.875rem;
		color: #e8a64d;
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.failure-stack {
		margin-top: 12px;
	}

	.failure-stack summary {
		cursor: pointer;
		color: var(--color-text-muted);
		font-size: 0.875rem;
		user-select: none;
	}

	.failure-stack pre {
		margin: 8px 0 0 0;
		padding: 12px;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 4px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		color: var(--color-text-muted);
		white-space: pre-wrap;
		word-wrap: break-word;
		max-height: 200px;
		overflow-y: auto;
	}

	.empty-state {
		padding: 48px 24px;
		text-align: center;
		color: var(--color-text-muted);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 4px;
	}

	@media (max-width: 768px) {
		.results-summary {
			grid-template-columns: repeat(2, 1fr);
		}

		.coverage-items {
			grid-template-columns: 1fr;
		}
	}
</style>
