import { U as ensure_array_like, V as attr_class, W as attr, X as store_get, Y as slot, Z as unsubscribe_stores } from "../../chunks/index2.js";
import { p as page } from "../../chunks/stores.js";
import { e as escape_html } from "../../chunks/escaping.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const links = [
      { href: "/planning", label: "Planning" },
      { href: "/workbench", label: "Workbench" },
      { href: "/coordinator", label: "Coordinator" },
      { href: "/admin/agents", label: "Admin" }
    ];
    $$renderer2.push(`<div class="min-h-screen bg-slate-950 text-white"><header class="border-b border-slate-800 bg-slate-900/70"><div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between"><div class="text-lg font-semibold">VibeForge_BDS</div> <nav class="flex items-center gap-3 text-sm"><!--[-->`);
    const each_array = ensure_array_like(links);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let link = each_array[$$index];
      $$renderer2.push(`<a${attr_class(`px-3 py-2 rounded ${store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith(link.href) ? "bg-amber-500 text-black font-semibold" : "text-slate-200 hover:text-white hover:bg-slate-800"}`)}${attr("href", link.href)}>${escape_html(link.label)}</a>`);
    }
    $$renderer2.push(`<!--]--></nav></div></header> <main class="max-w-6xl mx-auto px-4 py-6"><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></main></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
