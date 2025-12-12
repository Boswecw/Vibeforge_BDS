<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		Chart,
		BarController,
		BarElement,
		LinearScale,
		CategoryScale,
		Title,
		Tooltip,
		Legend
	} from 'chart.js';

	// Register Chart.js components
	Chart.register(BarController, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

	interface Props {
		labels: string[];
		datasets: {
			label: string;
			data: number[];
			backgroundColor?: string | string[];
			borderColor?: string | string[];
			borderWidth?: number;
		}[];
		title?: string;
		height?: number;
		horizontal?: boolean;
	}

	let { labels, datasets, title, height = 300, horizontal = false }: Props = $props();

	let canvasRef: HTMLCanvasElement;
	let chart: Chart | null = $state(null);

	onMount(() => {
		if (canvasRef) {
			const ctx = canvasRef.getContext('2d');
			if (ctx) {
				chart = new Chart(ctx, {
					type: 'bar',
					data: {
						labels,
						datasets: datasets.map((ds) => ({
							...ds,
							backgroundColor:
								ds.backgroundColor ??
								(Array.isArray(labels)
									? labels.map(() => 'rgba(197, 167, 123, 0.7)')
									: 'rgba(197, 167, 123, 0.7)'),
							borderColor:
								ds.borderColor ??
								(Array.isArray(labels)
									? labels.map(() => 'rgb(197, 167, 123)')
									: 'rgb(197, 167, 123)'),
							borderWidth: ds.borderWidth ?? 1
						}))
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						indexAxis: horizontal ? 'y' : 'x',
						plugins: {
							legend: {
								display: datasets.length > 1,
								position: 'top',
								labels: {
									color: 'rgb(225, 219, 210)',
									font: {
										family: "'Geist', sans-serif"
									}
								}
							},
							title: {
								display: !!title,
								text: title,
								color: 'rgb(225, 219, 210)',
								font: {
									family: "'Geist', sans-serif",
									size: 16
								}
							},
							tooltip: {
								backgroundColor: 'rgba(30, 28, 26, 0.95)',
								titleColor: 'rgb(225, 219, 210)',
								bodyColor: 'rgb(225, 219, 210)',
								borderColor: 'rgb(197, 167, 123)',
								borderWidth: 1,
								padding: 12,
								displayColors: true,
								callbacks: {
									label: function (context) {
										let label = context.dataset.label || '';
										if (label) {
											label += ': ';
										}
										if (context.parsed.y !== null && !horizontal) {
											// Vertical bar
											const value = context.parsed.y;
											if (
												label.toLowerCase().includes('cost') ||
												label.toLowerCase().includes('$')
											) {
												label += '$' + value.toFixed(4);
											} else if (label.toLowerCase().includes('rate')) {
												label += value.toFixed(2) + '%';
											} else {
												label += value.toLocaleString();
											}
										} else if (context.parsed.x !== null && horizontal) {
											// Horizontal bar
											const value = context.parsed.x;
											if (
												label.toLowerCase().includes('cost') ||
												label.toLowerCase().includes('$')
											) {
												label += '$' + value.toFixed(4);
											} else if (label.toLowerCase().includes('rate')) {
												label += value.toFixed(2) + '%';
											} else {
												label += value.toLocaleString();
											}
										}
										return label;
									}
								}
							}
						},
						scales: {
							x: {
								grid: {
									color: 'rgba(197, 167, 123, 0.1)'
								},
								ticks: {
									color: 'rgb(154, 147, 140)',
									font: {
										family: "'Geist Mono', monospace"
									}
								},
								beginAtZero: true
							},
							y: {
								grid: {
									color: 'rgba(197, 167, 123, 0.1)'
								},
								ticks: {
									color: 'rgb(154, 147, 140)',
									font: {
										family: "'Geist Mono', monospace"
									}
								},
								beginAtZero: true
							}
						}
					}
				});
			}
		}
	});

	// Update chart when data changes
	$effect(() => {
		if (chart) {
			chart.data.labels = labels;
			chart.data.datasets = datasets.map((ds) => ({
				...ds,
				backgroundColor:
					ds.backgroundColor ??
					(Array.isArray(labels)
						? labels.map(() => 'rgba(197, 167, 123, 0.7)')
						: 'rgba(197, 167, 123, 0.7)'),
				borderColor:
					ds.borderColor ??
					(Array.isArray(labels)
						? labels.map(() => 'rgb(197, 167, 123)')
						: 'rgb(197, 167, 123)'),
				borderWidth: ds.borderWidth ?? 1
			}));
			chart.update();
		}
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});
</script>

<div class="chart-container" style="height: {height}px;">
	<canvas bind:this={canvasRef}></canvas>
</div>

<style>
	.chart-container {
		position: relative;
		width: 100%;
	}
</style>
