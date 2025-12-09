<script lang="ts">
	import { onMount } from 'svelte';
	import { forgeAgentsClient } from '$lib/api/forgeAgentsClient';
	import { skillRegistry } from '$lib/api/skillRegistry';
	import { Panel, Button, Badge, Alert } from '$lib/components';

	let testResults = $state<any[]>([]);
	let loading = $state(false);
	let currentTest = $state('');

	function addResult(test: string, status: 'success' | 'error', message: string, data?: any) {
		testResults = [
			...testResults,
			{
				test,
				status,
				message,
				data,
				timestamp: new Date().toISOString()
			}
		];
	}

	async function runTests() {
		testResults = [];
		loading = true;

		try {
			// Test 1: List skills without auth (should get PUBLIC skills only)
			currentTest = 'Loading PUBLIC skills without authentication...';
			try {
				const skills = await skillRegistry.getAllSkills();
				addResult(
					'Public Skills (No Auth)',
					'success',
					`Loaded ${skills.length} skills`,
					skills.slice(0, 3)
				);
			} catch (err: any) {
				addResult('Public Skills (No Auth)', 'error', err.message, err);
			}

			// Test 2: Login as admin
			currentTest = 'Authenticating as admin@bds.com...';
			try {
				const authResponse = await forgeAgentsClient.login('admin@bds.com', 'password123');
				addResult(
					'Authentication',
					'success',
					`Logged in successfully (expires: ${authResponse.expires_at})`,
					{
						token_type: authResponse.token_type,
						expires_in: authResponse.expires_in,
						access_token: authResponse.access_token.slice(0, 50) + '...'
					}
				);
			} catch (err: any) {
				addResult('Authentication', 'error', err.message, err);
			}

			// Test 3: List skills with auth (should get ALL skills including BDS_ONLY)
			currentTest = 'Loading ALL skills with authentication...';
			try {
				// Force reload after auth
				const skills = await forgeAgentsClient.listSkills();
				addResult(
					'All Skills (With Auth)',
					'success',
					`Loaded ${skills.skills.length} skills`,
					skills.skills.slice(0, 3)
				);
			} catch (err: any) {
				addResult('All Skills (With Auth)', 'error', err.message, err);
			}

			// Test 4: Get specific skill
			currentTest = 'Fetching specific skill...';
			try {
				const skill = await forgeAgentsClient.getSkill('A1');
				addResult('Get Skill (A1)', 'success', `Retrieved skill: ${skill.name}`, skill);
			} catch (err: any) {
				addResult('Get Skill (A1)', 'error', err.message, err);
			}

			// Test 5: Invoke a skill (non-streaming)
			currentTest = 'Invoking skill...';
			try {
				const result = await forgeAgentsClient.invokeSkill('A1', {
					prompt: 'Test prompt for API integration',
					context: {},
					temperature: 0.7,
					stream: false
				});
				addResult('Invoke Skill (A1)', 'success', `Invocation completed`, result);
			} catch (err: any) {
				addResult('Invoke Skill (A1)', 'error', err.message, err);
			}
		} finally {
			loading = false;
			currentTest = '';
		}
	}

	function clearResults() {
		testResults = [];
	}
</script>

