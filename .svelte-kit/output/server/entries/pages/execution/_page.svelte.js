import { E as ErrorBoundary } from "../../../chunks/ErrorBoundary.js";
import { P as Panel } from "../../../chunks/Panel.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    ErrorBoundary($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="execution-page svelte-2mqxtd"><header class="page-header svelte-2mqxtd"><h1 class="svelte-2mqxtd">Execution Agent</h1> <p class="text-muted svelte-2mqxtd">Execute code generation and implementation tasks</p></header> <div class="content-grid svelte-2mqxtd"><div class="left-column">`);
        Panel($$renderer3, {
          title: "Execution Request",
          children: ($$renderer4) => {
            $$renderer4.push(`<p>Load from Planning Panel or create new execution request</p>`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div> <div class="right-column">`);
        {
          $$renderer3.push("<!--[!-->");
          Panel($$renderer3, {
            title: "Welcome",
            children: ($$renderer4) => {
              $$renderer4.push(`<div class="empty-state svelte-2mqxtd"><h2 class="svelte-2mqxtd">Start an Execution Session</h2> <p>Load a plan from the Planning Agent to begin execution.</p></div>`);
            },
            $$slots: { default: true }
          });
        }
        $$renderer3.push(`<!--]--></div></div></div>`);
      },
      $$slots: { default: true }
    });
  });
}
export {
  _page as default
};
