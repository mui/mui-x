'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import type { ChatError } from '../types/chat-error';
import { chatSelectors } from '../selectors';
import { useChatStore } from './useChatStore';

export interface UseChatStatusValue {
  isStreaming: boolean;
  hasMoreHistory: boolean;
  error: ChatError | null;
}

export function useChatStatus(): UseChatStatusValue {
  const store = useChatStore();
  const isStreaming = useStore(store, chatSelectors.isStreaming);
  const hasMoreHistory = useStore(store, chatSelectors.hasMoreHistory);
  const error = useStore(store, chatSelectors.error);

  return React.useMemo(
    () => ({
      isStreaming,
      hasMoreHistory,
      error,
    }),
    [error, hasMoreHistory, isStreaming],
  );
}
