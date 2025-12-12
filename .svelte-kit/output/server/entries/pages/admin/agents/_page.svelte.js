import { a as attr, d as bind_props, f as fallback, e as ensure_array_like, c as escape_html, s as store_get, w as writable, u as unsubscribe_stores } from "../../../../chunks/vendor.js";
import { A as AGENT_TEMPLATES } from "../../../../chunks/templates.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/UpdateBanner.svelte_svelte_type_style_lang.js";
/* empty css                                                     */
import { P as Panel } from "../../../../chunks/Panel.js";
import { A as Alert } from "../../../../chunks/Alert.js";
function AgentTemplateForm($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let template = $$props["template"];
    let allowedReposText = template.allowedRepos.join(", ");
    let autoEvaluateWithSAS = template.autoEvaluateWithSAS;
    $$renderer2.push(`<div class="space-y-3"><div><label for="allowed-repos" class="text-sm text-slate-300">Allowed Repos (comma-separated)</label> <input id="allowed-repos" class="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 text-sm mt-1"${attr("value", allowedReposText)}/></div> <div class="flex items-center gap-2"><input id="sas" type="checkbox"${attr("checked", autoEvaluateWithSAS, true)} class="accent-amber-400"/> <label for="sas" class="text-sm text-slate-200">Auto evaluate with SAS</label></div> <div class="flex justify-end gap-2"><button type="button" class="px-3 py-1 rounded border border-slate-700 text-slate-200">Cancel</button> <button type="button" class="px-3 py-1 rounded bg-amber-500 text-black font-semibold">Save</button></div></div>`);
    bind_props($$props, { template });
  });
}
function AgentTemplateTable($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let templates = fallback($$props["templates"], () => [], true);
    let onUpdate = $$props["onUpdate"];
    let editingId = null;
    $$renderer2.push(`<div class="overflow-auto"><table class="min-w-full text-sm text-left text-slate-200"><thead class="bg-slate-800 text-xs uppercase text-slate-400"><tr><th class="px-4 py-2">Kind</th><th class="px-4 py-2">Label</th><th class="px-4 py-2">Pipeline</th><th class="px-4 py-2">Allowed Repos</th><th class="px-4 py-2">Auto SAS</th><th class="px-4 py-2">Locked</th><th class="px-4 py-2">Actions</th></tr></thead><tbody><!--[-->`);
    const each_array = ensure_array_like(templates);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let template = each_array[$$index];
      $$renderer2.push(`<tr class="border-b border-slate-800"><td class="px-4 py-2">${escape_html(template.kind)}</td><td class="px-4 py-2">${escape_html(template.label)}</td><td class="px-4 py-2">${escape_html(template.pipelineId)}</td><td class="px-4 py-2 text-slate-300">${escape_html(template.allowedRepos.join(", "))}</td><td class="px-4 py-2">${escape_html(template.autoEvaluateWithSAS ? "Yes" : "No")}</td><td class="px-4 py-2">${escape_html(template.locked ? "Locked" : "Editable")}</td><td class="px-4 py-2">`);
      if (!template.locked) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button class="px-3 py-1 rounded bg-amber-500 text-black text-xs font-semibold">Edit</button>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<span class="text-xs text-slate-500">Locked</span>`);
      }
      $$renderer2.push(`<!--]--></td></tr> `);
      if (editingId === template.id) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<tr class="border-b border-slate-800"><td colspan="7" class="px-4 py-3 bg-slate-900/70">`);
        AgentTemplateForm($$renderer2, { template });
        $$renderer2.push(`<!----> <p class="text-xs text-slate-500 mt-2">TODO: persist to config (Tauri) instead of in-memory once available.</p></td></tr>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div>`);
    bind_props($$props, { templates, onUpdate });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const initialTemplates = [
      ...AGENT_TEMPLATES.planner,
      ...AGENT_TEMPLATES.execution,
      ...AGENT_TEMPLATES.evaluator,
      ...AGENT_TEMPLATES.coordinator
    ];
    const templatesStore = writable(initialTemplates);
    const handleUpdate = (updated) => {
      templatesStore.update((items) => items.map((t) => t.id === updated.id ? { ...t, ...updated } : t));
    };
    $$renderer2.push(`<div class="admin-container svelte-1o5mf4f"><div class="page-header svelte-1o5mf4f"><h1 class="page-title svelte-1o5mf4f">Agent Templates</h1> <p class="page-description svelte-1o5mf4f">Manage in-memory templates. Locked templates are view-only.</p></div> `);
    Alert($$renderer2, {
      variant: "info",
      dismissible: true,
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->TODO: Template persistence via Tauri config not yet implemented. Changes are in-memory only.`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Panel($$renderer2, {
      variant: "bordered",
      padding: "lg",
      children: ($$renderer3) => {
        AgentTemplateTable($$renderer3, {
          templates: store_get($$store_subs ??= {}, "$templatesStore", templatesStore),
          onUpdate: handleUpdate
        });
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
