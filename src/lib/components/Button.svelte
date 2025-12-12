<script lang="ts">
  // Props
  export let variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let fullWidth: boolean = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let href: string | undefined = undefined;
  export let onclick: ((event: MouseEvent) => void) | undefined = undefined;

  // Compute classes
  $: classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    loading && 'btn-loading',
    disabled && 'btn-disabled'
  ]
    .filter(Boolean)
    .join(' ');

  // If href is provided, render as link
  $: isLink = !!href;
</script>

{#if isLink}
  <a {href} class={classes} aria-disabled={disabled} role="button" {onclick}>
    {#if loading}
      <span class="spinner" aria-hidden="true"></span>
    {/if}
    <slot />
  </a>
{:else}
  <button {type} class={classes} {disabled} {onclick}>
    {#if loading}
      <span class="spinner" aria-hidden="true"></span>
    {/if}
    <slot />
  </button>
{/if}

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Button Base Styles
     ═══════════════════════════════════════════════════════════════════════ */

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    font-family: var(--font-family-body);
    font-weight: 500;
    text-decoration: none;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    position: relative;
    white-space: nowrap;
  }

  .btn:focus-visible {
    outline: 2px solid var(--color-brass);
    outline-offset: 2px;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Size Variants
     ───────────────────────────────────────────────────────────────────── */

  .btn-sm {
    height: 32px;
    padding: 0 var(--spacing-md);
    font-size: 0.875rem;
  }

  .btn-md {
    height: 40px;
    padding: 0 var(--spacing-lg);
    font-size: 0.9375rem;
  }

  .btn-lg {
    height: 48px;
    padding: 0 var(--spacing-xl);
    font-size: 1rem;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Style Variants
     ───────────────────────────────────────────────────────────────────── */

  /* Primary */
  .btn-primary {
    background-color: var(--color-brass);
    color: var(--color-text-inverse);
  }

  .btn-primary:hover:not(.btn-disabled) {
    background-color: var(--color-gold);
    box-shadow: var(--shadow-md);
  }

  .btn-primary:active:not(.btn-disabled) {
    background-color: var(--color-brass);
    transform: translateY(1px);
  }

  /* Secondary */
  .btn-secondary {
    background-color: var(--color-steel-blue);
    color: var(--color-text-primary);
  }

  .btn-secondary:hover:not(.btn-disabled) {
    background-color: var(--color-pale-blue);
    box-shadow: var(--shadow-md);
  }

  .btn-secondary:active:not(.btn-disabled) {
    background-color: var(--color-steel-blue);
    transform: translateY(1px);
  }

  /* Outline */
  .btn-outline {
    background-color: transparent;
    color: var(--color-brass);
    border: 1px solid var(--color-brass);
  }

  .btn-outline:hover:not(.btn-disabled) {
    background-color: var(--color-brass);
    color: var(--color-text-inverse);
  }

  .btn-outline:active:not(.btn-disabled) {
    transform: translateY(1px);
  }

  /* Ghost */
  .btn-ghost {
    background-color: transparent;
    color: var(--color-text-secondary);
  }

  .btn-ghost:hover:not(.btn-disabled) {
    background-color: var(--color-surface-3);
    color: var(--color-text-primary);
  }

  .btn-ghost:active:not(.btn-disabled) {
    background-color: var(--color-surface-2);
  }

  /* Danger */
  .btn-danger {
    background-color: var(--color-error);
    color: white;
  }

  .btn-danger:hover:not(.btn-disabled) {
    background-color: #d32f2f;
    box-shadow: var(--shadow-md);
  }

  .btn-danger:active:not(.btn-disabled) {
    background-color: var(--color-error);
    transform: translateY(1px);
  }

  /* ─────────────────────────────────────────────────────────────────────
     State Variants
     ───────────────────────────────────────────────────────────────────── */

  .btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .btn-loading {
    position: relative;
    color: transparent;
    pointer-events: none;
  }

  .btn-full-width {
    width: 100%;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Loading Spinner
     ───────────────────────────────────────────────────────────────────── */

  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
</style>
