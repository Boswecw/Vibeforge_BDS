<script lang="ts">
	import { evaluatorStore } from '$lib/stores/evaluator.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import { SessionStatus } from '$lib/types/agents';
	import EvaluationRequest from '$lib/components/panels/evaluator/EvaluationRequest.svelte';
	import QualityMetrics from '$lib/components/panels/evaluator/QualityMetrics.svelte';
	import SasCompliance from '$lib/components/panels/evaluator/SasCompliance.svelte';
	import CodeReview from '$lib/components/panels/evaluator/CodeReview.svelte';
	import Improvements from '$lib/components/panels/evaluator/Improvements.svelte';
	import ComparisonView from '$lib/components/panels/evaluator/ComparisonView.svelte';
	import EvaluationHistory from '$lib/components/panels/evaluator/EvaluationHistory.svelte';

	const currentSession = $derived(evaluatorStore.currentSession);
	const isEvaluating = $derived(evaluatorStore.isEvaluating);
	const previousSession = $derived(
		evaluatorStore.sessions.filter(s => s.status === SessionStatus.COMPLETED).slice(-2, -1)[0] || null
	);
</script>

<ErrorBoundary>
	<div class="evaluator-page">
		<header class="page-header">
			<h1>Evaluator Agent</h1>
			<p class="text-muted">Assess quality and SAS compliance</p>
		</header>

		<div class="content-grid">
			<div class="left-column">
				<Panel title="New Evaluation Request">
					<EvaluationRequest />
				</Panel>

				{#if currentSession}
					<Panel title="Evaluation History" class="mt-6">
						<EvaluationHistory />
					</Panel>
				{/if}
			</div>

			<div class="right-column">
				{#if currentSession}
					{#if currentSession.status === SessionStatus.RUNNING}
						<Panel title="Evaluation in Progress">
							<div class="progress-message">
								<div class="spinner"></div>
								<p>Analyzing code quality and compliance...</p>
							</div>
						</Panel>
					{:else if currentSession.status === SessionStatus.COMPLETED && currentSession.assessment}
						<div class="results-container">
							<!-- Quality Metrics -->
							<Panel title="Quality Metrics">
								<QualityMetrics metrics={currentSession.assessment.quality_metrics} />
							</Panel>

							<!-- SAS Compliance -->
							{#if currentSession.assessment.sas_compliance}
								<Panel title="SAS Compliance" class="mt-6">
									<SasCompliance compliance={currentSession.assessment.sas_compliance} />
								</Panel>
							{/if}

							<!-- Code Review -->
							{#if currentSession.assessment.code_review?.findings && currentSession.assessment.code_review.findings.length > 0}
								<Panel title="Code Review" class="mt-6">
									<CodeReview reviews={currentSession.assessment.code_review.findings} />
								</Panel>
							{/if}

							<!-- Improvements -->
							{#if currentSession.assessment.improvements && currentSession.assessment.improvements.length > 0}
								<Panel title="Improvement Suggestions" class="mt-6">
									<Improvements suggestions={currentSession.assessment.improvements} />
								</Panel>
							{/if}

							<!-- Comparison -->
							{#if previousSession && previousSession.assessment}
								<Panel title="Comparison with Previous" class="mt-6">
									<ComparisonView current={currentSession} previous={previousSession} />
								</Panel>
							{/if}
						</div>
					{:else if currentSession.status === SessionStatus.FAILED}
						<Panel title="Evaluation Failed">
							<div class="error-state">
								<svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
									<path
										d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM7 4h2v5H7V4zm0 6h2v2H7v-2z"
									/>
								</svg>
								<h3>Evaluation Failed</h3>
								{#if currentSession.error}
									<p class="error-message">{currentSession.error}</p>
								{/if}
							</div>
						</Panel>
					{/if}
				{:else}
					<Panel title="Welcome">
						<div class="empty-state">
							<div class="empty-icon">🔍</div>
							<h2>Start an Evaluation Session</h2>
							<p>Load execution results from the Execution Agent to begin quality assessment.</p>
						</div>
					</Panel>
				{/if}
			</div>
		</div>
	</div>
</ErrorBoundary>

<style>
	.evaluator-page {
		padding: 24px;
		max-width: 1400px;
		margin: 0 auto;
	}

	.page-header {
		margin-bottom: 24px;
	}

	.page-header h1 {
		font-family: 'Cinzel', serif;
		font-weight: 300;
		font-size: 2rem;
		color: var(--color-text);
		margin-bottom: 8px;
	}

	.text-muted {
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 450px 1fr;
		gap: 24px;
		align-items: start;
	}

	.left-column,
	.right-column {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	:global(.mt-6) {
		margin-top: 24px;
	}

	.results-container {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.progress-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 48px 24px;
		text-align: center;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--border-color);
		border-top-color: var(--accent-color);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 16px;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.progress-message p {
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	.empty-state {
		text-align: center;
		padding: 48px 24px;
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 16px;
	}

	.empty-state h2 {
		font-size: 1.5rem;
		color: var(--color-text);
		margin-bottom: 12px;
	}

	.empty-state p {
		color: var(--color-text-muted);
		font-size: 0.875rem;
		max-width: 400px;
		margin: 0 auto;
	}

	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 48px 24px;
		text-align: center;
	}

	.error-state svg {
		color: var(--color-danger);
		margin-bottom: 16px;
	}

	.error-state h3 {
		font-size: 1.25rem;
		color: var(--text-primary);
		margin-bottom: 12px;
	}

	.error-message {
		color: var(--color-danger);
		font-size: 0.875rem;
		padding: 12px 16px;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 6px;
		max-width: 500px;
	}

	@media (max-width: 1024px) {
		.content-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
