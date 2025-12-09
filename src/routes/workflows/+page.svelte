<script lang="ts">
	import { Panel, Badge, Button, Input, Select, Alert } from '$lib/components';
	import { skillRegistry } from '$lib/api/skillRegistry';
	import { onMount } from 'svelte';
	import type { Skill } from '$lib/api/types';

	interface WorkflowStep {
		id: string;
		skillId: string;
		skillName: string;
		order: number;
		inputs: Record<string, any>;
		useOutputFrom?: string; // Previous step ID
	}

	interface Workflow {
		id: string;
		name: string;
		description: string;
		steps: WorkflowStep[];
		createdAt: Date;
		lastRun?: Date;
		status: 'draft' | 'active' | 'archived';
	}

	// State
	let workflows = $state<Workflow[]>([]);
	let skills = $state<Skill[]>([]);
	let loading = $state(true);
	let selectedWorkflow = $state<Workflow | null>(null);
	let isCreatingWorkflow = $state(false);
	let newWorkflowName = $state('');
	let newWorkflowDescription = $state('');

	// Load data
	onMount(async () => {
		try {
			skills = await skillRegistry.getAllSkills();
			loadWorkflows();
			loading = false;
		} catch (err) {
			console.error('Failed to load data:', err);
			loading = false;
		}
	});

	function loadWorkflows() {
		const stored = localStorage.getItem('workflows');
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				workflows = parsed.map((w: any) => ({
					...w,
					createdAt: new Date(w.createdAt),
					lastRun: w.lastRun ? new Date(w.lastRun) : undefined
				}));
			} catch (err) {
				console.error('Failed to parse workflows:', err);
				workflows = [];
			}
		}
	}

	function saveWorkflows() {
		localStorage.setItem('workflows', JSON.stringify(workflows));
	}

	function createWorkflow() {
		if (!newWorkflowName.trim()) return;

		const newWorkflow: Workflow = {
			id: `wf-${Date.now()}`,
			name: newWorkflowName,
			description: newWorkflowDescription,
			steps: [],
			createdAt: new Date(),
			status: 'draft'
		};

		workflows = [...workflows, newWorkflow];
		saveWorkflows();

		selectedWorkflow = newWorkflow;
		isCreatingWorkflow = false;
		newWorkflowName = '';
		newWorkflowDescription = '';
	}

	function deleteWorkflow(workflowId: string) {
		workflows = workflows.filter((w) => w.id !== workflowId);
		saveWorkflows();
		if (selectedWorkflow?.id === workflowId) {
			selectedWorkflow = null;
		}
	}

	function addStep(workflowId: string, skillId: string) {
		const skill = skills.find((s) => s.id === skillId);
		if (!skill) return;

		workflows = workflows.map((w) => {
			if (w.id === workflowId) {
				const newStep: WorkflowStep = {
					id: `step-${Date.now()}`,
					skillId: skill.id,
					skillName: skill.name,
					order: w.steps.length + 1,
					inputs: {}
				};
				return {
					...w,
					steps: [...w.steps, newStep]
				};
			}
			return w;
		});

		saveWorkflows();
		selectedWorkflow = workflows.find((w) => w.id === workflowId) || null;
	}

	function removeStep(workflowId: string, stepId: string) {
		workflows = workflows.map((w) => {
			if (w.id === workflowId) {
				return {
					...w,
					steps: w.steps.filter((s) => s.id !== stepId).map((s, i) => ({ ...s, order: i + 1 }))
				};
			}
			return w;
		});

		saveWorkflows();
		selectedWorkflow = workflows.find((w) => w.id === workflowId) || null;
	}

	function getStatusVariant(status: Workflow['status']) {
		const variants = {
			draft: 'default' as const,
			active: 'success' as const,
			archived: 'warning' as const
		};
		return variants[status];
	}

	let stats = $derived.by(() => ({
		total: workflows.length,
		draft: workflows.filter((w) => w.status === 'draft').length,
		active: workflows.filter((w) => w.status === 'active').length,
		archived: workflows.filter((w) => w.status === 'archived').length
	}));
</script>

