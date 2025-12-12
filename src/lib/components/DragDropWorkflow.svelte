<script lang="ts">
  import { onMount } from 'svelte';
  import {
    DndContext,
    DragOverlay,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent
  } from '@dnd-kit/core';
  import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove
  } from '@dnd-kit/sortable';
  import { CSS } from '@dnd-kit/utilities';
  import type { Skill } from '$lib/api/types';
  import { Button, Badge, Modal, Input, Textarea, Alert } from '$lib/components';

  // Props
  interface Props {
    skills: Skill[];
    initialSteps?: WorkflowStep[];
    onSave?: (steps: WorkflowStep[]) => void;
    onCancel?: () => void;
  }

  interface WorkflowStep {
    id: string;
    skillId: string;
    skillName: string;
    order: number;
    inputs: Record<string, any>;
    useOutputFrom?: string;
  }

  interface ValidationError {
    stepId: string;
    message: string;
  }

  interface HistoryEntry {
    steps: WorkflowStep[];
    timestamp: number;
  }

  let { skills, initialSteps = [], onSave, onCancel }: Props = $props();

  // State
  let workflowSteps = $state<WorkflowStep[]>([...initialSteps]);
  let activeSkillId = $state<string | null>(null);
  let activeStepId = $state<string | null>(null);
  let isDraggingFromLibrary = $state(false);
  let configModalOpen = $state(false);
  let selectedStep = $state<WorkflowStep | null>(null);
  let validationErrors = $state<ValidationError[]>([]);
  let autoSaveEnabled = $state(true);
  let lastSaved = $state<Date | null>(null);

  // Undo/Redo state
  let history = $state<HistoryEntry[]>([]);
  let historyIndex = $state(-1);
  let maxHistorySize = 20;

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Derived state
  let canUndo = $derived(historyIndex > 0);
  let canRedo = $derived(historyIndex < history.length - 1);

  // Initialize history
  onMount(() => {
    addToHistory(workflowSteps);
  });

  // Auto-save effect
  $effect(() => {
    if (autoSaveEnabled && workflowSteps.length > 0 && onSave) {
      const timeoutId = setTimeout(() => {
        onSave(workflowSteps);
        lastSaved = new Date();
      }, 1000); // Debounce auto-save by 1 second

      return () => clearTimeout(timeoutId);
    }
  });

  // Validation effect
  $effect(() => {
    validateWorkflow();
  });

  // Global keyboard shortcuts
  onMount(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Undo: Cmd+Z / Ctrl+Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Redo: Cmd+Shift+Z / Ctrl+Shift+Z
      else if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  /**
   * History Management
   */
  function addToHistory(steps: WorkflowStep[]) {
    // Remove future history if we're not at the end
    if (historyIndex < history.length - 1) {
      history = history.slice(0, historyIndex + 1);
    }

    // Add new entry
    history = [...history, { steps: JSON.parse(JSON.stringify(steps)), timestamp: Date.now() }];

    // Limit history size
    if (history.length > maxHistorySize) {
      history = history.slice(history.length - maxHistorySize);
    }

    historyIndex = history.length - 1;
  }

  function undo() {
    if (!canUndo) return;

    historyIndex--;
    workflowSteps = JSON.parse(JSON.stringify(history[historyIndex].steps));
  }

  function redo() {
    if (!canRedo) return;

    historyIndex++;
    workflowSteps = JSON.parse(JSON.stringify(history[historyIndex].steps));
  }

  /**
   * Drag-and-Drop Handlers
   */
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const activeId = active.id as string;

    // Check if dragging from skill library
    if (activeId.startsWith('skill-')) {
      activeSkillId = activeId.replace('skill-', '');
      isDraggingFromLibrary = true;
    } else if (activeId.startsWith('step-')) {
      activeStepId = activeId;
      isDraggingFromLibrary = false;
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      activeSkillId = null;
      activeStepId = null;
      isDraggingFromLibrary = false;
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle drop from skill library to workflow canvas
    if (isDraggingFromLibrary && overId === 'workflow-canvas') {
      const skill = skills.find(s => s.id === activeSkillId);
      if (skill) {
        addSkillToWorkflow(skill);
      }
    }
    // Handle reordering within workflow
    else if (!isDraggingFromLibrary && activeId.startsWith('step-')) {
      const oldIndex = workflowSteps.findIndex(s => `step-${s.id}` === activeId);
      const newIndex = workflowSteps.findIndex(s => `step-${s.id}` === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(workflowSteps, oldIndex, newIndex);
        // Update order numbers
        workflowSteps = reordered.map((step, index) => ({ ...step, order: index }));
        addToHistory(workflowSteps);
      }
    }

    activeSkillId = null;
    activeStepId = null;
    isDraggingFromLibrary = false;
  }

  /**
   * Workflow Management
   */
  function addSkillToWorkflow(skill: Skill) {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      skillId: skill.id,
      skillName: skill.name,
      order: workflowSteps.length,
      inputs: {},
      useOutputFrom: workflowSteps.length > 0 ? workflowSteps[workflowSteps.length - 1].id : undefined
    };

    workflowSteps = [...workflowSteps, newStep];
    addToHistory(workflowSteps);
  }

  function removeStep(stepId: string) {
    workflowSteps = workflowSteps
      .filter(s => s.id !== stepId)
      .map((step, index) => ({ ...step, order: index }));
    addToHistory(workflowSteps);
  }

  function openConfigModal(step: WorkflowStep) {
    selectedStep = step;
    configModalOpen = true;
  }

  function saveStepConfig() {
    if (!selectedStep) return;

    const index = workflowSteps.findIndex(s => s.id === selectedStep.id);
    if (index !== -1) {
      workflowSteps[index] = { ...selectedStep };
      addToHistory(workflowSteps);
    }

    configModalOpen = false;
    selectedStep = null;
  }

  /**
   * Validation
   */
  function validateWorkflow() {
    const errors: ValidationError[] = [];

    // Check for missing inputs
    workflowSteps.forEach(step => {
      const skill = skills.find(s => s.id === step.skillId);
      if (skill?.requiredInputs) {
        skill.requiredInputs.forEach(input => {
          if (!step.inputs[input] && !step.useOutputFrom) {
            errors.push({
              stepId: step.id,
              message: `Missing required input: ${input}`
            });
          }
        });
      }
    });

    // Check for circular dependencies (simple check)
    const stepMap = new Map(workflowSteps.map(s => [s.id, s]));
    workflowSteps.forEach(step => {
      const visited = new Set<string>();
      let current = step;

      while (current.useOutputFrom) {
        if (visited.has(current.id)) {
          errors.push({
            stepId: step.id,
            message: 'Circular dependency detected'
          });
          break;
        }
        visited.add(current.id);
        const next = stepMap.get(current.useOutputFrom);
        if (!next) break;
        current = next;
      }
    });

    validationErrors = errors;
  }

  function getStepErrors(stepId: string): string[] {
    return validationErrors.filter(e => e.stepId === stepId).map(e => e.message);
  }

  /**
   * Manual Save/Cancel
   */
  function handleSave() {
    if (onSave) {
      onSave(workflowSteps);
      lastSaved = new Date();
    }
  }

  function handleCancel() {
    if (onCancel) {
      onCancel();
    }
  }
