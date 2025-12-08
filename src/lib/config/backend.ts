// Backend base URLs for BDS variant (local-only). Adjust via env or settings as needed.
// TODO: surface these via environment variables or a settings panel.
export const FORGE_AGENTS_BASE_URL = 'http://localhost:8787'; // ForgeAgents / MAPO entrypoint
export const DATAFORGE_BASE_URL = 'http://localhost:8788'; // DataForge for SAS/evals/telemetry

export interface BackendConfig {
	forgeAgentsBaseUrl: string;
	dataForgeBaseUrl: string;
}

export const backendConfig: BackendConfig = {
	forgeAgentsBaseUrl: FORGE_AGENTS_BASE_URL,
	dataForgeBaseUrl: DATAFORGE_BASE_URL
};
