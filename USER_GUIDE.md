# VibeForge BDS - User Guide

**Comprehensive guide for using the VibeForge BDS web interface**

Version: 1.0
Last Updated: December 2025

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Skill Library](#skill-library)
4. [Agent Templates](#agent-templates)
5. [Workflows](#workflows)
6. [Testing Lab](#testing-lab)
7. [History](#history)
8. [Settings](#settings)
9. [Admin Panel](#admin-panel)
10. [Tips & Best Practices](#tips--best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Time Setup

1. **Access the Application**
   - Open your web browser
   - Navigate to `http://localhost:5173`
   - You'll see the VibeForge BDS login page

2. **Login**
   - Enter your BDS email and password
   - Click "Login"
   - Your session will be remembered until you log out

3. **Explore the Interface**
   - **Sidebar** (left): Main navigation menu
   - **Header** (top): User info and quick actions
   - **Main Area**: Active page content

### Understanding Access Levels

VibeForge BDS has two access levels:

- **PUBLIC**: Skills available to all users
- **BDS_ONLY**: Skills requiring BDS access (most skills)

If you see "BDS_ONLY" on a skill and cannot access it, contact your administrator.

---

## Dashboard

The dashboard is your homepage - it provides an overview of your activity.

### What You'll See

**Quick Stats** (top section)
- Total number of available skills
- Your recent invocations count
- Average response time
- Success rate percentage

**Recent Activity** (middle section)
- Last 5 skill invocations
- Quick status indicators (success/error)
- Timestamps for each invocation
- Click any item to view full details

**Popular Skills** (bottom section)
- Most frequently used skills across the platform
- Your personal favorites
- Recommended skills based on your usage

**Quick Actions** (action buttons)
- Browse Library: Jump to the full skill catalog
- View History: See all your past invocations
- Manage Workflows: Create and run skill chains
- Run Tests: Access the testing lab

### Navigation Tips

- Click any stat to see detailed breakdowns
- Use quick actions for common tasks
- Recent activity items are clickable for re-running

---

## Skill Library

The skill library is where you browse and invoke the 120+ available AI skills.

### Browsing Skills

**Search Bar**
- Type keywords to search by name, description, or tags
- Examples: "python", "documentation", "debugging"
- Search is instant - results update as you type

**Filters**
- **Section**: Coding, Writing, Analysis, Specialized
- **Category**: More specific than sections (e.g., "Code Generation")
- **Access Level**: PUBLIC or BDS_ONLY
- **Clear Filters**: Reset all filters to default

**View Modes**
- **Grid View**: Cards with thumbnails (default)
- **List View**: Compact table format

**Sorting**
- By Name (A-Z)
- By Section
- By Category
- By Usage Count (most popular first)

### Understanding Skill Cards

Each skill card shows:

**Header**
- **Skill Name**: What the skill does
- **Access Badge**: PUBLIC or BDS_ONLY

**Body**
- **Description**: What the skill accomplishes
- **Section & Category**: Classification
- **Tags**: Keywords (first 4 shown)

**Footer**
- **Estimated Cost**: Range based on typical usage
- **Click to Open**: Opens the skill detail page

### Invoking a Skill

1. **Open Skill Detail**
   - Click on any skill card
   - You'll see the full skill page

2. **Fill in Input Parameters**
   - Each skill has different inputs
   - **Required fields** are marked with an asterisk (*)
   - Examples are shown as placeholders
   - Hover over  fields for descriptions

3. **Configure Execution Options**

   **Model Selection** - Choose your AI model:
   - **GPT-4o**: Most capable, higher cost
   - **GPT-4o Mini**: Fast, cost-effective (recommended)
   - **Claude 3.5 Sonnet**: Best for complex reasoning
   - **Claude 3.5 Haiku**: Fast, affordable

   **Temperature** (0-2):
   - 0: Deterministic, consistent outputs
   - 0.7: Balanced (default)
   - 1.5-2: Creative, varied outputs

   **Max Tokens** (1-32000):
   - Limits response length
   - Default: 4096 (recommended for most tasks)
   - Increase for longer outputs

4. **Choose Invocation Mode**

   **Non-Streaming** (default):
   - Waits for complete response
   - Shows full result at once
   - Best for short tasks

   **Streaming**:
   - Shows response as it generates
   - Better user experience for long outputs
   - Can see progress in real-time

5. **Invoke**
   - Click "Invoke Skill"
   - Wait for response
   - View results in the output panel

### Reading Results

**Success**
- Green checkmark indicator
- Output shown in formatted text
- Execution time displayed
- Option to copy output

**Error**
- Red error indicator
- Error message with details
- Error ID for support
- Option to retry with different settings

**Actions**
- **Copy Output**: Copy to clipboard
- **Save to History**: Automatically saved
- **Run Again**: Re-execute with same inputs
- **Modify & Run**: Change inputs and re-run

---

## Agent Templates

Pre-configured agents for specialized tasks.

### Agent Types

**1. Planner Agents** (Blue Badge)
- Analyze requirements
- Create implementation plans
- Break down complex tasks
- Estimate effort

**2. Execution Agents** (Green Badge)
- Implement code
- Execute tasks
- Run operations
- Generate outputs

**3. Evaluator Agents** (Orange Badge)
- Review code quality
- Run tests
- Validate results
- Provide feedback

**4. Coordinator Agents** (Brass Badge)
- Orchestrate workflows
- Manage multi-agent tasks
- Handle dependencies
- Track progress

### Browsing Agents

**Filters**
- All Types (default)
- Planner only
- Execution only
- Evaluator only
- Coordinator only

**Search**
- Search by name or description
- Filter by allowed repositories

### Agent Details

Each agent card shows:
- **Name**: Agent purpose
- **Type Badge**: Planner/Execution/Evaluator/Coordinator
- **Locked Status**: = indicates template cannot be modified
- **SAS Auto-Eval**:  if automatic safety evaluation is enabled
- **Pipeline ID**: Internal identifier
- **Allowed Repos**: Which repositories this agent can access
- **Actions**: View Details or Edit (if not locked)

---

## Workflows

Chain multiple skills together for complex automation.

### Creating a Workflow

1. **Click "Create Workflow"**
   - Enter workflow name (required)
   - Add description (optional but recommended)

2. **Add Steps**
   - Click "Add Step"
   - Select a skill from dropdown
   - Configure inputs for that step
   - Repeat for each step

3. **Order Steps**
   - Steps execute in order (top to bottom)
   - Drag to reorder (upcoming feature)
   - Each step shows its number

4. **Connect Steps** (Optional)
   - Use output from previous step as input
   - Select "Use output from step X"
   - Enables data flow between steps

5. **Set Status**
   - **Draft**: Still being developed
   - **Active**: Ready to run
   - **Archived**: No longer in use

6. **Save Workflow**

### Running Workflows

1. **Find your workflow** in the list
2. **Click "Run"** button
3. **Watch execution** (upcoming: real-time progress)
4. **View results** when complete

### Managing Workflows

**Edit**
- Click workflow name
- Modify steps, inputs, or order
- Save changes

**Delete**
- Click "Delete" on workflow card
- Confirm deletion
- Cannot be undone

**Export/Import**
- Export workflows to JSON (upcoming)
- Share with team members (upcoming)
- Import from JSON file (upcoming)

---

## Testing Lab

Create automated tests for skills to ensure consistent quality.

### Why Use Testing?

- Catch regressions early
- Document expected behavior
- Ensure consistent outputs
- Validate model performance

### Creating a Test Case

1. **Select Skill**
   - Choose the skill you want to test
   - Skill details will load

2. **Name Your Test**
   - Descriptive name (e.g., "Test Python function generation")
   - Helps identify test purpose

3. **Configure Inputs**
   - Fill in the same inputs you'd use for normal invocation
   - Use realistic, representative data

4. **Set Assertion Type**

   **Option A: Expected Output**
   - Enter the exact text you expect
   - Test passes if output contains this text
   - Case-insensitive match

   **Option B: Regex Pattern**
   - Check "Use regex pattern matching"
   - Enter a regular expression
   - Test passes if pattern matches
   - Example: `function.*calculate` matches any function with "calculate"

   **Option C: No Assertion**
   - Leave empty
   - Test passes if execution succeeds
   - Useful for smoke testing

5. **Set Execution Options**
   - Same as regular skill invocation
   - Model, temperature, max tokens

6. **Create Test Case**

### Running Tests

**Single Test**
- Click "Run" on any test case
- View real-time execution
- See pass/fail status

**Run All Tests**
- Click "Run All Tests" button
- Tests execute sequentially
- View summary when complete

### Understanding Results

**Test Results**
-  **Passed**: Output matched assertion
-  **Failed**: Output didn't match assertion
- **Execution Time**: How long it took
- **Match Details**: Why it passed/failed

**Test History**
- Switch to "Test Results" tab
- See all past test runs
- Filter by pass/fail
- Inspect outputs

### Best Practices

- Create tests for critical skills
- Use specific assertions when possible
- Test edge cases and common scenarios
- Run tests before deploying changes
- Keep test inputs realistic

---

## History

View all your skill invocations with full details.

### Viewing History

**List View**
- Most recent invocations first
- Scroll to load more
- Click any item for full details

**Information Shown**
- Skill name and ID
- Timestamp
- Status (success/error)
- Execution time
- Model used
- Input summary

**Filters** (Upcoming)
- Date range
- Skill name
- Status
- Model

### Invocation Details

Click any history item to see:

**Inputs**
- All parameters you provided
- Formatted for readability

**Output**
- Full response text
- Formatted and syntax highlighted (if code)

**Metadata**
- Execution time
- Model used
- Token counts
- Cost estimate

**Actions**
- **Re-run**: Execute again with same inputs
- **Copy Output**: Copy to clipboard
- **Delete**: Remove from history

---

## Settings

Configure your preferences and account.

### Account Settings

**Profile**
- Update email
- Change password
- View account details

**API Keys** (Upcoming)
- Generate personal API keys
- Manage existing keys
- Revoke access

### Preferences

**Default Execution Options**
- Preferred model
- Default temperature
- Default max tokens
- These apply to new invocations

**Interface**
- Theme (upcoming: light/dark)
- View mode preference (grid/list)
- Results per page

**Notifications**
- Enable/disable error notifications
- Notification duration
- Sound alerts

### Privacy & Data

**Usage Data**
- View your usage statistics
- Export invocation history
- Request data deletion

---

## Admin Panel

**Requires BDS_ONLY access and admin role.**

The Admin Panel provides comprehensive system administration, user management, and monitoring capabilities. It's organized into four main tabs:

### Overview Dashboard

**Quick Stats** (displayed on all tabs)
- **Total Users**: Count of all users with active user count
- **Admin Users**: Number of admin users and BDS access count
- **Skills**: Total skills with enabled count
- **System Health**: Healthy services out of total (color-coded status)

### Tab 1: User Management

Manage all user accounts, roles, and access levels.

#### Viewing Users

**User Table Columns:**
- **Email**: User's email address
- **Name**: Full name
- **Access Level**: PUBLIC or BDS_ONLY badge
- **Role**: USER or ADMIN badge
- **Status**: ACTIVE, INACTIVE, or SUSPENDED
- **Last Login**: Timestamp of last authentication
- **Invocations**: Total skill executions by this user

#### Filtering Users

**Search**
- Type email or name to filter users
- Real-time search results

**Role Filter**
- All Roles (default)
- User only
- Admin only

**Status Filter**
- All Status (default)
- Active only
- Inactive only
- Suspended only

#### User Actions

**For Active Users:**
- **Deactivate**: Set user status to INACTIVE (prevents login)
- **Promote**: Change role from USER to ADMIN (grants admin access)
- **Demote**: Change role from ADMIN to USER (removes admin access)
- **Delete**: Permanently remove user account (cannot be undone)

**For Inactive Users:**
- **Activate**: Restore user to ACTIVE status (allows login)
- **Delete**: Permanently remove user account

**Action Confirmations:**
- Success messages displayed at top of page
- Messages auto-dismiss after 5 seconds

#### Best Practices

- Review user activity before deactivating accounts
- Use INACTIVE status instead of DELETE for temporary restrictions
- Only promote trusted users to ADMIN role
- Regularly audit ADMIN user list
- Check last login dates to identify inactive accounts

### Tab 2: System Health

Monitor backend service health and performance in real-time.

#### Health Monitoring

**Services Monitored:**
1. **ForgeAgents API** - Agent orchestration service
2. **NeuroForge** - Model routing and safety
3. **DataForge** - Data persistence
4. **MAPO** - Multi-step orchestration
5. **Authentication** - Auth service

#### Service Metrics

**Each service card shows:**

**Status Badge:**
- 🟢 **HEALTHY**: Service operating normally
- 🟡 **DEGRADED**: Service experiencing issues but functional
- 🔴 **DOWN**: Service unavailable

**Performance Metrics:**
- **Response Time**: Average API response time in milliseconds
- **Uptime**: Percentage uptime (target: 99%+)
- **Error Rate**: Percentage of failed requests
- **Last Check**: Timestamp of most recent health check

**Visual Indicators:**
- Color-coded service cards (green/yellow/red border)
- Uptime progress bar (visual representation)
- Status-based styling

#### Refresh Options

**Manual Refresh:**
- Click "🔄 Refresh Status" button
- Updates all service health data
- Shows loading state during refresh

**Auto-Refresh:**
- Toggle "Auto-refresh (30s)" checkbox
- Automatically refreshes every 30 seconds
- Useful for monitoring active incidents

#### Interpreting Health Status

**HEALTHY** (Green)
- Service is operating normally
- Response times within acceptable range
- Error rate below threshold
- No action required

**DEGRADED** (Yellow)
- Service is functional but experiencing issues
- May have elevated response times
- Error rate slightly elevated
- Monitor closely, may require intervention

**DOWN** (Red)
- Service is unavailable
- Requests failing completely
- Immediate action required
- Check backend service logs

#### What to Do When Services Are Down

1. **Check Degraded/Down Services**
   - Note which services are affected
   - Check error rates and response times

2. **Review Recent Changes**
   - Check audit logs for recent deployments
   - Look for configuration changes

3. **Contact Backend Team**
   - Report service name and status
   - Include error rates and response times
   - Provide timestamp of issue onset

4. **Monitor Recovery**
   - Use auto-refresh to track recovery
   - Verify all metrics return to normal

### Tab 3: Skill Management

Enable, disable, and monitor all skills in the system.

#### Viewing Skills

**Skill Table Columns:**
- **Skill Name**: Name of the skill
- **Section**: Coding, Writing, Analysis, or Specialized
- **Category**: More specific classification
- **Access Level**: PUBLIC or BDS_ONLY badge
- **Status**: Enabled or Disabled badge (green/red)
- **Usage**: Total invocation count
- **Success Rate**: Percentage of successful executions
- **Avg Time**: Average response time in seconds

#### Filtering Skills

**Search**
- Type skill name or category
- Real-time filtering

**Status Filter**
- All Skills (default)
- Enabled only
- Disabled only

#### Skill Actions

**Enable/Disable Skills:**
- Click "Enable" button to activate a disabled skill
- Click "Disable" button to deactivate an enabled skill
- Users cannot invoke disabled skills
- Useful for maintenance or deprecation

#### Use Cases for Disabling Skills

**Maintenance:**
- Temporarily disable during bug fixes
- Prevent usage during updates
- Re-enable after testing

**Deprecation:**
- Disable old skill versions
- Force users to migrate to new skills
- Eventually delete after migration

**Quality Control:**
- Disable skills with low success rates
- Investigate and fix issues
- Re-enable after improvements

**Access Control:**
- Disable PUBLIC skills for internal testing
- Enable only for BDS_ONLY users
- Control feature rollout

#### Monitoring Skill Performance

**Success Rate Monitoring:**
- Target: 90%+ success rate
- Investigate skills below 85%
- Consider disabling below 70%

**Response Time Monitoring:**
- Target: Under 5 seconds average
- Investigate skills over 10 seconds
- Optimize or disable slow skills

**Usage Tracking:**
- Identify popular skills (high usage)
- Find underused skills (candidates for removal)
- Track usage trends over time

### Tab 4: Audit Logs

View and export comprehensive audit logs for compliance and security.

#### Audit Log Information

**Each log entry shows:**
- **Timestamp**: When the action occurred
- **User**: Email of the user who performed the action
- **Action**: Type of action (CREATE, UPDATE, DELETE, ACCESS)
- **Resource**: What was affected (user, skill, workflow, etc.)
- **Status**: SUCCESS or FAILURE badge
- **Details**: Human-readable description of what happened
- **IP Address**: Source IP address of the request

#### Filtering Audit Logs

**Action Filter:**
- All Actions (default)
- CREATE: Resource creation events
- UPDATE: Modification events
- DELETE: Deletion events
- ACCESS: Access/viewing events

**Status Filter:**
- All Status (default)
- SUCCESS: Successful operations
- FAILURE: Failed attempts (security-relevant)

#### Exporting Audit Logs

**CSV Export:**
1. Apply desired filters (action, status)
2. Click "📥 Export Logs" button
3. CSV file downloads with all filtered logs
4. Filename: `audit-logs-[timestamp].csv`

**Export Contents:**
- All columns from the table
- Filtered based on current filter settings
- Ready for analysis in Excel/Google Sheets

#### Security and Compliance

**Reviewing Failed Actions:**
- Filter by Status: FAILURE
- Look for unauthorized access attempts
- Investigate repeated failures by same user
- Check IP addresses for unusual locations

**Access Monitoring:**
- Filter by Action: ACCESS
- See who accessed sensitive resources
- Track admin panel access
- Monitor skill library usage

**Change Tracking:**
- Filter by Action: UPDATE or DELETE
- See all system modifications
- Track configuration changes
- Identify who made critical changes

**Compliance Reports:**
1. Select appropriate time range (future feature)
2. Apply necessary filters
3. Export to CSV
4. Include in compliance documentation

#### Audit Log Best Practices

- **Regular Reviews**: Check logs daily for anomalies
- **Failed Access Attempts**: Investigate repeated failures
- **Administrative Changes**: Review all UPDATE/DELETE actions
- **Export for Compliance**: Monthly exports for audit trail
- **IP Address Monitoring**: Flag unusual geographic locations
- **Pattern Detection**: Look for unusual activity patterns

---

### Admin Panel Tips

**Security:**
- Only grant ADMIN role to trusted users
- Regularly review admin user list
- Monitor failed access attempts in audit logs
- Investigate unusual IP addresses

**User Management:**
- Use INACTIVE instead of DELETE when possible
- Keep user records for audit purposes
- Review last login dates monthly
- Deactivate accounts inactive for 90+ days

**System Monitoring:**
- Enable auto-refresh during incidents
- Check health dashboard daily
- Set up alerts for DOWN services (future)
- Monitor degraded services closely

**Skill Management:**
- Disable low-performing skills promptly
- Test disabled skills before re-enabling
- Track success rates over time
- Remove deprecated skills quarterly

**Compliance:**
- Export audit logs monthly
- Store exports securely
- Review for security incidents
- Include in compliance reports

---

---

## Tips & Best Practices

### Choosing the Right Model

**For Code Tasks:**
- Use Claude 3.5 Sonnet for complex code
- Use GPT-4o Mini for simple code generation
- Higher temperature (0.8-1.2) for creative solutions

**For Writing Tasks:**
- GPT-4o for long-form content
- Claude 3.5 Sonnet for nuanced writing
- Lower temperature (0.5-0.7) for consistency

**For Analysis:**
- Claude 3.5 Sonnet for deep analysis
- GPT-4o for data interpretation
- Temperature 0.3-0.5 for accuracy

### Optimizing Costs

1. **Start with GPT-4o Mini**
   - Try cheaper models first
   - Upgrade only if needed

2. **Use Appropriate Max Tokens**
   - Don't set unnecessarily high
   - Estimate based on expected output

3. **Batch Similar Tasks**
   - Use workflows for repeated operations
   - Saves individual invocation overhead

4. **Cache Common Patterns**
   - Save good prompts for reuse
   - Create templates for frequent tasks

### Getting Better Results

**Be Specific**
- Provide detailed inputs
- Include context and examples
- Specify desired format

**Iterate**
- Start broad, then refine
- Use output as input for next iteration
- Save successful patterns

**Use Examples**
- Show what you want
- Provide sample inputs/outputs
- Models learn from patterns

**Test and Validate**
- Create tests for critical tasks
- Verify outputs manually
- Build confidence over time

---

## Troubleshooting

### Common Issues

**"Failed to connect to API"**

*Symptoms:* Error message when trying to use any skill
*Cause:* Backend service is down or unreachable
*Solution:*
1. Check that ForgeAgents API is running
2. Verify network connectivity
3. Check firewall settings
4. Contact admin if issue persists

**"Authentication failed"**

*Symptoms:* Cannot log in or session expires frequently
*Cause:* Invalid credentials or expired tokens
*Solution:*
1. Verify email and password are correct
2. Log out and log back in
3. Clear browser cache and cookies
4. Reset password if forgotten
5. Contact admin for access issues

**"Skill not found"**

*Symptoms:* Skill shows in library but won't invoke
*Cause:* Skill may be disabled or access restricted
*Solution:*
1. Check if skill is BDS_ONLY
2. Verify your access level
3. Try refreshing the page
4. Contact admin if problem continues

**"Request timeout"**

*Symptoms:* Skill runs for 30+ seconds then fails
*Cause:* Complex task taking too long
*Solution:*
1. Reduce input complexity
2. Lower max tokens
3. Break into smaller tasks
4. Try a faster model

**"Styles not loading"**

*Symptoms:* Page looks broken or unstyled
*Cause:* CSS not loading properly
*Solution:*
1. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear browser cache
3. Check browser console for errors
4. Try a different browser

### Getting Help

**Error IDs**
- Every error has a unique ID
- Note the ID when reporting issues
- IDs help support diagnose problems

**Debug Information**
- Check browser console (F12)
- Look for error messages
- Screenshot errors when reporting

**Contact Support**
- Email: support@bds.com
- Include error ID
- Describe what you were trying to do
- Attach screenshots if helpful

---

## Keyboard Shortcuts

*Coming soon in future update*

---

## Glossary

**Agent**: Pre-configured AI system for specific tasks
**BDS_ONLY**: Access level requiring BDS authorization
**Invocation**: Running a skill with specific inputs
**Model**: The AI system used (GPT-4o, Claude, etc.)
**PAORT**: Plan � Act � Observe � Reflect � Transition workflow
**Pipeline**: Backend processing flow for skills
**SAS**: Safety and Standards compliance system
**Skill**: Individual AI-powered task or capability
**Streaming**: Real-time response display
**Temperature**: Creativity/randomness parameter (0-2)
**Token**: Unit of text processed by AI (H0.75 words)
**Workflow**: Chain of multiple skills executed in sequence

---

## Changelog

**Version 1.0** (December 2025)
- Initial user guide release
- Covers all major features
- Screenshots and examples (coming soon)

---

**Need more help?** Contact BDS support or check the [Developer README](README.md) for technical details.
