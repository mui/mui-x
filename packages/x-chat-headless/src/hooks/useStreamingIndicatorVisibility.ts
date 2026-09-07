'use client';
import * as React from 'react';
import { createSelectorMemoized, useStore } from '@mui/x-internals/store';
import { chatSelectors } from '../selectors';
import { useChatStore } from './useChatStore';
import type { ChatInternalState } from '../types/chat-state';

/**
 * Controls when the streaming indicator renders.
 * - `'auto'` – shown only in assistant-backed conversations (auto-detected).
 * - `true` – always shown while a response is in flight.
 * - `false` – never shown.
 */
export type StreamingIndicatorMode = boolean | 'auto';

export interface UseStreamingIndicatorVisibilityValue {
  /**
   * Whether the waiting-phase indicator should be visible: a response is in
   * flight for the active conversation, but no assistant message is streaming
   * yet (once one is, the in-message indicator takes over).
   */
  waiting: boolean;
}

// Narrow, boolean-valued selectors: streamed chunks replace the streaming
// message object on every flush, so subscribing to the `messages` array would
// re-render the indicator per chunk. These recompute per chunk but return
// stable booleans, so the subscription only re-renders when a value flips.
const selectHasAssistantMessage = createSelectorMemoized(
  (state: ChatInternalState<unknown>) => state.messageIds,
  (state: ChatInternalState<unknown>) => state.messagesById,
  (messageIds, messagesById): boolean =>
    messageIds.some((id) => messagesById[id]?.role === 'assistant'),
);

const selectLastMessageIsStreamingAssistant = createSelectorMemoized(
  (state: ChatInternalState<unknown>) => state.messageIds,
  (state: ChatInternalState<unknown>) => state.messagesById,
  (messageIds, messagesById): boolean => {
    const lastMessage = messagesById[messageIds[messageIds.length - 1] ?? ''];
    return lastMessage?.role === 'assistant' && lastMessage.status === 'streaming';
  },
);

/**
 * Visibility gating shared by the built-in streaming indicator and custom
 * `streamingIndicator` slot components.
 */
export function useStreamingIndicatorVisibility(
  mode: StreamingIndicatorMode = 'auto',
): UseStreamingIndicatorVisibilityValue {
  const store = useChatStore();
  const isStreaming = useStore(store, chatSelectors.isStreaming);
  const streamingConversationId = useStore(store, chatSelectors.streamingConversationId);
  const activeConversationId = useStore(store, chatSelectors.activeConversationId);
  const hasAssistantMessage = useStore(store, selectHasAssistantMessage);
  const hasStreamingAssistantMessage = useStore(store, selectLastMessageIsStreamingAssistant);

  // `store.assistantUser` resolves an assistant member from members → active
  // conversation participants → message authors. The `hasAssistantMessage`
  // subscription covers author-less assistant messages.
  const isAgentLike = store.assistantUser != null || hasAssistantMessage;

  const waiting =
    mode !== false &&
    isStreaming &&
    (streamingConversationId == null || streamingConversationId === activeConversationId) &&
    !hasStreamingAssistantMessage &&
    (mode === true || isAgentLike);

  return React.useMemo(() => ({ waiting }), [waiting]);
}
