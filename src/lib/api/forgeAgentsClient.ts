import { tokenManager } from './auth';
import type {
	AuthResponse,
	ListSkillsResponse,
	SkillInvocationRequest,
	SkillInvocationResponse
} from './types';

export class ForgeAgentsClient {
	private baseUrl: string;
	private refreshPromise: Promise<void> | null = null;

	constructor(baseUrl: string = 'http://localhost:8100') {
		this.baseUrl = baseUrl;
	}

	async login(email: string, password: string): Promise<AuthResponse> {
		try {
			const response = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});
			if (!response.ok) throw new Error(`Login failed: ${response.statusText}`);
			const data = await response.json();
			await tokenManager.setTokens(data.access_token, data.refresh_token, data.expires_at);
			return data;
		} catch (err) {
			await tokenManager.clearTokens();
			throw err;
		}
	}

	async logout(): Promise<void> {
		try {
			const token = tokenManager.getAccessToken();
			if (token) {
				await fetch(`${this.baseUrl}/api/v1/auth/logout`, {
					method: 'POST',
					headers: this.getAuthHeaders()
				});
			}
		} catch (err) {
			console.warn('Logout failed:', err);
		} finally {
			await tokenManager.clearTokens();
		}
	}

	async refreshAccessToken(): Promise<void> {
		if (this.refreshPromise) return this.refreshPromise;
		this.refreshPromise = this._performRefresh();
		try {
			await this.refreshPromise;
		} finally {
			this.refreshPromise = null;
		}
	}

	private async _performRefresh(): Promise<void> {
		const refreshToken = tokenManager.getRefreshToken();
		if (!refreshToken) throw new Error('No refresh token available');
		try {
			const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refresh_token: refreshToken })
			});
			if (!response.ok) {
				await tokenManager.clearTokens();
				throw new Error('Token refresh failed');
			}
			const data = await response.json();
			await tokenManager.setTokens(data.access_token, data.refresh_token, data.expires_at);
		} catch (err) {
			await tokenManager.clearTokens();
			throw err;
		}
	}

	async listSkills(): Promise<ListSkillsResponse> {
		return this.authenticatedFetch<ListSkillsResponse>('/api/v1/bds/skills');
	}

	async getSkill(skillId: string): Promise<any> {
		return this.authenticatedFetch<any>(`/api/v1/bds/skills/${skillId}`);
	}

	async searchSkills(query: string): Promise<ListSkillsResponse> {
		return this.authenticatedFetch<ListSkillsResponse>(
			`/api/v1/bds/skills/search?query=${encodeURIComponent(query)}`
		);
	}

	async invokeSkill(
		skillId: string,
		request: SkillInvocationRequest
	): Promise<SkillInvocationResponse> {
		return this.authenticatedFetch<SkillInvocationResponse>(
			`/api/v1/bds/skills/${skillId}/invoke`,
			{
				method: 'POST',
				body: JSON.stringify(request)
			}
		);
	}

	async *invokeSkillStreaming(
		skillId: string,
		request: SkillInvocationRequest
	): AsyncGenerator<string> {
		const response = await fetch(
			`${this.baseUrl}/api/v1/bds/skills/${skillId}/invoke?stream=true`,
			{
				method: 'POST',
				headers: this.getAuthHeaders(),
				body: JSON.stringify(request)
			}
		);
		if (!response.ok) throw new Error(`Invocation failed: ${response.statusText}`);
		if (!response.body) throw new Error('No response body');

		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				yield decoder.decode(value);
			}
		} finally {
			reader.releaseLock();
		}
	}

	private async getAuthToken(): Promise<string> {
		let token = tokenManager.getAccessToken();
		if (!token) {
			if (tokenManager.isExpiringSoon()) {
				await this.refreshAccessToken();
				token = tokenManager.getAccessToken();
			}
			if (!token) throw new Error('Not authenticated');
		}
		return token;
	}

	private getAuthHeaders(): Record<string, string> {
		const token = tokenManager.getAccessToken();
		return {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {})
		};
	}

	private async authenticatedFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
		const token = await this.getAuthToken();
		const response = await fetch(`${this.baseUrl}${path}`, {
			...options,
			headers: { ...this.getAuthHeaders(), ...(options.headers || {}) }
		});

		if (response.status === 401) {
			try {
				await this.refreshAccessToken();
				return this.authenticatedFetch<T>(path, options);
			} catch (err) {
				throw new Error('Authentication failed');
			}
		}

		if (!response.ok) throw new Error(`API error: ${response.statusText}`);
		return response.json();
	}
}

export const forgeAgentsClient = new ForgeAgentsClient();
