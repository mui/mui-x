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

      // Pre-bind the streamId to the existing streaming part.
      buffer.textPartIndexesByStreamId.set('stream-1', 0);

      const index1 = buffer.resolveTextLikePartIndex(
        'text',
        'stream-1',
        buffer.textPartIndexesByStreamId,
      );
      expect(index1).toBe(0);

      // Subsequent calls with the same streamId return the cached index.
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

    it('allocates a fresh streaming part for an unmapped streamId rather than adopting an existing streaming part', () => {
      // Regression for #10: a parallel `text-start` with a different streamId
      // must not adopt a part that already belongs to another concurrent stream.
      const { store, buffer } = setupBuffer([{ type: 'text', text: 'First', state: 'streaming' }]);
      buffer.textPartIndexesByStreamId.set('stream-A', 0);

      const index = buffer.resolveTextLikePartIndex(
        'text',
        'stream-B',
        buffer.textPartIndexesByStreamId,
      );

      expect(index).toBe(1);
      expect(store.state.messagesById.a1.parts).toHaveLength(2);
      expect(store.state.messagesById.a1.parts[1]).toEqual({
        type: 'text',
        text: '',
        state: 'streaming',
      });
      expect(buffer.textPartIndexesByStreamId.get('stream-A')).toBe(0);
      expect(buffer.textPartIndexesByStreamId.get('stream-B')).toBe(1);
    });

    it('allocates a fresh part when the existing mapping points to a finalized (done) part', () => {
      // Regression for #3: a `text-start` for the same streamId after a prior
      // `text-end` must not revive the finished part — it must allocate a new
      // streaming section.
      const { store, buffer } = setupBuffer([{ type: 'text', text: 'First', state: 'done' }]);
      buffer.textPartIndexesByStreamId.set('stream-1', 0);

      const index = buffer.resolveTextLikePartIndex(
        'text',
        'stream-1',
        buffer.textPartIndexesByStreamId,
      );

      expect(index).toBe(1);
      expect(store.state.messagesById.a1.parts[0]).toMatchObject({ state: 'done' });
      expect(store.state.messagesById.a1.parts[1]).toEqual({
        type: 'text',
        text: '',
        state: 'streaming',
      });
      expect(buffer.textPartIndexesByStreamId.get('stream-1')).toBe(1);
    });

    it('returns -1 when createIfMissing=false and the streamId has no live mapping', () => {
      const { store, buffer } = setupBuffer([]);

      const index = buffer.resolveTextLikePartIndex(
        'text',
        'unknown-stream',
        buffer.textPartIndexesByStreamId,
        { createIfMissing: false },
      );

      expect(index).toBe(-1);
      expect(store.state.messagesById.a1.parts).toEqual([]);
    });
  });

  describe('applyTextLikeDelta', () => {
    it('appends delta text to the resolved text part', () => {
      const { store, buffer } = setupBuffer([{ type: 'text', text: 'Hello', state: 'streaming' }]);
      buffer.textPartIndexesByStreamId.set('stream-1', 0);

      buffer.applyTextLikeDelta('text', 'stream-1', ' world');

      const part = store.state.messagesById.a1.parts[0];
      expect(part).toMatchObject({ type: 'text', text: 'Hello world', state: 'streaming' });
    });

    it('appends delta text to a reasoning part', () => {
      const { store, buffer } = setupBuffer([
        { type: 'reasoning', text: 'Thinking...', state: 'streaming' },
      ]);
      buffer.reasoningPartIndexesByStreamId.set('stream-r1', 0);

      buffer.applyTextLikeDelta('reasoning', 'stream-r1', ' more');

      const part = store.state.messagesById.a1.parts[0];
      expect(part).toMatchObject({
        type: 'reasoning',
        text: 'Thinking... more',
        state: 'streaming',
      });
    });

    it('allocates a fresh part when the resolved index points to a different part type', () => {
      const { store, buffer } = setupBuffer([{ type: 'text', text: 'Hello', state: 'streaming' }]);

      // No mapping for stream-1 in reasoning map → a fresh reasoning part is allocated.
      buffer.applyTextLikeDelta('reasoning', 'stream-1', 'more');

      expect(store.state.messagesById.a1.parts[0]).toMatchObject({ type: 'text', text: 'Hello' });
      expect(store.state.messagesById.a1.parts[1]).toMatchObject({
        type: 'reasoning',
        text: 'more',
      });
    });
  });

  describe('scheduleTextLikeDelta', () => {
    it('buffers a delta and applies it after the flush interval', async () => {
      vi.useFakeTimers();
      const { store, buffer } = setupBuffer([{ type: 'text', text: '', state: 'streaming' }]);
      buffer.textPartIndexesByStreamId.set('stream-1', 0);

      buffer.scheduleTextLikeDelta('text', 'stream-1', 'Hello');

      // Not applied yet
      expect(store.state.messagesById.a1.parts[0]).toMatchObject({ text: '' });

      await vi.advanceTimersByTimeAsync(50);

      expect(store.state.messagesById.a1.parts[0]).toMatchObject({ text: 'Hello' });
    });

    it('coalesces multiple deltas for the same partType and streamId before flush', async () => {
      vi.useFakeTimers();
      const { store, buffer } = setupBuffer([{ type: 'text', text: '', state: 'streaming' }]);
      buffer.textPartIndexesByStreamId.set('stream-1', 0);

      buffer.scheduleTextLikeDelta('text', 'stream-1', 'Hello');
      buffer.scheduleTextLikeDelta('text', 'stream-1', ' world');
      buffer.scheduleTextLikeDelta('text', 'stream-1', '!');

      await vi.advanceTimersByTimeAsync(50);

      expect(store.state.messagesById.a1.parts[0]).toMatchObject({ text: 'Hello world!' });
    });

    it('immediately flushes pending delta when partType changes', () => {
      const { store, buffer } = setupBuffer([{ type: 'text', text: '', state: 'streaming' }]);
      buffer.textPartIndexesByStreamId.set('stream-1', 0);

      buffer.scheduleTextLikeDelta('text', 'stream-1', 'Hello');

      // Scheduling a different partType should flush the pending 'text' delta first
      buffer.scheduleTextLikeDelta('reasoning', 'stream-2', 'Think');

      // The text part should have been applied immediately
      expect(store.state.messagesById.a1.parts[0]).toMatchObject({ type: 'text', text: 'Hello' });
    });

    it('immediately flushes pending delta when streamId changes', () => {
      const { store, buffer } = setupBuffer([{ type: 'text', text: '', state: 'streaming' }]);
      buffer.textPartIndexesByStreamId.set('stream-1', 0);

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
      buffer.textPartIndexesByStreamId.set('stream-1', 0);

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
