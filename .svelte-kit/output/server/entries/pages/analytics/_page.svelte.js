import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import "../../../chunks/Pagination.svelte_svelte_type_style_lang.js";
import { B as Button } from "../../../chunks/Button.js";
/* empty css                                                  */
import { S as Select } from "../../../chunks/Select.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let timeRange = "7d";
    const timeRangeOptions = [
      { value: "24h", label: "Last 24 Hours" },
      { value: "7d", label: "Last 7 Days" },
      { value: "30d", label: "Last 30 Days" },
      { value: "all", label: "All Time" }
    ];
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
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->Export Report`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div></div> `);
      {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="loading-state svelte-1m0gshv"><div class="spinner svelte-1m0gshv"></div> <p>Loading analytics...</p></div>`);
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
