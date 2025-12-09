<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { skillRegistry } from '$lib/api/skillRegistry';
	import { forgeAgentsClient } from '$lib/api/forgeAgentsClient';
	import type { Skill, SkillInvocationResponse } from '$lib/api/types';
	import { Button, Input, Select, Textarea, Badge, Alert, Panel } from '$lib/components';

	let skill: Skill | null = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Invocation state
	let inputs = $state<Record<string, any>>({});
	let invoking = $state(false);
	let invocationResult: SkillInvocationResponse | null = $state(null);
	let streamingOutput = $state('');
	let isStreaming = $state(false);

	// Options
	let useStreaming = $state(true);
	let selectedModel = $state('claude-3.5-sonnet');
	let temperature = $state(0.2);
	let maxTokens = $state(4096);

	const skillId = $derived($page.params.id);

	onMount(async () => {
		try {
			skill = (await skillRegistry.getSkill(skillId)) || null;
			if (!skill) {
				error = `Skill not found: ${skillId}`;
			}
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load skill';
			loading = false;
		}
	});

	// Initialize inputs when skill loads
	$effect(() => {
		if (skill) {
			const initialInputs: Record<string, any> = {};
			for (const [key, input] of Object.entries(skill.inputs)) {
				if (input.type === 'boolean') initialInputs[key] = false;
				else if (input.type === 'number') initialInputs[key] = 0;
				else if (input.type === 'array') initialInputs[key] = [];
				else initialInputs[key] = '';
			}
			inputs = initialInputs;
		}
	});

	async function invokeSkill() {
		if (!skill || invoking) return;

		invoking = true;
		invocationResult = null;
		streamingOutput = '';
		error = null;

		try {
			if (useStreaming) {
				isStreaming = true;
				const stream = forgeAgentsClient.invokeSkillStreaming(skill.id, {
					inputs,
					options: {
						model: selectedModel,
						temperature,
						max_tokens: maxTokens
					}
				});

				for await (const chunk of stream) {
					streamingOutput += chunk;
				}

				isStreaming = false;
			} else {
				invocationResult = await forgeAgentsClient.invokeSkill(skill.id, {
					inputs,
					options: {
						model: selectedModel,
						temperature,
						max_tokens: maxTokens
					}
				});
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Invocation failed';
			isStreaming = false;
		} finally {
			invoking = false;
		}
	}

	function resetInvocation() {
		invocationResult = null;
		streamingOutput = '';
		error = null;
	}
</script>

<div class="skill-detail-container">
	{#if loading}
		<div class="loading-state">
			<div class="spinner"></div>
			<p>Loading skill...</p>
		</div>
	{:else if error && !skill}
		<Alert variant="error" title="Failed to Load Skill">
			{error}
		</Alert>
		<div style="text-align: center; margin-top: 1rem;">
			<Button variant="secondary" on:click={() => (window.location.href = '/library')}>
				← Back to Library
			</Button>
		</div>
	{:else if skill}
		<div class="skill-detail">
			<!-- Header -->
			<div class="detail-header">
				<Button variant="ghost" size="sm" on:click={() => (window.location.href = '/library')}>
					← Back to Library
				</Button>
				<div class="header-content">
					<div class="header-main">
						<h1>{skill.name}</h1>
						<Badge variant={skill.access === 'PUBLIC' ? 'success' : 'warning'} size="lg">
							{skill.access}
						</Badge>
					</div>
					<p class="skill-description">{skill.description}</p>
				</div>
			</div>

			<!-- Metadata -->
			<Panel variant="bordered" padding="lg">
				<div class="skill-metadata">
					<div class="meta-group">
						<span class="meta-label">Skill ID</span>
						<Badge variant="default" size="sm">{skill.id}</Badge>
					</div>
					<div class="meta-group">
						<span class="meta-label">Section</span>
						<Badge variant="info" size="sm">{skill.section}</Badge>
					</div>
					<div class="meta-group">
						<span class="meta-label">Category</span>
						<Badge variant="info" size="sm">{skill.category}</Badge>
					</div>
					<div class="meta-group">
						<span class="meta-label">Est. Cost</span>
						<Badge variant="accent" size="sm">
							${skill.estimatedCost.min.toFixed(3)} - ${skill.estimatedCost.max.toFixed(3)}
						</Badge>
					</div>
				</div>
			</Panel>

			<!-- Tags -->
			{#if skill.tags.length > 0}
				<div class="skill-tags">
					<span class="tags-label">Tags</span>
					<div class="tags-list">
						{#each skill.tags as tag}
							<Badge variant="default" size="sm" outline>{tag}</Badge>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Main Content -->
			<div class="content-grid">
				<!-- Inputs Panel -->
				<Panel variant="bordered" padding="lg">
					<h2>Inputs</h2>

					{#if Object.keys(skill.inputs).length === 0}
						<p class="no-inputs">This skill requires no inputs.</p>
					{:else}
						<div class="inputs-form">
							{#each Object.entries(skill.inputs) as [key, input]}
								{#if input.type === 'string'}
									<Input
										label={key}
										bind:value={inputs[key]}
										helperText={input.description || ''}
										required={input.required}
										fullWidth
									/>
								{:else if input.type === 'number'}
									<Input
										type="number"
										label={key}
										bind:value={inputs[key]}
										helperText={input.description || ''}
										required={input.required}
										fullWidth
									/>
								{:else if input.type === 'boolean'}
									<div class="checkbox-group">
										<label>
											<input type="checkbox" bind:checked={inputs[key]} />
											{key}
											{#if input.required}<span class="required">*</span>{/if}
										</label>
										{#if input.description}
											<p class="input-description">{input.description}</p>
										{/if}
									</div>
								{:else if input.type === 'array'}
									<Textarea
										label={key}
										bind:value={inputs[key]}
										helperText={input.description || 'Enter comma-separated values'}
										required={input.required}
										rows={3}
										fullWidth
									/>
								{:else}
									<Textarea
										label={key}
										bind:value={inputs[key]}
										helperText={input.description || ''}
										required={input.required}
										rows={5}
										fullWidth
									/>
								{/if}
							{/each}
						</div>
					{/if}

					<!-- Options -->
					<div class="options-panel">
						<h3>Execution Options</h3>

						<div class="option-group">
							<label>
								<input type="checkbox" bind:checked={useStreaming} />
								Enable Streaming
							</label>
						</div>

						<Select
							label="Model"
							bind:value={selectedModel}
							options={[
								{ value: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
								{ value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
								{ value: 'gpt-4', label: 'GPT-4' }
							]}
							fullWidth
						/>

						<div class="option-group">
							<label for="temperature">Temperature: {temperature}</label>
							<input
								type="range"
								id="temperature"
								bind:value={temperature}
								min="0"
								max="1"
								step="0.1"
								class="option-slider"
							/>
						</div>

						<div class="option-group">
							<label for="maxTokens">Max Tokens: {maxTokens}</label>
							<input
								type="range"
								id="maxTokens"
								bind:value={maxTokens}
								min="256"
								max="8192"
								step="256"
								class="option-slider"
							/>
						</div>
					</div>

					<!-- Invoke Button -->
					<Button variant="primary" size="lg" fullWidth loading={invoking} on:click={invokeSkill}>
						Invoke Skill
					</Button>
				</Panel>

				<!-- Output Panel -->
				<Panel variant="bordered" padding="lg">
					<div class="output-header">
						<h2>Output</h2>
						{#if invocationResult || streamingOutput}
							<Button variant="ghost" size="sm" on:click={resetInvocation}>Clear</Button>
						{/if}
					</div>

					{#if error}
						<Alert variant="error" title="Error">
							{error}
						</Alert>
					{:else if invoking}
						<div class="output-loading">
							{#if isStreaming}
								<div class="streaming-output">
									<pre>{streamingOutput}</pre>
									<div class="streaming-indicator">
										<Badge variant="accent" dot>Streaming...</Badge>
									</div>
								</div>
							{:else}
								<div class="spinner"></div>
								<p>Executing skill...</p>
							{/if}
						</div>
					{:else if streamingOutput}
						<div class="output-success">
							<div class="output-content">
								<pre>{streamingOutput}</pre>
							</div>
						</div>
					{:else if invocationResult}
						<div class="output-success">
							<div class="output-metadata">
								<div class="meta-item">
									<span class="meta-label">Session ID</span>
									<Badge variant="default" size="sm">{invocationResult.sessionId}</Badge>
								</div>
								<div class="meta-item">
									<span class="meta-label">Model</span>
									<Badge variant="info" size="sm">{invocationResult.metadata.model_used}</Badge>
								</div>
								<div class="meta-item">
									<span class="meta-label">Tokens</span>
									<Badge variant="default" size="sm">{invocationResult.metadata.tokens_used}</Badge>
								</div>
								<div class="meta-item">
									<span class="meta-label">Cost</span>
									<Badge variant="accent" size="sm">${invocationResult.metadata.cost.toFixed(4)}</Badge>
								</div>
								<div class="meta-item">
									<span class="meta-label">Latency</span>
									<Badge variant="default" size="sm">{invocationResult.metadata.latency_ms}ms</Badge>
								</div>
							</div>

							{#if invocationResult.status === 'success'}
								<div class="output-content">
									<pre>{invocationResult.output}</pre>
								</div>
							{:else}
								<Alert variant="error" title="Execution Error">
									{invocationResult.error}
								</Alert>
							{/if}
						</div>
					{:else}
						<div class="output-empty">
							<p>No output yet. Configure inputs and click "Invoke Skill" to run.</p>
						</div>
					{/if}
				</Panel>
			</div>
		</div>
	{/if}
</div>

<style>
	/* ═══════════════════════════════════════════════════════════════════════
     Skill Detail Container
     ═══════════════════════════════════════════════════════════════════════ */

	.skill-detail-container {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-lg);
		padding: var(--spacing-3xl) var(--spacing-xl);
		text-align: center;
	}

	.spinner {
		width: 48px;
		height: 48px;
		border: 4px solid var(--color-border-subtle);
		border-top-color: var(--color-brass);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* ─────────────────────────────────────────────────────────────────────
     Header Section
     ───────────────────────────────────────────────────────────────────── */

	.detail-header {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.header-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.header-main {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		flex-wrap: wrap;
	}

	h1 {
		font-family: var(--font-family-heading);
		font-size: 2.5rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0;
		letter-spacing: 0.02em;
	}

	.skill-description {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin: 0;
	}

	/* ─────────────────────────────────────────────────────────────────────
     Metadata & Tags
     ───────────────────────────────────────────────────────────────────── */

	.skill-metadata {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--spacing-lg);
	}

	.meta-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.meta-label {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.skill-tags {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.tags-label {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.tags-list {
		display: flex;
		gap: var(--spacing-sm);
		flex-wrap: wrap;
	}

	/* ─────────────────────────────────────────────────────────────────────
     Content Grid
     ───────────────────────────────────────────────────────────────────── */

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-xl);
	}

	h2 {
		font-family: var(--font-family-heading);
		font-size: 1.5rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-lg) 0;
		letter-spacing: 0.02em;
	}

	h3 {
		font-family: var(--font-family-heading);
		font-size: 1.125rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-md) 0;
		letter-spacing: 0.02em;
	}

	/* ─────────────────────────────────────────────────────────────────────
     Inputs Panel
     ───────────────────────────────────────────────────────────────────── */

	.no-inputs {
		color: var(--color-text-secondary);
		font-style: italic;
	}

	.inputs-form {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
		margin-bottom: var(--spacing-xl);
	}

	.checkbox-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.checkbox-group label {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		font-size: 0.875rem;
		color: var(--color-text-primary);
		cursor: pointer;
	}

	.checkbox-group input[type='checkbox'] {
		width: 20px;
		height: 20px;
		cursor: pointer;
	}

	.required {
		color: var(--color-error);
	}

	.input-description {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* ─────────────────────────────────────────────────────────────────────
     Options Panel
     ───────────────────────────────────────────────────────────────────── */

	.options-panel {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		padding: var(--spacing-lg);
		background-color: var(--color-surface-3);
		border-radius: var(--radius-md);
		margin-bottom: var(--spacing-lg);
	}

	.option-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.option-group label {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.option-slider {
		width: 100%;
		height: 6px;
		background: var(--color-surface-2);
		border-radius: var(--radius-sm);
		outline: none;
		cursor: pointer;
	}

	.option-slider::-webkit-slider-thumb {
		appearance: none;
		width: 18px;
		height: 18px;
		background: var(--color-brass);
		border-radius: 50%;
		cursor: pointer;
	}

	.option-slider::-moz-range-thumb {
		width: 18px;
		height: 18px;
		background: var(--color-brass);
		border-radius: 50%;
		cursor: pointer;
		border: none;
	}

	/* ─────────────────────────────────────────────────────────────────────
     Output Panel
     ───────────────────────────────────────────────────────────────────── */

	.output-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-lg);
	}

	.output-empty,
	.output-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-lg);
		padding: var(--spacing-3xl) var(--spacing-xl);
		color: var(--color-text-secondary);
		text-align: center;
	}

	.output-success {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.output-metadata {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		background-color: var(--color-surface-3);
		border-radius: var(--radius-md);
	}

	.meta-item {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.output-content {
		padding: var(--spacing-lg);
		background-color: var(--color-surface-3);
		border-radius: var(--radius-md);
		max-height: 600px;
		overflow-y: auto;
	}

	.output-content pre {
		margin: 0;
		white-space: pre-wrap;
		word-wrap: break-word;
		font-family: var(--font-family-mono);
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--color-text-primary);
	}

	.streaming-output {
		width: 100%;
	}

	.streaming-indicator {
		margin-top: var(--spacing-md);
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	/* ─────────────────────────────────────────────────────────────────────
     Responsive
     ───────────────────────────────────────────────────────────────────── */

	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}

		.content-grid {
			grid-template-columns: 1fr;
		}

		.skill-metadata {
			grid-template-columns: 1fr;
		}

		.output-metadata {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
