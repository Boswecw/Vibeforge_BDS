/**
 * Connectivity Store
 *
 * Manages online/offline state using Svelte 5 runes.
 */

// ═══════════════════════════════════════════════════════════════════════
// Connectivity Store State
// ═══════════════════════════════════════════════════════════════════════

const state = $state<{
	isOnline: boolean;
	wasOffline: boolean;
	lastOnlineAt: Date | null;
	lastOfflineAt: Date | null;
}>({
	isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
	wasOffline: false,
	lastOnlineAt: null,
	lastOfflineAt: null
});

// ═══════════════════════════════════════════════════════════════════════
// Event Handlers
// ═══════════════════════════════════════════════════════════════════════

function handleOnline(): void {
	state.wasOffline = !state.isOnline;
	state.isOnline = true;
	state.lastOnlineAt = new Date();

	console.log('[Connectivity] Online');
}

function handleOffline(): void {
	state.isOnline = false;
	state.lastOfflineAt = new Date();

	console.log('[Connectivity] Offline');
}

// ═══════════════════════════════════════════════════════════════════════
// Initialize Event Listeners (Browser Only)
// ═══════════════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
	window.addEventListener('online', handleOnline);
	window.addEventListener('offline', handleOffline);

	// Cleanup on page unload
	if (typeof window !== 'undefined') {
		window.addEventListener('beforeunload', () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		});
	}
}

// ═══════════════════════════════════════════════════════════════════════
// Connectivity Store
// ═══════════════════════════════════════════════════════════════════════

export const connectivityStore = {
	// Getters
	get isOnline() {
		return state.isOnline;
	},

	get isOffline() {
		return !state.isOnline;
	},

	get wasOffline() {
		return state.wasOffline;
	},

	get lastOnlineAt() {
		return state.lastOnlineAt;
	},

	get lastOfflineAt() {
		return state.lastOfflineAt;
	},

	get timeSinceLastOnline(): number | null {
		if (!state.lastOnlineAt) return null;
		return Date.now() - state.lastOnlineAt.getTime();
	},

	get timeSinceLastOffline(): number | null {
		if (!state.lastOfflineAt) return null;
		return Date.now() - state.lastOfflineAt.getTime();
	},

	// Actions
	clearOfflineFlag(): void {
		state.wasOffline = false;
	},

	// Manual override (for testing)
	setOnline(online: boolean): void {
		if (online) {
			handleOnline();
		} else {
			handleOffline();
		}
	}
};
