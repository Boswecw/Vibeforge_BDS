import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,ts}'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			include: ['src/**/*.{js,ts,svelte}'],
			exclude: [
				'src/**/*.{test,spec}.{js,ts}',
				'src/**/*.d.ts',
				'src/routes/**/+*.{js,ts}', // SvelteKit route files
				'node_modules/**',
				'.svelte-kit/**'
			],
			all: true,
			lines: 100,
			functions: 100,
			branches: 100,
			statements: 100
		},
		setupFiles: ['./src/lib/test/setup.ts']
	},
	resolve: {
		alias: {
			$lib: resolve(__dirname, './src/lib'),
			$app: resolve(__dirname, './.svelte-kit/runtime/app')
		}
	}
});
