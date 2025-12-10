<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import { startExecutionSession } from '$lib/services/executionService';
	import { executionStore } from '$lib/stores/execution.svelte';
	import type { ExecutionRequest as ExecutionRequestType, PlanningDeliverable } from '$lib/types/agents';
	import type { AppError } from '$lib/utils/errors';

	interface Props {
		planDeliverable?: PlanningDeliverable;
		planSessionId?: string;
	}

	let { planDeliverable, planSessionId }: Props = $props();

	let error = $state<AppError | null>(null);
	let isSubmitting = $state(false);
	let runTests = $state(true);
	let generateDocs = $state(false);
	let autoCommit = $state(false);

	const isExecuting = $derived(executionStore.isExecuting);

	async function handleExecute(): Promise<void> {
		if (!planDeliverable || !planSessionId) {
			return;
		}

		error = null;
		isSubmitting = true;

		const request: ExecutionRequestType = {
			planSessionId,
			plan: planDeliverable,
			options: {
				runTests,
				generateDocs,
				autoCommit
			}
		};

		try {
			const result = await startExecutionSession(request);

			if (!result.success && result.error) {
				error = result.error;
			}
		} catch (err) {
			console.error('Execution error:', err);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="execution-request">
	{#if error}
		<Alert variant="error">
			{error.userMessage}
		</Alert>
	{/if}

	{#if planDeliverable}
		<div class="plan-summary">
			<h3>{planDeliverable.plan.title}</h3>
			<p class="plan-overview">{planDeliverable.plan.overview}</p>

			<div class="plan-meta">
				<Badge variant="info">{planDeliverable.plan.steps.length} steps</Badge>
				<Badge variant="info">{planDeliverable.plan.estimatedEffort}</Badge>
			</div>
		</div>

		<div class="execution-options">
			<h4>Execution Options</h4>

			<label class="option">
				<input type="checkbox" bind:checked={runTests} disabled={isExecuting} />
				<span>Run tests after code generation</span>
			</label>

			<label class="option">
				<input type="checkbox" bind:checked={generateDocs} disabled={isExecuting} />
				<span>Generate documentation</span>
			</label>

			<label class="option">
				<input type="checkbox" bind:checked={autoCommit} disabled={isExecuting} />
				<span>Auto-commit changes (if tests pass)</span>
			</label>
		</div>

		<div class="actions">
			<Button
				variant="primary"
				onclick={handleExecute}
				disabled={isExecuting || isSubmitting}
				loading={isSubmitting}
			>
				{isSubmitting ? 'Starting Execution...' : 'Execute Plan'}
			</Button>
		</div>
	{:else}
		<div class="empty-state">
			<p>Load a plan from the Planning Agent to begin execution.</p>
		</div>
	{/if}
</div>

<style>
	.execution-request {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.plan-summary {
		padding: 16px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 4px;
	}

	.plan-summary h3 {
		margin: 0 0 12px 0;
		color: var(--color-text);
		font-size: 1.125rem;
	}

	.plan-overview {
		color: var(--color-text-muted);
		line-height: 1.6;
		margin-bottom: 16px;
	}

	.plan-meta {
		display: flex;
		gap: 8px;
	}

	.execution-options {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.execution-options h4 {
		margin: 0 0 8px 0;
		color: var(--color-text);
		font-size: 1rem;
	}

	.option {
		display: flex;
		align-items: center;
		gap: 12px;
		cursor: pointer;
		padding: 12px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.option:hover:not(:has(input:disabled)) {
		border-color: var(--color-brass);
		background: var(--color-surface-alt);
	}

	.option input[type='checkbox'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	.option input[type='checkbox']:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.option span {
		color: var(--color-text);
		font-size: 0.9375rem;
	}

	.actions {
		display: flex;
		gap: 12px;
	}

	.empty-state {
		padding: 48px 24px;
		text-align: center;
		color: var(--color-text-muted);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 4px;
	}
</style>
