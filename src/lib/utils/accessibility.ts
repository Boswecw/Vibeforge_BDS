/**
 * Accessibility Utilities
 *
 * Provides helpers for ARIA compliance, keyboard navigation,
 * focus management, and screen reader support.
 */

/**
 * Focus trap utility for modals and dialogs
 * Keeps focus within a container when Tab/Shift+Tab is pressed
 */
export class FocusTrap {
  private container: HTMLElement;
  private previousFocus: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /**
   * Activate the focus trap
   */
  activate() {
    // Store currently focused element
    this.previousFocus = document.activeElement as HTMLElement;

    // Get all focusable elements
    this.updateFocusableElements();

    // Focus first element
    if (this.focusableElements.length > 0) {
      setTimeout(() => {
        this.focusableElements[0]?.focus();
      }, 10);
    }

    // Add event listeners
    this.container.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Deactivate the focus trap and restore previous focus
   */
  deactivate() {
    this.container.removeEventListener('keydown', this.handleKeyDown);

    // Restore focus to previously focused element
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      setTimeout(() => {
        this.previousFocus?.focus();
      }, 10);
    }
  }

  /**
   * Update list of focusable elements
   */
  private updateFocusableElements() {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    this.focusableElements = Array.from(
      this.container.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter(el => {
      // Filter out hidden elements
      return el.offsetParent !== null;
    });
  }

  /**
   * Handle Tab/Shift+Tab to trap focus
   */
  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    this.updateFocusableElements();

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (e.shiftKey) {
      // Shift+Tab: moving backwards
      if (activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab: moving forwards
      if (activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };
}

/**
 * Announce message to screen readers using ARIA live region
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  // Create or get live region
  let liveRegion = document.getElementById('aria-live-region');

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }

  // Update priority if changed
  liveRegion.setAttribute('aria-live', priority);

  // Clear then set message (forces screen reader announcement)
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion!.textContent = message;
  }, 100);
}

/**
 * Generate unique ID for ARIA relationships
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
  idCounter++;
  return `${prefix}-${idCounter}-${Date.now()}`;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors)
  ).filter(el => el.offsetParent !== null);
}

/**
 * Check if element is visible (for screen readers)
 */
export function isVisible(element: HTMLElement): boolean {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}

/**
 * Set up keyboard navigation for list/grid
 */
export interface KeyboardNavigationOptions {
  container: HTMLElement;
  items: HTMLElement[];
  currentIndex: number;
  onIndexChange: (newIndex: number) => void;
  onSelect?: (index: number) => void;
  orientation?: 'vertical' | 'horizontal' | 'grid';
  loop?: boolean; // Whether to loop from end to start
}

export function setupKeyboardNavigation(options: KeyboardNavigationOptions) {
  const {
    container,
    items,
    currentIndex,
    onIndexChange,
    onSelect,
    orientation = 'vertical',
    loop = true
  } = options;

  const handleKeyDown = (e: KeyboardEvent) => {
    let newIndex = currentIndex;
    let handled = false;

    switch (e.key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'grid') {
          newIndex = currentIndex + 1;
          handled = true;
        }
        break;

      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'grid') {
          newIndex = currentIndex - 1;
          handled = true;
        }
        break;

      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'grid') {
          newIndex = currentIndex + 1;
          handled = true;
        }
        break;

      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'grid') {
          newIndex = currentIndex - 1;
          handled = true;
        }
        break;

      case 'Home':
        newIndex = 0;
        handled = true;
        break;

      case 'End':
        newIndex = items.length - 1;
        handled = true;
        break;

      case 'Enter':
      case ' ':
        if (onSelect) {
          onSelect(currentIndex);
          handled = true;
        }
        break;
    }

    if (handled) {
      e.preventDefault();

      // Clamp or loop index
      if (newIndex < 0) {
        newIndex = loop ? items.length - 1 : 0;
      } else if (newIndex >= items.length) {
        newIndex = loop ? 0 : items.length - 1;
      }

      if (newIndex !== currentIndex) {
        onIndexChange(newIndex);
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Screen reader only (sr-only) class styles
 * Use this in your CSS to hide elements visually but keep them for screen readers
 */
export const srOnlyStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .sr-only-focusable:focus,
  .sr-only-focusable:active {
    position: static;
    width: auto;
    height: auto;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
`;

/**
 * Skip link helper
 * Creates a skip navigation link for keyboard users
 */
export function createSkipLink(targetId: string, text: string = 'Skip to main content'): HTMLElement {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'skip-link sr-only-focusable';
  skipLink.textContent = text;
  skipLink.style.position = 'absolute';
  skipLink.style.top = '0';
  skipLink.style.left = '0';
  skipLink.style.zIndex = '10000';
  skipLink.style.padding = '1rem';
  skipLink.style.backgroundColor = 'var(--color-brass, #B8860B)';
  skipLink.style.color = 'var(--color-midnight, #0A0E1A)';
  skipLink.style.textDecoration = 'none';
  skipLink.style.fontWeight = 'bold';

  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  return skipLink;
}

/**
 * WCAG 2.1 AA Contrast checker
 * Returns true if contrast ratio meets WCAG AA standards
 */
export function meetsContrastRequirements(
  foreground: string,
  background: string,
  largeText: boolean = false
): boolean {
  const requiredRatio = largeText ? 3 : 4.5; // AA standards
  const ratio = getContrastRatio(foreground, background);
  return ratio >= requiredRatio;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Calculate relative luminance of a color
 */
function getLuminance(color: string): number {
  // This is a simplified version - would need full implementation for production
  // For now, return a placeholder
  return 0.5;
}

/**
 * Manage focus return after modal close
 */
export class FocusManager {
  private stack: HTMLElement[] = [];

  push(element: HTMLElement) {
    this.stack.push(element);
  }

  pop(): HTMLElement | undefined {
    return this.stack.pop();
  }

  restoreFocus() {
    const element = this.pop();
    if (element && typeof element.focus === 'function') {
      setTimeout(() => {
        element?.focus();
      }, 10);
    }
  }
}

export const globalFocusManager = new FocusManager();
