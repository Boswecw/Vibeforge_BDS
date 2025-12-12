import { a1 as fallback, _ as attr_class, Z as attr, $ as escape_html, aa as clsx, a2 as bind_props } from "./index2.js";
/* empty css                                    */
function Input($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let inputClasses;
    let type = fallback($$props["type"], "text");
    let value = fallback($$props["value"], "");
    let placeholder = fallback($$props["placeholder"], "");
    let label = fallback($$props["label"], "");
    let helperText = fallback($$props["helperText"], "");
    let error = fallback($$props["error"], "");
    let disabled = fallback($$props["disabled"], false);
    let required = fallback($$props["required"], false);
    let readonly = fallback($$props["readonly"], false);
    let fullWidth = fallback($$props["fullWidth"], false);
    let name = fallback($$props["name"], "");
    let id = fallback($$props["id"], () => name || `input-${Math.random().toString(36).substr(2, 9)}`, true);
    let min = fallback($$props["min"], void 0);
    let max = fallback($$props["max"], void 0);
    let step = fallback($$props["step"], void 0);
    let focused = false;
    inputClasses = [
      "input",
      error && "input-error",
      disabled && "input-disabled",
      readonly && "input-readonly",
      fullWidth && "input-full-width"
    ].filter(Boolean).join(" ");
    $$renderer2.push(`<div${attr_class("input-wrapper svelte-8ff5h4", void 0, { "full-width": fullWidth })}>`);
    if (label) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<label${attr("for", id)} class="input-label svelte-8ff5h4">${escape_html(label)} `);
      if (required) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="required-indicator svelte-8ff5h4">*</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></label>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div${attr_class("input-container svelte-8ff5h4", void 0, { "focused": focused, "has-error": !!error })}><input${attr("id", id)}${attr("type", type)}${attr("name", name)}${attr("placeholder", placeholder)}${attr("disabled", disabled, true)}${attr("required", required, true)}${attr("readonly", readonly, true)}${attr("min", type === "number" ? min : void 0)}${attr("max", type === "number" ? max : void 0)}${attr("step", type === "number" ? step : void 0)}${attr("value", value)}${attr_class(clsx(inputClasses), "svelte-8ff5h4")}/></div> `);
    if (helperText && !error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="helper-text svelte-8ff5h4">${escape_html(helperText)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="error-text svelte-8ff5h4">${escape_html(error)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, {
      type,
      value,
      placeholder,
      label,
      helperText,
      error,
      disabled,
      required,
      readonly,
      fullWidth,
      name,
      id,
      min,
      max,
      step
    });
  });
}
export {
  Input as I
};
