<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { skillRegistry } from '$lib/api/skillRegistry';
	import { forgeAgentsClient } from '$lib/api/forgeAgentsClient';
	import type { Skill, SkillInvocationResponse } from '$lib/api/types';

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
		<div class="error-state">
			<p class="error-message">{error}</p>
			<a href="/library" class="btn-back">Back to Library</a>
		</div>
	{:else if skill}
		<div class="skill-detail">
			<!-- Header -->
			<div class="detail-header">
				<a href="/library" class="back-link">← Back to Library</a>
				<div class="header-content">
					<div class="header-main">
						<h1>{skill.name}</h1>
						<span class="skill-access {skill.access.toLowerCase()}">{skill.access}</span>
					</div>
					<p class="skill-description">{skill.description}</p>
				</div>
			</div>

			<!-- Metadata -->
			<div class="skill-metadata">
				<div class="meta-group">
					<span class="meta-label">Skill ID:</span>
					<span class="meta-value">{skill.id}</span>
				</div>
				<div class="meta-group">
					<span class="meta-label">Section:</span>
					<span class="meta-value">{skill.section}</span>
				</div>
				<div class="meta-group">
					<span class="meta-label">Category:</span>
					<span class="meta-value">{skill.category}</span>
				</div>
				<div class="meta-group">
					<span class="meta-label">Est. Cost:</span>
					<span class="meta-value cost"
						>${skill.estimatedCost.min.toFixed(3)} - ${skill.estimatedCost.max.toFixed(3)}</span
					>
				</div>
			</div>

			<!-- Tags -->
			{#if skill.tags.length > 0}
				<div class="skill-tags">
					<span class="tags-label">Tags:</span>
					<div class="tags-list">
						{#each skill.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Main Content -->
			<div class="content-grid">
				<!-- Inputs Panel -->
				<div class="inputs-panel">
					<h2>Inputs</h2>

					{#if Object.keys(skill.inputs).length === 0}
						<p class="no-inputs">This skill requires no inputs.</p>
					{:else}
						<div class="inputs-form">
							{#each Object.entries(skill.inputs) as [key, input]}
								<div class="input-group">
									<label for={key}>
										{key}
										{#if input.required}
											<span class="required">*</span>
										{/if}
									</label>
									{#if input.description}
										<p class="input-description">{input.description}</p>
									{/if}

									{#if input.type === 'string'}
										<input type="text" id={key} bind:value={inputs[key]} class="input-field" />
									{:else if input.type === 'number'}
										<input type="number" id={key} bind:value={inputs[key]} class="input-field" />
									{:else if input.type === 'boolean'}
										<input type="checkbox" id={key} bind:checked={inputs[key]} class="input-checkbox" />
									{:else if input.type === 'array'}
										<textarea id={key} bind:value={inputs[key]} class="input-textarea" rows="3"></textarea>
										<p class="input-hint">Enter comma-separated values</p>
									{:else}
										<textarea id={key} bind:value={inputs[key]} class="input-textarea" rows="5"></textarea>
									{/if}
								</div>
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

						<div class="option-group">
							<label for="model">Model:</label>
							<select id="model" bind:value={selectedModel} class="option-select">
								<option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
								<option value="gpt-4-turbo">GPT-4 Turbo</option>
								<option value="gpt-4">GPT-4</option>
							</select>
						</div>

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
					<button onclick={invokeSkill} disabled={invoking} class="btn-invoke">
						{#if invoking}
							<span class="btn-spinner"></span>
							Invoking...
						{:else}
							Invoke Skill
						{/if}
					</button>
				</div>

				<!-- Output Panel -->
				<div class="output-panel">
					<div class="output-header">
						<h2>Output</h2>
						{#if invocationResult || streamingOutput}
							<button onclick={resetInvocation} class="btn-clear-output">Clear</button>
						{/if}
					</div>

					{#if error}
						<div class="output-error">
							<h3>Error</h3>
							<p>{error}</p>
						</div>
					{:else if invoking}
						<div class="output-loading">
							{#if isStreaming}
								<div class="streaming-output">
									<pre>{streamingOutput}</pre>
									<div class="streaming-indicator">Streaming...</div>
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
									<span class="meta-label">Session ID:</span>
									<span class="meta-value">{invocationResult.sessionId}</span>
								</div>
								<div class="meta-item">
									<span class="meta-label">Model:</span>
									<span class="meta-value">{invocationResult.metadata.model_used}</span>
								</div>
								<div class="meta-item">
									<span class="meta-label">Tokens:</span>
									<span class="meta-value">{invocationResult.metadata.tokens_used}</span>
								</div>
								<div class="meta-item">
									<span class="meta-label">Cost:</span>
									<span class="meta-value">${invocationResult.metadata.cost.toFixed(4)}</span>
								</div>
								<div class="meta-item">
									<span class="meta-label">Latency:</span>
									<span class="meta-value">{invocationResult.metadata.latency_ms}ms</span>
								</div>
							</div>

							{#if invocationResult.status === 'success'}
								<div class="output-content">
									<pre>{invocationResult.output}</pre>
								</div>
							{:else}
								<div class="output-error">
									<h3>Execution Error</h3>
									<p>{invocationResult.error}</p>
								</div>
							{/if}
						</div>
					{:else}
						<div class="output-empty">
							<p>No output yet. Configure inputs and click "Invoke Skill" to run.</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.skill-detail-container {
		height: 100vh;
		padding: 1.5rem;
		background: var(--bg-primary, #0a0a0a);
		color: var(--text-primary, #e0e0e0);
		overflow-y: auto;
	}

	.loading-state,
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 4rem 2rem;
		text-align: center;
	}

	.spinner,
	.btn-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--border, #333);
		border-top-color: var(--accent, #fb923c);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.btn-spinner {
		width: 16px;
		height: 16px;
		border-width: 2px;
		display: inline-block;
		margin-right: 0.5rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.error-message {
		color: #ef4444;
	}

	.back-link,
	.btn-back {
		display: inline-block;
		padding: 0.5rem 1rem;
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		color: var(--text-primary, #e0e0e0);
		text-decoration: none;
		font-size: 0.875rem;
		transition: all 0.2s;
	}

	.back-link:hover,
	.btn-back:hover {
		border-color: var(--accent, #fb923c);
	}

	.detail-header {
		margin-bottom: 1.5rem;
	}

	.header-content {
		margin-top: 1rem;
	}

	.header-main {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0;
		color: var(--accent, #fb923c);
	}

	.skill-access {
		padding: 0.375rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: 4px;
	}

	.skill-access.public {
		background: rgba(34, 197, 94, 0.2);
		color: #22c55e;
	}

	.skill-access.bds_only {
		background: rgba(245, 158, 11, 0.2);
		color: #f59e0b;
	}

	.skill-description {
		font-size: 1rem;
		color: var(--text-secondary, #9ca3af);
		line-height: 1.6;
		margin: 0;
	}

	.skill-metadata {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		padding: 1rem;
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		border-radius: 8px;
		margin-bottom: 1.5rem;
	}

	.meta-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.meta-label {
		font-size: 0.75rem;
		color: var(--text-tertiary, #6b7280);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.meta-value {
		font-size: 0.875rem;
		color: var(--text-primary, #e0e0e0);
	}

	.meta-value.cost {
		color: var(--accent, #fb923c);
		font-weight: 600;
	}

	.skill-tags {
		margin-bottom: 1.5rem;
	}

	.tags-label {
		display: block;
		font-size: 0.75rem;
		color: var(--text-tertiary, #6b7280);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.5rem;
	}

	.tags-list {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tag {
		padding: 0.375rem 0.75rem;
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		font-size: 0.875rem;
		color: var(--text-secondary, #9ca3af);
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	.inputs-panel,
	.output-panel {
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border, #333);
		border-radius: 8px;
		padding: 1.5rem;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
		color: var(--text-primary, #e0e0e0);
	}

	h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 0.75rem 0;
		color: var(--text-primary, #e0e0e0);
	}

	.no-inputs {
		color: var(--text-secondary, #9ca3af);
		font-style: italic;
	}

	.inputs-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.input-group label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary, #e0e0e0);
	}

	.required {
		color: #ef4444;
	}

	.input-description {
		font-size: 0.75rem;
		color: var(--text-secondary, #9ca3af);
		margin: 0;
	}

	.input-field,
	.input-textarea {
		padding: 0.5rem 0.75rem;
		background: var(--bg-tertiary, #0a0a0a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		color: var(--text-primary, #e0e0e0);
		font-size: 0.875rem;
		font-family: inherit;
	}

	.input-textarea {
		resize: vertical;
		font-family: 'Courier New', monospace;
	}

	.input-checkbox {
		width: 20px;
		height: 20px;
	}

	.input-hint {
		font-size: 0.75rem;
		color: var(--text-tertiary, #6b7280);
		margin: 0;
	}

	.options-panel {
		padding: 1rem;
		background: var(--bg-tertiary, #0a0a0a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.option-group {
		margin-bottom: 0.75rem;
	}

	.option-group label {
		display: block;
		font-size: 0.875rem;
		color: var(--text-secondary, #9ca3af);
		margin-bottom: 0.375rem;
	}

	.option-select,
	.option-slider {
		width: 100%;
		padding: 0.375rem 0.5rem;
		background: var(--bg-primary, #0a0a0a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		color: var(--text-primary, #e0e0e0);
		font-size: 0.875rem;
	}

	.btn-invoke {
		width: 100%;
		padding: 0.75rem 1rem;
		background: var(--accent, #fb923c);
		border: none;
		border-radius: 4px;
		color: #0a0a0a;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-invoke:hover:not(:disabled) {
		background: #f97316;
	}

	.btn-invoke:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.output-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.btn-clear-output {
		padding: 0.375rem 0.75rem;
		background: var(--bg-tertiary, #0a0a0a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		color: var(--text-primary, #e0e0e0);
		font-size: 0.875rem;
		cursor: pointer;
	}

	.output-empty,
	.output-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 3rem 1rem;
		color: var(--text-secondary, #9ca3af);
		text-align: center;
	}

	.output-success {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.output-metadata {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--bg-tertiary, #0a0a0a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
	}

	.meta-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.meta-label {
		font-size: 0.75rem;
		color: var(--text-tertiary, #6b7280);
	}

	.output-content {
		padding: 1rem;
		background: var(--bg-tertiary, #0a0a0a);
		border: 1px solid var(--border, #333);
		border-radius: 4px;
		max-height: 600px;
		overflow-y: auto;
	}

	.output-content pre {
		margin: 0;
		white-space: pre-wrap;
		word-wrap: break-word;
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--text-primary, #e0e0e0);
	}

	.output-error {
		padding: 1rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid #ef4444;
		border-radius: 4px;
	}

	.output-error h3 {
		color: #ef4444;
		margin-bottom: 0.5rem;
	}

	.output-error p {
		color: #fca5a5;
		margin: 0;
	}

	.streaming-output {
		width: 100%;
	}

	.streaming-indicator {
		margin-top: 0.5rem;
		color: var(--accent, #fb923c);
		font-size: 0.875rem;
		font-weight: 600;
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
