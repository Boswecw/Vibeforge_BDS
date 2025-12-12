import { E as ErrorBoundary } from "../../../chunks/ErrorBoundary.js";
import { P as Panel } from "../../../chunks/Panel.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    ErrorBoundary($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="evaluator-page svelte-1q9gdpq"><header class="page-header svelte-1q9gdpq"><h1 class="svelte-1q9gdpq">Evaluator Agent</h1> <p class="text-muted svelte-1q9gdpq">Assess quality and SAS compliance</p></header> `);
        Panel($$renderer3, {
          title: "Welcome",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="empty-state svelte-1q9gdpq"><h2 class="svelte-1q9gdpq">Start an Evaluation Session</h2> <p>Load execution results to begin quality assessment.</p></div>`);
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