</script>

<!-- Drag-and-Drop Workflow Builder -->
<div class="workflow-builder">
  <!-- Toolbar -->
  <div class="toolbar">
    <div class="toolbar-left">
      <h2>Workflow Builder</h2>
      <div class="status">
        {#if lastSaved}
          <span class="saved-indicator">✓ Saved {lastSaved.toLocaleTimeString()}</span>
        {:else}
          <span class="unsaved-indicator">● Unsaved changes</span>
        {/if}
      </div>
    </div>
    <div class="toolbar-right">
      <Button variant="ghost" size="sm" onclick={undo} disabled={!canUndo}>
        ↶ Undo
      </Button>
      <Button variant="ghost" size="sm" onclick={redo} disabled={!canRedo}>
        ↷ Redo
      </Button>
      <Button variant="ghost" size="sm" onclick={handleCancel}>
        Cancel
      </Button>
      <Button variant="primary" size="sm" onclick={handleSave}>
        Save Workflow
      </Button>
    </div>
  </div>

  <!-- Main Content: Side-by-side panels -->
  <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  >
    <div class="builder-content">
      <!-- Skill Library Panel -->
      <div class="skill-library">
        <h3>Skill Library</h3>
        <p class="hint">Drag skills to the workflow canvas</p>

        <div class="skill-list">
          {#each skills as skill}
            <SkillLibraryItem {skill} />
          {/each}
        </div>
      </div>

      <!-- Workflow Canvas -->
      <div class="workflow-canvas" id="workflow-canvas" data-droppable="true">
        <h3>Workflow Steps ({workflowSteps.length})</h3>

        {#if workflowSteps.length === 0}
          <div class="empty-state">
            <div class="empty-icon">⚡</div>
            <p>Drag skills from the library to build your workflow</p>
            <p class="empty-hint">You can reorder steps by dragging them</p>
          </div>
        {:else}
          <SortableContext
            items={workflowSteps.map(s => `step-${s.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {#each workflowSteps as step (step.id)}
              <WorkflowStepItem
                {step}
                errors={getStepErrors(step.id)}
                onConfigure={() => openConfigModal(step)}
                onRemove={() => removeStep(step.id)}
              />
            {/each}
          </SortableContext>
        {/if}
      </div>
    </div>

    <!-- Drag Overlay -->
    <DragOverlay>
      {#if activeSkillId}
        {@const skill = skills.find(s => s.id === activeSkillId)}
        {#if skill}
          <div class="drag-preview">
            <Badge variant="primary">{skill.category}</Badge>
            <strong>{skill.name}</strong>
          </div>
        {/if}
      {:else if activeStepId}
        {@const step = workflowSteps.find(s => `step-${s.id}` === activeStepId)}
        {#if step}
          <div class="drag-preview step-preview">
            <Badge variant="info">Step {step.order + 1}</Badge>
            <strong>{step.skillName}</strong>
          </div>
        {/if}
      {/if}
    </DragOverlay>
  </DndContext>

  <!-- Validation Errors -->
  {#if validationErrors.length > 0}
    <div class="validation-errors">
      <Alert variant="error">
        <strong>Validation Errors ({validationErrors.length})</strong>
        <ul>
          {#each validationErrors.slice(0, 5) as error}
            <li>{error.message} (Step {workflowSteps.find(s => s.id === error.stepId)?.order ?? '?'})</li>
          {/each}
          {#if validationErrors.length > 5}
            <li>...and {validationErrors.length - 5} more</li>
          {/if}
        </ul>
      </Alert>
    </div>
  {/if}
</div>

<!-- Step Configuration Modal -->
{#if configModalOpen && selectedStep}
  <Modal
    title="Configure Step: {selectedStep.skillName}"
    isOpen={configModalOpen}
    onClose={() => { configModalOpen = false; selectedStep = null; }}
  >
    <div class="config-modal">
      <div class="form-group">
        <label>Use output from previous step:</label>
        <Select
          options={[
            { value: '', label: 'None' },
            ...workflowSteps
              .filter(s => s.order < selectedStep.order)
              .map(s => ({ value: s.id, label: `Step ${s.order + 1}: ${s.skillName}` }))
          ]}
          bind:value={selectedStep.useOutputFrom}
        />
      </div>

      <div class="form-group">
        <label>Custom Inputs (JSON):</label>
        <Textarea
          bind:value={selectedStep.inputs}
          rows={6}
          placeholder="{`{\"key\": \"value\"}`}"
        />
      </div>

      <div class="modal-actions">
        <Button variant="ghost" onclick={() => { configModalOpen = false; selectedStep = null; }}>
          Cancel
        </Button>
        <Button variant="primary" onclick={saveStepConfig}>
          Save Configuration
        </Button>
      </div>
    </div>
  </Modal>
{/if}

<!-- Skill Library Item Component -->
{#snippet SkillLibraryItem({ skill }: { skill: Skill })}
  {@const sortable = useSortable({ id: `skill-${skill.id}` })}
  <div
    class="skill-item"
    style={sortable.transform ? `transform: ${CSS.Transform.toString(sortable.transform)}` : ''}
    {...sortable.attributes}
    {...sortable.listeners}
  >
    <Badge variant="primary" size="sm">{skill.category}</Badge>
    <div class="skill-info">
      <strong>{skill.name}</strong>
      <p>{skill.description}</p>
    </div>
    <div class="drag-handle">⋮⋮</div>
  </div>
{/snippet}

<!-- Workflow Step Item Component -->
{#snippet WorkflowStepItem({
  step,
  errors,
  onConfigure,
  onRemove
}: {
  step: WorkflowStep;
  errors: string[];
  onConfigure: () => void;
  onRemove: () => void
})}
  {@const sortable = useSortable({ id: `step-${step.id}` })}
  <div
    class="workflow-step {errors.length > 0 ? 'has-error' : ''}"
    style={sortable.transform ? `transform: ${CSS.Transform.toString(sortable.transform)}` : ''}
    {...sortable.attributes}
  >
    <div class="step-header">
      <div class="step-drag-handle" {...sortable.listeners}>⋮⋮</div>
      <Badge variant="info" size="sm">Step {step.order + 1}</Badge>
      <strong class="step-name">{step.skillName}</strong>
      <div class="step-actions">
        <Button variant="ghost" size="sm" onclick={onConfigure}>
          ⚙️ Configure
        </Button>
        <Button variant="ghost" size="sm" onclick={onRemove}>
          🗑️
        </Button>
      </div>
    </div>

    {#if step.useOutputFrom}
      {@const prevStep = workflowSteps.find(s => s.id === step.useOutputFrom)}
      {#if prevStep}
        <div class="step-dependency">
          ↳ Uses output from Step {prevStep.order + 1}
        </div>
      {/if}
    {/if}

    {#if errors.length > 0}
      <div class="step-errors">
        {#each errors as error}
          <div class="error-message">⚠️ {error}</div>
        {/each}
      </div>
    {/if}
  </div>
{/snippet}

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Workflow Builder Layout
     ═══════════════════════════════════════════════════════════════════════ */

  .workflow-builder {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: var(--spacing-md);
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    background: var(--color-midnight-light);
    border: 1px solid var(--color-brass);
    border-radius: 8px;
  }

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .toolbar-left h2 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--color-pearl);
  }

  .status {
    font-size: 0.875rem;
  }

  .saved-indicator {
    color: var(--color-success);
  }

  .unsaved-indicator {
    color: var(--color-warning);
  }

  .toolbar-right {
    display: flex;
    gap: var(--spacing-sm);
  }

  .builder-content {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: var(--spacing-lg);
    flex: 1;
    overflow: hidden;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     Skill Library Panel
     ═══════════════════════════════════════════════════════════════════════ */

  .skill-library {
    display: flex;
    flex-direction: column;
    background: var(--color-midnight-light);
    border: 1px solid var(--color-brass);
    border-radius: 8px;
    padding: var(--spacing-md);
    overflow-y: auto;
  }

  .skill-library h3 {
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--color-brass);
    font-size: 1.125rem;
  }

  .hint {
    margin: 0 0 var(--spacing-md) 0;
    font-size: 0.875rem;
    color: var(--color-pearl-dark);
  }

  .skill-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .skill-item {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    background: var(--color-midnight);
    border: 1px solid var(--color-brass-dark);
    border-radius: 6px;
    cursor: grab;
    transition: all 0.2s ease;
  }

  .skill-item:hover {
    border-color: var(--color-brass);
    box-shadow: 0 2px 8px rgba(184, 134, 11, 0.2);
  }

  .skill-item:active {
    cursor: grabbing;
  }

  .skill-info {
    flex: 1;
    min-width: 0;
  }

  .skill-info strong {
    display: block;
    color: var(--color-pearl);
    font-size: 0.9375rem;
    margin-bottom: 4px;
  }

  .skill-info p {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--color-pearl-dark);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .drag-handle {
    color: var(--color-brass-dark);
    font-size: 1.25rem;
    cursor: grab;
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     Workflow Canvas
     ═══════════════════════════════════════════════════════════════════════ */

  .workflow-canvas {
    display: flex;
    flex-direction: column;
    background: var(--color-midnight-light);
    border: 2px dashed var(--color-brass-dark);
    border-radius: 8px;
    padding: var(--spacing-md);
    overflow-y: auto;
    min-height: 400px;
  }

  .workflow-canvas h3 {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--color-brass);
    font-size: 1.125rem;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    text-align: center;
    color: var(--color-pearl-dark);
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-md);
    opacity: 0.5;
  }

  .empty-state p {
    margin: 0;
    font-size: 1rem;
  }

  .empty-hint {
    font-size: 0.875rem;
    margin-top: var(--spacing-sm);
    opacity: 0.7;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     Workflow Steps
     ═══════════════════════════════════════════════════════════════════════ */

  .workflow-step {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background: var(--color-midnight);
    border: 1px solid var(--color-brass-dark);
    border-radius: 6px;
    margin-bottom: var(--spacing-sm);
    transition: all 0.2s ease;
  }

  .workflow-step:hover {
    border-color: var(--color-brass);
    box-shadow: 0 2px 8px rgba(184, 134, 11, 0.2);
  }

  .workflow-step.has-error {
    border-color: var(--color-error);
    background: rgba(255, 59, 48, 0.05);
  }

  .step-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .step-drag-handle {
    color: var(--color-brass-dark);
    font-size: 1.25rem;
    cursor: grab;
    padding: 4px;
  }

  .step-drag-handle:active {
    cursor: grabbing;
  }

  .step-name {
    flex: 1;
    color: var(--color-pearl);
    font-size: 0.9375rem;
  }

  .step-actions {
    display: flex;
    gap: var(--spacing-xs);
  }

  .step-dependency {
    font-size: 0.8125rem;
    color: var(--color-info);
    padding-left: calc(var(--spacing-md) + 1.25rem);
  }

  .step-errors {
    padding-left: calc(var(--spacing-md) + 1.25rem);
  }

  .error-message {
    font-size: 0.8125rem;
    color: var(--color-error);
    margin-top: 4px;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     Drag Overlay
     ═══════════════════════════════════════════════════════════════════════ */

  .drag-preview {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-midnight);
    border: 2px solid var(--color-brass);
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    opacity: 0.9;
  }

  .drag-preview strong {
    color: var(--color-pearl);
    font-size: 0.9375rem;
  }

  .step-preview {
    background: var(--color-midnight-light);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     Configuration Modal
     ═══════════════════════════════════════════════════════════════════════ */

  .config-modal {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .form-group label {
    font-weight: 500;
    color: var(--color-pearl);
    font-size: 0.9375rem;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     Validation Errors
     ═══════════════════════════════════════════════════════════════════════ */

  .validation-errors {
    padding: var(--spacing-md);
  }

  .validation-errors ul {
    margin: var(--spacing-sm) 0 0 var(--spacing-md);
    padding: 0;
  }

  .validation-errors li {
    margin-bottom: var(--spacing-xs);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     Responsive
     ═══════════════════════════════════════════════════════════════════════ */

  @media (max-width: 1024px) {
    .builder-content {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
    }

    .skill-library {
      max-height: 300px;
    }
  }
</style>
