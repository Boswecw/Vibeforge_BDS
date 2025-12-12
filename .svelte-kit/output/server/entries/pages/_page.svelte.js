import { c as escape_html } from "../../chunks/vendor.js";
import "../../chunks/UpdateBanner.svelte_svelte_type_style_lang.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import { B as Button } from "../../chunks/Button.js";
/* empty css                                               */
import { P as Panel } from "../../chunks/Panel.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="dashboard-container svelte-1uha8ag"><div class="hero-section svelte-1uha8ag"><div class="hero-icon svelte-1uha8ag">⚒️</div> <h1 class="hero-title svelte-1uha8ag"><span class="text-gradient-brass">VibeForge</span> BDS</h1> <p class="hero-subtitle svelte-1uha8ag">Internal Agent-Powered Development Workbench</p> <p class="hero-description svelte-1uha8ag">Access to 120 AI-powered skills across ForgeAgents infrastructure</p></div> <div class="stats-grid svelte-1uha8ag">`);
    Panel($$renderer2, {
      variant: "elevated",
      padding: "lg",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="stat-card svelte-1uha8ag"><div class="stat-icon svelte-1uha8ag">📚</div> <div class="stat-content svelte-1uha8ag"><div class="stat-value svelte-1uha8ag">${escape_html("...")}</div> <div class="stat-label svelte-1uha8ag">Skills Available</div></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Panel($$renderer2, {
      variant: "elevated",
      padding: "lg",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="stat-card svelte-1uha8ag"><div class="stat-icon svelte-1uha8ag">${escape_html("⚠️")}</div> <div class="stat-content svelte-1uha8ag"><div class="stat-value svelte-1uha8ag">${escape_html("Disconnected")}</div> <div class="stat-label svelte-1uha8ag">Status</div></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Panel($$renderer2, {
      variant: "elevated",
      padding: "lg",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="stat-card svelte-1uha8ag"><div class="stat-icon svelte-1uha8ag">🔒</div> <div class="stat-content svelte-1uha8ag"><div class="stat-value svelte-1uha8ag">BDS Only</div> <div class="stat-label svelte-1uha8ag">Access Level</div></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> <section class="features-section svelte-1uha8ag"><h2 class="section-title svelte-1uha8ag">Quick Links</h2> <div class="features-grid svelte-1uha8ag">`);
    Panel($$renderer2, {
      variant: "bordered",
      padding: "lg",
      children: ($$renderer3) => {
        $$renderer3.push(`<a href="/library" class="feature-card svelte-1uha8ag"><div class="feature-icon svelte-1uha8ag">📚</div> <h3 class="feature-title svelte-1uha8ag">Skills Library</h3> <p class="feature-description svelte-1uha8ag">Browse and invoke all 120 AI skills</p> <div class="feature-action svelte-1uha8ag">`);
        Button($$renderer3, {
          variant: "outline",
          size: "sm",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->View Library →`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></a>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Panel($$renderer2, {
      variant: "bordered",
      padding: "lg",
      children: ($$renderer3) => {
        $$renderer3.push(`<a href="/history" class="feature-card svelte-1uha8ag"><div class="feature-icon svelte-1uha8ag">📊</div> <h3 class="feature-title svelte-1uha8ag">History</h3> <p class="feature-description svelte-1uha8ag">View execution logs and session history</p> <div class="feature-action svelte-1uha8ag">`);
        Button($$renderer3, {
          variant: "outline",
          size: "sm",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->View History →`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></a>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Panel($$renderer2, {
      variant: "bordered",
      padding: "lg",
      children: ($$renderer3) => {
        $$renderer3.push(`<a href="/settings" class="feature-card svelte-1uha8ag"><div class="feature-icon svelte-1uha8ag">⚙️</div> <h3 class="feature-title svelte-1uha8ag">Settings</h3> <p class="feature-description svelte-1uha8ag">Configure API keys and preferences</p> <div class="feature-action svelte-1uha8ag">`);
        Button($$renderer3, {
          variant: "outline",
          size: "sm",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Configure →`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></a>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></section> <section class="info-section svelte-1uha8ag">`);
    Panel($$renderer2, {
      title: "System Information",
      variant: "bordered",
      padding: "lg",
      children: ($$renderer3) => {
        $$renderer3.push(`<ul class="info-list svelte-1uha8ag"><li class="svelte-1uha8ag"><strong class="svelte-1uha8ag">Backend:</strong> ForgeAgents 120-Skill API</li> <li class="svelte-1uha8ag"><strong class="svelte-1uha8ag">Orchestration:</strong> MAPO Multi-step Pipeline</li> <li class="svelte-1uha8ag"><strong class="svelte-1uha8ag">Model Routing:</strong> NeuroForge Champion Selection</li> <li class="svelte-1uha8ag"><strong class="svelte-1uha8ag">Data Storage:</strong> DataForge Persistence Layer</li> <li class="svelte-1uha8ag"><strong class="svelte-1uha8ag">Compliance:</strong> FORGE_GLOBAL_EXECUTION_CONTRACT v1.0</li></ul>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></section> <div class="version-info svelte-1uha8ag"><p class="svelte-1uha8ag">VibeForge BDS v0.1.0 | Internal Use Only</p> <p class="copyright svelte-1uha8ag">© 2025 Boswell Digital Solutions LLC</p></div></div>`);
  });
}
export {
  _page as default
};
