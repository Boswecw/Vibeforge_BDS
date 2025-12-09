import type { AgentSessionDetail } from '$lib/stores/agentSessions';
import { getSASSectionsByTags } from '$lib/api/dataForgeClient';

export type SASEvaluationStatus = 'pass' | 'warn' | 'fail';

export interface SASEvaluationResult {
	sectionId: string;
	sectionTitle: string;
	status: SASEvaluationStatus;
	explanation: string;
}

export async function evaluateAgainstSAS(
	sessionDetail: AgentSessionDetail
): Promise<SASEvaluationResult[]> {
	const tags = inferTags(sessionDetail);
	const sections = await getSASSectionsByTags(tags);

	// TODO: replace with real comparison logic against session output.
	return sections.map((section) => ({
		sectionId: section.id,
		sectionTitle: section.title,
		status: 'warn',
		explanation: `Placeholder evaluation for tag(s) ${tags.join(', ') || 'none'}`
	}));
}

const inferTags = (sessionDetail: AgentSessionDetail) => {
	const tags: string[] = [];
	if (sessionDetail.kind === 'planner') tags.push('planning');
	if (sessionDetail.kind === 'execution') tags.push('execution');
	if (sessionDetail.kind === 'evaluator') tags.push('evaluation');
	if (sessionDetail.kind === 'coordinator') tags.push('coordination');
	return tags;
};
