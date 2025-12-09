<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import { startPlanningSession, validatePlanningRequest } from '$lib/services/planningService';
	import { planningStore } from '$lib/stores/planning.svelte';
	import type { PlanningRequest } from '$lib/types/agents';
	import type { AppError } from '$lib/utils/errors';

	let title = $state('');
	let description = $state('');
	let error = $state<AppError | null>(null);
	let isSubmitting = $state(false);

	const isStreaming = $derived(planningStore.isStreaming);

	async function handleSubmit(): Promise<void> {
		error = null;

		const request: PlanningRequest = {
			title: title.trim(),
			description: description.trim()
		};

		// Validate
		const validationError = validatePlanningRequest(request);
		if (validationError) {
			error = validationError;
			return;
		}

		isSubmitting = true;

		try {
			const result = await startPlanningSession(request);

			if (!result.success && result.error) {
				error = result.error;
				isSubmitting = false;
				return;
			}

			// Success - clear form
			title = '';
			description = '';
			isSubmitting = false;
		} catch (err) {
			isSubmitting = false;
		}
	}

	function handleClear(): void {
		title = '';
		description = '';
		error = null;
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="request-form">
	{#if error}
		<Alert variant="error">
			{error.userMessage}
		</Alert>
	{/if}

	<Input
		label="Task Title"
		placeholder="e.g., Add user authentication system"
		bind:value={title}
		maxlength={200}
		required
		disabled={isStreaming || isSubmitting}
	/>

	<Textarea
		label="Description"
		placeholder="Provide detailed requirements, constraints, and context for this task..."
		bind:value={description}
		rows={8}
		maxlength={5000}
		required
		disabled={isStreaming || isSubmitting}
	/>

	<div class="form-actions">
		<Button
			type="submit"
			variant="primary"
			disabled={isStreaming || isSubmitting || !title.trim() || !description.trim()}
			loading={isSubmitting}
		>
			{isSubmitting ? 'Starting...' : 'Start Planning'}
		</Button>

		<Button type="button" variant="secondary" onclick={handleClear} disabled={isStreaming || isSubmitting}>
			Clear
		</Button>
	</div>

	<div class="form-hint">
		<p>
			The Planning Agent will analyze your request and generate a detailed implementation plan with
			specific steps, acceptance criteria, and risk assessment.
		</p>
	</div>
</form>

<style>
	.request-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.form-actions {
		display: flex;
		gap: 12px;
		margin-top: 8px;
	}

	.form-hint {
		margin-top: 8px;
		padding: 12px;
		background: rgba(193, 151, 69, 0.05);
		border-left: 3px solid var(--color-brass);
		border-radius: 4px;
	}

	.form-hint p {
		color: var(--color-text-muted);
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0;
	}
</style>
