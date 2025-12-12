import { c as escape_html } from "../../../chunks/vendor.js";
import "../../../chunks/Pagination.svelte_svelte_type_style_lang.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import { B as Button } from "../../../chunks/Button.js";
/* empty css                                                  */
import { P as Panel } from "../../../chunks/Panel.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let skills = [];
    let testCases = [];
    let selectedSkillId = "";
    (() => {
      return skills.find((s) => s.id === selectedSkillId) || null;
    })();
    (() => {
      return skills.map((s) => ({ value: s.id, label: `${s.name} (${s.category})` }));
    })();
    let stats = (() => ({
      total: testCases.length,
      passed: testCases.filter((tc) => tc.lastResult?.passed === true).length,
      failed: testCases.filter((tc) => tc.lastResult?.passed === false).length,
      notRun: testCases.filter((tc) => !tc.lastResult).length
    }))();
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="testing-container svelte-6vfrt7"><div class="page-header svelte-6vfrt7"><div class="header-content svelte-6vfrt7"><h1 class="page-title svelte-6vfrt7">Skill Testing Lab</h1> <p class="page-description svelte-6vfrt7">Create, run, and manage automated tests for your skills</p></div> <div class="stats-row svelte-6vfrt7"><div class="stat-item svelte-6vfrt7"><span class="stat-value svelte-6vfrt7">${escape_html(stats.total)}</span> <span class="stat-label svelte-6vfrt7">Total Tests</span></div> <div class="stat-item svelte-6vfrt7"><span class="stat-value success svelte-6vfrt7">${escape_html(stats.passed)}</span> <span class="stat-label svelte-6vfrt7">Passed</span></div> <div class="stat-item svelte-6vfrt7"><span class="stat-value error svelte-6vfrt7">${escape_html(stats.failed)}</span> <span class="stat-label svelte-6vfrt7">Failed</span></div> <div class="stat-item svelte-6vfrt7"><span class="stat-value warning svelte-6vfrt7">${escape_html(stats.notRun)}</span> <span class="stat-label svelte-6vfrt7">Not Run</span></div></div></div> `);
      Panel($$renderer3, {
        variant: "bordered",
        padding: "md",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="view-tabs svelte-6vfrt7">`);
          Button($$renderer4, {
            variant: "primary",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Test Builder`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----> `);
          Button($$renderer4, {
            variant: "ghost",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Test Results`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="loading-state svelte-6vfrt7"><div class="spinner svelte-6vfrt7"></div> <p>Loading skills...</p></div>`);
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
