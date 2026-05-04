'use client';
import * as React from 'react';
import { useStoreEffect } from '@mui/x-internals/store';
import type { ChatAdapter } from '../../adapters';
import { asCursorAgnosticChatStore, type ChatStore } from '../../store';
import type {
  ChatAddToolApproveResponseInput,
  ChatMessage,
  ChatOnData,
  ChatOnFinish,
  ChatOnToolCall,
} from '../../types';
import type { ChatError } from '../../types/chat-error';
import type { UseChatSendMessageInput } from '../../types/chat-callbacks';
import {
  getMessages,
  createRuntimeError,
  getErrorMessage,
  getMessageIdFromError,
} from './useChatControllerHelpers';
import { createRealtimeActions } from './realtimeActions';
import { createConversationActions } from './conversationActions';
import { createSendMessageActions } from './sendMessageActions';

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
  const storeUnknown = asCursorAgnosticChatStore(store);

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

      const messageId = getMessageIdFromError(error);
      if (messageId) {
        store.setMessageError(messageId, error);
      }

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

  const { loadConversationMessages, loadMoreHistory, setActiveConversation } = React.useMemo(
    () =>
      createConversationActions({
        store,
        runtimeRef,
        setRuntimeError,
        stopStreaming,
        conversationNavigationRequestIdRef,
        conversationLoadRequestIdRef,
      }),

    [setRuntimeError, stopStreaming, store],
  );

  const { sendMessage, retry } = React.useMemo(
    () =>
      createSendMessageActions({
        store,
        storeUnknown,
        runtimeRef,
        setRuntimeError,
        assistantMessageIdByUserMessageIdRef,
      }),

    [setRuntimeError, store, storeUnknown],
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

      // Snapshot the previous parts so we can roll back if the adapter call
      // rejects (#6). Without this, the optimistic mutation that flipped the
      // tool invocation to `approval-responded` would persist even though the
      // adapter never confirmed the response, leaving the UI permanently out
      // of sync with the server.
      const previousParts = assistantMessage?.parts;

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
        if (assistantMessage && previousParts) {
          store.updateMessage(assistantMessage.id, { parts: previousParts });
        }

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
    [setRuntimeError, store, storeUnknown],
  );

  const { handleRealtimeEvent } = React.useMemo(
    () =>
      createRealtimeActions({
        store: storeUnknown,
        conversationNavigationRequestIdRef,
      }),
    [storeUnknown, conversationNavigationRequestIdRef],
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
