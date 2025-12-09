<script lang="ts">
  import { writable } from 'svelte/store';
  import { AGENT_TEMPLATES } from '$lib/agents/templates';
  import type { AgentTemplate } from '$lib/agents/types';
  import AgentTemplateTable from '$lib/components/admin/AgentTemplateTable.svelte';
  import { Panel, Alert } from '$lib/components';

  const initialTemplates: AgentTemplate[] = [
    ...AGENT_TEMPLATES.planner,
    ...AGENT_TEMPLATES.execution,
    ...AGENT_TEMPLATES.evaluator,
    ...AGENT_TEMPLATES.coordinator
  ];

  const templatesStore = writable<AgentTemplate[]>(initialTemplates);

  const handleUpdate = (updated: AgentTemplate) => {
    templatesStore.update((items) =>
      items.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
    );
  };
</script>

<div class="admin-container">
  <!-- Page Header -->
  <div class="page-header">
    <h1 class="page-title">Agent Templates</h1>
    <p class="page-description">
      Manage in-memory templates. Locked templates are view-only.
    </p>
  </div>

  <!-- Info Alert -->
  <Alert variant="info" dismissible>
    TODO: Template persistence via Tauri config not yet implemented. Changes are in-memory only.
  </Alert>

  <!-- Templates Panel -->
  <Panel variant="bordered" padding="lg">
    <AgentTemplateTable templates={$templatesStore} onUpdate={handleUpdate} />
  </Panel>
</div>

<style>
  .admin-container {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .page-header {
    margin-bottom: var(--spacing-md);
  }

  .page-title {
    font-family: var(--font-family-heading);
    font-size: 2.5rem;
    font-weight: 300;
    color: var(--color-text-primary);
    margin: 0 0 var(--spacing-sm) 0;
    letter-spacing: 0.02em;
  }

  .page-description {
    font-size: 1.125rem;
    color: var(--color-text-tertiary);
    margin: 0;
  }
</style>
