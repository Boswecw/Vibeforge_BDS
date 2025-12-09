<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  // Props
  export let variant: 'info' | 'success' | 'warning' | 'error' = 'info';
  export let title: string = '';
  export let dismissible: boolean = false;
  export let icon: string = '';

  // State
  let visible = true;

  const dispatch = createEventDispatcher();

  // Default icons based on variant
  $: defaultIcon = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }[variant];

  $: displayIcon = icon || defaultIcon;

  // Compute classes
  $: classes = ['alert', `alert-${variant}`].filter(Boolean).join(' ');

  function handleDismiss() {
    visible = false;
    dispatch('dismiss');
  }
</script>

{#if visible}
  <div class={classes} role="alert">
    <!-- Icon -->
    <div class="alert-icon">
      {displayIcon}
    </div>

    <!-- Content -->
    <div class="alert-content">
      {#if title}
        <div class="alert-title">{title}</div>
      {/if}
      <div class="alert-message">
        <slot />
      </div>
    </div>

    <!-- Dismiss Button -->
    {#if dismissible}
      <button class="alert-dismiss" on:click={handleDismiss} aria-label="Dismiss alert">
        ✕
      </button>
    {/if}
  </div>
{/if}

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Alert Base
     ═══════════════════════════════════════════════════════════════════════ */

  .alert {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    border-left: 4px solid;
    animation: slideIn var(--transition-base);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ─────────────────────────────────────────────────────────────────────
     Alert Variants
     ───────────────────────────────────────────────────────────────────── */

  .alert-info {
    background-color: rgba(33, 150, 243, 0.1);
    border-left-color: var(--color-info);
  }

  .alert-info .alert-icon {
    color: var(--color-info);
  }

  .alert-success {
    background-color: rgba(76, 175, 80, 0.1);
    border-left-color: var(--color-success);
  }

  .alert-success .alert-icon {
    color: var(--color-success);
  }

  .alert-warning {
    background-color: rgba(255, 152, 0, 0.1);
    border-left-color: var(--color-warning);
  }

  .alert-warning .alert-icon {
    color: var(--color-warning);
  }

  .alert-error {
    background-color: rgba(244, 67, 54, 0.1);
    border-left-color: var(--color-error);
  }

  .alert-error .alert-icon {
    color: var(--color-error);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Alert Components
     ───────────────────────────────────────────────────────────────────── */

  .alert-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
    line-height: 1;
  }

  .alert-content {
    flex: 1;
    min-width: 0;
  }

  .alert-title {
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-xs);
  }

  .alert-message {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  .alert-dismiss {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--color-text-tertiary);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    font-size: 1rem;
    line-height: 1;
    padding: 0;
  }

  .alert-dismiss:hover {
    background-color: rgba(0, 0, 0, 0.1);
    color: var(--color-text-primary);
  }

  .alert-dismiss:active {
    background-color: rgba(0, 0, 0, 0.2);
  }
</style>
