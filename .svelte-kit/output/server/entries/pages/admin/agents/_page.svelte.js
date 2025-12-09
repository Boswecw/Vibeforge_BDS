import { Z as attr, a1 as bind_props, X as ensure_array_like, a2 as fallback, _ as store_get, a0 as unsubscribe_stores } from "../../../../chunks/index2.js";
import { w as writable } from "../../../../chunks/index.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
const AGENT_TEMPLATES = {
  planner: [
    {
      id: "planner.cross-repo.feature-plan",
      label: "Cross-Repo Feature Plan",
      description: "Generates a multi-repo implementation plan with PAORT steps.",
      kind: "planner",
      pipelineId: "nf.mapo.plan.cross_repo.v1",
      allowedRepos: ["vibeforge", "authorforge", "dataforge", "forgeagents"],
      autoEvaluateWithSAS: true,
      locked: true
    }
  ],
  execution: [
    {
      id: "execution.prompt.neuroforge",
      label: "Prompt Exec via NeuroForge",
      description: "Runs prompt executions through NeuroForge with safety and telemetry.",
      kind: "execution",
      pipelineId: "nf.mapo.prompt_exec.v1",
      allowedRepos: ["vibeforge", "authorforge"],
      autoEvaluateWithSAS: true,
      locked: false
    }
  ],
  evaluator: [
    {
      id: "evaluator.sas.compliance",
      label: "SAS Compliance Check",
      description: "Evaluates outputs against SAS sections and safety rules.",
      kind: "evaluator",
      pipelineId: "nf.mapo.eval.sas.v1",
      allowedRepos: ["vibeforge", "authorforge", "websafe"],
      autoEvaluateWithSAS: true,
      locked: true
    }
  ],
  coordinator: [
    {
      id: "coordinator.multi-app.provider-rollout",
      label: "Multi-App Provider API Rollout",
      description: "Coordinates provider rollout across VibeForge, AuthorForge, and WebSafe.",
      kind: "coordinator",
      pipelineId: "nf.mapo.coordinator.provider_rollout.v1",
      allowedRepos: ["vibeforge", "authorforge", "websafe", "dataforge"],
      autoEvaluateWithSAS: true,
      locked: true
    }
  ]
};
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
    $$renderer2.push(`<section class="space-y-4"><header class="flex items-center justify-between"><div><h1 class="text-xl font-semibold text-white">Agent Templates (Admin)</h1> <p class="text-sm text-slate-400">Manage in-memory templates. Locked templates are view-only. TODO: persist via Tauri config.</p></div></header> `);
    AgentTemplateTable($$renderer2, {
      templates: store_get($$store_subs ??= {}, "$templatesStore", templatesStore),
      onUpdate: handleUpdate
    });
    $$renderer2.push(`<!----></section>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
