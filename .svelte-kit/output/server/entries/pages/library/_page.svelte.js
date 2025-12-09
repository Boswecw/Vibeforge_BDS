import { W as attr, U as ensure_array_like, V as attr_class } from "../../../chunks/index2.js";
import "@tauri-apps/api/core";
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
    $$renderer2.push(`<div class="library-container svelte-c8k2rg"><div class="library-header svelte-c8k2rg"><div class="header-top svelte-c8k2rg"><h1 class="svelte-c8k2rg">Skill Library</h1> <div class="stats svelte-c8k2rg"><span class="stat svelte-c8k2rg"><span class="stat-label svelte-c8k2rg">Total:</span> <span class="stat-value svelte-c8k2rg">${escape_html(stats.total)}</span></span> <span class="stat svelte-c8k2rg"><span class="stat-label svelte-c8k2rg">Public:</span> <span class="stat-value public svelte-c8k2rg">${escape_html(stats.public)}</span></span> <span class="stat svelte-c8k2rg"><span class="stat-label svelte-c8k2rg">BDS Only:</span> <span class="stat-value bds svelte-c8k2rg">${escape_html(stats.bdsOnly)}</span></span></div></div> <div class="filters svelte-c8k2rg"><div class="filter-row svelte-c8k2rg"><input type="text"${attr("value", searchQuery)} placeholder="Search skills..." class="search-input svelte-c8k2rg"/> `);
    $$renderer2.select(
      { value: selectedSection, class: "filter-select" },
      ($$renderer3) => {
        $$renderer3.option({ value: "all" }, ($$renderer4) => {
          $$renderer4.push(`All Sections`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(sections.slice(1));
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let section = each_array[$$index];
          $$renderer3.option({ value: section }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(section)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-c8k2rg"
    );
    $$renderer2.push(` `);
    $$renderer2.select(
      { value: selectedCategory, class: "filter-select" },
      ($$renderer3) => {
        $$renderer3.option({ value: "all" }, ($$renderer4) => {
          $$renderer4.push(`All Categories`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(categories.slice(1));
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let category = each_array_1[$$index_1];
          $$renderer3.option({ value: category }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(category)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-c8k2rg"
    );
    $$renderer2.push(` `);
    $$renderer2.select(
      { value: selectedAccess, class: "filter-select" },
      ($$renderer3) => {
        $$renderer3.option({ value: "all" }, ($$renderer4) => {
          $$renderer4.push(`All Access`);
        });
        $$renderer3.option({ value: "PUBLIC" }, ($$renderer4) => {
          $$renderer4.push(`Public`);
        });
        $$renderer3.option({ value: "BDS_ONLY" }, ($$renderer4) => {
          $$renderer4.push(`BDS Only`);
        });
      },
      "svelte-c8k2rg"
    );
    $$renderer2.push(` <button class="btn-clear svelte-c8k2rg">Clear Filters</button></div> <div class="controls-row svelte-c8k2rg"><div class="sort-controls svelte-c8k2rg"><label for="sort-select" class="svelte-c8k2rg">Sort by:</label> `);
    $$renderer2.select(
      { id: "sort-select", value: sortBy, class: "sort-select" },
      ($$renderer3) => {
        $$renderer3.option({ value: "name" }, ($$renderer4) => {
          $$renderer4.push(`Name`);
        });
        $$renderer3.option({ value: "section" }, ($$renderer4) => {
          $$renderer4.push(`Section`);
        });
        $$renderer3.option({ value: "category" }, ($$renderer4) => {
          $$renderer4.push(`Category`);
        });
      },
      "svelte-c8k2rg"
    );
    $$renderer2.push(`</div> <div class="view-controls svelte-c8k2rg"><button${attr_class("btn-view svelte-c8k2rg", void 0, { "active": viewMode === "grid" })}>Grid</button> <button${attr_class("btn-view svelte-c8k2rg", void 0, { "active": viewMode === "list" })}>List</button></div> <div class="result-count svelte-c8k2rg">${escape_html(stats.filtered)} skill${escape_html(stats.filtered !== 1 ? "s" : "")}</div></div></div></div> <div class="library-content svelte-c8k2rg">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading-state svelte-c8k2rg"><div class="spinner svelte-c8k2rg"></div> <p>Loading skills...</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};
