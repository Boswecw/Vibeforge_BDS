/**
 * Analytics Service
 * Aggregates execution history into analytics metrics
 */

export interface HistoryEntry {
	id: string;
	timestamp: string;
	skillId: string;
	skillName: string;
	section: string;
	category: string;
	inputs: Record<string, any>;
	output: string;
	metadata: {
		sessionId?: string;
		tokensUsed?: number;
		cost?: number;
		latency?: number;
		model?: string;
	};
	success: boolean;
	error?: string;
}

export interface AnalyticsData {
	totalInvocations: number;
	successRate: number;
	avgResponseTime: number;
	totalCost: number;
	topSkills: SkillUsage[];
	modelUsage: ModelUsage[];
	errorRate: number;
	timeSeriesData: TimeSeriesPoint[];
	costTrend: CostTrendPoint[];
}

export interface SkillUsage {
	skillId: string;
	skillName: string;
	count: number;
	successRate: number;
	avgCost: number;
	avgLatency: number;
}

export interface ModelUsage {
	model: string;
	count: number;
	avgResponseTime: number;
	totalCost: number;
	successRate: number;
}

export interface TimeSeriesPoint {
	date: string;
	invocations: number;
	errors: number;
	cost: number;
}

export interface CostTrendPoint {
	date: string;
	cost: number;
	invocations: number;
}

export type TimeRange = '24h' | '7d' | '30d' | 'all';

class AnalyticsService {
	private storageKey = 'execution_history';

	/**
	 * Get all history entries from localStorage
	 */
	private getHistory(): HistoryEntry[] {
		try {
			const stored = localStorage.getItem(this.storageKey);
			if (!stored) return [];
			return JSON.parse(stored) as HistoryEntry[];
		} catch (error) {
			console.error('Failed to load history:', error);
			return [];
		}
	}

	/**
	 * Filter history by time range
	 */
	private filterByTimeRange(history: HistoryEntry[], range: TimeRange): HistoryEntry[] {
		if (range === 'all') return history;

		const now = new Date();
		let cutoff: Date;

		switch (range) {
			case '24h':
				cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
				break;
			case '7d':
				cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
				break;
			case '30d':
				cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
				break;
			default:
				return history;
		}

		return history.filter((entry) => new Date(entry.timestamp) >= cutoff);
	}

	/**
	 * Get analytics data for a given time range
	 */
	getAnalytics(timeRange: TimeRange = '7d'): AnalyticsData {
		const allHistory = this.getHistory();
		const history = this.filterByTimeRange(allHistory, timeRange);

		if (history.length === 0) {
			return this.getEmptyAnalytics();
		}

		// Calculate basic metrics
		const totalInvocations = history.length;
		const successCount = history.filter((h) => h.success).length;
		const successRate = (successCount / totalInvocations) * 100;
		const errorRate = 100 - successRate;

		// Calculate average response time
		const latencies = history
			.filter((h) => h.metadata.latency !== undefined)
			.map((h) => h.metadata.latency!);
		const avgResponseTime =
			latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;

		// Calculate total cost
		const totalCost = history.reduce((sum, h) => sum + (h.metadata.cost || 0), 0);

		// Get top skills
		const skillStats = new Map<string, { entries: HistoryEntry[]; name: string }>();
		history.forEach((entry) => {
			if (!skillStats.has(entry.skillId)) {
				skillStats.set(entry.skillId, {
					entries: [],
					name: entry.skillName
				});
			}
			skillStats.get(entry.skillId)!.entries.push(entry);
		});

		const topSkills: SkillUsage[] = Array.from(skillStats.entries())
			.map(([skillId, { entries, name }]) => {
				const successCount = entries.filter((e) => e.success).length;
				const totalCost = entries.reduce((sum, e) => sum + (e.metadata.cost || 0), 0);
				const latencies = entries
					.filter((e) => e.metadata.latency !== undefined)
					.map((e) => e.metadata.latency!);
				const avgLatency =
					latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;

				return {
					skillId,
					skillName: name,
					count: entries.length,
					successRate: (successCount / entries.length) * 100,
					avgCost: totalCost / entries.length,
					avgLatency
				};
			})
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);

		// Get model usage
		const modelStats = new Map<string, HistoryEntry[]>();
		history.forEach((entry) => {
			const model = entry.metadata.model || 'Unknown';
			if (!modelStats.has(model)) {
				modelStats.set(model, []);
			}
			modelStats.get(model)!.push(entry);
		});

		const modelUsage: ModelUsage[] = Array.from(modelStats.entries())
			.map(([model, entries]) => {
				const successCount = entries.filter((e) => e.success).length;
				const totalCost = entries.reduce((sum, e) => sum + (e.metadata.cost || 0), 0);
				const latencies = entries
					.filter((e) => e.metadata.latency !== undefined)
					.map((e) => e.metadata.latency!);
				const avgResponseTime =
					latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;

				return {
					model,
					count: entries.length,
					avgResponseTime,
					totalCost,
					successRate: (successCount / entries.length) * 100
				};
			})
			.sort((a, b) => b.count - a.count);

