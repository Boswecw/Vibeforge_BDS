import { backendConfig } from '../config/backend';
import type { EvaluationHistoryItem, SASSection } from './types';

const jsonHeaders = () => ({
	'Content-Type': 'application/json',
	...(backendConfig.getAuthHeaders ? backendConfig.getAuthHeaders() : {})
});

export async function getSASSectionsByTags(tags: string[]): Promise<SASSection[]> {
	const params = new URLSearchParams();
	tags.forEach((t) => params.append('tag', t));

	const res = await fetch(
		`${backendConfig.dataForgeBaseUrl}/sas/sections?${params.toString()}`,
		{ method: 'GET', headers: backendConfig.getAuthHeaders ? backendConfig.getAuthHeaders() : {} }
	);

	if (!res.ok) {
		throw new Error(`DataForge SAS request failed (${res.status}): ${await res.text()}`);
	}

	return (await res.json()) as SASSection[];
}

export async function getEvaluationHistory(entityId: string): Promise<EvaluationHistoryItem[]> {
	const res = await fetch(
		`${backendConfig.dataForgeBaseUrl}/evals/history/${encodeURIComponent(entityId)}`,
		{
			method: 'GET',
			headers: jsonHeaders()
		}
	);

	if (!res.ok) {
		throw new Error(`DataForge eval history request failed (${res.status}): ${await res.text()}`);
	}

	return (await res.json()) as EvaluationHistoryItem[];
}
