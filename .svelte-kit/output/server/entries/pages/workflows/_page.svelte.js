import { $ as escape_html, Y as ensure_array_like, _ as attr_class } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import "../../../chunks/Pagination.svelte_svelte_type_style_lang.js";
import { B as Button } from "../../../chunks/Button.js";
/* empty css                                                  */
import { P as Panel } from "../../../chunks/Panel.js";
import { B as Badge } from "../../../chunks/Badge.js";
import { A as Alert } from "../../../chunks/Alert.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let workflows = [];
    let selectedWorkflow = null;
    let isCreatingWorkflow = false;
    function getStatusVariant(status) {
      const variants = { draft: "default", active: "success", archived: "warning" };
      return variants[status];
    }
    let stats = (() => ({
      total: workflows.length,
      draft: workflows.filter((w) => w.status === "draft").length,
      active: workflows.filter((w) => w.status === "active").length,
      archived: workflows.filter((w) => w.status === "archived").length
    }))();
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="workflows-container svelte-1k5z4u1"><div class="page-header svelte-1k5z4u1"><div class="header-content svelte-1k5z4u1"><h1 class="page-title svelte-1k5z4u1">Skill Workflows</h1> <p class="page-description svelte-1k5z4u1">Build multi-step workflows by chaining skills together for complex automation</p></div> <div class="stats-row svelte-1k5z4u1"><div class="stat-item svelte-1k5z4u1"><span class="stat-value svelte-1k5z4u1">${escape_html(stats.total)}</span> <span class="stat-label svelte-1k5z4u1">Total</span></div> <div class="stat-item svelte-1k5z4u1"><span class="stat-value default svelte-1k5z4u1">${escape_html(stats.draft)}</span> <span class="stat-label svelte-1k5z4u1">Draft</span></div> <div class="stat-item svelte-1k5z4u1"><span class="stat-value success svelte-1k5z4u1">${escape_html(stats.active)}</span> <span class="stat-label svelte-1k5z4u1">Active</span></div> <div class="stat-item svelte-1k5z4u1"><span class="stat-value warning svelte-1k5z4u1">${escape_html(stats.archived)}</span> <span class="stat-label svelte-1k5z4u1">Archived</span></div></div></div> `);
      Alert($$renderer3, {
        variant: "info",
        title: "Workflow Builder Coming Soon",
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->The visual workflow builder is under development. You can create and manage workflows by
		chaining multiple skills together. This feature will support: <ul><li>Drag-and-drop workflow building</li> <li>Conditional branching and loops</li> <li>Data passing between skills</li> <li>Workflow templates and sharing</li> <li>Execution scheduling and monitoring</li></ul>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> <div class="content-grid svelte-1k5z4u1">`);
      Panel($$renderer3, {
        variant: "bordered",
        padding: "lg",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="section-header svelte-1k5z4u1"><h2 class="svelte-1k5z4u1">My Workflows</h2> `);
          Button($$renderer4, {
            variant: "primary",
            size: "sm",
            disabled: isCreatingWorkflow,
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->+ New Workflow`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div> `);
          {
            $$renderer4.push("<!--[!-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (workflows.length === 0) {
            $$renderer4.push("<!--[-->");
            $$renderer4.push(`<div class="empty-state svelte-1k5z4u1"><p>No workflows yet. Create your first workflow to get started.</p></div>`);
          } else {
            $$renderer4.push("<!--[!-->");
            $$renderer4.push(`<div class="workflows-list svelte-1k5z4u1"><!--[-->`);
            const each_array = ensure_array_like(workflows);
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let workflow = each_array[$$index];
              $$renderer4.push(`<div${attr_class("workflow-item svelte-1k5z4u1", void 0, { "selected": selectedWorkflow?.id === workflow.id })} role="button" tabindex="0"><div class="workflow-info svelte-1k5z4u1"><div class="workflow-name svelte-1k5z4u1">${escape_html(workflow.name)}</div> <div class="workflow-description svelte-1k5z4u1">${escape_html(workflow.description || "No description")}</div> <div class="workflow-meta svelte-1k5z4u1">`);
              Badge($$renderer4, {
                variant: getStatusVariant(workflow.status),
                size: "sm",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(workflow.status)}`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> <span class="workflow-steps svelte-1k5z4u1">${escape_html(workflow.steps.length)} steps</span></div></div> `);
              Button($$renderer4, {
                variant: "danger",
                size: "sm",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Delete`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div>`);
            }
            $$renderer4.push(`<!--]--></div>`);
          }
          $$renderer4.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Panel($$renderer3, {
        variant: "bordered",
        padding: "lg",
        children: ($$renderer4) => {
          {
            $$renderer4.push("<!--[!-->");
            $$renderer4.push(`<div class="no-selection svelte-1k5z4u1"><p>Select a workflow from the list to view and edit its steps.</p></div>`);
          }
          $$renderer4.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div></div>`);
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
