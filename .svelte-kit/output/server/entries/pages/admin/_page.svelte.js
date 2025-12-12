import { $ as escape_html, _ as attr_class, Y as ensure_array_like, a4 as stringify } from "../../../chunks/index2.js";
import { P as Panel } from "../../../chunks/Panel.js";
import { B as Badge } from "../../../chunks/Badge.js";
/* empty css                                                  */
import { I as Input } from "../../../chunks/Input.js";
import { S as Select } from "../../../chunks/Select.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeTab = "users";
    let users = [];
    let userSearch = "";
    let userRoleFilter = "ALL";
    let userStatusFilter = "ALL";
    let systemHealth = [];
    let stats = {
      totalUsers: 0,
      activeUsers: 0,
      adminUsers: 0,
      bdsUsers: 0,
      totalSkills: 0,
      enabledSkills: 0
    };
    const filteredUsers = (() => {
      return users.filter((user) => {
        const matchesSearch = userSearch === "" || user.email.toLowerCase().includes(userSearch.toLowerCase()) || user.name.toLowerCase().includes(userSearch.toLowerCase());
        const matchesRole = userRoleFilter === "ALL" || user.role === userRoleFilter;
        const matchesStatus = userStatusFilter === "ALL" || user.status === userStatusFilter;
        return matchesSearch && matchesRole && matchesStatus;
      });
    })();
    const healthyServices = systemHealth.filter((s) => s.status === "HEALTHY").length;
    const degradedServices = systemHealth.filter((s) => s.status === "DEGRADED").length;
    const downServices = systemHealth.filter((s) => s.status === "DOWN").length;
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    function getStatusColor(status) {
      switch (status) {
        case "ACTIVE":
        case "HEALTHY":
        case "SUCCESS":
          return "success";
        case "DEGRADED":
        case "SUSPENDED":
          return "warning";
        case "INACTIVE":
        case "DOWN":
        case "FAILURE":
          return "error";
        default:
          return "default";
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="admin-page svelte-1jef3w8"><div class="page-header svelte-1jef3w8"><div class="header-content svelte-1jef3w8"><h1 class="page-title svelte-1jef3w8">Admin Panel</h1> <p class="page-description svelte-1jef3w8">System administration and user management</p></div> `);
      Badge($$renderer3, {
        variant: "error",
        size: "sm",
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->BDS ADMIN ONLY`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> <div class="stats-grid svelte-1jef3w8"><div class="stat-card svelte-1jef3w8"><div class="stat-label svelte-1jef3w8">Total Users</div> <div class="stat-value svelte-1jef3w8">${escape_html(stats.totalUsers)}</div> <div class="stat-detail svelte-1jef3w8">${escape_html(stats.activeUsers)} active</div></div> <div class="stat-card svelte-1jef3w8"><div class="stat-label svelte-1jef3w8">Admin Users</div> <div class="stat-value svelte-1jef3w8">${escape_html(stats.adminUsers)}</div> <div class="stat-detail svelte-1jef3w8">${escape_html(stats.bdsUsers)} BDS access</div></div> <div class="stat-card svelte-1jef3w8"><div class="stat-label svelte-1jef3w8">Skills</div> <div class="stat-value svelte-1jef3w8">${escape_html(stats.totalSkills)}</div> <div class="stat-detail svelte-1jef3w8">${escape_html(stats.enabledSkills)} enabled</div></div> <div class="stat-card svelte-1jef3w8"><div class="stat-label svelte-1jef3w8">System Health</div> <div class="stat-value svelte-1jef3w8">${escape_html(healthyServices)}/${escape_html(systemHealth.length)}</div> <div${attr_class(
        `stat-detail stat-detail-${stringify(downServices > 0 ? "error" : degradedServices > 0 ? "warning" : "success")}`,
        "svelte-1jef3w8"
      )}>${escape_html(downServices > 0 ? `${downServices} down` : degradedServices > 0 ? `${degradedServices} degraded` : "All healthy")}</div></div></div> <div class="tabs svelte-1jef3w8"><button${attr_class("tab svelte-1jef3w8", void 0, { "active": activeTab === "users" })}>👥 User Management</button> <button${attr_class("tab svelte-1jef3w8", void 0, { "active": activeTab === "system" })}>🖥️ System Health</button> <button${attr_class("tab svelte-1jef3w8", void 0, { "active": activeTab === "skills" })}>🛠️ Skill Management</button> <button${attr_class("tab svelte-1jef3w8", void 0, { "active": activeTab === "audit" })}>📋 Audit Logs</button></div> <div class="tab-content svelte-1jef3w8">`);
      {
        $$renderer3.push("<!--[-->");
        Panel($$renderer3, {
          title: "User Management",
          variant: "bordered",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="filters svelte-1jef3w8">`);
            Input($$renderer4, {
              label: "Search users",
              placeholder: "Search by email or name...",
              get value() {
                return userSearch;
              },
              set value($$value) {
                userSearch = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----> `);
            Select($$renderer4, {
              label: "Role",
              options: [
                { value: "ALL", label: "All Roles" },
                { value: "USER", label: "User" },
                { value: "ADMIN", label: "Admin" }
              ],
              get value() {
                return userRoleFilter;
              },
              set value($$value) {
                userRoleFilter = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----> `);
            Select($$renderer4, {
              label: "Status",
              options: [
                { value: "ALL", label: "All Status" },
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
                { value: "SUSPENDED", label: "Suspended" }
              ],
              get value() {
                return userStatusFilter;
              },
              set value($$value) {
                userStatusFilter = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="table-container svelte-1jef3w8"><table class="admin-table svelte-1jef3w8"><thead class="svelte-1jef3w8"><tr><th class="svelte-1jef3w8">Email</th><th class="svelte-1jef3w8">Name</th><th class="svelte-1jef3w8">Access Level</th><th class="svelte-1jef3w8">Role</th><th class="svelte-1jef3w8">Status</th><th class="svelte-1jef3w8">Last Login</th><th class="svelte-1jef3w8">Invocations</th><th class="svelte-1jef3w8">Actions</th></tr></thead><tbody class="svelte-1jef3w8"><!--[-->`);
            const each_array = ensure_array_like(filteredUsers);
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let user = each_array[$$index];
              $$renderer4.push(`<tr class="svelte-1jef3w8"><td class="cell-email svelte-1jef3w8">${escape_html(user.email)}</td><td class="svelte-1jef3w8">${escape_html(user.name)}</td><td class="svelte-1jef3w8">`);
              Badge($$renderer4, {
                variant: user.accessLevel === "BDS_ONLY" ? "warning" : "default",
                size: "sm",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(user.accessLevel)}`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></td><td class="svelte-1jef3w8">`);
              Badge($$renderer4, {
                variant: user.role === "ADMIN" ? "success" : "default",
                size: "sm",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(user.role)}`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></td><td class="svelte-1jef3w8">`);
              Badge($$renderer4, {
                variant: getStatusColor(user.status),
                size: "sm",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(user.status)}`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></td><td class="cell-date svelte-1jef3w8">${escape_html(formatDate(user.lastLogin))}</td><td class="cell-number svelte-1jef3w8">${escape_html(user.totalInvocations.toLocaleString())}</td><td class="cell-actions svelte-1jef3w8"><div class="action-buttons svelte-1jef3w8">`);
              if (user.status === "ACTIVE") {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<button class="action-btn action-btn-warning svelte-1jef3w8" title="Deactivate user">Deactivate</button>`);
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push(`<button class="action-btn action-btn-success svelte-1jef3w8" title="Activate user">Activate</button>`);
              }
              $$renderer4.push(`<!--]--> `);
              if (user.role === "USER") {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<button class="action-btn action-btn-primary svelte-1jef3w8" title="Promote to admin">Promote</button>`);
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push(`<button class="action-btn action-btn-secondary svelte-1jef3w8" title="Demote to user">Demote</button>`);
              }
              $$renderer4.push(`<!--]--> <button class="action-btn action-btn-error svelte-1jef3w8" title="Delete user">Delete</button></div></td></tr>`);
            }
            $$renderer4.push(`<!--]-->`);
            if (filteredUsers.length === 0) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<tr class="svelte-1jef3w8"><td colspan="8" class="empty-state svelte-1jef3w8">No users found matching your filters</td></tr>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--></tbody></table></div>`);
          },
          $$slots: { default: true }
        });
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
