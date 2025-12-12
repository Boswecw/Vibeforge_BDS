import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss(),
		visualizer({
			filename: './bundle-stats.html',
			open: false,
			gzipSize: true,
			brotliSize: true
		})
	],
	server: {
		port: 4173
	},
	build: {
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
			}
		}
	}
});
