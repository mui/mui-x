import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { ChatStore } from '../../store/ChatStore';
import { createSendMessageActions } from './sendMessageActions';
import type { ChatAdapter } from '../../adapters';
import type { ChatMessage } from '../../types/chat-entities';
import type { ChatMessageChunk, ChatStreamEnvelope } from '../../types/chat-stream';

function asUnknown(store: ChatStore): ChatStore<unknown> {
  return store as unknown as ChatStore<unknown>;
}

function createStream(
  values: Array<ChatMessageChunk | ChatStreamEnvelope>,
): ReadableStream<ChatMessageChunk | ChatStreamEnvelope> {
  return new ReadableStream({
    start(controller) {
      values.forEach((v) => controller.enqueue(v));
      controller.close();
    },
  });
}

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    sendMessage: vi.fn().mockResolvedValue(
      createStream([
        { type: 'start', messageId: 'a1' },
        { type: 'finish', messageId: 'a1', finishReason: 'stop' },
      ]),
    ),
    ...overrides,
  };
}

const userMessageInput = {
  conversationId: 'c1',
  parts: [{ type: 'text' as const, text: 'Hello' }],
};

describe('createSendMessageActions', () => {
  describe('sendMessage', () => {
    it('constructs a ChatMessage with a generated id when input.id is not provided', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');
      const adapter = createAdapter();

      const { sendMessage } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await sendMessage(userMessageInput);

      // The user message should be in the store (with a generated id)
      const userMsg = Object.values(store.state.messagesById).find((m) => m.role === 'user');
      expect(userMsg).toBeDefined();
      expect(typeof userMsg!.id).toBe('string');
      expect(userMsg!.id.length).toBeGreaterThan(0);
    });

    it('uses the provided id, conversationId, metadata, and author', async () => {
      const store = new ChatStore();
      const adapter = createAdapter();
      const author = { id: 'user-1', displayName: 'Alice' };

      const { sendMessage } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await sendMessage({
        id: 'custom-id',
        conversationId: 'c1',
        parts: [{ type: 'text', text: 'Hi' }],
        metadata: { traceId: 'trace-1' },
        author,
      });

      const userMsg = store.state.messagesById['custom-id'];
      expect(userMsg).toBeDefined();
      expect(userMsg.conversationId).toBe('c1');
      expect(userMsg.metadata).toEqual({ traceId: 'trace-1' });
      expect(userMsg.author).toEqual(author);
    });

    it('falls back to store.activeConversationId when conversationId is not provided', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c-active');
      const adapter = createAdapter();

      const { sendMessage } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await sendMessage({ parts: [{ type: 'text', text: 'Hi' }] });

      const userMsg = Object.values(store.state.messagesById).find((m) => m.role === 'user');
      expect(userMsg!.conversationId).toBe('c-active');
    });

    it('gives each id-less response its own assistant message across sequential sends', async () => {
      // Regression: an adapter whose `start`/`finish` chunks carry no
      // `messageId` (e.g. the Vercel AI SDK's bare `{ type: 'start' }`) must
      // not have its replies collapse into a single assistant bubble. The
      // runtime mints a unique fallback id per run, so reply 2 lands on a fresh
      // message instead of appending to reply 1.
      const store = new ChatStore();
      store.setActiveConversation('c1');

      const adapter = createAdapter({
        sendMessage: vi.fn().mockImplementation(() =>
          // `start`/`finish` without a messageId, like the Vercel AI SDK's bare
          // `{ type: 'start' }`. The type requires one; runtime streams can omit it.
          createStream([
            { type: 'start' },
            { type: 'text-start', id: 't' },
            { type: 'text-delta', id: 't', delta: 'reply' },
            { type: 'text-end', id: 't' },
            { type: 'finish', finishReason: 'stop' },
          ] as unknown as ChatMessageChunk[]),
        ),
      });

      const { sendMessage } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await sendMessage({ conversationId: 'c1', parts: [{ type: 'text', text: '1' }] });
      await sendMessage({ conversationId: 'c1', parts: [{ type: 'text', text: '2' }] });

      const assistantMessages = store.state.messageIds
        .map((id) => store.state.messagesById[id])
        .filter((m) => m.role === 'assistant');

      expect(assistantMessages).toHaveLength(2);
      expect(assistantMessages[0].id).not.toBe(assistantMessages[1].id);
      // Each assistant message holds exactly its own reply — no merged parts.
      assistantMessages.forEach((m) => {
        expect(m.parts).toEqual([{ type: 'text', text: 'reply', state: 'done' }]);
      });
    });
  });

  describe('sendExistingMessage (via sendMessage)', () => {
    it('does not send when store.isStreaming is true', async () => {
      const store = new ChatStore();
      store.setStreaming(true);
      const adapter = createAdapter();

      const { sendMessage } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await sendMessage(userMessageInput);

      expect(adapter.sendMessage).not.toHaveBeenCalled();
    });

    it('adds user message with status "sending" and sets streaming before adapter call', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');
      let capturedStatus: string | undefined;
      let capturedIsStreaming: boolean | undefined;

      const adapter = createAdapter({
        sendMessage: vi.fn().mockImplementation(() => {
          // Capture state at the time the adapter is called
          const userMsg = Object.values(store.state.messagesById).find((m) => m.role === 'user');
          capturedStatus = userMsg?.status;
          capturedIsStreaming = store.state.isStreaming;
          return Promise.resolve(
            createStream([
              { type: 'start', messageId: 'a1' },
              { type: 'finish', messageId: 'a1', finishReason: 'stop' },
            ]),
          );
        }),
      });

      const { sendMessage } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await sendMessage(userMessageInput);

      expect(capturedStatus).toBe('sending');
      expect(capturedIsStreaming).toBe(true);
    });

    it('sets user message status to "sent" on successful stream completion', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');
      const adapter = createAdapter();

      const { sendMessage } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await sendMessage(userMessageInput);

      const userMsg = Object.values(store.state.messagesById).find((m) => m.role === 'user');
      expect(userMsg!.status).toBe('sent');
    });

    it('maps assistant message ID from stream result into the ref', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');
      const assistantMessageIdByUserMessageIdRef: { current: Map<string, string> } = {
        current: new Map(),
      };
      const adapter = createAdapter({
        sendMessage: vi.fn().mockResolvedValue(
          createStream([
            { type: 'start', messageId: 'assistant-msg-1' },
            { type: 'finish', messageId: 'assistant-msg-1', finishReason: 'stop' },
          ]),
        ),
      });

      const { sendMessage } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef,
      });

      await sendMessage({ id: 'user-msg-1', parts: [{ type: 'text', text: 'Hello' }] });

      expect(assistantMessageIdByUserMessageIdRef.current.get('user-msg-1')).toBe(
        'assistant-msg-1',
      );
    });

    it('automatically reconnects once when a stream closes before a terminal chunk', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');
      const onFinish = vi.fn();
      const reconnectToStream = vi.fn().mockResolvedValue(
        createStream([
          { sequence: 2, eventId: 'e2', chunk: { type: 'text-delta', id: 'text-1', delta: '!' } },
          {
            sequence: 3,
            eventId: 'e3',
            chunk: { type: 'text-delta', id: 'text-1', delta: ' world' },
          },
          { sequence: 4, eventId: 'e4', chunk: { type: 'text-end', id: 'text-1' } },
          {
            sequence: 5,
            eventId: 'e5',
            chunk: { type: 'finish', messageId: 'a1', finishReason: 'stop' },
          },
        ]),
      );
      const adapter = createAdapter({
        sendMessage: vi.fn().mockResolvedValue(
          createStream([
            { sequence: 0, eventId: 'e0', chunk: { type: 'start', messageId: 'a1' } },
            { sequence: 1, eventId: 'e1', chunk: { type: 'text-start', id: 'text-1' } },
            {
              sequence: 2,
              eventId: 'e2',
              chunk: { type: 'text-delta', id: 'text-1', delta: 'Hello' },
            },
          ]),
        ),
        reconnectToStream,
      });

      const { sendMessage } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter, onFinish } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await sendMessage(userMessageInput);

      expect(reconnectToStream).toHaveBeenCalledTimes(1);
      expect(reconnectToStream).toHaveBeenCalledWith({
        conversationId: 'c1',
        messageId: 'a1',
        signal: expect.any(AbortSignal),
      });
      expect(store.state.messagesById.a1.status).toBe('sent');
      expect(store.state.messagesById.a1.parts).toEqual([
        { type: 'text', text: 'Hello', state: 'done' },
        { type: 'text', text: ' world', state: 'done' },
      ]);
      expect(store.state.error).toBe(null);
      expect(onFinish).toHaveBeenCalledTimes(1);
      expect(onFinish.mock.calls[0][0]).toMatchObject({
        isDisconnect: false,
        isError: false,
        message: { id: 'a1', status: 'sent' },
      });

      const userMsg = Object.values(store.state.messagesById).find((m) => m.role === 'user');
      expect(userMsg!.status).toBe('sent');
    });

    it('keeps the recoverable stream error when reconnect returns null', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');
      const onError = vi.fn();
      const adapter = createAdapter({
        sendMessage: vi.fn().mockResolvedValue(createStream([{ type: 'start', messageId: 'a1' }])),
        reconnectToStream: vi.fn().mockResolvedValue(null),
      });

      const { sendMessage } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter, onError } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await sendMessage(userMessageInput);

      const userMsg = Object.values(store.state.messagesById).find((m) => m.role === 'user');
      expect(userMsg!.status).toBe('error');
      expect(store.state.messagesById.a1.status).toBe('error');
      expect(store.state.messageErrorsById.a1?.message).toBe(
        'Stream closed before a terminal chunk was received.',
      );
      expect(store.state.error?.code).toBe('STREAM_ERROR');
      expect(store.state.error?.message).toBe(
        'Stream closed before a terminal chunk was received.',
      );
      expect(onError).toHaveBeenCalledTimes(1);
    });

    it('does not call reconnectToStream after a normal terminal chunk', async () => {
      const store = new ChatStore();
      const reconnectToStream = vi.fn();
      const adapter = createAdapter({ reconnectToStream });

      const { sendMessage } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await sendMessage(userMessageInput);

      expect(reconnectToStream).not.toHaveBeenCalled();
    });

    it('sets user message status to "error" when the adapter throws', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');
      const adapter = createAdapter({
        sendMessage: vi.fn().mockRejectedValue(new Error('Network failure')),
      });

      const { sendMessage } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await sendMessage(userMessageInput);

      const userMsg = Object.values(store.state.messagesById).find((m) => m.role === 'user');
      expect(userMsg!.status).toBe('error');
      expect(store.state.messageErrorsById[userMsg!.id]?.message).toBe('Network failure');
    });

    it('calls setRuntimeError with SEND_ERROR when the adapter throws', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');
      const setRuntimeError = vi.fn();
      const adapter = createAdapter({
        sendMessage: vi.fn().mockRejectedValue(new Error('Network failure')),
      });

      const { sendMessage } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError,
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await sendMessage(userMessageInput);

      expect(setRuntimeError).toHaveBeenCalledTimes(1);
      expect(setRuntimeError.mock.calls[0][0].code).toBe('SEND_ERROR');
      expect(setRuntimeError.mock.calls[0][0].message).toBe('Network failure');
    });

    it('clears the AbortController in the finally block', async () => {
      const store = new ChatStore();
      store.setActiveConversation('c1');
      const adapter = createAdapter();

      const { sendMessage } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await sendMessage(userMessageInput);

      expect(store.state.activeStreamAbortController).toBeNull();
    });

    it('calls adapter.sendMessage with message, messages array, and signal', async () => {
      const store = new ChatStore({
        initialMessages: [{ id: 'prev-1', role: 'user', parts: [{ type: 'text', text: 'Prev' }] }],
      });
      store.setActiveConversation('c1');
      const adapter = createAdapter();

      const { sendMessage } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await sendMessage({
        id: 'new-1',
        conversationId: 'c1',
        parts: [{ type: 'text', text: 'Hi' }],
      });

      expect(adapter.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          conversationId: 'c1',
          message: expect.objectContaining({ id: 'new-1', role: 'user' }),
          messages: expect.arrayContaining([expect.objectContaining({ id: 'prev-1' })]),
          signal: expect.any(AbortSignal),
        }),
      );
    });
  });

  describe('retry', () => {
    it('no-ops when the messageId is not found in the store', async () => {
      const store = new ChatStore();
      const adapter = createAdapter();

      const { retry } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await retry('nonexistent-id');

      expect(adapter.sendMessage).not.toHaveBeenCalled();
    });

    it('no-ops when the message is not a user message', async () => {
      const assistantMessage: ChatMessage = {
        id: 'a1',
        role: 'assistant',
        status: 'sent',
        parts: [{ type: 'text', text: 'Hi' }],
      };
      const store = new ChatStore({ initialMessages: [assistantMessage] });
      const adapter = createAdapter();

      const { retry } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await retry('a1');

      expect(adapter.sendMessage).not.toHaveBeenCalled();
    });

    it('removes associated assistant messages and re-sends the user message', async () => {
      const userMsg: ChatMessage = {
        id: 'u1',
        role: 'user',
        parts: [{ type: 'text', text: 'Hello' }],
      };
      const assistantMsg: ChatMessage = {
        id: 'a1',
        role: 'assistant',
        status: 'error',
        parts: [{ type: 'text', text: 'Oops' }],
      };
      const store = new ChatStore({ initialMessages: [userMsg, assistantMsg] });
      const assistantMessageIdByUserMessageIdRef: { current: Map<string, string> } = {
        current: new Map([['u1', 'a1']]),
      };
      // The retry uses a stream that creates a NEW assistant message with id 'a2'
      // so we can confirm 'a1' was removed and 'a2' was added
      const adapter = createAdapter({
        sendMessage: vi.fn().mockResolvedValue(
          createStream([
            { type: 'start', messageId: 'a2' },
            { type: 'finish', messageId: 'a2', finishReason: 'stop' },
          ]),
        ),
      });

      const { retry } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef,
      });

      await retry('u1');

      // The old assistant message should be removed and a new one created
      expect(store.state.messagesById.a1).toBeUndefined();
      expect(store.state.messagesById.a2).toBeDefined();
      // The adapter should have been called with the user message
      expect(adapter.sendMessage).toHaveBeenCalledTimes(1);
      expect(adapter.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.objectContaining({ id: 'u1' }),
        }),
      );
    });

    it('does not remove associated assistant messages when retry is blocked by an active stream', async () => {
      const userMsg: ChatMessage = {
        id: 'u1',
        role: 'user',
        parts: [{ type: 'text', text: 'Hello' }],
      };
      const assistantMsg: ChatMessage = {
        id: 'a1',
        role: 'assistant',
        status: 'error',
        parts: [{ type: 'text', text: 'Oops' }],
      };
      const store = new ChatStore({ initialMessages: [userMsg, assistantMsg] });
      const assistantMessageIdByUserMessageIdRef: { current: Map<string, string> } = {
        current: new Map([['u1', 'a1']]),
      };
      const adapter = createAdapter();
      store.setStreaming(true);

      const { retry } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef,
      });

      await retry('u1');

      expect(adapter.sendMessage).not.toHaveBeenCalled();
      expect(store.state.messagesById.a1).toBe(assistantMsg);
      expect(assistantMessageIdByUserMessageIdRef.current.get('u1')).toBe('a1');
    });

    it('reuses the original attachments when retrying a failed user message', async () => {
      const store = new ChatStore();
      const attachments = [
        {
          localId: 'attachment-1',
          file: new File(['hello'], 'hello.txt', { type: 'text/plain' }),
          status: 'queued' as const,
        },
      ];
      const adapter = createAdapter({
        sendMessage: vi
          .fn()
          .mockRejectedValueOnce(new Error('Network failure'))
          .mockResolvedValueOnce(
            createStream([
              { type: 'start', messageId: 'a1' },
              { type: 'finish', messageId: 'a1', finishReason: 'stop' },
            ]),
          ),
      });

      const { sendMessage, retry } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await sendMessage({
        id: 'u1',
        parts: [{ type: 'text', text: 'Please read this file' }],
        attachments,
      });
      await retry('u1');

      expect(adapter.sendMessage).toHaveBeenCalledTimes(2);
      expect((adapter.sendMessage as any).mock.calls[0][0].attachments).toBe(attachments);
      expect((adapter.sendMessage as any).mock.calls[1][0].attachments).toBe(attachments);
      expect(store.state.messagesById.u1.status).toBe('sent');
    });
  });

  describe('regenerate', () => {
    beforeEach(() => {
      // `warnOnce` dedupes by message across the process; reset so each
      // warning-asserting test observes its own warning.
      clearWarningsCache();
    });

    function makeThread(): ChatMessage[] {
      return [
        { id: 'u1', role: 'user', status: 'sent', parts: [{ type: 'text', text: 'Hello' }] },
        { id: 'a1', role: 'assistant', status: 'sent', parts: [{ type: 'text', text: 'First' }] },
      ];
    }

    it('removes the old assistant run and streams a new reply via adapter.regenerate', async () => {
      const store = new ChatStore({ initialMessages: makeThread() });
      store.setActiveConversation('c1');
      let capturedInput: any;
      const adapter = createAdapter({
        regenerate: vi.fn().mockImplementation((input) => {
          capturedInput = input;
          return Promise.resolve(
            createStream([
              { type: 'start', messageId: 'a2' },
              { type: 'text-delta', id: 't2', delta: 'Second' },
              { type: 'finish', messageId: 'a2', finishReason: 'stop' },
            ]),
          );
        }),
      });

      const { regenerate } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map([['u1', 'a1']]) },
      });

      await regenerate('a1');

      expect(adapter.regenerate).toHaveBeenCalledTimes(1);
      expect(adapter.sendMessage).not.toHaveBeenCalled();
      expect(capturedInput.messageId).toBe('a1');
      expect(capturedInput.message.id).toBe('u1');
      // The removed assistant run must be excluded from the thread context.
      expect(capturedInput.messages.map((m: ChatMessage) => m.id)).toEqual(['u1']);
      expect(store.state.messagesById.a1).toBeUndefined();
      expect(store.state.messagesById.a2).toBeDefined();
      // Anchor user message status never leaves 'sent'.
      expect(store.state.messagesById.u1.status).toBe('sent');
      expect(store.state.isStreaming).toBe(false);
      expect(store.state.activeStreamAbortController).toBeNull();
    });

    it('resolves the anchor from an assistant id and removes the whole contiguous run with an empty map', async () => {
      const store = new ChatStore({
        initialMessages: [
          { id: 'u1', role: 'user', status: 'sent', parts: [{ type: 'text', text: 'Hi' }] },
          {
            id: 'a1',
            role: 'assistant',
            status: 'sent',
            parts: [{ type: 'text', text: 'One' }],
          },
          {
            id: 'a2',
            role: 'assistant',
            status: 'sent',
            parts: [{ type: 'text', text: 'Two' }],
          },
        ],
      });
      const adapter = createAdapter({
        regenerate: vi.fn().mockResolvedValue(
          createStream([
            { type: 'start', messageId: 'a3' },
            { type: 'finish', messageId: 'a3', finishReason: 'stop' },
          ]),
        ),
      });

      const { regenerate } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      // Clicking the first assistant message of a multi-message run removes BOTH.
      await regenerate('a1');

      expect(store.state.messagesById.a1).toBeUndefined();
      expect(store.state.messagesById.a2).toBeUndefined();
      expect(store.state.messagesById.a3).toBeDefined();
    });

    it('removes the whole run including a non-mapped sibling when the anchor has a ref mapping', async () => {
      // One send streamed two assistant messages; only 'a2' is in the ref map.
      // Regenerating the non-mapped sibling 'a1' must still clear both — the
      // exact case findAssistantMessageIdsForRetry's short-circuit gets wrong.
      const store = new ChatStore({
        initialMessages: [
          { id: 'u1', role: 'user', status: 'sent', parts: [{ type: 'text', text: 'Hi' }] },
          {
            id: 'a1',
            role: 'assistant',
            status: 'sent',
            parts: [{ type: 'text', text: 'One' }],
          },
          {
            id: 'a2',
            role: 'assistant',
            status: 'sent',
            parts: [{ type: 'text', text: 'Two' }],
          },
        ],
      });
      const adapter = createAdapter({
        regenerate: vi.fn().mockResolvedValue(
          createStream([
            { type: 'start', messageId: 'a3' },
            { type: 'finish', messageId: 'a3', finishReason: 'stop' },
          ]),
        ),
      });

      const { regenerate } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map([['u1', 'a2']]) },
      });

      await regenerate('a1');

      expect(store.state.messagesById.a1).toBeUndefined();
      expect(store.state.messagesById.a2).toBeUndefined();
      expect(store.state.messagesById.a3).toBeDefined();
    });

    it('treats a user id directly as the anchor', async () => {
      const store = new ChatStore({ initialMessages: makeThread() });
      const adapter = createAdapter({
        regenerate: vi.fn().mockResolvedValue(
          createStream([
            { type: 'start', messageId: 'a2' },
            { type: 'finish', messageId: 'a2', finishReason: 'stop' },
          ]),
        ),
      });

      const { regenerate } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await regenerate('u1');

      expect((adapter.regenerate as any).mock.calls[0][0].message.id).toBe('u1');
      expect(store.state.messagesById.a1).toBeUndefined();
    });

    it('falls back to adapter.sendMessage with the anchor user message when regenerate is unimplemented', async () => {
      const store = new ChatStore({ initialMessages: makeThread() });
      const adapter = createAdapter({
        sendMessage: vi.fn().mockResolvedValue(
          createStream([
            { type: 'start', messageId: 'a2' },
            { type: 'finish', messageId: 'a2', finishReason: 'stop' },
          ]),
        ),
      });

      const { regenerate } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map([['u1', 'a1']]) },
      });

      await regenerate('a1');

      expect(adapter.sendMessage).toHaveBeenCalledTimes(1);
      expect((adapter.sendMessage as any).mock.calls[0][0].message.id).toBe('u1');
      expect(store.state.messagesById.a1).toBeUndefined();
      expect(store.state.messagesById.a2).toBeDefined();
    });

    it('no-ops while streaming', async () => {
      const store = new ChatStore({ initialMessages: makeThread() });
      store.setStreaming(true);
      const adapter = createAdapter({ regenerate: vi.fn() });

      const { regenerate } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await regenerate('a1');

      expect(adapter.regenerate).not.toHaveBeenCalled();
      expect(store.state.messagesById.a1).toBeDefined();
    });

    it('collapses synchronous double-invocation into a single adapter call', async () => {
      const store = new ChatStore({ initialMessages: makeThread() });
      let resolveStream!: (s: ReadableStream<any>) => void;
      const adapter = createAdapter({
        regenerate: vi.fn().mockImplementation(
          () =>
            new Promise((resolve) => {
              resolveStream = resolve;
            }),
        ),
      });

      const { regenerate } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map([['u1', 'a1']]) },
      });

      // Fire twice without awaiting — the second must be a no-op because
      // `isSending` is set synchronously before the first `await`.
      const first = regenerate('a1');
      const second = regenerate('a1');

      resolveStream(
        createStream([
          { type: 'start', messageId: 'a2' },
          { type: 'finish', messageId: 'a2', finishReason: 'stop' },
        ]),
      );

      await Promise.all([first, second]);

      expect(adapter.regenerate).toHaveBeenCalledTimes(1);
    });

    it('no-ops with a dev warning for an unknown id', async () => {
      const store = new ChatStore({ initialMessages: makeThread() });
      const adapter = createAdapter({ regenerate: vi.fn() });

      const { regenerate } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await expect(() => regenerate('nope')).toWarnDev([
        'MUI X Chat: `regenerate()` could not resolve the target message.',
      ]);

      expect(adapter.regenerate).not.toHaveBeenCalled();
    });

    it('no-ops for an assistant message with no preceding user message', async () => {
      const store = new ChatStore({
        initialMessages: [
          {
            id: 'a1',
            role: 'assistant',
            status: 'sent',
            parts: [{ type: 'text', text: 'Orphan' }],
          },
        ],
      });
      const adapter = createAdapter({ regenerate: vi.fn() });

      const { regenerate } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map() },
      });

      await expect(() => regenerate('a1')).toWarnDev([
        'MUI X Chat: `regenerate()` could not resolve the target message.',
      ]);

      expect(adapter.regenerate).not.toHaveBeenCalled();
      expect(store.state.messagesById.a1).toBeDefined();
    });

    it('restores the removed assistant run and sets REGENERATE_ERROR when adapter.regenerate rejects', async () => {
      const store = new ChatStore({ initialMessages: makeThread() });
      store.setActiveConversation('c1');
      const onError = vi.fn();
      const setRuntimeError = vi.fn();
      const adapter = createAdapter({
        regenerate: vi.fn().mockRejectedValue(new Error('Regen failed')),
      });

      const { regenerate } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter, onError } },
        setRuntimeError,
        assistantMessageIdByUserMessageIdRef: { current: new Map([['u1', 'a1']]) },
      });

      await regenerate('a1');

      // The removed assistant message is restored (D4).
      expect(store.state.messagesById.a1).toBeDefined();
      expect(setRuntimeError).toHaveBeenCalledTimes(1);
      expect(setRuntimeError.mock.calls[0][0].code).toBe('REGENERATE_ERROR');
      expect(setRuntimeError.mock.calls[0][0].message).toBe('Regen failed');
      expect(setRuntimeError.mock.calls[0][0].details.messageId).toBe('a1');
      expect(store.state.isStreaming).toBe(false);
    });

    it('fires onError on a mid-stream error and keeps partial output (no rollback)', async () => {
      const store = new ChatStore({ initialMessages: makeThread() });
      store.setActiveConversation('c1');
      const onError = vi.fn();
      // Stream a start (partial output) then close without a terminal chunk,
      // with no reconnect support → processStream reports an error.
      const adapter = createAdapter({
        regenerate: vi.fn().mockResolvedValue(createStream([{ type: 'start', messageId: 'a2' }])),
      });

      const { regenerate } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter, onError } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map([['u1', 'a1']]) },
      });

      await regenerate('a1');

      expect(onError).toHaveBeenCalledTimes(1);
      expect(store.state.error?.code).toBe('STREAM_ERROR');
      // Partial output kept — the new assistant message exists, not rolled back
      // to the old one.
      expect(store.state.messagesById.a2).toBeDefined();
      expect(store.state.messagesById.a1).toBeUndefined();
      expect(store.state.isStreaming).toBe(false);
    });

    it('retains a partial assistant message and sets no error when aborted mid-stream', async () => {
      const store = new ChatStore({ initialMessages: makeThread() });
      store.setActiveConversation('c1');
      const setRuntimeError = vi.fn();
      const pendingStream = new ReadableStream({
        start(controller) {
          controller.enqueue({ type: 'start', messageId: 'a2' });
        },
        cancel() {},
      });
      const adapter = createAdapter({
        regenerate: vi.fn().mockResolvedValue(pendingStream),
      });

      const { regenerate } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError,
        assistantMessageIdByUserMessageIdRef: { current: new Map([['u1', 'a1']]) },
      });

      const promise = regenerate('a1');

      await waitForCondition(() => store.state.activeStreamAbortController != null);
      store.state.activeStreamAbortController?.abort();

      await promise;

      expect(store.state.error).toBeNull();
      expect(setRuntimeError).not.toHaveBeenCalled();
      expect(store.state.messagesById.a2).toBeDefined();
    });

    it('updates the user→assistant mapping to the new assistant id after success', async () => {
      const store = new ChatStore({ initialMessages: makeThread() });
      const ref: { current: Map<string, string> } = { current: new Map([['u1', 'a1']]) };
      const adapter = createAdapter({
        regenerate: vi.fn().mockResolvedValue(
          createStream([
            { type: 'start', messageId: 'a2' },
            { type: 'finish', messageId: 'a2', finishReason: 'stop' },
          ]),
        ),
      });

      const { regenerate } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: ref,
      });

      await regenerate('a1');

      expect(ref.current.get('u1')).toBe('a2');
    });

    it('reuses an id streamed under the old assistant id (server id reuse)', async () => {
      const store = new ChatStore({ initialMessages: makeThread() });
      const adapter = createAdapter({
        regenerate: vi.fn().mockResolvedValue(
          createStream([
            { type: 'start', messageId: 'a1' },
            { type: 'text-delta', id: 't', delta: 'Regenerated' },
            { type: 'finish', messageId: 'a1', finishReason: 'stop' },
          ]),
        ),
      });

      const { regenerate } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: { current: new Map([['u1', 'a1']]) },
      });

      await regenerate('a1');

      expect(store.state.messagesById.a1).toBeDefined();
      expect(store.state.messagesById.a1.parts).toEqual([
        { type: 'text', text: 'Regenerated', state: 'done' },
      ]);
    });

    it('regenerates a mid-thread turn without removing later turns', async () => {
      const store = new ChatStore({
        initialMessages: [
          { id: 'u1', role: 'user', status: 'sent', parts: [{ type: 'text', text: 'Q1' }] },
          {
            id: 'a1',
            role: 'assistant',
            status: 'sent',
            parts: [{ type: 'text', text: 'A1' }],
          },
          { id: 'u2', role: 'user', status: 'sent', parts: [{ type: 'text', text: 'Q2' }] },
          {
            id: 'a2',
            role: 'assistant',
            status: 'sent',
            parts: [{ type: 'text', text: 'A2' }],
          },
        ],
      });
      let capturedMessages: ChatMessage[] = [];
      const adapter = createAdapter({
        regenerate: vi.fn().mockImplementation((input) => {
          capturedMessages = input.messages;
          return Promise.resolve(
            createStream([
              { type: 'start', messageId: 'a1b' },
              { type: 'finish', messageId: 'a1b', finishReason: 'stop' },
            ]),
          );
        }),
      });

      const { regenerate } = createSendMessageActions({
        store,
        storeUnknown: asUnknown(store),
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        assistantMessageIdByUserMessageIdRef: {
          current: new Map([
            ['u1', 'a1'],
            ['u2', 'a2'],
          ]),
        },
      });

      await regenerate('a1');

      // Only the first turn's reply is removed; later turns remain.
      expect(store.state.messagesById.a1).toBeUndefined();
      expect(store.state.messagesById.a1b).toBeDefined();
      expect(store.state.messagesById.u2).toBeDefined();
      expect(store.state.messagesById.a2).toBeDefined();
      // Thread context sent to the adapter stops at the anchor (u1), excluding
      // the removed reply.
      expect(capturedMessages.map((m) => m.id)).toEqual(['u1', 'u2', 'a2']);
    });
  });
});

async function waitForCondition(predicate: () => boolean, timeoutMs = 1000): Promise<void> {
  const start = Date.now();
  while (!predicate()) {
    if (Date.now() - start > timeoutMs) {
      throw new Error('waitForCondition timed out');
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => {
      setTimeout(resolve, 5);
    });
  }
}