<div class="workflows-container">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">Skill Workflows</h1>
			<p class="page-description">
				Build multi-step workflows by chaining skills together for complex automation
			</p>
		</div>

		<div class="stats-row">
			<div class="stat-item">
				<span class="stat-value">{stats.total}</span>
				<span class="stat-label">Total</span>
			</div>
			<div class="stat-item">
				<span class="stat-value default">{stats.draft}</span>
				<span class="stat-label">Draft</span>
			</div>
			<div class="stat-item">
				<span class="stat-value success">{stats.active}</span>
				<span class="stat-label">Active</span>
			</div>
			<div class="stat-item">
				<span class="stat-value warning">{stats.archived}</span>
				<span class="stat-label">Archived</span>
			</div>
		</div>
	</div>

	<!-- Coming Soon Alert -->
	<Alert variant="info" title="Workflow Builder Coming Soon">
		The visual workflow builder is under development. You can create and manage workflows by
		chaining multiple skills together. This feature will support:
		<ul>
			<li>Drag-and-drop workflow building</li>
			<li>Conditional branching and loops</li>
			<li>Data passing between skills</li>
			<li>Workflow templates and sharing</li>
			<li>Execution scheduling and monitoring</li>
		</ul>
	</Alert>

	<!-- Main Content -->
	<div class="content-grid">
		<!-- Workflows List -->
		<Panel variant="bordered" padding="lg">
			<div class="section-header">
				<h2>My Workflows</h2>
				<Button
					variant="primary"
					size="sm"
					on:click={() => (isCreatingWorkflow = true)}
					disabled={isCreatingWorkflow}
				>
					+ New Workflow
				</Button>
			</div>

			{#if isCreatingWorkflow}
				<Panel variant="elevated" padding="md">
					<div class="create-workflow-form">
						<Input
							label="Workflow Name"
							bind:value={newWorkflowName}
							placeholder="e.g., Code Review & Test"
							required
							fullWidth
						/>
						<Input
							label="Description"
							bind:value={newWorkflowDescription}
							placeholder="Describe what this workflow does..."
							fullWidth
						/>
						<div class="form-actions">
							<Button variant="primary" on:click={createWorkflow} disabled={!newWorkflowName.trim()}>
								Create
							</Button>
							<Button variant="ghost" on:click={() => (isCreatingWorkflow = false)}>
								Cancel
							</Button>
						</div>
					</div>
				</Panel>
			{/if}

			{#if workflows.length === 0}
				<div class="empty-state">
					<p>No workflows yet. Create your first workflow to get started.</p>
				</div>
			{:else}
				<div class="workflows-list">
					{#each workflows as workflow (workflow.id)}
						<div
							class="workflow-item"
							class:selected={selectedWorkflow?.id === workflow.id}
							onclick={() => (selectedWorkflow = workflow)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									selectedWorkflow = workflow;
								}
							}}
							role="button"
							tabindex="0"
						>
							<div class="workflow-info">
								<div class="workflow-name">{workflow.name}</div>
								<div class="workflow-description">{workflow.description || 'No description'}</div>
								<div class="workflow-meta">
									<Badge variant={getStatusVariant(workflow.status)} size="sm">
										{workflow.status}
									</Badge>
									<span class="workflow-steps">{workflow.steps.length} steps</span>
								</div>
							</div>
							<Button
								variant="danger"
								size="sm"
								on:click={(e) => {
									e.stopPropagation();
									deleteWorkflow(workflow.id);
								}}
							>
								Delete
							</Button>
						</div>
					{/each}
				</div>
			{/if}
		</Panel>

		<!-- Workflow Details/Builder -->
		<Panel variant="bordered" padding="lg">
			{#if selectedWorkflow}
				<div class="workflow-builder">
					<div class="builder-header">
						<h2>{selectedWorkflow.name}</h2>
						<Badge variant={getStatusVariant(selectedWorkflow.status)} size="sm">
							{selectedWorkflow.status}
						</Badge>
					</div>

					<p class="builder-description">
						{selectedWorkflow.description || 'No description provided'}
					</p>

					<!-- Steps -->
					<div class="steps-section">
						<h3>Workflow Steps</h3>

						{#if selectedWorkflow.steps.length === 0}
							<div class="empty-state">
								<p>No steps added yet. Add skills below to build your workflow.</p>
							</div>
						{:else}
							<div class="steps-list">
								{#each selectedWorkflow.steps as step, index (step.id)}
									<div class="step-card">
										<div class="step-number">{index + 1}</div>
										<div class="step-content">
											<div class="step-name">{step.skillName}</div>
											<code class="step-id">{step.skillId}</code>
										</div>
										<Button
											variant="ghost"
											size="sm"
											on:click={() => removeStep(selectedWorkflow.id, step.id)}
										>
											Remove
										</Button>
									</div>
									{#if index < selectedWorkflow.steps.length - 1}
										<div class="step-connector">↓</div>
									{/if}
								{/each}
							</div>
						{/if}
					</div>

					<!-- Add Step -->
					<div class="add-step-section">
						<h3>Add Step</h3>
						<div class="add-step-form">
							<Select
								options={skills.map((s) => ({ value: s.id, label: s.name }))}
								placeholder="Select a skill to add..."
								fullWidth
								on:change={(e) => {
									const skillId = (e.target as HTMLSelectElement).value;
									if (skillId) {
										addStep(selectedWorkflow.id, skillId);
										(e.target as HTMLSelectElement).value = '';
									}
								}}
							/>
						</div>
					</div>
				</div>
			{:else}
				<div class="no-selection">
					<p>Select a workflow from the list to view and edit its steps.</p>
				</div>
			{/if}
		</Panel>
	</div>
</div>

<style>
	/* ═══════════════════════════════════════════════════════════════════════
     Workflows Container
     ═══════════════════════════════════════════════════════════════════════ */

	.workflows-container {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	/* Page Header */
	.page-header {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.header-content {
		flex: 1;
	}

	.page-title {
		font-family: var(--font-family-heading);
		font-size: 2.5rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-sm) 0;
		letter-spacing: 0.02em;
	}

	.page-description {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.stats-row {
		display: flex;
		gap: var(--spacing-xl);
		flex-wrap: wrap;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 600;
		color: var(--color-text-primary);
		font-family: var(--font-family-mono);
	}

	.stat-value.default {
		color: var(--color-cool-gray);
	}

	.stat-value.success {
		color: var(--color-success);
	}

	.stat-value.warning {
		color: var(--color-warning);
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Content Grid */
	.content-grid {
		display: grid;
		grid-template-columns: 400px 1fr;
		gap: var(--spacing-xl);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-lg);
	}

	h2 {
		font-family: var(--font-family-heading);
		font-size: 1.5rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0;
		letter-spacing: 0.02em;
	}

	h3 {
		font-family: var(--font-family-heading);
		font-size: 1.125rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-md) 0;
		letter-spacing: 0.02em;
	}

	/* Create Workflow Form */
	.create-workflow-form {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.form-actions {
		display: flex;
		gap: var(--spacing-md);
	}

	/* Empty State */
	.empty-state {
		padding: var(--spacing-xl);
		text-align: center;
		color: var(--color-text-secondary);
	}

	/* Workflows List */
	.workflows-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.workflow-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		background-color: var(--color-surface-3);
		border: 2px solid transparent;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.workflow-item:hover {
		background-color: var(--color-surface-elevated);
		border-color: var(--color-border-default);
	}

	.workflow-item.selected {
		border-color: var(--color-brass);
		background-color: var(--color-surface-elevated);
	}

	.workflow-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		flex: 1;
	}

	.workflow-name {
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.workflow-description {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.workflow-meta {
		display: flex;
		gap: var(--spacing-sm);
		align-items: center;
	}

	.workflow-steps {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
	}

	/* Workflow Builder */
	.workflow-builder {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	.builder-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.builder-description {
		color: var(--color-text-secondary);
		margin: 0;
	}

	.steps-section,
	.add-step-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.steps-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.step-card {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		background-color: var(--color-surface-3);
		border-radius: var(--radius-md);
	}

	.step-number {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-brass);
		color: var(--color-midnight);
		border-radius: 50%;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.step-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		flex: 1;
	}

	.step-name {
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.step-id {
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
	}

	.step-connector {
		text-align: center;
		color: var(--color-brass);
		font-size: 1.5rem;
		padding: var(--spacing-xs) 0;
	}

	.no-selection {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		color: var(--color-text-secondary);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.page-title {
			font-size: 2rem;
		}

		.stats-row {
			flex-direction: column;
			gap: var(--spacing-md);
		}

		.content-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
