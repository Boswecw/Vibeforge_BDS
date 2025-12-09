import { Z as attr, X as ensure_array_like } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import "@tauri-apps/api/core";
import { E as ErrorBoundary } from "../../../chunks/ErrorDisplay.svelte_svelte_type_style_lang.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let history = [];
    let filteredHistory = [];
    let searchQuery = "";
    let filterSection = "all";
    let filterStatus = "all";
    let sortBy = "recent";
    const sections = Array.from(new Set(history.map((entry) => entry.section))).sort();
    ErrorBoundary($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="history-container svelte-1xl2tfr"><div class="history-header svelte-1xl2tfr"><div><h1 class="svelte-1xl2tfr">Execution History</h1> <p class="history-subtitle svelte-1xl2tfr">View and manage your skill invocation history (${escape_html(filteredHistory.length)} entries)</p></div> `);
        if (history.length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<button class="btn-clear-history svelte-1xl2tfr">Clear All History</button>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div> `);
        if (history.length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="controls svelte-1xl2tfr"><div class="search-box svelte-1xl2tfr"><input type="text"${attr("value", searchQuery)} placeholder="Search by skill name, section, or category..." class="search-input svelte-1xl2tfr"/></div> <div class="filters svelte-1xl2tfr">`);
          $$renderer3.select(
            { value: filterSection, class: "filter-select" },
            ($$renderer4) => {
              $$renderer4.option({ value: "all" }, ($$renderer5) => {
                $$renderer5.push(`All Sections`);
              });
              $$renderer4.push(`<!--[-->`);
              const each_array = ensure_array_like(sections);
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let section = each_array[$$index];
                $$renderer4.option({ value: section }, ($$renderer5) => {
                  $$renderer5.push(`${escape_html(section)}`);
                });
              }
              $$renderer4.push(`<!--]-->`);
            },
            "svelte-1xl2tfr"
          );
          $$renderer3.push(` `);
          $$renderer3.select(
            { value: filterStatus, class: "filter-select" },
            ($$renderer4) => {
              $$renderer4.option({ value: "all" }, ($$renderer5) => {
                $$renderer5.push(`All Status`);
              });
              $$renderer4.option({ value: "success" }, ($$renderer5) => {
                $$renderer5.push(`Success Only`);
              });
              $$renderer4.option({ value: "error" }, ($$renderer5) => {
                $$renderer5.push(`Errors Only`);
              });
            },
            "svelte-1xl2tfr"
          );
          $$renderer3.push(` `);
          $$renderer3.select(
            { value: sortBy, class: "filter-select" },
            ($$renderer4) => {
              $$renderer4.option({ value: "recent" }, ($$renderer5) => {
                $$renderer5.push(`Most Recent`);
              });
              $$renderer4.option({ value: "oldest" }, ($$renderer5) => {
                $$renderer5.push(`Oldest First`);
              });
              $$renderer4.option({ value: "name" }, ($$renderer5) => {
                $$renderer5.push(`Skill Name`);
              });
              $$renderer4.option({ value: "cost" }, ($$renderer5) => {
                $$renderer5.push(`Highest Cost`);
              });
            },
            "svelte-1xl2tfr"
          );
          $$renderer3.push(`</div></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="empty-state svelte-1xl2tfr"><p class="svelte-1xl2tfr">Loading history...</p></div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      },
      $$slots: { default: true }
    });
  });
}
export {
  _page as default
};
