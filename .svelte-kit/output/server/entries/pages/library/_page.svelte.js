import { c as escape_html } from "../../../chunks/vendor.js";
import "../../../chunks/Pagination.svelte_svelte_type_style_lang.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
import { S as Select } from "../../../chunks/Select.js";
import { P as Panel } from "../../../chunks/Panel.js";
import { B as Badge } from "../../../chunks/Badge.js";
/* empty css                                                  */
import "../../../chunks/VirtualList.svelte_svelte_type_style_lang.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let skills = [];
    let filteredSkills = [];
    let searchQuery = "";
    let selectedSection = "all";
    let selectedCategory = "all";
    let selectedAccess = "all";
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
    let sectionOptions = sections.map((s) => ({ value: s, label: s === "all" ? "All Sections" : s }));
    let categoryOptions = categories.map((c) => ({ value: c, label: c === "all" ? "All Categories" : c }));
    const accessOptions = [
      { value: "all", label: "All Access" },
      { value: "PUBLIC", label: "Public" },
      { value: "BDS_ONLY", label: "BDS Only" }
    ];
    const sortOptions = [
      { value: "name", label: "Name" },
      { value: "section", label: "Section" },
      { value: "category", label: "Category" }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="library-container svelte-c8k2rg"><div class="page-header svelte-c8k2rg"><div class="header-content svelte-c8k2rg"><h1 class="page-title svelte-c8k2rg">Skill Library</h1> <div class="stats-row svelte-c8k2rg"><div class="stat-item svelte-c8k2rg"><span class="stat-value svelte-c8k2rg">${escape_html(stats.total)}</span> <span class="stat-label svelte-c8k2rg">Total</span></div> <div class="stat-item svelte-c8k2rg"><span class="stat-value success svelte-c8k2rg">${escape_html(stats.public)}</span> <span class="stat-label svelte-c8k2rg">Public</span></div> <div class="stat-item svelte-c8k2rg"><span class="stat-value warning svelte-c8k2rg">${escape_html(stats.bdsOnly)}</span> <span class="stat-label svelte-c8k2rg">BDS Only</span></div></div></div></div> `);
      Panel($$renderer3, {
        variant: "bordered",
        padding: "lg",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="filters-section svelte-c8k2rg"><div class="filter-row svelte-c8k2rg">`);
          Input($$renderer4, {
            type: "search",
            placeholder: "Search skills by name, description, or tags...",
            fullWidth: true,
            get value() {
              return searchQuery;
            },
            set value($$value) {
              searchQuery = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="filter-row svelte-c8k2rg">`);
          Select($$renderer4, {
            options: sectionOptions,
            placeholder: "All Sections",
            fullWidth: true,
            get value() {
              return selectedSection;
            },
            set value($$value) {
              selectedSection = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Select($$renderer4, {
            options: categoryOptions,
            placeholder: "All Categories",
            fullWidth: true,
            get value() {
              return selectedCategory;
            },
            set value($$value) {
              selectedCategory = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Select($$renderer4, {
            options: accessOptions,
            placeholder: "All Access",
            fullWidth: true,
            get value() {
              return selectedAccess;
            },
            set value($$value) {
              selectedAccess = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Button($$renderer4, {
            variant: "secondary",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Clear`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div> <div class="controls-row svelte-c8k2rg"><div class="sort-section svelte-c8k2rg">`);
          Select($$renderer4, {
            options: sortOptions,
            get value() {
              return sortBy;
            },
            set value($$value) {
              sortBy = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="view-section svelte-c8k2rg">`);
          Button($$renderer4, {
            variant: "primary",
            size: "sm",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Grid`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----> `);
          Button($$renderer4, {
            variant: "ghost",
            size: "sm",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->List`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div> <div class="result-count svelte-c8k2rg">`);
          Badge($$renderer4, {
            variant: "default",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->${escape_html(stats.filtered)} skills`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> <div class="library-content svelte-c8k2rg">`);
      {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="loading-state svelte-c8k2rg"><div class="spinner svelte-c8k2rg"></div> <p>Loading skills...</p></div>`);
      }
      $$renderer3.push(`<!--]--></div></div>`);
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
