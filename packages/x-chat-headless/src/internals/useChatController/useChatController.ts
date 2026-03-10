'use client';
import * as React from 'react';
import { useStoreEffect } from '@mui/x-internals/store';
import type { ChatAdapter, ChatListMessagesResult } from '../../adapters';
import { processStream } from '../../stream';
import type { ChatStore } from '../../store';
import type {
  ChatAddToolApproveResponseInput,
  ChatMessage,
  ChatMessageMetadata,
  ChatDateTimeString,
  ChatUser,
  ChatOnData,
  ChatOnFinish,
  ChatOnToolCall,
} from '../../types';
import type { ChatConversation, ChatDraftAttachment } from '../../types/chat-entities';
import type { ChatError } from '../../types/chat-error';
import type { ChatMessagePart } from '../../types/chat-message-parts';
import type { ChatRealtimeEvent } from '../../types/chat-realtime';

export interface UseChatSendMessageInput {
  id?: string;
  conversationId?: string;
  parts: ChatMessagePart[];
  metadata?: ChatMessageMetadata;
  author?: ChatUser;
  createdAt?: ChatDateTimeString;
  attachments?: ChatDraftAttachment[];
}

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
}

function getMessages(store: ChatStore<any>): ChatMessage[] {
  return store.state.messageIds
    .map((id) => store.state.messagesById[id])
    .filter((message): message is ChatMessage => message != null);
}

function createRuntimeError(
  code: string,
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

function getErrorMessage(
  fallbackMessage: string,
  error: unknown,
): string {
  return error instanceof Error && error.message ? error.message : fallbackMessage;
}

function createMessageId() {
  return crypto.randomUUID();
}

function findAssistantMessageIdsForRetry(
  store: ChatStore<any>,
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
  store: ChatStore<any>,
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
  store: ChatStore<any>,
  event: Extract<ChatRealtimeEvent, { type: 'presence' }>,
) {
  const nextConversations = store.state.conversationIds.map((conversationId) => {
    const conversation = store.state.conversationsById[conversationId];

    if (!conversation?.participants?.length) {
      return conversation;
    }

    let didChange = false;
    const participants = conversation.participants.map((participant) => {
      if (participant.id !== event.userId || participant.isOnline === event.isOnline) {
        return participant;
      }

      didChange = true;
      return {
        ...participant,
        isOnline: event.isOnline,
      };
    });

    if (!didChange) {
      return conversation;
    }

    return {
      ...conversation,
      participants,
    };
  });

  const didChange = nextConversations.some(
    (conversation, index) => conversation !== store.state.conversationsById[store.state.conversationIds[index]],
  );

  if (didChange) {
    store.setConversations(nextConversations.filter(Boolean) as ChatConversation[]);
  }
}

function applyReadUpdate(
  store: ChatStore<any>,
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
}: UseChatControllerParameters<Cursor>): ChatRuntimeActions<Cursor> {
  const runtimeRef = React.useRef({
    adapter,
    onToolCall,
    onFinish,
    onData,
    onError,
  });
  const activeStreamAbortControllerRef = React.useRef<AbortController | null>(null);
  const assistantMessageIdByUserMessageIdRef = React.useRef(new Map<string, string>());
  const skipNextConversationEffectRef = React.useRef(false);
  const conversationLoadRequestIdRef = React.useRef(0);

  runtimeRef.current = {
    adapter,
    onToolCall,
    onFinish,
    onData,
    onError,
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
    activeStreamAbortControllerRef.current?.abort();
    activeStreamAbortControllerRef.current = null;
    runtimeRef.current.adapter.stop?.();
  }, []);

  const loadConversationMessages = React.useCallback(
    async (
      conversationId: string | undefined,
      options: {
        resetWhenUndefined?: boolean;
      } = {},
    ) => {
      const requestId = ++conversationLoadRequestIdRef.current;
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
      activeStreamAbortControllerRef.current = abortController;

      try {
        const stream = await runtimeRef.current.adapter.sendMessage({
          conversationId,
          message: nextMessage,
          messages: getMessages(store),
          attachments,
          signal: abortController.signal,
        });

        const result = await processStream(store, stream, {
          conversationId,
          signal: abortController.signal,
          onToolCall: runtimeRef.current.onToolCall,
          onFinish: runtimeRef.current.onFinish,
          onData: runtimeRef.current.onData,
        });

        store.updateMessage(nextMessage.id, {
          status:
            result.status === 'cancelled'
              ? 'cancelled'
              : result.status === 'error'
                ? 'error'
                : 'sent',
        });

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
        if (activeStreamAbortControllerRef.current === abortController) {
          activeStreamAbortControllerRef.current = null;
        }
      }
    },
    [setRuntimeError, store],
  );

  const sendMessage = React.useCallback<ChatRuntimeActions<Cursor>['sendMessage']>(
    async (input) => {
      const message: ChatMessage = {
        id: input.id ?? createMessageId(),
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
        store,
        messageId,
        assistantMessageIdByUserMessageIdRef.current,
      );

      removeAssistantMessageIds(store, assistantMessageIds, assistantMessageIdByUserMessageIdRef.current);

      await sendExistingMessage(message);
    },
    [sendExistingMessage, store],
  );

  const loadMoreHistory = React.useCallback<ChatRuntimeActions<Cursor>['loadMoreHistory']>(
    async () => {
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
    },
    [setRuntimeError, store],
  );

  const setActiveConversation = React.useCallback<ChatRuntimeActions<Cursor>['setActiveConversation']>(
    async (id) => {
      if (store.state.activeConversationId === id) {
        return;
      }

      stopStreaming();
      skipNextConversationEffectRef.current = true;
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

  const addToolApprovalResponse = React.useCallback<ChatRuntimeActions<Cursor>['addToolApprovalResponse']>(
    async ({ id, approved, reason }) => {
      const assistantMessage = getMessages(store).find(
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
            'ADAPTER_ERROR',
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
            skipNextConversationEffectRef.current = true;
            store.setActiveConversation(undefined);
            store.resetMessages();
          }
          return;
        case 'presence':
          applyPresenceUpdate(store, event);
          return;
        case 'read':
          applyReadUpdate(store, event);
          return;
        case 'typing':
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
            'ADAPTER_ERROR',
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
            'ADAPTER_ERROR',
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

  useStoreEffect(store, (state) => state.activeConversationId, (_, nextActiveConversationId) => {
    if (skipNextConversationEffectRef.current) {
      skipNextConversationEffectRef.current = false;
      return;
    }

    void loadConversationMessages(nextActiveConversationId);
  });

  React.useEffect(() => {
    if (store.state.activeConversationId != null) {
      void loadConversationMessages(store.state.activeConversationId, {
        resetWhenUndefined: false,
      });
    }
  }, [loadConversationMessages, store]);

  React.useEffect(
    () => () => {
      activeStreamAbortControllerRef.current?.abort();
      runtimeRef.current.adapter.stop?.();
    },
    [],
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
    [addToolApprovalResponse, loadMoreHistory, retry, sendMessage, setActiveConversation, setError, stopStreaming],
  );
}
