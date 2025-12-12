import { tokenManager } from './auth';
import {
	classifyError,
	createAuthenticationError,
	createNetworkError,
	shouldRetry,
	getRetryDelay,
	type AppError
} from '$lib/utils/errors';
import type {
	AuthResponse,
	ListSkillsResponse,
	SkillInvocationRequest,
	SkillInvocationResponse
} from './types';

export class ForgeAgentsClient {
	private baseUrl: string;
	private refreshPromise: Promise<void> | null = null;
	private maxRetries: number = 3;
	private timeout: number = 30000; // 30 seconds

	constructor(baseUrl: string = 'http://localhost:8787') {
		this.baseUrl = baseUrl;
	}

	/**
	 * Retry wrapper for fetch operations
	 */
	private async retryFetch<T>(
		operation: () => Promise<T>,
		context: string
	): Promise<T> {
		let lastError: AppError | null = null;

		for (let attempt = 0; attempt < this.maxRetries; attempt++) {
			try {
				return await operation();
			} catch (error) {
				const appError = classifyError(error);
				lastError = appError;

				// Check if we should retry
				if (!shouldRetry(appError, attempt, this.maxRetries)) {
					throw appError;
				}

				// Wait before retrying
				const delay = getRetryDelay(appError, attempt);
				await new Promise(resolve => setTimeout(resolve, delay));
			}
		}

		// All retries exhausted
		throw lastError || createNetworkError(`${context} failed after ${this.maxRetries} attempts`);
	}

	/**
	 * Fetch with timeout support
	 */
	private async fetchWithTimeout(
		url: string,
		options: RequestInit = {}
	): Promise<Response> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		// Log request
		console.log('[ForgeAgents API] Request:', {
			method: options.method || 'GET',
			url,
			headers: options.headers,
			hasBody: !!options.body
		});

		try {
			const startTime = Date.now();
			const response = await fetch(url, {
				...options,
				signal: controller.signal
			});

			const duration = Date.now() - startTime;

			// Log response
			console.log('[ForgeAgents API] Response:', {
				method: options.method || 'GET',
				url,
				status: response.status,
				statusText: response.statusText,
				duration: `${duration}ms`,
				ok: response.ok
			});

			return response;
		} catch (error: any) {
			console.error('[ForgeAgents API] Error:', {
				method: options.method || 'GET',
				url,
				error: error.message || error
			});

			if (error.name === 'AbortError') {
				throw createNetworkError('Request timeout', `Request to ${url} timed out after ${this.timeout}ms`);
			}
			throw error;
		} finally {
			clearTimeout(timeoutId);
		}
	}

	async login(email: string, password: string): Promise<AuthResponse> {
		return this.retryFetch(async () => {
			try {
				const response = await this.fetchWithTimeout(`${this.baseUrl}/api/v1/auth/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password })
				});

				if (!response.ok) {
					const appError = classifyError(response);
					await tokenManager.clearTokens();
					throw appError;
				}

				const data = await response.json();
				await tokenManager.setTokens(data.access_token, data.refresh_token, data.expires_at);
				return data;
			} catch (err) {
				await tokenManager.clearTokens();
				throw classifyError(err);
			}
		}, 'Login');
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
	): AsyncGenerator<{type: 'token' | 'metadata' | 'error', data: any}> {
		let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

		try {
			const response = await this.fetchWithTimeout(
				`${this.baseUrl}/api/v1/bds/skills/${skillId}/invoke?stream=true`,
				{
					method: 'POST',
					headers: this.getAuthHeaders(),
					body: JSON.stringify(request)
				}
			);

			if (!response.ok) {
				throw classifyError(response);
			}

			if (!response.body) {
				throw createNetworkError('No response body', 'Streaming response has no body');
			}

			reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = '';

			while (true) {
				const { done, value } = await reader.read();

				if (done) {
					// Process any remaining data in buffer
					if (buffer.trim()) {
						const lines = buffer.split('\n');
						for (const line of lines) {
							const trimmed = line.trim();
							if (trimmed.startsWith('data: ')) {
								const jsonStr = trimmed.substring(6);
								try {
									const parsed = JSON.parse(jsonStr);
									if (parsed.token) {
										yield { type: 'token', data: parsed };
									} else if (parsed.metadata) {
										yield { type: 'metadata', data: parsed.metadata };
									}
								} catch (e) {
									console.warn('Failed to parse SSE data:', jsonStr);
								}
							}
						}
					}
					break;
				}

				// Add to buffer
				buffer += decoder.decode(value, { stream: true });

				// Process complete lines
				const lines = buffer.split('\n');
				buffer = lines.pop() || ''; // Keep incomplete line in buffer

				for (const line of lines) {
					const trimmed = line.trim();
					if (trimmed.startsWith('data: ')) {
						const jsonStr = trimmed.substring(6); // Remove "data: " prefix
						try {
							const parsed = JSON.parse(jsonStr);

							// Check what type of message this is
							if (parsed.token !== undefined) {
								// Token message
								yield { type: 'token', data: parsed };
							} else if (parsed.metadata) {
								// Metadata message (final)
								yield { type: 'metadata', data: parsed.metadata };
							} else if (parsed.error) {
								// Error message
								yield { type: 'error', data: parsed.error };
							}
						} catch (e) {
							console.warn('Failed to parse SSE data:', jsonStr, e);
						}
					}
				}
			}
		} catch (error) {
			throw classifyError(error);
		} finally {
			if (reader) {
				try {
					reader.releaseLock();
				} catch (e) {
					// Reader already released
				}
			}
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
		return this.retryFetch(async () => {
			try {
				const token = await this.getAuthToken();
				const response = await this.fetchWithTimeout(`${this.baseUrl}${path}`, {
					...options,
					headers: { ...this.getAuthHeaders(), ...(options.headers || {}) }
				});

				// Handle 401 - Try to refresh token once
				if (response.status === 401) {
					try {
						await this.refreshAccessToken();
						// Retry with new token (no retry wrapper to avoid double retry)
						const retryResponse = await this.fetchWithTimeout(`${this.baseUrl}${path}`, {
							...options,
							headers: { ...this.getAuthHeaders(), ...(options.headers || {}) }
						});

						if (!retryResponse.ok) {
							throw classifyError(retryResponse);
						}
						return retryResponse.json();
					} catch (err) {
						throw createAuthenticationError('Authentication failed after token refresh');
					}
				}

				if (!response.ok) {
					throw classifyError(response);
				}

				return response.json();
			} catch (error) {
				throw classifyError(error);
			}
		}, `API request to ${path}`);
	}
}

export const forgeAgentsClient = new ForgeAgentsClient();
