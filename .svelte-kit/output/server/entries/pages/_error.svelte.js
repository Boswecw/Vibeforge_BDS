import { s as store_get, c as escape_html, u as unsubscribe_stores, p as page } from "../../chunks/vendor.js";
function _error($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let error = store_get($$store_subs ??= {}, "$page", page).error;
    let status = store_get($$store_subs ??= {}, "$page", page).status;
    function getErrorTitle(status2) {
      switch (status2) {
        case 404:
          return "Page Not Found";
        case 403:
          return "Access Denied";
        case 500:
          return "Internal Server Error";
        case 503:
          return "Service Unavailable";
        default:
          return "Something Went Wrong";
      }
    }
    function getErrorMessage(status2) {
      switch (status2) {
        case 404:
          return "The page you're looking for doesn't exist or has been moved.";
        case 403:
          return "You don't have permission to access this resource.";
        case 500:
          return "An internal server error occurred. Please try again later.";
        case 503:
          return "The service is temporarily unavailable. Please try again in a moment.";
        default:
          return "An unexpected error occurred. Please try again.";
      }
    }
    function getErrorIcon(status2) {
      switch (status2) {
        case 404:
          return "🔍";
        case 403:
          return "🔒";
        case 500:
          return "⚠️";
        case 503:
          return "🔧";
        default:
          return "❌";
      }
    }
    $$renderer2.push(`<div class="error-page svelte-1j96wlh"><div class="error-container svelte-1j96wlh"><div class="error-icon svelte-1j96wlh">${escape_html(getErrorIcon(status))}</div> <h1 class="error-title svelte-1j96wlh">${escape_html(getErrorTitle(status))}</h1> <p class="error-status svelte-1j96wlh">Error ${escape_html(status)}</p> <p class="error-message svelte-1j96wlh">${escape_html(getErrorMessage(status))}</p> `);
    if (error?.message) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="error-details svelte-1j96wlh"><details class="svelte-1j96wlh"><summary class="svelte-1j96wlh">Technical Details</summary> <pre class="svelte-1j96wlh">${escape_html(error.message)}</pre></details></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="error-actions svelte-1j96wlh"><a href="/" class="btn-home svelte-1j96wlh">Go Home</a> <button class="btn-back svelte-1j96wlh">Go Back</button> <button class="btn-reload svelte-1j96wlh">Reload</button></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _error as default
};
