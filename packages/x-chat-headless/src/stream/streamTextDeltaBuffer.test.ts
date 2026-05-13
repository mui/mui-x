import { describe, expect, it, vi, afterEach } from 'vitest';
import { ChatStore } from '../store/ChatStore';
import { createTextDeltaBuffer } from './streamTextDeltaBuffer';
import type { ChatMessage } from '../types/chat-entities';

function asUnknown(store: ChatStore): ChatStore<unknown> {
  return store as unknown as ChatStore<unknown>;
}

function createAssistantMessage(parts: ChatMessage['parts'] = []): ChatMessage {
  return {
    id: 'a1',
    role: 'assistant',
    status: 'streaming',
    parts,
  };
}

function setupBuffer(parts: ChatMessage['parts'] = [], flushInterval = 50) {
  const store = new ChatStore();
  const message = createAssistantMessage(parts);
  store.addMessage(message);

  const ensureAssistantMessage = vi.fn(() => store.state.messagesById.a1 as ChatMessage);

  const buffer = createTextDeltaBuffer(asUnknown(store), ensureAssistantMessage, flushInterval);

  return { store, buffer, ensureAssistantMessage };
}

describe('createTextDeltaBuffer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('resolveTextLikePartIndex', () => {
    it('returns the mapped index when the map entry exists and matches part type', () => {
      const { buffer } = setupBuffer([{ type: 'text', text: 'Hello', state: 'streaming' }]);

      // First call creates the mapping
      const index1 = buffer.resolveTextLikePartIndex(
        'text',
        'stream-1',
        buffer.textPartIndexesByStreamId,
      );
      expect(index1).toBe(0);

      // Second call with same streamId returns from map
      const index2 = buffer.resolveTextLikePartIndex(
        'text',
        'stream-1',
        buffer.textPartIndexesByStreamId,
      );
      expect(index2).toBe(0);
    });

    it('creates a new text part when no streaming text part exists', () => {
      const { store, buffer } = setupBuffer([]);

      const index = buffer.resolveTextLikePartIndex(
        'text',
        'stream-1',
        buffer.textPartIndexesByStreamId,
      );

      expect(index).toBe(0);
      const message = store.state.messagesById.a1;
      expect(message.parts[0]).toEqual({ type: 'text', text: '', state: 'streaming' });
    });

    it('creates a new reasoning part when no streaming reasoning part exists', () => {
      const { store, buffer } = setupBuffer([]);

      const index = buffer.resolveTextLikePartIndex(
        'reasoning',
        'stream-2',
        buffer.reasoningPartIndexesByStreamId,
      );

      expect(index).toBe(0);
      const message = store.state.messagesById.a1;
      expect(message.parts[0]).toEqual({ type: 'reasoning', text: '', state: 'streaming' });
    });

    it('falls back to findLastStreamingPartIndex when map entry does not match current parts', () => {
      const { buffer } = setupBuffer([{ type: 'text', text: 'First', state: 'streaming' }]);

      // Artificially set a stale map entry pointing to index 99
      buffer.textPartIndexesByStreamId.set('stream-1', 99);

      const index = buffer.resolveTextLikePartIndex(
        'text',
        'stream-1',
        buffer.textPartIndexesByStreamId,
      );

      // Should fall back to the last streaming text part at index 0
      expect(index).toBe(0);
      expect(buffer.textPartIndexesByStreamId.get('stream-1')).toBe(0);
    });
  });

  describe('applyTextLikeDelta', () => {
    it('appends delta text to the resolved text part', () => {
      const { store, buffer } = setupBuffer([{ type: 'text', text: 'Hello', state: 'streaming' }]);

      buffer.applyTextLikeDelta('text', 'stream-1', ' world');

      const part = store.state.messagesById.a1.parts[0];
      expect(part).toMatchObject({ type: 'text', text: 'Hello world', state: 'streaming' });
    });

    it('appends delta text to a reasoning part', () => {
      const { store, buffer } = setupBuffer([
        { type: 'reasoning', text: 'Thinking...', state: 'streaming' },
      ]);

      buffer.applyTextLikeDelta('reasoning', 'stream-r1', ' more');

      const part = store.state.messagesById.a1.parts[0];
      expect(part).toMatchObject({
        type: 'reasoning',
        text: 'Thinking... more',
        state: 'streaming',
      });
    });

    it('no-ops when the part type does not match at the resolved index', () => {
      const { store, buffer } = setupBuffer([{ type: 'text', text: 'Hello', state: 'streaming' }]);

      // Force a mapping to index 0, but then try to apply a 'reasoning' delta
      buffer.reasoningPartIndexesByStreamId.set('stream-1', 0);

      buffer.applyTextLikeDelta('reasoning', 'stream-1', ' world');

      // The part at index 0 is 'text', not 'reasoning', so it should NOT be updated
      // (after fallback resolves a new part may be created — just verify no crash and text part unchanged)
      expect(store.state.messagesById.a1.parts[0]).toMatchObject({ type: 'text', text: 'Hello' });
    });
  });

  describe('scheduleTextLikeDelta', () => {
    it('buffers a delta and applies it after the flush interval', async () => {
      vi.useFakeTimers();
      const { store, buffer } = setupBuffer([{ type: 'text', text: '', state: 'streaming' }]);

      buffer.scheduleTextLikeDelta('text', 'stream-1', 'Hello');

      // Not applied yet
      expect(store.state.messagesById.a1.parts[0]).toMatchObject({ text: '' });

      await vi.advanceTimersByTimeAsync(50);

      expect(store.state.messagesById.a1.parts[0]).toMatchObject({ text: 'Hello' });
    });

    it('coalesces multiple deltas for the same partType and streamId before flush', async () => {
      vi.useFakeTimers();
      const { store, buffer } = setupBuffer([{ type: 'text', text: '', state: 'streaming' }]);

      buffer.scheduleTextLikeDelta('text', 'stream-1', 'Hello');
      buffer.scheduleTextLikeDelta('text', 'stream-1', ' world');
      buffer.scheduleTextLikeDelta('text', 'stream-1', '!');

      await vi.advanceTimersByTimeAsync(50);

      expect(store.state.messagesById.a1.parts[0]).toMatchObject({ text: 'Hello world!' });
    });

    it('immediately flushes pending delta when partType changes', () => {
      const { store, buffer } = setupBuffer([{ type: 'text', text: '', state: 'streaming' }]);

      buffer.scheduleTextLikeDelta('text', 'stream-1', 'Hello');

      // Scheduling a different partType should flush the pending 'text' delta first
      buffer.scheduleTextLikeDelta('reasoning', 'stream-2', 'Think');

      // The text part should have been applied immediately
      expect(store.state.messagesById.a1.parts[0]).toMatchObject({ type: 'text', text: 'Hello' });
    });

    it('immediately flushes pending delta when streamId changes', () => {
      const { store, buffer } = setupBuffer([{ type: 'text', text: '', state: 'streaming' }]);

      buffer.scheduleTextLikeDelta('text', 'stream-1', 'Part1');

      // Different streamId triggers immediate flush
      buffer.scheduleTextLikeDelta('text', 'stream-2', 'Part2');

      expect(store.state.messagesById.a1.parts[0]).toMatchObject({ text: 'Part1' });
    });
  });

  describe('flushPendingTextLikeDelta', () => {
    it('immediately applies buffered delta and clears the timer', async () => {
      vi.useFakeTimers();
      const { store, buffer } = setupBuffer([{ type: 'text', text: '', state: 'streaming' }]);

      buffer.scheduleTextLikeDelta('text', 'stream-1', 'Immediate');
      buffer.flushPendingTextLikeDelta();

      // Applied right away without waiting for timer
      expect(store.state.messagesById.a1.parts[0]).toMatchObject({ text: 'Immediate' });

      // Timer does NOT apply again
      await vi.advanceTimersByTimeAsync(100);
      expect(store.state.messagesById.a1.parts[0]).toMatchObject({ text: 'Immediate' });
    });

    it('no-ops when there is no pending delta', () => {
      const { store, buffer } = setupBuffer([
        { type: 'text', text: 'Existing', state: 'streaming' },
      ]);
      const stateBefore = store.state;

      buffer.flushPendingTextLikeDelta();

      expect(store.state).toBe(stateBefore);
    });
  });

  describe('clearPendingTextLikeDeltaTimer', () => {
    it('cancels the scheduled timer without applying the pending delta', async () => {
      vi.useFakeTimers();
      const { store, buffer } = setupBuffer([{ type: 'text', text: '', state: 'streaming' }]);

      buffer.scheduleTextLikeDelta('text', 'stream-1', 'Cancelled');
      buffer.clearPendingTextLikeDeltaTimer();

      await vi.advanceTimersByTimeAsync(200);

      // The delta was not applied since the timer was cleared
      // (the pending delta itself is still in memory but the timer is gone)
      expect(store.state.messagesById.a1.parts[0]).toMatchObject({ text: '' });
    });
  });
});
