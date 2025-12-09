<script lang="ts">
	import type { Pipeline } from '../types';

	interface Props {
		pipelines: Record<string, Pipeline>;
	}

	let { pipelines }: Props = $props();

	function handleViewContract(pipeline: Pipeline) {
		// Dispatch custom event to parent
		const event = new CustomEvent('show-contract', {
			detail: { pipeline },
			bubbles: true,
			composed: true
		});
		document.dispatchEvent(event);
	}
</script>

<div class="pipeline-contracts">
	<div class="pipeline-grid">
		{#each Object.entries(pipelines) as [key, pipeline]}
			<div class="pipeline-card">
				<!-- Pipeline Header -->
				<div class="pipeline-header">
					<div>
						<h3 class="pipeline-name">{pipeline.name}</h3>
						<p class="pipeline-version">{pipeline.version}</p>
					</div>
					<span class="invocation-badge">{pipeline.invocation}</span>
				</div>

				<!-- Pipeline Description -->
				<p class="pipeline-description">{pipeline.description}</p>

				<!-- Pipeline Stages -->
				<div class="stages-container">
					<h4 class="stages-title">Pipeline Stages</h4>
					<div class="stages-list">
						{#each pipeline.stages as stage}
							<div class="stage-item" style="border-left-color: {stage.color || 'var(--color-brass)'};">
								<span class="stage-name">{stage.name}</span>
								{#if stage.model}
									<span class="stage-model">{stage.model}</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				<!-- View Contract Button -->
				{#if pipeline.contract}
					<button class="view-contract-btn" onclick={() => handleViewContract(pipeline)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
							<polyline points="14 2 14 8 20 8"></polyline>
							<line x1="16" y1="13" x2="8" y2="13"></line>
							<line x1="16" y1="17" x2="8" y2="17"></line>
							<polyline points="10 9 9 9 8 9"></polyline>
						</svg>
						View Contract
					</button>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.pipeline-contracts {
		padding: var(--spacing-md);
	}

	.pipeline-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: var(--spacing-lg);
	}

	.pipeline-card {
		background: var(--color-surface-2);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		padding: var(--spacing-lg);
		box-shadow: var(--shadow-md);
		transition: all var(--transition-base);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.pipeline-card:hover {
		border-color: var(--color-brass);
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
	}

	.pipeline-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--spacing-md);
	}

	.pipeline-name {
		font-family: var(--font-family-heading);
		font-size: 1.5rem;
		font-weight: 400;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-xs) 0;
		letter-spacing: 0.02em;
	}

	.pipeline-version {
		font-family: var(--font-family-mono);
		font-size: 0.875rem;
		color: var(--color-brass);
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.invocation-badge {
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		background: var(--color-graphite);
		color: var(--color-text-secondary);
		padding: 0.35rem 0.75rem;
		border-radius: var(--radius-full);
		border: 1px solid var(--color-border-subtle);
		white-space: nowrap;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.pipeline-description {
		font-size: 0.95rem;
		color: var(--color-text-secondary);
		margin: 0;
		line-height: 1.6;
	}

	.stages-container {
		background: var(--color-surface-3);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		padding: var(--spacing-md);
	}

	.stages-title {
		font-family: var(--font-family-heading);
		font-size: 1rem;
		font-weight: 400;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-md) 0;
		letter-spacing: 0.02em;
	}

	.stages-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.stage-item {
		background: var(--color-midnight);
		border: 1px solid var(--color-border-subtle);
		border-left: 3px solid;
		border-radius: var(--radius-sm);
		padding: var(--spacing-sm) var(--spacing-md);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-md);
	}

	.stage-name {
		font-family: var(--font-family-body);
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.stage-model {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-tertiary);
	}

	.view-contract-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);
		background: linear-gradient(135deg, var(--color-brass) 0%, var(--color-gold) 100%);
		color: var(--color-midnight);
		border: none;
		border-radius: var(--radius-md);
		padding: var(--spacing-sm) var(--spacing-lg);
		font-family: var(--font-family-body);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: all var(--transition-base);
		margin-top: auto;
	}

	.view-contract-btn:hover {
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.view-contract-btn:active {
		transform: translateY(0);
	}

	.view-contract-btn svg {
		flex-shrink: 0;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.pipeline-grid {
			grid-template-columns: 1fr;
		}

		.pipeline-header {
			flex-direction: column;
		}

		.invocation-badge {
			align-self: flex-start;
		}
	}
</style>
