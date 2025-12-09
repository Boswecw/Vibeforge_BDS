import { Z as attr } from "../../../chunks/index2.js";
import "@tauri-apps/api/core";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { E as ErrorBoundary } from "../../../chunks/ErrorDisplay.svelte_svelte_type_style_lang.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let apiBaseUrl = "http://localhost:3000";
    let apiTimeout = 3e4;
    ErrorBoundary($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="settings-container svelte-1i19ct2"><div class="settings-header svelte-1i19ct2"><h1 class="svelte-1i19ct2">Settings</h1> <p class="settings-subtitle svelte-1i19ct2">Configure your VibeForge_BDS application</p></div> <section class="settings-section svelte-1i19ct2"><h2 class="svelte-1i19ct2">API Configuration</h2> <p class="section-description svelte-1i19ct2">Configure the ForgeAgents API endpoint and connection settings.</p> <div class="form-group svelte-1i19ct2"><label for="api-url" class="svelte-1i19ct2">API Base URL</label> <input id="api-url" type="text"${attr("value", apiBaseUrl)} placeholder="http://localhost:3000" class="input svelte-1i19ct2"/> <span class="field-hint svelte-1i19ct2">The base URL for the ForgeAgents 120-skill API</span></div> <div class="form-group svelte-1i19ct2"><label for="api-timeout" class="svelte-1i19ct2">Request Timeout (ms)</label> <input id="api-timeout" type="number"${attr("value", apiTimeout)} min="5000" max="120000" step="1000" class="input svelte-1i19ct2"/> <span class="field-hint svelte-1i19ct2">Maximum time to wait for API responses (5-120 seconds)</span></div> <div class="button-group svelte-1i19ct2"><button class="btn btn-primary svelte-1i19ct2">Save Settings</button> <button class="btn btn-secondary svelte-1i19ct2">Reset to Defaults</button></div> `);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></section> <section class="settings-section svelte-1i19ct2"><h2 class="svelte-1i19ct2">Authentication</h2> <p class="section-description svelte-1i19ct2">Manage your BDS credentials and session.</p> `);
        {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`<div class="auth-status svelte-1i19ct2"><div class="status-indicator status-disconnected svelte-1i19ct2"><span class="status-dot svelte-1i19ct2"></span> <span>Disconnected</span></div></div> `);
          {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<button class="btn btn-primary svelte-1i19ct2">Login to BDS</button>`);
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></section> <section class="settings-section svelte-1i19ct2"><h2 class="svelte-1i19ct2">About</h2> <p class="section-description svelte-1i19ct2">System information and version details.</p> <div class="info-grid svelte-1i19ct2"><div class="info-item svelte-1i19ct2"><span class="info-label svelte-1i19ct2">Application</span> <span class="info-value svelte-1i19ct2">VibeForge_BDS</span></div> <div class="info-item svelte-1i19ct2"><span class="info-label svelte-1i19ct2">Version</span> <span class="info-value svelte-1i19ct2">v0.1.0</span></div> <div class="info-item svelte-1i19ct2"><span class="info-label svelte-1i19ct2">Contract Version</span> <span class="info-value svelte-1i19ct2">FORGE_GLOBAL_EXECUTION_CONTRACT v1.0</span></div> <div class="info-item svelte-1i19ct2"><span class="info-label svelte-1i19ct2">Access Level</span> <span class="info-value svelte-1i19ct2">BDS Only (Internal)</span></div> <div class="info-item svelte-1i19ct2"><span class="info-label svelte-1i19ct2">Total Skills</span> <span class="info-value svelte-1i19ct2">120 (45 PUBLIC + 75 BDS_ONLY)</span></div> <div class="info-item svelte-1i19ct2"><span class="info-label svelte-1i19ct2">Backend</span> <span class="info-value svelte-1i19ct2">ForgeAgents 120-Skill API</span></div></div></section> <section class="settings-section svelte-1i19ct2"><h2 class="svelte-1i19ct2">System Components</h2> <p class="section-description svelte-1i19ct2">Integrated ForgeAgents infrastructure systems.</p> <ul class="component-list svelte-1i19ct2"><li class="svelte-1i19ct2"><strong class="svelte-1i19ct2">MAPO:</strong> Multi-step orchestration pipeline</li> <li class="svelte-1i19ct2"><strong class="svelte-1i19ct2">NeuroForge:</strong> Model routing and champion selection</li> <li class="svelte-1i19ct2"><strong class="svelte-1i19ct2">DataForge:</strong> Data persistence layer</li> <li class="svelte-1i19ct2"><strong class="svelte-1i19ct2">Token Management:</strong> Auto-refresh with 60s buffer</li> <li class="svelte-1i19ct2"><strong class="svelte-1i19ct2">Storage:</strong> Tauri secure token storage</li></ul></section></div>`);
      },
      $$slots: { default: true }
    });
  });
}
export {
  _page as default
};
