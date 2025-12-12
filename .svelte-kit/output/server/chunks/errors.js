function classifyError(error) {
  const id = generateErrorId();
  const timestamp = /* @__PURE__ */ new Date();
  if (isAppError(error)) {
    return { ...error, id, timestamp };
  }
  if (error instanceof Response) {
    return classifyResponseError(error, id, timestamp);
  }
  if (error instanceof TypeError) {
    return {
      id,
      category: "NETWORK",
      severity: "HIGH",
      message: error.message,
      userMessage: "Network connection error. Please check your internet connection.",
      timestamp,
      retryable: true,
      retryAfter: 5e3,
      originalError: error
    };
  }
  if (error instanceof Error) {
    if (error.message.includes("timeout")) {
      return {
        id,
        category: "TIMEOUT",
        severity: "MEDIUM",
        message: error.message,
        userMessage: "Request timed out. Please try again.",
        timestamp,
        retryable: true,
        retryAfter: 3e3,
        originalError: error
      };
    }
    if (error.message.includes("not found") || error.message.includes("404")) {
      return {
        id,
        category: "NOT_FOUND",
        severity: "MEDIUM",
        message: error.message,
        userMessage: "Resource not found.",
        timestamp,
        retryable: false,
        originalError: error
      };
    }
    return {
      id,
      category: "UNKNOWN",
      severity: "MEDIUM",
      message: error.message,
      userMessage: "An unexpected error occurred. Please try again.",
      timestamp,
      retryable: true,
      retryAfter: 3e3,
      originalError: error
    };
  }
  if (typeof error === "string") {
    return {
      id,
      category: "UNKNOWN",
      severity: "LOW",
      message: error,
      userMessage: error,
      timestamp,
      retryable: true
    };
  }
  return {
    id,
    category: "UNKNOWN",
    severity: "MEDIUM",
    message: "Unknown error",
    userMessage: "An unexpected error occurred. Please try again.",
    details: JSON.stringify(error),
    timestamp,
    retryable: true
  };
}
function classifyResponseError(response, id, timestamp) {
  const { status, statusText } = response;
  const baseError = {
    id,
    timestamp,
    statusCode: status,
    details: statusText
  };
  if (status >= 400 && status < 500) {
    switch (status) {
      case 400:
        return {
          ...baseError,
          category: "VALIDATION",
          severity: "LOW",
          message: "Invalid request",
          userMessage: "Invalid input. Please check your data and try again.",
          retryable: false
        };
      case 401:
        return {
          ...baseError,
          category: "AUTHENTICATION",
          severity: "HIGH",
          message: "Authentication required",
          userMessage: "You need to log in to access this resource.",
          retryable: false
        };
      case 403:
        return {
          ...baseError,
          category: "AUTHORIZATION",
          severity: "HIGH",
          message: "Access forbidden",
          userMessage: "You don't have permission to access this resource.",
          retryable: false
        };
      case 404:
        return {
          ...baseError,
          category: "NOT_FOUND",
          severity: "MEDIUM",
          message: "Resource not found",
          userMessage: "The requested resource was not found.",
          retryable: false
        };
      case 429: {
        const retryAfterHeader = response.headers.get("Retry-After");
        let retryAfter = 6e4;
        if (retryAfterHeader) {
          const retryAfterSeconds = parseInt(retryAfterHeader, 10);
          if (!isNaN(retryAfterSeconds)) {
            retryAfter = retryAfterSeconds * 1e3;
          } else {
            const retryDate = new Date(retryAfterHeader);
            if (!isNaN(retryDate.getTime())) {
              retryAfter = Math.max(0, retryDate.getTime() - Date.now());
            }
          }
        }
        return {
          ...baseError,
          category: "RATE_LIMIT",
          severity: "MEDIUM",
          message: "Rate limit exceeded",
          userMessage: `Too many requests. Please wait ${Math.ceil(retryAfter / 1e3)} seconds and try again.`,
          retryable: true,
          retryAfter
        };
      }
      default:
        return {
          ...baseError,
          category: "API",
          severity: "MEDIUM",
          message: `Client error: ${status}`,
          userMessage: "Request failed. Please check your input and try again.",
          retryable: false
        };
    }
  }
  if (status >= 500) {
    return {
      ...baseError,
      category: "SERVER",
      severity: "HIGH",
      message: `Server error: ${status}`,
      userMessage: "Server error. Please try again later.",
      retryable: true,
      retryAfter: 1e4
    };
  }
  return {
    ...baseError,
    category: "API",
    severity: "MEDIUM",
    message: `HTTP error: ${status}`,
    userMessage: "Request failed. Please try again.",
    retryable: true
  };
}
function createNetworkError(message, details) {
  return {
    id: generateErrorId(),
    category: "NETWORK",
    severity: "HIGH",
    message,
    userMessage: "Network error. Please check your connection.",
    details,
    timestamp: /* @__PURE__ */ new Date(),
    retryable: true,
    retryAfter: 5e3
  };
}
function createAuthenticationError(message) {
  return {
    id: generateErrorId(),
    category: "AUTHENTICATION",
    severity: "HIGH",
    message,
    userMessage: "Authentication required. Please log in.",
    timestamp: /* @__PURE__ */ new Date(),
    retryable: false
  };
}
function isAppError(error) {
  return typeof error === "object" && error !== null && "category" in error && "severity" in error && "message" in error && "userMessage" in error;
}
function generateErrorId() {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function shouldRetry(error, attemptCount, maxAttempts = 3) {
  if (!error.retryable) return false;
  if (attemptCount >= maxAttempts) return false;
  if (error.category === "VALIDATION" || error.category === "AUTHENTICATION" || error.category === "AUTHORIZATION" || error.category === "NOT_FOUND") {
    return false;
  }
  return true;
}
function getRetryDelay(error, attemptCount) {
  if (error.retryAfter) {
    return error.retryAfter;
  }
  return Math.min(1e3 * Math.pow(2, attemptCount), 3e4);
}
function logError(error, context) {
  const log = {
    error,
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...context
  };
  try {
    const errorHistory = JSON.parse(localStorage.getItem("vibeforge_error_log") || "[]");
    errorHistory.push(log);
    if (errorHistory.length > 50) {
      errorHistory.shift();
    }
    localStorage.setItem("vibeforge_error_log", JSON.stringify(errorHistory));
  } catch (e) {
    console.error("Failed to store error log:", e);
  }
}
function getErrorBadgeVariant(severity) {
  switch (severity) {
    case "CRITICAL":
    case "HIGH":
      return "error";
    case "MEDIUM":
      return "warning";
    case "LOW":
      return "info";
    default:
      return "info";
  }
}
export {
  getRetryDelay as a,
  createNetworkError as b,
  classifyError as c,
  createAuthenticationError as d,
  getErrorBadgeVariant as g,
  logError as l,
  shouldRetry as s
};
