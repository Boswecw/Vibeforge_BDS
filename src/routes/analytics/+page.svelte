<script lang="ts">
	import { onMount } from 'svelte';
	import { Panel, Badge, Button, Select } from '$lib/components';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import {
		analyticsService,
		type AnalyticsData,
		type TimeRange
	} from '$lib/services/analyticsService';

	// State
	let analytics = $state<AnalyticsData | null>(null);
	let loading = $state(true);
	let timeRange = $state<TimeRange>('7d');
	let refreshing = $state(false);

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
		try {
			analytics = analyticsService.getAnalytics(timeRange);
		} catch (error) {
			console.error('Failed to load analytics:', error);
		} finally {
			loading = false;
		}
	}

	// Refresh analytics
	function refreshAnalytics() {
		refreshing = true;
		setTimeout(() => {
			loadAnalytics();
			refreshing = false;
		}, 500);
	}

	// Export to CSV
	function exportCSV() {
		try {
			analyticsService.downloadCSV(timeRange);
		} catch (error) {
			console.error('Failed to export CSV:', error);
			alert('Failed to export CSV. Please try again.');
		}
	}

	// Reload when time range changes
	$effect(() => {
		timeRange;
		loadAnalytics();
	});

	// Format currency
	function formatCurrency(value: number): string {
		return `$${value.toFixed(4)}`;
	}

	// Format percentage
	function formatPercent(value: number): string {
		return `${value.toFixed(1)}%`;
	}

	// Format time
	function formatTime(seconds: number): string {
		if (seconds < 1) return `${(seconds * 1000).toFixed(0)}ms`;
		return `${seconds.toFixed(2)}s`;
	}

	// Get badge variant for success rate
	function getSuccessRateBadge(rate: number): 'success' | 'warning' | 'error' {
		if (rate >= 95) return 'success';
		if (rate >= 85) return 'warning';
		return 'error';
	}

	// Chart data
	let invocationsChartData = $derived.by(() => {
		if (!analytics) return { labels: [], datasets: [] };
		return {
			labels: analytics.timeSeriesData.map((d) => d.date),
			datasets: [
				{
					label: 'Invocations',
					data: analytics.timeSeriesData.map((d) => d.invocations),
					borderColor: 'rgb(197, 167, 123)',
					backgroundColor: 'rgba(197, 167, 123, 0.1)',
					fill: true,
					tension: 0.4
				},
				{
					label: 'Errors',
					data: analytics.timeSeriesData.map((d) => d.errors),
					borderColor: 'rgb(220, 68, 68)',
					backgroundColor: 'rgba(220, 68, 68, 0.1)',
					fill: true,
					tension: 0.4
				}
			]
		};
	});

	let costChartData = $derived.by(() => {
		if (!analytics) return { labels: [], datasets: [] };
		return {
			labels: analytics.costTrend.map((d) => d.date),
			datasets: [
				{
					label: 'Cost ($)',
					data: analytics.costTrend.map((d) => d.cost),
					borderColor: 'rgb(45, 212, 191)',
					backgroundColor: 'rgba(45, 212, 191, 0.1)',
					fill: true,
					tension: 0.4
				}
			]
		};
	});

	let topSkillsChartData = $derived.by(() => {
		if (!analytics) return { labels: [], datasets: [] };
		return {
			labels: analytics.topSkills.slice(0, 10).map((s) => s.skillName),
			datasets: [
				{
					label: 'Usage Count',
					data: analytics.topSkills.slice(0, 10).map((s) => s.count),
					backgroundColor: analytics.topSkills
						.slice(0, 10)
						.map(() => 'rgba(197, 167, 123, 0.7)'),
					borderColor: analytics.topSkills.slice(0, 10).map(() => 'rgb(197, 167, 123)'),
					borderWidth: 1
				}
			]
		};
	});

	let modelUsageChartData = $derived.by(() => {
		if (!analytics) return { labels: [], datasets: [] };
		const colors = [
			'rgba(197, 167, 123, 0.7)', // BDS brass
			'rgba(45, 212, 191, 0.7)', // Teal
			'rgba(99, 102, 241, 0.7)', // Indigo
			'rgba(236, 72, 153, 0.7)' // Pink
		];
		return {
			labels: analytics.modelUsage.map((m) => m.model),
			datasets: [
				{
					label: 'Usage Count',
					data: analytics.modelUsage.map((m) => m.count),
					backgroundColor: colors.slice(0, analytics.modelUsage.length),
					borderColor: colors.map((c) => c.replace('0.7', '1')).slice(0, analytics.modelUsage.length),
					borderWidth: 1
				}
			]
		};
	});
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
			<Button variant="secondary" size="sm" onclick={refreshAnalytics} loading={refreshing}>
				{refreshing ? 'Refreshing...' : 'Refresh'}
			</Button>
			<Button variant="primary" size="sm" onclick={exportCSV}>Export CSV</Button>
		</div>
	</div>

	{#if loading}
		<div class="loading-state">
			<div class="spinner"></div>
			<p>Loading analytics...</p>
		</div>
	{:else if analytics && analytics.totalInvocations > 0}
		<!-- Key Metrics -->
		<div class="metrics-grid">
			<Panel variant="bordered" padding="lg">
				<div class="metric-card">
					<div class="metric-icon">📊</div>
					<div class="metric-content">
						<div class="metric-label">Total Invocations</div>
						<div class="metric-value">{analytics.totalInvocations.toLocaleString()}</div>
					</div>
				</div>
			</Panel>

			<Panel variant="bordered" padding="lg">
				<div class="metric-card">
					<div class="metric-icon">✅</div>
					<div class="metric-content">
						<div class="metric-label">Success Rate</div>
						<div class="metric-value">
							<Badge variant={getSuccessRateBadge(analytics.successRate)}>
								{formatPercent(analytics.successRate)}
							</Badge>
						</div>
					</div>
				</div>
			</Panel>

			<Panel variant="bordered" padding="lg">
				<div class="metric-card">
					<div class="metric-icon">⚡</div>
					<div class="metric-content">
						<div class="metric-label">Avg Response Time</div>
						<div class="metric-value">{formatTime(analytics.avgResponseTime)}</div>
					</div>
				</div>
			</Panel>

			<Panel variant="bordered" padding="lg">
				<div class="metric-card">
					<div class="metric-icon">💰</div>
					<div class="metric-content">
						<div class="metric-label">Total Cost</div>
						<div class="metric-value">{formatCurrency(analytics.totalCost)}</div>
					</div>
				</div>
			</Panel>
		</div>

		<!-- Time Series Charts -->
		<div class="charts-row">
			<Panel variant="bordered" padding="lg">
				<h2 class="chart-title">Invocations & Errors Over Time</h2>
				<LineChart
					labels={invocationsChartData.labels}
					datasets={invocationsChartData.datasets}
					height={300}
				/>
			</Panel>
		</div>

		<div class="charts-row">
			<Panel variant="bordered" padding="lg">
				<h2 class="chart-title">Cost Trend</h2>
				<LineChart labels={costChartData.labels} datasets={costChartData.datasets} height={300} />
			</Panel>
		</div>

		<!-- Top Skills and Model Usage -->
		<div class="charts-grid">
			<Panel variant="bordered" padding="lg">
				<h2 class="chart-title">Top 10 Skills by Usage</h2>
				<BarChart
					labels={topSkillsChartData.labels}
					datasets={topSkillsChartData.datasets}
					height={350}
					horizontal={true}
				/>
			</Panel>

			<Panel variant="bordered" padding="lg">
				<h2 class="chart-title">Model Usage Distribution</h2>
				<BarChart
					labels={modelUsageChartData.labels}
					datasets={modelUsageChartData.datasets}
					height={350}
				/>
			</Panel>
		</div>

		<!-- Top Skills Table -->
		<Panel variant="bordered" padding="lg">
			<h2 class="section-title">Top Skills by Usage</h2>
			<div class="table-container">
				<table class="skills-table">
					<thead>
						<tr>
							<th>Rank</th>
							<th>Skill</th>
							<th class="text-right">Usage</th>
							<th class="text-right">Success Rate</th>
							<th class="text-right">Avg Cost</th>
							<th class="text-right">Avg Latency</th>
						</tr>
					</thead>
					<tbody>
						{#each analytics.topSkills.slice(0, 10) as skill, index}
							<tr>
								<td><Badge variant="default">{index + 1}</Badge></td>
								<td>
									<div class="skill-name">{skill.skillName}</div>
									<div class="skill-id">{skill.skillId}</div>
								</td>
								<td class="text-right">{skill.count}</td>
								<td class="text-right">
									<Badge variant={getSuccessRateBadge(skill.successRate)}>
										{formatPercent(skill.successRate)}
									</Badge>
								</td>
								<td class="text-right">{formatCurrency(skill.avgCost)}</td>
								<td class="text-right">{formatTime(skill.avgLatency)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</Panel>

		<!-- Model Usage Table -->
		<Panel variant="bordered" padding="lg">
			<h2 class="section-title">Model Usage Statistics</h2>
			<div class="table-container">
				<table class="skills-table">
					<thead>
						<tr>
							<th>Model</th>
							<th class="text-right">Usage</th>
							<th class="text-right">Success Rate</th>
							<th class="text-right">Avg Response Time</th>
							<th class="text-right">Total Cost</th>
						</tr>
					</thead>
					<tbody>
						{#each analytics.modelUsage as model}
							<tr>
								<td>
									<div class="model-name">{model.model}</div>
								</td>
								<td class="text-right">{model.count}</td>
								<td class="text-right">
									<Badge variant={getSuccessRateBadge(model.successRate)}>
										{formatPercent(model.successRate)}
									</Badge>
								</td>
								<td class="text-right">{formatTime(model.avgResponseTime)}</td>
								<td class="text-right">{formatCurrency(model.totalCost)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</Panel>
	{:else}
		<!-- Empty State -->
		<Panel variant="elevated" padding="lg">
			<div class="empty-state">
				<div class="empty-icon">📊</div>
				<h2 class="empty-title">No Analytics Data Available</h2>
				<p class="empty-message">
					Start using skills to see analytics and insights. Your usage statistics will appear here.
				</p>
				<Button variant="primary" href="/library">Browse Skills</Button>
			</div>
		</Panel>
	{/if}
</div>

<style>
	/* ═══════════════════════════════════════════════════════════════════════
     Analytics Container
     ═══════════════════════════════════════════════════════════════════════ */

	.analytics-container {
		max-width: 1400px;
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
		font-size: 1rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.header-actions {
		display: flex;
		gap: var(--spacing-md);
		align-items: center;
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
		font-size: 2.5rem;
		line-height: 1;
	}

	.metric-content {
		flex: 1;
	}

	.metric-label {
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--spacing-xs);
	}

	.metric-value {
		font-size: 1.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
		font-family: var(--font-family-mono);
	}

	/* Charts */
	.charts-row {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-lg);
	}

	.charts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
		gap: var(--spacing-lg);
	}

	.chart-title {
		font-family: var(--font-family-heading);
		font-size: 1.25rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-lg) 0;
		letter-spacing: 0.02em;
	}

	.section-title {
		font-family: var(--font-family-heading);
		font-size: 1.5rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-lg) 0;
		letter-spacing: 0.02em;
	}

	/* Tables */
	.table-container {
		overflow-x: auto;
	}

	.skills-table {
		width: 100%;
		border-collapse: collapse;
	}

	.skills-table th {
		text-align: left;
		padding: var(--spacing-md);
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-bottom: 1px solid var(--color-border);
	}

	.skills-table td {
		padding: var(--spacing-md);
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.skills-table tr:last-child td {
		border-bottom: none;
	}

	.skills-table tr:hover {
		background: var(--color-surface-tertiary);
	}

	.text-right {
		text-align: right;
	}

	.skill-name {
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.skill-id {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-family: var(--font-family-mono);
		margin-top: var(--spacing-2xs);
	}

	.model-name {
		font-family: var(--font-family-mono);
		font-weight: 500;
		color: var(--color-text-primary);
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

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-lg);
		padding: var(--spacing-3xl) var(--spacing-xl);
		text-align: center;
	}

	.empty-icon {
		font-size: 4rem;
		line-height: 1;
		opacity: 0.5;
	}

	.empty-title {
		font-family: var(--font-family-heading);
		font-size: 1.5rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0;
		letter-spacing: 0.02em;
	}

	.empty-message {
		font-size: 1rem;
		color: var(--color-text-secondary);
		max-width: 400px;
		margin: 0;
		line-height: 1.6;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
		}

		.header-actions {
			width: 100%;
			flex-wrap: wrap;
		}

		.metrics-grid {
			grid-template-columns: 1fr;
		}

		.charts-grid {
			grid-template-columns: 1fr;
		}

		.page-title {
			font-size: 2rem;
		}

		.table-container {
			overflow-x: scroll;
		}
	}
</style>
