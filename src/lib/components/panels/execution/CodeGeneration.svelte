<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	interface Props {
		code: string;
		isStreaming: boolean;
		language?: string;
	}

	let { code, isStreaming, language = 'typescript' }: Props = $props();

	let codeContainer: HTMLPreElement;

	async function copyCode(): Promise<void> {
		try {
			await navigator.clipboard.writeText(code);
			// TODO: Show success toast
		} catch (err) {
			console.error('Failed to copy code:', err);
		}
	}
</script>

<div class="code-generation">
	<div class="code-header">
		<h4>Generated Code</h4>
		<div class="code-actions">
			<Button variant="secondary" size="small" onclick={copyCode} disabled={!code}>
				Copy
			</Button>
		</div>
	</div>

	{#if code || isStreaming}
		<div class="code-container" class:streaming={isStreaming}>
			<pre bind:this={codeContainer} class="code-block language-{language}"><code>{code}</code></pre>

			{#if isStreaming}
				<div class="streaming-indicator">
					<div class="dot"></div>
					<div class="dot"></div>
					<div class="dot"></div>
					<span>Generating code...</span>
				</div>
			{/if}
		</div>
	{:else}
		<div class="empty-state">
			<p>Code will appear here when execution starts.</p>
		</div>
	{/if}
</div>

<style>
	.code-generation {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.code-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.code-header h4 {
		margin: 0;
		color: var(--color-brass);
		font-size: 1rem;
	}

	.code-actions {
		display: flex;
		gap: 8px;
	}

	.code-container {
		position: relative;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 4px;
		overflow: hidden;
	}

	.code-container.streaming {
		border-color: var(--color-brass);
	}

	.code-block {
		margin: 0;
		padding: 16px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--color-text);
		max-height: 600px;
		overflow-y: auto;
		white-space: pre;
		overflow-x: auto;
	}

	.streaming-indicator {
		display: flex;
		gap: 8px;
		align-items: center;
		padding: 12px 16px;
		background: rgba(193, 151, 69, 0.05);
		border-top: 1px solid var(--color-border);
	}

	.dot {
		width: 8px;
		height: 8px;
		background: var(--color-brass);
		border-radius: 50%;
		animation: pulse-dot 1.4s ease-in-out infinite;
	}

	.dot:nth-child(1) {
		animation-delay: 0s;
	}

	.dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes pulse-dot {
		0%,
		80%,
		100% {
			opacity: 0.3;
			transform: scale(1);
		}
		40% {
			opacity: 1;
			transform: scale(1.2);
		}
	}

	.streaming-indicator span {
		color: var(--color-brass);
		font-size: 0.875rem;
		font-weight: 600;
	}

	.empty-state {
		padding: 48px 24px;
		text-align: center;
		color: var(--color-text-muted);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 4px;
	}

	/* Custom scrollbar for code block */
	.code-block::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	.code-block::-webkit-scrollbar-track {
		background: var(--color-surface);
	}

	.code-block::-webkit-scrollbar-thumb {
		background: var(--color-border-dark);
		border-radius: 4px;
	}

	.code-block::-webkit-scrollbar-thumb:hover {
		background: var(--color-brass);
	}
</style>
