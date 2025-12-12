import { f as fallback, b as attr_class, c as escape_html, l as clsx, g as slot, d as bind_props } from "./vendor.js";
/* empty css                                    */
function Alert($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let defaultIcon, displayIcon, classes;
    let variant = fallback($$props["variant"], "info");
    let title = fallback($$props["title"], "");
    let dismissible = fallback($$props["dismissible"], false);
    let icon = fallback($$props["icon"], "");
    defaultIcon = { info: "ℹ️", success: "✅", warning: "⚠️", error: "❌" }[variant];
    displayIcon = icon || defaultIcon;
    classes = ["alert", `alert-${variant}`].filter(Boolean).join(" ");
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr_class(clsx(classes), "svelte-1frq9vu")} role="alert"><div class="alert-icon svelte-1frq9vu">${escape_html(displayIcon)}</div> <div class="alert-content svelte-1frq9vu">`);
      if (title) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="alert-title svelte-1frq9vu">${escape_html(title)}</div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="alert-message svelte-1frq9vu"><!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]--></div></div> `);
      if (dismissible) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button class="alert-dismiss svelte-1frq9vu" aria-label="Dismiss alert">✕</button>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { variant, title, dismissible, icon });
  });
}
export {
  Alert as A
};
