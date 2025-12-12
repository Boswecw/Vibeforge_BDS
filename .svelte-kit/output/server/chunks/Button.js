import { a1 as fallback, Z as attr, _ as attr_class, aa as clsx, a3 as slot, a2 as bind_props } from "./index2.js";
/* empty css                                    */
function Button($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let classes, isLink;
    let variant = fallback($$props["variant"], "primary");
    let size = fallback($$props["size"], "md");
    let disabled = fallback($$props["disabled"], false);
    let loading = fallback($$props["loading"], false);
    let fullWidth = fallback($$props["fullWidth"], false);
    let type = fallback($$props["type"], "button");
    let href = fallback($$props["href"], void 0);
    let onclick = fallback($$props["onclick"], void 0);
    classes = [
      "btn",
      `btn-${variant}`,
      `btn-${size}`,
      fullWidth && "btn-full-width",
      loading && "btn-loading",
      disabled && "btn-disabled"
    ].filter(Boolean).join(" ");
    isLink = !!href;
    if (isLink) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a${attr("href", href)}${attr_class(clsx(classes), "svelte-18sv61c")}${attr("aria-disabled", disabled)} role="button">`);
      if (loading) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="spinner svelte-18sv61c" aria-hidden="true"></span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]--></a>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button${attr("type", type)}${attr_class(clsx(classes), "svelte-18sv61c")}${attr("disabled", disabled, true)}>`);
      if (loading) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="spinner svelte-18sv61c" aria-hidden="true"></span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]--></button>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, {
      variant,
      size,
      disabled,
      loading,
      fullWidth,
      type,
      href,
      onclick
    });
  });
}
export {
  Button as B
};
