// Backend base URLs for BDS variant (local-only). Adjust via env or settings as needed.
// Prefers Vite env vars; falls back to localhost defaults.
import { tokenManager } from "$lib/api/auth";

export const FORGE_AGENTS_BASE_URL =
  (import.meta.env?.VITE_FORGE_AGENTS_BASE_URL as string) ??
  "http://localhost:8787";
export const DATAFORGE_BASE_URL =
  (import.meta.env?.VITE_DATAFORGE_BASE_URL as string) ??
  "http://localhost:8788";
export const NEUROFORGE_BASE_URL =
  (import.meta.env?.VITE_NEUROFORGE_BASE_URL as string) ??
  "http://localhost:8000";

export interface BackendConfig {
  forgeAgentsBaseUrl: string;
  dataForgeBaseUrl: string;
  neuroForgeBaseUrl: string;
  getAuthHeaders: () => Record<string, string>;
}

export const backendConfig: BackendConfig = {
  forgeAgentsBaseUrl: FORGE_AGENTS_BASE_URL,
  dataForgeBaseUrl: DATAFORGE_BASE_URL,
  neuroForgeBaseUrl: NEUROFORGE_BASE_URL,
  // Use TokenManager for secure token retrieval (Tauri desktop or browser fallback)
  getAuthHeaders: () => {
    const token = tokenManager.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
