import * as React from 'react';
import { act, renderHook, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '../adapters';
import { ChatProvider, type ChatProviderProps } from '../ChatProvider';
import type { ChatConversation, ChatMessage } from '../types/chat-entities';
import { useChat } from './useChat';
import { useChatStatus } from './useChatStatus';
import { useChatStore } from './useChatStore';

function createStream(values: any[] = []): ReadableStream<any> {
  return new ReadableStream({
    start(controller) {
      values.forEach((value) => controller.enqueue(value));
      controller.close();
    },
  });
}

function createPendingStream() {
  return new ReadableStream({
    start() {},
    cancel() {},
  });
}

function createControlledStream() {
  let controllerRef: ReadableStreamDefaultController<any> | null = null;
  let resolveReady: ((controller: ReadableStreamDefaultController<any>) => void) | null = null;
  const ready = new Promise<ReadableStreamDefaultController<any>>((resolve) => {
    resolveReady = resolve;
  });
  const cancel = vi.fn();

  return {
    stream: new ReadableStream({
      start(controller) {
        controllerRef = controller;
        resolveReady?.(controller);
      },
      cancel,
    }),
    cancel,
    async enqueue(value: any) {
      (controllerRef ?? (await ready)).enqueue(value);
    },
    async close() {
      (controllerRef ?? (await ready)).close();
    },
  };
}

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    async sendMessage() {
      return createStream();
    },
    ...overrides,
  };
}

function createProviderWrapper(initialProps: Omit<ChatProviderProps, 'children'>) {
  let currentProps = initialProps;

  function Wrapper({ children }: React.PropsWithChildren) {
    return <ChatProvider {...currentProps}>{children}</ChatProvider>;
  }

  return {
    Wrapper,
    setProps(nextProps: Omit<ChatProviderProps, 'children'>) {
      currentProps = nextProps;
    },
  };
}

