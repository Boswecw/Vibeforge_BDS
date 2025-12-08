// Backend base URLs for BDS variant (local-only). Adjust via env or settings as needed.
// Prefers Vite env vars; falls back to localhost defaults.
export const FORGE_AGENTS_BASE_URL =
	(import.meta.env?.VITE_FORGE_AGENTS_BASE_URL as string) ?? 'http://localhost:8787';
export const DATAFORGE_BASE_URL =
	(import.meta.env?.VITE_DATAFORGE_BASE_URL as string) ?? 'http://localhost:8788';

export interface BackendConfig {
	forgeAgentsBaseUrl: string;
	dataForgeBaseUrl: string;
	getAuthHeaders?: () => Record<string, string>;
}

export const backendConfig: BackendConfig = {
	forgeAgentsBaseUrl: FORGE_AGENTS_BASE_URL,
	dataForgeBaseUrl: DATAFORGE_BASE_URL,
	// TODO: Replace with real auth (e.g., session token or API key from secure storage)
	getAuthHeaders: () => {
		const token = localStorage.getItem('bdsAuthToken');
		return token ? { Authorization: `Bearer ${token}` } : {};
	}
};
