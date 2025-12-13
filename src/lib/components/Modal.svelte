<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import Button from './Button.svelte';
  import { FocusTrap } from '$lib/utils/accessibility';

  // Props
  export let open: boolean = false;
  export let title: string = '';
  export let size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  export let closeOnBackdrop: boolean = true;
  export let closeOnEscape: boolean = true;
  export let showClose: boolean = true;
  export let showFooter: boolean = true;
  export let onClose: (() => void) | undefined = undefined;

  const dispatch = createEventDispatcher();
  let focusTrap: FocusTrap | null = null;
  let modalEl: HTMLElement;

  // Effect to manage focus trap when modal opens/closes
  $: if (open && modalEl) {
    setTimeout(() => {
      focusTrap = new FocusTrap(modalEl);
      focusTrap.activate();
    }, 50);
  } else if (!open && focusTrap) {
    focusTrap.deactivate();
    focusTrap = null;
  }

  // Size classes
  $: sizeClass = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl',
    full: 'modal-full'
  }[size];

  // Handle escape key
  function handleKeydown(event: KeyboardEvent) {
    if (closeOnEscape && event.key === 'Escape' && open) {
      close();
    }
  }

  // Handle backdrop click
  function handleBackdropClick(event: MouseEvent) {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      close();
    }
  }

  function close() {
    open = false;
    dispatch('close');
    if (onClose) onClose();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div class="modal-backdrop" on:click={handleBackdropClick} role="presentation">
    <div bind:this={modalEl} class="modal {sizeClass}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <!-- Header -->
      <div class="modal-header">
        {#if title}
          <h3 class="modal-title" id="modal-title">{title}</h3>
        {:else if $$slots.header}
          <div class="modal-title">
            <slot name="header" />
          </div>
        {/if}

        {#if showClose}
          <button class="modal-close" on:click={close} aria-label="Close modal">
            ✕
          </button>
        {/if}
      </div>

      <!-- Body -->
      <div class="modal-body">
        <slot />
      </div>

      <!-- Footer -->
      {#if showFooter && $$slots.footer}
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Modal Backdrop
     ═══════════════════════════════════════════════════════════════════════ */

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal-backdrop);
    padding: var(--spacing-lg);
    animation: fadeIn var(--transition-base);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* ─────────────────────────────────────────────────────────────────────
     Modal Container
     ───────────────────────────────────────────────────────────────────── */

  .modal {
    background-color: var(--color-surface-2);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - var(--spacing-3xl));
    overflow: hidden;
    z-index: var(--z-modal);
    animation: slideUp var(--transition-base);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Size variants */
  .modal-sm {
    width: 100%;
    max-width: 400px;
  }

  .modal-md {
    width: 100%;
    max-width: 600px;
  }

  .modal-lg {
    width: 100%;
    max-width: 800px;
  }

  .modal-xl {
    width: 100%;
    max-width: 1200px;
  }

  .modal-full {
    width: calc(100vw - var(--spacing-3xl));
    max-width: none;
    height: calc(100vh - var(--spacing-3xl));
    max-height: none;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Modal Header
     ───────────────────────────────────────────────────────────────────── */

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg) var(--spacing-xl);
    border-bottom: 1px solid var(--color-border-subtle);
    flex-shrink: 0;
  }

  .modal-title {
    font-family: var(--font-family-heading);
    font-size: 1.5rem;
    font-weight: 300;
    color: var(--color-text-primary);
    margin: 0;
    letter-spacing: 0.02em;
  }

  .modal-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--color-text-tertiary);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    font-size: 1.25rem;
    line-height: 1;
    padding: 0;
    margin-left: var(--spacing-md);
  }

  .modal-close:hover {
    background-color: var(--color-surface-3);
    color: var(--color-text-primary);
  }

  .modal-close:active {
    background-color: var(--color-graphite);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Modal Body
     ───────────────────────────────────────────────────────────────────── */

  .modal-body {
    flex: 1;
    padding: var(--spacing-xl);
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* Scrollbar styling */
  .modal-body::-webkit-scrollbar {
    width: 8px;
  }

  .modal-body::-webkit-scrollbar-track {
    background: var(--color-surface-2);
  }

  .modal-body::-webkit-scrollbar-thumb {
    background: var(--color-border-default);
    border-radius: var(--radius-sm);
  }

  .modal-body::-webkit-scrollbar-thumb:hover {
    background: var(--color-border-emphasis);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Modal Footer
     ───────────────────────────────────────────────────────────────────── */

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--spacing-md);
    padding: var(--spacing-lg) var(--spacing-xl);
    border-top: 1px solid var(--color-border-subtle);
    flex-shrink: 0;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Responsive
     ───────────────────────────────────────────────────────────────────── */

  @media (max-width: 768px) {
    .modal-backdrop {
      padding: 0;
    }

    .modal {
      max-height: 100vh;
      border-radius: 0;
    }

    .modal-sm,
    .modal-md,
    .modal-lg,
    .modal-xl {
      width: 100vw;
      max-width: none;
    }

    .modal-full {
      width: 100vw;
      height: 100vh;
    }
  }
</style>
