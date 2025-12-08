export type AgentKind = 'planner' | 'execution' | 'evaluator' | 'coordinator';

export interface AgentTemplate {
	id: string;
	label: string;
	description: string;
	kind: AgentKind;
	pipelineId: string;
	allowedRepos: string[];
	autoEvaluateWithSAS: boolean;
	locked: boolean;
}
