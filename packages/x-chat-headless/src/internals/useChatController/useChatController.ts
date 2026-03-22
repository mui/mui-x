'use client';
import * as React from 'react';
import { useStoreEffect } from '@mui/x-internals/store';
import type { ChatAdapter, ChatListMessagesResult } from '../../adapters';
import { processStream } from '../../stream';
import type { ChatStore } from '../../store';
import type {
  ChatAddToolApproveResponseInput,
  ChatMessage,
  ChatOnData,
  ChatOnFinish,
  ChatOnToolCall,
} from '../../types';
import type { ChatDraftAttachment } from '../../types/chat-entities';
import type { ChatError, ChatErrorCode } from '../../types/chat-error';
import type { ChatRealtimeEvent } from '../../types/chat-realtime';
import type { UseChatSendMessageInput } from '../../types/chat-callbacks';
import { createLocalId } from '../createLocalId';

export type { UseChatSendMessageInput };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ChatRuntimeActions<Cursor = string> {
  sendMessage(input: UseChatSendMessageInput): Promise<void>;
  stopStreaming(): void;
  loadMoreHistory(): Promise<void>;
  setActiveConversation(id: string | undefined): Promise<void>;
  retry(messageId: string): Promise<void>;
  setError(error: ChatError | null): void;
  addToolApprovalResponse(input: ChatAddToolApproveResponseInput): Promise<void>;
}

interface UseChatControllerParameters<Cursor = string> {
  store: ChatStore<Cursor>;
  adapter: ChatAdapter<Cursor>;
  onToolCall?: ChatOnToolCall;
  onFinish?: ChatOnFinish;
  onData?: ChatOnData;
  onError?: (error: ChatError) => void;
  streamFlushInterval?: number;
}

function getMessages(store: ChatStore<unknown>): ChatMessage[] {
  return store.state.messageIds
    .map((id) => store.state.messagesById[id])
    .filter((message): message is ChatMessage => message != null);
}

function createRuntimeError(
  code: ChatErrorCode,
  message: string,
  source: ChatError['source'],
  recoverable: boolean,
  retryable = false,
  details?: Record<string, unknown>,
): ChatError {
  return {
    code,
    message,
    source,
    recoverable,
    retryable,
    details,
  };
}

function getErrorMessage(fallbackMessage: string, error: unknown): string {
  return error instanceof Error && error.message ? error.message : fallbackMessage;
}

function findAssistantMessageIdsForRetry(
  store: ChatStore<unknown>,
  userMessageId: string,
  assistantMessageIdByUserMessageId: Map<string, string>,
): string[] {
  const mappedAssistantMessageId = assistantMessageIdByUserMessageId.get(userMessageId);

  if (mappedAssistantMessageId) {
    return [mappedAssistantMessageId];
  }

  const userMessageIndex = store.state.messageIds.indexOf(userMessageId);

  if (userMessageIndex === -1) {
    return [];
  }

  const assistantMessageIds: string[] = [];

  for (let index = userMessageIndex + 1; index < store.state.messageIds.length; index += 1) {
    const nextMessageId = store.state.messageIds[index];
    const nextMessage = store.state.messagesById[nextMessageId];

    if (!nextMessage) {
      continue;
    }

    if (nextMessage.role === 'user') {
      break;
    }

    if (nextMessage.role === 'assistant') {
      assistantMessageIds.push(nextMessage.id);
    }
  }

  return assistantMessageIds;
}

function removeAssistantMessageIds(
  store: ChatStore<unknown>,
  assistantMessageIds: string[],
  assistantMessageIdByUserMessageId: Map<string, string>,
) {
  if (assistantMessageIds.length === 0) {
    return;
  }

  const removedIds = new Set(assistantMessageIds);

  for (const assistantMessageId of assistantMessageIds) {
    store.removeMessage(assistantMessageId);
  }

  for (const [userMessageId, assistantMessageId] of assistantMessageIdByUserMessageId.entries()) {
    if (removedIds.has(assistantMessageId)) {
      assistantMessageIdByUserMessageId.delete(userMessageId);
    }
  }
}

function applyPresenceUpdate(
  store: ChatStore<unknown>,
  event: Extract<ChatRealtimeEvent, { type: 'presence' }>,
) {
  for (const conversationId of store.state.conversationIds) {
    const conversation = store.state.conversationsById[conversationId];

    if (!conversation?.participants?.length) {
      continue;
    }

    let didChange = false;
    const participants = conversation.participants.map((participant) => {
      if (participant.id !== event.userId || participant.isOnline === event.isOnline) {
        return participant;
      }
      didChange = true;
      return { ...participant, isOnline: event.isOnline };
    });

    if (didChange) {
      store.updateConversation(conversationId, { participants });
    }
  }
}

