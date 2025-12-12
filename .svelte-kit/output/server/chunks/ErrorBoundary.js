import { o as onDestroy, d as bind_props, c as escape_html } from "./vendor.js";
import { l as logError, c as classifyError } from "./errors.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import "./Pagination.svelte_svelte_type_style_lang.js";
import { B as Button } from "./Button.js";
/* empty css                                    */
import { P as Panel } from "./Panel.js";
import { A as Alert } from "./Alert.js";
const state = { errors: [], lastError: null, dismissedErrors: /* @__PURE__ */ new Set() };
const errorStore = {
  get errors() {
    return state.errors.filter((e) => !state.dismissedErrors.has(e.id));
  },
  get lastError() {
    return state.lastError;
  },
  get hasErrors() {
    return state.errors.length > 0;
  },
  get criticalErrors() {
    return state.errors.filter((e) => e.severity === "CRITICAL" && !state.dismissedErrors.has(e.id));
  },
  get highErrors() {
    return state.errors.filter((e) => e.severity === "HIGH" && !state.dismissedErrors.has(e.id));
  },
  // Actions
  addError(error) {
    state.errors = [...state.errors, error];
    state.lastError = error;
    logError(error);
    if (error.severity === "LOW") {
      setTimeout(
        () => {
          this.dismissError(error.id);
        },
        5e3
      );
    }
    if (state.errors.length > 100) {
      state.errors = state.errors.slice(-100);
    }
  },
  dismissError(id) {
    state.dismissedErrors.add(id);
  },
  clearError(id) {
    state.errors = state.errors.filter((e) => e.id !== id);
    state.dismissedErrors.delete(id);
    if (state.lastError?.id === id) {
      state.lastError = state.errors[state.errors.length - 1] || null;
    }
  },
  clearAll() {
    state.errors = [];
    state.lastError = null;
    state.dismissedErrors.clear();
  },
  clearDismissed() {
    state.errors = state.errors.filter((e) => !state.dismissedErrors.has(e.id));
    state.dismissedErrors.clear();
  }
};
function ErrorBoundary($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { fallback, onError, showDetails = false, children } = $$props;
    let error = null;
    let errorInfo = "";
    let hasError = error !== null;
    onDestroy(() => {
    });
    function handleError(appError, stack = "") {
      error = appError;
      errorInfo = stack;
      errorStore.addError(appError);
      if (onError) {
        onError(appError);
      }
    }
    function catchError(err) {
      const appError = classifyError(err);
      handleError(appError, err instanceof Error ? err.stack || "" : "");
    }
    if (hasError && error) {
      $$renderer2.push("<!--[-->");
      if (fallback) {
        $$renderer2.push("<!--[-->");
        fallback($$renderer2, error);
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="error-boundary svelte-1k3aqik">`);
        Panel($$renderer2, {
          variant: "elevated",
          padding: "lg",
          children: ($$renderer3) => {
            $$renderer3.push(`<div class="error-container svelte-1k3aqik"><div class="error-icon svelte-1k3aqik">⚠️</div> <h2 class="svelte-1k3aqik">Something went wrong</h2> `);
            Alert($$renderer3, {
              variant: "error",
              title: error.category,
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(error.userMessage)}`);
              },
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            if (showDetails && errorInfo) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<details class="error-details svelte-1k3aqik"><summary class="svelte-1k3aqik">Technical Details</summary> <pre class="error-stack svelte-1k3aqik">${escape_html(errorInfo)}</pre></details>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> <div class="error-actions svelte-1k3aqik">`);
            Button($$renderer3, {
              variant: "primary",
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->Try Again`);
              },
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            Button($$renderer3, {
              variant: "secondary",
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->Reload Page`);
              },
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----></div> <p class="error-id svelte-1k3aqik">Error ID: ${escape_html(error.id)}</p></div>`);
          },
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (children) {
        $$renderer2.push("<!--[-->");
        children($$renderer2);
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { catchError });
  });
}
export {
  ErrorBoundary as E,
  errorStore as e
};
