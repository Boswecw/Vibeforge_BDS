import { backendConfig } from "$lib/config/backend";

export interface TelemetryEvent {
  eventType: string;
  sessionId: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

// Buffer for batching telemetry events
let eventBuffer: TelemetryEvent[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;
const BUFFER_SIZE = 10;
const FLUSH_INTERVAL = 5000; // 5 seconds

/**
 * Send telemetry events to DataForge pipeline
 */
async function sendToDataForge(events: TelemetryEvent[]): Promise<void> {
  if (events.length === 0) return;

  try {
    const response = await fetch(
      `${backendConfig.dataForgeBaseUrl}/api/telemetry`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...backendConfig.getAuthHeaders(),
        },
        body: JSON.stringify({ events }),
      }
    );

    if (!response.ok) {
      console.warn(
        "[telemetry] Failed to send events:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    // Log locally if DataForge is unavailable
    console.warn(
      "[telemetry] DataForge unavailable, events logged locally:",
      events
    );
  }
}

/**
 * Flush buffered events to DataForge
 */
async function flushEvents(): Promise<void> {
  if (eventBuffer.length === 0) return;

  const eventsToSend = [...eventBuffer];
  eventBuffer = [];

  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }

  await sendToDataForge(eventsToSend);
}

/**
 * Schedule a flush if not already scheduled
 */
function scheduleFlush(): void {
  if (flushTimeout) return;
  flushTimeout = setTimeout(() => {
    flushTimeout = null;
    flushEvents();
  }, FLUSH_INTERVAL);
}

/**
 * Log a telemetry event
 * Events are buffered and sent to DataForge in batches
 */
export function logEvent(
  eventType: string,
  sessionId: string,
  metadata: Record<string, unknown> = {}
): void {
  const event: TelemetryEvent = {
    eventType,
    sessionId,
    timestamp: new Date().toISOString(),
    metadata,
  };

  // Always log to console in development
  if (import.meta.env.DEV) {
    console.log("[telemetry]", event);
  }

  // Add to buffer
  eventBuffer.push(event);

  // Flush immediately if buffer is full, otherwise schedule
  if (eventBuffer.length >= BUFFER_SIZE) {
    flushEvents();
  } else {
    scheduleFlush();
  }
}

/**
 * Force flush all pending events (call before page unload)
 */
export function flushTelemetry(): Promise<void> {
  return flushEvents();
}

/**
 * Track agent session lifecycle events
 */
export function trackSessionStart(agentType: string, sessionId: string): void {
  logEvent("session_start", sessionId, { agentType });
}

export function trackSessionEnd(
  agentType: string,
  sessionId: string,
  status: string
): void {
  logEvent("session_end", sessionId, { agentType, status });
}

export function trackError(
  sessionId: string,
  error: string,
  context?: Record<string, unknown>
): void {
  logEvent("error", sessionId, { error, ...context });
}

export function trackPerformance(
  sessionId: string,
  operation: string,
  durationMs: number
): void {
  logEvent("performance", sessionId, { operation, durationMs });
}
