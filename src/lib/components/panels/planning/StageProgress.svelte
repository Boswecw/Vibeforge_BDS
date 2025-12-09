<script lang="ts">
	import { PAORTStage } from '$lib/types/agents';
	import type { PAORTStage as PAORTStageType } from '$lib/types/agents';

	interface Props {
		stage: PAORTStageType | null;
	}

	let { stage }: Props = $props();

	const stages = [
		{ key: PAORTStage.PLAN, label: 'Plan', description: 'Define strategy' },
		{ key: PAORTStage.ACT, label: 'Act', description: 'Execute steps' },
		{ key: PAORTStage.OBSERVE, label: 'Observe', description: 'Analyze results' },
		{ key: PAORTStage.REFLECT, label: 'Reflect', description: 'Evaluate success' }
	];

	function getStageIndex(stageKey: PAORTStageType | null): number {
		if (!stageKey) return -1;
		return stages.findIndex((s) => s.key === stageKey);
	}

	const currentIndex = $derived(getStageIndex(stage));
</script>

<div class="stage-progress">
	<div class="stages">
		{#each stages as stageItem, index}
			{@const isActive = index === currentIndex}
			{@const isCompleted = currentIndex > index}
			{@const isPending = currentIndex < index}

			<div class="stage" class:active={isActive} class:completed={isCompleted} class:pending={isPending}>
				<div class="stage-indicator">
					<div class="stage-number">
						{#if isCompleted}
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path
									d="M13.5 4.5L6 12L2.5 8.5"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						{:else if isActive}
							<div class="pulse"></div>
						{:else}
							{index + 1}
						{/if}
					</div>
				</div>

				<div class="stage-content">
					<div class="stage-label">{stageItem.label}</div>
					<div class="stage-description">{stageItem.description}</div>
				</div>

				{#if index < stages.length - 1}
					<div class="stage-connector" class:completed={isCompleted}></div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.stage-progress {
		margin-bottom: 24px;
	}

	.stages {
		display: flex;
		gap: 12px;
		position: relative;
	}

	.stage {
		flex: 1;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.stage-indicator {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: 2px solid var(--color-border);
		background: var(--color-surface);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 12px;
		transition: all 0.3s ease;
		position: relative;
		z-index: 2;
	}

	.stage.active .stage-indicator {
		border-color: var(--color-brass);
		background: rgba(193, 151, 69, 0.1);
	}

	.stage.completed .stage-indicator {
		border-color: var(--color-success);
		background: rgba(73, 200, 131, 0.1);
	}

	.stage-number {
		font-weight: 600;
		color: var(--color-text-muted);
	}

	.stage.active .stage-number {
		color: var(--color-brass);
	}

	.stage.completed .stage-number {
		color: var(--color-success);
	}

	.pulse {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--color-brass);
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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

	.stage-content {
		min-height: 48px;
	}

	.stage-label {
		font-weight: 600;
		color: var(--color-text);
		margin-bottom: 4px;
		font-size: 0.875rem;
	}

	.stage.active .stage-label {
		color: var(--color-brass);
	}

	.stage-description {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.stage-connector {
		position: absolute;
		top: 24px;
		left: 50%;
		right: -50%;
		height: 2px;
		background: var(--color-border);
		transform: translateY(-50%);
		transition: background 0.3s ease;
		z-index: 1;
	}

	.stage-connector.completed {
		background: var(--color-success);
	}

	@media (max-width: 768px) {
		.stages {
			flex-direction: column;
			align-items: flex-start;
		}

		.stage {
			flex-direction: row;
			align-items: flex-start;
			text-align: left;
			width: 100%;
		}

		.stage-indicator {
			margin-bottom: 0;
			margin-right: 16px;
			flex-shrink: 0;
		}

		.stage-connector {
			display: none;
		}
	}
</style>
