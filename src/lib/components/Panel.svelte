<script lang="ts">
  // Props
  export let title: string = '';
  export let subtitle: string = '';
  export let variant: 'default' | 'elevated' | 'bordered' | 'glass' | 'error' = 'default';
  export let padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  export let headerDivider: boolean = true;
  export let footerDivider: boolean = true;
  let className: string = '';
  export { className as class };

  // Slots check
  let hasHeader = false;
  let hasFooter = false;

  // Compute classes
  $: panelClasses = ['panel', `panel-${variant}`, `panel-padding-${padding}`, className]
    .filter(Boolean)
    .join(' ');
</script>

<div class={panelClasses}>
  <!-- Header Section -->
  {#if $$slots.header || title}
    <div class="panel-header" class:with-divider={headerDivider}>
      {#if $$slots.header}
        <slot name="header" />
      {:else if title}
        <div class="panel-header-content">
          <h3 class="panel-title">{title}</h3>
          {#if subtitle}
            <p class="panel-subtitle">{subtitle}</p>
          {/if}
        </div>
        {#if $$slots.actions}
          <div class="panel-actions">
            <slot name="actions" />
          </div>
        {/if}
      {/if}
    </div>
  {/if}

  <!-- Body Section -->
  <div class="panel-body">
    <slot />
  </div>

  <!-- Footer Section -->
  {#if $$slots.footer}
    <div class="panel-footer" class:with-divider={footerDivider}>
      <slot name="footer" />
    </div>
  {/if}
</div>

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Panel Base
     ═══════════════════════════════════════════════════════════════════════ */

  .panel {
    display: flex;
    flex-direction: column;
    background-color: var(--color-surface-2);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: all var(--transition-fast);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Panel Variants
     ───────────────────────────────────────────────────────────────────── */

  .panel-default {
    background-color: var(--color-surface-2);
  }

  .panel-elevated {
    background-color: var(--color-surface-elevated);
    box-shadow: var(--shadow-lg);
  }

  .panel-bordered {
    background-color: var(--color-surface-2);
    border: 1px solid var(--color-border-subtle);
  }

  .panel-glass {
    background: rgba(42, 45, 51, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .panel-error {
    background-color: var(--color-surface-2);
    border: 1px solid var(--color-error);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Padding Variants
     ───────────────────────────────────────────────────────────────────── */

  .panel-padding-none .panel-body {
    padding: 0;
  }

  .panel-padding-sm .panel-body {
    padding: var(--spacing-md);
  }

  .panel-padding-md .panel-body {
    padding: var(--spacing-lg);
  }

  .panel-padding-lg .panel-body {
    padding: var(--spacing-xl);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Panel Header
     ───────────────────────────────────────────────────────────────────── */

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg);
    min-height: 64px;
  }

  .panel-header.with-divider {
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .panel-header-content {
    flex: 1;
  }

  .panel-title {
    font-family: var(--font-family-heading);
    font-size: 1.25rem;
    font-weight: 300;
    color: var(--color-text-primary);
    margin: 0;
    letter-spacing: 0.02em;
  }

  .panel-subtitle {
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
    margin: var(--spacing-xs) 0 0 0;
  }

  .panel-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-left: var(--spacing-md);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Panel Body
     ───────────────────────────────────────────────────────────────────── */

  .panel-body {
    flex: 1;
    overflow: auto;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Panel Footer
     ───────────────────────────────────────────────────────────────────── */

  .panel-footer {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    min-height: 64px;
  }

  .panel-footer.with-divider {
    border-top: 1px solid var(--color-border-subtle);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Scrollbar Styling
     ───────────────────────────────────────────────────────────────────── */

  .panel-body::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .panel-body::-webkit-scrollbar-track {
    background: transparent;
  }

  .panel-body::-webkit-scrollbar-thumb {
    background: var(--color-border-default);
    border-radius: var(--radius-sm);
  }

  .panel-body::-webkit-scrollbar-thumb:hover {
    background: var(--color-border-emphasis);
  }
</style>
