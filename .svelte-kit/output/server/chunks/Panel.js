import { m as sanitize_slots, f as fallback, b as attr_class, l as clsx, g as slot, c as escape_html, d as bind_props } from "./vendor.js";
/* empty css                                    */
function Panel($$renderer, $$props) {
  const $$slots = sanitize_slots($$props);
  $$renderer.component(($$renderer2) => {
    let panelClasses;
    let title = fallback($$props["title"], "");
    let subtitle = fallback($$props["subtitle"], "");
    let variant = fallback($$props["variant"], "default");
    let padding = fallback($$props["padding"], "md");
    let headerDivider = fallback($$props["headerDivider"], true);
    let footerDivider = fallback($$props["footerDivider"], true);
    panelClasses = ["panel", `panel-${variant}`, `panel-padding-${padding}`].filter(Boolean).join(" ");
    $$renderer2.push(`<div${attr_class(clsx(panelClasses), "svelte-hxsa5u")}>`);
    if ($$slots.header || title) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr_class("panel-header svelte-hxsa5u", void 0, { "with-divider": headerDivider })}>`);
      if ($$slots.header) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "header", {});
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (title) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="panel-header-content svelte-hxsa5u"><h3 class="panel-title svelte-hxsa5u">${escape_html(title)}</h3> `);
          if (subtitle) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<p class="panel-subtitle svelte-hxsa5u">${escape_html(subtitle)}</p>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div> `);
          if ($$slots.actions) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="panel-actions svelte-hxsa5u"><!--[-->`);
            slot($$renderer2, $$props, "actions", {});
            $$renderer2.push(`<!--]--></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="panel-body svelte-hxsa5u"><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></div> `);
    if ($$slots.footer) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr_class("panel-footer svelte-hxsa5u", void 0, { "with-divider": footerDivider })}><!--[-->`);
      slot($$renderer2, $$props, "footer", {});
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, {
      title,
      subtitle,
      variant,
      padding,
      headerDivider,
      footerDivider
    });
  });
}
export {
  Panel as P
};
