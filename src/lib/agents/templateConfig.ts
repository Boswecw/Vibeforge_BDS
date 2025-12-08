import type { AgentTemplate } from './types';
import { AGENT_TEMPLATES } from './templates';

// In-memory config facade; replace with Tauri-backed persistence later.
export function getTemplates(): AgentTemplate[] {
	return [
		...AGENT_TEMPLATES.planner,
		...AGENT_TEMPLATES.execution,
		...AGENT_TEMPLATES.evaluator,
		...AGENT_TEMPLATES.coordinator
	];
}

export function updateTemplate(_template: AgentTemplate) {
	// TODO: persist to JSON/YAML via Tauri config
	console.warn('Template updates are in-memory only in the BDS local variant.');
}
