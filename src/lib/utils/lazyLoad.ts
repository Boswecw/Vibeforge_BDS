/**
 * Lazy Loading Utilities
 *
 * Provides helpers for code-splitting and lazy loading components
 * to improve initial load performance.
 */

import type { ComponentType } from "svelte";

/**
 * Lazy load a Svelte component
 * Returns a promise that resolves to the component
 *
 * @example
 * ```typescript
 * const LazyChart = await lazyLoad(() => import('$lib/components/Chart.svelte'));
 * ```
 */
export async function lazyLoad<T extends ComponentType>(
  componentLoader: () => Promise<{ default: T }>
): Promise<T> {
  const module = await componentLoader();
  return module.default;
}

/**
 * Create a lazy component wrapper that loads on first render
 * For use in Svelte 5, returns a function that can be called to get the component
 */
export function createLazyComponent<T extends ComponentType>(
  componentLoader: () => Promise<{ default: T }>
): () => Promise<T> {
  let cached: T | null = null;
  return async () => {
    if (!cached) {
      const module = await componentLoader();
      cached = module.default;
    }
    return cached;
  };
}

/**
 * Preload a component without rendering it
 * Useful for preloading components that will be needed soon
 *
 * @example
 * ```typescript
 * // Preload on hover
 * <button onmouseenter={() => preloadComponent(() => import('./HeavyModal.svelte'))}>
 *   Open Modal
 * </button>
 * ```
 */
export function preloadComponent(
  componentLoader: () => Promise<any>
): Promise<any> {
  return componentLoader();
}

/**
 * Lazy load multiple components in parallel
 * Returns when all components are loaded
 *
 * @example
 * ```typescript
 * await preloadComponents([
 *   () => import('./Chart.svelte'),
 *   () => import('./Table.svelte'),
 *   () => import('./Graph.svelte')
 * ]);
 * ```
 */
export async function preloadComponents(
  loaders: Array<() => Promise<any>>
): Promise<any[]> {
  return Promise.all(loaders.map((loader) => loader()));
}

/**
 * Lazy load a component with a custom loading fallback
 * Returns the loaded component after resolving
 *
 * @example
 * ```typescript
 * const HeavyComponent = await lazyLoadWithFallback(
 *   () => import('./HeavyComponent.svelte'),
 *   LoadingSpinner
 * );
 * ```
 */
export async function lazyLoadWithFallback<T extends ComponentType>(
  componentLoader: () => Promise<{ default: T }>,
  _fallbackComponent: ComponentType
): Promise<T> {
  // In Svelte 5, handle loading state in the parent component
  // The fallback is provided for API compatibility but loading
  // state should be handled declaratively in the template
  const module = await componentLoader();
  return module.default;
}

/**
 * Check if a module is already loaded (in cache)
 * Useful for avoiding redundant preloading
 */
export function isModuleLoaded(modulePath: string): boolean {
  // Check if the module is in Vite's module cache
  return (
    typeof window !== "undefined" &&
    !!(window as any).__vite_module_cache?.[modulePath]
  );
}

/**
 * Preload images for better UX
 *
 * @example
 * ```typescript
 * await preloadImages([
 *   '/images/hero.jpg',
 *   '/images/logo.png'
 * ]);
 * ```
 */
export async function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = url;
        })
    )
  );
}

/**
 * Intersection Observer based lazy loader
 * Loads a component when it enters the viewport
 *
 * @example
 * ```svelte
 * <script>
 *   let containerEl;
 *
 *   onMount(() => {
 *     lazyLoadOnVisible(
 *       containerEl,
 *       () => import('./BelowFoldComponent.svelte'),
 *       (Component) => {
 *         new Component({ target: containerEl });
 *       }
 *     );
 *   });
 * </script>
 *
 * <div bind:this={containerEl}>Loading...</div>
 * ```
 */
export function lazyLoadOnVisible(
  element: HTMLElement,
  componentLoader: () => Promise<any>,
  onLoad: (Component: any) => void,
  options: IntersectionObserverInit = {}
): () => void {
  if (!element || typeof IntersectionObserver === "undefined") {
    // Fallback: load immediately if IntersectionObserver not supported
    componentLoader().then((module) => onLoad(module.default));
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        componentLoader().then((module) => {
          onLoad(module.default);
          observer.disconnect();
        });
      }
    });
  }, options);

  observer.observe(element);

  // Return cleanup function
  return () => observer.disconnect();
}

/**
 * Preload route data and components on link hover
 * Improves perceived performance for navigation
 *
 * @example
 * ```svelte
 * <a
 *   href="/dashboard"
 *   use:prefetchOnHover={{
 *     components: [() => import('./Dashboard.svelte')],
 *     data: () => fetch('/api/dashboard').then(r => r.json())
 *   }}
 * >
 *   Dashboard
 * </a>
 * ```
 */
export function prefetchOnHover(
  node: HTMLElement,
  options: {
    components?: Array<() => Promise<any>>;
    data?: () => Promise<any>;
    delay?: number;
  }
): { destroy: () => void } {
  const { components = [], data, delay = 100 } = options;
  let timeoutId: NodeJS.Timeout;
  let prefetched = false;

  function handleMouseEnter() {
    if (prefetched) return;

    timeoutId = setTimeout(() => {
      prefetched = true;

      // Preload components
      if (components.length > 0) {
        preloadComponents(components);
      }

      // Prefetch data
      if (data) {
        data();
      }
    }, delay);
  }

  function handleMouseLeave() {
    clearTimeout(timeoutId);
  }

  node.addEventListener("mouseenter", handleMouseEnter);
  node.addEventListener("mouseleave", handleMouseLeave);

  return {
    destroy() {
      clearTimeout(timeoutId);
      node.removeEventListener("mouseenter", handleMouseEnter);
      node.removeEventListener("mouseleave", handleMouseLeave);
    },
  };
}

/**
 * Dynamic import with retry logic
 * Useful for flaky network conditions
 *
 * @example
 * ```typescript
 * const Component = await importWithRetry(
 *   () => import('./Component.svelte'),
 *   3  // retry 3 times
 * );
 * ```
 */
export async function importWithRetry<T>(
  importFn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await importFn();
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
    }
  }
  throw new Error("Import failed after retries");
}
