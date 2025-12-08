import { invoke } from '@tauri-apps/api/core';

export class TokenManager {
	private accessToken: string | null = null;
	private refreshToken: string | null = null;
	private expiresAt: number | null = null;

	async initialize(): Promise<void> {
		try {
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

		try {
			await invoke('save_tokens', { accessToken, refreshToken, expiresAt });
		} catch (err) {
			console.error('Token save failed:', err);
			throw err;
		}
	}

	async clearTokens(): Promise<void> {
		this.accessToken = null;
		this.refreshToken = null;
		this.expiresAt = null;
		try {
			await invoke('clear_tokens');
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
