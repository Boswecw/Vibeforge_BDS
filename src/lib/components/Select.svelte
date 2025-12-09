<script lang="ts">
  // Props
  export let value: string | number = '';
  export let options: Array<{ value: string | number; label: string; disabled?: boolean }> = [];
  export let placeholder: string = 'Select an option...';
  export let label: string = '';
  export let helperText: string = '';
  export let error: string = '';
  export let disabled: boolean = false;
  export let required: boolean = false;
  export let fullWidth: boolean = false;
  export let name: string = '';
  export let id: string = name || `select-${Math.random().toString(36).substr(2, 9)}`;

  // State
  let focused = false;

  // Compute classes
  $: selectClasses = [
    'select',
    error && 'select-error',
    disabled && 'select-disabled',
    fullWidth && 'select-full-width'
  ]
    .filter(Boolean)
    .join(' ');

  // Handlers
  function handleFocus() {
    focused = true;
  }

  function handleBlur() {
    focused = false;
  }
</script>

<div class="select-wrapper" class:full-width={fullWidth}>
  {#if label}
    <label for={id} class="select-label">
      {label}
      {#if required}
        <span class="required-indicator">*</span>
      {/if}
    </label>
  {/if}

  <div class="select-container" class:focused class:has-error={!!error}>
    <select
      {id}
      {name}
      {disabled}
      {required}
      bind:value
      class={selectClasses}
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:change
    >
      {#if placeholder}
        <option value="" disabled selected={!value}>{placeholder}</option>
      {/if}
      {#each options as option}
        <option value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      {/each}
    </select>
    <span class="select-arrow">▼</span>
  </div>

  {#if helperText && !error}
    <p class="helper-text">{helperText}</p>
  {/if}

  {#if error}
    <p class="error-text">{error}</p>
  {/if}
</div>

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Select Wrapper
     ═══════════════════════════════════════════════════════════════════════ */

  .select-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .select-wrapper.full-width {
    width: 100%;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Label
     ───────────────────────────────────────────────────────────────────── */

  .select-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xs);
  }

  .required-indicator {
    color: var(--color-error);
    margin-left: 2px;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Select Container
     ───────────────────────────────────────────────────────────────────── */

  .select-container {
    position: relative;
    display: flex;
    align-items: center;
    background-color: var(--color-surface-2);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }

  .select-container:hover:not(.select-disabled) {
    border-color: var(--color-border-default);
  }

  .select-container.focused {
    border-color: var(--color-brass);
    box-shadow: 0 0 0 3px rgba(193, 151, 69, 0.1);
  }

  .select-container.has-error {
    border-color: var(--color-error);
  }

  .select-container.has-error.focused {
    box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Select Element
     ───────────────────────────────────────────────────────────────────── */

  .select {
    width: 100%;
    height: 40px;
    padding: 0 var(--spacing-md);
    padding-right: 36px; /* Space for arrow */
    background: transparent;
    border: none;
    color: var(--color-text-primary);
    font-family: var(--font-family-body);
    font-size: 0.9375rem;
    outline: none;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .select:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .select option {
    background-color: var(--color-surface-2);
    color: var(--color-text-primary);
    padding: var(--spacing-sm);
  }

  .select option:disabled {
    color: var(--color-text-tertiary);
  }

  .select-full-width {
    width: 100%;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Select Arrow
     ───────────────────────────────────────────────────────────────────── */

  .select-arrow {
    position: absolute;
    right: var(--spacing-md);
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.625rem;
    color: var(--color-text-tertiary);
    pointer-events: none;
    transition: transform var(--transition-fast);
  }

  .select-container.focused .select-arrow {
    color: var(--color-brass);
    transform: translateY(-50%) rotate(180deg);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Helper & Error Text
     ───────────────────────────────────────────────────────────────────── */

  .helper-text {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    margin: 0;
    padding: 0 var(--spacing-xs);
  }

  .error-text {
    font-size: 0.75rem;
    color: var(--color-error);
    margin: 0;
    padding: 0 var(--spacing-xs);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .error-text::before {
    content: '⚠';
    font-size: 0.875rem;
  }
</style>
