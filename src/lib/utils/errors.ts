/**
 * Error Handling Utilities for VibeForge BDS
 *
 * Provides comprehensive error handling, classification, and user-friendly messaging.
 */

// ═══════════════════════════════════════════════════════════════════════
// Error Types
// ═══════════════════════════════════════════════════════════════════════

export enum ErrorCategory {
	NETWORK = 'NETWORK',
	API = 'API',
	VALIDATION = 'VALIDATION',
	AUTHENTICATION = 'AUTHENTICATION',
	AUTHORIZATION = 'AUTHORIZATION',
	NOT_FOUND = 'NOT_FOUND',
	RATE_LIMIT = 'RATE_LIMIT',
	SERVER = 'SERVER',
	TIMEOUT = 'TIMEOUT',
	UNKNOWN = 'UNKNOWN'
}

export enum ErrorSeverity {
	LOW = 'LOW', // User can continue, minor issue
	MEDIUM = 'MEDIUM', // Feature degraded but app functional
	HIGH = 'HIGH', // Feature broken, app still usable
	CRITICAL = 'CRITICAL' // App broken, requires immediate attention
}

export interface AppError {
	id: string;
	category: ErrorCategory;
	severity: ErrorSeverity;
	message: string;
	userMessage: string;
	details?: string;
	statusCode?: number;
	timestamp: Date;
	context?: Record<string, any>;
	originalError?: Error;
	retryable: boolean;
	retryAfter?: number; // milliseconds
}

// ═══════════════════════════════════════════════════════════════════════
// Error Classification
// ═══════════════════════════════════════════════════════════════════════

export function classifyError(error: unknown): AppError {
	const id = generateErrorId();
	const timestamp = new Date();

	// Handle AppError (already classified)
	if (isAppError(error)) {
		return { ...error, id, timestamp };
	}

	// Handle Response errors (fetch API)
	if (error instanceof Response) {
		return classifyResponseError(error, id, timestamp);
	}

	// Handle TypeError (network errors, CORS, etc.)
	if (error instanceof TypeError) {
		return {
			id,
			category: ErrorCategory.NETWORK,
			severity: ErrorSeverity.HIGH,
			message: error.message,
			userMessage: 'Network connection error. Please check your internet connection.',
			timestamp,
			retryable: true,
			retryAfter: 5000,
			originalError: error
		};
	}

	// Handle standard Error
	if (error instanceof Error) {
		// Check for specific error patterns
		if (error.message.includes('timeout')) {
			return {
				id,
				category: ErrorCategory.TIMEOUT,
				severity: ErrorSeverity.MEDIUM,
				message: error.message,
				userMessage: 'Request timed out. Please try again.',
				timestamp,
				retryable: true,
				retryAfter: 3000,
				originalError: error
			};
		}

		if (error.message.includes('not found') || error.message.includes('404')) {
			return {
				id,
				category: ErrorCategory.NOT_FOUND,
				severity: ErrorSeverity.MEDIUM,
				message: error.message,
				userMessage: 'Resource not found.',
				timestamp,
				retryable: false,
				originalError: error
			};
		}

		return {
			id,
			category: ErrorCategory.UNKNOWN,
			severity: ErrorSeverity.MEDIUM,
			message: error.message,
			userMessage: 'An unexpected error occurred. Please try again.',
			timestamp,
			retryable: true,
			retryAfter: 3000,
			originalError: error
		};
	}

	// Handle string errors
	if (typeof error === 'string') {
		return {
			id,
			category: ErrorCategory.UNKNOWN,
			severity: ErrorSeverity.LOW,
			message: error,
			userMessage: error,
			timestamp,
			retryable: true
		};
	}

	// Handle unknown error types
	return {
		id,
		category: ErrorCategory.UNKNOWN,
		severity: ErrorSeverity.MEDIUM,
		message: 'Unknown error',
		userMessage: 'An unexpected error occurred. Please try again.',
		details: JSON.stringify(error),
		timestamp,
		retryable: true
	};
}

