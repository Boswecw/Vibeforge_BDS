export function logEvent(
	eventType: string,
	sessionId: string,
	metadata: Record<string, unknown> = {}
) {
	// TODO: send to DataForge telemetry pipeline
	console.log('[telemetry]', { eventType, sessionId, metadata, timestamp: new Date().toISOString() });
}
