<script lang="ts">
	import { onMount } from 'svelte';
	import { skillRegistry } from '$lib/api/skillRegistry';
	import { forgeAgentsClient } from '$lib/api/client';
	import type { Skill } from '$lib/api/types';
	import { Panel, Input, Select, Button, Badge, Alert, Textarea } from '$lib/components';

	// Types
	interface TestCase {
		id: string;
		name: string;
		skillId: string;
		skillName: string;
		inputs: Record<string, any>;
		expectedOutput?: string;
		expectedPattern?: string; // Regex pattern
		executionOptions: {
			model: string;
			temperature: number;
			max_tokens: number;
		};
		createdAt: Date;
		lastRun?: Date;
		lastResult?: TestResult;
	}

	interface TestResult {
		passed: boolean;
		actualOutput: string;
		executionTime: number;
		error?: string;
		matchDetails?: string;
		timestamp: Date;
	}

	interface TestRun {
		id: string;
		testCaseId: string;
		result: TestResult;
		timestamp: Date;
	}

	// State
	let skills: Skill[] = $state([]);
	let testCases: TestCase[] = $state([]);
	let testHistory: TestRun[] = $state([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Test case builder
	let selectedSkillId = $state<string>('');
	let testName = $state('');
	let testInputs = $state<Record<string, any>>({});
	let expectedOutput = $state('');
	let expectedPattern = $state('');
	let usePattern = $state(false);
	let selectedModel = $state('gpt-4o-mini');
	let temperature = $state(0.7);
	let maxTokens = $state(4096);

	// Test execution
	let runningTestId = $state<string | null>(null);
	let selectedTestCase = $state<TestCase | null>(null);

	// View modes
	let viewMode = $state<'builder' | 'results'>('builder');

	// Derived
	let selectedSkill = $derived.by(() => {
		return skills.find((s) => s.id === selectedSkillId) || null;
	});

	let skillOptions = $derived.by(() => {
		return skills.map((s) => ({
			value: s.id,
			label: `${s.name} (${s.category})`
		}));
	});

	let stats = $derived.by(() => ({
		total: testCases.length,
		passed: testCases.filter((tc) => tc.lastResult?.passed === true).length,
		failed: testCases.filter((tc) => tc.lastResult?.passed === false).length,
		notRun: testCases.filter((tc) => !tc.lastResult).length
	}));

	const modelOptions = [
		{ value: 'gpt-4o', label: 'GPT-4o' },
		{ value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
		{ value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
		{ value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' }
	];

	// Lifecycle
	onMount(async () => {
		try {
			skills = await skillRegistry.getAllSkills();
			loadTestCases();
			loadTestHistory();
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load skills';
			loading = false;
		}
	});

	// Persistence
	function loadTestCases() {
		const saved = localStorage.getItem('vibeforge_test_cases');
		if (saved) {
			testCases = JSON.parse(saved, (key, value) => {
				if (key === 'createdAt' || key === 'lastRun' || key === 'timestamp') {
					return new Date(value);
				}
				return value;
			});
		}
	}

	function saveTestCases() {
		localStorage.setItem('vibeforge_test_cases', JSON.stringify(testCases));
	}

	function loadTestHistory() {
		const saved = localStorage.getItem('vibeforge_test_history');
		if (saved) {
			testHistory = JSON.parse(saved, (key, value) => {
				if (key === 'timestamp') {
					return new Date(value);
				}
				return value;
			});
		}
	}

	function saveTestHistory() {
		localStorage.setItem('vibeforge_test_history', JSON.stringify(testHistory));
	}

	// Test case management
	function createTestCase() {
		if (!selectedSkill || !testName.trim()) {
			error = 'Please select a skill and provide a test name';
			return;
		}

		const newTestCase: TestCase = {
			id: `test-${Date.now()}`,
			name: testName,
			skillId: selectedSkill.id,
			skillName: selectedSkill.name,
			inputs: { ...testInputs },
			expectedOutput: usePattern ? undefined : expectedOutput,
			expectedPattern: usePattern ? expectedPattern : undefined,
			executionOptions: {
				model: selectedModel,
				temperature,
				max_tokens: maxTokens
			},
			createdAt: new Date()
		};

		testCases = [...testCases, newTestCase];
		saveTestCases();

		// Reset form
		testName = '';
		testInputs = {};
		expectedOutput = '';
		expectedPattern = '';
		error = null;
	}

	function deleteTestCase(id: string) {
		testCases = testCases.filter((tc) => tc.id !== id);
		saveTestCases();

		// Also remove from history
		testHistory = testHistory.filter((th) => th.testCaseId !== id);
		saveTestHistory();
	}

	// Test execution
	async function runTest(testCase: TestCase) {
		runningTestId = testCase.id;
		error = null;

		const startTime = Date.now();

		try {
			const result = await forgeAgentsClient.invokeSkill(testCase.skillId, {
				inputs: testCase.inputs,
				options: testCase.executionOptions
			});

			const executionTime = Date.now() - startTime;
			const actualOutput = result.output;

			// Check if test passed
			let passed = false;
			let matchDetails = '';

			if (testCase.expectedPattern) {
				// Regex pattern matching
				const regex = new RegExp(testCase.expectedPattern, 'i');
				passed = regex.test(actualOutput);
				matchDetails = passed
					? `Output matched pattern: ${testCase.expectedPattern}`
					: `Output did not match pattern: ${testCase.expectedPattern}`;
			} else if (testCase.expectedOutput) {
				// Exact match (case-insensitive, trimmed)
				const expected = testCase.expectedOutput.trim().toLowerCase();
				const actual = actualOutput.trim().toLowerCase();
				passed = actual.includes(expected) || expected.includes(actual);
				matchDetails = passed
					? 'Output matched expected result'
					: 'Output did not match expected result';
			} else {
				// No assertion - just check for successful execution
				passed = true;
				matchDetails = 'No assertion defined - execution successful';
			}

			const testResult: TestResult = {
				passed,
				actualOutput,
				executionTime,
				matchDetails,
				timestamp: new Date()
			};

			// Update test case
			testCases = testCases.map((tc) => {
				if (tc.id === testCase.id) {
					return { ...tc, lastRun: new Date(), lastResult: testResult };
				}
				return tc;
			});
			saveTestCases();

			// Add to history
			const testRun: TestRun = {
				id: `run-${Date.now()}`,
				testCaseId: testCase.id,
				result: testResult,
				timestamp: new Date()
			};
			testHistory = [testRun, ...testHistory];
			saveTestHistory();
		} catch (err) {
			const testResult: TestResult = {
				passed: false,
				actualOutput: '',
				executionTime: Date.now() - startTime,
				error: err instanceof Error ? err.message : 'Execution failed',
				timestamp: new Date()
			};

			// Update test case
			testCases = testCases.map((tc) => {
				if (tc.id === testCase.id) {
					return { ...tc, lastRun: new Date(), lastResult: testResult };
				}
				return tc;
			});
			saveTestCases();
		} finally {
			runningTestId = null;
		}
	}

	async function runAllTests() {
		for (const testCase of testCases) {
			await runTest(testCase);
		}
	}

	// Input handling
	function updateTestInput(paramName: string, value: any) {
		testInputs = { ...testInputs, [paramName]: value };
	}

	// Clear history
	function clearHistory() {
		testHistory = [];
		saveTestHistory();
	}
</script>

<div class="testing-container">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">Skill Testing Lab</h1>
			<p class="page-description">
				Create, run, and manage automated tests for your skills
			</p>
		</div>

		<div class="stats-row">
			<div class="stat-item">
				<span class="stat-value">{stats.total}</span>
				<span class="stat-label">Total Tests</span>
			</div>
			<div class="stat-item">
				<span class="stat-value success">{stats.passed}</span>
				<span class="stat-label">Passed</span>
			</div>
			<div class="stat-item">
				<span class="stat-value error">{stats.failed}</span>
				<span class="stat-label">Failed</span>
			</div>
			<div class="stat-item">
				<span class="stat-value warning">{stats.notRun}</span>
				<span class="stat-label">Not Run</span>
			</div>
		</div>
	</div>

	<!-- View Mode Tabs -->
	<Panel variant="bordered" padding="md">
		<div class="view-tabs">
			<Button
				variant={viewMode === 'builder' ? 'primary' : 'ghost'}
				on:click={() => (viewMode = 'builder')}
			>
				Test Builder
			</Button>
			<Button
				variant={viewMode === 'results' ? 'primary' : 'ghost'}
				on:click={() => (viewMode = 'results')}
			>
				Test Results
			</Button>
		</div>
	</Panel>

	{#if error}
		<Alert variant="error" title="Error">
			{error}
		</Alert>
	{/if}

	{#if loading}
		<div class="loading-state">
			<div class="spinner"></div>
			<p>Loading skills...</p>
		</div>
	{:else if viewMode === 'builder'}
		<!-- Test Builder -->
		<div class="builder-layout">
			<!-- Left: Create Test -->
			<Panel variant="bordered" padding="lg">
				<div class="panel-section">
					<h2 class="section-title">Create Test Case</h2>

					<div class="form-section">
						<Input
							type="text"
							label="Test Name"
							bind:value={testName}
							placeholder="e.g., Test code generation for Python"
							required
							fullWidth
						/>

						<Select
							label="Skill to Test"
							bind:value={selectedSkillId}
							options={skillOptions}
							placeholder="Select a skill..."
							required
							fullWidth
						/>

						{#if selectedSkill}
							<div class="skill-info">
								<Badge variant="info" size="sm">{selectedSkill.category}</Badge>
								<p class="skill-description">{selectedSkill.description}</p>
							</div>

							<!-- Skill Inputs -->
							<div class="inputs-section">
								<h3 class="subsection-title">Test Inputs</h3>
								{#each Object.entries(selectedSkill.inputs) as [paramName, paramDef]}
									<div class="input-field">
										{#if paramDef.type === 'string'}
											<Textarea
												label={paramName}
												bind:value={testInputs[paramName]}
												helperText={paramDef.description}
												required={paramDef.required}
												fullWidth
											/>
										{:else if paramDef.type === 'number'}
											<Input
												type="number"
												label={paramName}
												bind:value={testInputs[paramName]}
												helperText={paramDef.description}
												required={paramDef.required}
												fullWidth
											/>
										{:else if paramDef.type === 'boolean'}
											<label class="checkbox-label">
												<input
													type="checkbox"
													bind:checked={testInputs[paramName]}
												/>
												<span>{paramName}</span>
												{#if paramDef.description}
													<span class="helper-text">{paramDef.description}</span>
												{/if}
											</label>
										{/if}
									</div>
								{/each}
							</div>

							<!-- Expected Output -->
							<div class="assertion-section">
								<h3 class="subsection-title">Assertion</h3>

								<label class="checkbox-label">
									<input type="checkbox" bind:checked={usePattern} />
									<span>Use regex pattern matching</span>
								</label>

								{#if usePattern}
									<Input
										type="text"
										label="Expected Pattern (Regex)"
										bind:value={expectedPattern}
										placeholder="e.g., function.*calculate"
										helperText="Regular expression to match against output"
										fullWidth
									/>
								{:else}
									<Textarea
										label="Expected Output"
										bind:value={expectedOutput}
										placeholder="Enter the expected output (or leave empty for no assertion)"
										helperText="Test will check if output contains this text"
										fullWidth
									/>
								{/if}
							</div>

							<!-- Execution Options -->
							<div class="options-section">
								<h3 class="subsection-title">Execution Options</h3>

								<Select
									label="Model"
									bind:value={selectedModel}
									options={modelOptions}
									fullWidth
								/>

								<Input
									type="number"
									label="Temperature"
									bind:value={temperature}
									min={0}
									max={2}
									step={0.1}
									fullWidth
								/>

								<Input
									type="number"
									label="Max Tokens"
									bind:value={maxTokens}
									min={1}
									max={32000}
									fullWidth
								/>
							</div>

							<Button variant="primary" fullWidth on:click={createTestCase}>
								Create Test Case
							</Button>
						{/if}
					</div>
				</div>
			</Panel>

			<!-- Right: Test Cases List -->
			<Panel variant="bordered" padding="lg">
				<div class="panel-section">
					<div class="section-header">
						<h2 class="section-title">Test Cases ({testCases.length})</h2>
						{#if testCases.length > 0}
							<Button variant="secondary" size="sm" on:click={runAllTests}>
								Run All Tests
							</Button>
						{/if}
					</div>

					{#if testCases.length === 0}
						<div class="empty-state">
							<p class="empty-message">No test cases created yet.</p>
							<p class="empty-hint">Create a test case on the left to get started.</p>
						</div>
					{:else}
						<div class="test-cases-list">
							{#each testCases as testCase (testCase.id)}
								<div class="test-case-card">
									<div class="test-case-header">
										<div class="test-info">
											<h3 class="test-name">{testCase.name}</h3>
											<div class="test-meta">
												<Badge variant="default" size="sm">{testCase.skillName}</Badge>
												{#if testCase.lastResult}
													<Badge
														variant={testCase.lastResult.passed ? 'success' : 'error'}
														size="sm"
													>
														{testCase.lastResult.passed ? '✓ Passed' : '✗ Failed'}
													</Badge>
												{:else}
													<Badge variant="warning" size="sm">Not Run</Badge>
												{/if}
											</div>
										</div>

										<div class="test-actions">
											<Button
												variant="primary"
												size="sm"
												loading={runningTestId === testCase.id}
												on:click={() => runTest(testCase)}
											>
												Run
											</Button>
											<Button
												variant="ghost"
												size="sm"
												on:click={() => deleteTestCase(testCase.id)}
											>
												Delete
											</Button>
										</div>
									</div>

									{#if testCase.lastResult}
										<div class="test-result">
											<div class="result-details">
												<span class="result-label">Execution Time:</span>
												<span class="result-value">{testCase.lastResult.executionTime}ms</span>
											</div>
											<div class="result-details">
												<span class="result-label">Match:</span>
												<span class="result-value">{testCase.lastResult.matchDetails}</span>
											</div>
											{#if testCase.lastResult.error}
												<div class="result-error">
													<span class="result-label">Error:</span>
													<span class="error-message">{testCase.lastResult.error}</span>
												</div>
											{/if}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</Panel>
		</div>
	{:else}
		<!-- Test Results -->
		<Panel variant="bordered" padding="lg">
			<div class="panel-section">
				<div class="section-header">
					<h2 class="section-title">Test History ({testHistory.length})</h2>
					{#if testHistory.length > 0}
						<Button variant="danger" size="sm" on:click={clearHistory}>Clear History</Button>
					{/if}
				</div>

				{#if testHistory.length === 0}
					<div class="empty-state">
						<p class="empty-message">No test results yet.</p>
						<p class="empty-hint">Run some tests to see results here.</p>
					</div>
				{:else}
					<div class="history-list">
						{#each testHistory as run (run.id)}
							{@const testCase = testCases.find((tc) => tc.id === run.testCaseId)}
							<div class="history-item">
								<div class="history-header">
									<div class="history-info">
										<h3 class="history-title">{testCase?.name || 'Unknown Test'}</h3>
										<div class="history-meta">
											<span class="timestamp"
												>{run.timestamp.toLocaleString('en-US', {
													dateStyle: 'short',
													timeStyle: 'medium'
												})}</span
											>
											<Badge variant={run.result.passed ? 'success' : 'error'} size="sm">
												{run.result.passed ? '✓ Passed' : '✗ Failed'}
											</Badge>
											<span class="execution-time">{run.result.executionTime}ms</span>
										</div>
									</div>
								</div>

								<div class="history-details">
									<div class="detail-row">
										<span class="detail-label">Match Details:</span>
										<span class="detail-value">{run.result.matchDetails}</span>
									</div>
									{#if run.result.error}
										<div class="detail-row error">
											<span class="detail-label">Error:</span>
											<span class="detail-value">{run.result.error}</span>
										</div>
									{/if}
									<div class="detail-row">
										<span class="detail-label">Output:</span>
										<pre class="output-preview">{run.result.actualOutput.slice(0, 200)}{run
												.result.actualOutput.length > 200
												? '...'
												: ''}</pre>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</Panel>
	{/if}
</div>

<style>
	/* ═══════════════════════════════════════════════════════════════════════
     Testing Container
     ═══════════════════════════════════════════════════════════════════════ */

	.testing-container {
		max-width: 1600px;
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

	.stat-value.success {
		color: var(--color-success);
	}

	.stat-value.error {
		color: var(--color-error);
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

	/* View Tabs */
	.view-tabs {
		display: flex;
		gap: var(--spacing-sm);
	}

	/* Loading State */
	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-lg);
		padding: var(--spacing-3xl) var(--spacing-xl);
		text-align: center;
	}

	.spinner {
		width: 48px;
		height: 48px;
		border: 4px solid var(--color-border-subtle);
		border-top-color: var(--color-brass);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Builder Layout */
	.builder-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-xl);
		align-items: start;
	}

	/* Panel Section */
	.panel-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-md);
	}

	.section-title {
		font-family: var(--font-family-heading);
		font-size: 1.5rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0;
		letter-spacing: 0.02em;
	}

	.subsection-title {
		font-family: var(--font-family-heading);
		font-size: 1.125rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-md) 0;
		letter-spacing: 0.02em;
	}

	/* Form Section */
	.form-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.skill-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		padding: var(--spacing-md);
		background-color: var(--color-surface-3);
		border-radius: var(--radius-md);
	}

	.skill-description {
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin: 0;
	}

	.inputs-section,
	.assertion-section,
	.options-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		background-color: var(--color-surface-3);
		border-radius: var(--radius-md);
	}

	.input-field {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.checkbox-label {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		font-size: 0.9375rem;
		color: var(--color-text-primary);
		cursor: pointer;
	}

	.checkbox-label input[type='checkbox'] {
		margin-right: var(--spacing-sm);
	}

	.helper-text {
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
		margin-left: var(--spacing-lg);
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-md);
		padding: var(--spacing-3xl) var(--spacing-xl);
		text-align: center;
	}

	.empty-message {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.empty-hint {
		font-size: 0.9375rem;
		color: var(--color-text-tertiary);
		margin: 0;
	}

	/* Test Cases List */
	.test-cases-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.test-case-card {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		background-color: var(--color-surface-3);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border-subtle);
	}

	.test-case-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--spacing-md);
	}

	.test-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.test-name {
		font-family: var(--font-family-heading);
		font-size: 1.125rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0;
		letter-spacing: 0.02em;
	}

	.test-meta {
		display: flex;
		gap: var(--spacing-xs);
		flex-wrap: wrap;
	}

	.test-actions {
		display: flex;
		gap: var(--spacing-sm);
	}

	.test-result {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		padding: var(--spacing-md);
		background-color: var(--color-surface-2);
		border-radius: var(--radius-sm);
	}

	.result-details {
		display: flex;
		gap: var(--spacing-sm);
		font-size: 0.875rem;
	}

	.result-label {
		color: var(--color-text-tertiary);
		font-weight: 500;
	}

	.result-value {
		color: var(--color-text-secondary);
	}

	.result-error {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		font-size: 0.875rem;
	}

	.error-message {
		color: var(--color-error);
		font-family: var(--font-family-mono);
	}

	/* History List */
	.history-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.history-item {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		background-color: var(--color-surface-3);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border-subtle);
	}

	.history-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--spacing-md);
	}

	.history-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.history-title {
		font-family: var(--font-family-heading);
		font-size: 1.125rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0;
		letter-spacing: 0.02em;
	}

	.history-meta {
		display: flex;
		gap: var(--spacing-md);
		flex-wrap: wrap;
		align-items: center;
	}

	.timestamp {
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
		font-family: var(--font-family-mono);
	}

	.execution-time {
		font-size: 0.875rem;
		color: var(--color-brass);
		font-family: var(--font-family-mono);
	}

	.history-details {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		padding: var(--spacing-md);
		background-color: var(--color-surface-2);
		border-radius: var(--radius-sm);
	}

	.detail-row {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		font-size: 0.875rem;
	}

	.detail-row.error {
		color: var(--color-error);
	}

	.detail-label {
		color: var(--color-text-tertiary);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 0.75rem;
	}

	.detail-value {
		color: var(--color-text-secondary);
	}

	.output-preview {
		font-family: var(--font-family-mono);
		font-size: 0.875rem;
		color: var(--color-text-primary);
		background-color: var(--color-surface-1);
		padding: var(--spacing-sm);
		border-radius: var(--radius-sm);
		overflow-x: auto;
		white-space: pre-wrap;
		word-break: break-word;
		margin: 0;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.builder-layout {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.page-title {
			font-size: 2rem;
		}

		.stats-row {
			flex-direction: column;
			gap: var(--spacing-md);
		}

		.view-tabs {
			flex-direction: column;
		}

		.section-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
