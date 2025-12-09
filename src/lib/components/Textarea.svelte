<script lang="ts">
  // Props
  export let value: string = '';
  export let placeholder: string = '';
  export let label: string = '';
  export let helperText: string = '';
  export let error: string = '';
  export let disabled: boolean = false;
  export let required: boolean = false;
  export let readonly: boolean = false;
  export let fullWidth: boolean = false;
  export let rows: number = 4;
  export let maxLength: number | undefined = undefined;
  export let resize: 'none' | 'vertical' | 'horizontal' | 'both' = 'vertical';
  export let name: string = '';
  export let id: string = name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  // State
  let focused = false;

  // Compute classes
  $: textareaClasses = [
    'textarea',
    error && 'textarea-error',
    disabled && 'textarea-disabled',
    readonly && 'textarea-readonly',
    fullWidth && 'textarea-full-width',
    `resize-${resize}`
  ]
    .filter(Boolean)
    .join(' ');

  // Character count
  $: charCount = value.length;
  $: showCharCount = maxLength !== undefined;

  // Handlers
  function handleFocus() {
    focused = true;
  }

  function handleBlur() {
    focused = false;
  }
</script>

<div class="textarea-wrapper" class:full-width={fullWidth}>
  {#if label}
    <label for={id} class="textarea-label">
      {label}
      {#if required}
        <span class="required-indicator">*</span>
      {/if}
    </label>
  {/if}

  <div class="textarea-container" class:focused class:has-error={!!error}>
    <textarea
      {id}
      {name}
      {placeholder}
      {disabled}
      {required}
      {readonly}
      {rows}
      maxlength={maxLength}
      bind:value
      class={textareaClasses}
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:input
      on:change
      on:keydown
      on:keyup
      on:keypress
    ></textarea>
  </div>

  <div class="textarea-footer">
    {#if helperText && !error}
      <p class="helper-text">{helperText}</p>
    {/if}

    {#if error}
      <p class="error-text">{error}</p>
    {/if}

    {#if showCharCount}
      <p class="char-count" class:over-limit={maxLength && charCount > maxLength}>
        {charCount}{#if maxLength}/{maxLength}{/if}
      </p>
    {/if}
  </div>
</div>

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Textarea Wrapper
     ═══════════════════════════════════════════════════════════════════════ */

  .textarea-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .textarea-wrapper.full-width {
    width: 100%;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Label
     ───────────────────────────────────────────────────────────────────── */

  .textarea-label {
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
     Textarea Container
     ───────────────────────────────────────────────────────────────────── */

  .textarea-container {
    position: relative;
    display: flex;
    align-items: flex-start;
    background-color: var(--color-surface-2);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }

  .textarea-container:hover:not(.textarea-disabled) {
    border-color: var(--color-border-default);
  }

  .textarea-container.focused {
    border-color: var(--color-brass);
    box-shadow: 0 0 0 3px rgba(193, 151, 69, 0.1);
  }

  .textarea-container.has-error {
    border-color: var(--color-error);
  }

  .textarea-container.has-error.focused {
    box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Textarea Element
     ───────────────────────────────────────────────────────────────────── */

  .textarea {
    width: 100%;
    min-height: 80px;
    padding: var(--spacing-md);
    background: transparent;
    border: none;
    color: var(--color-text-primary);
    font-family: var(--font-family-body);
    font-size: 0.9375rem;
    line-height: 1.5;
    outline: none;
  }

  .textarea::placeholder {
    color: var(--color-text-tertiary);
  }

  .textarea:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .textarea:readonly {
    cursor: default;
    opacity: 0.8;
  }

  .textarea-full-width {
    width: 100%;
  }

  /* Resize options */
  .resize-none {
    resize: none;
  }

  .resize-vertical {
    resize: vertical;
  }

  .resize-horizontal {
    resize: horizontal;
  }

  .resize-both {
    resize: both;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Textarea Footer
     ───────────────────────────────────────────────────────────────────── */

  .textarea-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .helper-text {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    margin: 0;
    padding: 0 var(--spacing-xs);
    flex: 1;
  }

  .error-text {
    font-size: 0.75rem;
    color: var(--color-error);
    margin: 0;
    padding: 0 var(--spacing-xs);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    flex: 1;
  }

  .error-text::before {
    content: '⚠';
    font-size: 0.875rem;
  }

  .char-count {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    margin: 0;
    padding: 0 var(--spacing-xs);
    font-family: var(--font-family-mono);
    white-space: nowrap;
  }

  .char-count.over-limit {
    color: var(--color-error);
    font-weight: 600;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Scrollbar Styling
     ───────────────────────────────────────────────────────────────────── */

  .textarea::-webkit-scrollbar {
    width: 6px;
  }

  .textarea::-webkit-scrollbar-track {
    background: transparent;
  }

  .textarea::-webkit-scrollbar-thumb {
    background: var(--color-border-default);
    border-radius: var(--radius-sm);
  }

  .textarea::-webkit-scrollbar-thumb:hover {
    background: var(--color-border-emphasis);
  }
</style>
