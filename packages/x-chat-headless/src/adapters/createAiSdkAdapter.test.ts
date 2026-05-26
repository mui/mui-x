import { describe, expect, it, vi } from 'vitest';
import { createAiSdkAdapter, type AiSdkUIMessageChunk } from './createAiSdkAdapter';
import { ChatStreamError } from '../stream/ChatStreamError';
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

function makeReadableStream<T>(items: T[]): ReadableStream<T> {
  return new ReadableStream<T>({
    start(controller) {
      items.forEach((item) => controller.enqueue(item));
      controller.close();
    },
  });
}

async function readAll(
  stream: ReadableStream<AdapterEmittedChunk>,
): Promise<AdapterEmittedChunk[]> {
  const reader = stream.getReader();
  const collected: AdapterEmittedChunk[] = [];
  try {
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
  } finally {
    reader.releaseLock();
  }
  return collected;
}

describe('createAiSdkAdapter — { stream } branch', () => {
  it('passes object-stream chunks through in order', async () => {
    const chunks: AiSdkUIMessageChunk[] = [
      { type: 'start', messageId: 'm1' },
      { type: 'text-start', id: 't' },
      { type: 'text-delta', id: 't', delta: 'hi' },
      { type: 'text-end', id: 't' },
      { type: 'finish', messageId: 'm1', finishReason: 'stop' },
    ];

    const adapter = createAiSdkAdapter({
      stream: () => makeReadableStream(chunks),
    });

    const result = await adapter.sendMessage({
      message: makeUserMessage('hello'),
      messages: [],
      signal: new AbortController().signal,
    });

    expect(await readAll(result)).toEqual(chunks);
  });

  it('decodes a Uint8Array NDJSON stream split across reads', async () => {
    const json = [
      '{"type":"start","messageId":"m1"}',
      '{"type":"text-start","id":"t"}',
      '{"type":"text-delta","id":"t","delta":"hello"}',
      '{"type":"text-end","id":"t"}',
      '{"type":"finish","messageId":"m1","finishReason":"stop"}',
    ];
    const full = `${json.join('\n')}\n`;
    const splitAt = 25;
    const encoder = new TextEncoder();
    const bytes: Uint8Array[] = [
      encoder.encode(full.slice(0, splitAt)),
      encoder.encode(full.slice(splitAt)),
    ];

    const adapter = createAiSdkAdapter({
      stream: () => makeReadableStream(bytes),
    });

    const result = await adapter.sendMessage({
      message: makeUserMessage('hello'),
      messages: [],
      signal: new AbortController().signal,
    });

    const chunks = await readAll(result);
    expect(chunks.map((c) => (c as ChatMessageChunk).type)).toEqual([
      'start',
      'text-start',
      'text-delta',
      'text-end',
      'finish',
    ]);
    expect((chunks[2] as { delta: string }).delta).toBe('hello');
  });

  it('decodes an SSE byte stream (data: prefix + [DONE] terminator)', async () => {
    const sse =
      'event: message\n' +
      'id: 1\n' +
      'data: {"type":"start","messageId":"m1"}\n\n' +
      ': keep-alive\n\n' +
      'data: {"type":"text-start","id":"t"}\n\n' +
      'data: {"type":"text-delta","id":"t","delta":"yo"}\n\n' +
      'retry: 1000\n' +
      'data: {"type":"text-end","id":"t"}\n\n' +
      'data: {"type":"finish","messageId":"m1","finishReason":"stop"}\n\n' +
      'data: [DONE]\n\n';

    const adapter = createAiSdkAdapter({
      stream: () => makeReadableStream([new TextEncoder().encode(sse)]),
    });

    const result = await adapter.sendMessage({
      message: makeUserMessage('hi'),
      messages: [],
      signal: new AbortController().signal,
    });

    const chunks = await readAll(result);
    expect(chunks.map((c) => (c as ChatMessageChunk).type)).toEqual([
      'start',
      'text-start',
      'text-delta',
      'text-end',
      'finish',
    ]);
  });

  it('rejects with ChatStreamError when an error chunk arrives', async () => {
    const adapter = createAiSdkAdapter({
      stream: () =>
        makeReadableStream<AiSdkUIMessageChunk>([
          { type: 'start', messageId: 'm1' },
          { type: 'error', errorText: 'boom' },
        ]),
    });

    const result = await adapter.sendMessage({
      message: makeUserMessage('hi'),
      messages: [],
      signal: new AbortController().signal,
    });

    await expect(readAll(result)).rejects.toMatchObject({
      name: 'ChatStreamError',
      message: 'boom',
    });
  });

  it('injects a synthetic messageId on start/finish when the AI SDK omits it', async () => {
    // The real Vercel AI SDK ships `{ type: 'start' }` without a messageId
    // (the client assigns one). MUI X Chat's processStream requires a
    // messageId on `start`, so the adapter has to fill it in.
    const adapter = createAiSdkAdapter({
      stream: () =>
        makeReadableStream<AiSdkUIMessageChunk>([
          { type: 'start' },
          { type: 'text-start', id: 't' },
          { type: 'text-delta', id: 't', delta: 'ok' },
          { type: 'text-end', id: 't' },
          { type: 'finish' },
        ]),
    });

    const result = await adapter.sendMessage({
      message: makeUserMessage('hi'),
      messages: [],
      signal: new AbortController().signal,
    });

    const chunks = await readAll(result);
    const start = chunks[0] as ChatMessageChunk & { messageId: string };
    const finish = chunks[chunks.length - 1] as ChatMessageChunk & { messageId: string };
    expect(start.type).toBe('start');
    expect(typeof start.messageId).toBe('string');
    expect(start.messageId.length).toBeGreaterThan(0);
    expect(finish.type).toBe('finish');
    // Same synthetic id flows through start and finish so processStream can
    // bind text-delta chunks to the assistant message and finalize it.
    expect(finish.messageId).toBe(start.messageId);
  });

  it('resets synthetic messageId generation for each stream', async () => {
    const adapter = createAiSdkAdapter({
      stream: () =>
        makeReadableStream<AiSdkUIMessageChunk>([{ type: 'start' }, { type: 'finish' }]),
    });

    const firstResult = await adapter.sendMessage({
      message: makeUserMessage('hi'),
      messages: [],
      signal: new AbortController().signal,
    });
    const secondResult = await adapter.sendMessage({
      message: makeUserMessage('hi again'),
      messages: [],
      signal: new AbortController().signal,
    });

    const firstChunks = await readAll(firstResult);
    const secondChunks = await readAll(secondResult);
    const firstStart = firstChunks[0] as ChatMessageChunk & { messageId: string };
    const firstFinish = firstChunks[firstChunks.length - 1] as ChatMessageChunk & {
      messageId: string;
    };
    const secondStart = secondChunks[0] as ChatMessageChunk & { messageId: string };
    const secondFinish = secondChunks[secondChunks.length - 1] as ChatMessageChunk & {
      messageId: string;
    };

    expect(firstFinish.messageId).toBe(firstStart.messageId);
    expect(secondFinish.messageId).toBe(secondStart.messageId);
    expect(secondStart.messageId).toBe(firstStart.messageId);
  });

  it('preserves a messageId when the AI SDK does provide one', async () => {
    const adapter = createAiSdkAdapter({
      stream: () =>
        makeReadableStream<AiSdkUIMessageChunk>([
          { type: 'start', messageId: 'upstream-id' },
          { type: 'finish', messageId: 'upstream-id' },
        ]),
    });

    const result = await adapter.sendMessage({
      message: makeUserMessage('hi'),
      messages: [],
      signal: new AbortController().signal,
    });

    const chunks = await readAll(result);
    expect((chunks[0] as ChatMessageChunk & { messageId: string }).messageId).toBe('upstream-id');
    expect((chunks[chunks.length - 1] as ChatMessageChunk & { messageId: string }).messageId).toBe(
      'upstream-id',
    );
  });

  it('passes unknown chunk types through for forward-compat', async () => {
    const adapter = createAiSdkAdapter({
      stream: () =>
        makeReadableStream<AiSdkUIMessageChunk>([{ type: 'experimental-foo', payload: 'bar' }]),
    });

    const result = await adapter.sendMessage({
      message: makeUserMessage('hi'),
      messages: [],
      signal: new AbortController().signal,
    });

    const chunks = await readAll(result);
    expect(chunks).toEqual([{ type: 'experimental-foo', payload: 'bar' }]);
  });

  it('propagates downstream cancellation back to the upstream stream', async () => {
    const upstreamCancel = vi.fn();
    const upstream = new ReadableStream<AiSdkUIMessageChunk>({
      start(controller) {
        controller.enqueue({ type: 'start', messageId: 'm1' });
      },
      cancel: upstreamCancel,
    });

    const adapter = createAiSdkAdapter({ stream: () => upstream });

    const result = await adapter.sendMessage({
      message: makeUserMessage('hi'),
      messages: [],
      signal: new AbortController().signal,
    });

    await result.cancel('aborted');
    expect(upstreamCancel).toHaveBeenCalled();
  });

  it('cancels the upstream stream when the input signal aborts', async () => {
    const upstreamCancel = vi.fn();
    const upstream = new ReadableStream<AiSdkUIMessageChunk>({
      start(controller) {
        controller.enqueue({ type: 'start', messageId: 'm1' });
      },
      cancel: upstreamCancel,
    });

    const abortController = new AbortController();
    const adapter = createAiSdkAdapter({ stream: () => upstream });

    await adapter.sendMessage({
      message: makeUserMessage('hi'),
      messages: [],
      signal: abortController.signal,
    });

    abortController.abort('aborted by user');
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(upstreamCancel).toHaveBeenCalledTimes(1);
    expect(upstreamCancel.mock.calls[0][0]).toBe('aborted by user');
  });

  it('passes attachments and metadata to the stream callback', async () => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const stream = vi.fn(() =>
      makeReadableStream<AiSdkUIMessageChunk>([{ type: 'finish', messageId: 'm1' }]),
    );
    const adapter = createAiSdkAdapter({ stream });

    await adapter.sendMessage({
      message: makeUserMessage('hi'),
      messages: [],
      attachments: [{ localId: 'a1', file, status: 'queued' }],
      metadata: { model: 'fast' },
      signal: new AbortController().signal,
    });

    expect(stream).toHaveBeenCalledWith({
      message: makeUserMessage('hi'),
      messages: [],
      attachments: [{ localId: 'a1', file, status: 'queued' }],
      metadata: { model: 'fast' },
      signal: expect.any(AbortSignal),
    });
  });
});

