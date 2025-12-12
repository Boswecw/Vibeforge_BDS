import "workbox-window";
const STORAGE_KEY = "forge_auth_tokens";
function isTauriEnvironment() {
  return typeof window !== "undefined" && "__TAURI__" in window;
}
async function getTauriInvoke() {
  if (isTauriEnvironment()) {
    try {
      const tauriCore = await import("@tauri-apps/api/core");
      return tauriCore.invoke;
    } catch {
      return null;
    }
  }
  return null;
}
class TokenManager {
  accessToken = null;
  refreshToken = null;
  expiresAt = null;
  constructor() {
    this.initialize().catch((err) => console.warn("TokenManager init failed:", err));
  }
  async initialize() {
    try {
      if (typeof window === "undefined") return;
      const invoke = await getTauriInvoke();
      if (invoke) {
        const stored = await invoke("load_tokens");
        if (stored) {
          this.accessToken = stored.accessToken;
          this.refreshToken = stored.refreshToken;
          this.expiresAt = new Date(stored.expiresAt).getTime();
        }
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          this.accessToken = data.accessToken;
          this.refreshToken = data.refreshToken;
          this.expiresAt = new Date(data.expiresAt).getTime();
        }
      }
    } catch (err) {
      console.warn("Token load failed:", err);
    }
  }
  async setTokens(accessToken, refreshToken, expiresAt) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = new Date(expiresAt).getTime();
    if (typeof window === "undefined") return;
    try {
      const invoke = await getTauriInvoke();
      if (invoke) {
        await invoke("save_tokens", { accessToken, refreshToken, expiresAt });
      } else {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ accessToken, refreshToken, expiresAt })
        );
      }
    } catch (err) {
      console.error("Token save failed:", err);
      throw err;
    }
  }
  async clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
    if (typeof window === "undefined") return;
    try {
      const invoke = await getTauriInvoke();
      if (invoke) {
        await invoke("clear_tokens");
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.warn("Token clear failed:", err);
    }
  }
  getAccessToken() {
    if (this.expiresAt && Date.now() >= this.expiresAt - 6e4) return null;
    return this.accessToken;
  }
  getRefreshToken() {
    return this.refreshToken;
  }
  isAuthenticated() {
    return !!this.getAccessToken();
  }
  isExpiringSoon() {
    if (!this.expiresAt) return true;
    return Date.now() >= this.expiresAt - 3e5;
  }
}
const tokenManager = new TokenManager();
class LRUCache {
  cache;
  maxSize;
  ttl;
  hits = 0;
  misses = 0;
  constructor(options = {}) {
    this.cache = /* @__PURE__ */ new Map();
    this.maxSize = options.maxSize ?? 100;
    this.ttl = options.ttl ?? 5 * 60 * 1e3;
  }
  /**
   * Get a value from the cache
   * Returns null if key doesn't exist or entry has expired
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    this.cache.delete(key);
    this.cache.set(key, entry);
    this.hits++;
    return entry.value;
  }
  /**
   * Set a value in the cache
   * If cache is full, removes the least recently used entry
   */
  set(key, value, customTtl) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== void 0) {
        this.cache.delete(firstKey);
      }
    }
    const ttl = customTtl ?? this.ttl;
    const entry = {
      value,
      expiresAt: Date.now() + ttl
    };
    this.cache.set(key, entry);
  }
  /**
   * Check if a key exists and is not expired
   */
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
  /**
   * Delete a specific key from the cache
   */
  delete(key) {
    return this.cache.delete(key);
  }
  /**
   * Clear all entries from the cache
   */
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
  /**
   * Remove all expired entries
   */
  prune() {
    const now = Date.now();
    let pruned = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        pruned++;
      }
    }
    return pruned;
  }
  /**
   * Get cache statistics
   */
  getStats() {
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }
  /**
   * Get hit rate percentage
   */
  getHitRate() {
    const total = this.hits + this.misses;
    return total === 0 ? 0 : this.hits / total * 100;
  }
  /**
   * Get all keys in the cache (for debugging)
   */
  keys() {
    return Array.from(this.cache.keys());
  }
  /**
   * Get cache size
   */
  size() {
    return this.cache.size;
  }
}
function generateCacheKey(endpoint, params, userId) {
  const parts = [endpoint];
  if (params) {
    const sortedParams = Object.keys(params).sort().map((key) => `${key}=${JSON.stringify(params[key])}`).join("&");
    parts.push(sortedParams);
  }
  return parts.join("|");
}
async function staleWhileRevalidate(key, fetchFn, cache, onRevalidate) {
  const cached = cache.get(key);
  if (cached !== null) {
    fetchFn().then((fresh2) => {
      cache.set(key, fresh2);
    }).catch((error) => {
      console.warn(`Failed to revalidate cache for key: ${key}`, error);
    });
    return cached;
  }
  const fresh = await fetchFn();
  cache.set(key, fresh);
  return fresh;
}
new LRUCache({
  maxSize: 100,
  ttl: 5 * 60 * 1e3
  // 5 minutes
});
const skillsCache = new LRUCache({
  maxSize: 50,
  ttl: 10 * 60 * 1e3
  // 10 minutes
});
const userCache = new LRUCache({
  maxSize: 50,
  ttl: 2 * 60 * 1e3
  // 2 minutes
});
let updateAvailable = $state(false);
$state(false);
const serviceWorkerState = {
  get updateAvailable() {
    return updateAvailable;
  }
};
export {
  skillsCache as a,
  staleWhileRevalidate as b,
  generateCacheKey as g,
  serviceWorkerState as s,
  tokenManager as t,
  userCache as u
};
