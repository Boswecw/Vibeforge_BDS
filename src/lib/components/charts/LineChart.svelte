<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		CategoryScale,
		Title,
		Tooltip,
		Legend,
		Filler
	} from 'chart.js';

	// Register Chart.js components
	Chart.register(
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		CategoryScale,
		Title,
		Tooltip,
		Legend,
		Filler
	);

	interface Props {
		labels: string[];
		datasets: {
			label: string;
			data: number[];
			borderColor?: string;
			backgroundColor?: string;
			fill?: boolean;
			tension?: number;
		}[];
		title?: string;
		height?: number;
	}

	let { labels, datasets, title, height = 300 }: Props = $props();

	let canvasRef: HTMLCanvasElement;
	let chart: Chart | null = $state(null);

	onMount(() => {
		if (canvasRef) {
			const ctx = canvasRef.getContext('2d');
			if (ctx) {
				chart = new Chart(ctx, {
					type: 'line',
					data: {
						labels,
						datasets: datasets.map((ds) => ({
							...ds,
							tension: ds.tension ?? 0.4,
							fill: ds.fill ?? false,
							borderColor: ds.borderColor ?? 'rgb(197, 167, 123)', // BDS brass
							backgroundColor: ds.backgroundColor ?? 'rgba(197, 167, 123, 0.1)'
						}))
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: {
								display: true,
								position: 'top',
								labels: {
									color: 'rgb(225, 219, 210)', // BDS text
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
										if (context.parsed.y !== null) {
											// Format based on dataset label
											if (
												label.toLowerCase().includes('cost') ||
												label.toLowerCase().includes('$')
											) {
												label += '$' + context.parsed.y.toFixed(4);
											} else {
												label += context.parsed.y.toLocaleString();
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
								}
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
				tension: ds.tension ?? 0.4,
				fill: ds.fill ?? false,
				borderColor: ds.borderColor ?? 'rgb(197, 167, 123)',
				backgroundColor: ds.backgroundColor ?? 'rgba(197, 167, 123, 0.1)'
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
