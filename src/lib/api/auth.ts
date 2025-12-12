const STORAGE_KEY = 'forge_auth_tokens';

// Check if we're running in Tauri (desktop) or browser
function isTauriEnvironment(): boolean {
	return typeof window !== 'undefined' && '__TAURI__' in window;
}

// Lazy load Tauri invoke function
async function getTauriInvoke() {
	if (isTauriEnvironment()) {
		try {
			const tauriCore = await import('@tauri-apps/api/core');
			return tauriCore.invoke;
		} catch {
			return null;
		}
	}
	return null;
}

export class TokenManager {
	private accessToken: string | null = null;
	private refreshToken: string | null = null;
	private expiresAt: number | null = null;

	constructor() {
		// Auto-initialize on construction
		this.initialize().catch((err) => console.warn('TokenManager init failed:', err));
	}

	async initialize(): Promise<void> {
		try {
			// Only run in browser environment
			if (typeof window === 'undefined') return;

			const invoke = await getTauriInvoke();
			if (invoke) {
				// Tauri desktop app - use secure storage
				const stored = await invoke<{
					accessToken: string;
					refreshToken: string;
					expiresAt: string;
				} | null>('load_tokens');
				if (stored) {
					this.accessToken = stored.accessToken;
					this.refreshToken = stored.refreshToken;
					this.expiresAt = new Date(stored.expiresAt).getTime();
				}
			} else {
				// Browser - use localStorage
				const stored = localStorage.getItem(STORAGE_KEY);
				if (stored) {
					const data = JSON.parse(stored);
					this.accessToken = data.accessToken;
					this.refreshToken = data.refreshToken;
					this.expiresAt = new Date(data.expiresAt).getTime();
				}
			}
		} catch (err) {
			console.warn('Token load failed:', err);
		}
	}

	async setTokens(
		accessToken: string,
		refreshToken: string,
		expiresAt: string
	): Promise<void> {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.expiresAt = new Date(expiresAt).getTime();

		// Only persist in browser environment
		if (typeof window === 'undefined') return;

		try {
			const invoke = await getTauriInvoke();
			if (invoke) {
				// Tauri desktop app - use secure storage
				await invoke('save_tokens', { accessToken, refreshToken, expiresAt });
			} else {
				// Browser - use localStorage
				localStorage.setItem(
					STORAGE_KEY,
					JSON.stringify({ accessToken, refreshToken, expiresAt })
				);
			}
		} catch (err) {
			console.error('Token save failed:', err);
			throw err;
		}
	}

	async clearTokens(): Promise<void> {
		this.accessToken = null;
		this.refreshToken = null;
		this.expiresAt = null;

		// Only persist in browser environment
		if (typeof window === 'undefined') return;

		try {
			const invoke = await getTauriInvoke();
			if (invoke) {
				// Tauri desktop app
				await invoke('clear_tokens');
			} else {
				// Browser
				localStorage.removeItem(STORAGE_KEY);
			}
		} catch (err) {
			console.warn('Token clear failed:', err);
		}
	}

	getAccessToken(): string | null {
		if (this.expiresAt && Date.now() >= this.expiresAt - 60000) return null;
		return this.accessToken;
	}

	getRefreshToken(): string | null {
		return this.refreshToken;
	}

	isAuthenticated(): boolean {
		return !!this.getAccessToken();
	}

	isExpiringSoon(): boolean {
		if (!this.expiresAt) return true;
		return Date.now() >= this.expiresAt - 300000;
	}
}

export const tokenManager = new TokenManager();
