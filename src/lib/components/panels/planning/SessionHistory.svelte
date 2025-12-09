<script lang="ts">
	import { planningStore } from '$lib/stores/planning.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import { SessionStatus } from '$lib/types/agents';
	import type { PlanningSession } from '$lib/types/agents';

	const sessions = $derived(planningStore.sessions);
	const currentSession = $derived(planningStore.currentSession);

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	function getStatusVariant(status: SessionStatus): 'success' | 'error' | 'warning' | 'info' {
		switch (status) {
			case SessionStatus.COMPLETED:
				return 'success';
			case SessionStatus.FAILED:
			case SessionStatus.CANCELLED:
				return 'error';
			case SessionStatus.RUNNING:
				return 'warning';
			default:
				return 'info';
		}
	}

	function getStatusLabel(status: SessionStatus): string {
		switch (status) {
			case SessionStatus.COMPLETED:
				return 'Completed';
			case SessionStatus.FAILED:
				return 'Failed';
			case SessionStatus.CANCELLED:
				return 'Cancelled';
			case SessionStatus.RUNNING:
				return 'Running';
			case SessionStatus.PENDING:
				return 'Pending';
			default:
				return 'Unknown';
		}
	}

	function selectSession(session: PlanningSession): void {
		planningStore.setCurrentSession(session.id);
	}
</script>

<div class="session-history">
	{#if sessions.length === 0}
		<div class="empty-state">
			<p>No planning sessions yet</p>
		</div>
	{:else}
		<div class="session-list">
			{#each sessions.slice().reverse() as session}
				<button
					class="session-item"
					class:active={currentSession?.id === session.id}
					onclick={() => selectSession(session)}
				>
					<div class="session-header">
						<span class="session-title">{session.request.title}</span>
						<Badge variant={getStatusVariant(session.status)}>
							{getStatusLabel(session.status)}
						</Badge>
					</div>

					<div class="session-meta">
						<span class="session-date">
							{formatDate(session.createdAt)}
						</span>

						{#if session.completedAt && session.startedAt}
							{@const duration = session.completedAt.getTime() - session.startedAt.getTime()}
							<span class="session-duration">
								{duration < 60000 ? `${Math.round(duration / 1000)}s` : `${Math.round(duration / 60000)}m`}
							</span>
						{/if}
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.session-history {
		max-height: 400px;
		overflow-y: auto;
	}

	.empty-state {
		padding: 24px;
		text-align: center;
		color: var(--color-text-muted);
	}

	.session-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.session-item {
		width: 100%;
		padding: 12px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.session-item:hover {
		border-color: var(--color-brass);
		background: var(--color-surface-alt);
	}

	.session-item.active {
		border-color: var(--color-brass);
		background: rgba(193, 151, 69, 0.1);
	}

	.session-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 8px;
	}

	.session-title {
		font-weight: 600;
		color: var(--color-text);
		font-size: 0.875rem;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.session-meta {
		display: flex;
		gap: 12px;
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.session-date,
	.session-duration {
		display: flex;
		align-items: center;
	}

	/* Custom scrollbar */
	.session-history::-webkit-scrollbar {
		width: 6px;
	}

	.session-history::-webkit-scrollbar-track {
		background: var(--color-surface);
		border-radius: 3px;
	}

	.session-history::-webkit-scrollbar-thumb {
		background: var(--color-border-dark);
		border-radius: 3px;
	}

	.session-history::-webkit-scrollbar-thumb:hover {
		background: var(--color-brass);
	}
</style>