function classifyResponseError(response: Response, id: string, timestamp: Date): AppError {
	const { status, statusText } = response;

	const baseError = {
		id,
		timestamp,
		statusCode: status,
		details: statusText
	};

	// 4xx Client Errors
	if (status >= 400 && status < 500) {
		switch (status) {
			case 400:
				return {
					...baseError,
					category: ErrorCategory.VALIDATION,
					severity: ErrorSeverity.LOW,
					message: 'Invalid request',
					userMessage: 'Invalid input. Please check your data and try again.',
					retryable: false
				};

			case 401:
				return {
					...baseError,
					category: ErrorCategory.AUTHENTICATION,
					severity: ErrorSeverity.HIGH,
					message: 'Authentication required',
					userMessage: 'You need to log in to access this resource.',
					retryable: false
				};

			case 403:
				return {
					...baseError,
					category: ErrorCategory.AUTHORIZATION,
					severity: ErrorSeverity.HIGH,
					message: 'Access forbidden',
					userMessage: "You don't have permission to access this resource.",
					retryable: false
				};

			case 404:
				return {
					...baseError,
					category: ErrorCategory.NOT_FOUND,
					severity: ErrorSeverity.MEDIUM,
					message: 'Resource not found',
					userMessage: 'The requested resource was not found.',
					retryable: false
				};

			case 429: {
				// Parse Retry-After header (seconds or HTTP date)
				const retryAfterHeader = response.headers.get('Retry-After');
				let retryAfter = 60000; // Default: 1 minute

				if (retryAfterHeader) {
					const retryAfterSeconds = parseInt(retryAfterHeader, 10);
					if (!isNaN(retryAfterSeconds)) {
						// Header is in seconds
						retryAfter = retryAfterSeconds * 1000;
					} else {
						// Header might be HTTP date - calculate difference
						const retryDate = new Date(retryAfterHeader);
						if (!isNaN(retryDate.getTime())) {
							retryAfter = Math.max(0, retryDate.getTime() - Date.now());
						}
					}
				}

				return {
					...baseError,
					category: ErrorCategory.RATE_LIMIT,
					severity: ErrorSeverity.MEDIUM,
					message: 'Rate limit exceeded',
					userMessage: `Too many requests. Please wait ${Math.ceil(retryAfter / 1000)} seconds and try again.`,
					retryable: true,
					retryAfter
				};
			}

			default:
				return {
					...baseError,
					category: ErrorCategory.API,
					severity: ErrorSeverity.MEDIUM,
					message: `Client error: ${status}`,
					userMessage: 'Request failed. Please check your input and try again.',
					retryable: false
				};
		}
	}

	// 5xx Server Errors
	if (status >= 500) {
		return {
			...baseError,
			category: ErrorCategory.SERVER,
			severity: ErrorSeverity.HIGH,
			message: `Server error: ${status}`,
			userMessage: 'Server error. Please try again later.',
			retryable: true,
			retryAfter: 10000
		};
	}

	// Other status codes
	return {
		...baseError,
		category: ErrorCategory.API,
		severity: ErrorSeverity.MEDIUM,
		message: `HTTP error: ${status}`,
		userMessage: 'Request failed. Please try again.',
		retryable: true
	};
}

// ═══════════════════════════════════════════════════════════════════════
// Error Creation Helpers
// ═══════════════════════════════════════════════════════════════════════

export function createNetworkError(message: string, details?: string): AppError {
	return {
		id: generateErrorId(),
		category: ErrorCategory.NETWORK,
		severity: ErrorSeverity.HIGH,
		message,
		userMessage: 'Network error. Please check your connection.',
		details,
		timestamp: new Date(),
		retryable: true,
		retryAfter: 5000
	};
}

export function createValidationError(message: string, context?: Record<string, any>): AppError {
	return {
		id: generateErrorId(),
		category: ErrorCategory.VALIDATION,
		severity: ErrorSeverity.LOW,
		message,
		userMessage: message,
		context,
		timestamp: new Date(),
		retryable: false
	};
}

export function createAuthenticationError(message: string): AppError {
	return {
		id: generateErrorId(),
		category: ErrorCategory.AUTHENTICATION,
		severity: ErrorSeverity.HIGH,
		message,
		userMessage: 'Authentication required. Please log in.',
		timestamp: new Date(),
		retryable: false
	};
}

