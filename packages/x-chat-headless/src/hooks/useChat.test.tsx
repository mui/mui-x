import * as React from 'react';
import { act, renderHook, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '../adapters';
import { ChatProvider, type ChatProviderProps } from '../ChatProvider';
import type { ChatConversation, ChatMessage } from '../types/chat-entities';
import { useChat } from './useChat';

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

  it('loads conversations on mount and applies realtime message, read, and presence events', async () => {
    const cleanup = vi.fn();
    let onEvent: ((event: any) => void) | undefined;
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
      subscribe: vi.fn(({ onEvent: currentOnEvent }) => {
        onEvent = currentOnEvent;
        return cleanup;
      }),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
    });
    const { result, unmount } = renderHook(() => useChat(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.conversations).toHaveLength(1);
    });

    act(() => {
      onEvent?.({
        type: 'message-added',
        message: {
          id: 'm1',
          conversationId: 'c1',
          role: 'assistant',
          status: 'sent',
          parts: [{ type: 'text', text: 'Hi' }],
        } satisfies ChatMessage,
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

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.conversations[0]).toEqual({
      id: 'c1',
      title: 'General',
      unreadCount: 0,
      readState: 'read',
      participants: [{ id: 'u1', displayName: 'Alex', isOnline: true }],
    });

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
      defaultActiveConversationId: 'c1',
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
      defaultActiveConversationId: 'c1',
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
      defaultActiveConversationId: 'c1',
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
});