describe('createAiSdkAdapter — { chat } branch', () => {
  function makeChat(replyText: string) {
    const messages: Array<{
      id: string;
      role: string;
      parts: Array<{ type: string; text?: string }>;
    }> = [];
    const chat = {
      messages,
      stop: vi.fn(),
      sendMessage: vi.fn(async (msg: { text?: string }) => {
        messages.push({
          id: 'user-from-chat',
          role: 'user',
          parts: [{ type: 'text', text: msg.text ?? '' }],
        });
        messages.push({
          id: 'assistant-from-chat',
          role: 'assistant',
          parts: [{ type: 'text', text: replyText }],
        });
      }),
    };
    return chat;
  }

  it('emits the assistant reply as one text chunk after sendMessage resolves', async () => {
    const chat = makeChat('hello from ai sdk');
    const adapter = createAiSdkAdapter({ chat });

    const result = await adapter.sendMessage({
      message: makeUserMessage('hi'),
      messages: [],
      signal: new AbortController().signal,
    });

    const chunks = await readAll(result);
    expect(chat.sendMessage).toHaveBeenCalledWith({ text: 'hi' });
    expect(chunks.map((c) => (c as ChatMessageChunk).type)).toEqual([
      'start',
      'text-start',
      'text-delta',
      'text-end',
      'finish',
    ]);
    expect((chunks[2] as { delta: string }).delta).toBe('hello from ai sdk');
  });

  it('forwards attachments to chat.sendMessage as files', async () => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const chat = makeChat('hello from ai sdk');
    const adapter = createAiSdkAdapter({ chat });

    await adapter.sendMessage({
      message: makeUserMessage('hi'),
      messages: [],
      attachments: [{ localId: 'a1', file, status: 'queued' }],
      signal: new AbortController().signal,
    });

    expect(chat.sendMessage).toHaveBeenCalledWith({ text: 'hi', files: [file] });
  });

  it('forwards abort to chat.stop()', async () => {
    const chat = makeChat('whatever');
    const adapter = createAiSdkAdapter({ chat });

    const controller = new AbortController();
    const sendPromise = adapter.sendMessage({
      message: makeUserMessage('hi'),
      messages: [],
      signal: controller.signal,
    });
    controller.abort();
    await sendPromise;

    expect(chat.stop).toHaveBeenCalledTimes(1);
  });

  it('emits an empty reply when chat.messages did not gain an assistant message', async () => {
    const chat = {
      messages: [] as Array<{
        id: string;
        role: string;
        parts: Array<{ type: string; text?: string }>;
      }>,
      stop: vi.fn(),
      sendMessage: vi.fn(async () => undefined),
    };
    const adapter = createAiSdkAdapter({ chat });

    const result = await adapter.sendMessage({
      message: makeUserMessage('hi'),
      messages: [],
      signal: new AbortController().signal,
    });

    const chunks = await readAll(result);
    expect((chunks[2] as { delta: string }).delta).toBe('');
  });
});

describe('ChatStreamError shape', () => {
  it('uses code STREAM_ERROR / source stream when surfacing error chunks', async () => {
    const adapter = createAiSdkAdapter({
      stream: () => makeReadableStream<AiSdkUIMessageChunk>([{ type: 'error', errorText: 'nope' }]),
    });

    const result = await adapter.sendMessage({
      message: makeUserMessage('hi'),
      messages: [],
      signal: new AbortController().signal,
    });

    await expect(readAll(result)).rejects.toBeInstanceOf(ChatStreamError);
    const reread = await adapter.sendMessage({
      message: makeUserMessage('hi'),
      messages: [],
      signal: new AbortController().signal,
    });
    await expect(readAll(reread)).rejects.toMatchObject({
      chatError: { code: 'STREAM_ERROR', source: 'stream', message: 'nope' },
    });
  });
});
