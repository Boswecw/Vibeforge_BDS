import { c as escape_html } from "../../../chunks/vendor.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import "../../../chunks/Pagination.svelte_svelte_type_style_lang.js";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
import { S as Select } from "../../../chunks/Select.js";
import { P as Panel } from "../../../chunks/Panel.js";
/* empty css                                                  */
import "../../../chunks/VirtualList.svelte_svelte_type_style_lang.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let history = [];
    let filteredHistory = [];
    let searchQuery = "";
    let filterSection = "all";
    let filterStatus = "all";
    let sortBy = "recent";
    const sections = Array.from(new Set(history.map((entry) => entry.section))).sort();
    const sectionOptions = [
      { value: "all", label: "All Sections" },
      ...sections.map((s) => ({ value: s, label: s }))
    ];
    const statusOptions = [
      { value: "all", label: "All Status" },
      { value: "success", label: "Success Only" },
      { value: "error", label: "Errors Only" }
    ];
    const sortOptions = [
      { value: "recent", label: "Most Recent" },
      { value: "oldest", label: "Oldest First" },
      { value: "name", label: "Skill Name" },
      { value: "cost", label: "Highest Cost" }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="history-container svelte-1xl2tfr"><div class="page-header svelte-1xl2tfr"><div class="header-content svelte-1xl2tfr"><h1 class="page-title svelte-1xl2tfr">Execution History</h1> <p class="page-description svelte-1xl2tfr">${escape_html(filteredHistory.length)} execution entries</p></div> `);
      if (history.length > 0) {
        $$renderer3.push("<!--[-->");
        Button($$renderer3, {
          variant: "danger",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Clear All History`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--></div> `);
      if (history.length > 0) {
        $$renderer3.push("<!--[-->");
        Panel($$renderer3, {
          variant: "bordered",
          padding: "lg",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="filters-section svelte-1xl2tfr">`);
            Input($$renderer4, {
              type: "search",
              placeholder: "Search by skill name, section, or category...",
              fullWidth: true,
              get value() {
                return searchQuery;
              },
              set value($$value) {
                searchQuery = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----> <div class="filter-row svelte-1xl2tfr">`);
            Select($$renderer4, {
              options: sectionOptions,
              fullWidth: true,
              get value() {
                return filterSection;
              },
              set value($$value) {
                filterSection = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----> `);
            Select($$renderer4, {
              options: statusOptions,
              fullWidth: true,
              get value() {
                return filterStatus;
              },
              set value($$value) {
                filterStatus = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----> `);
            Select($$renderer4, {
              options: sortOptions,
              fullWidth: true,
              get value() {
                return sortBy;
              },
              set value($$value) {
                sortBy = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div>`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="loading-state svelte-1xl2tfr"><div class="spinner svelte-1xl2tfr"></div> <p>Loading history...</p></div>`);
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
