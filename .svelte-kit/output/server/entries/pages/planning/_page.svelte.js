import { E as ErrorBoundary } from "../../../chunks/ErrorBoundary.js";
import { P as Panel } from "../../../chunks/Panel.js";
import { f as fallback, b as attr_class, a as attr, c as escape_html, l as clsx, d as bind_props } from "../../../chunks/vendor.js";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
import "../../../chunks/Pagination.svelte_svelte_type_style_lang.js";
import { A as Alert } from "../../../chunks/Alert.js";
/* empty css                                                  */
function Textarea($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let textareaClasses, charCount, showCharCount;
    let value = fallback($$props["value"], "");
    let placeholder = fallback($$props["placeholder"], "");
    let label = fallback($$props["label"], "");
    let helperText = fallback($$props["helperText"], "");
    let error = fallback($$props["error"], "");
    let disabled = fallback($$props["disabled"], false);
    let required = fallback($$props["required"], false);
    let readonly = fallback($$props["readonly"], false);
    let fullWidth = fallback($$props["fullWidth"], false);
    let rows = fallback($$props["rows"], 4);
    let maxLength = fallback($$props["maxLength"], void 0);
    let resize = fallback($$props["resize"], "vertical");
    let name = fallback($$props["name"], "");
    let id = fallback($$props["id"], () => name || `textarea-${Math.random().toString(36).substr(2, 9)}`, true);
    let focused = false;
    textareaClasses = [
      "textarea",
      error && "textarea-error",
      disabled && "textarea-disabled",
      readonly && "textarea-readonly",
      fullWidth && "textarea-full-width",
      `resize-${resize}`
    ].filter(Boolean).join(" ");
    charCount = value.length;
    showCharCount = maxLength !== void 0;
    $$renderer2.push(`<div${attr_class("textarea-wrapper svelte-1ilrf3m", void 0, { "full-width": fullWidth })}>`);
    if (label) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<label${attr("for", id)} class="textarea-label svelte-1ilrf3m">${escape_html(label)} `);
      if (required) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="required-indicator svelte-1ilrf3m">*</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></label>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div${attr_class("textarea-container svelte-1ilrf3m", void 0, { "focused": focused, "has-error": !!error })}><textarea${attr("id", id)}${attr("name", name)}${attr("placeholder", placeholder)}${attr("disabled", disabled, true)}${attr("required", required, true)}${attr("readonly", readonly, true)}${attr("rows", rows)}${attr("maxlength", maxLength)}${attr_class(clsx(textareaClasses), "svelte-1ilrf3m")}>`);
    const $$body = escape_html(value);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div class="textarea-footer svelte-1ilrf3m">`);
    if (helperText && !error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="helper-text svelte-1ilrf3m">${escape_html(helperText)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="error-text svelte-1ilrf3m">${escape_html(error)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (showCharCount) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p${attr_class("char-count svelte-1ilrf3m", void 0, { "over-limit": maxLength && charCount > maxLength })}>${escape_html(charCount)}`);
      if (maxLength) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`/${escape_html(maxLength)}`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, {
      value,
      placeholder,
      label,
      helperText,
      error,
      disabled,
      required,
      readonly,
      fullWidth,
      rows,
      maxLength,
      resize,
      name,
      id
    });
  });
}
function RequestForm($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let title = "";
    let description = "";
    let error = null;
    let isSubmitting = false;
    function handleClear() {
      title = "";
      description = "";
      error = null;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<form class="request-form svelte-19tf9np">`);
      if (error) {
        $$renderer3.push("<!--[-->");
        Alert($$renderer3, {
          variant: "error",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->${escape_html(error.userMessage)}`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      Input($$renderer3, {
        label: "Task Title",
        placeholder: "e.g., Add user authentication system",
        maxlength: 200,
        required: true,
        disabled: isSubmitting,
        get value() {
          return title;
        },
        set value($$value) {
          title = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      Textarea($$renderer3, {
        label: "Description",
        placeholder: "Provide detailed requirements, constraints, and context for this task...",
        rows: 8,
        maxlength: 5e3,
        required: true,
        disabled: isSubmitting,
        get value() {
          return description;
        },
        set value($$value) {
          description = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <div class="form-actions svelte-19tf9np">`);
      Button($$renderer3, {
        type: "submit",
        variant: "primary",
        disabled: !title.trim() || !description.trim(),
        loading: isSubmitting,
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->${escape_html("Start Planning")}`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Button($$renderer3, {
        type: "button",
        variant: "secondary",
        onclick: handleClear,
        disabled: isSubmitting,
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->Clear`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div> <div class="form-hint svelte-19tf9np"><p class="svelte-19tf9np">The Planning Agent will analyze your request and generate a detailed implementation plan with
			specific steps, acceptance criteria, and risk assessment.</p></div></form>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    ErrorBoundary($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="planning-page svelte-dy79yi"><header class="page-header svelte-dy79yi"><h1 class="svelte-dy79yi">Planning Agent</h1> <p class="text-muted svelte-dy79yi">Define and plan complex implementation tasks</p></header> <div class="content-grid svelte-dy79yi"><div class="left-column">`);
        Panel($$renderer3, {
          title: "New Planning Request",
          children: ($$renderer4) => {
            RequestForm($$renderer4);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div> <div class="right-column">`);
        {
          $$renderer3.push("<!--[!-->");
          Panel($$renderer3, {
            title: "Welcome",
            children: ($$renderer4) => {
              $$renderer4.push(`<div class="empty-state svelte-dy79yi"><h2 class="svelte-dy79yi">Start a Planning Session</h2> <p>Fill out the form on the left to begin planning a new task.</p></div>`);
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
