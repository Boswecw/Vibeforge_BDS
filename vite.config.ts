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
					// Split Chart.js into its own chunk
					if (id.includes('chart.js')) {
						return 'vendor-chartjs';
					}
					// Split node_modules into vendor chunk
					if (id.includes('node_modules')) {
						return 'vendor';
					}
				}
			},
			// Tree-shaking optimizations
			treeshake: {
				moduleSideEffects: false,
				propertyReadSideEffects: false,
				unknownGlobalSideEffects: false
			}
		}
	}
});
