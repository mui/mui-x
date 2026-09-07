'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import type { ChatError } from '../types/chat-error';
import { chatSelectors } from '../selectors';
import { useChatStore } from './useChatStore';

export interface UseChatStatusValue {
  isStreaming: boolean;
  hasMoreHistory: boolean;
  /** Whether a history fetch (initial page or older messages) is currently in flight for the active conversation. */
  isLoadingHistory: boolean;
  error: ChatError | null;
  /** IDs of users currently typing in the active conversation. */
  typingUserIds: string[];
}

export function useChatStatus(): UseChatStatusValue {
  const store = useChatStore();
  const isStreaming = useStore(store, chatSelectors.isStreaming);
  const hasMoreHistory = useStore(store, chatSelectors.hasMoreHistory);
  const isLoadingHistory = useStore(store, chatSelectors.isLoadingHistory);
  const error = useStore(store, chatSelectors.error);
  const typingUserIds = useStore(store, chatSelectors.typingUserIdsForActiveConversation);

  return React.useMemo(
    () => ({
      isStreaming,
      hasMoreHistory,
      isLoadingHistory,
      error,
      typingUserIds,
    }),
    [error, hasMoreHistory, isLoadingHistory, isStreaming, typingUserIds],
  );
}
