<script lang="ts">
	import { services, pipelines, tiers } from './data';
	import TierDiagram from './components/TierDiagram.svelte';
	import PipelineContracts from './components/PipelineContracts.svelte';
	import DependencyRules from './components/DependencyRules.svelte';
	import ContractModal from './components/ContractModal.svelte';
	import type { Product, Pipeline } from './types';

	// Tab state
	type Tab = 'tiers' | 'pipelines' | 'deps';
	let activeTab = $state<Tab>('tiers');

	// Modal state
	let isModalOpen = $state(false);
	let selectedContract = $state<{
		name: string;
		version: string;
		port?: string;
		contract?: {
			request: Record<string, unknown>;
			response: Record<string, unknown>;
			errors: string[];
		};
	} | null>(null);

	// Tab configuration
	const tabs = [
		{ id: 'tiers' as Tab, label: 'Architecture Tiers', icon: 'layers' },
		{ id: 'pipelines' as Tab, label: 'Pipeline Contracts', icon: 'git-branch' },
		{ id: 'deps' as Tab, label: 'Dependency Rules', icon: 'shield' }
	];

	// Handle contract view from events
	function handleShowContract(event: Event) {
		const customEvent = event as CustomEvent;
		const { product, pipeline } = customEvent.detail;

		if (product) {
			// Find the service contract
			const service = Object.values(services).find((s) => s.name === product.name);
			if (service && service.hasContract) {
				// Find corresponding pipeline contract
				const pipelineKey = Object.keys(pipelines).find((key) =>
					pipelines[key].name.toLowerCase().includes(service.name.toLowerCase())
				);
				const pipelineContract = pipelineKey ? pipelines[pipelineKey] : null;

				selectedContract = {
					name: service.name,
					version: service.version,
					port: service.port,
					contract: pipelineContract?.contract
				};
				isModalOpen = true;
			}
		} else if (pipeline) {
			selectedContract = {
				name: pipeline.name,
				version: pipeline.version,
				contract: pipeline.contract
			};
			isModalOpen = true;
		}
	}

	function closeModal() {
		isModalOpen = false;
		selectedContract = null;
	}

	// Export functions
	function exportAsJSON() {
		const data = {
			services,
			pipelines,
			tiers,
			timestamp: new Date().toISOString()
		};
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'forge-architecture.json';
		a.click();
		URL.revokeObjectURL(url);
	}

	function exportAsSVG() {
		alert('SVG export coming soon! This will generate a visual diagram of the architecture.');
	}

	function exportAsMermaid() {
		alert(
			'Mermaid export coming soon! This will generate Mermaid.js syntax for the architecture.'
		);
	}

	// Listen for contract events
	$effect(() => {
		document.addEventListener('show-contract', handleShowContract);
		return () => {
			document.removeEventListener('show-contract', handleShowContract);
		};
	});
</script>

