import { describe, expect, it, vi } from 'vitest';
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

      const messageIds = store.state.messageIds;
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
  });
});
