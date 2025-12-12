import { c as escape_html, i as await_block, e as ensure_array_like } from "../../../chunks/vendor.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import "../../../chunks/Pagination.svelte_svelte_type_style_lang.js";
import { B as Button } from "../../../chunks/Button.js";
/* empty css                                                  */
import { S as Select } from "../../../chunks/Select.js";
import { P as Panel } from "../../../chunks/Panel.js";
import { B as Badge } from "../../../chunks/Badge.js";
class AnalyticsService {
  storageKey = "execution_history";
  /**
   * Get all history entries from localStorage
   */
  getHistory() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to load history:", error);
      return [];
    }
  }
  /**
   * Filter history by time range
   */
  filterByTimeRange(history, range) {
    if (range === "all") return history;
    const now = /* @__PURE__ */ new Date();
    let cutoff;
    switch (range) {
      case "24h":
        cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
        break;
      case "7d":
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
        break;
      case "30d":
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
        break;
      default:
        return history;
    }
    return history.filter((entry) => new Date(entry.timestamp) >= cutoff);
  }
  /**
   * Get analytics data for a given time range
   */
  getAnalytics(timeRange = "7d") {
    const allHistory = this.getHistory();
    const history = this.filterByTimeRange(allHistory, timeRange);
    if (history.length === 0) {
      return this.getEmptyAnalytics();
    }
    const totalInvocations = history.length;
    const successCount = history.filter((h) => h.success).length;
    const successRate = successCount / totalInvocations * 100;
    const errorRate = 100 - successRate;
    const latencies = history.filter((h) => h.metadata.latency !== void 0).map((h) => h.metadata.latency);
    const avgResponseTime = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
    const totalCost = history.reduce((sum, h) => sum + (h.metadata.cost || 0), 0);
    const skillStats = /* @__PURE__ */ new Map();
    history.forEach((entry) => {
      if (!skillStats.has(entry.skillId)) {
        skillStats.set(entry.skillId, {
          entries: [],
          name: entry.skillName
        });
      }
      skillStats.get(entry.skillId).entries.push(entry);
    });
    const topSkills = Array.from(skillStats.entries()).map(([skillId, { entries, name }]) => {
      const successCount2 = entries.filter((e) => e.success).length;
      const totalCost2 = entries.reduce((sum, e) => sum + (e.metadata.cost || 0), 0);
      const latencies2 = entries.filter((e) => e.metadata.latency !== void 0).map((e) => e.metadata.latency);
      const avgLatency = latencies2.length > 0 ? latencies2.reduce((a, b) => a + b, 0) / latencies2.length : 0;
      return {
        skillId,
        skillName: name,
        count: entries.length,
        successRate: successCount2 / entries.length * 100,
        avgCost: totalCost2 / entries.length,
        avgLatency
      };
    }).sort((a, b) => b.count - a.count).slice(0, 10);
    const modelStats = /* @__PURE__ */ new Map();
    history.forEach((entry) => {
      const model = entry.metadata.model || "Unknown";
      if (!modelStats.has(model)) {
        modelStats.set(model, []);
      }
      modelStats.get(model).push(entry);
    });
    const modelUsage = Array.from(modelStats.entries()).map(([model, entries]) => {
      const successCount2 = entries.filter((e) => e.success).length;
      const totalCost2 = entries.reduce((sum, e) => sum + (e.metadata.cost || 0), 0);
      const latencies2 = entries.filter((e) => e.metadata.latency !== void 0).map((e) => e.metadata.latency);
      const avgResponseTime2 = latencies2.length > 0 ? latencies2.reduce((a, b) => a + b, 0) / latencies2.length : 0;
      return {
        model,
        count: entries.length,
        avgResponseTime: avgResponseTime2,
        totalCost: totalCost2,
        successRate: successCount2 / entries.length * 100
      };
    }).sort((a, b) => b.count - a.count);
    const timeSeriesData = this.generateTimeSeries(history, timeRange);
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
  generateTimeSeries(history, range) {
    const grouped = /* @__PURE__ */ new Map();
    const formatDate = (date) => {
      if (range === "24h") {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:00`;
      } else {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      }
    };
    history.forEach((entry) => {
      const date = formatDate(new Date(entry.timestamp));
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date).push(entry);
    });
    const points = Array.from(grouped.entries()).map(([date, entries]) => ({
      date,
      invocations: entries.length,
      errors: entries.filter((e) => !e.success).length,
      cost: entries.reduce((sum, e) => sum + (e.metadata.cost || 0), 0)
    })).sort((a, b) => a.date.localeCompare(b.date));
    return points;
  }
  /**
   * Generate cost trend data
   */
  generateCostTrend(history, range) {
    const grouped = /* @__PURE__ */ new Map();
    const formatDate = (date) => {
      if (range === "24h") {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:00`;
      } else {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      }
    };
    history.forEach((entry) => {
      const date = formatDate(new Date(entry.timestamp));
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date).push(entry);
    });
    const points = Array.from(grouped.entries()).map(([date, entries]) => ({
      date,
      cost: entries.reduce((sum, e) => sum + (e.metadata.cost || 0), 0),
      invocations: entries.length
    })).sort((a, b) => a.date.localeCompare(b.date));
    return points;
  }
  /**
   * Get empty analytics data (no history)
   */
  getEmptyAnalytics() {
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
  exportToCSV(timeRange = "7d") {
    const analytics = this.getAnalytics(timeRange);
    const lines = [];
    lines.push("Analytics Summary");
    lines.push(`Time Range,${timeRange}`);
    lines.push(`Total Invocations,${analytics.totalInvocations}`);
    lines.push(`Success Rate,${analytics.successRate.toFixed(2)}%`);
    lines.push(`Error Rate,${analytics.errorRate.toFixed(2)}%`);
    lines.push(`Average Response Time,${analytics.avgResponseTime.toFixed(3)}s`);
    lines.push(`Total Cost,$${analytics.totalCost.toFixed(4)}`);
    lines.push("");
    lines.push("Top Skills by Usage");
    lines.push("Skill ID,Skill Name,Count,Success Rate,Avg Cost,Avg Latency");
    analytics.topSkills.forEach((skill) => {
      lines.push(
        `${skill.skillId},${skill.skillName},${skill.count},${skill.successRate.toFixed(2)}%,$${skill.avgCost.toFixed(4)},${skill.avgLatency.toFixed(3)}s`
      );
    });
    lines.push("");
    lines.push("Model Usage Breakdown");
    lines.push("Model,Count,Avg Response Time,Total Cost,Success Rate");
    analytics.modelUsage.forEach((model) => {
      lines.push(
        `${model.model},${model.count},${model.avgResponseTime.toFixed(3)}s,$${model.totalCost.toFixed(4)},${model.successRate.toFixed(2)}%`
      );
    });
    lines.push("");
    lines.push("Time Series Data");
    lines.push("Date,Invocations,Errors,Cost");
    analytics.timeSeriesData.forEach((point) => {
      lines.push(`${point.date},${point.invocations},${point.errors},$${point.cost.toFixed(4)}`);
    });
    return lines.join("\n");
  }
  /**
   * Download CSV file
   */
  downloadCSV(timeRange = "7d") {
    const csv = this.exportToCSV(timeRange);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `vibeforge_analytics_${timeRange}_${timestamp}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
const analyticsService = new AnalyticsService();
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const LineChartPromise = import("../../../chunks/LineChart.js");
    const BarChartPromise = import("../../../chunks/BarChart.js");
    let analytics = null;
    let loading = true;
    let timeRange = "7d";
    let refreshing = false;
    const timeRangeOptions = [
      { value: "24h", label: "Last 24 Hours" },
      { value: "7d", label: "Last 7 Days" },
      { value: "30d", label: "Last 30 Days" },
      { value: "all", label: "All Time" }
    ];
    function loadAnalytics() {
      loading = true;
      try {
        analytics = analyticsService.getAnalytics(timeRange);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        loading = false;
      }
    }
    function refreshAnalytics() {
      refreshing = true;
      setTimeout(
        () => {
          loadAnalytics();
          refreshing = false;
        },
        500
      );
    }
    function exportCSV() {
      try {
        analyticsService.downloadCSV(timeRange);
      } catch (error) {
        console.error("Failed to export CSV:", error);
        alert("Failed to export CSV. Please try again.");
      }
    }
    function formatCurrency(value) {
      return `$${value.toFixed(4)}`;
    }
    function formatPercent(value) {
      return `${value.toFixed(1)}%`;
    }
    function formatTime(seconds) {
      if (seconds < 1) return `${(seconds * 1e3).toFixed(0)}ms`;
      return `${seconds.toFixed(2)}s`;
    }
    function getSuccessRateBadge(rate) {
      if (rate >= 95) return "success";
      if (rate >= 85) return "warning";
      return "error";
    }
    let invocationsChartData = (() => {
      if (!analytics) return { labels: [], datasets: [] };
      return {
        labels: analytics.timeSeriesData.map((d) => d.date),
        datasets: [
          {
            label: "Invocations",
            data: analytics.timeSeriesData.map((d) => d.invocations),
            borderColor: "rgb(197, 167, 123)",
            backgroundColor: "rgba(197, 167, 123, 0.1)",
            fill: true,
            tension: 0.4
          },
          {
            label: "Errors",
            data: analytics.timeSeriesData.map((d) => d.errors),
            borderColor: "rgb(220, 68, 68)",
            backgroundColor: "rgba(220, 68, 68, 0.1)",
            fill: true,
            tension: 0.4
          }
        ]
      };
    })();
    let costChartData = (() => {
      if (!analytics) return { labels: [], datasets: [] };
      return {
        labels: analytics.costTrend.map((d) => d.date),
        datasets: [
          {
            label: "Cost ($)",
            data: analytics.costTrend.map((d) => d.cost),
            borderColor: "rgb(45, 212, 191)",
            backgroundColor: "rgba(45, 212, 191, 0.1)",
            fill: true,
            tension: 0.4
          }
        ]
      };
    })();
    let topSkillsChartData = (() => {
      if (!analytics) return { labels: [], datasets: [] };
      return {
        labels: analytics.topSkills.slice(0, 10).map((s) => s.skillName),
        datasets: [
          {
            label: "Usage Count",
            data: analytics.topSkills.slice(0, 10).map((s) => s.count),
            backgroundColor: analytics.topSkills.slice(0, 10).map(() => "rgba(197, 167, 123, 0.7)"),
            borderColor: analytics.topSkills.slice(0, 10).map(() => "rgb(197, 167, 123)"),
            borderWidth: 1
          }
        ]
      };
    })();
    let modelUsageChartData = (() => {
      if (!analytics) return { labels: [], datasets: [] };
      const colors = [
        "rgba(197, 167, 123, 0.7)",
        // BDS brass
        "rgba(45, 212, 191, 0.7)",
        // Teal
        "rgba(99, 102, 241, 0.7)",
        // Indigo
        "rgba(236, 72, 153, 0.7)"
        // Pink
      ];
      return {
        labels: analytics.modelUsage.map((m) => m.model),
        datasets: [
          {
            label: "Usage Count",
            data: analytics.modelUsage.map((m) => m.count),
            backgroundColor: colors.slice(0, analytics.modelUsage.length),
            borderColor: colors.map((c) => c.replace("0.7", "1")).slice(0, analytics.modelUsage.length),
            borderWidth: 1
          }
        ]
      };
    })();
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="analytics-container svelte-1m0gshv"><div class="page-header svelte-1m0gshv"><div class="header-content svelte-1m0gshv"><h1 class="page-title svelte-1m0gshv">Analytics Dashboard</h1> <p class="page-description svelte-1m0gshv">Track usage, performance, and costs across all skills</p></div> <div class="header-actions svelte-1m0gshv">`);
      Select($$renderer3, {
        options: timeRangeOptions,
        get value() {
          return timeRange;
        },
        set value($$value) {
          timeRange = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      Button($$renderer3, {
        variant: "secondary",
        size: "sm",
        onclick: refreshAnalytics,
        loading: refreshing,
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->${escape_html(refreshing ? "Refreshing..." : "Refresh")}`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Button($$renderer3, {
        variant: "primary",
        size: "sm",
        onclick: exportCSV,
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->Export CSV`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div></div> `);
      if (loading) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="loading-state svelte-1m0gshv"><div class="spinner svelte-1m0gshv"></div> <p>Loading analytics...</p></div>`);
      } else {
        $$renderer3.push("<!--[!-->");
        if (analytics && analytics.totalInvocations > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="metrics-grid svelte-1m0gshv">`);
          Panel($$renderer3, {
            variant: "bordered",
            padding: "lg",
            children: ($$renderer4) => {
              $$renderer4.push(`<div class="metric-card svelte-1m0gshv"><div class="metric-icon svelte-1m0gshv">📊</div> <div class="metric-content svelte-1m0gshv"><div class="metric-label svelte-1m0gshv">Total Invocations</div> <div class="metric-value svelte-1m0gshv">${escape_html(analytics.totalInvocations.toLocaleString())}</div></div></div>`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Panel($$renderer3, {
            variant: "bordered",
            padding: "lg",
            children: ($$renderer4) => {
              $$renderer4.push(`<div class="metric-card svelte-1m0gshv"><div class="metric-icon svelte-1m0gshv">✅</div> <div class="metric-content svelte-1m0gshv"><div class="metric-label svelte-1m0gshv">Success Rate</div> <div class="metric-value svelte-1m0gshv">`);
              Badge($$renderer4, {
                variant: getSuccessRateBadge(analytics.successRate),
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(formatPercent(analytics.successRate))}`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div></div></div>`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Panel($$renderer3, {
            variant: "bordered",
            padding: "lg",
            children: ($$renderer4) => {
              $$renderer4.push(`<div class="metric-card svelte-1m0gshv"><div class="metric-icon svelte-1m0gshv">⚡</div> <div class="metric-content svelte-1m0gshv"><div class="metric-label svelte-1m0gshv">Avg Response Time</div> <div class="metric-value svelte-1m0gshv">${escape_html(formatTime(analytics.avgResponseTime))}</div></div></div>`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Panel($$renderer3, {
            variant: "bordered",
            padding: "lg",
            children: ($$renderer4) => {
              $$renderer4.push(`<div class="metric-card svelte-1m0gshv"><div class="metric-icon svelte-1m0gshv">💰</div> <div class="metric-content svelte-1m0gshv"><div class="metric-label svelte-1m0gshv">Total Cost</div> <div class="metric-value svelte-1m0gshv">${escape_html(formatCurrency(analytics.totalCost))}</div></div></div>`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div> <div class="charts-row svelte-1m0gshv">`);
          Panel($$renderer3, {
            variant: "bordered",
            padding: "lg",
            children: ($$renderer4) => {
              $$renderer4.push(`<h2 class="chart-title svelte-1m0gshv">Invocations &amp; Errors Over Time</h2> `);
              await_block(
                $$renderer4,
                LineChartPromise,
                () => {
                  $$renderer4.push(`<div class="chart-loading svelte-1m0gshv"><div class="spinner svelte-1m0gshv"></div> <p class="svelte-1m0gshv">Loading chart...</p></div>`);
                },
                ({ default: LineChart }) => {
                  $$renderer4.push(`<!---->`);
                  LineChart($$renderer4, {
                    labels: invocationsChartData.labels,
                    datasets: invocationsChartData.datasets,
                    height: 300
                  });
                  $$renderer4.push(`<!---->`);
                }
              );
              $$renderer4.push(`<!--]-->`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div> <div class="charts-row svelte-1m0gshv">`);
          Panel($$renderer3, {
            variant: "bordered",
            padding: "lg",
            children: ($$renderer4) => {
              $$renderer4.push(`<h2 class="chart-title svelte-1m0gshv">Cost Trend</h2> `);
              await_block(
                $$renderer4,
                LineChartPromise,
                () => {
                  $$renderer4.push(`<div class="chart-loading svelte-1m0gshv"><div class="spinner svelte-1m0gshv"></div> <p class="svelte-1m0gshv">Loading chart...</p></div>`);
                },
                ({ default: LineChart }) => {
                  $$renderer4.push(`<!---->`);
                  LineChart($$renderer4, {
                    labels: costChartData.labels,
                    datasets: costChartData.datasets,
                    height: 300
                  });
                  $$renderer4.push(`<!---->`);
                }
              );
              $$renderer4.push(`<!--]-->`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div> <div class="charts-grid svelte-1m0gshv">`);
          Panel($$renderer3, {
            variant: "bordered",
            padding: "lg",
            children: ($$renderer4) => {
              $$renderer4.push(`<h2 class="chart-title svelte-1m0gshv">Top 10 Skills by Usage</h2> `);
              await_block(
                $$renderer4,
                BarChartPromise,
                () => {
                  $$renderer4.push(`<div class="chart-loading svelte-1m0gshv"><div class="spinner svelte-1m0gshv"></div> <p class="svelte-1m0gshv">Loading chart...</p></div>`);
                },
                ({ default: BarChart }) => {
                  $$renderer4.push(`<!---->`);
                  BarChart($$renderer4, {
                    labels: topSkillsChartData.labels,
                    datasets: topSkillsChartData.datasets,
                    height: 350,
                    horizontal: true
                  });
                  $$renderer4.push(`<!---->`);
                }
              );
              $$renderer4.push(`<!--]-->`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Panel($$renderer3, {
            variant: "bordered",
            padding: "lg",
            children: ($$renderer4) => {
              $$renderer4.push(`<h2 class="chart-title svelte-1m0gshv">Model Usage Distribution</h2> `);
              await_block(
                $$renderer4,
                BarChartPromise,
                () => {
                  $$renderer4.push(`<div class="chart-loading svelte-1m0gshv"><div class="spinner svelte-1m0gshv"></div> <p class="svelte-1m0gshv">Loading chart...</p></div>`);
                },
                ({ default: BarChart }) => {
                  $$renderer4.push(`<!---->`);
                  BarChart($$renderer4, {
                    labels: modelUsageChartData.labels,
                    datasets: modelUsageChartData.datasets,
                    height: 350
                  });
                  $$renderer4.push(`<!---->`);
                }
              );
              $$renderer4.push(`<!--]-->`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div> `);
          Panel($$renderer3, {
            variant: "bordered",
            padding: "lg",
            children: ($$renderer4) => {
              $$renderer4.push(`<h2 class="section-title svelte-1m0gshv">Top Skills by Usage</h2> <div class="table-container svelte-1m0gshv"><table class="skills-table svelte-1m0gshv"><thead><tr class="svelte-1m0gshv"><th class="svelte-1m0gshv">Rank</th><th class="svelte-1m0gshv">Skill</th><th class="text-right svelte-1m0gshv">Usage</th><th class="text-right svelte-1m0gshv">Success Rate</th><th class="text-right svelte-1m0gshv">Avg Cost</th><th class="text-right svelte-1m0gshv">Avg Latency</th></tr></thead><tbody><!--[-->`);
              const each_array = ensure_array_like(analytics.topSkills.slice(0, 10));
              for (let index = 0, $$length = each_array.length; index < $$length; index++) {
                let skill = each_array[index];
                $$renderer4.push(`<tr class="svelte-1m0gshv"><td class="svelte-1m0gshv">`);
                Badge($$renderer4, {
                  variant: "default",
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(index + 1)}`);
                  },
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----></td><td class="svelte-1m0gshv"><div class="skill-name svelte-1m0gshv">${escape_html(skill.skillName)}</div> <div class="skill-id svelte-1m0gshv">${escape_html(skill.skillId)}</div></td><td class="text-right svelte-1m0gshv">${escape_html(skill.count)}</td><td class="text-right svelte-1m0gshv">`);
                Badge($$renderer4, {
                  variant: getSuccessRateBadge(skill.successRate),
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(formatPercent(skill.successRate))}`);
                  },
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----></td><td class="text-right svelte-1m0gshv">${escape_html(formatCurrency(skill.avgCost))}</td><td class="text-right svelte-1m0gshv">${escape_html(formatTime(skill.avgLatency))}</td></tr>`);
              }
              $$renderer4.push(`<!--]--></tbody></table></div>`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Panel($$renderer3, {
            variant: "bordered",
            padding: "lg",
            children: ($$renderer4) => {
              $$renderer4.push(`<h2 class="section-title svelte-1m0gshv">Model Usage Statistics</h2> <div class="table-container svelte-1m0gshv"><table class="skills-table svelte-1m0gshv"><thead><tr class="svelte-1m0gshv"><th class="svelte-1m0gshv">Model</th><th class="text-right svelte-1m0gshv">Usage</th><th class="text-right svelte-1m0gshv">Success Rate</th><th class="text-right svelte-1m0gshv">Avg Response Time</th><th class="text-right svelte-1m0gshv">Total Cost</th></tr></thead><tbody><!--[-->`);
              const each_array_1 = ensure_array_like(analytics.modelUsage);
              for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                let model = each_array_1[$$index_1];
                $$renderer4.push(`<tr class="svelte-1m0gshv"><td class="svelte-1m0gshv"><div class="model-name svelte-1m0gshv">${escape_html(model.model)}</div></td><td class="text-right svelte-1m0gshv">${escape_html(model.count)}</td><td class="text-right svelte-1m0gshv">`);
                Badge($$renderer4, {
                  variant: getSuccessRateBadge(model.successRate),
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(formatPercent(model.successRate))}`);
                  },
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----></td><td class="text-right svelte-1m0gshv">${escape_html(formatTime(model.avgResponseTime))}</td><td class="text-right svelte-1m0gshv">${escape_html(formatCurrency(model.totalCost))}</td></tr>`);
              }
              $$renderer4.push(`<!--]--></tbody></table></div>`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        } else {
          $$renderer3.push("<!--[!-->");
          Panel($$renderer3, {
            variant: "elevated",
            padding: "lg",
            children: ($$renderer4) => {
              $$renderer4.push(`<div class="empty-state svelte-1m0gshv"><div class="empty-icon svelte-1m0gshv">📊</div> <h2 class="empty-title svelte-1m0gshv">No Analytics Data Available</h2> <p class="empty-message svelte-1m0gshv">Start using skills to see analytics and insights. Your usage statistics will appear here.</p> `);
              Button($$renderer4, {
                variant: "primary",
                href: "/library",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Browse Skills`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div>`);
            },
            $$slots: { default: true }
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