		// Generate time series data
		const timeSeriesData = this.generateTimeSeries(history, timeRange);

		// Generate cost trend
		const costTrend = this.generateCostTrend(history, timeRange);

		return {
			totalInvocations,
			successRate,
			avgResponseTime,
			totalCost,
			topSkills,
			modelUsage,
			errorRate,
			timeSeriesData,
			costTrend
		};
	}

	/**
	 * Generate time series data grouped by day/hour
	 */
	private generateTimeSeries(history: HistoryEntry[], range: TimeRange): TimeSeriesPoint[] {
		// Group by date
		const grouped = new Map<string, HistoryEntry[]>();

		const formatDate = (date: Date): string => {
			if (range === '24h') {
				// Hourly granularity for 24h
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
			} else {
				// Daily granularity for 7d, 30d, all
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
			}
		};

		history.forEach((entry) => {
			const date = formatDate(new Date(entry.timestamp));
			if (!grouped.has(date)) {
				grouped.set(date, []);
			}
			grouped.get(date)!.push(entry);
		});

		// Convert to time series points
		const points: TimeSeriesPoint[] = Array.from(grouped.entries())
			.map(([date, entries]) => ({
				date,
				invocations: entries.length,
				errors: entries.filter((e) => !e.success).length,
				cost: entries.reduce((sum, e) => sum + (e.metadata.cost || 0), 0)
			}))
			.sort((a, b) => a.date.localeCompare(b.date));

		return points;
	}

	/**
	 * Generate cost trend data
	 */
	private generateCostTrend(history: HistoryEntry[], range: TimeRange): CostTrendPoint[] {
		const grouped = new Map<string, HistoryEntry[]>();

		const formatDate = (date: Date): string => {
			if (range === '24h') {
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
			} else {
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
			}
		};

		history.forEach((entry) => {
			const date = formatDate(new Date(entry.timestamp));
			if (!grouped.has(date)) {
				grouped.set(date, []);
			}
			grouped.get(date)!.push(entry);
		});

		const points: CostTrendPoint[] = Array.from(grouped.entries())
			.map(([date, entries]) => ({
				date,
				cost: entries.reduce((sum, e) => sum + (e.metadata.cost || 0), 0),
				invocations: entries.length
			}))
			.sort((a, b) => a.date.localeCompare(b.date));

		return points;
	}

	/**
	 * Get empty analytics data (no history)
	 */
	private getEmptyAnalytics(): AnalyticsData {
		return {
			totalInvocations: 0,
			successRate: 0,
			avgResponseTime: 0,
			totalCost: 0,
			topSkills: [],
			modelUsage: [],
			errorRate: 0,
			timeSeriesData: [],
			costTrend: []
		};
	}

	/**
	 * Export analytics data to CSV
	 */
	exportToCSV(timeRange: TimeRange = '7d'): string {
		const analytics = this.getAnalytics(timeRange);
		const lines: string[] = [];

		// Summary section
		lines.push('Analytics Summary');
		lines.push(`Time Range,${timeRange}`);
		lines.push(`Total Invocations,${analytics.totalInvocations}`);
		lines.push(`Success Rate,${analytics.successRate.toFixed(2)}%`);
		lines.push(`Error Rate,${analytics.errorRate.toFixed(2)}%`);
		lines.push(`Average Response Time,${analytics.avgResponseTime.toFixed(3)}s`);
		lines.push(`Total Cost,$${analytics.totalCost.toFixed(4)}`);
		lines.push('');

		// Top Skills section
		lines.push('Top Skills by Usage');
		lines.push('Skill ID,Skill Name,Count,Success Rate,Avg Cost,Avg Latency');
		analytics.topSkills.forEach((skill) => {
			lines.push(
				`${skill.skillId},${skill.skillName},${skill.count},${skill.successRate.toFixed(2)}%,$${skill.avgCost.toFixed(4)},${skill.avgLatency.toFixed(3)}s`
			);
		});
		lines.push('');

		// Model Usage section
		lines.push('Model Usage Breakdown');
		lines.push('Model,Count,Avg Response Time,Total Cost,Success Rate');
		analytics.modelUsage.forEach((model) => {
			lines.push(
				`${model.model},${model.count},${model.avgResponseTime.toFixed(3)}s,$${model.totalCost.toFixed(4)},${model.successRate.toFixed(2)}%`
			);
		});
		lines.push('');

		// Time Series section
		lines.push('Time Series Data');
		lines.push('Date,Invocations,Errors,Cost');
		analytics.timeSeriesData.forEach((point) => {
			lines.push(`${point.date},${point.invocations},${point.errors},$${point.cost.toFixed(4)}`);
		});

		return lines.join('\n');
	}

	/**
	 * Download CSV file
	 */
	downloadCSV(timeRange: TimeRange = '7d') {
		const csv = this.exportToCSV(timeRange);
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);

		const timestamp = new Date().toISOString().split('T')[0];
		link.setAttribute('href', url);
		link.setAttribute('download', `vibeforge_analytics_${timeRange}_${timestamp}.csv`);
		link.style.visibility = 'hidden';

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
