const AGENT_TEMPLATES = {
  planner: [
    {
      id: "planner.cross-repo.feature-plan",
      label: "Cross-Repo Feature Plan",
      description: "Generates a multi-repo implementation plan with PAORT steps.",
      kind: "planner",
      pipelineId: "nf.mapo.plan.cross_repo.v1",
      allowedRepos: ["vibeforge", "authorforge", "dataforge", "forgeagents"],
      autoEvaluateWithSAS: true,
      locked: true
    }
  ],
  execution: [
    {
      id: "execution.prompt.neuroforge",
      label: "Prompt Exec via NeuroForge",
      description: "Runs prompt executions through NeuroForge with safety and telemetry.",
      kind: "execution",
      pipelineId: "nf.mapo.prompt_exec.v1",
      allowedRepos: ["vibeforge", "authorforge"],
      autoEvaluateWithSAS: true,
      locked: false
    }
  ],
  evaluator: [
    {
      id: "evaluator.sas.compliance",
      label: "SAS Compliance Check",
      description: "Evaluates outputs against SAS sections and safety rules.",
      kind: "evaluator",
      pipelineId: "nf.mapo.eval.sas.v1",
      allowedRepos: ["vibeforge", "authorforge", "websafe"],
      autoEvaluateWithSAS: true,
      locked: true
    }
  ],
  coordinator: [
    {
      id: "coordinator.multi-app.provider-rollout",
      label: "Multi-App Provider API Rollout",
      description: "Coordinates provider rollout across VibeForge, AuthorForge, and WebSafe.",
      kind: "coordinator",
      pipelineId: "nf.mapo.coordinator.provider_rollout.v1",
      allowedRepos: ["vibeforge", "authorforge", "websafe", "dataforge"],
      autoEvaluateWithSAS: true,
      locked: true
    }
  ]
};
export {
  AGENT_TEMPLATES as A
};
