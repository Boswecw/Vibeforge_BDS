import { Z as attr, X as ensure_array_like, Y as attr_class } from "../../../chunks/index2.js";
import "@tauri-apps/api/core";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { E as ErrorBoundary } from "../../../chunks/ErrorDisplay.svelte_svelte_type_style_lang.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let skills = [];
    let filteredSkills = [];
    let searchQuery = "";
    let selectedSection = "all";
    let selectedCategory = "all";
    let selectedAccess = "all";
    let viewMode = "grid";
    let sortBy = "name";
    let sections = (() => {
      const sectionSet = new Set(skills.map((s) => s.section));
      return ["all", ...Array.from(sectionSet)];
    })();
    let categories = (() => {
      const categorySet = new Set(skills.map((s) => s.category));
      return ["all", ...Array.from(categorySet)];
    })();
    let stats = (() => ({
      total: skills.length,
      public: skills.filter((s) => s.access === "PUBLIC").length,
      bdsOnly: skills.filter((s) => s.access === "BDS_ONLY").length,
      filtered: filteredSkills.length
    }))();
    ErrorBoundary($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="library-container svelte-c8k2rg"><div class="library-header svelte-c8k2rg"><div class="header-top svelte-c8k2rg"><h1 class="svelte-c8k2rg">Skill Library</h1> <div class="stats svelte-c8k2rg"><span class="stat svelte-c8k2rg"><span class="stat-label svelte-c8k2rg">Total:</span> <span class="stat-value svelte-c8k2rg">${escape_html(stats.total)}</span></span> <span class="stat svelte-c8k2rg"><span class="stat-label svelte-c8k2rg">Public:</span> <span class="stat-value public svelte-c8k2rg">${escape_html(stats.public)}</span></span> <span class="stat svelte-c8k2rg"><span class="stat-label svelte-c8k2rg">BDS Only:</span> <span class="stat-value bds svelte-c8k2rg">${escape_html(stats.bdsOnly)}</span></span></div></div> <div class="filters svelte-c8k2rg"><div class="filter-row svelte-c8k2rg"><input type="text"${attr("value", searchQuery)} placeholder="Search skills..." class="search-input svelte-c8k2rg"/> `);
        $$renderer3.select(
          { value: selectedSection, class: "filter-select" },
          ($$renderer4) => {
            $$renderer4.option({ value: "all" }, ($$renderer5) => {
              $$renderer5.push(`All Sections`);
            });
            $$renderer4.push(`<!--[-->`);
            const each_array = ensure_array_like(sections.slice(1));
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let section = each_array[$$index];
              $$renderer4.option({ value: section }, ($$renderer5) => {
                $$renderer5.push(`${escape_html(section)}`);
              });
            }
            $$renderer4.push(`<!--]-->`);
          },
          "svelte-c8k2rg"
        );
        $$renderer3.push(` `);
        $$renderer3.select(
          { value: selectedCategory, class: "filter-select" },
          ($$renderer4) => {
            $$renderer4.option({ value: "all" }, ($$renderer5) => {
              $$renderer5.push(`All Categories`);
            });
            $$renderer4.push(`<!--[-->`);
            const each_array_1 = ensure_array_like(categories.slice(1));
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let category = each_array_1[$$index_1];
              $$renderer4.option({ value: category }, ($$renderer5) => {
                $$renderer5.push(`${escape_html(category)}`);
              });
            }
            $$renderer4.push(`<!--]-->`);
          },
          "svelte-c8k2rg"
        );
        $$renderer3.push(` `);
        $$renderer3.select(
          { value: selectedAccess, class: "filter-select" },
          ($$renderer4) => {
            $$renderer4.option({ value: "all" }, ($$renderer5) => {
              $$renderer5.push(`All Access`);
            });
            $$renderer4.option({ value: "PUBLIC" }, ($$renderer5) => {
              $$renderer5.push(`Public`);
            });
            $$renderer4.option({ value: "BDS_ONLY" }, ($$renderer5) => {
              $$renderer5.push(`BDS Only`);
            });
          },
          "svelte-c8k2rg"
        );
        $$renderer3.push(` <button class="btn-clear svelte-c8k2rg">Clear Filters</button></div> <div class="controls-row svelte-c8k2rg"><div class="sort-controls svelte-c8k2rg"><label for="sort-select" class="svelte-c8k2rg">Sort by:</label> `);
        $$renderer3.select(
          { id: "sort-select", value: sortBy, class: "sort-select" },
          ($$renderer4) => {
            $$renderer4.option({ value: "name" }, ($$renderer5) => {
              $$renderer5.push(`Name`);
            });
            $$renderer4.option({ value: "section" }, ($$renderer5) => {
              $$renderer5.push(`Section`);
            });
            $$renderer4.option({ value: "category" }, ($$renderer5) => {
              $$renderer5.push(`Category`);
            });
          },
          "svelte-c8k2rg"
        );
        $$renderer3.push(`</div> <div class="view-controls svelte-c8k2rg"><button${attr_class("btn-view svelte-c8k2rg", void 0, { "active": viewMode === "grid" })}>Grid</button> <button${attr_class("btn-view svelte-c8k2rg", void 0, { "active": viewMode === "list" })}>List</button></div> <div class="result-count svelte-c8k2rg">${escape_html(stats.filtered)} skill${escape_html(stats.filtered !== 1 ? "s" : "")}</div></div></div></div> <div class="library-content svelte-c8k2rg">`);
        {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="loading-state svelte-c8k2rg"><div class="spinner svelte-c8k2rg"></div> <p>Loading skills...</p></div>`);
        }
        $$renderer3.push(`<!--]--></div></div>`);
      },
      $$slots: { default: true }
    });
  });
}
export {
  _page as default
};
