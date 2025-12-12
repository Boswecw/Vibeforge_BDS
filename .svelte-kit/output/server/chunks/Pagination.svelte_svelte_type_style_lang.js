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
export {
  tokenManager as t
};
