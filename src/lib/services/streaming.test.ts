/**
 * Streaming Service Tests
 *
 * Tests for SSE streaming functionality.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { streamingService } from './streaming';

// Mock EventSource
class MockEventSource {
	url: string;
	listeners: Map<string, ((event: MessageEvent) => void)[]> = new Map();
	onopen: (() => void) | null = null;
	onerror: (() => void) | null = null;
	readyState: number = 0;

	constructor(url: string) {
		this.url = url;
		// Simulate connection
		setTimeout(() => {
			this.readyState = 1;
			if (this.onopen) this.onopen();
			// Trigger open event
			const openListeners = this.listeners.get('open') || [];
			openListeners.forEach((listener) => {
				listener(new MessageEvent('open'));
			});
		}, 0);
	}

	addEventListener(type: string, listener: (event: MessageEvent) => void): void {
		const listeners = this.listeners.get(type) || [];
		listeners.push(listener);
		this.listeners.set(type, listeners);
	}

	removeEventListener(type: string, listener: (event: MessageEvent) => void): void {
		const listeners = this.listeners.get(type) || [];
		const index = listeners.indexOf(listener);
		if (index > -1) {
			listeners.splice(index, 1);
		}
	}

	close(): void {
		this.readyState = 2;
	}

	// Helper method to simulate events
	simulateEvent(type: string, data: string): void {
		const listeners = this.listeners.get(type) || [];
		const event = new MessageEvent(type, { data });
		listeners.forEach((listener) => listener(event));
	}
}

// Replace global EventSource with mock
global.EventSource = MockEventSource as unknown as typeof EventSource;

describe('Streaming Service', () => {
	let mockEventSource: MockEventSource;

	beforeEach(() => {
		streamingService.closeAll();
		vi.clearAllMocks();
	});

	afterEach(() => {
		streamingService.closeAll();
	});

	describe('Subscription', () => {
		it('should create a subscription', () => {
			const subscription = streamingService.subscribe('http://localhost:8787/stream');

			expect(subscription).toBeDefined();
			expect(subscription.isActive).toBe(true);
			expect(subscription.isPaused).toBe(false);

			subscription.close();
		});

		it('should handle chunk events', async () => {
			const onChunk = vi.fn();

			const subscription = streamingService.subscribe('http://localhost:8787/stream', {
				onChunk
			});

			// Wait for connection
			await new Promise((resolve) => setTimeout(resolve, 10));

			// Get the mock event source
			const streams = Array.from((streamingService as unknown as { activeStreams: Map<string, MockEventSource> }).activeStreams.values());
			mockEventSource = streams[0];

			// Simulate chunk event
			const chunkData = JSON.stringify({
				type: 'chunk',
				data: { content: 'Hello World' },
				timestamp: new Date()
			});

			mockEventSource.simulateEvent('chunk', chunkData);

			expect(onChunk).toHaveBeenCalledWith('Hello World');

			subscription.close();
		});

		it('should handle stage_start events', async () => {
			const onStageStart = vi.fn();

			const subscription = streamingService.subscribe('http://localhost:8787/stream', {
				onStageStart
			});

			await new Promise((resolve) => setTimeout(resolve, 10));

			const streams = Array.from((streamingService as unknown as { activeStreams: Map<string, MockEventSource> }).activeStreams.values());
			mockEventSource = streams[0];

			const stageData = JSON.stringify({
				type: 'stage_start',
				data: { stage: 'PLAN' },
				timestamp: new Date()
			});

			mockEventSource.simulateEvent('stage_start', stageData);

			expect(onStageStart).toHaveBeenCalledWith('PLAN');

			subscription.close();
		});

		it('should handle stage_end events', async () => {
			const onStageEnd = vi.fn();

			const subscription = streamingService.subscribe('http://localhost:8787/stream', {
				onStageEnd
			});

			await new Promise((resolve) => setTimeout(resolve, 10));

			const streams = Array.from((streamingService as unknown as { activeStreams: Map<string, MockEventSource> }).activeStreams.values());
			mockEventSource = streams[0];

			const stageData = JSON.stringify({
				type: 'stage_end',
				data: {
					stage: 'PLAN',
					output: { test: 'data' }
				},
				timestamp: new Date()
			});

			mockEventSource.simulateEvent('stage_end', stageData);

			expect(onStageEnd).toHaveBeenCalledWith('PLAN', { test: 'data' });

			subscription.close();
		});

		it('should handle complete events', async () => {
			const onComplete = vi.fn();

			const subscription = streamingService.subscribe('http://localhost:8787/stream', {
				onComplete
			});

			await new Promise((resolve) => setTimeout(resolve, 10));

			const streams = Array.from((streamingService as unknown as { activeStreams: Map<string, MockEventSource> }).activeStreams.values());
			mockEventSource = streams[0];

			const completeData = JSON.stringify({
				type: 'complete',
				data: { result: { final: 'result' } },
				timestamp: new Date()
			});

			mockEventSource.simulateEvent('complete', completeData);

			expect(onComplete).toHaveBeenCalledWith({ final: 'result' });

			// Stream should auto-close on complete
			await new Promise((resolve) => setTimeout(resolve, 10));
			expect(subscription.isActive).toBe(false);
		});
	});

	describe('Pause and Resume', () => {
		it('should pause and resume stream', async () => {
			const onChunk = vi.fn();

			const subscription = streamingService.subscribe('http://localhost:8787/stream', {
				onChunk
			});

			await new Promise((resolve) => setTimeout(resolve, 10));

			const streams = Array.from((streamingService as unknown as { activeStreams: Map<string, MockEventSource> }).activeStreams.values());
			mockEventSource = streams[0];

			// Pause the stream
			subscription.pause();
			expect(subscription.isPaused).toBe(true);

			// Simulate chunk while paused
			const chunkData = JSON.stringify({
				type: 'chunk',
				data: { content: 'Paused message' },
				timestamp: new Date()
			});

			mockEventSource.simulateEvent('chunk', chunkData);

			// Should not receive message while paused
			expect(onChunk).not.toHaveBeenCalled();

			// Resume the stream
			subscription.resume();
			expect(subscription.isPaused).toBe(false);

			// Simulate chunk after resume
			mockEventSource.simulateEvent('chunk', chunkData);

			// Should receive message after resume
			expect(onChunk).toHaveBeenCalledWith('Paused message');

			subscription.close();
		});
	});

	describe('Close', () => {
		it('should close a subscription', async () => {
			const subscription = streamingService.subscribe('http://localhost:8787/stream');

			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(subscription.isActive).toBe(true);
			expect(streamingService.activeStreamCount).toBe(1);

			subscription.close();

			expect(subscription.isActive).toBe(false);
			expect(streamingService.activeStreamCount).toBe(0);
		});

		it('should close all subscriptions', async () => {
			const sub1 = streamingService.subscribe('http://localhost:8787/stream1');
			const sub2 = streamingService.subscribe('http://localhost:8787/stream2');

			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(streamingService.activeStreamCount).toBe(2);

			streamingService.closeAll();

			expect(streamingService.activeStreamCount).toBe(0);
			// Note: Individual subscriptions maintain their own state independently
		});
	});

	describe('Error Handling', () => {
		it('should handle malformed chunk data', async () => {
			const onChunk = vi.fn();
			const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

			const subscription = streamingService.subscribe('http://localhost:8787/stream', {
				onChunk
			});

			await new Promise((resolve) => setTimeout(resolve, 10));

			const streams = Array.from((streamingService as unknown as { activeStreams: Map<string, MockEventSource> }).activeStreams.values());
			mockEventSource = streams[0];

			// Simulate malformed chunk
			mockEventSource.simulateEvent('chunk', 'invalid json');

			// Should not call onChunk with invalid data
			expect(onChunk).not.toHaveBeenCalled();
			expect(consoleError).toHaveBeenCalled();

			subscription.close();
			consoleError.mockRestore();
		});

		it('should not process events after close', async () => {
			const onChunk = vi.fn();

			const subscription = streamingService.subscribe('http://localhost:8787/stream', {
				onChunk
			});

			await new Promise((resolve) => setTimeout(resolve, 10));

			const streams = Array.from((streamingService as unknown as { activeStreams: Map<string, MockEventSource> }).activeStreams.values());
			mockEventSource = streams[0];

			subscription.close();

			// Try to send chunk after close
			const chunkData = JSON.stringify({
				type: 'chunk',
				data: { content: 'After close' },
				timestamp: new Date()
			});

			mockEventSource.simulateEvent('chunk', chunkData);

			// Should not receive messages after close
			expect(onChunk).not.toHaveBeenCalled();
		});
	});
});
