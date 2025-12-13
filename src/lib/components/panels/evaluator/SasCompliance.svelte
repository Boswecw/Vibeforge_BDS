<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import { formatScore, getComplianceStatus } from '$lib/services/evaluatorService';
	import type { SasCompliance as SasComplianceType, ArchitecturePattern, NamingConvention, CodeStandard, ComplianceCategory } from '$lib/types/agents';

	interface Props {
		compliance: SasComplianceType | null;
	}

	let { compliance }: Props = $props();

	function getComplianceBadgeVariant(score: number | undefined): 'success' | 'warning' | 'danger' {
		const s = score ?? 0;
		if (s >= 0.9) return 'success';
		if (s >= 0.7) return 'warning';
		return 'danger';
	}

	function getStatusIcon(compliant: boolean | undefined): string {
		return compliant ? '✅' : '❌';
	}

	// Type guards for union types
	function isPatternArray(val: ArchitecturePattern[] | ComplianceCategory | undefined): val is ArchitecturePattern[] {
		return Array.isArray(val);
	}

	function isConventionArray(val: NamingConvention[] | ComplianceCategory | undefined): val is NamingConvention[] {
		return Array.isArray(val);
	}

	function isStandardArray(val: CodeStandard[] | ComplianceCategory | undefined): val is CodeStandard[] {
		return Array.isArray(val);
	}
</script>

