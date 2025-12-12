<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import { executionStore } from '$lib/stores/execution.svelte';
	import { SessionStatus, type ExecutionSession } from '$lib/types/agents';

	const sessions = $derived(executionStore.sessions);

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	function formatDuration(startDate: Date, endDate?: Date): string {
		const end = endDate || new Date();
		const ms = end.getTime() - startDate.getTime();
		if (ms < 1000) return `${ms}ms`;
		if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
		return `${(ms / 60000).toFixed(1)}m`;
	}

	function getStatusBadgeVariant(
		status: SessionStatus
	): 'success' | 'warning' | 'danger' | 'neutral' {
		switch (status) {
			case SessionStatus.COMPLETED:
				return 'success';
			case SessionStatus.RUNNING:
				return 'warning';
			case SessionStatus.FAILED:
			case SessionStatus.CANCELLED:
				return 'danger';
			default:
				return 'neutral';
		}
	}

	function getStatusIcon(status: SessionStatus): string {
		switch (status) {
			case SessionStatus.COMPLETED:
				return '✅';
			case SessionStatus.RUNNING:
				return '⏳';
			case SessionStatus.FAILED:
				return '❌';
			case SessionStatus.CANCELLED:
				return '🚫';
			default:
				return '⏸️';
		}
	}

	function selectSession(sessionId: string): void {
		executionStore.setCurrentSession(sessionId);
	}

	function deleteSession(sessionId: string): void {
		if (confirm('Are you sure you want to delete this session?')) {
			executionStore.deleteSession(sessionId);
		}
	}
</script>

<div class="execution-history">
	{#if sessions.length > 0}
		<div class="history-header">
			<h3>Past Executions ({sessions.length})</h3>
			<Button
				variant="ghost"
				size="sm"
				onclick={() => executionStore.clearAll()}
			>
				Clear All
			</Button>
		</div>

		<div class="sessions-list">
			{#each sessions as session}
				{@const isActive = executionStore.currentSession?.id === session.id}
				<div
					class="session-card"
					class:active={isActive}
					role="button"
					tabindex="0"
					onclick={() => selectSession(session.id)}
					onkeydown={(e) => e.key === 'Enter' && selectSession(session.id)}
				>
					<div class="session-header">
						<div class="session-info">
							<span class="session-icon">{getStatusIcon(session.status)}</span>
							<div class="session-title-group">
								<div class="session-title">
									{#if session.request.plan?.plan?.title}
										{session.request.plan.plan.title}
									{:else}
										Execution #{session.id.split('_')[1]}
									{/if}
								</div>
								<div class="session-meta">
									<span class="session-date">{formatDate(session.createdAt)}</span>
									{#if session.startedAt && session.completedAt}
										<span class="session-duration">
											{formatDuration(session.startedAt, session.completedAt)}
										</span>
									{:else if session.startedAt}
										<span class="session-duration">
											{formatDuration(session.startedAt)}
										</span>
									{/if}
								</div>
							</div>
						</div>
						<Badge variant={getStatusBadgeVariant(session.status)}>
							{session.status}
						</Badge>
					</div>

					{#if session.result}
						<div class="session-stats">
							{#if session.result.filesModified}
								<div class="stat">
									<span class="stat-icon">📁</span>
									<span class="stat-value">{session.result.filesModified.length}</span>
									<span class="stat-label">files</span>
								</div>
							{/if}
							{#if session.result.testResults}
								<div class="stat">
									<span class="stat-icon">🧪</span>
									<span class="stat-value">{session.result.testResults.passed}</span>
									<span class="stat-label">passed</span>
								</div>
							{/if}
							{#if session.result.metrics}
								<div class="stat">
									<span class="stat-icon">🔢</span>
									<span class="stat-value">
										{session.result.metrics.tokensUsed < 1000
											? session.result.metrics.tokensUsed
											: `${(session.result.metrics.tokensUsed / 1000).toFixed(1)}K`}
									</span>
									<span class="stat-label">tokens</span>
								</div>
							{/if}
						</div>
					{/if}

					{#if session.error}
						<div class="session-error">
							<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
								<path
									d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM7 4h2v5H7V4zm0 6h2v2H7v-2z"
								/>
							</svg>
							<span>{session.error}</span>
						</div>
					{/if}

					<div class="session-actions">
						<Button
							variant="ghost"
							size="sm"
							onclick={(e: Event) => {
								e.stopPropagation();
								selectSession(session.id);
							}}
						>
							View Details
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onclick={(e: Event) => {
								e.stopPropagation();
								deleteSession(session.id);
							}}
						>
							Delete
						</Button>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<div class="empty-icon">📋</div>
			<p class="empty-title">No execution history</p>
			<p class="empty-description">
				Start an execution to see your history here.
			</p>
		</div>
	{/if}
</div>

<style>
	.execution-history {
		padding: 1rem;
	}

	.history-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.history-header h3 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.sessions-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.session-card {
		padding: 1rem;
		background: var(--surface-2);
		border: 2px solid var(--border-color);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.session-card:hover {
		border-color: var(--accent-color);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.session-card.active {
		border-color: var(--accent-color);
		background: var(--surface-3);
	}

	.session-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}

	.session-info {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		flex: 1;
		min-width: 0;
	}

	.session-icon {
		font-size: 1.25rem;
		line-height: 1;
	}

	.session-title-group {
		flex: 1;
		min-width: 0;
	}

	.session-title {
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.session-meta {
		display: flex;
		gap: 0.75rem;
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.session-stats {
		display: flex;
		gap: 1rem;
		margin-bottom: 0.75rem;
		padding: 0.5rem;
		background: var(--surface-1);
		border-radius: 6px;
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.875rem;
	}

	.stat-icon {
		font-size: 1rem;
	}

	.stat-value {
		font-weight: 600;
		color: var(--text-primary);
	}

	.stat-label {
		color: var(--text-secondary);
	}

	.session-error {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 6px;
		color: var(--color-danger);
		font-size: 0.875rem;
		margin-bottom: 0.75rem;
	}

	.session-actions {
		display: flex;
		gap: 0.5rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border-color);
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
	}

	.empty-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.empty-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	.empty-description {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0;
	}

	@media (max-width: 768px) {
		.session-stats {
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		.session-actions {
			flex-direction: column;
		}
	}
</style>
