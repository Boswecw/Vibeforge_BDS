<script lang="ts">
	import { onMount } from 'svelte';
	import { Panel, Badge, Button, Select } from '$lib/components';

	// Types
	interface AnalyticsData {
		totalInvocations: number;
		successRate: number;
		avgResponseTime: number;
		totalCost: number;
		topSkills: SkillUsage[];
		modelUsage: ModelUsage[];
		errorRate: number;
		timeSeriesData: TimeSeriesPoint[];
	}

	interface SkillUsage {
		skillId: string;
		skillName: string;
		count: number;
		successRate: number;
		avgCost: number;
	}

	interface ModelUsage {
		model: string;
		count: number;
		avgResponseTime: number;
		totalCost: number;
		successRate: number;
	}

	interface TimeSeriesPoint {
		date: string;
		invocations: number;
		errors: number;
		cost: number;
	}

	// State
	let analytics = $state<AnalyticsData | null>(null);
	let loading = $state(true);
	let timeRange = $state<'24h' | '7d' | '30d' | 'all'>('7d');

	// Options
	const timeRangeOptions = [
		{ value: '24h', label: 'Last 24 Hours' },
		{ value: '7d', label: 'Last 7 Days' },
		{ value: '30d', label: 'Last 30 Days' },
		{ value: 'all', label: 'All Time' }
	];

	// Lifecycle
	onMount(() => {
		loadAnalytics();
	});

	// Load analytics data
	function loadAnalytics() {
		loading = true;

		// Simulate loading analytics from localStorage or API
		// In production, this would fetch from backend API
		const mockData: AnalyticsData = {
			totalInvocations: 1247,
			successRate: 94.3,
			avgResponseTime: 2.8,
			totalCost: 12.47,
			errorRate: 5.7,
			topSkills: [
				{
					skillId: 'A1',
					skillName: 'Code Generation - Python',
					count: 342,
					successRate: 96.5,
					avgCost: 0.012
				},
				{
					skillId: 'B3',
					skillName: 'Bug Analysis & Fix',
					count: 218,
					successRate: 92.1,
					avgCost: 0.018
				},
				{
					skillId: 'L1',
					skillName: 'Technical Documentation',
					count: 186,
					successRate: 98.2,
					avgCost: 0.008
				},
				{
					skillId: 'C1',
					skillName: 'Code Review',
					count: 164,
					successRate: 94.5,
					avgCost: 0.015
				},
				{
					skillId: 'T1',
					skillName: 'Unit Test Generation',
					count: 142,
					successRate: 91.3,
					avgCost: 0.011
				}
			],
			modelUsage: [
				{
					model: 'gpt-4o-mini',
					count: 687,
					avgResponseTime: 1.8,
					totalCost: 3.42,
					successRate: 96.1
				},
				{
					model: 'claude-3-5-sonnet',
					count: 324,
					avgResponseTime: 3.2,
					totalCost: 6.48,
					successRate: 95.8
				},
				{
					model: 'gpt-4o',
					count: 186,
					avgResponseTime: 4.1,
					totalCost: 2.14,
					successRate: 91.4
				},
				{
					model: 'claude-3-5-haiku',
					count: 50,
					avgResponseTime: 1.2,
					totalCost: 0.43,
					successRate: 94.0
				}
			],
			timeSeriesData: [
				{ date: '2024-12-02', invocations: 142, errors: 8, cost: 1.42 },
				{ date: '2024-12-03', invocations: 168, errors: 12, cost: 1.68 },
				{ date: '2024-12-04', invocations: 195, errors: 9, cost: 1.95 },
				{ date: '2024-12-05', invocations: 221, errors: 15, cost: 2.21 },
				{ date: '2024-12-06', invocations: 187, errors: 11, cost: 1.87 },
				{ date: '2024-12-07', invocations: 164, errors: 7, cost: 1.64 },
				{ date: '2024-12-08', invocations: 170, errors: 10, cost: 1.70 }
			]
		};

		analytics = mockData;
		loading = false;
	}

	// Reload when time range changes
	$effect(() => {
		timeRange;
		loadAnalytics();
	});

	// Format currency
	function formatCurrency(value: number): string {
		return `$${value.toFixed(2)}`;
	}

	// Format percentage
	function formatPercent(value: number): string {
		return `${value.toFixed(1)}%`;
	}

	// Get badge variant for success rate
	function getSuccessRateBadge(rate: number): 'success' | 'warning' | 'error' {
		if (rate >= 95) return 'success';
		if (rate >= 85) return 'warning';
		return 'error';
	}
</script>

