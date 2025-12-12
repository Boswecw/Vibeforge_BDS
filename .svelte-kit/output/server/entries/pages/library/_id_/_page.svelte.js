import { s as store_get, u as unsubscribe_stores, p as page } from "../../../../chunks/vendor.js";
import "../../../../chunks/Pagination.svelte_svelte_type_style_lang.js";
/* empty css                                                     */
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$page", page).params.id;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="skill-detail-container svelte-112kdh0">`);
      {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="loading-state svelte-112kdh0"><div class="spinner svelte-112kdh0"></div> <p>Loading skill...</p></div>`);
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
