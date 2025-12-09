<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		output: string;
		isStreaming: boolean;
	}

	let { output, isStreaming }: Props = $props();

	let outputContainer: HTMLDivElement;
	let shouldAutoScroll = $state(true);

	// Auto-scroll to bottom when new content arrives
	$effect(() => {
		if (outputContainer && shouldAutoScroll && output) {
			outputContainer.scrollTop = outputContainer.scrollHeight;
		}
	});

	function handleScroll(): void {
		if (!outputContainer) return;

		const { scrollTop, scrollHeight, clientHeight } = outputContainer;
		const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
		shouldAutoScroll = isNearBottom;
	}
</script>

<div class="stage-output">
	{#if isStreaming || output}
		<div
			bind:this={outputContainer}
			class="output-container"
			class:streaming={isStreaming}
			on:scroll={handleScroll}
		>
			{#if output}
				<pre class="output-text">{output}</pre>
			{:else}
				<div class="loading-indicator">
					<div class="spinner"></div>
					<p>Waiting for output...</p>
				</div>
			{/if}

			{#if isStreaming}
				<div class="streaming-indicator">
					<div class="dot"></div>
					<div class="dot"></div>
					<div class="dot"></div>
				</div>
			{/if}
		</div>

		{#if !shouldAutoScroll && isStreaming}
			<button
				class="scroll-to-bottom"
				onclick={() => {
					shouldAutoScroll = true;
					if (outputContainer) {
						outputContainer.scrollTop = outputContainer.scrollHeight;
					}
				}}
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path
						d="M8 12L4 8H12L8 12Z"
						fill="currentColor"
					/>
				</svg>
				Scroll to bottom
			</button>
		{/if}
	{:else}
		<div class="empty-state">
			<p>Output will appear here when the planning session starts.</p>
		</div>
	{/if}
</div>

<style>
	.stage-output {
		margin-top: 24px;
		position: relative;
	}

	.output-container {
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 4px;
		padding: 16px;
		max-height: 500px;
		overflow-y: auto;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
		position: relative;
	}

	.output-container.streaming {
		border-color: var(--color-brass);
	}

	.output-text {
		margin: 0;
		white-space: pre-wrap;
		word-wrap: break-word;
		color: var(--color-text);
	}

	.loading-indicator {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 48px 24px;
		color: var(--color-text-muted);
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid rgba(193, 151, 69, 0.1);
		border-top-color: var(--color-brass);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 16px;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.streaming-indicator {
		display: flex;
		gap: 6px;
		align-items: center;
		margin-top: 16px;
		padding-top: 16px;
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

	.scroll-to-bottom {
		position: absolute;
		bottom: 16px;
		right: 16px;
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 12px;
		background: var(--color-brass);
		color: var(--color-bg);
		border: none;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.scroll-to-bottom:hover {
		background: #d4a957;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.empty-state {
		padding: 48px 24px;
		text-align: center;
		color: var(--color-text-muted);
	}

	/* Custom scrollbar */
	.output-container::-webkit-scrollbar {
		width: 8px;
	}

	.output-container::-webkit-scrollbar-track {
		background: var(--color-surface);
		border-radius: 4px;
	}

	.output-container::-webkit-scrollbar-thumb {
		background: var(--color-border-dark);
		border-radius: 4px;
	}

	.output-container::-webkit-scrollbar-thumb:hover {
		background: var(--color-brass);
	}
</style>
