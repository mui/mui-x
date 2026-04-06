import * as React from 'react';
import type { ChatAdapter, ChatListMessagesResult } from '../../adapters';
import type { ChatStore } from '../../store';
import type { ChatError } from '../../types/chat-error';
import { createRuntimeError, getErrorMessage } from './useChatControllerHelpers';

export interface ConversationActionsRuntimeRef<Cursor = string> {
  adapter: ChatAdapter<Cursor>;
}

export function createConversationActions<Cursor = string>(params: {
  store: ChatStore<Cursor>;
  runtimeRef: React.MutableRefObject<ConversationActionsRuntimeRef<Cursor>>;
  setRuntimeError: (error: ChatError | null) => void;
  stopStreaming: () => void;
  conversationNavigationRequestIdRef: React.MutableRefObject<number>;
  conversationLoadRequestIdRef: React.MutableRefObject<number>;
}) {
  const {
    store,
    runtimeRef,
    setRuntimeError,
    stopStreaming,
    conversationNavigationRequestIdRef,
    conversationLoadRequestIdRef,
  } = params;

  async function loadConversationMessages(
    conversationId: string | undefined,
    options: {
      resetWhenUndefined?: boolean;
    } = {},
  ): Promise<void> {
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
  }

  async function loadMoreHistory(): Promise<void> {
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

      if (store.state.activeConversationId !== conversationId) {
        return;
      }

      store.prependMessages(result.messages);
      store.setHistoryState({
        cursor: result.cursor,
        hasMore: result.hasMore ?? false,
      });
      store.setError(null);
    } catch (error) {
      if (store.state.activeConversationId !== conversationId) {
        return;
      }

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
  }

  async function setActiveConversation(id: string | undefined): Promise<void> {
    if (store.state.activeConversationId === id) {
      return;
    }

    stopStreaming();
    conversationNavigationRequestIdRef.current += 1;
    store.setActiveConversation(id);
    await loadConversationMessages(id);
  }

  return { loadConversationMessages, loadMoreHistory, setActiveConversation };
}
