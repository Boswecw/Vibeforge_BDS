<script lang="ts">
  // Props
  export let variant: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info' = 'default';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let dot: boolean = false;
  export let outline: boolean = false;

  // Compute classes
  $: classes = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    dot && 'badge-dot',
    outline && 'badge-outline'
  ]
    .filter(Boolean)
    .join(' ');
</script>

<span class={classes}>
  {#if dot}
    <span class="badge-dot-indicator"></span>
  {/if}
  <slot />
</span>

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Badge Base
     ═══════════════════════════════════════════════════════════════════════ */

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    font-family: var(--font-family-body);
    font-weight: 500;
    border-radius: var(--radius-full);
    white-space: nowrap;
    transition: all var(--transition-fast);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Size Variants
     ───────────────────────────────────────────────────────────────────── */

  .badge-sm {
    padding: 0.125rem 0.5rem;
    font-size: 0.6875rem;
    height: 18px;
  }

  .badge-md {
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    height: 22px;
  }

  .badge-lg {
    padding: 0.375rem 1rem;
    font-size: 0.875rem;
    height: 26px;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Style Variants
     ───────────────────────────────────────────────────────────────────── */

  /* Default */
  .badge-default {
    background-color: var(--color-graphite);
    color: var(--color-text-secondary);
  }

  .badge-default.badge-outline {
    background-color: transparent;
    border: 1px solid var(--color-border-default);
    color: var(--color-text-secondary);
  }

  /* Accent */
  .badge-accent {
    background-color: var(--color-brass);
    color: var(--color-text-inverse);
  }

  .badge-accent.badge-outline {
    background-color: transparent;
    border: 1px solid var(--color-brass);
    color: var(--color-brass);
  }

  /* Success */
  .badge-success {
    background-color: var(--color-success);
    color: white;
  }

  .badge-success.badge-outline {
    background-color: transparent;
    border: 1px solid var(--color-success);
    color: var(--color-success);
  }

  /* Warning */
  .badge-warning {
    background-color: var(--color-warning);
    color: var(--color-text-inverse);
  }

  .badge-warning.badge-outline {
    background-color: transparent;
    border: 1px solid var(--color-warning);
    color: var(--color-warning);
  }

  /* Error */
  .badge-error {
    background-color: var(--color-error);
    color: white;
  }

  .badge-error.badge-outline {
    background-color: transparent;
    border: 1px solid var(--color-error);
    color: var(--color-error);
  }

  /* Info */
  .badge-info {
    background-color: var(--color-info);
    color: white;
  }

  .badge-info.badge-outline {
    background-color: transparent;
    border: 1px solid var(--color-info);
    color: var(--color-info);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Dot Variant
     ───────────────────────────────────────────────────────────────────── */

  .badge-dot-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
  }

  .badge-dot.badge-sm .badge-dot-indicator {
    width: 4px;
    height: 4px;
  }

  .badge-dot.badge-lg .badge-dot-indicator {
    width: 8px;
    height: 8px;
  }
</style>
