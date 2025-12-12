<script lang="ts">
	import { Button, Badge } from '$lib/components';

	// Props
	interface Props {
		currentPage?: number;
		totalItems: number;
		itemsPerPage?: number;
		maxVisiblePages?: number;
		onPageChange?: (page: number) => void;
	}

	let {
		currentPage = $bindable(1),
		totalItems,
		itemsPerPage = 50,
		maxVisiblePages = 7,
		onPageChange
	}: Props = $props();

	// Derived
	let totalPages = $derived(Math.ceil(totalItems / itemsPerPage));
	let startItem = $derived((currentPage - 1) * itemsPerPage + 1);
	let endItem = $derived(Math.min(currentPage * itemsPerPage, totalItems));

	// Calculate visible page numbers
	let visiblePages = $derived.by(() => {
		if (totalPages <= maxVisiblePages) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const halfVisible = Math.floor(maxVisiblePages / 2);
		let startPage = Math.max(1, currentPage - halfVisible);
		let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		// Adjust start if we're near the end
		if (endPage - startPage < maxVisiblePages - 1) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		const pages: (number | 'ellipsis')[] = [];

		// Always show first page
		if (startPage > 1) {
			pages.push(1);
			if (startPage > 2) {
				pages.push('ellipsis');
			}
		}

		// Show middle pages
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		// Always show last page
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				pages.push('ellipsis');
			}
			pages.push(totalPages);
		}

		return pages;
	});

	// Functions
	function goToPage(page: number) {
		if (page < 1 || page > totalPages || page === currentPage) return;
		currentPage = page;
		if (onPageChange) onPageChange(page);
	}

	function nextPage() {
		goToPage(currentPage + 1);
	}

	function prevPage() {
		goToPage(currentPage - 1);
	}

	function firstPage() {
		goToPage(1);
	}

	function lastPage() {
		goToPage(totalPages);
	}
</script>

<div class="pagination-container">
	<!-- Info -->
	<div class="pagination-info">
		<span class="info-text">
			Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of
			<strong>{totalItems}</strong> items
		</span>
	</div>

	<!-- Controls -->
	{#if totalPages > 1}
		<div class="pagination-controls">
			<!-- First & Previous -->
			<Button
				variant="ghost"
				size="sm"
				onclick={firstPage}
				disabled={currentPage === 1}
				aria-label="First page"
			>
				<span class="icon">«</span>
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onclick={prevPage}
				disabled={currentPage === 1}
				aria-label="Previous page"
			>
				<span class="icon">‹</span>
			</Button>

			<!-- Page Numbers -->
			<div class="page-numbers">
				{#each visiblePages as page}
					{#if page === 'ellipsis'}
						<span class="ellipsis">...</span>
					{:else}
						<Button
							variant={page === currentPage ? 'primary' : 'ghost'}
							size="sm"
							onclick={() => goToPage(page)}
							aria-label="Page {page}"
							aria-current={page === currentPage ? 'page' : undefined}
						>
							{page}
						</Button>
					{/if}
				{/each}
			</div>

			<!-- Next & Last -->
			<Button
				variant="ghost"
				size="sm"
				onclick={nextPage}
				disabled={currentPage === totalPages}
				aria-label="Next page"
			>
				<span class="icon">›</span>
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onclick={lastPage}
				disabled={currentPage === totalPages}
				aria-label="Last page"
			>
				<span class="icon">»</span>
			</Button>
		</div>

		<!-- Items per page (optional future enhancement) -->
		<!--
		<div class="items-per-page">
			<Select
				bind:value={itemsPerPage}
				options={[
					{ value: 25, label: '25' },
					{ value: 50, label: '50' },
					{ value: 100, label: '100' }
				]}
			/>
			<span class="per-page-label">per page</span>
		</div>
		-->
	{/if}
</div>

<style>
	.pagination-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-lg);
		padding: var(--spacing-md) 0;
		flex-wrap: wrap;
	}

	.pagination-info {
		display: flex;
		align-items: center;
	}

	.info-text {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.info-text strong {
		color: var(--color-text-primary);
		font-weight: 600;
	}

	.pagination-controls {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
	}

	.page-numbers {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		margin: 0 var(--spacing-sm);
	}

	.ellipsis {
		padding: 0 var(--spacing-xs);
		color: var(--color-text-tertiary);
		font-size: 0.875rem;
		user-select: none;
	}

	.icon {
		font-size: 1.25rem;
		line-height: 1;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.pagination-container {
			flex-direction: column;
			align-items: stretch;
		}

		.pagination-info {
			justify-content: center;
			text-align: center;
		}

		.pagination-controls {
			justify-content: center;
			flex-wrap: wrap;
		}

		.page-numbers {
			margin: 0;
		}
	}
</style>
