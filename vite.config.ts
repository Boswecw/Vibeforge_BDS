import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { workboxPlugin } from './vite-plugin-workbox';

export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss(),
		visualizer({
			filename: './bundle-stats.html',
			open: false,
			gzipSize: true,
			brotliSize: true
		}),
		workboxPlugin()
	],
	server: {
		port: 4173
	},
	build: {
		// Minification settings
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true, // Remove console.logs in production
				drop_debugger: true,
				pure_funcs: ['console.log', 'console.info', 'console.debug']
			},
			format: {
				comments: false // Remove comments
			}
		},
		// Source maps for production debugging
		sourcemap: 'hidden',
		// Chunk size warnings
		chunkSizeWarningLimit: 500, // 500KB
		rollupOptions: {
			output: {
				manualChunks(id) {
					// Granular code splitting for better caching

					// Svelte framework (core + reactivity)
					if (id.includes('node_modules/svelte/') || id.includes('svelte/src/runtime')) {
						return 'vendor-svelte';
					}

					// SvelteKit router and framework
					if (id.includes('@sveltejs/kit')) {
						return 'vendor-sveltekit';
					}

					// Drag and drop library
					if (id.includes('@dnd-kit')) {
						return 'vendor-dnd';
					}

					// Tauri API (desktop integration)
					if (id.includes('@tauri-apps')) {
						return 'vendor-tauri';
					}

					// Fuzzy search library (command palette)
					if (id.includes('fuse.js')) {
						return 'vendor-fuse';
					}

					// Chart.js visualization library
					if (id.includes('chart.js')) {
						return 'vendor-chartjs';
					}

					// Workbox service worker library
					if (id.includes('workbox')) {
						return 'vendor-workbox';
					}

					// All other node_modules (should be small after above splits)
					if (id.includes('node_modules')) {
						return 'vendor-common';
					}
				},
				// Improve chunk naming for better caching
				chunkFileNames: (chunkInfo) => {
					const name = chunkInfo.name;
					// Use content hash for vendor chunks (better caching)
					if (name.startsWith('vendor-')) {
						return `_app/immutable/chunks/${name}.[hash].js`;
					}
					// Use sequential naming for app chunks
					return '_app/immutable/chunks/[name].[hash].js';
				}
			},
			// Tree-shaking optimizations
			treeshake: {
				moduleSideEffects: false,
				propertyReadSideEffects: false,
				unknownGlobalSideEffects: false
			}
		},
		// Target modern browsers for smaller bundles
		target: 'es2020',
		// CSS code splitting
		cssCodeSplit: true
	}
});