<div class="sas-compliance">
	{#if compliance}
		<!-- Overall Compliance -->
		<div class="compliance-overview">
			<div class="overview-header">
				<h3>SAS Compliance Score</h3>
				<Badge variant={getComplianceBadgeVariant(compliance.overall_score)}>
					{formatScore(compliance.overall_score)}
				</Badge>
			</div>
			<div class="overview-status">
				<span class="status-label">Status:</span>
				<span class="status-value" class:compliant={getComplianceStatus(compliance.overall_score) === 'compliant'} class:partial={getComplianceStatus(compliance.overall_score) === 'partial'} class:non-compliant={getComplianceStatus(compliance.overall_score) === 'non-compliant'}>
					{getComplianceStatus(compliance.overall_score) === 'compliant'
						? 'Fully Compliant'
						: getComplianceStatus(compliance.overall_score) === 'partial'
							? 'Partially Compliant'
							: 'Non-Compliant'}
				</span>
			</div>
		</div>

		<!-- Architecture Patterns -->
		{#if compliance.architecture_patterns && isPatternArray(compliance.architecture_patterns)}
			<div class="compliance-section">
				<h4>Architecture Patterns</h4>
				<div class="patterns-list">
					{#each compliance.architecture_patterns as pattern}
						<div class="pattern-item">
							<div class="pattern-header">
								<span class="pattern-icon">{getStatusIcon(pattern.compliant)}</span>
								<span class="pattern-name">{pattern.pattern}</span>
								<Badge variant={pattern.compliant ? 'success' : 'danger'}>
									{pattern.compliant ? 'Compliant' : 'Non-Compliant'}
								</Badge>
							</div>
							{#if pattern.notes}
								<div class="pattern-notes">{pattern.notes}</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Naming Conventions -->
		{#if compliance.naming_conventions && isConventionArray(compliance.naming_conventions)}
			<div class="compliance-section">
				<h4>Naming Conventions</h4>
				<div class="conventions-grid">
					{#each compliance.naming_conventions as convention}
						<div class="convention-item">
							<div class="convention-header">
								<span class="convention-icon">{getStatusIcon(convention.compliant)}</span>
								<span class="convention-name">{convention.category}</span>
							</div>
							<div class="convention-score">
								{formatScore(convention.score)}
							</div>
							{#if convention.violations && convention.violations.length > 0}
								<div class="violations">
									<div class="violations-header">Violations ({convention.violations.length}):</div>
									<ul class="violations-list">
										{#each convention.violations.slice(0, 3) as violation}
											<li>{violation}</li>
										{/each}
										{#if convention.violations.length > 3}
											<li class="text-muted">+{convention.violations.length - 3} more</li>
										{/if}
									</ul>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- File Structure -->
		{#if compliance.file_structure}
			<div class="compliance-section">
				<h4>File Structure</h4>
				<div class="structure-card">
					<div class="structure-header">
						<span class="structure-icon">{getStatusIcon(compliance.file_structure.compliant ?? compliance.file_structure.passed)}</span>
						<Badge variant={(compliance.file_structure.compliant ?? compliance.file_structure.passed) ? 'success' : 'warning'}>
							{(compliance.file_structure.compliant ?? compliance.file_structure.passed) ? 'Compliant' : 'Issues Found'}
						</Badge>
					</div>
					{#if compliance.file_structure.issues && compliance.file_structure.issues.length > 0}
						<div class="structure-issues">
							<div class="issues-header">Issues:</div>
							<ul class="issues-list">
								{#each compliance.file_structure.issues as issue}
									<li>{issue}</li>
								{/each}
							</ul>
						</div>
					{/if}
					{#if compliance.file_structure.suggestions && compliance.file_structure.suggestions.length > 0}
						<div class="structure-suggestions">
							<div class="suggestions-header">Suggestions:</div>
							<ul class="suggestions-list">
								{#each compliance.file_structure.suggestions as suggestion}
									<li>{suggestion}</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Code Standards -->
		{#if compliance.code_standards && isStandardArray(compliance.code_standards)}
			<div class="compliance-section">
				<h4>Code Standards</h4>
				<div class="standards-grid">
					{#each compliance.code_standards as standard}
						<div class="standard-item">
							<div class="standard-header">
								<span class="standard-icon">{getStatusIcon(standard.compliant)}</span>
								<span class="standard-name">{standard.standard}</span>
							</div>
							<div class="standard-status">
								<Badge variant={standard.compliant ? 'success' : 'danger'}>
									{standard.compliant ? 'Pass' : 'Fail'}
								</Badge>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{:else}
		<div class="empty-state">
			<p class="text-muted">No compliance data available. Start an evaluation to see SAS compliance.</p>
		</div>
	{/if}
</div>

<style>
	.sas-compliance {
		padding: 1rem;
	}

	.compliance-overview {
		padding: 1.5rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		margin-bottom: 1.5rem;
	}

	.overview-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.overview-header h3 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.overview-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.status-label {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.status-value {
		font-size: 0.875rem;
		font-weight: 600;
	}

	.status-value.compliant {
		color: var(--color-success);
	}

	.status-value.partial {
		color: var(--color-warning);
	}

	.status-value.non-compliant {
		color: var(--color-danger);
	}

	.compliance-section {
		margin-bottom: 1.5rem;
	}

	.compliance-section h4 {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.75rem;
	}

	.patterns-list,
	.conventions-grid,
	.standards-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.pattern-item,
	.convention-item,
	.structure-card,
	.standard-item {
		padding: 1rem;
		background: var(--surface-2);
		border: 1px solid var(--border-color);
		border-radius: 6px;
	}

	.pattern-header,
	.convention-header,
	.structure-header,
	.standard-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.pattern-icon,
	.convention-icon,
	.structure-icon,
	.standard-icon {
		font-size: 1rem;
	}

	.pattern-name,
	.convention-name,
	.standard-name {
		flex: 1;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	.pattern-notes {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		margin-top: 0.5rem;
		padding-left: 1.5rem;
	}

	.convention-score {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	.violations,
	.structure-issues,
	.structure-suggestions {
		margin-top: 0.75rem;
		padding: 0.75rem;
		background: var(--surface-1);
		border-radius: 4px;
	}

	.violations-header,
	.issues-header,
	.suggestions-header {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.violations-list,
	.issues-list,
	.suggestions-list {
		margin: 0;
		padding-left: 1.25rem;
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.violations-list li,
	.issues-list li,
	.suggestions-list li {
		margin-bottom: 0.25rem;
	}

	.text-muted {
		color: var(--text-secondary);
		font-style: italic;
	}

	.standard-status {
		margin-top: 0.5rem;
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
	}

	@media (max-width: 768px) {
		.overview-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}
	}
</style>
