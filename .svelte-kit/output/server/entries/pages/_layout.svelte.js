import { s as store_get, e as ensure_array_like, a as attr, b as attr_class, c as escape_html, u as unsubscribe_stores, p as page, f as fallback, d as bind_props, g as slot } from "../../chunks/vendor.js";
import "../../chunks/Pagination.svelte_svelte_type_style_lang.js";
/* empty css                                               */
import { e as errorStore, E as ErrorBoundary } from "../../chunks/ErrorBoundary.js";
import { g as getErrorBadgeVariant } from "../../chunks/errors.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import { B as Button } from "../../chunks/Button.js";
import { B as Badge } from "../../chunks/Badge.js";
import { A as Alert } from "../../chunks/Alert.js";
function Sidebar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let currentPath;
    const navItems = [
      { label: "Dashboard", href: "/", icon: "📊" },
      { label: "Planning Agent", href: "/planning", icon: "📝" },
      { label: "Execution Agent", href: "/execution", icon: "⚡" },
      { label: "Evaluator Agent", href: "/evaluator", icon: "✓" },
      { label: "Coordinator Agent", href: "/coordinator", icon: "🎯" },
      { label: "Skill Library", href: "/library", icon: "📚" },
      { label: "Agents", href: "/agents", icon: "🤖" },
      { label: "Workflows", href: "/workflows", icon: "🔄" },
      { label: "Testing Lab", href: "/testing", icon: "🧪" },
      { label: "Models", href: "/models", icon: "🧠" },
      { label: "Analytics", href: "/analytics", icon: "📈" },
      { label: "History", href: "/history", icon: "📜" },
      { label: "Architecture", href: "/architecture", icon: "🏗️" },
      { label: "Settings", href: "/settings", icon: "⚙️" },
      { label: "Admin", href: "/admin", icon: "👤" }
    ];
    function isActive(href) {
      if (href === "/") {
        return currentPath === "/";
      }
      return currentPath.startsWith(href);
    }
    currentPath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
    $$renderer2.push(`<aside class="sidebar svelte-129hoe0"><div class="sidebar-header svelte-129hoe0"><h1 class="logo svelte-129hoe0"><span class="logo-vibe svelte-129hoe0">Vibe</span><span class="logo-forge svelte-129hoe0">Forge</span></h1> <p class="tagline svelte-129hoe0">Building Design System</p></div> <nav class="sidebar-nav svelte-129hoe0"><ul class="nav-list svelte-129hoe0"><!--[-->`);
    const each_array = ensure_array_like(navItems);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$renderer2.push(`<li class="nav-item svelte-129hoe0"><a${attr("href", item.href)}${attr_class("nav-link svelte-129hoe0", void 0, { "active": isActive(item.href) })}${attr("aria-current", isActive(item.href) ? "page" : void 0)} data-sveltekit-preload-data="hover">`);
      if (item.icon) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="nav-icon svelte-129hoe0">${escape_html(item.icon)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <span class="nav-label svelte-129hoe0">${escape_html(item.label)}</span></a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></nav> <div class="sidebar-footer svelte-129hoe0"><div class="version-info svelte-129hoe0"><span class="version-label svelte-129hoe0">Version</span> <span class="version-number svelte-129hoe0">1.0.0</span></div></div></aside>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let pageTitle;
    let title = fallback($$props["title"], "");
    let showSearch = fallback($$props["showSearch"], true);
    let showNotifications = fallback($$props["showNotifications"], true);
    let showUser = fallback($$props["showUser"], true);
    let searchQuery = "";
    function generateTitle(pathname) {
      if (pathname === "/") return "Dashboard";
      const segments = pathname.split("/").filter(Boolean);
      return segments[segments.length - 1]?.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "Dashboard";
    }
    pageTitle = title || generateTitle(store_get($$store_subs ??= {}, "$page", page).url.pathname);
    $$renderer2.push(`<header class="header svelte-1elxaub"><div class="header-left svelte-1elxaub"><h2 class="header-title svelte-1elxaub">${escape_html(pageTitle)}</h2></div> <div class="header-right svelte-1elxaub">`);
    if (showSearch) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<form class="search-form svelte-1elxaub"><input type="text" class="search-input svelte-1elxaub" placeholder="Search..."${attr("value", searchQuery)}/> <button type="submit" class="search-button svelte-1elxaub" aria-label="Search"><span class="search-icon svelte-1elxaub">🔍</span></button></form>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (showNotifications) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="icon-button svelte-1elxaub" aria-label="Notifications"><span class="icon svelte-1elxaub">🔔</span> `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="badge-count svelte-1elxaub">3</span>`);
      }
      $$renderer2.push(`<!--]--></button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (showUser) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="user-button svelte-1elxaub" aria-label="User menu"><div class="avatar svelte-1elxaub"><span class="avatar-text svelte-1elxaub">U</span></div> <span class="user-name svelte-1elxaub">User</span></button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></header>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { title, showSearch, showNotifications, showUser });
  });
}
function ErrorNotifications($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let errors = errorStore.errors;
    errorStore.criticalErrors;
    errorStore.highErrors;
    $$renderer2.push(`<div class="error-notifications svelte-14fubx6">`);
    if (errors.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="notifications-container svelte-14fubx6">`);
      if (errors.length > 3) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="notification-header svelte-14fubx6">`);
        Badge($$renderer2, {
          variant: "error",
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->${escape_html(errors.length)} Errors`);
          },
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----> `);
        Button($$renderer2, {
          variant: "ghost",
          size: "sm",
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->Clear All`);
          },
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <!--[-->`);
      const each_array = ensure_array_like(errors.slice(0, 5));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let error = each_array[$$index];
        $$renderer2.push(`<div${attr_class("notification-item svelte-14fubx6", void 0, { "critical": error.severity === "CRITICAL" })}>`);
        Alert($$renderer2, {
          variant: getErrorBadgeVariant(error.severity),
          title: `${error.category} Error`,
          dismissible: true,
          children: ($$renderer3) => {
            $$renderer3.push(`<div class="error-content svelte-14fubx6"><p class="error-message svelte-14fubx6">${escape_html(error.userMessage)}</p> `);
            if (error.details) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<details class="error-details svelte-14fubx6"><summary class="svelte-14fubx6">Details</summary> <p class="svelte-14fubx6">${escape_html(error.details)}</p></details>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> <div class="error-meta svelte-14fubx6"><span class="error-time svelte-14fubx6">${escape_html(error.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }))}</span> <span class="error-id svelte-14fubx6">ID: ${escape_html(error.id.slice(-8))}</span> `);
            if (error.retryable) {
              $$renderer3.push("<!--[-->");
              Badge($$renderer3, {
                variant: "info",
                size: "sm",
                children: ($$renderer4) => {
                  $$renderer4.push(`<!---->Retryable`);
                },
                $$slots: { default: true }
              });
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></div> `);
            if (error.retryable && error.retryAfter) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<p class="retry-hint svelte-14fubx6">Will retry automatically in ${escape_html(Math.round(error.retryAfter / 1e3))}s</p>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></div>`);
          },
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
      }
      $$renderer2.push(`<!--]--> `);
      if (errors.length > 5) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="notification-footer svelte-14fubx6"><p class="more-errors svelte-14fubx6">+${escape_html(errors.length - 5)} more errors</p> `);
        Button($$renderer2, {
          variant: "secondary",
          size: "sm",
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->Clear All`);
          },
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
const state = {
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  wasOffline: false,
  lastOnlineAt: null,
  lastOfflineAt: null
};
function handleOnline() {
  state.wasOffline = !state.isOnline;
  state.isOnline = true;
  state.lastOnlineAt = /* @__PURE__ */ new Date();
  console.log("[Connectivity] Online");
}
function handleOffline() {
  state.isOnline = false;
  state.lastOfflineAt = /* @__PURE__ */ new Date();
  console.log("[Connectivity] Offline");
}
if (typeof window !== "undefined") {
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    });
  }
}
const connectivityStore = {
  get isOffline() {
    return !state.isOnline;
  }
};
function OfflineBanner($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const isOffline = connectivityStore.isOffline;
    if (isOffline) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="offline-banner svelte-l46k7l" role="alert"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="svelte-l46k7l"><path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z" stroke="currentColor" stroke-width="2"></path><path d="M10 6V10" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><circle cx="10" cy="14" r="1" fill="currentColor"></circle></svg> <span>You are offline. Some features may not work.</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function _layout($$renderer, $$props) {
  const showErrorDetails = typeof window !== "undefined" && window.location.hostname === "localhost";
  ErrorBoundary($$renderer, {
    showDetails: showErrorDetails,
    children: ($$renderer2) => {
      OfflineBanner($$renderer2);
      $$renderer2.push(`<!----> <div class="app-layout svelte-12qhfyh">`);
      Sidebar($$renderer2);
      $$renderer2.push(`<!----> <div class="app-content svelte-12qhfyh">`);
      Header($$renderer2, {});
      $$renderer2.push(`<!----> <main class="main-content svelte-12qhfyh"><!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]--></main></div> `);
      ErrorNotifications($$renderer2);
      $$renderer2.push(`<!----></div>`);
    },
    $$slots: { default: true }
  });
}
export {
  _layout as default
};
