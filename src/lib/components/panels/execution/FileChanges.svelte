<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import type { FileChange } from '$lib/types/agents';

	interface Props {
		changes: FileChange[];
		isStreaming?: boolean;
	}

	let { changes, isStreaming = false }: Props = $props();

	const totalAdditions = $derived(
		changes.reduce((sum, change) => sum + (change.additions || 0), 0)
	);

	const totalDeletions = $derived(
		changes.reduce((sum, change) => sum + (change.deletions || 0), 0)
	);

	const changesByType = $derived(() => {
		const types = { added: 0, modified: 0, deleted: 0, renamed: 0 };
		changes.forEach((change) => {
			if (change.type in types) {
				types[change.type as keyof typeof types]++;
			}
		});
		return types;
	});

	function getChangeIcon(type: string): string {
		switch (type) {
			case 'added':
				return '➕';
			case 'modified':
				return '✏️';
			case 'deleted':
				return '🗑️';
			case 'renamed':
				return '📝';
			default:
				return '📄';
		}
	}

	function getChangeBadgeVariant(type: string): 'success' | 'warning' | 'danger' | 'neutral' {
		switch (type) {
			case 'added':
				return 'success';
			case 'modified':
				return 'warning';
			case 'deleted':
				return 'danger';
			default:
				return 'neutral';
		}
	}
</script>

<div class="file-changes">
	{#if changes.length > 0}
		<!-- Summary Stats -->
		<div class="changes-summary">
			<div class="summary-item">
				<span class="summary-label">Files Changed:</span>
				<span class="summary-value">{changes.length}</span>
			</div>
			<div class="summary-item">
				<span class="summary-label">Additions:</span>
				<span class="summary-value text-success">+{totalAdditions}</span>
			</div>
			<div class="summary-item">
				<span class="summary-label">Deletions:</span>
				<span class="summary-value text-danger">-{totalDeletions}</span>
			</div>
		</div>

		<!-- Change Type Badges -->
		<div class="change-types">
			{#if changesByType().added > 0}
				<Badge variant="success">{changesByType().added} Added</Badge>
			{/if}
			{#if changesByType().modified > 0}
				<Badge variant="warning">{changesByType().modified} Modified</Badge>
			{/if}
			{#if changesByType().deleted > 0}
				<Badge variant="danger">{changesByType().deleted} Deleted</Badge>
			{/if}
			{#if changesByType().renamed > 0}
				<Badge variant="neutral">{changesByType().renamed} Renamed</Badge>
			{/if}
		</div>

		<!-- File List -->
		<div class="changes-list">
			{#each changes as change}
				<div class="change-item">
					<div class="change-header">
						<div class="change-info">
							<span class="change-icon">{getChangeIcon(change.type)}</span>
							<span class="change-path">{change.path}</span>
							<Badge variant={getChangeBadgeVariant(change.type)}>
								{change.type}
							</Badge>
						</div>
						{#if change.additions !== undefined || change.deletions !== undefined}
							<div class="change-stats">
								{#if change.additions !== undefined && change.additions > 0}
									<span class="stat-addition">+{change.additions}</span>
								{/if}
								{#if change.deletions !== undefined && change.deletions > 0}
									<span class="stat-deletion">-{change.deletions}</span>
								{/if}
							</div>
						{/if}
					</div>

					{#if change.type === 'renamed' && change.oldPath}
						<div class="change-detail">
							<span class="text-muted">Renamed from:</span>
							<code class="old-path">{change.oldPath}</code>
						</div>
					{/if}

					{#if change.description}
						<div class="change-description">
							{change.description}
						</div>
					{/if}

					{#if change.additions !== undefined && change.deletions !== undefined}
						{@const total = change.additions + change.deletions}
						{@const additionPercent = total > 0 ? (change.additions / total) * 100 : 0}
						<div class="change-bar">
							<div
								class="change-bar-addition"
								style="width: {additionPercent}%"
							></div>
							<div
								class="change-bar-deletion"
								style="width: {100 - additionPercent}%"
							></div>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		{#if isStreaming}
			<div class="streaming-indicator">
				<div class="dot"></div>
				<div class="dot"></div>
				<div class="dot"></div>
				<span>Generating more changes...</span>
			</div>
		{/if}
	{:else}
		<div class="empty-state">
			<p class="text-muted">No file changes yet. Start an execution to see changes.</p>
		</div>
	{/if}
</div>

<style>
	.file-changes {
		padding: 1rem;
	}

	.changes-summary {
		display: flex;
		gap: 2rem;
		padding: 1rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.summary-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.summary-label {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.summary-value {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.text-success {
		color: var(--color-success);
	}

	.text-danger {
		color: var(--color-danger);
	}

	.text-muted {
		color: var(--text-secondary);
	}

	.change-types {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.changes-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.change-item {
		padding: 1rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		transition: all 0.2s ease;
	}

	.change-item:hover {
		border-color: var(--accent-color);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.change-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.change-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
		min-width: 0;
	}

	.change-icon {
		font-size: 1.25rem;
		line-height: 1;
	}

	.change-path {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.875rem;
		color: var(--text-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.change-stats {
		display: flex;
		gap: 0.5rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.875rem;
	}

	.stat-addition {
		color: var(--color-success);
	}

	.stat-deletion {
		color: var(--color-danger);
	}

	.change-detail {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
	}

	.old-path {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.875rem;
		padding: 0.125rem 0.375rem;
		background: var(--surface-1);
		border-radius: 3px;
	}

	.change-description {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin-bottom: 0.5rem;
	}

	.change-bar {
		display: flex;
		height: 4px;
		border-radius: 2px;
		overflow: hidden;
		background: var(--surface-1);
	}

	.change-bar-addition {
		background: var(--color-success);
	}

	.change-bar-deletion {
		background: var(--color-danger);
	}

	.streaming-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		justify-content: center;
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent-color);
		animation: pulse 1.4s infinite ease-in-out;
	}

	.dot:nth-child(1) {
		animation-delay: -0.32s;
	}

	.dot:nth-child(2) {
		animation-delay: -0.16s;
	}

	@keyframes pulse {
		0%,
		80%,
		100% {
			opacity: 0.3;
			transform: scale(0.8);
		}
		40% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
	}

	@media (max-width: 768px) {
		.changes-summary {
			flex-direction: column;
			gap: 0.75rem;
		}

		.change-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.change-stats {
			align-self: flex-end;
		}
	}
</style>
