<script lang="ts">
  // Props
  export let type: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url' = 'text';
  export let value: string | number = '';
  export let placeholder: string = '';
  export let label: string = '';
  export let helperText: string = '';
  export let error: string = '';
  export let disabled: boolean = false;
  export let required: boolean = false;
  export let readonly: boolean = false;
  export let fullWidth: boolean = false;
  export let name: string = '';
  export let id: string = name || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Number input specific props
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let step: number | undefined = undefined;

  // State
  let focused = false;

  // Compute classes
  $: inputClasses = [
    'input',
    error && 'input-error',
    disabled && 'input-disabled',
    readonly && 'input-readonly',
    fullWidth && 'input-full-width'
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

<div class="input-wrapper" class:full-width={fullWidth}>
  {#if label}
    <label for={id} class="input-label">
      {label}
      {#if required}
        <span class="required-indicator">*</span>
      {/if}
    </label>
  {/if}

  <div class="input-container" class:focused class:has-error={!!error}>
    <input
      {id}
      {type}
      {name}
      {placeholder}
      {disabled}
      {required}
      {readonly}
      min={type === 'number' ? min : undefined}
      max={type === 'number' ? max : undefined}
      step={type === 'number' ? step : undefined}
      bind:value
      class={inputClasses}
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:input
      on:change
      on:keydown
      on:keyup
      on:keypress
    />
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
     Input Wrapper
     ═══════════════════════════════════════════════════════════════════════ */

  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .input-wrapper.full-width {
    width: 100%;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Label
     ───────────────────────────────────────────────────────────────────── */

  .input-label {
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
     Input Container
     ───────────────────────────────────────────────────────────────────── */

  .input-container {
    position: relative;
    display: flex;
    align-items: center;
    background-color: var(--color-surface-2);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }

  .input-container:hover:not(.input-disabled) {
    border-color: var(--color-border-default);
  }

  .input-container.focused {
    border-color: var(--color-brass);
    box-shadow: 0 0 0 3px rgba(193, 151, 69, 0.1);
  }

  .input-container.has-error {
    border-color: var(--color-error);
  }

  .input-container.has-error.focused {
    box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Input Element
     ───────────────────────────────────────────────────────────────────── */

  .input {
    width: 100%;
    height: 40px;
    padding: 0 var(--spacing-md);
    background: transparent;
    border: none;
    color: var(--color-text-primary);
    font-family: var(--font-family-body);
    font-size: 0.9375rem;
    outline: none;
  }

  .input::placeholder {
    color: var(--color-text-tertiary);
  }

  .input:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .input:readonly {
    cursor: default;
    opacity: 0.8;
  }

  .input-full-width {
    width: 100%;
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

  /* ─────────────────────────────────────────────────────────────────────
     Autofill Styles
     ───────────────────────────────────────────────────────────────────── */

  .input:-webkit-autofill,
  .input:-webkit-autofill:hover,
  .input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px var(--color-surface-2) inset;
    -webkit-text-fill-color: var(--color-text-primary);
    transition: background-color 5000s ease-in-out 0s;
  }
</style>
