import type * as React from 'react';
import type { ChatAdapter, ChatListMessagesResult } from '../../adapters';
import type { ChatStore } from '../../store';
import type { ChatMessage } from '../../types/chat-entities';
import type { ChatError } from '../../types/chat-error';
import type { AdapterRealtimeMessageBuffer } from './realtimeMessageBuffer';
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
  historyLoadRequestIdRef: React.MutableRefObject<number>;
  realtimeMessageBufferRef: React.RefObject<AdapterRealtimeMessageBuffer | null>;
}) {
  const {
    store,
    runtimeRef,
    setRuntimeError,
    stopStreaming,
    conversationNavigationRequestIdRef,
    conversationLoadRequestIdRef,
    historyLoadRequestIdRef,
    realtimeMessageBufferRef,
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
    const shouldResetMessages = resetWhenUndefined && store.parameters.messages === undefined;

    if (conversationId == null) {
      if (shouldResetMessages) {
        store.resetMessages();
      }
      store.setHistoryStatus('idle');
      return;
    }

    // Only the subscription of the adapter that serves this load holds messages for it.
    const held =
      realtimeMessageBufferRef.current?.adapter === runtimeRef.current.adapter
        ? realtimeMessageBufferRef.current
        : null;
    // Not replayed (and kept for the next open) when this load is no longer the latest, e.g. a
    // change callback opened another conversation, or when another adapter was rendered meanwhile.
    const flushHeldMessages = (messages: ChatMessage[], hasMore: boolean) =>
      held &&
      realtimeMessageBufferRef.current === held &&
      held.adapter === runtimeRef.current.adapter &&
      requestId === conversationLoadRequestIdRef.current &&
      store.state.activeConversationId === conversationId
        ? held.buffer.flush(conversationId, messages, hasMore)
        : messages;
    if (!runtimeRef.current.adapter.listMessages) {
      if (shouldResetMessages) {
        store.resetMessages();
        // Held messages predate what the store holds now (e.g. a message sent from a change
        // callback). For duplicate ids `setMessages` keeps the first position and the last value.
        const heldMessages = flushHeldMessages([], false);
        if (heldMessages.length > 0) {
          store.setMessages([
            ...heldMessages,
            ...store.state.messageIds.map((id) => store.state.messagesById[id]),
          ]);
        }
      }
      store.setHistoryStatus('idle');
      return;
    }

    if (shouldResetMessages) {
      store.resetMessages();
    }

    historyLoadRequestIdRef.current += 1;
    const historyRequestId = historyLoadRequestIdRef.current;
    store.setHistoryLoading(true);
    store.setHistoryStatus('loading');

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

      const hasMore = result.hasMore ?? false;
      store.setMessages(flushHeldMessages(result.messages, hasMore));
      store.setHistoryState({ cursor: result.cursor, hasMore });
      store.setHistoryStatus('loaded');
      store.setError(null);
    } catch (error) {
      if (
        requestId !== conversationLoadRequestIdRef.current ||
        store.state.activeConversationId !== conversationId
      ) {
        return;
      }

      store.setHistoryStatus('error');
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
    } finally {
      if (historyRequestId === historyLoadRequestIdRef.current) {
        store.setHistoryLoading(false);
      }
    }
  }

  async function loadMoreHistory(): Promise<void> {
    const conversationId = store.state.activeConversationId;

    if (!conversationId) {
      return;
    }

    if (!runtimeRef.current.adapter.listMessages && !runtimeRef.current.adapter.loadMore) {
      return;
    }

    historyLoadRequestIdRef.current += 1;
    const historyRequestId = historyLoadRequestIdRef.current;
    store.setHistoryLoading(true);

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
    } finally {
      if (historyRequestId === historyLoadRequestIdRef.current) {
        store.setHistoryLoading(false);
      }
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
