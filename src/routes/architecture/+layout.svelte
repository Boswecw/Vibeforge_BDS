<script>
  import { page } from '$app/stores';
</script>

<div class="architecture-layout">
  <slot />
</div>

<style>
  .architecture-layout {
    width: 100%;
    min-height: 100vh;
    background: var(--color-midnight);
  }
</style>
