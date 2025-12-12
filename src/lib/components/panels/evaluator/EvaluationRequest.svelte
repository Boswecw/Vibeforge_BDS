<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import type { ExecutionResult } from '$lib/types/agents';
	import { startEvaluationSession } from '$lib/services/evaluatorService';

	interface Props {
		executionResult?: ExecutionResult;
		executionSessionId?: string;
	}

	let { executionResult, executionSessionId }: Props = $props();

	// Evaluation criteria
	let checkCodeQuality = $state(true);
	let checkSasCompliance = $state(true);
	let checkPerformance = $state(true);
	let checkSecurity = $state(true);
	let checkMaintainability = $state(true);
	let checkTestCoverage = $state(true);

	// Error state
	let error = $state<string | null>(null);
	let isSubmitting = $state(false);

	const hasCriteria = $derived(
		checkCodeQuality ||
		checkSasCompliance ||
		checkPerformance ||
		checkSecurity ||
		checkMaintainability ||
		checkTestCoverage
	);

	async function handleEvaluate(): Promise<void> {
		if (!executionResult) {
			error = 'No execution result to evaluate';
			return;
		}

		if (!hasCriteria) {
			error = 'Please select at least one evaluation criterion';
			return;
		}

		error = null;
		isSubmitting = true;

		try {
			const criteria: string[] = [];
			if (checkCodeQuality) criteria.push('code_quality');
			if (checkSasCompliance) criteria.push('sas_compliance');
			if (checkPerformance) criteria.push('performance');
			if (checkSecurity) criteria.push('security');
			if (checkMaintainability) criteria.push('maintainability');
			if (checkTestCoverage) criteria.push('test_coverage');

			const result = await startEvaluationSession({
				executionSessionId,
				executionResult,
				criteria
			});

			if (!result.success) {
				error = result.error?.message || 'Failed to start evaluation';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="evaluation-request">
	{#if executionResult}
		<div class="execution-summary">
			<h3>Execution Result</h3>
			<div class="summary-stats">
				{#if executionResult.filesModified}
					<div class="stat">
						<span class="stat-icon">📁</span>
						<span class="stat-value">{executionResult.filesModified.length}</span>
						<span class="stat-label">files</span>
					</div>
				{/if}
				{#if executionResult.testResults}
					<div class="stat">
						<span class="stat-icon">🧪</span>
						<span class="stat-value">{executionResult.testResults.passed}/{executionResult.testResults.total}</span>
						<span class="stat-label">tests passed</span>
					</div>
				{/if}
				{#if executionResult.metrics}
					<div class="stat">
						<span class="stat-icon">⏱️</span>
						<span class="stat-value">
							{executionResult.metrics.duration < 1000
								? `${executionResult.metrics.duration}ms`
								: `${(executionResult.metrics.duration / 1000).toFixed(1)}s`}
						</span>
						<span class="stat-label">duration</span>
					</div>
				{/if}
			</div>
		</div>

		<div class="criteria-selection">
			<h3>Evaluation Criteria</h3>
			<p class="text-muted">Select which aspects to evaluate</p>

			<div class="criteria-grid">
				<label class="criterion">
					<input type="checkbox" bind:checked={checkCodeQuality} />
					<div class="criterion-content">
						<div class="criterion-title">Code Quality</div>
						<div class="criterion-description">
							Readability, organization, naming conventions
						</div>
					</div>
				</label>

				<label class="criterion">
					<input type="checkbox" bind:checked={checkSasCompliance} />
					<div class="criterion-content">
						<div class="criterion-title">SAS Compliance</div>
						<div class="criterion-description">
							Adherence to Software Architecture Specification
						</div>
					</div>
				</label>

				<label class="criterion">
					<input type="checkbox" bind:checked={checkPerformance} />
					<div class="criterion-content">
						<div class="criterion-title">Performance</div>
						<div class="criterion-description">
							Efficiency, optimization, resource usage
						</div>
					</div>
				</label>

				<label class="criterion">
					<input type="checkbox" bind:checked={checkSecurity} />
					<div class="criterion-content">
						<div class="criterion-title">Security</div>
						<div class="criterion-description">
							Vulnerabilities, best practices, data protection
						</div>
					</div>
				</label>

				<label class="criterion">
					<input type="checkbox" bind:checked={checkMaintainability} />
					<div class="criterion-content">
						<div class="criterion-title">Maintainability</div>
						<div class="criterion-description">
							Modularity, documentation, future-proofing
						</div>
					</div>
				</label>

				<label class="criterion">
					<input type="checkbox" bind:checked={checkTestCoverage} />
					<div class="criterion-content">
						<div class="criterion-title">Test Coverage</div>
						<div class="criterion-description">
							Unit tests, integration tests, coverage percentage
						</div>
					</div>
				</label>
			</div>
		</div>

		{#if error}
			<Alert variant="error">{error}</Alert>
		{/if}

		<Button
			onclick={handleEvaluate}
			disabled={isSubmitting || !hasCriteria}
			fullWidth
		>
			{isSubmitting ? 'Starting Evaluation...' : 'Evaluate Code'}
		</Button>
	{:else}
		<div class="empty-state">
			<div class="empty-icon">🔍</div>
			<p class="empty-title">No Execution Result</p>
			<p class="empty-description">
				Load an execution result from the Execution Agent to begin evaluation.
			</p>
		</div>
	{/if}
</div>

<style>
	.evaluation-request {
		padding: 1rem;
	}

	.execution-summary {
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 8px;
	}

	.execution-summary h3 {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.75rem;
	}

	.summary-stats {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
	}

	.stat-icon {
		font-size: 1rem;
	}

	.stat-value {
		font-weight: 600;
		color: var(--text-primary);
	}

	.stat-label {
		color: var(--text-secondary);
	}

	.criteria-selection {
		margin-bottom: 1.5rem;
	}

	.criteria-selection h3 {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.375rem;
	}

	.text-muted {
		font-size: 0.75rem;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.criteria-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 0.75rem;
	}

	.criterion {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--surface-2);
		border: 2px solid var(--border-color);
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.criterion:hover {
		border-color: var(--accent-color);
		background: var(--surface-3);
	}

	.criterion input[type='checkbox'] {
		margin-top: 2px;
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	.criterion-content {
		flex: 1;
		min-width: 0;
	}

	.criterion-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
	}

	.criterion-description {
		font-size: 0.75rem;
		color: var(--text-secondary);
		line-height: 1.4;
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
		.criteria-grid {
			grid-template-columns: 1fr;
		}

		.summary-stats {
			flex-direction: column;
			gap: 0.75rem;
		}
	}
</style>
