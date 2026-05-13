import { describe, expect, it, vi } from 'vitest';
import { ChatStore } from '../store/ChatStore';
import { processStream } from './processStream';
import type { ChatMessageChunk, ChatStreamEnvelope } from '../types/chat-stream';
import type {
  ChatDataMessagePart,
  ChatDynamicToolMessagePart,
  ChatToolMessagePart,
} from '../types/chat-message-parts';

declare module '@mui/x-chat-headless/types' {
  interface ChatToolDefinitionMap {
    search: {
      input: {
        query: string;
      };
      output: {
        results: string[];
      };
    };
  }

  interface ChatDataPartMap {
    'data-weather': {
      city: string;
      temperatureC: number;
    };
  }
}

function createStream(
  values: Array<ChatMessageChunk | ChatStreamEnvelope>,
): ReadableStream<ChatMessageChunk | ChatStreamEnvelope> {
  return new ReadableStream({
    start(controller) {
      values.forEach((value) => controller.enqueue(value));
      controller.close();
    },
  });
}

describe('processStream', () => {
  it('creates an assistant shell and merges text chunks into one message', async () => {
    const store = new ChatStore();

    const result = await processStream(
      store,
      createStream([
        { type: 'start', messageId: 'a1' },
        { type: 'text-start', id: 'text-1' },
        { type: 'text-delta', id: 'text-1', delta: 'Hello' },
        { type: 'text-delta', id: 'text-1', delta: ' world' },
        { type: 'text-end', id: 'text-1' },
        { type: 'finish', messageId: 'a1', finishReason: 'stop' },
      ]),
      {
        conversationId: 'c1',
      },
    );

    expect(result).toEqual({
      messageId: 'a1',
      status: 'sent',
      finishReason: 'stop',
      isAbort: false,
      isDisconnect: false,
      isError: false,
    });

    expect(store.state.isStreaming).toBe(false);
    expect(store.state.error).toBeNull();
    expect(store.state.messageIds).toEqual(['a1']);
    expect(store.state.messagesById.a1).toEqual({
      id: 'a1',
      conversationId: 'c1',
      role: 'assistant',
      status: 'sent',
      parts: [{ type: 'text', text: 'Hello world', state: 'done' }],
    });
  });

  it('tracks reasoning parts separately from text parts', async () => {
    const store = new ChatStore();

    await processStream(
      store,
      createStream([
        { type: 'start', messageId: 'a1' },
        { type: 'reasoning-delta', id: 'reasoning-1', delta: 'thinking' },
        { type: 'text-delta', id: 'text-1', delta: 'answer' },
        { type: 'finish', messageId: 'a1' },
      ]),
    );

    expect(store.state.messagesById.a1.parts).toEqual([
      { type: 'reasoning', text: 'thinking', state: 'done' },
      { type: 'text', text: 'answer', state: 'done' },
    ]);
  });

  it('batches consecutive text deltas when a flush interval is provided', async () => {
    const createTrackedStore = () => {
      const trackedStore = new ChatStore();
      let updateMessageCallCount = 0;
      const originalUpdateMessage = trackedStore.updateMessage;

      trackedStore.updateMessage = ((id, patch) => {
        updateMessageCallCount += 1;
        originalUpdateMessage(id, patch);
      }) as typeof trackedStore.updateMessage;

      return {
        store: trackedStore,
        getUpdateMessageCallCount: () => updateMessageCallCount,
      };
    };
    const batched = createTrackedStore();
    const unbatched = createTrackedStore();
    const streamValues: Array<ChatMessageChunk | ChatStreamEnvelope> = [
      { type: 'start', messageId: 'a1' },
      { type: 'text-delta', id: 'text-1', delta: 'Hello' },
      { type: 'text-delta', id: 'text-1', delta: ' ' },
      { type: 'text-delta', id: 'text-1', delta: 'world' },
      { type: 'finish', messageId: 'a1' },
    ];

    await processStream(batched.store, createStream([...streamValues]), {
      flushInterval: 50,
    });
    await processStream(unbatched.store, createStream([...streamValues]), {
      flushInterval: 0,
    });

    expect(batched.getUpdateMessageCallCount()).toBeLessThan(unbatched.getUpdateMessageCallCount());
    expect(batched.store.state.messagesById.a1.parts).toEqual([
      { type: 'text', text: 'Hello world', state: 'done' },
    ]);
  });

  it('accepts chunks before start when a target message id is provided', async () => {
    const store = new ChatStore();

    await processStream(
      store,
      createStream([
        { type: 'text-delta', id: 'text-1', delta: 'Hello first' },
        { type: 'finish', messageId: 'a1' },
      ]),
      {
        conversationId: 'c1',
        messageId: 'a1',
      },
    );

    expect(store.state.messagesById.a1.parts).toEqual([
      { type: 'text', text: 'Hello first', state: 'done' },
    ]);
    expect(store.state.messagesById.a1.status).toBe('sent');
  });

  it('fails cleanly when no target message can be resolved', async () => {
    const store = new ChatStore();
    const onFinish = vi.fn();

    await expect(
      processStream(
        store,
        createStream([{ type: 'text-delta', id: 'text-1', delta: 'Hello first' }]),
        { onFinish },
      ),
    ).rejects.toThrow('Stream processing requires a target assistant message id.');

    expect(store.state.isStreaming).toBe(false);
    expect(store.state.error).toEqual({
      code: 'STREAM_ERROR',
      message: 'Stream processing requires a target assistant message id.',
      source: 'stream',
      recoverable: true,
      retryable: true,
      details: undefined,
    });
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onFinish.mock.calls[0][0].isError).toBe(true);
  });

  it('merges registered tool chunks into a persistent tool part and calls onToolCall', async () => {
    const store = new ChatStore();
    const onToolCall = vi.fn();

    await processStream(
      store,
      createStream([
        { type: 'start', messageId: 'a1' },
        { type: 'tool-input-start', toolCallId: 'tool-1', toolName: 'search' },
        { type: 'tool-input-delta', toolCallId: 'tool-1', inputTextDelta: '{' },
        {
          type: 'tool-input-available',
          toolCallId: 'tool-1',
          toolName: 'search',
          input: { query: 'weather' },
        },
        {
          type: 'tool-output-available',
          toolCallId: 'tool-1',
          output: { results: ['sunny'] },
        },
        { type: 'finish', messageId: 'a1' },
      ]),
      { onToolCall },
    );

    const toolPart = store.state.messagesById.a1.parts[0] as ChatToolMessagePart<'search'>;
    expect(toolPart.type).toBe('tool');
    expect(toolPart.toolInvocation.toolName).toBe('search');
    expect(toolPart.toolInvocation.state).toBe('output-available');
    expect(toolPart.toolInvocation.input).toEqual({ query: 'weather' });
    expect(toolPart.toolInvocation.output).toEqual({ results: ['sunny'] });
    expect(onToolCall).toHaveBeenCalledTimes(4);
    expect(onToolCall.mock.calls.at(-1)?.[0].toolCall.state).toBe('output-available');
  });

  it('creates dynamic tool parts for dynamic tool chunks', async () => {
    const store = new ChatStore();

    await processStream(
      store,
      createStream([
        { type: 'start', messageId: 'a1' },
        {
          type: 'tool-input-start',
          toolCallId: 'tool-1',
          toolName: 'dynamic-search',
          dynamic: true,
        },
        {
          type: 'tool-input-available',
          toolCallId: 'tool-1',
          toolName: 'dynamic-search',
          input: { query: 'weather' },
          dynamic: true,
        },
        { type: 'finish', messageId: 'a1' },
      ]),
    );

    const toolPart = store.state.messagesById.a1
      .parts[0] as ChatDynamicToolMessagePart<'dynamic-search'>;
    expect(toolPart.type).toBe('dynamic-tool');
    expect(toolPart.toolInvocation.toolName).toBe('dynamic-search');
    expect(toolPart.toolInvocation.input).toEqual({ query: 'weather' });
  });

  it('appends data parts, step-start, and shallow-merges metadata', async () => {
    const store = new ChatStore();
    const onData = vi.fn();

    await processStream(
      store,
      createStream([
        { type: 'start', messageId: 'a1' },
        {
          type: 'data-weather',
          id: 'data-1',
          data: { city: 'Prague', temperatureC: 12 },
        },
        { type: 'start-step' },
        { type: 'finish-step' },
        { type: 'message-metadata', metadata: { traceId: 'trace-1' } },
        { type: 'finish', messageId: 'a1' },
      ]),
      { onData },
    );

    const dataPart = store.state.messagesById.a1.parts[0] as Extract<
      ChatDataMessagePart,
      { type: 'data-weather' }
    >;
    expect(dataPart).toEqual({
      type: 'data-weather',
      id: 'data-1',
      data: { city: 'Prague', temperatureC: 12 },
      transient: undefined,
    });
    expect(store.state.messagesById.a1.parts[1]).toEqual({ type: 'step-start' });
    expect(store.state.messagesById.a1.metadata).toEqual({ traceId: 'trace-1' });
    expect(onData).toHaveBeenCalledWith(dataPart);
  });

  it('appends source and file parts without disturbing the message order', async () => {
    const store = new ChatStore();

    await processStream(
      store,
      createStream([
        { type: 'start', messageId: 'a1' },
        { type: 'source-url', sourceId: 'source-url-1', url: 'https://mui.com', title: 'MUI' },
        {
          type: 'source-document',
          sourceId: 'source-document-1',
          title: 'Docs excerpt',
          text: 'The answer came from docs.',
        },
        {
          type: 'file',
          mediaType: 'image/png',
          url: 'https://mui.com/logo.png',
          filename: 'logo.png',
        },
        { type: 'finish', messageId: 'a1' },
      ]),
    );

    expect(store.state.messagesById.a1.parts).toEqual([
      { type: 'source-url', sourceId: 'source-url-1', url: 'https://mui.com', title: 'MUI' },
      {
        type: 'source-document',
        sourceId: 'source-document-1',
        title: 'Docs excerpt',
        text: 'The answer came from docs.',
      },
      {
        type: 'file',
        mediaType: 'image/png',
        url: 'https://mui.com/logo.png',
        filename: 'logo.png',
      },
    ]);
  });

  it('merges approval and error tool states into a single persistent invocation', async () => {
    const store = new ChatStore();
    const onToolCall = vi.fn();

    await processStream(
      store,
      createStream([
        { type: 'start', messageId: 'a1' },
        {
          type: 'tool-approval-request',
          toolCallId: 'tool-1',
          toolName: 'search',
          input: { query: 'weather' },
        },
        { type: 'tool-input-error', toolCallId: 'tool-1', errorText: 'Invalid tool payload' },
        { type: 'tool-output-error', toolCallId: 'tool-1', errorText: 'Tool execution failed' },
        { type: 'tool-output-denied', toolCallId: 'tool-1', reason: 'Needs approval' },
        { type: 'finish', messageId: 'a1' },
      ]),
      { onToolCall },
    );

    const toolPart = store.state.messagesById.a1.parts[0] as ChatToolMessagePart<'search'>;
    expect(toolPart.type).toBe('tool');
    expect(toolPart.toolInvocation.input).toEqual({ query: 'weather' });
    expect(toolPart.toolInvocation.errorText).toBe('Tool execution failed');
    expect(toolPart.toolInvocation.approval).toEqual({
      approved: false,
      reason: 'Needs approval',
    });
    expect(toolPart.toolInvocation.state).toBe('output-denied');
    expect(onToolCall).toHaveBeenCalledTimes(4);
    expect(onToolCall.mock.calls.at(0)?.[0].toolCall.state).toBe('approval-requested');
    expect(onToolCall.mock.calls.at(-1)?.[0].toolCall.state).toBe('output-denied');
  });

  it('keeps multiple parts in a single assistant response', async () => {
    const store = new ChatStore();

    await processStream(
      store,
      createStream([
        { type: 'start', messageId: 'a1' },
        { type: 'text-delta', id: 'text-1', delta: 'Hello' },
        { type: 'text-end', id: 'text-1' },
        { type: 'reasoning-delta', id: 'reasoning-1', delta: 'Thinking' },
        { type: 'reasoning-end', id: 'reasoning-1' },
        { type: 'text-delta', id: 'text-2', delta: ' world' },
        { type: 'finish', messageId: 'a1' },
      ]),
    );

    expect(store.state.messagesById.a1.parts).toEqual([
      { type: 'text', text: 'Hello', state: 'done' },
      { type: 'reasoning', text: 'Thinking', state: 'done' },
      { type: 'text', text: ' world', state: 'done' },
    ]);
  });

  it('handles abort terminal chunks without surfacing a stream error', async () => {
    const store = new ChatStore();

    const result = await processStream(
      store,
      createStream([
        { type: 'start', messageId: 'a1' },
        { type: 'text-delta', id: 'text-1', delta: 'Hello' },
        { type: 'abort', messageId: 'a1' },
      ]),
    );

    expect(result.status).toBe('cancelled');
    expect(result.isAbort).toBe(true);
    expect(store.state.messagesById.a1.status).toBe('cancelled');
    expect(store.state.error).toBeNull();
  });

  it('cancels on AbortSignal without creating a ChatError', async () => {
    const store = new ChatStore();
    const abortController = new AbortController();

    const stream = new ReadableStream<ChatMessageChunk>({
      start(controller) {
        controller.enqueue({ type: 'start', messageId: 'a1' });
        controller.enqueue({ type: 'text-delta', id: 'text-1', delta: 'Hello' });
      },
    });

    const processingPromise = processStream(store, stream, {
      signal: abortController.signal,
    });

    abortController.abort();

    const result = await processingPromise;

    expect(result).toEqual({
      messageId: 'a1',
      status: 'cancelled',
      finishReason: undefined,
      isAbort: true,
      isDisconnect: false,
      isError: false,
    });
    expect(store.state.messagesById.a1.status).toBe('cancelled');
    expect(store.state.error).toBeNull();
  });

  it('deduplicates repeated event ids and replays buffered sequences in order', async () => {
    const store = new ChatStore();

    await processStream(
      store,
      createStream([
        {
          eventId: 'evt-2',
          sequence: 2,
          chunk: { type: 'text-delta', id: 'text-1', delta: ' world' },
        },
        {
          eventId: 'evt-1',
          sequence: 1,
          chunk: { type: 'start', messageId: 'a1' },
        },
        {
          eventId: 'evt-2',
          sequence: 2,
          chunk: { type: 'text-delta', id: 'text-1', delta: ' world' },
        },
        {
          eventId: 'evt-3',
          sequence: 3,
          chunk: { type: 'text-delta', id: 'text-1', delta: '!' },
        },
        {
          eventId: 'evt-0',
          sequence: 0,
          chunk: { type: 'text-delta', id: 'text-1', delta: 'ignored' },
        },
        {
          eventId: 'evt-4',
          sequence: 4,
          chunk: { type: 'finish', messageId: 'a1' },
        },
      ]),
      {
        messageId: 'a1',
      },
    );

    expect(store.state.messagesById.a1.parts).toEqual([
      { type: 'text', text: ' world!', state: 'done' },
    ]);
  });

  it('reports disconnects when the stream closes without a terminal chunk', async () => {
    const store = new ChatStore();
    const onFinish = vi.fn();

    const result = await processStream(
      store,
      createStream([
        { type: 'start', messageId: 'a1' },
        { type: 'text-delta', id: 'text-1', delta: 'Hello' },
      ]),
      { onFinish },
    );

    expect(result).toEqual({
      messageId: 'a1',
      status: 'error',
      finishReason: undefined,
      isAbort: false,
      isDisconnect: true,
      isError: true,
    });
    expect(store.state.messagesById.a1.status).toBe('error');
    expect(store.state.error?.message).toBe('Stream closed before a terminal chunk was received.');
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onFinish.mock.calls[0][0].isDisconnect).toBe(true);
  });

  it('rethrows read errors after storing stream failure state', async () => {
    const store = new ChatStore();
    const onFinish = vi.fn();
    let didEnqueueStart = false;

    const stream = new ReadableStream<ChatMessageChunk>({
      pull(controller) {
        if (!didEnqueueStart) {
          didEnqueueStart = true;
          controller.enqueue({ type: 'start', messageId: 'a1' });
          return;
        }

        controller.error(new Error('boom'));
      },
    });

    await expect(processStream(store, stream, { onFinish })).rejects.toThrow('boom');
    expect(store.state.messagesById.a1.status).toBe('error');
    expect(store.state.error?.message).toBe('boom');
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onFinish.mock.calls[0][0]).toMatchObject({
      isAbort: false,
      isDisconnect: false,
      isError: true,
    });
  });

  it('creates a tool part from a tool-approval-request chunk', async () => {
    const store = new ChatStore();

    await processStream(
      store,
      createStream([
        { type: 'start', messageId: 'a1' },
        {
          type: 'tool-approval-request',
          toolCallId: 'tool-1',
          toolName: 'search',
          input: { query: 'weather' },
        },
        { type: 'finish', messageId: 'a1' },
      ]),
    );

    const toolPart = store.state.messagesById.a1.parts[0] as ChatToolMessagePart<'search'>;
    expect(toolPart.type).toBe('tool');
    expect(toolPart.toolInvocation.toolCallId).toBe('tool-1');
    expect(toolPart.toolInvocation.toolName).toBe('search');
    expect(toolPart.toolInvocation.input).toEqual({ query: 'weather' });
    expect(toolPart.toolInvocation.state).toBe('approval-requested');
  });

  it('creates a dynamic tool part from a dynamic tool-approval-request chunk', async () => {
    const store = new ChatStore();

    await processStream(
      store,
      createStream([
        { type: 'start', messageId: 'a1' },
        {
          type: 'tool-approval-request',
          toolCallId: 'tool-1',
          toolName: 'dynamic-search',
          input: { query: 'weather' },
          dynamic: true,
        },
        { type: 'finish', messageId: 'a1' },
      ]),
    );

    const toolPart = store.state.messagesById.a1
      .parts[0] as ChatDynamicToolMessagePart<'dynamic-search'>;
    expect(toolPart.type).toBe('dynamic-tool');
    expect(toolPart.toolInvocation.toolName).toBe('dynamic-search');
    expect(toolPart.toolInvocation.state).toBe('approval-requested');
  });

  it('updates tool invocation standalone from a tool-input-error chunk', async () => {
    const store = new ChatStore();

    await processStream(
      store,
      createStream([
        { type: 'start', messageId: 'a1' },
        { type: 'tool-input-start', toolCallId: 'tool-1', toolName: 'search' },
        { type: 'tool-input-error', toolCallId: 'tool-1', errorText: 'Bad input' },
        { type: 'finish', messageId: 'a1' },
      ]),
    );

    const toolPart = store.state.messagesById.a1.parts[0] as ChatToolMessagePart<'search'>;
    expect(toolPart.toolInvocation.state).toBe('output-error');
    expect(toolPart.toolInvocation.errorText).toBe('Bad input');
  });

  it('drops chunks with sequence < expected', async () => {
    const store = new ChatStore();

    await processStream(
      store,
      createStream([
        {
          eventId: 'evt-1',
          sequence: 1,
          chunk: { type: 'start', messageId: 'a1' },
        },
        {
          eventId: 'evt-2',
          sequence: 2,
          chunk: { type: 'text-delta', id: 'text-1', delta: 'Hello' },
        },
        {
          eventId: 'evt-0',
          sequence: 0,
          chunk: { type: 'text-delta', id: 'text-1', delta: 'SHOULD BE IGNORED' },
        },
        {
          eventId: 'evt-3',
          sequence: 3,
          chunk: { type: 'finish', messageId: 'a1' },
        },
      ]),
      { messageId: 'a1' },
    );

    expect(store.state.messagesById.a1.parts).toEqual([
      { type: 'text', text: 'Hello', state: 'done' },
    ]);
  });

  it('processes envelope chunks without eventId', async () => {
    const store = new ChatStore();

    await processStream(
      store,
      createStream([
        {
          sequence: 1,
          chunk: { type: 'start', messageId: 'a1' },
        },
        {
          sequence: 2,
          chunk: { type: 'text-delta', id: 'text-1', delta: 'Hello' },
        },
        {
          sequence: 3,
          chunk: { type: 'finish', messageId: 'a1' },
        },
      ] as ChatStreamEnvelope[]),
    );

    expect(store.state.messagesById.a1.parts).toEqual([
      { type: 'text', text: 'Hello', state: 'done' },
    ]);
  });

  it('processes pass-through chunks without sequence (envelope without sequence)', async () => {
    const store = new ChatStore();

    await processStream(
      store,
      createStream([
        {
          eventId: 'evt-1',
          chunk: { type: 'start', messageId: 'a1' },
        } as ChatStreamEnvelope,
        {
          eventId: 'evt-2',
          chunk: { type: 'text-delta', id: 'text-1', delta: 'Hello' },
        } as ChatStreamEnvelope,
        {
          eventId: 'evt-3',
          chunk: { type: 'finish', messageId: 'a1' },
        } as ChatStreamEnvelope,
      ]),
    );

    expect(store.state.messagesById.a1.parts).toEqual([
      { type: 'text', text: 'Hello', state: 'done' },
    ]);
  });

  it('returns sent status when no chunks and no messageId', async () => {
    const store = new ChatStore();

    const result = await processStream(store, createStream([]));

    expect(result).toEqual({
      messageId: undefined,
      status: 'sent',
      isAbort: false,
      isDisconnect: false,
      isError: false,
    });
  });

  it('no-ops when message is removed mid-stream (streamHelpers guard)', async () => {
    const store = new ChatStore();
    store.addMessage({
      id: 'a1',
      conversationId: 'c1',
      role: 'assistant',
      status: 'streaming',
      parts: [{ type: 'text', text: 'initial' }],
    });

    // Remove the message before the stream delta arrives
    store.removeMessage('a1');

    await processStream(
      store,
      createStream([
        { type: 'text-delta', id: 'text-1', delta: 'should be ignored' },
        { type: 'finish', messageId: 'a1' },
      ]),
      { messageId: 'a1' },
    );

    // The message was recreated by the stream (getOrCreateMessage creates when missing)
    expect(store.state.messagesById.a1).toBeDefined();
  });

  it('propagates author from start chunk to assistant message', async () => {
    const store = new ChatStore();
    const author = { id: 'bot-1', displayName: 'Bot', role: 'assistant' as const };

    await processStream(
      store,
      createStream([
        { type: 'start', messageId: 'a1', author },
        { type: 'text-delta', id: 'text-1', delta: 'Hello' },
        { type: 'finish', messageId: 'a1' },
      ]),
      { conversationId: 'c1' },
    );

    expect(store.state.messagesById.a1.author).toEqual(author);
  });

  it('calls onFinish exactly once for finish and abort terminal chunks', async () => {
    const finishOnSuccess = vi.fn();
    const successStore = new ChatStore();

    await processStream(
      successStore,
      createStream([
        { type: 'start', messageId: 'success' },
        { type: 'text-delta', id: 'text-1', delta: 'done' },
        { type: 'finish', messageId: 'success', finishReason: 'stop' },
      ]),
      { onFinish: finishOnSuccess },
    );

    expect(finishOnSuccess).toHaveBeenCalledTimes(1);
    expect(finishOnSuccess.mock.calls[0][0]).toMatchObject({
      finishReason: 'stop',
      isAbort: false,
      isDisconnect: false,
      isError: false,
    });

    const finishOnAbort = vi.fn();
    const abortedStore = new ChatStore();

    await processStream(
      abortedStore,
      createStream([
        { type: 'start', messageId: 'aborted' },
        { type: 'text-delta', id: 'text-1', delta: 'cancel me' },
        { type: 'abort', messageId: 'aborted' },
      ]),
      { onFinish: finishOnAbort },
    );

    expect(finishOnAbort).toHaveBeenCalledTimes(1);
    expect(finishOnAbort.mock.calls[0][0]).toMatchObject({
      isAbort: true,
      isDisconnect: false,
      isError: false,
    });
  });
});
