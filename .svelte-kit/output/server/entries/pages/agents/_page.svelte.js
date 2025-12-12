import { c as escape_html, e as ensure_array_like } from "../../../chunks/vendor.js";
import { A as AGENT_TEMPLATES } from "../../../chunks/templates.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import "../../../chunks/Pagination.svelte_svelte_type_style_lang.js";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
import { S as Select } from "../../../chunks/Select.js";
import { P as Panel } from "../../../chunks/Panel.js";
import { B as Badge } from "../../../chunks/Badge.js";
/* empty css                                                  */
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let selectedKind = "all";
    let searchQuery = "";
    let allAgents = [
      ...AGENT_TEMPLATES.planner,
      ...AGENT_TEMPLATES.execution,
      ...AGENT_TEMPLATES.evaluator,
      ...AGENT_TEMPLATES.coordinator
    ];
    let filteredAgents = (() => {
      let result = allAgents;
      if (selectedKind !== "all") {
        result = result.filter((a) => a.kind === selectedKind);
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = result.filter((a) => a.label.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.id.toLowerCase().includes(q));
      }
      return result;
    })();
    let stats = (() => ({
      total: allAgents.length,
      planner: AGENT_TEMPLATES.planner.length,
      execution: AGENT_TEMPLATES.execution.length,
      evaluator: AGENT_TEMPLATES.evaluator.length,
      coordinator: AGENT_TEMPLATES.coordinator.length,
      locked: allAgents.filter((a) => a.locked).length
    }))();
    const kindOptions = [
      { value: "all", label: "All Types" },
      { value: "planner", label: "Planner" },
      { value: "execution", label: "Execution" },
      { value: "evaluator", label: "Evaluator" },
      { value: "coordinator", label: "Coordinator" }
    ];
    function getKindVariant(kind) {
      const variants = {
        planner: "info",
        execution: "success",
        evaluator: "warning",
        coordinator: "accent"
      };
      return variants[kind];
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="agents-container svelte-h3sa6j"><div class="page-header svelte-h3sa6j"><div class="header-content svelte-h3sa6j"><h1 class="page-title svelte-h3sa6j">ForgeAgents Templates</h1> <p class="page-description svelte-h3sa6j">Manage agent templates for planning, execution, evaluation, and coordination</p></div> <div class="stats-row svelte-h3sa6j"><div class="stat-item svelte-h3sa6j"><span class="stat-value svelte-h3sa6j">${escape_html(stats.total)}</span> <span class="stat-label svelte-h3sa6j">Total</span></div> <div class="stat-item svelte-h3sa6j"><span class="stat-value info svelte-h3sa6j">${escape_html(stats.planner)}</span> <span class="stat-label svelte-h3sa6j">Planner</span></div> <div class="stat-item svelte-h3sa6j"><span class="stat-value success svelte-h3sa6j">${escape_html(stats.execution)}</span> <span class="stat-label svelte-h3sa6j">Execution</span></div> <div class="stat-item svelte-h3sa6j"><span class="stat-value warning svelte-h3sa6j">${escape_html(stats.evaluator)}</span> <span class="stat-label svelte-h3sa6j">Evaluator</span></div> <div class="stat-item svelte-h3sa6j"><span class="stat-value accent svelte-h3sa6j">${escape_html(stats.coordinator)}</span> <span class="stat-label svelte-h3sa6j">Coordinator</span></div></div></div> `);
      Panel($$renderer3, {
        variant: "bordered",
        padding: "lg",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="filters-section svelte-h3sa6j"><div class="filter-row svelte-h3sa6j">`);
          Input($$renderer4, {
            type: "search",
            placeholder: "Search agents by name, description, or ID...",
            fullWidth: true,
            get value() {
              return searchQuery;
            },
            set value($$value) {
              searchQuery = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="filter-row svelte-h3sa6j">`);
          Select($$renderer4, {
            options: kindOptions,
            placeholder: "All Types",
            fullWidth: true,
            get value() {
              return selectedKind;
            },
            set value($$value) {
              selectedKind = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Button($$renderer4, {
            variant: "secondary",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Clear Filters`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div> <div class="result-count svelte-h3sa6j">`);
          Badge($$renderer4, {
            variant: "default",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->${escape_html(filteredAgents.length)} agents`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      if (filteredAgents.length === 0) {
        $$renderer3.push("<!--[-->");
        Panel($$renderer3, {
          variant: "elevated",
          padding: "lg",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="empty-state svelte-h3sa6j"><p class="empty-message svelte-h3sa6j">No agents found matching your filters.</p> `);
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
        $$renderer3.push(`<div class="agents-grid svelte-h3sa6j"><!--[-->`);
        const each_array = ensure_array_like(filteredAgents);
        for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
          let agent = each_array[$$index_1];
          Panel($$renderer3, {
            variant: "bordered",
            padding: "lg",
            children: ($$renderer4) => {
              $$renderer4.push(`<div class="agent-card svelte-h3sa6j"><div class="agent-header svelte-h3sa6j"><div class="agent-title svelte-h3sa6j"><h3 class="svelte-h3sa6j">${escape_html(agent.label)}</h3> <div class="badges svelte-h3sa6j">`);
              Badge($$renderer4, {
                variant: getKindVariant(agent.kind),
                size: "sm",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(agent.kind)}`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              if (agent.locked) {
                $$renderer4.push("<!--[-->");
                Badge($$renderer4, {
                  variant: "default",
                  size: "sm",
                  outline: true,
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->🔒 Locked`);
                  },
                  $$slots: { default: true }
                });
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> `);
              if (agent.autoEvaluateWithSAS) {
                $$renderer4.push("<!--[-->");
                Badge($$renderer4, {
                  variant: "success",
                  size: "sm",
                  outline: true,
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->✓ SAS Auto-Eval`);
                  },
                  $$slots: { default: true }
                });
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--></div></div></div> <p class="agent-description svelte-h3sa6j">${escape_html(agent.description)}</p> <div class="agent-details svelte-h3sa6j"><div class="detail-item svelte-h3sa6j"><span class="detail-label svelte-h3sa6j">Pipeline ID</span> <code class="detail-value svelte-h3sa6j">${escape_html(agent.pipelineId)}</code></div> <div class="detail-item svelte-h3sa6j"><span class="detail-label svelte-h3sa6j">Agent ID</span> <code class="detail-value svelte-h3sa6j">${escape_html(agent.id)}</code></div></div> `);
              if (agent.allowedRepos.length > 0) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<div class="repos-section svelte-h3sa6j"><span class="repos-label svelte-h3sa6j">Allowed Repos</span> <div class="repos-list svelte-h3sa6j"><!--[-->`);
                const each_array_1 = ensure_array_like(agent.allowedRepos);
                for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                  let repo = each_array_1[$$index];
                  Badge($$renderer4, {
                    variant: "default",
                    size: "sm",
                    outline: true,
                    children: ($$renderer5) => {
                      $$renderer5.push(`<!---->${escape_html(repo)}`);
                    },
                    $$slots: { default: true }
                  });
                }
                $$renderer4.push(`<!--]--></div></div>`);
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> <div class="agent-actions svelte-h3sa6j">`);
              Button($$renderer4, {
                variant: "primary",
                size: "sm",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->View Details`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Button($$renderer4, {
                variant: "ghost",
                size: "sm",
                disabled: agent.locked,
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Edit Template`);
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