<div class="analytics-container">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">Analytics Dashboard</h1>
			<p class="page-description">Track usage, performance, and costs across all skills</p>
		</div>

		<div class="header-actions">
			<Select bind:value={timeRange} options={timeRangeOptions} />
			<Button variant="secondary" size="sm">Export Report</Button>
		</div>
	</div>

	{#if loading}
		<div class="loading-state">
			<div class="spinner"></div>
			<p>Loading analytics...</p>
		</div>
	{:else if analytics}
		<!-- Key Metrics -->
		<div class="metrics-grid">
			<Panel variant="bordered" padding="lg">
				<div class="metric-card">
					<div class="metric-icon">📊</div>
					<div class="metric-content">
						<span class="metric-label">Total Invocations</span>
						<span class="metric-value">{analytics.totalInvocations.toLocaleString()}</span>
					</div>
				</div>
			</Panel>

			<Panel variant="bordered" padding="lg">
				<div class="metric-card">
					<div class="metric-icon">✅</div>
					<div class="metric-content">
						<span class="metric-label">Success Rate</span>
						<span class="metric-value success">{formatPercent(analytics.successRate)}</span>
					</div>
				</div>
			</Panel>

			<Panel variant="bordered" padding="lg">
				<div class="metric-card">
					<div class="metric-icon">⚡</div>
					<div class="metric-content">
						<span class="metric-label">Avg Response Time</span>
						<span class="metric-value">{analytics.avgResponseTime.toFixed(1)}s</span>
					</div>
				</div>
			</Panel>

			<Panel variant="bordered" padding="lg">
				<div class="metric-card">
					<div class="metric-icon">💰</div>
					<div class="metric-content">
						<span class="metric-label">Total Cost</span>
						<span class="metric-value accent">{formatCurrency(analytics.totalCost)}</span>
					</div>
				</div>
			</Panel>
		</div>

		<!-- Charts Section -->
		<div class="charts-section">
			<!-- Time Series Chart -->
			<Panel variant="bordered" padding="lg">
				<div class="chart-container">
					<h2 class="chart-title">Usage Over Time</h2>
					<div class="simple-chart">
						{#each analytics.timeSeriesData as point}
							<div class="chart-bar">
								<div
									class="bar-fill"
									style="height: {(point.invocations / 250) * 100}%"
									title="{point.invocations} invocations"
								></div>
								<span class="bar-label">{point.date.slice(5)}</span>
							</div>
						{/each}
					</div>
				</div>
			</Panel>

			<!-- Model Distribution -->
			<Panel variant="bordered" padding="lg">
				<div class="chart-container">
					<h2 class="chart-title">Model Usage Distribution</h2>
					<div class="distribution-chart">
						{#each analytics.modelUsage as model}
							{@const percentage = (model.count / analytics.totalInvocations) * 100}
							<div class="distribution-item">
								<div class="distribution-label">
									<span class="model-name">{model.model}</span>
									<span class="model-count">{model.count} ({percentage.toFixed(1)}%)</span>
								</div>
								<div class="distribution-bar">
									<div class="bar-progress" style="width: {percentage}%"></div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</Panel>
		</div>

		<!-- Top Skills Table -->
		<Panel variant="bordered" padding="lg">
			<div class="table-container">
				<h2 class="table-title">Top Skills by Usage</h2>
				<div class="skills-table">
					<div class="table-header">
						<div class="col-skill">Skill</div>
						<div class="col-count">Invocations</div>
						<div class="col-success">Success Rate</div>
						<div class="col-cost">Avg Cost</div>
					</div>

					{#each analytics.topSkills as skill}
						<div class="table-row">
							<div class="col-skill">
								<span class="skill-id">{skill.skillId}</span>
								<span class="skill-name">{skill.skillName}</span>
							</div>
							<div class="col-count">{skill.count.toLocaleString()}</div>
							<div class="col-success">
								<Badge variant={getSuccessRateBadge(skill.successRate)} size="sm">
									{formatPercent(skill.successRate)}
								</Badge>
							</div>
							<div class="col-cost">{formatCurrency(skill.avgCost)}</div>
						</div>
					{/each}
				</div>
			</div>
		</Panel>

		<!-- Model Performance Table -->
		<Panel variant="bordered" padding="lg">
			<div class="table-container">
				<h2 class="table-title">Model Performance Comparison</h2>
				<div class="models-table">
					<div class="table-header">
						<div class="col-model">Model</div>
						<div class="col-count">Usage</div>
						<div class="col-time">Avg Response</div>
						<div class="col-success">Success Rate</div>
						<div class="col-cost">Total Cost</div>
					</div>

					{#each analytics.modelUsage as model}
						<div class="table-row">
							<div class="col-model">
								<span class="model-badge">{model.model}</span>
							</div>
							<div class="col-count">{model.count.toLocaleString()}</div>
							<div class="col-time">{model.avgResponseTime.toFixed(1)}s</div>
							<div class="col-success">
								<Badge variant={getSuccessRateBadge(model.successRate)} size="sm">
									{formatPercent(model.successRate)}
								</Badge>
							</div>
							<div class="col-cost">{formatCurrency(model.totalCost)}</div>
						</div>
					{/each}
				</div>
			</div>
		</Panel>
	{/if}
</div>

<style>
	/* ═══════════════════════════════════════════════════════════════════════
     Analytics Container
     ═══════════════════════════════════════════════════════════════════════ */

	.analytics-container {
		max-width: 1600px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	/* Page Header */
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--spacing-lg);
	}

	.header-content {
		flex: 1;
	}

	.page-title {
		font-family: var(--font-family-heading);
		font-size: 2.5rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-sm) 0;
		letter-spacing: 0.02em;
	}

	.page-description {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.header-actions {
		display: flex;
		gap: var(--spacing-md);
		align-items: center;
	}

	/* Loading State */
	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-lg);
		padding: var(--spacing-3xl) var(--spacing-xl);
		text-align: center;
	}

	.spinner {
		width: 48px;
		height: 48px;
		border: 4px solid var(--color-border-subtle);
		border-top-color: var(--color-brass);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Metrics Grid */
	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--spacing-lg);
	}

	.metric-card {
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.metric-icon {
		font-size: 3rem;
	}

	.metric-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		flex: 1;
	}

	.metric-label {
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.metric-value {
		font-size: 2rem;
		font-weight: 600;
		color: var(--color-text-primary);
		font-family: var(--font-family-mono);
	}

	.metric-value.success {
		color: var(--color-success);
	}

	.metric-value.accent {
		color: var(--color-brass);
	}

	/* Charts Section */
	.charts-section {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: var(--spacing-lg);
	}

	.chart-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.chart-title {
		font-family: var(--font-family-heading);
		font-size: 1.5rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0;
		letter-spacing: 0.02em;
	}

	/* Simple Bar Chart */
	.simple-chart {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--spacing-sm);
		height: 200px;
		padding: var(--spacing-md) 0;
	}

	.chart-bar {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-sm);
		height: 100%;
	}

	.bar-fill {
		width: 100%;
		background: linear-gradient(to top, var(--color-brass), rgba(193, 151, 69, 0.3));
		border-radius: var(--radius-sm) var(--radius-sm) 0 0;
		transition: all var(--transition-fast);
		align-self: flex-end;
	}

	.bar-fill:hover {
		background: var(--color-brass);
	}

	.bar-label {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-family: var(--font-family-mono);
	}

	/* Distribution Chart */
	.distribution-chart {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.distribution-item {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.distribution-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.875rem;
	}

	.model-name {
		color: var(--color-text-primary);
		font-weight: 500;
	}

	.model-count {
		color: var(--color-text-tertiary);
		font-family: var(--font-family-mono);
	}

	.distribution-bar {
		height: 8px;
		background-color: var(--color-surface-2);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.bar-progress {
		height: 100%;
		background: linear-gradient(to right, var(--color-brass), var(--color-steel-blue));
		transition: width var(--transition-normal);
	}

	/* Tables */
	.table-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.table-title {
		font-family: var(--font-family-heading);
		font-size: 1.5rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0;
		letter-spacing: 0.02em;
	}

	.skills-table,
	.models-table {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.table-header {
		display: grid;
		padding: var(--spacing-md);
		background-color: var(--color-surface-3);
		border-radius: var(--radius-md);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.skills-table .table-header {
		grid-template-columns: 2fr 1fr 1fr 1fr;
	}

	.models-table .table-header {
		grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
	}

	.table-row {
		display: grid;
		padding: var(--spacing-md);
		background-color: var(--color-surface-2);
		border-radius: var(--radius-md);
		align-items: center;
		transition: all var(--transition-fast);
	}

	.skills-table .table-row {
		grid-template-columns: 2fr 1fr 1fr 1fr;
	}

	.models-table .table-row {
		grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
	}

	.table-row:hover {
		background-color: var(--color-surface-3);
	}

	/* Table Columns */
	.col-skill {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.skill-id {
		font-family: var(--font-family-mono);
		font-size: 0.875rem;
		color: var(--color-brass);
		font-weight: 600;
	}

	.skill-name {
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
	}

	.col-count,
	.col-time,
	.col-cost {
		font-family: var(--font-family-mono);
		font-size: 0.9375rem;
		color: var(--color-text-primary);
	}

	.col-model {
		font-family: var(--font-family-mono);
		font-size: 0.9375rem;
		color: var(--color-text-primary);
	}

	.model-badge {
		display: inline-block;
		padding: var(--spacing-xs) var(--spacing-sm);
		background-color: var(--color-surface-3);
		border-radius: var(--radius-sm);
		font-weight: 500;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.charts-section {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
		}

		.metrics-grid {
			grid-template-columns: 1fr;
		}

		.table-header,
		.table-row {
			font-size: 0.75rem;
			padding: var(--spacing-sm);
		}

		.simple-chart {
			height: 150px;
		}
	}
</style>
