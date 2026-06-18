import { describe, expect, it, vi } from 'vitest';
import { createEchoAdapter } from './createEchoAdapter';
import type { ChatMessage } from '../types/chat-entities';
import type { ChatMessageChunk, ChatStreamEnvelope } from '../types/chat-stream';

type AdapterEmittedChunk = ChatMessageChunk | ChatStreamEnvelope;

function makeUserMessage(text: string): ChatMessage {
  return {
    id: 'user-1',
    conversationId: 'c-1',
    role: 'user',
    status: 'sent',
    parts: [{ type: 'text', text }],
  };
}

async function readAll(
  stream: ReadableStream<AdapterEmittedChunk>,
): Promise<AdapterEmittedChunk[]> {
  const reader = stream.getReader();
  const collected: AdapterEmittedChunk[] = [];
  for (;;) {
    // eslint-disable-next-line no-await-in-loop
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    if (value !== undefined) {
      collected.push(value);
    }
  }
  return collected;
}

describe('createEchoAdapter', () => {
  it('emits the echo reply after the configured delay', async () => {
    vi.useFakeTimers();
    try {
      const adapter = createEchoAdapter({
        delayMs: 100,
        respond: (text) => `Reply: ${text}`,
      });

      const stream = await adapter.sendMessage({
        message: makeUserMessage('hello'),
        messages: [],
        signal: new AbortController().signal,
      });

      let resolved = false;
      const readPromise = readAll(stream).then((chunks) => {
        resolved = true;
        return chunks;
      });

      await vi.advanceTimersByTimeAsync(99);
      expect(resolved).toBe(false);

      await vi.advanceTimersByTimeAsync(1);
      expect(await readPromise).toEqual([
        { type: 'start', messageId: 'reply-user-1' },
        { type: 'text-start', id: 'reply-user-1-text' },
        { type: 'text-delta', id: 'reply-user-1-text', delta: 'Reply: hello' },
        { type: 'text-end', id: 'reply-user-1-text' },
        { type: 'finish', messageId: 'reply-user-1', finishReason: 'stop' },
      ]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('closes without chunks when the signal aborts before the delay elapses', async () => {
    const adapter = createEchoAdapter({ delayMs: 100 });
    const controller = new AbortController();

    const stream = await adapter.sendMessage({
      message: makeUserMessage('hello'),
      messages: [],
      signal: controller.signal,
    });
    const readPromise = readAll(stream);

    controller.abort();

    expect(await readPromise).toEqual([]);
  });

  it('clears the pending reply when the stream is cancelled', async () => {
    vi.useFakeTimers();
    try {
      const adapter = createEchoAdapter({ delayMs: 100 });
      const stream = await adapter.sendMessage({
        message: makeUserMessage('hello'),
        messages: [],
        signal: new AbortController().signal,
      });

      await stream.cancel('no longer needed');
      await vi.advanceTimersByTimeAsync(100);

      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  describe('regenerate', () => {
    it('emits a reply derived from the anchor message', async () => {
      const adapter = createEchoAdapter({ delayMs: 0, respond: (text) => `Regen: ${text}` });

      const stream = await adapter.regenerate!({
        messageId: 'assistant-1',
        message: makeUserMessage('hello'),
        messages: [],
        signal: new AbortController().signal,
      });

      const chunks = await readAll(stream);
      const delta = chunks.find((c) => (c as ChatMessageChunk).type === 'text-delta') as {
        delta: string;
      };
      expect(delta.delta).toBe('Regen: hello');
    });

    it('honors signal abort before the delay elapses', async () => {
      const adapter = createEchoAdapter({ delayMs: 100 });
      const controller = new AbortController();

      const stream = await adapter.regenerate!({
        messageId: 'assistant-1',
        message: makeUserMessage('hello'),
        messages: [],
        signal: controller.signal,
      });
      const readPromise = readAll(stream);

      controller.abort();

      expect(await readPromise).toEqual([]);
    });

    it('produces distinct message ids for consecutive regenerations of the same message', async () => {
      const adapter = createEchoAdapter({ delayMs: 0 });
      const message = makeUserMessage('hello');

      const first = await readAll(
        await adapter.regenerate!({
          messageId: 'assistant-1',
          message,
          messages: [],
          signal: new AbortController().signal,
        }),
      );
      const second = await readAll(
        await adapter.regenerate!({
          messageId: 'assistant-1',
          message,
          messages: [],
          signal: new AbortController().signal,
        }),
      );

      const firstStart = first.find((c) => (c as ChatMessageChunk).type === 'start') as {
        messageId: string;
      };
      const secondStart = second.find((c) => (c as ChatMessageChunk).type === 'start') as {
        messageId: string;
      };

      expect(firstStart.messageId).not.toBe(secondStart.messageId);
    });
  });
});