describe('useChat', () => {
  it('sends a user message optimistically, streams the assistant response, and keeps action references stable', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async ({ conversationId, message, messages }) => {
        expect(conversationId).toBe('c1');
        expect(message.role).toBe('user');
        expect(message.status).toBe('sending');
        expect(messages).toHaveLength(1);
        expect(messages[0].id).toBe(message.id);

        return createStream([
          { type: 'start', messageId: 'assistant-1' },
          { type: 'text-delta', id: 'text-1', delta: 'Hello back' },
          { type: 'finish', messageId: 'assistant-1', finishReason: 'stop' },
        ]);
      }),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    const initialSendMessage = result.current.sendMessage;
    const initialStopStreaming = result.current.stopStreaming;

    await act(async () => {
      await result.current.sendMessage({
        conversationId: 'c1',
        parts: [{ type: 'text', text: 'Hello' }],
      });
    });

    expect(result.current.sendMessage).toBe(initialSendMessage);
    expect(result.current.stopStreaming).toBe(initialStopStreaming);
    expect(adapter.sendMessage).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.messages).toEqual([
      expect.objectContaining({
        conversationId: 'c1',
        role: 'user',
        status: 'sent',
        parts: [{ type: 'text', text: 'Hello' }],
      }),
      {
        id: 'assistant-1',
        conversationId: 'c1',
        role: 'assistant',
        status: 'sent',
        parts: [{ type: 'text', text: 'Hello back', state: 'done' }],
      },
    ]);
  });

  it('prevents double submit while streaming and stopStreaming cancels the active stream', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => createPendingStream()),
      stop: vi.fn(),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    act(() => {
      void result.current.sendMessage({
        conversationId: 'c1',
        parts: [{ type: 'text', text: 'First' }],
      });
    });

    await waitFor(() => {
      expect(result.current.isStreaming).toBe(true);
    });

    await act(async () => {
      await result.current.sendMessage({
        conversationId: 'c1',
        parts: [{ type: 'text', text: 'Second' }],
      });
    });

    expect(adapter.sendMessage).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.stopStreaming();
    });

    await waitFor(() => {
      expect(result.current.isStreaming).toBe(false);
    });

    expect(adapter.stop).toHaveBeenCalledTimes(1);
    expect(result.current.messages[0]?.status).toBe('cancelled');
  });

  it('stores the active stream abort controller on state and clears it after stopStreaming', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => createPendingStream()),
      stop: vi.fn(),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
    });
    const { result } = renderHook(
      () => ({
        chat: useChat(),
        store: useChatStore(),
      }),
      { wrapper: Wrapper },
    );

    act(() => {
      void result.current.chat.sendMessage({
        conversationId: 'c1',
        parts: [{ type: 'text', text: 'First' }],
      });
    });

    await waitFor(() => {
      expect(result.current.store.state.activeStreamAbortController).toBeInstanceOf(
        AbortController,
      );
    });

    act(() => {
      result.current.chat.stopStreaming();
    });

    await waitFor(() => {
      expect(result.current.store.state.activeStreamAbortController).toBeNull();
    });

    expect(adapter.stop).toHaveBeenCalledTimes(1);
  });

  it('does not create duplicate streams in Strict Mode when sendMessage is triggered from an effect', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => createPendingStream()),
    });
    const wrapper = ({ children }: React.PropsWithChildren) => (
      <React.StrictMode>
        <ChatProvider adapter={adapter}>{children}</ChatProvider>
      </React.StrictMode>
    );
    const { result, unmount } = renderHook(
      () => {
        const chat = useChat();

        React.useEffect(() => {
          void chat.sendMessage({
            conversationId: 'c1',
            parts: [{ type: 'text', text: 'Hello from effect' }],
          });
        }, [chat, chat.sendMessage]);

        return chat;
      },
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isStreaming).toBe(true);
    });

    expect(adapter.sendMessage).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('aborts an active stream during unmount and clears the pending controller', async () => {
    const controlledStream = createControlledStream();
    const stop = vi.fn();
    let signalRef: AbortSignal | undefined;
    const adapter = createAdapter({
      sendMessage: vi.fn(async ({ signal }) => {
        signalRef = signal;
        return controlledStream.stream;
      }),
      stop,
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
    });
    const { result, unmount } = renderHook(
      () => ({
        chat: useChat(),
        store: useChatStore(),
      }),
      { wrapper: Wrapper },
    );

    let sendPromise!: Promise<void>;

    act(() => {
      sendPromise = result.current.chat.sendMessage({
        conversationId: 'c1',
        parts: [{ type: 'text', text: 'Stream on unmount' }],
      });
    });

    await waitFor(() => {
      expect(result.current.chat.isStreaming).toBe(true);
      expect(result.current.store.state.activeStreamAbortController).toBeInstanceOf(
        AbortController,
      );
    });

    const store = result.current.store;
    const userMessageId = result.current.chat.messages[0]?.id;

    unmount();

    await sendPromise;

    expect(signalRef?.aborted).toBe(true);
    expect(stop).toHaveBeenCalledTimes(1);
    expect(controlledStream.cancel).toHaveBeenCalledTimes(1);
    expect(store.state.activeStreamAbortController).toBeNull();
    expect(store.state.isStreaming).toBe(false);
    expect(store.state.messageIds).toEqual([userMessageId]);
    expect(store.state.messagesById[userMessageId ?? '']).toEqual(
      expect.objectContaining({
        id: userMessageId,
        status: 'cancelled',
      }),
    );
  });

  it('assembles streamed assistant parts end-to-end from envelopes and batched deltas', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () =>
        createStream([
          {
            eventId: 'evt-1',
            sequence: 1,
            chunk: { type: 'start', messageId: 'assistant-1' },
          },
          {
            eventId: 'evt-2',
            sequence: 2,
            chunk: { type: 'reasoning-delta', id: 'reasoning-1', delta: 'Thinking' },
          },
          {
            eventId: 'evt-4',
            sequence: 4,
            chunk: { type: 'text-delta', id: 'text-1', delta: ' world' },
          },
          {
            eventId: 'evt-3',
            sequence: 3,
            chunk: { type: 'text-delta', id: 'text-1', delta: 'Hello' },
          },
          {
            eventId: 'evt-4',
            sequence: 4,
            chunk: { type: 'text-delta', id: 'text-1', delta: ' world' },
          },
          {
            eventId: 'evt-5',
            sequence: 5,
            chunk: { type: 'text-end', id: 'text-1' },
          },
          {
            eventId: 'evt-6',
            sequence: 6,
            chunk: { type: 'tool-input-start', toolCallId: 'tool-1', toolName: 'search' },
          },
          {
            eventId: 'evt-7',
            sequence: 7,
            chunk: {
              type: 'tool-input-available',
              toolCallId: 'tool-1',
              toolName: 'search',
              input: { query: 'weather' },
            },
          },
          {
            eventId: 'evt-8',
            sequence: 8,
            chunk: {
              type: 'tool-output-available',
              toolCallId: 'tool-1',
              output: { results: ['sunny'] },
            },
          },
          {
            eventId: 'evt-9',
            sequence: 9,
            chunk: {
              type: 'source-url',
              sourceId: 'source-url-1',
              url: 'https://mui.com',
              title: 'MUI',
            },
          },
          {
            eventId: 'evt-10',
            sequence: 10,
            chunk: {
              type: 'source-document',
              sourceId: 'source-document-1',
              title: 'Docs',
              text: 'The answer came from docs.',
            },
          },
          {
            eventId: 'evt-11',
            sequence: 11,
            chunk: {
              type: 'file',
              mediaType: 'image/png',
              url: 'https://mui.com/logo.png',
              filename: 'logo.png',
            },
          },
          {
            eventId: 'evt-12',
            sequence: 12,
            chunk: {
              type: 'data-weather',
              id: 'data-1',
              data: { city: 'Prague', temperatureC: 12 },
            },
          },
          {
            eventId: 'evt-13',
            sequence: 13,
            chunk: { type: 'start-step' },
          },
          {
            eventId: 'evt-14',
            sequence: 14,
            chunk: { type: 'finish-step' },
          },
          {
            eventId: 'evt-15',
            sequence: 15,
            chunk: { type: 'message-metadata', metadata: { traceId: 'trace-1' } },
          },
          {
            eventId: 'evt-16',
            sequence: 16,
            chunk: { type: 'finish', messageId: 'assistant-1', finishReason: 'stop' },
          },
        ]),
      ),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      streamFlushInterval: 32,
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.sendMessage({
        conversationId: 'c1',
        parts: [{ type: 'text', text: 'Hello' }],
      });
    });

    expect(result.current.messages).toEqual([
      expect.objectContaining({
        conversationId: 'c1',
        role: 'user',
        status: 'sent',
        parts: [{ type: 'text', text: 'Hello' }],
      }),
      {
        id: 'assistant-1',
        conversationId: 'c1',
        role: 'assistant',
        status: 'sent',
        metadata: { traceId: 'trace-1' },
        parts: [
          { type: 'reasoning', text: 'Thinking', state: 'done' },
          { type: 'text', text: 'Hello world', state: 'done' },
          {
            type: 'tool',
            toolInvocation: {
              toolCallId: 'tool-1',
              toolName: 'search',
              input: { query: 'weather' },
              output: { results: ['sunny'] },
              preliminary: undefined,
              state: 'output-available',
            },
          },
          { type: 'source-url', sourceId: 'source-url-1', url: 'https://mui.com', title: 'MUI' },
          {
            type: 'source-document',
            sourceId: 'source-document-1',
            title: 'Docs',
            text: 'The answer came from docs.',
          },
          {
            type: 'file',
            mediaType: 'image/png',
            url: 'https://mui.com/logo.png',
            filename: 'logo.png',
          },
          {
            type: 'data-weather',
            id: 'data-1',
            data: { city: 'Prague', temperatureC: 12 },
            transient: undefined,
          },
          { type: 'step-start' },
        ],
      },
    ]);
  });

  it('loads conversations on mount, subscribes to realtime events, and handles every event type', async () => {
    const cleanup = vi.fn();
    let onEvent: ((event: any) => void) | undefined;
    const initialThreadMessage: ChatMessage = {
      id: 'm1',
      conversationId: 'c1',
      role: 'assistant',
      status: 'sent',
      parts: [{ type: 'text', text: 'Loaded thread' }],
    };
    const initialConversation: ChatConversation = {
      id: 'c1',
      title: 'General',
      unreadCount: 3,
      readState: 'unread',
      participants: [{ id: 'u1', displayName: 'Alex', isOnline: false }],
    };
    const adapter = createAdapter({
      listConversations: vi.fn(async () => ({
        conversations: [initialConversation],
      })),
      listMessages: vi.fn(async ({ conversationId }) => ({
        messages: conversationId === 'c1' ? [initialThreadMessage] : [],
        cursor: undefined,
        hasMore: false,
      })),
      subscribe: vi.fn(({ onEvent: currentOnEvent }) => {
        onEvent = currentOnEvent;
        return cleanup;
      }),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      initialActiveConversationId: 'c1',
    });
    const { result, unmount } = renderHook(() => useChat(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.conversations).toHaveLength(1);
      expect(result.current.messages).toEqual([initialThreadMessage]);
    });

    expect(adapter.listConversations).toHaveBeenCalledTimes(1);
    expect(adapter.subscribe).toHaveBeenCalledTimes(1);

    act(() => {
      onEvent?.({
        type: 'message-updated',
        message: {
          ...initialThreadMessage,
          parts: [{ type: 'text', text: 'Updated thread' }],
        } satisfies ChatMessage,
      });
      onEvent?.({
        type: 'message-updated',
        message: {
          id: 'm2',
          conversationId: 'c1',
          role: 'assistant',
          status: 'sent',
          parts: [{ type: 'text', text: 'Added via update' }],
        } satisfies ChatMessage,
      });
      onEvent?.({
        type: 'message-removed',
        messageId: 'm2',
        conversationId: 'c1',
      });
      onEvent?.({
        type: 'conversation-added',
        conversation: {
          id: 'c2',
          title: 'Support',
          unreadCount: 1,
        } satisfies ChatConversation,
      });
      onEvent?.({
        type: 'conversation-updated',
        conversation: {
          id: 'c2',
          title: 'Support updated',
          unreadCount: 2,
        } satisfies ChatConversation,
      });
      onEvent?.({
        type: 'conversation-updated',
        conversation: {
          id: 'c3',
          title: 'Sales',
        } satisfies ChatConversation,
      });
      onEvent?.({
        type: 'read',
        conversationId: 'c1',
      });
      onEvent?.({
        type: 'presence',
        userId: 'u1',
        isOnline: true,
      });
      onEvent?.({
        type: 'typing',
        conversationId: 'c1',
        userId: 'u1',
        isTyping: true,
      });
    });

    expect(result.current.messages).toEqual([
      {
        ...initialThreadMessage,
        parts: [{ type: 'text', text: 'Updated thread' }],
      },
    ]);
    expect(result.current.conversations).toEqual([
      {
        id: 'c1',
        title: 'General',
        unreadCount: 0,
        readState: 'read',
        participants: [{ id: 'u1', displayName: 'Alex', isOnline: true }],
      },
      {
        id: 'c2',
        title: 'Support updated',
        unreadCount: 2,
      },
      {
        id: 'c3',
        title: 'Sales',
      },
    ]);

    act(() => {
      onEvent?.({
        type: 'conversation-removed',
        conversationId: 'c1',
      });
    });

    expect(result.current.activeConversationId).toBeUndefined();
    expect(result.current.messages).toEqual([]);
    expect(result.current.conversations).toEqual([
      {
        id: 'c2',
        title: 'Support updated',
        unreadCount: 2,
      },
      {
        id: 'c3',
        title: 'Sales',
      },
    ]);

    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('loads the active conversation thread and prepends more history', async () => {
    const newestMessage: ChatMessage = {
      id: 'm2',
      conversationId: 'c1',
      role: 'assistant',
      status: 'sent',
      parts: [{ type: 'text', text: 'Newest' }],
    };
    const olderMessage: ChatMessage = {
      id: 'm1',
      conversationId: 'c1',
      role: 'user',
      status: 'sent',
      parts: [{ type: 'text', text: 'Older' }],
    };
    const adapter = createAdapter({
      listMessages: vi.fn(async ({ conversationId, cursor }) => {
        if (conversationId === 'c1' && cursor == null) {
          return {
            messages: [newestMessage],
            cursor: 'cursor-1',
            hasMore: true,
          };
        }

        return {
          messages: [olderMessage],
          cursor: undefined,
          hasMore: false,
        };
      }),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      initialActiveConversationId: 'c1',
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.messages.map((message) => message.id)).toEqual(['m2']);
    });

    expect(result.current.hasMoreHistory).toBe(true);

    await act(async () => {
      await result.current.loadMoreHistory();
    });

    expect(result.current.messages.map((message) => message.id)).toEqual(['m1', 'm2']);
    expect(result.current.hasMoreHistory).toBe(false);
  });

  it('switches conversations, aborts active streaming, and loads the new thread', async () => {
    const adapter = createAdapter({
      listMessages: vi.fn(async ({ conversationId }) => {
        const message: ChatMessage = {
          id: `${conversationId}-message`,
          conversationId,
          role: 'assistant',
          status: 'sent',
          parts: [{ type: 'text', text: `Thread ${conversationId}` }],
        };

        return {
          messages: [message],
          cursor: undefined,
          hasMore: false,
        };
      }),
      sendMessage: vi.fn(async () => createPendingStream()),
      stop: vi.fn(),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      initialActiveConversationId: 'c1',
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.messages.map((message) => message.id)).toEqual(['c1-message']);
    });

    act(() => {
      void result.current.sendMessage({
        parts: [{ type: 'text', text: 'While streaming' }],
      });
    });

    await waitFor(() => {
      expect(result.current.isStreaming).toBe(true);
    });

    await act(async () => {
      await result.current.setActiveConversation('c2');
    });

    expect(adapter.stop).toHaveBeenCalledTimes(1);
    expect(result.current.activeConversationId).toBe('c2');
    expect(result.current.messages.map((message) => message.id)).toEqual(['c2-message']);
  });

  it('retries a user message by removing the previous assistant response and resending the original content', async () => {
    let attempt = 0;
    const adapter = createAdapter({
      sendMessage: vi.fn(async ({ message, messages }) => {
        attempt += 1;

        if (attempt === 1) {
          // eslint-disable-next-line vitest/no-conditional-expect
          expect(messages.map((currentMessage) => currentMessage.id)).toEqual([message.id]);
          return createStream([
            { type: 'start', messageId: 'assistant-1' },
            { type: 'text-delta', id: 'text-1', delta: 'First answer' },
            { type: 'finish', messageId: 'assistant-1' },
          ]);
        }

        expect(messages.map((currentMessage) => currentMessage.id)).toEqual([message.id]);
        expect(message.parts).toEqual([{ type: 'text', text: 'Retry me' }]);
        return createStream([
          { type: 'start', messageId: 'assistant-2' },
          { type: 'text-delta', id: 'text-2', delta: 'Second answer' },
          { type: 'finish', messageId: 'assistant-2' },
        ]);
      }),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.sendMessage({
        id: 'user-1',
        conversationId: 'c1',
        parts: [{ type: 'text', text: 'Retry me' }],
      });
    });

    expect(result.current.messages.map((message) => message.id)).toEqual(['user-1', 'assistant-1']);

    await act(async () => {
      await result.current.retry('user-1');
    });

    expect(result.current.messages.map((message) => message.id)).toEqual(['user-1', 'assistant-2']);
    expect(result.current.messages[1]).toEqual({
      id: 'assistant-2',
      conversationId: 'c1',
      role: 'assistant',
      status: 'sent',
      parts: [{ type: 'text', text: 'Second answer', state: 'done' }],
    });
  });

  it('updates tool approval state locally and forwards the response to the adapter', async () => {
    const addToolApprovalResponse = vi.fn(async () => {});
    const approvalMessage: ChatMessage = {
      id: 'assistant-1',
      conversationId: 'c1',
      role: 'assistant',
      status: 'sent',
      parts: [
        {
          type: 'tool',
          toolInvocation: {
            toolCallId: 'tool-1',
            toolName: 'search',
            state: 'approval-requested',
            input: { query: 'weather' },
          },
        },
      ],
    };
    const { Wrapper } = createProviderWrapper({
      adapter: createAdapter({
        addToolApprovalResponse,
        listMessages: vi.fn(async () => ({
          messages: [approvalMessage],
          cursor: undefined,
          hasMore: false,
        })),
      }),
      initialActiveConversationId: 'c1',
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1);
    });

    await act(async () => {
      await result.current.addToolApprovalResponse({
        id: 'tool-1',
        approved: true,
        reason: 'Approved',
      });
    });

    expect(addToolApprovalResponse).toHaveBeenCalledWith({
      id: 'tool-1',
      approved: true,
      reason: 'Approved',
    });
    expect(result.current.messages[0]).toEqual({
      id: 'assistant-1',
      conversationId: 'c1',
      role: 'assistant',
      status: 'sent',
      parts: [
        {
          type: 'tool',
          toolInvocation: {
            toolCallId: 'tool-1',
            toolName: 'search',
            state: 'approval-responded',
            input: { query: 'weather' },
            approval: {
              approved: true,
              reason: 'Approved',
            },
          },
        },
      ],
    });
  });

  it('completes the tool approval flow from request to approved output', async () => {
    const controlledStream = createControlledStream();
    const addToolApprovalResponse = vi.fn(async () => {});
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => controlledStream.stream),
      addToolApprovalResponse,
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    let sendPromise!: Promise<void>;

    act(() => {
      sendPromise = result.current.sendMessage({
        conversationId: 'c1',
        parts: [{ type: 'text', text: 'Search weather' }],
      });
    });

    await waitFor(() => {
      expect(adapter.sendMessage).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      await controlledStream.enqueue({ type: 'start', messageId: 'assistant-1' });
      await controlledStream.enqueue({
        type: 'tool-approval-request',
        toolCallId: 'tool-1',
        toolName: 'search',
        input: { query: 'weather' },
      });
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[1]).toEqual(
        expect.objectContaining({
          id: 'assistant-1',
          conversationId: 'c1',
          role: 'assistant',
          parts: [
            {
              type: 'tool',
              toolInvocation: {
                toolCallId: 'tool-1',
                toolName: 'search',
                input: { query: 'weather' },
                state: 'approval-requested',
              },
            },
          ],
        }),
      );
    });

    await act(async () => {
      await result.current.addToolApprovalResponse({
        id: 'tool-1',
        approved: true,
        reason: 'Approved',
      });
    });

    expect(addToolApprovalResponse).toHaveBeenCalledWith({
      id: 'tool-1',
      approved: true,
      reason: 'Approved',
    });

    expect(result.current.messages[1]).toEqual(
      expect.objectContaining({
        id: 'assistant-1',
        parts: [
          {
            type: 'tool',
            toolInvocation: {
              toolCallId: 'tool-1',
              toolName: 'search',
              input: { query: 'weather' },
              state: 'approval-responded',
              approval: {
                approved: true,
                reason: 'Approved',
              },
            },
          },
        ],
      }),
    );

    await act(async () => {
      await controlledStream.enqueue({
        type: 'tool-output-available',
        toolCallId: 'tool-1',
        output: { results: ['sunny'] },
      });
      await controlledStream.enqueue({
        type: 'finish',
        messageId: 'assistant-1',
        finishReason: 'stop',
      });
      await controlledStream.close();
      await sendPromise;
    });

    expect(result.current.messages).toEqual([
      expect.objectContaining({
        conversationId: 'c1',
        role: 'user',
        status: 'sent',
        parts: [{ type: 'text', text: 'Search weather' }],
      }),
      {
        id: 'assistant-1',
        conversationId: 'c1',
        role: 'assistant',
        status: 'sent',
        parts: [
          {
            type: 'tool',
            toolInvocation: {
              toolCallId: 'tool-1',
              toolName: 'search',
              input: { query: 'weather' },
              output: { results: ['sunny'] },
              preliminary: undefined,
              state: 'output-available',
              approval: {
                approved: true,
                reason: 'Approved',
              },
            },
          },
        ],
      },
    ]);
  });

  it('completes the tool approval flow from request to denied output', async () => {
    const controlledStream = createControlledStream();
    const addToolApprovalResponse = vi.fn(async () => {});
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => controlledStream.stream),
      addToolApprovalResponse,
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    let sendPromise!: Promise<void>;

    act(() => {
      sendPromise = result.current.sendMessage({
        conversationId: 'c1',
        parts: [{ type: 'text', text: 'Run search' }],
      });
    });

    await waitFor(() => {
      expect(adapter.sendMessage).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      await controlledStream.enqueue({ type: 'start', messageId: 'assistant-1' });
      await controlledStream.enqueue({
        type: 'tool-approval-request',
        toolCallId: 'tool-1',
        toolName: 'search',
        input: { query: 'weather' },
      });
    });

    await waitFor(() => {
      expect(result.current.messages[1]).toEqual(
        expect.objectContaining({
          id: 'assistant-1',
          parts: [
            {
              type: 'tool',
              toolInvocation: {
                toolCallId: 'tool-1',
                toolName: 'search',
                input: { query: 'weather' },
                state: 'approval-requested',
              },
            },
          ],
        }),
      );
    });

    await act(async () => {
      await result.current.addToolApprovalResponse({
        id: 'tool-1',
        approved: false,
        reason: 'User denied',
      });
    });

    expect(addToolApprovalResponse).toHaveBeenCalledWith({
      id: 'tool-1',
      approved: false,
      reason: 'User denied',
    });

    expect(result.current.messages[1]).toEqual(
      expect.objectContaining({
        id: 'assistant-1',
        parts: [
          {
            type: 'tool',
            toolInvocation: {
              toolCallId: 'tool-1',
              toolName: 'search',
              input: { query: 'weather' },
              state: 'approval-responded',
              approval: {
                approved: false,
                reason: 'User denied',
              },
            },
          },
        ],
      }),
    );

    await act(async () => {
      await controlledStream.enqueue({
        type: 'tool-output-denied',
        toolCallId: 'tool-1',
        reason: 'Needs approval',
      });
      await controlledStream.enqueue({
        type: 'finish',
        messageId: 'assistant-1',
        finishReason: 'stop',
      });
      await controlledStream.close();
      await sendPromise;
    });

    expect(result.current.messages).toEqual([
      expect.objectContaining({
        conversationId: 'c1',
        role: 'user',
        status: 'sent',
        parts: [{ type: 'text', text: 'Run search' }],
      }),
      {
        id: 'assistant-1',
        conversationId: 'c1',
        role: 'assistant',
        status: 'sent',
        parts: [
          {
            type: 'tool',
            toolInvocation: {
              toolCallId: 'tool-1',
              toolName: 'search',
              input: { query: 'weather' },
              state: 'output-denied',
              approval: {
                approved: false,
                reason: 'Needs approval',
              },
            },
          },
        ],
      },
    ]);
  });

  it('surfaces send errors through state and onError', async () => {
    const onError = vi.fn();
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => {
        throw new Error('Network down');
      }),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      onError,
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.sendMessage({
        id: 'user-1',
        conversationId: 'c1',
        parts: [{ type: 'text', text: 'Hello' }],
      });
    });

    expect(result.current.messages[0]).toEqual(
      expect.objectContaining({
        id: 'user-1',
        status: 'error',
      }),
    );
    expect(result.current.error).toEqual({
      code: 'SEND_ERROR',
      message: 'Network down',
      source: 'send',
      recoverable: true,
      retryable: true,
      details: {
        messageId: 'user-1',
        conversationId: 'c1',
      },
    });
    expect(onError).toHaveBeenCalledWith(result.current.error);
  });

  it('sets HISTORY_ERROR when loadMoreHistory fails', async () => {
    const onError = vi.fn();
    const adapter = createAdapter({
      listMessages: vi.fn(async ({ cursor }) => {
        if (cursor == null) {
          return {
            messages: [
              {
                id: 'm1',
                conversationId: 'c1',
                role: 'assistant' as const,
                status: 'sent' as const,
                parts: [{ type: 'text' as const, text: 'First' }],
              },
            ],
            cursor: 'cursor-1',
            hasMore: true,
          };
        }

        throw new Error('History fetch failed');
      }),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      initialActiveConversationId: 'c1',
      onError,
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1);
      expect(result.current.hasMoreHistory).toBe(true);
    });

    await act(async () => {
      await result.current.loadMoreHistory();
    });

    expect(result.current.error).toEqual(
      expect.objectContaining({
        code: 'HISTORY_ERROR',
        message: 'History fetch failed',
      }),
    );
    expect(onError).toHaveBeenCalled();
  });

  it('setActiveConversation with undefined clears messages', async () => {
    const adapter = createAdapter({
      listMessages: vi.fn(async () => ({
        messages: [
          {
            id: 'm1',
            conversationId: 'c1',
            role: 'assistant' as const,
            status: 'sent' as const,
            parts: [{ type: 'text' as const, text: 'Thread' }],
          },
        ],
        cursor: undefined,
        hasMore: false,
      })),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      initialActiveConversationId: 'c1',
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1);
    });

    await act(async () => {
      await result.current.setActiveConversation(undefined);
    });

    expect(result.current.activeConversationId).toBeUndefined();
    expect(result.current.messages).toEqual([]);
  });

  it('addToolApprovalResponse does a silent no-op when no matching message is found', async () => {
    const addToolApprovalResponse = vi.fn(async () => {});
    const { Wrapper } = createProviderWrapper({
      adapter: createAdapter({
        addToolApprovalResponse,
      }),
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.addToolApprovalResponse({
        id: 'nonexistent-tool',
        approved: true,
        reason: 'Approved',
      });
    });

    expect(addToolApprovalResponse).toHaveBeenCalledWith({
      id: 'nonexistent-tool',
      approved: true,
      reason: 'Approved',
    });
    expect(result.current.error).toBeNull();
  });

  it('addToolApprovalResponse sets SEND_ERROR when adapter rejects', async () => {
    const onError = vi.fn();
    const approvalMessage: ChatMessage = {
      id: 'assistant-1',
      conversationId: 'c1',
      role: 'assistant',
      status: 'sent',
      parts: [
        {
          type: 'tool',
          toolInvocation: {
            toolCallId: 'tool-1',
            toolName: 'search',
            state: 'approval-requested',
            input: { query: 'weather' },
          },
        },
      ],
    };
    const { Wrapper } = createProviderWrapper({
      adapter: createAdapter({
        addToolApprovalResponse: vi.fn(async () => {
          throw new Error('Adapter error');
        }),
        listMessages: vi.fn(async () => ({
          messages: [approvalMessage],
          cursor: undefined,
          hasMore: false,
        })),
      }),
      initialActiveConversationId: 'c1',
      onError,
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1);
    });

    await act(async () => {
      await result.current.addToolApprovalResponse({
        id: 'tool-1',
        approved: true,
        reason: 'Approved',
      });
    });

    expect(result.current.error).toEqual(
      expect.objectContaining({
        code: 'SEND_ERROR',
        message: 'Adapter error',
      }),
    );
    expect(onError).toHaveBeenCalled();
  });

  it('retry is a no-op for a non-existent messageId', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () =>
        createStream([
          { type: 'start', messageId: 'a1' },
          { type: 'finish', messageId: 'a1' },
        ]),
      ),
    });
    const { Wrapper } = createProviderWrapper({ adapter });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.sendMessage({
        id: 'u1',
        conversationId: 'c1',
        parts: [{ type: 'text', text: 'Hello' }],
      });
    });

    const messagesBefore = result.current.messages.map((m) => m.id);
    const callCountBefore = (adapter.sendMessage as ReturnType<typeof vi.fn>).mock.calls.length;

    await act(async () => {
      await result.current.retry('nonexistent');
    });

    expect(result.current.messages.map((m) => m.id)).toEqual(messagesBefore);
    expect((adapter.sendMessage as ReturnType<typeof vi.fn>).mock.calls.length).toBe(
      callCountBefore,
    );
  });

  it('listConversations rejection sets HISTORY_ERROR on mount', async () => {
    const onError = vi.fn();
    const adapter = createAdapter({
      listConversations: vi.fn(async () => {
        throw new Error('Conversation load failed');
      }),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      onError,
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.error).toEqual(
        expect.objectContaining({
          code: 'HISTORY_ERROR',
          message: 'Conversation load failed',
        }),
      );
    });

    expect(onError).toHaveBeenCalled();
  });

  it('subscribe rejection sets REALTIME_ERROR', async () => {
    const onError = vi.fn();
    const adapter = createAdapter({
      subscribe: vi.fn(async () => {
        throw new Error('Subscribe failed');
      }),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      onError,
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.error).toEqual(
        expect.objectContaining({
          code: 'REALTIME_ERROR',
          message: 'Subscribe failed',
        }),
      );
    });

    expect(onError).toHaveBeenCalled();
  });

  it('setError(null) clears the error', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => {
        throw new Error('Send failed');
      }),
    });
    const { Wrapper } = createProviderWrapper({ adapter });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.sendMessage({
        conversationId: 'c1',
        parts: [{ type: 'text', text: 'Hello' }],
      });
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBeNull();
  });

  it('setError with a ChatError sets the error and calls onError', async () => {
    const onError = vi.fn();
    const { Wrapper } = createProviderWrapper({
      adapter: createAdapter(),
      onError,
    });
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper });

    act(() => {
      result.current.setError({
        code: 'STREAM_ERROR',
        message: 'Custom error',
        source: 'stream',
        recoverable: true,
      });
    });

    expect(result.current.error).toEqual({
      code: 'STREAM_ERROR',
      message: 'Custom error',
      source: 'stream',
      recoverable: true,
    });
    expect(onError).toHaveBeenCalledWith(result.current.error);
  });

  it('typing realtime events update useChatStatus.typingUserIds for the active conversation', async () => {
    let onEvent: ((event: any) => void) | undefined;
    const adapter = createAdapter({
      listConversations: vi.fn(async () => ({ conversations: [] })),
      subscribe: vi.fn(({ onEvent: handler }) => {
        onEvent = handler;
        return () => {};
      }),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      initialActiveConversationId: 'c1',
    });
    const { result } = renderHook(() => ({ chat: useChat(), status: useChatStatus() }), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(adapter.subscribe).toHaveBeenCalledTimes(1);
    });

    expect(result.current.status.typingUserIds).toEqual([]);

    // u1 starts typing in the active conversation
    act(() => {
      onEvent?.({ type: 'typing', conversationId: 'c1', userId: 'u1', isTyping: true });
    });

    expect(result.current.status.typingUserIds).toEqual(['u1']);

    // u2 also starts typing
    act(() => {
      onEvent?.({ type: 'typing', conversationId: 'c1', userId: 'u2', isTyping: true });
    });

    expect(result.current.status.typingUserIds).toEqual(['u1', 'u2']);

    // Typing in a different conversation does not appear in the active conversation
    act(() => {
      onEvent?.({ type: 'typing', conversationId: 'c2', userId: 'u3', isTyping: true });
    });

    expect(result.current.status.typingUserIds).toEqual(['u1', 'u2']);

    // u1 stops typing
    act(() => {
      onEvent?.({ type: 'typing', conversationId: 'c1', userId: 'u1', isTyping: false });
    });

    expect(result.current.status.typingUserIds).toEqual(['u2']);
  });
});
