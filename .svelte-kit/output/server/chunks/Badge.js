import { f as fallback, b as attr_class, l as clsx, g as slot, d as bind_props } from "./vendor.js";
/* empty css                                    */
function Badge($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let classes;
    let variant = fallback($$props["variant"], "default");
    let size = fallback($$props["size"], "md");
    let dot = fallback($$props["dot"], false);
    let outline = fallback($$props["outline"], false);
    classes = [
      "badge",
      `badge-${variant}`,
      `badge-${size}`,
      dot && "badge-dot",
      outline && "badge-outline"
    ].filter(Boolean).join(" ");
    $$renderer2.push(`<span${attr_class(clsx(classes), "svelte-dtbgkf")}>`);
    if (dot) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="badge-dot-indicator svelte-dtbgkf"></span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></span>`);
    bind_props($$props, { variant, size, dot, outline });
  });
}
export {
  Badge as B
};