export function createNotFoundError(resource: string): AppError {
	return {
		id: generateErrorId(),
		category: ErrorCategory.NOT_FOUND,
		severity: ErrorSeverity.MEDIUM,
		message: `${resource} not found`,
		userMessage: `${resource} not found.`,
		timestamp: new Date(),
		retryable: false
	};
}

// ═══════════════════════════════════════════════════════════════════════
// Error Utilities
// ═══════════════════════════════════════════════════════════════════════

export function isAppError(error: unknown): error is AppError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'category' in error &&
		'severity' in error &&
		'message' in error &&
		'userMessage' in error
	);
}

export function generateErrorId(): string {
	return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function shouldRetry(error: AppError, attemptCount: number, maxAttempts = 3): boolean {
	if (!error.retryable) return false;
	if (attemptCount >= maxAttempts) return false;

	// Don't retry validation, auth, or not found errors
	if (
		error.category === ErrorCategory.VALIDATION ||
		error.category === ErrorCategory.AUTHENTICATION ||
		error.category === ErrorCategory.AUTHORIZATION ||
		error.category === ErrorCategory.NOT_FOUND
	) {
		return false;
	}

	return true;
}

export function getRetryDelay(error: AppError, attemptCount: number): number {
	// Use error's retry delay if specified
	if (error.retryAfter) {
		return error.retryAfter;
	}

	// Exponential backoff: 1s, 2s, 4s, 8s, ...
	return Math.min(1000 * Math.pow(2, attemptCount), 30000);
}

// ═══════════════════════════════════════════════════════════════════════
// Error Logging
// ═══════════════════════════════════════════════════════════════════════

export interface ErrorLog {
	error: AppError;
	userAgent?: string;
	url?: string;
	userId?: string;
}

export function logError(error: AppError, context?: Partial<ErrorLog>): void {
	const log: ErrorLog = {
		error,
		userAgent: navigator.userAgent,
		url: window.location.href,
		...context
	};

	// Log to console in development
	if (import.meta.env.DEV) {
		console.group(`[Error] ${error.category} - ${error.severity}`);
		console.error('Message:', error.message);
		console.error('User Message:', error.userMessage);
		if (error.details) console.error('Details:', error.details);
		if (error.context) console.error('Context:', error.context);
		if (error.originalError) console.error('Original Error:', error.originalError);
		console.error('Full Log:', log);
		console.groupEnd();
	}

	// Store in localStorage for debugging
	try {
		const errorHistory = JSON.parse(localStorage.getItem('vibeforge_error_log') || '[]');
		errorHistory.push(log);

		// Keep only last 50 errors
		if (errorHistory.length > 50) {
			errorHistory.shift();
		}

		localStorage.setItem('vibeforge_error_log', JSON.stringify(errorHistory));
	} catch (e) {
		console.error('Failed to store error log:', e);
	}

	// In production, you would send to error tracking service
	// e.g., Sentry, LogRocket, etc.
	// if (import.meta.env.PROD) {
	//   sendToErrorTracking(log);
	// }
}

export function clearErrorLog(): void {
	localStorage.removeItem('vibeforge_error_log');
}

export function getErrorLog(): ErrorLog[] {
	try {
		return JSON.parse(localStorage.getItem('vibeforge_error_log') || '[]');
	} catch {
		return [];
	}
}

// ═══════════════════════════════════════════════════════════════════════
// Error Formatting
// ═══════════════════════════════════════════════════════════════════════

export function formatErrorForUser(error: AppError): string {
	let message = error.userMessage;

	// Add error ID for support reference
	message += `\n\nError ID: ${error.id}`;

	// Add retry suggestion if retryable
	if (error.retryable) {
		message += '\n\nPlease try again.';
	}

	return message;
}

export function getErrorBadgeVariant(
	severity: ErrorSeverity
): 'error' | 'warning' | 'info' | 'success' {
	switch (severity) {
		case ErrorSeverity.CRITICAL:
		case ErrorSeverity.HIGH:
			return 'error';
		case ErrorSeverity.MEDIUM:
			return 'warning';
		case ErrorSeverity.LOW:
			return 'info';
		default:
			return 'info';
	}
}
