<script lang="ts" generics="T">
	import { onMount, tick } from 'svelte';
	import type { Snippet } from 'svelte';

	/**
	 * Virtual List Component
	 * Renders only visible items + buffer for optimal performance
	 *
	 * Usage:
	 * <VirtualList items={data} itemHeight={100}>
	 *   {#snippet children({ item, index })}
	 *     <YourComponent data={item} />
	 *   {/snippet}
	 * </VirtualList>
	 */

	interface Props {
		items: T[];
		itemHeight: number; // Fixed height per item (px)
		buffer?: number; // Number of items to render above/below viewport (default 5)
		height?: string; // Container height (default '600px')
		gap?: number; // Gap between items (px, default 0)
		children: Snippet<[{ item: T; index: number }]>; // Snippet for rendering items
	}

	let {
		items = [],
		itemHeight = 100,
		buffer = 5,
		height = '600px',
		gap = 0,
		children
	}: Props = $props();

	// State
	let containerRef: HTMLDivElement;
	let scrollTop = $state(0);
	let containerHeight = $state(600);

	// Derived values
	let totalHeight = $derived(items.length * (itemHeight + gap));
	let visibleCount = $derived(Math.ceil(containerHeight / (itemHeight + gap)));
	let startIndex = $derived(Math.max(0, Math.floor(scrollTop / (itemHeight + gap)) - buffer));
	let endIndex = $derived(Math.min(items.length, startIndex + visibleCount + buffer * 2));
	let visibleItems = $derived(items.slice(startIndex, endIndex));
	let offsetY = $derived(startIndex * (itemHeight + gap));

	// Handle scroll
	function handleScroll(event: Event) {
		const target = event.target as HTMLDivElement;
		scrollTop = target.scrollTop;
	}

	// Measure container height
	onMount(() => {
		if (containerRef) {
			const rect = containerRef.getBoundingClientRect();
			containerHeight = rect.height;

			// Update on window resize
			const resizeObserver = new ResizeObserver((entries) => {
				for (const entry of entries) {
					containerHeight = entry.contentRect.height;
				}
			});

			resizeObserver.observe(containerRef);

			return () => {
				resizeObserver.disconnect();
			};
		}
	});
</script>

<div
	bind:this={containerRef}
	class="virtual-list-container"
	style="height: {height}; overflow-y: auto;"
	onscroll={handleScroll}
>
	<div class="virtual-list-spacer" style="height: {totalHeight}px;">
		<div class="virtual-list-content" style="transform: translateY({offsetY}px);">
			{#each visibleItems as item, index (startIndex + index)}
				<div
					class="virtual-list-item"
					style="height: {itemHeight}px; margin-bottom: {gap}px;"
					data-index={startIndex + index}
				>
					{@render children({ item, index: startIndex + index })}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.virtual-list-container {
		position: relative;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.virtual-list-spacer {
		position: relative;
		width: 100%;
	}

	.virtual-list-content {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		will-change: transform;
	}

	.virtual-list-item {
		width: 100%;
	}

	/* Smooth scrolling */
	.virtual-list-container {
		scroll-behavior: smooth;
	}

	/* Custom scrollbar (BDS styling) */
	.virtual-list-container::-webkit-scrollbar {
		width: 8px;
	}

	.virtual-list-container::-webkit-scrollbar-track {
		background: var(--color-surface-tertiary);
		border-radius: 4px;
	}

	.virtual-list-container::-webkit-scrollbar-thumb {
		background: var(--color-brass);
		border-radius: 4px;
	}

	.virtual-list-container::-webkit-scrollbar-thumb:hover {
		background: var(--color-brass-light);
	}
</style>
