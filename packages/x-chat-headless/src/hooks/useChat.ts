'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { useChatRuntimeContext } from '../internals/useChatRuntimeContext';
import { chatSelectors } from '../selectors';
import type { ChatAddToolApproveResponseInput } from '../types';
import type { ChatConversation, ChatMessage } from '../types/chat-entities';
import type { ChatError } from '../types/chat-error';
import type { ChatInternalState } from '../types/chat-state';
import { useChatStore } from './useChatStore';
import type { UseChatSendMessageInput } from '../types/chat-callbacks';

export type { UseChatSendMessageInput } from '../types/chat-callbacks';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface UseChatValue<Cursor = string> {
  messages: ChatMessage[];
  conversations: ChatConversation[];
  activeConversationId: string | undefined;
  isStreaming: boolean;
  hasMoreHistory: boolean;
  /** Unified error from any operation (send, load history, realtime). */
  error: ChatError | null;
  sendMessage(input: UseChatSendMessageInput): Promise<void>;
  stopStreaming(): void;
  loadMoreHistory(): Promise<void>;
  setActiveConversation(id: string | undefined): Promise<void>;
  retry(messageId: string): Promise<void>;
  setError(error: ChatError | null): void;
  addToolApprovalResponse(input: ChatAddToolApproveResponseInput): Promise<void>;
  /** Reload the list of conversations. */
  reloadConversations(): Promise<void>;
  /** Reload messages, optionally for a specific conversation. */
  reloadMessages(conversationId?: string): Promise<void>;
  /** Reconnect the realtime connection. */
  reconnectRealtime(): Promise<void>;
}

const noopAsync = async () => {};

const noopAsyncWithArg = async (_arg?: string) => {};

export function useChat<Cursor = string>(): UseChatValue<Cursor> {
  const store = useChatStore<Cursor>();
  const { actions } = useChatRuntimeContext<Cursor>();
  const selectMessages = chatSelectors.messages as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.messages>;
  const selectConversations = chatSelectors.conversations as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.conversations>;
  const selectActiveConversationId = chatSelectors.activeConversationId as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.activeConversationId>;
  const selectIsStreaming = chatSelectors.isStreaming as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.isStreaming>;
  const selectHasMoreHistory = chatSelectors.hasMoreHistory as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.hasMoreHistory>;
  const selectError = chatSelectors.error as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.error>;
  const messages = useStore(store, selectMessages);
  const conversations = useStore(store, selectConversations);
  const activeConversationId = useStore(store, selectActiveConversationId);
  const isStreaming = useStore(store, selectIsStreaming);
  const hasMoreHistory = useStore(store, selectHasMoreHistory);
  const error = useStore(store, selectError);

  return React.useMemo(
    () => ({
      messages,
      conversations,
      activeConversationId,
      isStreaming,
      hasMoreHistory,
      error,
      sendMessage: actions.sendMessage,
      stopStreaming: actions.stopStreaming,
      loadMoreHistory: actions.loadMoreHistory,
      setActiveConversation: actions.setActiveConversation,
      retry: actions.retry,
      setError: actions.setError,
      addToolApprovalResponse: actions.addToolApprovalResponse,
      reloadConversations: process.env.NODE_ENV !== 'production'
        ? async () => {
            throw new Error(
              'MUI X Chat: reloadConversations is not yet implemented.\n' +
              'This method is a planned API stub. Remove the call until it is implemented.',
            );
          }
        : noopAsync,
      reloadMessages: process.env.NODE_ENV !== 'production'
        ? async (_arg?: string) => {
            throw new Error(
              'MUI X Chat: reloadMessages is not yet implemented.\n' +
              'This method is a planned API stub. Remove the call until it is implemented.',
            );
          }
        : noopAsyncWithArg,
      reconnectRealtime: process.env.NODE_ENV !== 'production'
        ? async () => {
            throw new Error(
              'MUI X Chat: reconnectRealtime is not yet implemented.\n' +
              'This method is a planned API stub. Remove the call until it is implemented.',
            );
          }
        : noopAsync,
    }),
    [
      actions.addToolApprovalResponse,
      actions.loadMoreHistory,
      actions.retry,
      actions.sendMessage,
      actions.setActiveConversation,
      actions.setError,
      actions.stopStreaming,
      activeConversationId,
      conversations,
      error,
      hasMoreHistory,
      isStreaming,
      messages,
    ],
  );
}
