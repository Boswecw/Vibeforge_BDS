<script lang="ts">
	import type { PlanningDeliverable } from '$lib/types/agents';
	import Button from '$lib/components/Button.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import { formatTokens, formatCost, formatDuration } from '$lib/services/planningService';

	interface Props {
		deliverable: PlanningDeliverable;
	}

	let { deliverable }: Props = $props();

	let activeTab = $state<'plan' | 'prompt'>('plan');

	async function copyToClipboard(text: string): Promise<void> {
		try {
			await navigator.clipboard.writeText(text);
			// TODO: Show success toast
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function downloadAsFile(content: string, filename: string): void {
		const blob = new Blob([content], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="deliverable-viewer">
	<!-- Tabs -->
	<div class="tabs">
		<button class="tab" class:active={activeTab === 'plan'} onclick={() => (activeTab = 'plan')}>
			Implementation Plan
		</button>
		<button class="tab" class:active={activeTab === 'prompt'} onclick={() => (activeTab = 'prompt')}>
			Execution Prompt
		</button>
	</div>

	<!-- Tab Content -->
	<div class="tab-content">
		{#if activeTab === 'plan'}
			<div class="plan-view">
				<!-- Plan Header -->
				<div class="plan-header">
					<h2>{deliverable.plan.title}</h2>
					<div class="plan-actions">
						<Button
							variant="secondary"
							size="small"
							onclick={() => copyToClipboard(JSON.stringify(deliverable.plan, null, 2))}
						>
							Copy
						</Button>
						<Button
							variant="secondary"
							size="small"
							onclick={() => downloadAsFile(JSON.stringify(deliverable.plan, null, 2), `${deliverable.plan.title}.json`)}
						>
							Download
						</Button>
					</div>
				</div>

				<!-- Overview -->
				<div class="plan-section">
					<h3>Overview</h3>
					<p class="overview-text">{deliverable.plan.overview}</p>
				</div>

				<!-- Estimated Effort -->
				<div class="plan-section">
					<h3>Estimated Effort</h3>
					<Badge variant="info">{deliverable.plan.estimatedEffort}</Badge>
				</div>

				<!-- Implementation Steps -->
				<div class="plan-section">
					<h3>Implementation Steps</h3>
					<div class="steps-list">
						{#each deliverable.plan.steps as step, index}
							<div class="step-card">
								<div class="step-header">
									<span class="step-number">{index + 1}</span>
									<h4>{step.title}</h4>
								</div>

								<p class="step-description">{step.description}</p>

								{#if step.acceptanceCriteria.length > 0}
									<div class="acceptance-criteria">
										<h5>Acceptance Criteria:</h5>
										<ul>
											{#each step.acceptanceCriteria as criterion}
												<li>{criterion}</li>
											{/each}
										</ul>
									</div>
								{/if}

								{#if step.dependencies.length > 0}
									<div class="dependencies">
										<strong>Dependencies:</strong>
										{step.dependencies.join(', ')}
									</div>
								{/if}

								<div class="step-meta">
									<Badge variant="info">{step.estimatedEffort}</Badge>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Risks -->
				{#if deliverable.plan.risks.length > 0}
					<div class="plan-section">
						<h3>Risks & Considerations</h3>
						<ul class="risks-list">
							{#each deliverable.plan.risks as risk}
								<li>{risk}</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- Metadata -->
				<div class="metadata">
					<div class="metadata-item">
						<span class="label">Tokens Used:</span>
						<span class="value">{formatTokens(deliverable.metadata.totalTokens)}</span>
					</div>
					<div class="metadata-item">
						<span class="label">Cost:</span>
						<span class="value">{formatCost(deliverable.metadata.totalCost)}</span>
					</div>
					<div class="metadata-item">
						<span class="label">Duration:</span>
						<span class="value">{formatDuration(deliverable.metadata.duration)}</span>
					</div>
				</div>
			</div>
		{:else}
			<div class="prompt-view">
				<div class="prompt-header">
					<h3>Execution Prompt</h3>
					<div class="prompt-actions">
						<Button variant="secondary" size="small" onclick={() => copyToClipboard(deliverable.prompt)}>
							Copy
						</Button>
						<Button
							variant="secondary"
							size="small"
							onclick={() => downloadAsFile(deliverable.prompt, `${deliverable.plan.title}-prompt.txt`)}
						>
							Download
						</Button>
					</div>
				</div>

				<pre class="prompt-text">{deliverable.prompt}</pre>
			</div>
		{/if}
	</div>
</div>

<style>
	.deliverable-viewer {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.tabs {
		display: flex;
		gap: 8px;
		border-bottom: 1px solid var(--color-border);
	}

	.tab {
		padding: 12px 24px;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		color: var(--color-text-muted);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tab:hover {
		color: var(--color-text);
		border-bottom-color: var(--color-border-dark);
	}

	.tab.active {
		color: var(--color-brass);
		border-bottom-color: var(--color-brass);
	}

	.tab-content {
		padding: 16px 0;
	}

	.plan-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 24px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--color-border);
	}

	.plan-header h2 {
		font-family: 'Cinzel', serif;
		font-weight: 300;
		font-size: 1.5rem;
		color: var(--color-text);
		margin: 0;
	}

	.plan-actions {
		display: flex;
		gap: 8px;
	}

	.plan-section {
		margin-bottom: 32px;
	}

	.plan-section h3 {
		font-size: 1.125rem;
		color: var(--color-brass);
		margin-bottom: 12px;
	}

	.overview-text {
		color: var(--color-text);
		line-height: 1.6;
	}

	.steps-list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.step-card {
		padding: 16px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 4px;
	}

	.step-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
	}

	.step-number {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-brass);
		color: var(--color-bg);
		border-radius: 50%;
		font-weight: 700;
		font-size: 0.875rem;
		flex-shrink: 0;
	}

	.step-header h4 {
		margin: 0;
		color: var(--color-text);
		font-size: 1rem;
	}

	.step-description {
		color: var(--color-text-muted);
		line-height: 1.6;
		margin-bottom: 12px;
	}

	.acceptance-criteria {
		margin-bottom: 12px;
	}

	.acceptance-criteria h5 {
		font-size: 0.875rem;
		color: var(--color-text);
		margin-bottom: 8px;
	}

	.acceptance-criteria ul {
		margin: 0;
		padding-left: 20px;
	}

	.acceptance-criteria li {
		color: var(--color-text-muted);
		margin-bottom: 4px;
	}

	.dependencies {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		margin-bottom: 12px;
	}

	.dependencies strong {
		color: var(--color-text);
	}

	.step-meta {
		display: flex;
		gap: 8px;
		margin-top: 12px;
	}

	.risks-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.risks-list li {
		padding: 12px;
		background: rgba(232, 166, 77, 0.1);
		border-left: 3px solid #e8a64d;
		margin-bottom: 8px;
		border-radius: 4px;
		color: var(--color-text);
	}

	.metadata {
		display: flex;
		gap: 24px;
		padding: 16px;
		background: var(--color-surface);
		border-radius: 4px;
	}

	.metadata-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.metadata-item .label {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.metadata-item .value {
		font-weight: 600;
		color: var(--color-text);
	}

	.prompt-view {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.prompt-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.prompt-header h3 {
		margin: 0;
		color: var(--color-brass);
	}

	.prompt-actions {
		display: flex;
		gap: 8px;
	}

	.prompt-text {
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 4px;
		padding: 16px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--color-text);
		white-space: pre-wrap;
		word-wrap: break-word;
		max-height: 600px;
		overflow-y: auto;
		margin: 0;
	}
</style>
