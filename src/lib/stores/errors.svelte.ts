/**
 * Global Error Store
 *
 * Manages application-wide error state using Svelte 5 runes.
 */

import type { AppError } from '$lib/utils/errors';
import { logError } from '$lib/utils/errors';

// ═══════════════════════════════════════════════════════════════════════
// Error Store State
// ═══════════════════════════════════════════════════════════════════════

interface ErrorState {
	errors: AppError[];
	lastError: AppError | null;
	dismissedErrors: Set<string>;
}

const state = $state<ErrorState>({
	errors: [],
	lastError: null,
	dismissedErrors: new Set()
});

// ═══════════════════════════════════════════════════════════════════════
// Error Store
// ═══════════════════════════════════════════════════════════════════════

export const errorStore = {
	// Getters
	get errors() {
		return state.errors.filter((e) => !state.dismissedErrors.has(e.id));
	},

	get lastError() {
		return state.lastError;
	},

	get hasErrors() {
		return state.errors.length > 0;
	},

	get criticalErrors() {
		return state.errors.filter((e) => e.severity === 'CRITICAL' && !state.dismissedErrors.has(e.id));
	},

	get highErrors() {
		return state.errors.filter((e) => e.severity === 'HIGH' && !state.dismissedErrors.has(e.id));
	},

	// Actions
	addError(error: AppError) {
		state.errors = [...state.errors, error];
		state.lastError = error;

		// Log error
		logError(error);

		// Auto-dismiss low severity errors after 5 seconds
		if (error.severity === 'LOW') {
			setTimeout(() => {
				this.dismissError(error.id);
			}, 5000);
		}

		// Keep only last 100 errors
		if (state.errors.length > 100) {
			state.errors = state.errors.slice(-100);
		}
	},

	dismissError(id: string) {
		state.dismissedErrors.add(id);
	},

	clearError(id: string) {
		state.errors = state.errors.filter((e) => e.id !== id);
		state.dismissedErrors.delete(id);

		if (state.lastError?.id === id) {
			state.lastError = state.errors[state.errors.length - 1] || null;
		}
	},

	clearAll() {
		state.errors = [];
		state.lastError = null;
		state.dismissedErrors.clear();
	},

	clearDismissed() {
		state.errors = state.errors.filter((e) => !state.dismissedErrors.has(e.id));
		state.dismissedErrors.clear();
	}
};