function applyReadUpdate(
  store: ChatStore<unknown>,
  event: Extract<ChatRealtimeEvent, { type: 'read' }>,
) {
  const conversation = store.state.conversationsById[event.conversationId];

  if (!conversation) {
    return;
  }

  store.updateConversation(event.conversationId, {
    readState: 'read',
    unreadCount: 0,
  });
}

export function useChatController<Cursor = string>({
  store,
  adapter,
  onToolCall,
  onFinish,
  onData,
  onError,
  streamFlushInterval,
}: UseChatControllerParameters<Cursor>): ChatRuntimeActions<Cursor> {
  const runtimeRef = React.useRef({
    adapter,
    onToolCall,
    onFinish,
    onData,
    onError,
    streamFlushInterval,
  });
  const assistantMessageIdByUserMessageIdRef = React.useRef(new Map<string, string>());
  const conversationNavigationRequestIdRef = React.useRef(0);
  const conversationLoadRequestIdRef = React.useRef(0);
  // Cursor type is irrelevant for the cursor-agnostic helper functions below.
  const storeUnknown = store as unknown as ChatStore<unknown>;

  runtimeRef.current = {
    adapter,
    onToolCall,
    onFinish,
    onData,
    onError,
    streamFlushInterval,
  };

  const setRuntimeError = React.useCallback(
    (error: ChatError | null) => {
      store.setError(error);

      if (error) {
        runtimeRef.current.onError?.(error);
      }
    },
    [store],
  );

  const stopStreaming = React.useCallback(() => {
    store.state.activeStreamAbortController?.abort();
    store.setActiveStreamAbortController(null);
    runtimeRef.current.adapter.stop?.();
  }, [store]);

  const loadConversationMessages = React.useCallback(
    async (
      conversationId: string | undefined,
      options: {
        resetWhenUndefined?: boolean;
      } = {},
    ) => {
      conversationLoadRequestIdRef.current += 1;
      const requestId = conversationLoadRequestIdRef.current;
      const { resetWhenUndefined = true } = options;

      if (conversationId == null) {
        if (resetWhenUndefined) {
          store.resetMessages();
        }
        return;
      }

      if (!runtimeRef.current.adapter.listMessages) {
        return;
      }

      store.resetMessages();

      try {
        const result = await runtimeRef.current.adapter.listMessages({
          conversationId,
          direction: 'backward',
        });

        if (
          requestId !== conversationLoadRequestIdRef.current ||
          store.state.activeConversationId !== conversationId
        ) {
          return;
        }

        store.setMessages(result.messages);
        store.setHistoryState({
          cursor: result.cursor,
          hasMore: result.hasMore ?? false,
        });
        store.setError(null);
      } catch (error) {
        if (
          requestId !== conversationLoadRequestIdRef.current ||
          store.state.activeConversationId !== conversationId
        ) {
          return;
        }

        setRuntimeError(
          createRuntimeError(
            'HISTORY_ERROR',
            getErrorMessage('Unable to load conversation history.', error),
            'history',
            true,
            true,
            {
              conversationId,
            },
          ),
        );
      }
    },
    [setRuntimeError, store],
  );

  const sendExistingMessage = React.useCallback(
    async (message: ChatMessage, attachments?: ChatDraftAttachment[]) => {
      if (store.state.isStreaming) {
        return;
      }

      const conversationId = message.conversationId ?? store.state.activeConversationId;
      const nextMessage: ChatMessage = {
        ...message,
        conversationId,
        role: 'user',
        status: 'sending',
      };

      store.addMessage(nextMessage);
      store.setStreaming(true);
      store.setError(null);

      const abortController = new AbortController();
      store.setActiveStreamAbortController(abortController);

      try {
        const stream = await runtimeRef.current.adapter.sendMessage({
          conversationId,
          message: nextMessage,
          messages: getMessages(storeUnknown),
          attachments,
          signal: abortController.signal,
        });

        const result = await processStream(store, stream, {
          conversationId,
          signal: abortController.signal,
          flushInterval: runtimeRef.current.streamFlushInterval,
          onToolCall: runtimeRef.current.onToolCall,
          onFinish: runtimeRef.current.onFinish,
          onData: runtimeRef.current.onData,
        });

        let status: 'cancelled' | 'error' | 'sent';
        if (result.status === 'cancelled') {
          status = 'cancelled';
        } else if (result.status === 'error') {
          status = 'error';
        } else {
          status = 'sent';
        }
        store.updateMessage(nextMessage.id, { status });

        if (result.messageId) {
          assistantMessageIdByUserMessageIdRef.current.set(nextMessage.id, result.messageId);
        }

        if (result.isError && store.state.error) {
          runtimeRef.current.onError?.(store.state.error);
        }
      } catch (error) {
        store.updateMessage(nextMessage.id, {
          status: abortController.signal.aborted ? 'cancelled' : 'error',
        });

        if (abortController.signal.aborted) {
          store.setStreaming(false);
          return;
        }

        if (store.state.error?.source === 'stream') {
          runtimeRef.current.onError?.(store.state.error);
          return;
        }

        setRuntimeError(
          createRuntimeError(
            'SEND_ERROR',
            getErrorMessage('Unable to send the message.', error),
            'send',
            true,
            true,
            {
              messageId: nextMessage.id,
              conversationId,
            },
          ),
        );
        store.setStreaming(false);
      } finally {
        if (store.state.activeStreamAbortController === abortController) {
          store.setActiveStreamAbortController(null);
        }
      }
    },
    [setRuntimeError, store],
  );

  const sendMessage = React.useCallback<ChatRuntimeActions<Cursor>['sendMessage']>(
    async (input) => {
      const message: ChatMessage = {
        id: input.id ?? createLocalId(),
        conversationId: input.conversationId ?? store.state.activeConversationId,
        role: 'user',
        parts: input.parts,
        metadata: input.metadata,
        author: input.author,
        createdAt: input.createdAt,
      };

      await sendExistingMessage(message, input.attachments);
    },
    [sendExistingMessage, store],
  );

  const retry = React.useCallback<ChatRuntimeActions<Cursor>['retry']>(
    async (messageId) => {
      const message = store.state.messagesById[messageId];

      if (!message || message.role !== 'user') {
        return;
      }

      const assistantMessageIds = findAssistantMessageIdsForRetry(
        storeUnknown,
        messageId,
        assistantMessageIdByUserMessageIdRef.current,
      );

      removeAssistantMessageIds(
        storeUnknown,
        assistantMessageIds,
        assistantMessageIdByUserMessageIdRef.current,
      );

      await sendExistingMessage(message);
    },
    [sendExistingMessage, store],
  );

  const loadMoreHistory = React.useCallback<
    ChatRuntimeActions<Cursor>['loadMoreHistory']
  >(async () => {
    const conversationId = store.state.activeConversationId;

    if (!conversationId) {
      return;
    }

    try {
      let result: ChatListMessagesResult<Cursor> | undefined;

      if (runtimeRef.current.adapter.listMessages) {
        result = await runtimeRef.current.adapter.listMessages({
          conversationId,
          cursor: store.state.historyCursor,
          direction: 'backward',
        });
      } else if (runtimeRef.current.adapter.loadMore) {
        result = await runtimeRef.current.adapter.loadMore(store.state.historyCursor);
      }

      if (!result) {
        return;
      }

      store.prependMessages(result.messages);
      store.setHistoryState({
        cursor: result.cursor,
        hasMore: result.hasMore ?? false,
      });
      store.setError(null);
    } catch (error) {
      setRuntimeError(
        createRuntimeError(
          'HISTORY_ERROR',
          getErrorMessage('Unable to load more message history.', error),
          'history',
          true,
          true,
          {
            conversationId,
            cursor: store.state.historyCursor as Cursor | undefined,
          },
        ),
      );
    }
  }, [setRuntimeError, store]);

  const setActiveConversation = React.useCallback<
    ChatRuntimeActions<Cursor>['setActiveConversation']
  >(
    async (id) => {
      if (store.state.activeConversationId === id) {
        return;
      }

      stopStreaming();
      conversationNavigationRequestIdRef.current += 1;
      store.setActiveConversation(id);
      await loadConversationMessages(id);
    },
    [loadConversationMessages, stopStreaming, store],
  );

  const setError = React.useCallback<ChatRuntimeActions<Cursor>['setError']>(
    (error) => {
      if (error == null) {
        store.setError(null);
        return;
      }

      setRuntimeError(error);
    },
    [setRuntimeError, store],
  );

  const addToolApprovalResponse = React.useCallback<
    ChatRuntimeActions<Cursor>['addToolApprovalResponse']
  >(
    async ({ id, approved, reason }) => {
      const assistantMessage = getMessages(storeUnknown).find(
        (message) =>
          message.role === 'assistant' &&
          message.parts.some(
            (part) =>
              (part.type === 'tool' || part.type === 'dynamic-tool') &&
              part.toolInvocation.toolCallId === id,
          ),
      );

      if (assistantMessage) {
        store.updateMessage(assistantMessage.id, {
          parts: assistantMessage.parts.map((part) => {
            if (
              (part.type !== 'tool' && part.type !== 'dynamic-tool') ||
              part.toolInvocation.toolCallId !== id
            ) {
              return part;
            }

            return {
              ...part,
              toolInvocation: {
                ...part.toolInvocation,
                state: 'approval-responded',
                approval: {
                  approved,
                  reason,
                },
              },
            } as typeof part;
          }) as ChatMessage['parts'],
        });
      }

      try {
        await runtimeRef.current.adapter.addToolApprovalResponse?.({
          id,
          approved,
          reason,
        });
      } catch (error) {
        setRuntimeError(
          createRuntimeError(
            'SEND_ERROR',
            getErrorMessage('Unable to send the tool approval response.', error),
            'adapter',
            true,
            true,
            { id },
          ),
        );
      }
    },
    [setRuntimeError, store],
  );

  const handleRealtimeEvent = React.useCallback(
    (event: ChatRealtimeEvent) => {
      switch (event.type) {
        case 'message-added':
          store.addMessage(event.message);
          return;
        case 'message-updated':
          if (store.state.messagesById[event.message.id]) {
            store.updateMessage(event.message.id, event.message);
          } else {
            store.addMessage(event.message);
          }
          return;
        case 'message-removed':
          store.removeMessage(event.messageId);
          return;
        case 'conversation-added':
          store.addConversation(event.conversation);
          return;
        case 'conversation-updated':
          if (store.state.conversationsById[event.conversation.id]) {
            store.updateConversation(event.conversation.id, event.conversation);
          } else {
            store.addConversation(event.conversation);
          }
          return;
        case 'conversation-removed':
          store.removeConversation(event.conversationId);

          if (store.state.activeConversationId === event.conversationId) {
            conversationNavigationRequestIdRef.current += 1;
            store.setActiveConversation(undefined);
            store.resetMessages();
          }
          return;
        case 'presence':
          applyPresenceUpdate(storeUnknown, event);
          return;
        case 'read':
          applyReadUpdate(storeUnknown, event);
          return;
        case 'typing':
          store.setTypingUser(event.conversationId, event.userId, event.isTyping);
          return;
        default:
      }
    },
    [store],
  );

  React.useEffect(() => {
    let isDisposed = false;

    if (!adapter.listConversations) {
      return undefined;
    }

    void adapter
      .listConversations()
      .then((result) => {
        if (isDisposed) {
          return;
        }

        store.setConversations(result.conversations);
      })
      .catch((error) => {
        if (isDisposed) {
          return;
        }

        setRuntimeError(
          createRuntimeError(
            'HISTORY_ERROR',
            getErrorMessage('Unable to load conversations.', error),
            'adapter',
            true,
            true,
          ),
        );
      });

    return () => {
      isDisposed = true;
    };
  }, [adapter, setRuntimeError, store]);

  React.useEffect(() => {
    let isDisposed = false;
    let cleanup: (() => void) | undefined;

    if (!adapter.subscribe) {
      return undefined;
    }

    void Promise.resolve(adapter.subscribe({ onEvent: handleRealtimeEvent }))
      .then((resolvedCleanup) => {
        if (isDisposed) {
          resolvedCleanup?.();
          return;
        }

        cleanup = resolvedCleanup ?? undefined;
      })
      .catch((error) => {
        if (isDisposed) {
          return;
        }

        setRuntimeError(
          createRuntimeError(
            'REALTIME_ERROR',
            getErrorMessage('Unable to subscribe to chat updates.', error),
            'adapter',
            true,
            true,
          ),
        );
      });

    return () => {
      isDisposed = true;
      cleanup?.();
    };
  }, [adapter, handleRealtimeEvent, setRuntimeError]);

  useStoreEffect(
    store,
    (state) => state.activeConversationId,
    (_, nextActiveConversationId) => {
      const navId = conversationNavigationRequestIdRef.current;

      if (navId > 0) {
        conversationNavigationRequestIdRef.current = 0;
        return;
      }

      void loadConversationMessages(nextActiveConversationId);
    },
  );

  React.useEffect(() => {
    if (store.state.activeConversationId != null) {
      void loadConversationMessages(store.state.activeConversationId, {
        resetWhenUndefined: false,
      });
    }
  }, [loadConversationMessages, store]);

  React.useEffect(
    () => () => {
      store.state.activeStreamAbortController?.abort();
      store.setActiveStreamAbortController(null);
      runtimeRef.current.adapter.stop?.();
    },
    [store],
  );

  return React.useMemo(
    () => ({
      sendMessage,
      stopStreaming,
      loadMoreHistory,
      setActiveConversation,
      retry,
      setError,
      addToolApprovalResponse,
    }),
    [
      addToolApprovalResponse,
      loadMoreHistory,
      retry,
      sendMessage,
      setActiveConversation,
      setError,
      stopStreaming,
    ],
  );
}
