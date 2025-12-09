/**
 * SSE Streaming Service
 *
 * Handles Server-Sent Events (SSE) streaming for real-time agent output.
 */

import type { StreamChunk } from '$lib/types/agents';
import { classifyError, createNetworkError, type AppError } from '$lib/utils/errors';

// ═══════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════

export interface StreamOptions {
	onChunk?: (chunk: string) => void;
	onStageStart?: (stage: string) => void;
	onStageEnd?: (stage: string, output: unknown) => void;
	onComplete?: (result: unknown) => void;
	onError?: (error: AppError) => void;
	reconnect?: boolean;
	reconnectDelay?: number;
	maxReconnectAttempts?: number;
}

export interface StreamSubscription {
	close: () => void;
	pause: () => void;
	resume: () => void;
	readonly isActive: boolean;
	readonly isPaused: boolean;
}

// ═══════════════════════════════════════════════════════════════════════
// Streaming Service
// ═══════════════════════════════════════════════════════════════════════

class StreamingService {
	private activeStreams: Map<string, EventSource> = new Map();

	/**
	 * Subscribe to an SSE stream
	 */
	subscribe(
		url: string,
		options: StreamOptions = {}
	): StreamSubscription {
		const {
			onChunk,
			onStageStart,
			onStageEnd,
			onComplete,
			onError,
			reconnect = true,
			reconnectDelay = 3000,
			maxReconnectAttempts = 5
		} = options;

		let eventSource: EventSource | null = null;
		let reconnectAttempts = 0;
		let isPaused = false;
		let isClosed = false;
		let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

		const connect = () => {
			if (isClosed) return;

			try {
				eventSource = new EventSource(url);
				this.activeStreams.set(url, eventSource);

				// Handle chunk messages
				eventSource.addEventListener('chunk', (event: MessageEvent) => {
					if (isPaused || isClosed) return;

					try {
						const chunk: StreamChunk = JSON.parse(event.data);
						if (chunk.type === 'chunk' && typeof chunk.data === 'object' && chunk.data !== null) {
							const chunkData = chunk.data as { content?: string };
							if (chunkData.content && onChunk) {
								onChunk(chunkData.content);
							}
						}
					} catch (err) {
						console.error('[StreamingService] Failed to parse chunk:', err);
					}
				});

				// Handle stage start
				eventSource.addEventListener('stage_start', (event: MessageEvent) => {
					if (isPaused || isClosed) return;

					try {
						const chunk: StreamChunk = JSON.parse(event.data);
						if (chunk.type === 'stage_start' && typeof chunk.data === 'object' && chunk.data !== null) {
							const stageData = chunk.data as { stage?: string };
							if (stageData.stage && onStageStart) {
								onStageStart(stageData.stage);
							}
						}
					} catch (err) {
						console.error('[StreamingService] Failed to parse stage_start:', err);
					}
				});

				// Handle stage end
				eventSource.addEventListener('stage_end', (event: MessageEvent) => {
					if (isPaused || isClosed) return;

					try {
						const chunk: StreamChunk = JSON.parse(event.data);
						if (chunk.type === 'stage_end' && typeof chunk.data === 'object' && chunk.data !== null) {
							const stageData = chunk.data as { stage?: string; output?: unknown };
							if (stageData.stage && onStageEnd) {
								onStageEnd(stageData.stage, stageData.output);
							}
						}
					} catch (err) {
						console.error('[StreamingService] Failed to parse stage_end:', err);
					}
				});

				// Handle completion
				eventSource.addEventListener('complete', (event: MessageEvent) => {
					if (isPaused || isClosed) return;

					try {
						const chunk: StreamChunk = JSON.parse(event.data);
						if (chunk.type === 'complete' && typeof chunk.data === 'object' && chunk.data !== null) {
							const completeData = chunk.data as { result?: unknown };
							if (onComplete) {
								onComplete(completeData.result);
							}
						}
					} catch (err) {
						console.error('[StreamingService] Failed to parse complete:', err);
					} finally {
						closeStream();
					}
				});

				// Handle errors from stream
				eventSource.addEventListener('error', () => {
					if (isClosed) return;

					const error = createNetworkError('Stream connection error');

					// Attempt reconnection
					if (reconnect && reconnectAttempts < maxReconnectAttempts) {
						reconnectAttempts++;
						console.log(`[StreamingService] Reconnecting (attempt ${reconnectAttempts}/${maxReconnectAttempts})...`);

						eventSource?.close();
						this.activeStreams.delete(url);

						reconnectTimer = setTimeout(() => {
							connect();
						}, reconnectDelay);
					} else {
						if (onError) {
							onError(error);
						}
						closeStream();
					}
				});

				// Reset reconnect attempts on successful connection
				eventSource.addEventListener('open', () => {
					reconnectAttempts = 0;
					console.log('[StreamingService] Stream connected');
				});

			} catch (err) {
				const error = classifyError(err);
				if (onError) {
					onError(error);
				}
				closeStream();
			}
		};

		const closeStream = () => {
			isClosed = true;
			isPaused = false;

			if (reconnectTimer) {
				clearTimeout(reconnectTimer);
				reconnectTimer = null;
			}

			if (eventSource) {
				eventSource.close();
				this.activeStreams.delete(url);
				eventSource = null;
			}
		};

		const pauseStream = () => {
			isPaused = true;
		};

		const resumeStream = () => {
			isPaused = false;
		};

		// Start the connection
		connect();

		// Return subscription interface
		return {
			close: closeStream,
			pause: pauseStream,
			resume: resumeStream,
			get isActive() {
				return !isClosed && eventSource !== null;
			},
			get isPaused() {
				return isPaused;
			}
		};
	}

	/**
	 * Close all active streams
	 */
	closeAll(): void {
		this.activeStreams.forEach((eventSource) => {
			eventSource.close();
		});
		this.activeStreams.clear();
	}

	/**
	 * Get count of active streams
	 */
	get activeStreamCount(): number {
		return this.activeStreams.size;
	}
}

// ═══════════════════════════════════════════════════════════════════════
// Export Singleton
// ═══════════════════════════════════════════════════════════════════════

export const streamingService = new StreamingService();
