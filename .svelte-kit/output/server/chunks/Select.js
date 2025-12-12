import { a1 as fallback, _ as attr_class, Z as attr, $ as escape_html, Y as ensure_array_like, a2 as bind_props } from "./index2.js";
/* empty css                                    */
function Select($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let selectClasses;
    let value = fallback($$props["value"], "");
    let options = fallback($$props["options"], () => [], true);
    let placeholder = fallback($$props["placeholder"], "Select an option...");
    let label = fallback($$props["label"], "");
    let helperText = fallback($$props["helperText"], "");
    let error = fallback($$props["error"], "");
    let disabled = fallback($$props["disabled"], false);
    let required = fallback($$props["required"], false);
    let fullWidth = fallback($$props["fullWidth"], false);
    let name = fallback($$props["name"], "");
    let id = fallback($$props["id"], () => name || `select-${Math.random().toString(36).substr(2, 9)}`, true);
    let focused = false;
    selectClasses = [
      "select",
      error && "select-error",
      disabled && "select-disabled",
      fullWidth && "select-full-width"
    ].filter(Boolean).join(" ");
    $$renderer2.push(`<div${attr_class("select-wrapper svelte-t5ihcw", void 0, { "full-width": fullWidth })}>`);
    if (label) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<label${attr("for", id)} class="select-label svelte-t5ihcw">${escape_html(label)} `);
      if (required) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="required-indicator svelte-t5ihcw">*</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></label>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div${attr_class("select-container svelte-t5ihcw", void 0, { "focused": focused, "has-error": !!error })}>`);
    $$renderer2.select(
      { id, name, disabled, required, value, class: selectClasses },
      ($$renderer3) => {
        if (placeholder) {
          $$renderer3.push("<!--[-->");
          $$renderer3.option(
            { value: "", disabled: true, selected: !value, class: "" },
            ($$renderer4) => {
              $$renderer4.push(`${escape_html(placeholder)}`);
            },
            "svelte-t5ihcw"
          );
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--><!--[-->`);
        const each_array = ensure_array_like(options);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let option = each_array[$$index];
          $$renderer3.option(
            { value: option.value, disabled: option.disabled, class: "" },
            ($$renderer4) => {
              $$renderer4.push(`${escape_html(option.label)}`);
            },
            "svelte-t5ihcw"
          );
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-t5ihcw"
    );
    $$renderer2.push(` <span class="select-arrow svelte-t5ihcw">▼</span></div> `);
    if (helperText && !error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="helper-text svelte-t5ihcw">${escape_html(helperText)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="error-text svelte-t5ihcw">${escape_html(error)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, {
      value,
      options,
      placeholder,
      label,
      helperText,
      error,
      disabled,
      required,
      fullWidth,
      name,
      id
    });
  });
}
export {
  Select as S
};
