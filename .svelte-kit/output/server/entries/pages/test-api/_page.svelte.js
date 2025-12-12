import { e as ensure_array_like, c as escape_html } from "../../../chunks/vendor.js";
import { t as tokenManager, a as skillsCache, g as generateCacheKey, b as staleWhileRevalidate, u as userCache } from "../../../chunks/UpdateBanner.svelte_svelte_type_style_lang.js";
import { c as classifyError, s as shouldRetry, a as getRetryDelay, b as createNetworkError, d as createAuthenticationError } from "../../../chunks/errors.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import { B as Button } from "../../../chunks/Button.js";
/* empty css                                                  */
import { P as Panel } from "../../../chunks/Panel.js";
import { B as Badge } from "../../../chunks/Badge.js";
import { A as Alert } from "../../../chunks/Alert.js";
class ForgeAgentsClient {
  baseUrl;
  refreshPromise = null;
  maxRetries = 3;
  timeout = 3e4;
  // 30 seconds
  constructor(baseUrl = "http://localhost:8787") {
    this.baseUrl = baseUrl;
  }
  /**
   * Retry wrapper for fetch operations
   */
  async retryFetch(operation, context) {
    let lastError = null;
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        const appError = classifyError(error);
        lastError = appError;
        if (!shouldRetry(appError, attempt, this.maxRetries)) {
          throw appError;
        }
        const delay = getRetryDelay(appError, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw lastError || createNetworkError(`${context} failed after ${this.maxRetries} attempts`);
  }
  /**
   * Fetch with timeout support
   */
  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    console.log("[ForgeAgents API] Request:", {
      method: options.method || "GET",
      url,
      headers: options.headers,
      hasBody: !!options.body
    });
    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      const duration = Date.now() - startTime;
      console.log("[ForgeAgents API] Response:", {
        method: options.method || "GET",
        url,
        status: response.status,
        statusText: response.statusText,
        duration: `${duration}ms`,
        ok: response.ok
      });
      return response;
    } catch (error) {
      console.error("[ForgeAgents API] Error:", {
        method: options.method || "GET",
        url,
        error: error.message || error
      });
      if (error.name === "AbortError") {
        throw createNetworkError("Request timeout", `Request to ${url} timed out after ${this.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
  async login(email, password) {
    return this.retryFetch(async () => {
      try {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
          const appError = classifyError(response);
          await tokenManager.clearTokens();
          throw appError;
        }
        const data = await response.json();
        await tokenManager.setTokens(data.access_token, data.refresh_token, data.expires_at);
        return data;
      } catch (err) {
        await tokenManager.clearTokens();
        throw classifyError(err);
      }
    }, "Login");
  }
  async logout() {
    try {
      const token = tokenManager.getAccessToken();
      if (token) {
        await fetch(`${this.baseUrl}/api/v1/auth/logout`, {
          method: "POST",
          headers: this.getAuthHeaders()
        });
      }
    } catch (err) {
      console.warn("Logout failed:", err);
    } finally {
      await tokenManager.clearTokens();
    }
  }
  async refreshAccessToken() {
    if (this.refreshPromise) return this.refreshPromise;
    this.refreshPromise = this._performRefresh();
    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }
  async _performRefresh() {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      if (!response.ok) {
        await tokenManager.clearTokens();
        throw new Error("Token refresh failed");
      }
      const data = await response.json();
      await tokenManager.setTokens(data.access_token, data.refresh_token, data.expires_at);
    } catch (err) {
      await tokenManager.clearTokens();
      throw err;
    }
  }
  async listSkills(options) {
    const cacheKey = generateCacheKey("/api/v1/bds/skills");
    if (options?.skipCache) {
      const response = await this.authenticatedFetch("/api/v1/bds/skills");
      skillsCache.set(cacheKey, response);
      return response;
    }
    return staleWhileRevalidate(
      cacheKey,
      () => this.authenticatedFetch("/api/v1/bds/skills"),
      skillsCache
    );
  }
  async getSkill(skillId, options) {
    const cacheKey = generateCacheKey(`/api/v1/bds/skills/${skillId}`);
    if (options?.skipCache) {
      const response = await this.authenticatedFetch(`/api/v1/bds/skills/${skillId}`);
      skillsCache.set(cacheKey, response);
      return response;
    }
    return staleWhileRevalidate(
      cacheKey,
      () => this.authenticatedFetch(`/api/v1/bds/skills/${skillId}`),
      skillsCache
    );
  }
  async searchSkills(query, options) {
    const cacheKey = generateCacheKey("/api/v1/bds/skills/search", { query });
    if (options?.skipCache) {
      const response = await this.authenticatedFetch(
        `/api/v1/bds/skills/search?query=${encodeURIComponent(query)}`
      );
      userCache.set(cacheKey, response);
      return response;
    }
    return staleWhileRevalidate(
      cacheKey,
      () => this.authenticatedFetch(
        `/api/v1/bds/skills/search?query=${encodeURIComponent(query)}`
      ),
      userCache
    );
  }
  async invokeSkill(skillId, request) {
    return this.authenticatedFetch(
      `/api/v1/bds/skills/${skillId}/invoke`,
      {
        method: "POST",
        body: JSON.stringify(request)
      }
    );
  }
  async *invokeSkillStreaming(skillId, request) {
    let reader = null;
    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/api/v1/bds/skills/${skillId}/invoke?stream=true`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(request)
        }
      );
      if (!response.ok) {
        throw classifyError(response);
      }
      if (!response.body) {
        throw createNetworkError("No response body", "Streaming response has no body");
      }
      reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer.trim()) {
            const lines2 = buffer.split("\n");
            for (const line of lines2) {
              const trimmed = line.trim();
              if (trimmed.startsWith("data: ")) {
                const jsonStr = trimmed.substring(6);
                try {
                  const parsed = JSON.parse(jsonStr);
                  if (parsed.token) {
                    yield { type: "token", data: parsed };
                  } else if (parsed.metadata) {
                    yield { type: "metadata", data: parsed.metadata };
                  }
                } catch (e) {
                  console.warn("Failed to parse SSE data:", jsonStr);
                }
              }
            }
          }
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const jsonStr = trimmed.substring(6);
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.token !== void 0) {
                yield { type: "token", data: parsed };
              } else if (parsed.metadata) {
                yield { type: "metadata", data: parsed.metadata };
              } else if (parsed.error) {
                yield { type: "error", data: parsed.error };
              }
            } catch (e) {
              console.warn("Failed to parse SSE data:", jsonStr, e);
            }
          }
        }
      }
    } catch (error) {
      throw classifyError(error);
    } finally {
      if (reader) {
        try {
          reader.releaseLock();
        } catch (e) {
        }
      }
    }
  }
  async getAuthToken() {
    let token = tokenManager.getAccessToken();
    if (!token) {
      if (tokenManager.isExpiringSoon()) {
        await this.refreshAccessToken();
        token = tokenManager.getAccessToken();
      }
      if (!token) throw new Error("Not authenticated");
    }
    return token;
  }
  getAuthHeaders() {
    const token = tokenManager.getAccessToken();
    return {
      "Content-Type": "application/json",
      ...token ? { Authorization: `Bearer ${token}` } : {}
    };
  }
  async authenticatedFetch(path, options = {}) {
    return this.retryFetch(async () => {
      try {
        const token = await this.getAuthToken();
        const response = await this.fetchWithTimeout(`${this.baseUrl}${path}`, {
          ...options,
          headers: { ...this.getAuthHeaders(), ...options.headers || {} }
        });
        if (response.status === 401) {
          try {
            await this.refreshAccessToken();
            const retryResponse = await this.fetchWithTimeout(`${this.baseUrl}${path}`, {
              ...options,
              headers: { ...this.getAuthHeaders(), ...options.headers || {} }
            });
            if (!retryResponse.ok) {
              throw classifyError(retryResponse);
            }
            return retryResponse.json();
          } catch (err) {
            throw createAuthenticationError("Authentication failed after token refresh");
          }
        }
        if (!response.ok) {
          throw classifyError(response);
        }
        return response.json();
      } catch (error) {
        throw classifyError(error);
      }
    }, `API request to ${path}`);
  }
}
const forgeAgentsClient = new ForgeAgentsClient();
class SkillRegistry {
  allSkills = [];
  skillsLoaded = false;
  loadingPromise = null;
  async loadSkills() {
    if (this.skillsLoaded) return this.allSkills;
    if (this.loadingPromise) return this.loadingPromise;
    this.loadingPromise = forgeAgentsClient.listSkills().then((response) => {
      this.allSkills = response.skills;
      this.skillsLoaded = true;
      return this.allSkills;
    });
    return this.loadingPromise;
  }
  async getAllSkills() {
    return this.loadSkills();
  }
  async getSkill(skillId) {
    const skills = await this.getAllSkills();
    return skills.find((s) => s.id === skillId);
  }
  async getSkillsBySection() {
    const skills = await this.getAllSkills();
    return skills.reduce(
      (acc, skill) => {
        if (!acc[skill.section]) acc[skill.section] = [];
        acc[skill.section].push(skill);
        return acc;
      },
      {}
    );
  }
  async getSkillsByCategory() {
    const skills = await this.getAllSkills();
    return skills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
      },
      {}
    );
  }
  async search(query) {
    const skills = await this.getAllSkills();
    const q = query.toLowerCase();
    return skills.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }
  async getPublicSkills() {
    const skills = await this.getAllSkills();
    return skills.filter((s) => s.access === "PUBLIC");
  }
  async getBDSOnlySkills() {
    const skills = await this.getAllSkills();
    return skills.filter((s) => s.access === "BDS_ONLY");
  }
  clearCache() {
    this.allSkills = [];
    this.skillsLoaded = false;
    this.loadingPromise = null;
  }
}
const skillRegistry = new SkillRegistry();
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let testResults = [];
    let loading = false;
    let currentTest = "";
    function addResult(test, status, message, data) {
      testResults = [
        ...testResults,
        {
          test,
          status,
          message,
          data,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      ];
    }
    async function runTests() {
      testResults = [];
      loading = true;
      try {
        currentTest = "Loading PUBLIC skills without authentication...";
        try {
          const skills = await skillRegistry.getAllSkills();
          addResult("Public Skills (No Auth)", "success", `Loaded ${skills.length} skills`, skills.slice(0, 3));
        } catch (err) {
          addResult("Public Skills (No Auth)", "error", err.message, err);
        }
        currentTest = "Authenticating as admin@bds.com...";
        try {
          const authResponse = await forgeAgentsClient.login("admin@bds.com", "password123");
          addResult("Authentication", "success", `Logged in successfully (expires: ${authResponse.expires_at})`, {
            token_type: authResponse.token_type,
            expires_in: authResponse.expires_in,
            access_token: authResponse.access_token.slice(0, 50) + "..."
          });
        } catch (err) {
          addResult("Authentication", "error", err.message, err);
        }
        currentTest = "Loading ALL skills with authentication...";
        try {
          const skills = await forgeAgentsClient.listSkills();
          addResult("All Skills (With Auth)", "success", `Loaded ${skills.skills.length} skills`, skills.skills.slice(0, 3));
        } catch (err) {
          addResult("All Skills (With Auth)", "error", err.message, err);
        }
        currentTest = "Fetching specific skill...";
        try {
          const skill = await forgeAgentsClient.getSkill("A1");
          addResult("Get Skill (A1)", "success", `Retrieved skill: ${skill.name}`, skill);
        } catch (err) {
          addResult("Get Skill (A1)", "error", err.message, err);
        }
        currentTest = "Invoking skill...";
        try {
          const result = await forgeAgentsClient.invokeSkill("A1", {
            prompt: "Test prompt for API integration",
            context: {},
            temperature: 0.7,
            stream: false
          });
          addResult("Invoke Skill (A1)", "success", `Invocation completed`, result);
        } catch (err) {
          addResult("Invoke Skill (A1)", "error", err.message, err);
        }
      } finally {
        loading = false;
        currentTest = "";
      }
    }
    function clearResults() {
      testResults = [];
    }
    $$renderer2.push(`<div class="test-page svelte-c3a646"><div class="test-header svelte-c3a646"><h1 class="test-title svelte-c3a646">ForgeAgents API Integration Test</h1> <p class="test-description svelte-c3a646">This page tests the connection between VibeForge_BDS frontend and the ForgeAgents BDS API.</p> <div class="test-actions svelte-c3a646">`);
    Button($$renderer2, {
      variant: "primary",
      onclick: runTests,
      disabled: loading,
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->${escape_html(loading ? "Running Tests..." : "Run All Tests")}`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Button($$renderer2, {
      variant: "secondary",
      onclick: clearResults,
      disabled: loading,
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->Clear Results`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> `);
    if (loading) {
      $$renderer2.push("<!--[-->");
      Alert($$renderer2, {
        variant: "info",
        title: "Testing in progress",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(currentTest)}`);
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="test-results svelte-c3a646">`);
    if (testResults.length === 0) {
      $$renderer2.push("<!--[-->");
      Panel($$renderer2, {
        variant: "bordered",
        padding: "lg",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="empty-state svelte-c3a646"><p>No test results yet. Click "Run All Tests" to begin.</p></div>`);
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(testResults);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let result = each_array[$$index];
        Panel($$renderer2, {
          variant: "bordered",
          padding: "lg",
          children: ($$renderer3) => {
            $$renderer3.push(`<div class="result-header svelte-c3a646"><div class="result-info svelte-c3a646"><h3 class="result-test svelte-c3a646">${escape_html(result.test)}</h3> <span class="result-time svelte-c3a646">${escape_html(new Date(result.timestamp).toLocaleTimeString())}</span></div> `);
            Badge($$renderer3, {
              variant: result.status === "success" ? "success" : "error",
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(result.status.toUpperCase())}`);
              },
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----></div> <p class="result-message svelte-c3a646">${escape_html(result.message)}</p> `);
            if (result.data) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<details class="result-details svelte-c3a646"><summary class="svelte-c3a646">View Data</summary> <pre class="result-data svelte-c3a646">${escape_html(JSON.stringify(result.data, null, 2))}</pre></details>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]-->`);
          },
          $$slots: { default: true }
        });
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> <div class="test-info svelte-c3a646">`);
    Panel($$renderer2, {
      variant: "bordered",
      padding: "lg",
      children: ($$renderer3) => {
        $$renderer3.push(`<h3 class="info-title svelte-c3a646">Test Information</h3> <dl class="info-list svelte-c3a646"><dt class="svelte-c3a646">API Base URL:</dt> <dd class="svelte-c3a646"><code class="svelte-c3a646">http://localhost:3000</code></dd> <dt class="svelte-c3a646">Test Credentials:</dt> <dd class="svelte-c3a646"><code class="svelte-c3a646">admin@bds.com</code> / <code class="svelte-c3a646">password123</code></dd> <dt class="svelte-c3a646">Expected Results:</dt> <dd class="svelte-c3a646"><ul class="svelte-c3a646"><li class="svelte-c3a646">Test 1: Should load ~67 PUBLIC skills</li> <li class="svelte-c3a646">Test 2: Should authenticate successfully</li> <li class="svelte-c3a646">Test 3: Should load all 120 skills (67 PUBLIC + 53 BDS_ONLY)</li> <li class="svelte-c3a646">Test 4: Should retrieve specific skill details</li> <li class="svelte-c3a646">Test 5: Should invoke skill and get response</li></ul></dd> <dt class="svelte-c3a646">Console Logging:</dt> <dd class="svelte-c3a646">Open browser DevTools Console to see detailed request/response logs</dd></dl>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div>`);
  });
}
export {
  _page as default
};
