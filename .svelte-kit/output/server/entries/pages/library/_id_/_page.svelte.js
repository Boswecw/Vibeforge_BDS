import { _ as store_get, a0 as unsubscribe_stores } from "../../../../chunks/index2.js";
import { p as page } from "../../../../chunks/stores.js";
import "@tauri-apps/api/core";
import { E as ErrorBoundary } from "../../../../chunks/ErrorDisplay.svelte_svelte_type_style_lang.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$page", page).params.id;
    ErrorBoundary($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="skill-detail-container svelte-112kdh0">`);
        {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="loading-state svelte-112kdh0"><div class="spinner svelte-112kdh0"></div> <p class="svelte-112kdh0">Loading skill...</p></div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      },
      $$slots: { default: true }
    });
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