<div class="architecture-studio">
	<!-- Header -->
	<header class="studio-header">
		<div class="header-content">
			<div class="header-left">
				<h1 class="studio-title">Forge Architecture Studio</h1>
				<p class="studio-subtitle">BDS-SAS Three-Tier System Design</p>
			</div>
			<div class="header-actions">
				<button class="export-btn" onclick={exportAsJSON} title="Export as JSON">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					JSON
				</button>
				<button class="export-btn" onclick={exportAsSVG} title="Export as SVG">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
						<circle cx="8.5" cy="8.5" r="1.5"></circle>
						<polyline points="21 15 16 10 5 21"></polyline>
					</svg>
					SVG
				</button>
				<button class="export-btn" onclick={exportAsMermaid} title="Export as Mermaid">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="16 18 22 12 16 6"></polyline>
						<polyline points="8 6 2 12 8 18"></polyline>
					</svg>
					Mermaid
				</button>
			</div>
		</div>
	</header>

	<!-- Tab Navigation -->
	<nav class="tab-nav">
		{#each tabs as tab}
			<button
				class="tab-button"
				class:active={activeTab === tab.id}
				onclick={() => (activeTab = tab.id)}
			>
				<span class="tab-label">{tab.label}</span>
			</button>
		{/each}
	</nav>

	<!-- Tab Content -->
	<main class="tab-content">
		{#if activeTab === 'tiers'}
			<TierDiagram {tiers} />
		{:else if activeTab === 'pipelines'}
			<PipelineContracts {pipelines} />
		{:else if activeTab === 'deps'}
			<DependencyRules />
		{/if}
	</main>

	<!-- Contract Modal -->
	<ContractModal bind:isOpen={isModalOpen} contract={selectedContract} onClose={closeModal} />
</div>

<style>
	.architecture-studio {
		min-height: 100vh;
		background: var(--color-midnight);
		display: flex;
		flex-direction: column;
	}

	/* Header */
	.studio-header {
		background: linear-gradient(135deg, var(--color-graphite) 0%, var(--color-midnight) 100%);
		border-bottom: 2px solid var(--color-brass);
		box-shadow: var(--shadow-lg);
	}

	.header-content {
		max-width: 1440px;
		margin: 0 auto;
		padding: var(--spacing-xl) var(--spacing-lg);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-lg);
		flex-wrap: wrap;
	}

	.header-left {
		flex: 1;
		min-width: 250px;
	}

	.studio-title {
		font-family: var(--font-family-heading);
		font-size: 2rem;
		font-weight: 400;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-xs) 0;
		letter-spacing: 0.02em;
	}

	.studio-subtitle {
		font-family: var(--font-family-mono);
		font-size: 0.95rem;
		color: var(--color-brass);
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.header-actions {
		display: flex;
		gap: var(--spacing-sm);
		flex-wrap: wrap;
	}

	.export-btn {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		background: var(--color-surface-2);
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		padding: var(--spacing-sm) var(--spacing-md);
		font-family: var(--font-family-mono);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all var(--transition-base);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.export-btn:hover {
		background: var(--color-brass);
		color: var(--color-midnight);
		border-color: var(--color-brass);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	.export-btn:active {
		transform: translateY(0);
	}

	.export-btn svg {
		flex-shrink: 0;
	}

	/* Tab Navigation */
	.tab-nav {
		background: var(--color-surface-2);
		border-bottom: 1px solid var(--color-border-subtle);
		display: flex;
		gap: var(--spacing-xs);
		padding: 0 var(--spacing-lg);
		overflow-x: auto;
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
	}

	.tab-button {
		background: transparent;
		border: none;
		color: var(--color-text-tertiary);
		padding: var(--spacing-md) var(--spacing-lg);
		font-family: var(--font-family-body);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: all var(--transition-base);
		border-bottom: 3px solid transparent;
		white-space: nowrap;
		position: relative;
	}

	.tab-button:hover {
		color: var(--color-text-secondary);
		background: rgba(193, 151, 69, 0.1);
	}

	.tab-button.active {
		color: var(--color-brass);
		border-bottom-color: var(--color-brass);
	}

	.tab-label {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	/* Tab Content */
	.tab-content {
		flex: 1;
		max-width: 1440px;
		width: 100%;
		margin: 0 auto;
		padding: var(--spacing-lg);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.studio-title {
			font-size: 1.5rem;
		}

		.studio-subtitle {
			font-size: 0.8rem;
		}

		.header-content {
			padding: var(--spacing-lg) var(--spacing-md);
		}

		.header-actions {
			width: 100%;
			justify-content: flex-end;
		}

		.export-btn {
			flex: 1;
			justify-content: center;
			min-width: auto;
		}

		.tab-nav {
			padding: 0 var(--spacing-md);
		}

		.tab-button {
			padding: var(--spacing-md);
			flex: 1;
		}

		.tab-content {
			padding: var(--spacing-md);
		}
	}

	/* Scrollbar styling for tab nav */
	.tab-nav::-webkit-scrollbar {
		height: 4px;
	}

	.tab-nav::-webkit-scrollbar-track {
		background: var(--color-graphite);
	}

	.tab-nav::-webkit-scrollbar-thumb {
		background: var(--color-brass);
		border-radius: var(--radius-sm);
	}
</style>
