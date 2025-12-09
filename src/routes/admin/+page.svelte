<script lang="ts">
  import { onMount } from 'svelte';
  import Panel from '$lib/components/Panel.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';
  import Select from '$lib/components/Select.svelte';
  import Alert from '$lib/components/Alert.svelte';

  // ═══════════════════════════════════════════════════════════════════════
  // Types
  // ═══════════════════════════════════════════════════════════════════════

  interface User {
    id: string;
    email: string;
    name: string;
    accessLevel: 'PUBLIC' | 'BDS_ONLY';
    role: 'USER' | 'ADMIN';
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    createdAt: string;
    lastLogin: string;
    totalInvocations: number;
  }

  interface SystemHealth {
    service: string;
    status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
    responseTime: number;
    uptime: number;
    lastCheck: string;
    errorRate: number;
  }

  interface SkillManagement {
    skillId: string;
    skillName: string;
    section: string;
    category: string;
    enabled: boolean;
    accessLevel: 'PUBLIC' | 'BDS_ONLY';
    totalInvocations: number;
    successRate: number;
    avgResponseTime: number;
    lastUsed: string;
  }

  interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    resource: string;
    status: 'SUCCESS' | 'FAILURE';
    details: string;
    ipAddress: string;
  }

  interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    bdsUsers: number;
    totalSkills: number;
    enabledSkills: number;
    totalInvocations: number;
    errorRate: number;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // State
  // ═══════════════════════════════════════════════════════════════════════

  let activeTab = $state<'users' | 'system' | 'skills' | 'audit'>('users');
  let loading = $state(false);
  let error = $state<string | null>(null);
  let successMessage = $state<string | null>(null);

  // User Management
  let users = $state<User[]>([]);
  let userSearch = $state('');
  let userRoleFilter = $state<'ALL' | 'USER' | 'ADMIN'>('ALL');
  let userStatusFilter = $state<'ALL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'>('ALL');

  // System Health
  let systemHealth = $state<SystemHealth[]>([]);
  let autoRefreshEnabled = $state(false);

  // Skill Management
  let skills = $state<SkillManagement[]>([]);
  let skillSearch = $state('');
  let skillStatusFilter = $state<'ALL' | 'ENABLED' | 'DISABLED'>('ALL');

  // Audit Logs
  let auditLogs = $state<AuditLog[]>([]);
  let auditActionFilter = $state<'ALL' | 'CREATE' | 'UPDATE' | 'DELETE' | 'ACCESS'>('ALL');
  let auditStatusFilter = $state<'ALL' | 'SUCCESS' | 'FAILURE'>('ALL');

  // Stats
  let stats = $state<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    bdsUsers: 0,
    totalSkills: 0,
    enabledSkills: 0,
    totalInvocations: 0,
    errorRate: 0
  });

  // ═══════════════════════════════════════════════════════════════════════
  // Derived State
  // ═══════════════════════════════════════════════════════════════════════

  const filteredUsers = $derived.by(() => {
    return users.filter(user => {
      const matchesSearch = userSearch === '' ||
        user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.name.toLowerCase().includes(userSearch.toLowerCase());

      const matchesRole = userRoleFilter === 'ALL' || user.role === userRoleFilter;
      const matchesStatus = userStatusFilter === 'ALL' || user.status === userStatusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  });

  const filteredSkills = $derived.by(() => {
    return skills.filter(skill => {
      const matchesSearch = skillSearch === '' ||
        skill.skillName.toLowerCase().includes(skillSearch.toLowerCase()) ||
        skill.category.toLowerCase().includes(skillSearch.toLowerCase());

      const matchesStatus = skillStatusFilter === 'ALL' ||
        (skillStatusFilter === 'ENABLED' ? skill.enabled : !skill.enabled);

      return matchesSearch && matchesStatus;
    });
  });

  const filteredAuditLogs = $derived.by(() => {
    return auditLogs.filter(log => {
      const matchesAction = auditActionFilter === 'ALL' ||
        log.action.toUpperCase().includes(auditActionFilter);

      const matchesStatus = auditStatusFilter === 'ALL' || log.status === auditStatusFilter;

      return matchesAction && matchesStatus;
    });
  });

  const healthyServices = $derived(systemHealth.filter(s => s.status === 'HEALTHY').length);
  const degradedServices = $derived(systemHealth.filter(s => s.status === 'DEGRADED').length);
  const downServices = $derived(systemHealth.filter(s => s.status === 'DOWN').length);

  // ═══════════════════════════════════════════════════════════════════════
  // Mock Data
  // ═══════════════════════════════════════════════════════════════════════

  function loadMockData() {
    // Mock users
    users = [
      {
        id: 'user-1',
        email: 'admin@bds.com',
        name: 'Charles Boswell',
        accessLevel: 'BDS_ONLY',
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: '2025-01-15T10:00:00Z',
        lastLogin: '2025-12-09T14:30:00Z',
        totalInvocations: 1247
      },
      {
        id: 'user-2',
        email: 'developer@bds.com',
        name: 'Jane Smith',
        accessLevel: 'BDS_ONLY',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: '2025-02-01T09:00:00Z',
        lastLogin: '2025-12-09T13:45:00Z',
        totalInvocations: 892
      },
      {
        id: 'user-3',
        email: 'analyst@bds.com',
        name: 'Mike Johnson',
        accessLevel: 'BDS_ONLY',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: '2025-03-10T11:30:00Z',
        lastLogin: '2025-12-08T16:20:00Z',
        totalInvocations: 543
      },
      {
        id: 'user-4',
        email: 'tester@bds.com',
        name: 'Sarah Davis',
        accessLevel: 'PUBLIC',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: '2025-04-20T08:15:00Z',
        lastLogin: '2025-12-07T10:00:00Z',
        totalInvocations: 234
      },
      {
        id: 'user-5',
        email: 'inactive@bds.com',
        name: 'Tom Wilson',
        accessLevel: 'BDS_ONLY',
        role: 'USER',
        status: 'INACTIVE',
        createdAt: '2025-05-05T14:00:00Z',
        lastLogin: '2025-11-01T12:00:00Z',
        totalInvocations: 89
      }
    ];

    // Mock system health
    systemHealth = [
      {
        service: 'ForgeAgents API',
        status: 'HEALTHY',
        responseTime: 45,
        uptime: 99.98,
        lastCheck: '2025-12-09T14:35:00Z',
        errorRate: 0.02
      },
      {
        service: 'NeuroForge',
        status: 'HEALTHY',
        responseTime: 120,
        uptime: 99.95,
        lastCheck: '2025-12-09T14:35:00Z',
        errorRate: 0.05
      },
      {
        service: 'DataForge',
        status: 'HEALTHY',
        responseTime: 25,
        uptime: 99.99,
        lastCheck: '2025-12-09T14:35:00Z',
        errorRate: 0.01
      },
      {
        service: 'MAPO',
        status: 'DEGRADED',
        responseTime: 320,
        uptime: 98.50,
        lastCheck: '2025-12-09T14:35:00Z',
        errorRate: 1.50
      },
      {
        service: 'Authentication',
        status: 'HEALTHY',
        responseTime: 15,
        uptime: 99.99,
        lastCheck: '2025-12-09T14:35:00Z',
        errorRate: 0.01
      }
    ];

    // Mock skills (first 10 for brevity)
    skills = [
      {
        skillId: 'skill-python-gen',
        skillName: 'Python Function Generator',
        section: 'Coding',
        category: 'Code Generation',
        enabled: true,
        accessLevel: 'BDS_ONLY',
        totalInvocations: 543,
        successRate: 96.5,
        avgResponseTime: 2.3,
        lastUsed: '2025-12-09T14:30:00Z'
      },
      {
        skillId: 'skill-code-review',
        skillName: 'Code Review Assistant',
        section: 'Coding',
        category: 'Code Review',
        enabled: true,
        accessLevel: 'BDS_ONLY',
        totalInvocations: 432,
        successRate: 98.1,
        avgResponseTime: 3.1,
        lastUsed: '2025-12-09T13:45:00Z'
      },
      {
        skillId: 'skill-doc-gen',
        skillName: 'Documentation Generator',
        section: 'Writing',
        category: 'Documentation',
        enabled: true,
        accessLevel: 'PUBLIC',
        totalInvocations: 387,
        successRate: 94.2,
        avgResponseTime: 1.8,
        lastUsed: '2025-12-09T12:00:00Z'
      },
      {
        skillId: 'skill-bug-analyzer',
        skillName: 'Bug Analysis Expert',
        section: 'Coding',
        category: 'Debugging',
        enabled: true,
        accessLevel: 'BDS_ONLY',
        totalInvocations: 298,
        successRate: 92.8,
        avgResponseTime: 2.7,
        lastUsed: '2025-12-08T16:20:00Z'
      },
      {
        skillId: 'skill-test-gen',
        skillName: 'Unit Test Generator',
        section: 'Coding',
        category: 'Testing',
        enabled: false,
        accessLevel: 'BDS_ONLY',
        totalInvocations: 156,
        successRate: 88.5,
        avgResponseTime: 3.5,
        lastUsed: '2025-12-05T10:00:00Z'
      }
    ];

    // Mock audit logs
    auditLogs = [
      {
        id: 'audit-1',
        timestamp: '2025-12-09T14:30:00Z',
        user: 'admin@bds.com',
        action: 'UPDATE',
        resource: 'Skill: Python Function Generator',
        status: 'SUCCESS',
        details: 'Enabled skill for BDS_ONLY users',
        ipAddress: '192.168.1.100'
      },
      {
        id: 'audit-2',
        timestamp: '2025-12-09T13:45:00Z',
        user: 'developer@bds.com',
        action: 'ACCESS',
        resource: 'Skill Library',
        status: 'SUCCESS',
        details: 'Accessed skill library',
        ipAddress: '192.168.1.101'
      },
      {
        id: 'audit-3',
        timestamp: '2025-12-09T12:00:00Z',
        user: 'admin@bds.com',
        action: 'CREATE',
        resource: 'User: tester@bds.com',
        status: 'SUCCESS',
        details: 'Created new user account',
        ipAddress: '192.168.1.100'
      },
      {
        id: 'audit-4',
        timestamp: '2025-12-09T11:30:00Z',
        user: 'analyst@bds.com',
        action: 'ACCESS',
        resource: 'Admin Panel',
        status: 'FAILURE',
        details: 'Unauthorized access attempt',
        ipAddress: '192.168.1.102'
      },
      {
        id: 'audit-5',
        timestamp: '2025-12-09T10:15:00Z',
        user: 'admin@bds.com',
        action: 'UPDATE',
        resource: 'User: inactive@bds.com',
        status: 'SUCCESS',
        details: 'Changed user status to INACTIVE',
        ipAddress: '192.168.1.100'
      },
      {
        id: 'audit-6',
        timestamp: '2025-12-09T09:00:00Z',
        user: 'admin@bds.com',
        action: 'DELETE',
        resource: 'Skill: Old Test Skill',
        status: 'SUCCESS',
        details: 'Removed deprecated skill',
        ipAddress: '192.168.1.100'
      }
    ];

    // Calculate stats
    stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'ACTIVE').length,
      adminUsers: users.filter(u => u.role === 'ADMIN').length,
      bdsUsers: users.filter(u => u.accessLevel === 'BDS_ONLY').length,
      totalSkills: skills.length,
      enabledSkills: skills.filter(s => s.enabled).length,
      totalInvocations: users.reduce((sum, u) => sum + u.totalInvocations, 0),
      errorRate: systemHealth.reduce((sum, s) => sum + s.errorRate, 0) / systemHealth.length
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Actions
  // ═══════════════════════════════════════════════════════════════════════

  function handleUserAction(userId: string, action: 'ACTIVATE' | 'DEACTIVATE' | 'PROMOTE' | 'DEMOTE' | 'DELETE') {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'ACTIVATE':
        user.status = 'ACTIVE';
        successMessage = `User ${user.email} activated successfully`;
        break;
      case 'DEACTIVATE':
        user.status = 'INACTIVE';
        successMessage = `User ${user.email} deactivated successfully`;
        break;
      case 'PROMOTE':
        user.role = 'ADMIN';
        successMessage = `User ${user.email} promoted to ADMIN`;
        break;
      case 'DEMOTE':
        user.role = 'USER';
        successMessage = `User ${user.email} demoted to USER`;
        break;
      case 'DELETE':
        users = users.filter(u => u.id !== userId);
        successMessage = `User ${user.email} deleted successfully`;
        break;
    }

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      successMessage = null;
    }, 5000);
  }

  function handleSkillToggle(skillId: string) {
    const skill = skills.find(s => s.skillId === skillId);
    if (!skill) return;

    skill.enabled = !skill.enabled;
    successMessage = `Skill "${skill.skillName}" ${skill.enabled ? 'enabled' : 'disabled'} successfully`;

    setTimeout(() => {
      successMessage = null;
    }, 5000);
  }

  function handleRefreshHealth() {
    loading = true;
    successMessage = 'Refreshing system health status...';

    setTimeout(() => {
      // Simulate refresh
      systemHealth = [...systemHealth];
      loading = false;
      successMessage = 'System health refreshed successfully';

      setTimeout(() => {
        successMessage = null;
      }, 3000);
    }, 1000);
  }

  function exportAuditLogs() {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Status', 'Details', 'IP Address'].join(','),
      ...filteredAuditLogs.map(log =>
        [log.timestamp, log.user, log.action, log.resource, log.status, log.details, log.ipAddress]
          .map(field => `"${field}"`)
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    successMessage = 'Audit logs exported successfully';
    setTimeout(() => {
      successMessage = null;
    }, 3000);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Lifecycle
  // ═══════════════════════════════════════════════════════════════════════

  onMount(() => {
    loadMockData();
  });

  // Auto-refresh system health
  $effect(() => {
    if (autoRefreshEnabled) {
      const interval = setInterval(() => {
        handleRefreshHealth();
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  });

  // ═══════════════════════════════════════════════════════════════════════
  // Utility Functions
  // ═══════════════════════════════════════════════════════════════════════

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getStatusColor(status: string): 'success' | 'warning' | 'error' | 'default' {
    switch (status) {
      case 'ACTIVE':
      case 'HEALTHY':
      case 'SUCCESS':
        return 'success';
      case 'DEGRADED':
      case 'SUSPENDED':
        return 'warning';
      case 'INACTIVE':
      case 'DOWN':
      case 'FAILURE':
        return 'error';
      default:
        return 'default';
    }
  }
</script>

<!-- ═══════════════════════════════════════════════════════════════════════
     Admin Panel Page
     ═══════════════════════════════════════════════════════════════════════ -->

<div class="admin-page">
  <!-- Header -->
  <div class="page-header">
    <div class="header-content">
      <h1 class="page-title">Admin Panel</h1>
      <p class="page-description">
        System administration and user management
      </p>
    </div>
    <Badge variant="error" size="sm">BDS ADMIN ONLY</Badge>
  </div>

  <!-- Success/Error Messages -->
  {#if successMessage}
    <Alert variant="success" dismissible on:dismiss={() => successMessage = null}>
      {successMessage}
    </Alert>
  {/if}

  {#if error}
    <Alert variant="error" dismissible on:dismiss={() => error = null}>
      {error}
    </Alert>
  {/if}

  <!-- Stats Overview -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">Total Users</div>
      <div class="stat-value">{stats.totalUsers}</div>
      <div class="stat-detail">{stats.activeUsers} active</div>
    </div>

    <div class="stat-card">
      <div class="stat-label">Admin Users</div>
      <div class="stat-value">{stats.adminUsers}</div>
      <div class="stat-detail">{stats.bdsUsers} BDS access</div>
    </div>

    <div class="stat-card">
      <div class="stat-label">Skills</div>
      <div class="stat-value">{stats.totalSkills}</div>
      <div class="stat-detail">{stats.enabledSkills} enabled</div>
    </div>

    <div class="stat-card">
      <div class="stat-label">System Health</div>
      <div class="stat-value">{healthyServices}/{systemHealth.length}</div>
      <div class="stat-detail stat-detail-{downServices > 0 ? 'error' : degradedServices > 0 ? 'warning' : 'success'}">
        {downServices > 0 ? `${downServices} down` : degradedServices > 0 ? `${degradedServices} degraded` : 'All healthy'}
      </div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="tabs">
    <button
      class="tab"
      class:active={activeTab === 'users'}
      onclick={() => activeTab = 'users'}
    >
      👥 User Management
    </button>
    <button
      class="tab"
      class:active={activeTab === 'system'}
      onclick={() => activeTab = 'system'}
    >
      🖥️ System Health
    </button>
    <button
      class="tab"
      class:active={activeTab === 'skills'}
      onclick={() => activeTab = 'skills'}
    >
      🛠️ Skill Management
    </button>
    <button
      class="tab"
      class:active={activeTab === 'audit'}
      onclick={() => activeTab = 'audit'}
    >
      📋 Audit Logs
    </button>
  </div>

  <!-- Tab Content -->
  <div class="tab-content">
    <!-- User Management Tab -->
    {#if activeTab === 'users'}
      <Panel title="User Management" variant="bordered">
        <!-- Filters -->
        <div class="filters">
          <Input
            label="Search users"
            placeholder="Search by email or name..."
            bind:value={userSearch}
          />

          <Select
            label="Role"
            bind:value={userRoleFilter}
            options={[
              { value: 'ALL', label: 'All Roles' },
              { value: 'USER', label: 'User' },
              { value: 'ADMIN', label: 'Admin' }
            ]}
          />

          <Select
            label="Status"
            bind:value={userStatusFilter}
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'SUSPENDED', label: 'Suspended' }
            ]}
          />
        </div>

        <!-- Users Table -->
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Access Level</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Invocations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each filteredUsers as user}
                <tr>
                  <td class="cell-email">{user.email}</td>
                  <td>{user.name}</td>
                  <td>
                    <Badge
                      variant={user.accessLevel === 'BDS_ONLY' ? 'warning' : 'default'}
                      size="sm"
                    >
                      {user.accessLevel}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      variant={user.role === 'ADMIN' ? 'success' : 'default'}
                      size="sm"
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      variant={getStatusColor(user.status)}
                      size="sm"
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td class="cell-date">{formatDate(user.lastLogin)}</td>
                  <td class="cell-number">{user.totalInvocations.toLocaleString()}</td>
                  <td class="cell-actions">
                    <div class="action-buttons">
                      {#if user.status === 'ACTIVE'}
                        <button
                          class="action-btn action-btn-warning"
                          onclick={() => handleUserAction(user.id, 'DEACTIVATE')}
                          title="Deactivate user"
                        >
                          Deactivate
                        </button>
                      {:else}
                        <button
                          class="action-btn action-btn-success"
                          onclick={() => handleUserAction(user.id, 'ACTIVATE')}
                          title="Activate user"
                        >
                          Activate
                        </button>
                      {/if}

                      {#if user.role === 'USER'}
                        <button
                          class="action-btn action-btn-primary"
                          onclick={() => handleUserAction(user.id, 'PROMOTE')}
                          title="Promote to admin"
                        >
                          Promote
                        </button>
                      {:else}
                        <button
                          class="action-btn action-btn-secondary"
                          onclick={() => handleUserAction(user.id, 'DEMOTE')}
                          title="Demote to user"
                        >
                          Demote
                        </button>
                      {/if}

                      <button
                        class="action-btn action-btn-error"
                        onclick={() => handleUserAction(user.id, 'DELETE')}
                        title="Delete user"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}

              {#if filteredUsers.length === 0}
                <tr>
                  <td colspan="8" class="empty-state">
                    No users found matching your filters
                  </td>
                </tr>
              {/if}
            </tbody>
          </table>
        </div>
      </Panel>
    {/if}

    <!-- System Health Tab -->
    {#if activeTab === 'system'}
      <Panel title="System Health Monitoring" variant="bordered">
        <div class="system-health-header">
          <div class="health-actions">
            <Button
              variant="primary"
              size="sm"
              on:click={handleRefreshHealth}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : '🔄 Refresh Status'}
            </Button>

            <label class="auto-refresh-toggle">
              <input
                type="checkbox"
                bind:checked={autoRefreshEnabled}
              />
              <span>Auto-refresh (30s)</span>
            </label>
          </div>
        </div>

        <div class="health-grid">
          {#each systemHealth as service}
            <div class="health-card health-card-{service.status.toLowerCase()}">
              <div class="health-card-header">
                <h3 class="health-service-name">{service.service}</h3>
                <Badge
                  variant={getStatusColor(service.status)}
                  size="sm"
                >
                  {service.status}
                </Badge>
              </div>

              <div class="health-metrics">
                <div class="health-metric">
                  <span class="metric-label">Response Time</span>
                  <span class="metric-value">{service.responseTime}ms</span>
                </div>

                <div class="health-metric">
                  <span class="metric-label">Uptime</span>
                  <span class="metric-value">{service.uptime.toFixed(2)}%</span>
                </div>

                <div class="health-metric">
                  <span class="metric-label">Error Rate</span>
                  <span class="metric-value">{service.errorRate.toFixed(2)}%</span>
                </div>

                <div class="health-metric">
                  <span class="metric-label">Last Check</span>
                  <span class="metric-value metric-value-sm">{formatDate(service.lastCheck)}</span>
                </div>
              </div>

              <!-- Visual uptime bar -->
              <div class="uptime-bar">
                <div
                  class="uptime-fill uptime-fill-{service.status.toLowerCase()}"
                  style="width: {service.uptime}%"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      </Panel>
    {/if}

    <!-- Skill Management Tab -->
    {#if activeTab === 'skills'}
      <Panel title="Skill Management" variant="bordered">
        <!-- Filters -->
        <div class="filters">
          <Input
            label="Search skills"
            placeholder="Search by name or category..."
            bind:value={skillSearch}
          />

          <Select
            label="Status"
            bind:value={skillStatusFilter}
            options={[
              { value: 'ALL', label: 'All Skills' },
              { value: 'ENABLED', label: 'Enabled' },
              { value: 'DISABLED', label: 'Disabled' }
            ]}
          />
        </div>

        <!-- Skills Table -->
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Section</th>
                <th>Category</th>
                <th>Access Level</th>
                <th>Status</th>
                <th>Usage</th>
                <th>Success Rate</th>
                <th>Avg Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each filteredSkills as skill}
                <tr>
                  <td class="cell-skill-name">{skill.skillName}</td>
                  <td>{skill.section}</td>
                  <td>{skill.category}</td>
                  <td>
                    <Badge
                      variant={skill.accessLevel === 'BDS_ONLY' ? 'warning' : 'default'}
                      size="sm"
                    >
                      {skill.accessLevel}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      variant={skill.enabled ? 'success' : 'error'}
                      size="sm"
                    >
                      {skill.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </td>
                  <td class="cell-number">{skill.totalInvocations.toLocaleString()}</td>
                  <td class="cell-number">{skill.successRate.toFixed(1)}%</td>
                  <td class="cell-number">{skill.avgResponseTime.toFixed(1)}s</td>
                  <td class="cell-actions">
                    <button
                      class="action-btn {skill.enabled ? 'action-btn-warning' : 'action-btn-success'}"
                      onclick={() => handleSkillToggle(skill.skillId)}
                    >
                      {skill.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              {/each}

              {#if filteredSkills.length === 0}
                <tr>
                  <td colspan="9" class="empty-state">
                    No skills found matching your filters
                  </td>
                </tr>
              {/if}
            </tbody>
          </table>
        </div>
      </Panel>
    {/if}

    <!-- Audit Logs Tab -->
    {#if activeTab === 'audit'}
      <Panel title="Audit Logs" variant="bordered">
        <!-- Filters and Export -->
        <div class="filters">
          <Select
            label="Action"
            bind:value={auditActionFilter}
            options={[
              { value: 'ALL', label: 'All Actions' },
              { value: 'CREATE', label: 'Create' },
              { value: 'UPDATE', label: 'Update' },
              { value: 'DELETE', label: 'Delete' },
              { value: 'ACCESS', label: 'Access' }
            ]}
          />

          <Select
            label="Status"
            bind:value={auditStatusFilter}
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'SUCCESS', label: 'Success' },
              { value: 'FAILURE', label: 'Failure' }
            ]}
          />

          <div class="filter-actions">
            <Button
              variant="secondary"
              size="sm"
              on:click={exportAuditLogs}
            >
              📥 Export Logs
            </Button>
          </div>
        </div>

        <!-- Audit Logs Table -->
        <div class="table-container">
          <table class="admin-table audit-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Status</th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {#each filteredAuditLogs as log}
                <tr>
                  <td class="cell-date">{formatDate(log.timestamp)}</td>
                  <td class="cell-email">{log.user}</td>
                  <td>
                    <Badge
                      variant="default"
                      size="sm"
                    >
                      {log.action}
                    </Badge>
                  </td>
                  <td>{log.resource}</td>
                  <td>
                    <Badge
                      variant={getStatusColor(log.status)}
                      size="sm"
                    >
                      {log.status}
                    </Badge>
                  </td>
                  <td class="cell-details">{log.details}</td>
                  <td class="cell-ip">{log.ipAddress}</td>
                </tr>
              {/each}

              {#if filteredAuditLogs.length === 0}
                <tr>
                  <td colspan="7" class="empty-state">
                    No audit logs found matching your filters
                  </td>
                </tr>
              {/if}
            </tbody>
          </table>
        </div>
      </Panel>
    {/if}
  </div>
</div>

<style>
  /* ═══════════════════════════════════════════════════════════════════════
     Admin Page Layout
     ═══════════════════════════════════════════════════════════════════════ */

  .admin-page {
    max-width: 1600px;
    margin: 0 auto;
    padding: var(--spacing-xl);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Header
     ───────────────────────────────────────────────────────────────────── */

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-xl);
    gap: var(--spacing-lg);
  }

  .header-content {
    flex: 1;
  }

  .page-title {
    font-family: var(--font-family-heading);
    font-size: 2rem;
    font-weight: 300;
    color: var(--color-brass);
    margin: 0 0 var(--spacing-xs) 0;
    letter-spacing: 0.02em;
  }

  .page-description {
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Stats Grid
     ───────────────────────────────────────────────────────────────────── */

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }

  .stat-card {
    background: var(--color-surface-2);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
  }

  .stat-label {
    font-size: 0.8125rem;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--spacing-xs);
  }

  .stat-value {
    font-family: var(--font-family-mono);
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-brass);
    margin-bottom: var(--spacing-xs);
  }

  .stat-detail {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .stat-detail-success {
    color: var(--color-success);
  }

  .stat-detail-warning {
    color: var(--color-warning);
  }

  .stat-detail-error {
    color: var(--color-error);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Tabs
     ───────────────────────────────────────────────────────────────────── */

  .tabs {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .tab {
    background: transparent;
    border: none;
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
    position: relative;
    border-bottom: 2px solid transparent;
  }

  .tab:hover {
    color: var(--color-text-primary);
    background: var(--color-surface-2);
  }

  .tab.active {
    color: var(--color-brass);
    border-bottom-color: var(--color-brass);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Tab Content
     ───────────────────────────────────────────────────────────────────── */

  .tab-content {
    min-height: 400px;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Filters
     ───────────────────────────────────────────────────────────────────── */

  .filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    padding: var(--spacing-lg);
    background: var(--color-surface-1);
    border-radius: var(--radius-md);
  }

  .filter-actions {
    display: flex;
    align-items: flex-end;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Tables
     ───────────────────────────────────────────────────────────────────── */

  .table-container {
    overflow-x: auto;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border-subtle);
  }

  .admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .admin-table thead {
    background: var(--color-surface-2);
    border-bottom: 1px solid var(--color-border-default);
  }

  .admin-table th {
    padding: var(--spacing-md);
    text-align: left;
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }

  .admin-table td {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-border-subtle);
    color: var(--color-text-primary);
  }

  .admin-table tbody tr:hover {
    background: var(--color-surface-2);
  }

  .admin-table tbody tr:last-child td {
    border-bottom: none;
  }

  /* Table Cell Styles */
  .cell-email {
    font-family: var(--font-family-mono);
    font-size: 0.8125rem;
    color: var(--color-steel-blue);
  }

  .cell-date {
    font-size: 0.8125rem;
    color: var(--color-text-tertiary);
    white-space: nowrap;
  }

  .cell-number {
    font-family: var(--font-family-mono);
    text-align: right;
  }

  .cell-skill-name {
    font-weight: 500;
    color: var(--color-text-primary);
  }

  .cell-details {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cell-ip {
    font-family: var(--font-family-mono);
    font-size: 0.8125rem;
    color: var(--color-text-tertiary);
  }

  .cell-actions {
    white-space: nowrap;
  }

  .empty-state {
    text-align: center;
    padding: var(--spacing-xl) !important;
    color: var(--color-text-tertiary);
    font-style: italic;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Action Buttons
     ───────────────────────────────────────────────────────────────────── */

  .action-buttons {
    display: flex;
    gap: var(--spacing-xs);
  }

  .action-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.75rem;
    border-radius: var(--radius-sm);
    border: 1px solid;
    background: transparent;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-weight: 500;
  }

  .action-btn-primary {
    color: var(--color-brass);
    border-color: var(--color-brass);
  }

  .action-btn-primary:hover {
    background: var(--color-brass);
    color: var(--color-midnight);
  }

  .action-btn-secondary {
    color: var(--color-steel-blue);
    border-color: var(--color-steel-blue);
  }

  .action-btn-secondary:hover {
    background: var(--color-steel-blue);
    color: var(--color-midnight);
  }

  .action-btn-success {
    color: var(--color-success);
    border-color: var(--color-success);
  }

  .action-btn-success:hover {
    background: var(--color-success);
    color: white;
  }

  .action-btn-warning {
    color: var(--color-warning);
    border-color: var(--color-warning);
  }

  .action-btn-warning:hover {
    background: var(--color-warning);
    color: var(--color-midnight);
  }

  .action-btn-error {
    color: var(--color-error);
    border-color: var(--color-error);
  }

  .action-btn-error:hover {
    background: var(--color-error);
    color: white;
  }

  /* ─────────────────────────────────────────────────────────────────────
     System Health
     ───────────────────────────────────────────────────────────────────── */

  .system-health-header {
    margin-bottom: var(--spacing-lg);
  }

  .health-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .auto-refresh-toggle {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    cursor: pointer;
  }

  .auto-refresh-toggle input[type="checkbox"] {
    cursor: pointer;
  }

  .health-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--spacing-lg);
  }

  .health-card {
    background: var(--color-surface-2);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    transition: all var(--transition-base);
  }

  .health-card-healthy {
    border-left: 4px solid var(--color-success);
  }

  .health-card-degraded {
    border-left: 4px solid var(--color-warning);
  }

  .health-card-down {
    border-left: 4px solid var(--color-error);
  }

  .health-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
  }

  .health-service-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }

  .health-metrics {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  .health-metric {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .metric-label {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .metric-value {
    font-family: var(--font-family-mono);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .metric-value-sm {
    font-size: 0.875rem;
  }

  .uptime-bar {
    height: 6px;
    background: var(--color-surface-3);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .uptime-fill {
    height: 100%;
    transition: width var(--transition-base);
    border-radius: var(--radius-full);
  }

  .uptime-fill-healthy {
    background: var(--color-success);
  }

  .uptime-fill-degraded {
    background: var(--color-warning);
  }

  .uptime-fill-down {
    background: var(--color-error);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Responsive
     ───────────────────────────────────────────────────────────────────── */

  @media (max-width: 768px) {
    .admin-page {
      padding: var(--spacing-lg);
    }

    .page-header {
      flex-direction: column;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .tabs {
      overflow-x: auto;
    }

    .tab {
      white-space: nowrap;
    }

    .filters {
      grid-template-columns: 1fr;
    }

    .health-grid {
      grid-template-columns: 1fr;
    }

    .action-buttons {
      flex-direction: column;
    }

    .action-btn {
      width: 100%;
    }
  }
</style>
