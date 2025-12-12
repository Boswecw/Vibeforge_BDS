import "../../../chunks/Pagination.svelte_svelte_type_style_lang.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
import { S as Select } from "../../../chunks/Select.js";
import { P as Panel } from "../../../chunks/Panel.js";
import { B as Badge } from "../../../chunks/Badge.js";
/* empty css                                                  */
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let apiBaseUrl = "http://localhost:3000";
    let apiTimeout = 3e4;
    const timeoutOptions = [
      { value: 5e3, label: "5 seconds" },
      { value: 1e4, label: "10 seconds" },
      { value: 15e3, label: "15 seconds" },
      { value: 3e4, label: "30 seconds" },
      { value: 6e4, label: "60 seconds" },
      { value: 12e4, label: "120 seconds" }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="settings-container svelte-1i19ct2"><div class="page-header svelte-1i19ct2"><h1 class="page-title svelte-1i19ct2">Settings</h1> <p class="page-description svelte-1i19ct2">Configure your VibeForge_BDS application</p></div> `);
      Panel($$renderer3, {
        title: "API Configuration",
        subtitle: "Configure the ForgeAgents API endpoint and connection settings",
        variant: "bordered",
        padding: "lg",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="form-section svelte-1i19ct2">`);
          Input($$renderer4, {
            label: "API Base URL",
            placeholder: "http://localhost:3000",
            helperText: "The base URL for the ForgeAgents 120-skill API",
            fullWidth: true,
            get value() {
              return apiBaseUrl;
            },
            set value($$value) {
              apiBaseUrl = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Select($$renderer4, {
            label: "Request Timeout",
            options: timeoutOptions,
            helperText: "Maximum time to wait for API responses",
            fullWidth: true,
            get value() {
              return apiTimeout;
            },
            set value($$value) {
              apiTimeout = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> <div class="button-group svelte-1i19ct2">`);
          Button($$renderer4, {
            variant: "primary",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Save Settings`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----> `);
          Button($$renderer4, {
            variant: "secondary",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Reset to Defaults`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div> `);
          {
            $$renderer4.push("<!--[!-->");
          }
          $$renderer4.push(`<!--]--> `);
          {
            $$renderer4.push("<!--[!-->");
          }
          $$renderer4.push(`<!--]--></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Panel($$renderer3, {
        title: "Authentication",
        subtitle: "Manage your BDS credentials and session",
        variant: "bordered",
        padding: "lg",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="auth-section svelte-1i19ct2">`);
          {
            $$renderer4.push("<!--[!-->");
            $$renderer4.push(`<div class="status-row svelte-1i19ct2">`);
            Badge($$renderer4, {
              variant: "error",
              dot: true,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Disconnected`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div> `);
            {
              $$renderer4.push("<!--[-->");
              Button($$renderer4, {
                variant: "primary",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Login to BDS`);
                },
                $$slots: { default: true }
              });
            }
            $$renderer4.push(`<!--]-->`);
          }
          $$renderer4.push(`<!--]--></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Panel($$renderer3, {
        title: "About",
        subtitle: "System information and version details",
        variant: "bordered",
        padding: "lg",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="info-grid svelte-1i19ct2"><div class="info-card svelte-1i19ct2"><div class="info-label svelte-1i19ct2">Application</div> <div class="info-value svelte-1i19ct2">VibeForge_BDS</div></div> <div class="info-card svelte-1i19ct2"><div class="info-label svelte-1i19ct2">Version</div> <div class="info-value svelte-1i19ct2">`);
          Badge($$renderer4, {
            variant: "accent",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->v0.1.0`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div></div> <div class="info-card svelte-1i19ct2"><div class="info-label svelte-1i19ct2">Contract Version</div> <div class="info-value svelte-1i19ct2">FORGE_GLOBAL_EXECUTION_CONTRACT v1.0</div></div> <div class="info-card svelte-1i19ct2"><div class="info-label svelte-1i19ct2">Access Level</div> <div class="info-value svelte-1i19ct2">`);
          Badge($$renderer4, {
            variant: "warning",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->BDS Only (Internal)`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div></div> <div class="info-card svelte-1i19ct2"><div class="info-label svelte-1i19ct2">Total Skills</div> <div class="info-value svelte-1i19ct2">120 (45 PUBLIC + 75 BDS_ONLY)</div></div> <div class="info-card svelte-1i19ct2"><div class="info-label svelte-1i19ct2">Backend</div> <div class="info-value svelte-1i19ct2">ForgeAgents 120-Skill API</div></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Panel($$renderer3, {
        title: "System Components",
        subtitle: "Integrated ForgeAgents infrastructure systems",
        variant: "bordered",
        padding: "lg",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="component-list svelte-1i19ct2"><div class="component-item svelte-1i19ct2">`);
          Badge($$renderer4, {
            variant: "info",
            size: "sm",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->MAPO`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----> <span class="component-desc svelte-1i19ct2">Multi-step orchestration pipeline</span></div> <div class="component-item svelte-1i19ct2">`);
          Badge($$renderer4, {
            variant: "info",
            size: "sm",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->NeuroForge`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----> <span class="component-desc svelte-1i19ct2">Model routing and champion selection</span></div> <div class="component-item svelte-1i19ct2">`);
          Badge($$renderer4, {
            variant: "info",
            size: "sm",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->DataForge`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----> <span class="component-desc svelte-1i19ct2">Data persistence layer</span></div> <div class="component-item svelte-1i19ct2">`);
          Badge($$renderer4, {
            variant: "success",
            size: "sm",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Token Management`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----> <span class="component-desc svelte-1i19ct2">Auto-refresh with 60s buffer</span></div> <div class="component-item svelte-1i19ct2">`);
          Badge($$renderer4, {
            variant: "success",
            size: "sm",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Storage`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----> <span class="component-desc svelte-1i19ct2">Tauri secure token storage</span></div></div>`);
        },
        $$slots: { default: true }
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
export {
  _page as default
};
