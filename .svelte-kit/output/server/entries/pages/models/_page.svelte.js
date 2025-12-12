import { $ as escape_html, Y as ensure_array_like } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import "../../../chunks/Pagination.svelte_svelte_type_style_lang.js";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
/* empty css                                                  */
import { P as Panel } from "../../../chunks/Panel.js";
import { B as Badge } from "../../../chunks/Badge.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let searchQuery = "";
    let selectedProvider = "all";
    const models = [
      {
        id: "gpt-4o",
        name: "GPT-4o",
        provider: "OpenAI",
        version: "gpt-4o-2024-08-06",
        description: "Most capable GPT-4 model, excellent for complex reasoning, coding, and creative tasks.",
        capabilities: [
          "Text Generation",
          "Code Generation",
          "Analysis",
          "Vision",
          "Function Calling"
        ],
        contextWindow: 128e3,
        maxTokens: 16384,
        pricing: { input: 2.5, output: 10 },
        performance: { avgResponseTime: 4.1, successRate: 91.4, usageCount: 186 },
        recommended: false,
        available: true
      },
      {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        provider: "OpenAI",
        version: "gpt-4o-mini-2024-07-18",
        description: "Fast, affordable model for most tasks. Best balance of speed, capability, and cost.",
        capabilities: [
          "Text Generation",
          "Code Generation",
          "Analysis",
          "Function Calling"
        ],
        contextWindow: 128e3,
        maxTokens: 16384,
        pricing: { input: 0.15, output: 0.6 },
        performance: { avgResponseTime: 1.8, successRate: 96.1, usageCount: 687 },
        recommended: true,
        available: true
      },
      {
        id: "claude-3-5-sonnet",
        name: "Claude 3.5 Sonnet",
        provider: "Anthropic",
        version: "claude-3-5-sonnet-20241022",
        description: "Anthropic's most intelligent model, excels at complex analysis, coding, and nuanced writing.",
        capabilities: [
          "Text Generation",
          "Code Generation",
          "Analysis",
          "Vision",
          "Long Context"
        ],
        contextWindow: 2e5,
        maxTokens: 8192,
        pricing: { input: 3, output: 15 },
        performance: { avgResponseTime: 3.2, successRate: 95.8, usageCount: 324 },
        recommended: true,
        available: true
      },
      {
        id: "claude-3-5-haiku",
        name: "Claude 3.5 Haiku",
        provider: "Anthropic",
        version: "claude-3-5-haiku-20241022",
        description: "Fastest Claude model, ideal for quick tasks and high-volume processing.",
        capabilities: ["Text Generation", "Code Generation", "Analysis"],
        contextWindow: 2e5,
        maxTokens: 8192,
        pricing: { input: 0.8, output: 4 },
        performance: { avgResponseTime: 1.2, successRate: 94, usageCount: 50 },
        recommended: false,
        available: true
      },
      {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        provider: "Google",
        version: "gemini-1.5-pro-latest",
        description: "Google's most capable model with massive context window for document analysis.",
        capabilities: [
          "Text Generation",
          "Code Generation",
          "Analysis",
          "Vision",
          "Ultra Long Context"
        ],
        contextWindow: 2e6,
        maxTokens: 8192,
        pricing: { input: 1.25, output: 5 },
        performance: { avgResponseTime: 5.8, successRate: 89.2, usageCount: 0 },
        recommended: false,
        available: false
      },
      {
        id: "llama-3.3-70b",
        name: "Llama 3.3 70B",
        provider: "Meta",
        version: "llama-3.3-70b-instruct",
        description: "Open source model from Meta, good for coding and reasoning tasks.",
        capabilities: ["Text Generation", "Code Generation", "Analysis"],
        contextWindow: 128e3,
        maxTokens: 8192,
        pricing: { input: 0.5, output: 0.8 },
        performance: { avgResponseTime: 2.1, successRate: 88.5, usageCount: 0 },
        recommended: false,
        available: false
      }
    ];
    let filteredModels = (() => {
      let result = models;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = result.filter((m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q));
      }
      return result;
    })();
    let stats = (() => ({
      total: models.length,
      available: models.filter((m) => m.available).length,
      recommended: models.filter((m) => m.recommended).length,
      openai: models.filter((m) => m.provider === "OpenAI").length,
      anthropic: models.filter((m) => m.provider === "Anthropic").length
    }))();
    const providerOptions = ["all", "OpenAI", "Anthropic", "Google", "Meta"];
    function getProviderBadge(provider) {
      const variants = {
        OpenAI: "info",
        Anthropic: "accent",
        Google: "warning",
        Meta: "success"
      };
      return variants[provider] || "info";
    }
    function formatPricing(price) {
      return `$${price.toFixed(2)} / 1M tokens`;
    }
    function formatContextWindow(tokens) {
      if (tokens >= 1e6) {
        return `${(tokens / 1e6).toFixed(1)}M`;
      }
      return `${(tokens / 1e3).toFixed(0)}K`;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="models-container svelte-18pldtr"><div class="page-header svelte-18pldtr"><div class="header-content svelte-18pldtr"><h1 class="page-title svelte-18pldtr">AI Models</h1> <p class="page-description svelte-18pldtr">Manage and compare AI models available for skill execution</p></div> <div class="stats-row svelte-18pldtr"><div class="stat-item svelte-18pldtr"><span class="stat-value svelte-18pldtr">${escape_html(stats.total)}</span> <span class="stat-label svelte-18pldtr">Total</span></div> <div class="stat-item svelte-18pldtr"><span class="stat-value success svelte-18pldtr">${escape_html(stats.available)}</span> <span class="stat-label svelte-18pldtr">Available</span></div> <div class="stat-item svelte-18pldtr"><span class="stat-value accent svelte-18pldtr">${escape_html(stats.recommended)}</span> <span class="stat-label svelte-18pldtr">Recommended</span></div></div></div> `);
      Panel($$renderer3, {
        variant: "bordered",
        padding: "lg",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="filters-section svelte-18pldtr">`);
          Input($$renderer4, {
            type: "search",
            placeholder: "Search models by name, description, or provider...",
            fullWidth: true,
            get value() {
              return searchQuery;
            },
            set value($$value) {
              searchQuery = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> <div class="provider-filters svelte-18pldtr"><!--[-->`);
          const each_array = ensure_array_like(providerOptions);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let provider = each_array[$$index];
            Button($$renderer4, {
              variant: selectedProvider === provider ? "primary" : "ghost",
              size: "sm",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->${escape_html(provider === "all" ? "All Providers" : provider)}`);
              },
              $$slots: { default: true }
            });
          }
          $$renderer4.push(`<!--]--></div> <div class="result-count svelte-18pldtr">`);
          Badge($$renderer4, {
            variant: "default",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->${escape_html(filteredModels.length)} models`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      if (filteredModels.length === 0) {
        $$renderer3.push("<!--[-->");
        Panel($$renderer3, {
          variant: "elevated",
          padding: "lg",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="empty-state svelte-18pldtr"><p class="empty-message svelte-18pldtr">No models found matching your filters.</p> `);
            Button($$renderer4, {
              variant: "primary",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Clear Filters`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div>`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push(`<div class="models-grid svelte-18pldtr"><!--[-->`);
        const each_array_1 = ensure_array_like(filteredModels);
        for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
          let model = each_array_1[$$index_2];
          Panel($$renderer3, {
            variant: "bordered",
            padding: "lg",
            children: ($$renderer4) => {
              $$renderer4.push(`<div class="model-card svelte-18pldtr"><div class="model-header svelte-18pldtr"><div class="model-title-section svelte-18pldtr"><h3 class="model-name svelte-18pldtr">${escape_html(model.name)}</h3> <div class="model-badges svelte-18pldtr">`);
              Badge($$renderer4, {
                variant: getProviderBadge(model.provider),
                size: "sm",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(model.provider)}`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              if (model.recommended) {
                $$renderer4.push("<!--[-->");
                Badge($$renderer4, {
                  variant: "success",
                  size: "sm",
                  outline: true,
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->⭐ Recommended`);
                  },
                  $$slots: { default: true }
                });
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> `);
              if (!model.available) {
                $$renderer4.push("<!--[-->");
                Badge($$renderer4, {
                  variant: "default",
                  size: "sm",
                  outline: true,
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->Coming Soon`);
                  },
                  $$slots: { default: true }
                });
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--></div></div></div> <p class="model-description svelte-18pldtr">${escape_html(model.description)}</p> <div class="capabilities-section svelte-18pldtr"><span class="section-label svelte-18pldtr">Capabilities</span> <div class="capabilities-list svelte-18pldtr"><!--[-->`);
              const each_array_2 = ensure_array_like(model.capabilities);
              for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
                let capability = each_array_2[$$index_1];
                Badge($$renderer4, {
                  variant: "info",
                  size: "sm",
                  outline: true,
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(capability)}`);
                  },
                  $$slots: { default: true }
                });
              }
              $$renderer4.push(`<!--]--></div></div> <div class="specs-section svelte-18pldtr"><div class="spec-item svelte-18pldtr"><span class="spec-label svelte-18pldtr">Context Window</span> <span class="spec-value svelte-18pldtr">${escape_html(formatContextWindow(model.contextWindow))}</span></div> <div class="spec-item svelte-18pldtr"><span class="spec-label svelte-18pldtr">Max Output</span> <span class="spec-value svelte-18pldtr">${escape_html(formatContextWindow(model.maxTokens))}</span></div> <div class="spec-item svelte-18pldtr"><span class="spec-label svelte-18pldtr">Version</span> <span class="spec-value mono svelte-18pldtr">${escape_html(model.version)}</span></div></div> <div class="pricing-section svelte-18pldtr"><span class="section-label svelte-18pldtr">Pricing</span> <div class="pricing-grid svelte-18pldtr"><div class="pricing-item svelte-18pldtr"><span class="pricing-label svelte-18pldtr">Input</span> <span class="pricing-value svelte-18pldtr">${escape_html(formatPricing(model.pricing.input))}</span></div> <div class="pricing-item svelte-18pldtr"><span class="pricing-label svelte-18pldtr">Output</span> <span class="pricing-value svelte-18pldtr">${escape_html(formatPricing(model.pricing.output))}</span></div></div></div> `);
              if (model.available && model.performance.usageCount > 0) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<div class="performance-section svelte-18pldtr"><span class="section-label svelte-18pldtr">Performance Stats</span> <div class="performance-grid svelte-18pldtr"><div class="perf-item svelte-18pldtr"><span class="perf-label svelte-18pldtr">Avg Response</span> <span class="perf-value svelte-18pldtr">${escape_html(model.performance.avgResponseTime.toFixed(1))}s</span></div> <div class="perf-item svelte-18pldtr"><span class="perf-label svelte-18pldtr">Success Rate</span> <span class="perf-value success svelte-18pldtr">${escape_html(model.performance.successRate.toFixed(1))}%</span></div> <div class="perf-item svelte-18pldtr"><span class="perf-label svelte-18pldtr">Usage</span> <span class="perf-value svelte-18pldtr">${escape_html(model.performance.usageCount.toLocaleString())}</span></div></div></div>`);
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> <div class="model-actions svelte-18pldtr">`);
              Button($$renderer4, {
                variant: "primary",
                size: "sm",
                disabled: !model.available,
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(model.available ? "Use Model" : "Not Available")}`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Button($$renderer4, {
                variant: "ghost",
                size: "sm",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->View Details`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div></div>`);
            },
            $$slots: { default: true }
          });
        }
        $$renderer3.push(`<!--]--></div>`);
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
