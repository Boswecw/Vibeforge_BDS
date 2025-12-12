import { Y as ensure_array_like, a7 as attr_style, $ as escape_html, a4 as stringify, _ as attr_class, a2 as bind_props, a8 as head } from "../../../chunks/index2.js";
const tiers = [
  {
    id: "consumer",
    name: "Consumer Tier",
    subtitle: "Top Layer — User-Facing Applications",
    description: "User-facing applications built on the ecosystem",
    categories: [
      {
        id: "workbench",
        name: "Workbench Applications",
        products: [
          { name: "VibeForge", version: "v5.6" },
          { name: "AuthorForge", version: "v0.1-alpha" }
        ],
        traits: ["Multi-panel UI", "Plugin systems", "M.A.P.O. required"]
      },
      {
        id: "domain",
        name: "Domain Applications",
        products: [
          { name: "TradeForge", version: "Planned" },
          { name: "Leopold", version: "Planned" },
          { name: "Livy", version: "Planned" }
        ],
        traits: ["Simplified UX", "Mobile-friendly"]
      }
    ]
  },
  {
    id: "intelligence",
    name: "Intelligence Tier",
    subtitle: "Middle Layer — Reusable AI Reasoning",
    description: "Domain-specific reasoning modules",
    categories: [
      {
        id: "modules",
        name: "Intelligence Modules",
        products: [
          { name: "Arc Trajectory Engine", version: "v1.0 Module" },
          { name: "MoneyAI Forecast Engine", version: "v1.0 Module" },
          { name: "TradeForge Market Engine", version: "v1.0 Module" }
        ],
        traits: ["Route through M.A.P.O.", "Semantic versioning"]
      }
    ]
  },
  {
    id: "provider",
    name: "Provider Tier",
    subtitle: "Bottom of Stack — Core Backend Services",
    description: "Core backend systems powering everything",
    categories: [
      {
        id: "ai-engines",
        name: "AI Engine Services",
        products: [
          { name: "NeuroForge", port: "8000", version: "v1.0 API", hasContract: true },
          { name: "M.A.P.O.", port: "8003", version: "v1.0 Pipeline", hasContract: true },
          { name: "ForgeAgents", port: "8004", version: "v0.9 Preview" }
        ],
        traits: ["Brain Stem / Cortex / Muscle", "SSE streaming", "Worker pools"]
      },
      {
        id: "knowledge",
        name: "Knowledge & Ingestion",
        products: [
          { name: "DataForge", port: "8001", version: "v5.2 API", hasContract: true },
          { name: "Rake", port: "8002", version: "v1.0" }
        ],
        traits: ["Vector storage", "5-stage pipeline", "Schema versioning"]
      }
    ]
  }
];
function TierDiagram($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { tiers: tiers2 } = $$props;
    const tierColors = {
      consumer: { bg: "#1e3a8a", border: "#3b82f6", accent: "#60a5fa" },
      intelligence: { bg: "#581c87", border: "#a855f7", accent: "#c084fc" },
      provider: {
        bg: "var(--color-graphite)",
        border: "var(--color-brass)",
        accent: "var(--color-gold)"
      }
    };
    $$renderer2.push(`<div class="tier-diagram svelte-11j0p3s"><!--[-->`);
    const each_array = ensure_array_like(tiers2);
    for (let $$index_3 = 0, $$length = each_array.length; $$index_3 < $$length; $$index_3++) {
      let tier = each_array[$$index_3];
      $$renderer2.push(`<div class="tier-container svelte-11j0p3s"${attr_style(`border-color: ${stringify(tierColors[tier.id]?.border || tierColors.provider.border)};`)}><div class="tier-header svelte-11j0p3s"${attr_style(`background: linear-gradient(135deg, ${stringify(tierColors[tier.id]?.bg || tierColors.provider.bg)} 0%, ${stringify(tierColors[tier.id]?.accent || tierColors.provider.accent)}22 100%);`)}><div><h3 class="tier-name svelte-11j0p3s">${escape_html(tier.name)}</h3> <p class="tier-subtitle svelte-11j0p3s">${escape_html(tier.subtitle)}</p></div> <p class="tier-description svelte-11j0p3s">${escape_html(tier.description)}</p></div> <div class="categories-grid svelte-11j0p3s"><!--[-->`);
      const each_array_1 = ensure_array_like(tier.categories);
      for (let $$index_2 = 0, $$length2 = each_array_1.length; $$index_2 < $$length2; $$index_2++) {
        let category = each_array_1[$$index_2];
        $$renderer2.push(`<div class="category-card svelte-11j0p3s"><h4 class="category-name svelte-11j0p3s">${escape_html(category.name)}</h4> <div class="products-list svelte-11j0p3s"><!--[-->`);
        const each_array_2 = ensure_array_like(category.products);
        for (let $$index = 0, $$length3 = each_array_2.length; $$index < $$length3; $$index++) {
          let product = each_array_2[$$index];
          $$renderer2.push(`<button${attr_class("product-card svelte-11j0p3s", void 0, { "has-contract": product.hasContract })}${attr_style(`border-left-color: ${stringify(tierColors[tier.id]?.accent || tierColors.provider.accent)};`)}><div class="product-header svelte-11j0p3s"><span class="product-name svelte-11j0p3s">${escape_html(product.name)}</span> `);
          if (product.hasContract) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<span class="contract-badge svelte-11j0p3s">Contract</span>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div> <div class="product-details svelte-11j0p3s"><span class="product-version svelte-11j0p3s">${escape_html(product.version)}</span> `);
          if (product.port) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<span class="product-port svelte-11j0p3s">Port ${escape_html(product.port)}</span>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div></button>`);
        }
        $$renderer2.push(`<!--]--></div> `);
        if (category.traits.length > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="traits-list svelte-11j0p3s"><!--[-->`);
          const each_array_3 = ensure_array_like(category.traits);
          for (let $$index_1 = 0, $$length3 = each_array_3.length; $$index_1 < $$length3; $$index_1++) {
            let trait = each_array_3[$$index_1];
            $$renderer2.push(`<span class="trait-badge svelte-11j0p3s">${escape_html(trait)}</span>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function ContractModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { isOpen = void 0, contract, onClose } = $$props;
    function formatJSON(obj) {
      return JSON.stringify(obj, null, 2);
    }
    if (isOpen && contract) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="modal-backdrop svelte-4no7oy" role="presentation"><div class="modal-container svelte-4no7oy" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-header svelte-4no7oy"><div><h2 id="modal-title" class="modal-title svelte-4no7oy">${escape_html(contract.name)}</h2> <div class="modal-subtitle svelte-4no7oy"><span class="version-badge svelte-4no7oy">${escape_html(contract.version)}</span> `);
      if (contract.port) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="port-badge svelte-4no7oy">Port ${escape_html(contract.port)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div> <button class="close-button svelte-4no7oy" aria-label="Close modal"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div> <div class="modal-content svelte-4no7oy">`);
      if (contract.contract) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="contract-section svelte-4no7oy"><h3 class="section-title svelte-4no7oy"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-4no7oy"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> Request Schema</h3> <pre class="json-display svelte-4no7oy"><code class="svelte-4no7oy">${escape_html(formatJSON(contract.contract.request))}</code></pre></div> <div class="contract-section svelte-4no7oy"><h3 class="section-title svelte-4no7oy"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-4no7oy"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> Response Schema</h3> <pre class="json-display svelte-4no7oy"><code class="svelte-4no7oy">${escape_html(formatJSON(contract.contract.response))}</code></pre></div> <div class="contract-section svelte-4no7oy"><h3 class="section-title svelte-4no7oy"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-4no7oy"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> Error Codes</h3> <ul class="error-list svelte-4no7oy"><!--[-->`);
        const each_array = ensure_array_like(contract.contract.errors);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let error = each_array[$$index];
          $$renderer2.push(`<li class="error-item svelte-4no7oy"><code class="error-code svelte-4no7oy">${escape_html(error)}</code></li>`);
        }
        $$renderer2.push(`<!--]--></ul></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="no-contract svelte-4no7oy"><p>No contract available for this service.</p></div>`);
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { isOpen });
  });
}
function ArchitectureStudio($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeTab = "tiers";
    let isModalOpen = false;
    let selectedContract = null;
    const tabs = [
      { id: "tiers", label: "Architecture Tiers", icon: "layers" },
      {
        id: "pipelines",
        label: "Pipeline Contracts",
        icon: "git-branch"
      },
      { id: "deps", label: "Dependency Rules", icon: "shield" }
    ];
    function closeModal() {
      isModalOpen = false;
      selectedContract = null;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="architecture-studio svelte-dft2x7"><header class="studio-header svelte-dft2x7"><div class="header-content svelte-dft2x7"><div class="header-left svelte-dft2x7"><h1 class="studio-title svelte-dft2x7">Forge Architecture Studio</h1> <p class="studio-subtitle svelte-dft2x7">BDS-SAS Three-Tier System Design</p></div> <div class="header-actions svelte-dft2x7"><button class="export-btn svelte-dft2x7" title="Export as JSON"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-dft2x7"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> JSON</button> <button class="export-btn svelte-dft2x7" title="Export as SVG"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-dft2x7"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> SVG</button> <button class="export-btn svelte-dft2x7" title="Export as Mermaid"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-dft2x7"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> Mermaid</button></div></div></header> <nav class="tab-nav svelte-dft2x7"><!--[-->`);
      const each_array = ensure_array_like(tabs);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tab = each_array[$$index];
        $$renderer3.push(`<button${attr_class("tab-button svelte-dft2x7", void 0, { "active": activeTab === tab.id })}><span class="tab-label svelte-dft2x7">${escape_html(tab.label)}</span></button>`);
      }
      $$renderer3.push(`<!--]--></nav> <main class="tab-content svelte-dft2x7">`);
      {
        $$renderer3.push("<!--[-->");
        TierDiagram($$renderer3, { tiers });
      }
      $$renderer3.push(`<!--]--></main> `);
      ContractModal($$renderer3, {
        contract: selectedContract,
        onClose: closeModal,
        get isOpen() {
          return isModalOpen;
        },
        set isOpen($$value) {
          isModalOpen = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function _page($$renderer) {
  head("l0lkr4", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Architecture Studio - VibeForge BDS</title>`);
    });
  });
  ArchitectureStudio($$renderer);
}
export {
  _page as default
};
