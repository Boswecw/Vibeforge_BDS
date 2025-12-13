import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

/**
 * Vitest configuration for integration tests
 * These tests require external services (ForgeAgents API on port 8787)
 *
 * Run with: pnpm test:integration
 */
export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.integration.test.{js,ts}"],
    testTimeout: 30000, // 30s timeout for network calls
    hookTimeout: 30000,
    setupFiles: ["./src/lib/test/setup.ts"],
  },
  resolve: {
    alias: {
      $lib: resolve(__dirname, "./src/lib"),
      $app: resolve(__dirname, "./.svelte-kit/runtime/app"),
    },
  },
});
