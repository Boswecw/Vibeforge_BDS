import { E as ErrorBoundary } from "../../../chunks/ErrorBoundary.js";
import { P as Panel } from "../../../chunks/Panel.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    ErrorBoundary($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="coordinator-page svelte-qayffx"><header class="page-header svelte-qayffx"><h1 class="svelte-qayffx">Coordinator Agent</h1> <p class="text-muted svelte-qayffx">Orchestrate multi-agent workflows</p></header> `);
        Panel($$renderer3, {
          title: "Welcome",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="empty-state svelte-qayffx"><h2 class="svelte-qayffx">Create a Workflow</h2> <p>Design and execute multi-agent coordination workflows.</p></div>`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
      },
      $$slots: { default: true }
    });
  });
}
export {
  _page as default
};