<div class="test-page">
	<div class="test-header">
		<h1 class="test-title">ForgeAgents API Integration Test</h1>
		<p class="test-description">
			This page tests the connection between VibeForge_BDS frontend and the ForgeAgents BDS API.
		</p>

		<div class="test-actions">
			<Button variant="primary" onclick={runTests} disabled={loading}>
				{loading ? 'Running Tests...' : 'Run All Tests'}
			</Button>
			<Button variant="secondary" onclick={clearResults} disabled={loading}>Clear Results</Button>
		</div>

		{#if loading}
			<Alert variant="info" title="Testing in progress">
				{currentTest}
			</Alert>
		{/if}
	</div>

	<div class="test-results">
		{#if testResults.length === 0}
			<Panel variant="bordered" padding="lg">
				<div class="empty-state">
					<p>No test results yet. Click "Run All Tests" to begin.</p>
				</div>
			</Panel>
		{:else}
			{#each testResults as result}
				<Panel variant="bordered" padding="lg">
					<div class="result-header">
						<div class="result-info">
							<h3 class="result-test">{result.test}</h3>
							<span class="result-time">{new Date(result.timestamp).toLocaleTimeString()}</span>
						</div>
						<Badge variant={result.status === 'success' ? 'success' : 'error'}>
							{result.status.toUpperCase()}
						</Badge>
					</div>

					<p class="result-message">{result.message}</p>

					{#if result.data}
						<details class="result-details">
							<summary>View Data</summary>
							<pre class="result-data">{JSON.stringify(result.data, null, 2)}</pre>
						</details>
					{/if}
				</Panel>
			{/each}
		{/if}
	</div>

	<div class="test-info">
		<Panel variant="bordered" padding="lg">
			<h3 class="info-title">Test Information</h3>
			<dl class="info-list">
				<dt>API Base URL:</dt>
				<dd>
					<code>http://localhost:3000</code>
				</dd>
				<dt>Test Credentials:</dt>
				<dd>
					<code>admin@bds.com</code> / <code>password123</code>
				</dd>
				<dt>Expected Results:</dt>
				<dd>
					<ul>
						<li>Test 1: Should load ~67 PUBLIC skills</li>
						<li>Test 2: Should authenticate successfully</li>
						<li>Test 3: Should load all 120 skills (67 PUBLIC + 53 BDS_ONLY)</li>
						<li>Test 4: Should retrieve specific skill details</li>
						<li>Test 5: Should invoke skill and get response</li>
					</ul>
				</dd>
				<dt>Console Logging:</dt>
				<dd>Open browser DevTools Console to see detailed request/response logs</dd>
			</dl>
		</Panel>
	</div>
</div>

<style>
	.test-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--spacing-xl);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	.test-header {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.test-title {
		font-family: var(--font-family-heading);
		font-size: 2rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0;
		letter-spacing: 0.02em;
	}

	.test-description {
		font-size: 1rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.test-actions {
		display: flex;
		gap: var(--spacing-md);
	}

	.test-results {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.empty-state {
		text-align: center;
		padding: var(--spacing-3xl) var(--spacing-xl);
		color: var(--color-text-secondary);
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--spacing-md);
		margin-bottom: var(--spacing-md);
	}

	.result-info {
		flex: 1;
	}

	.result-test {
		font-family: var(--font-family-heading);
		font-size: 1.125rem;
		font-weight: 400;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-xs) 0;
	}

	.result-time {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-family: var(--font-family-mono);
	}

	.result-message {
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
		margin: 0 0 var(--spacing-md) 0;
	}

	.result-details {
		margin-top: var(--spacing-md);
	}

	.result-details summary {
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-brass);
		user-select: none;
	}

	.result-details summary:hover {
		text-decoration: underline;
	}

	.result-data {
		margin-top: var(--spacing-sm);
		padding: var(--spacing-md);
		background-color: var(--color-surface-2);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		font-family: var(--font-family-mono);
		font-size: 0.8125rem;
		color: var(--color-text-secondary);
		overflow-x: auto;
		white-space: pre-wrap;
		word-break: break-all;
	}

	.test-info {
		margin-top: var(--spacing-xl);
	}

	.info-title {
		font-family: var(--font-family-heading);
		font-size: 1.25rem;
		font-weight: 300;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-lg) 0;
	}

	.info-list {
		display: grid;
		gap: var(--spacing-md);
		margin: 0;
	}

	.info-list dt {
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
	}

	.info-list dd {
		margin: var(--spacing-xs) 0 0 0;
		color: var(--color-text-secondary);
	}

	.info-list code {
		background-color: var(--color-surface-2);
		padding: 0.125rem 0.375rem;
		border-radius: var(--radius-sm);
		font-family: var(--font-family-mono);
		font-size: 0.875rem;
		color: var(--color-brass);
	}

	.info-list ul {
		margin: var(--spacing-xs) 0 0 0;
		padding-left: var(--spacing-lg);
	}

	.info-list li {
		margin-bottom: var(--spacing-xs);
		font-size: 0.875rem;
		line-height: 1.5;
	}
</style>
