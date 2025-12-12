<script lang="ts">
	import { forgeAgentsClient } from '$lib/api/forgeAgentsClient';
	import type { SkillInvocationRequest, StreamingMetadata } from '$lib/api/types';
	import { Button, Badge, Panel } from '$lib/components';

	// Props
	interface Props {
		skillId: string;
		skillName: string;
		inputs: Record<string, any>;
		options?: {
			model?: string;
			temperature?: number;
			max_tokens?: number;
		};
		onComplete?: (output: string, metadata: StreamingMetadata) => void;
		onError?: (error: string) => void;
	}

	let {
		skillId,
		skillName,
		inputs,
		options = {},
		onComplete,
		onError
	}: Props = $props();

	// State
	let isStreaming = $state(false);
	let output = $state('');
	let tokens: string[] = $state([]);
	let metadata = $state<StreamingMetadata | null>(null);
	let error = $state<string | null>(null);
	let abortController: AbortController | null = $state(null);
	let startTime = $state<number>(0);
	let elapsedTime = $state(0);

	// Timer for elapsed time
	let timerInterval: NodeJS.Timeout | null = null;

	// Derived
	let tokenCount = $derived(tokens.length);
	let estimatedCost = $derived(
		metadata ? metadata.cost : (tokenCount * 0.00002) // Rough estimate
	);

	// Functions
	async function startStreaming() {
		isStreaming = true;
		output = '';
		tokens = [];
		metadata = null;
		error = null;
		startTime = Date.now();
		elapsedTime = 0;

		// Start timer
		timerInterval = setInterval(() => {
			elapsedTime = (Date.now() - startTime) / 1000;
		}, 100);

		try {
			abortController = new AbortController();

			const request: SkillInvocationRequest = {
				inputs,
				options: {
					model: options.model || 'gpt-4o-mini',
					temperature: options.temperature || 0.7,
					max_tokens: options.max_tokens || 4096
				}
			};

			const stream = forgeAgentsClient.invokeSkillStreaming(skillId, request);

			for await (const event of stream) {
				if (abortController.signal.aborted) {
					break;
				}

				if (event.type === 'token') {
					const tokenData = event.data;
					tokens = [...tokens, tokenData.token];
					output += tokenData.token;
				} else if (event.type === 'metadata') {
					metadata = event.data;
				} else if (event.type === 'error') {
					error = event.data;
					if (onError) onError(event.data);
				}
			}

			// Streaming complete
			if (!error && metadata && onComplete) {
				onComplete(output, metadata);
			}
		} catch (err: any) {
			error = err.message || 'Streaming failed';
			if (onError) onError(error);
		} finally {
			isStreaming = false;
			abortController = null;

			// Stop timer
			if (timerInterval) {
				clearInterval(timerInterval);
				timerInterval = null;
			}
		}
	}

	function abortStreaming() {
		if (abortController) {
			abortController.abort();
			abortController = null;
		}
		isStreaming = false;

		// Stop timer
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	// Cleanup
	$effect(() => {
		return () => {
			if (timerInterval) {
				clearInterval(timerInterval);
			}
		};
	});
</script>

<div class="streaming-execution-panel">
	<!-- Header -->
	<div class="header">
		<div class="title-section">
			<h3 class="skill-name">{skillName}</h3>
			<Badge variant={isStreaming ? 'primary' : 'secondary'}>
				{isStreaming ? 'Streaming...' : 'Ready'}
			</Badge>
		</div>

		<div class="controls">
			{#if !isStreaming}
				<Button variant="primary" onclick={startStreaming}>
					<span class="icon">▶</span>
					Start Streaming
				</Button>
			{:else}
				<Button variant="danger" onclick={abortStreaming}>
					<span class="icon">⏹</span>
					Abort
				</Button>
			{/if}
		</div>
	</div>

	<!-- Stats -->
	<div class="stats-bar">
		<div class="stat">
			<span class="stat-label">Tokens:</span>
			<span class="stat-value">{tokenCount}</span>
		</div>
		<div class="stat">
			<span class="stat-label">Cost:</span>
			<span class="stat-value">${estimatedCost.toFixed(4)}</span>
		</div>
		<div class="stat">
			<span class="stat-label">Elapsed:</span>
			<span class="stat-value">{elapsedTime.toFixed(2)}s</span>
		</div>
		{#if metadata}
			<div class="stat">
				<span class="stat-label">Model:</span>
				<span class="stat-value">{metadata.model}</span>
			</div>
			<div class="stat">
				<span class="stat-label">Latency:</span>
				<span class="stat-value">{(metadata.latency * 1000).toFixed(0)}ms</span>
			</div>
		{/if}
	</div>

	<!-- Output -->
	<Panel class="output-panel">
		<div class="output-header">
			<h4>Output</h4>
			{#if output}
				<Button
					variant="secondary"
					size="sm"
					onclick={() => {
						navigator.clipboard.writeText(output);
					}}
				>
					Copy
				</Button>
			{/if}
		</div>

		<div class="output-content">
			{#if isStreaming || output}
				<pre class="streaming-output">{output}<span class="cursor"></span></pre>
			{:else if error}
				<div class="error-message">
					<span class="error-icon">⚠️</span>
					{error}
				</div>
			{:else}
				<div class="placeholder">
					Click "Start Streaming" to begin execution
				</div>
			{/if}
		</div>
	</Panel>

	<!-- Metadata -->
	{#if metadata}
		<Panel class="metadata-panel">
			<h4>Execution Metadata</h4>
			<div class="metadata-grid">
				<div class="metadata-item">
					<span class="metadata-label">Session ID:</span>
					<code class="metadata-value">{metadata.sessionId}</code>
				</div>
				<div class="metadata-item">
					<span class="metadata-label">Skill ID:</span>
					<code class="metadata-value">{metadata.skillId}</code>
				</div>
				<div class="metadata-item">
					<span class="metadata-label">Model:</span>
					<code class="metadata-value">{metadata.model}</code>
				</div>
				<div class="metadata-item">
					<span class="metadata-label">Tokens Used:</span>
					<code class="metadata-value">{metadata.tokensUsed}</code>
				</div>
				<div class="metadata-item">
					<span class="metadata-label">Cost:</span>
					<code class="metadata-value">${metadata.cost.toFixed(4)}</code>
				</div>
				<div class="metadata-item">
					<span class="metadata-label">Latency:</span>
					<code class="metadata-value">{(metadata.latency * 1000).toFixed(0)}ms</code>
				</div>
				<div class="metadata-item">
					<span class="metadata-label">Timestamp:</span>
					<code class="metadata-value">{new Date(metadata.timestamp).toLocaleString()}</code>
				</div>
			</div>
		</Panel>
	{/if}
</div>

<style>
	.streaming-execution-panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: var(--color-surface-secondary);
		border-radius: var(--radius-md);
	}

	.title-section {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.skill-name {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
		color: var(--color-text-primary);
	}

	.controls {
		display: flex;
		gap: 0.5rem;
	}

	.icon {
		margin-right: 0.5rem;
	}

	.stats-bar {
		display: flex;
		gap: 2rem;
		padding: 0.75rem 1rem;
		background: var(--color-surface-tertiary);
		border-radius: var(--radius-md);
	}

	.stat {
		display: flex;
		gap: 0.5rem;
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.stat-value {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
		font-family: var(--font-mono);
	}

	.output-panel {
		min-height: 300px;
	}

	.output-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--color-border);
	}

	.output-header h4 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
	}

	.output-content {
		position: relative;
	}

	.streaming-output {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--color-text-primary);
		white-space: pre-wrap;
		word-wrap: break-word;
		margin: 0;
		padding: 1rem;
		background: var(--color-surface-tertiary);
		border-radius: var(--radius-sm);
	}

	.cursor {
		display: inline-block;
		width: 0.5rem;
		height: 1rem;
		background: var(--color-primary);
		animation: blink 1s infinite;
		vertical-align: text-bottom;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}

	.placeholder {
		padding: 3rem 2rem;
		text-align: center;
		color: var(--color-text-tertiary);
		font-size: 0.95rem;
	}

	.error-message {
		padding: 1rem;
		background: var(--color-danger-background);
		color: var(--color-danger);
		border-radius: var(--radius-sm);
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.error-icon {
		font-size: 1.5rem;
	}

	.metadata-panel h4 {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 600;
	}

	.metadata-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 0.75rem;
	}

	.metadata-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.metadata-label {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.metadata-value {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-text-primary);
		background: var(--color-surface-tertiary);
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-sm);
	}
</style>
