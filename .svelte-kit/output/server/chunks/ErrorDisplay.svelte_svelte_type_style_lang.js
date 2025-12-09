import { a6 as ssr_context, a1 as bind_props } from "./index2.js";
import { e as escape_html } from "./escaping.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function ErrorBoundary($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { fallback, onError, children } = $$props;
    let error = null;
    let errorInfo = null;
    let hasError = error !== null;
    onDestroy(() => {
    });
    function handleError(err, info = {}) {
      error = err;
      errorInfo = info;
      if (onError) {
        onError(err, info);
      }
      console.error("ErrorBoundary caught error:", err, info);
    }
    function catchError(err, info = {}) {
      handleError(err, info);
    }
    if (hasError && error) {
      $$renderer2.push("<!--[-->");
      if (fallback) {
        $$renderer2.push("<!--[-->");
        fallback($$renderer2, error);
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="error-boundary svelte-1k3aqik"><div class="error-container svelte-1k3aqik"><div class="error-icon svelte-1k3aqik">⚠️</div> <h2 class="svelte-1k3aqik">Something went wrong</h2> <p class="error-message svelte-1k3aqik">${escape_html(error.message || "An unexpected error occurred")}</p> `);
        if (errorInfo?.componentStack) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<details class="error-details svelte-1k3aqik"><summary class="svelte-1k3aqik">Error Details</summary> <pre class="error-stack svelte-1k3aqik">${escape_html(errorInfo.componentStack)}</pre></details>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (error.stack) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<details class="error-details svelte-1k3aqik"><summary class="svelte-1k3aqik">Stack Trace</summary> <pre class="error-stack svelte-1k3aqik">${escape_html(error.stack)}</pre></details>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <div class="error-actions svelte-1k3aqik"><button class="btn-retry svelte-1k3aqik">Try Again</button> <button class="btn-reload svelte-1k3aqik">Reload Page</button></div></div></div>`);
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
  ErrorBoundary as E
};
