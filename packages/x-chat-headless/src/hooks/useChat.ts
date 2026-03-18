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
import type { UseChatSendMessageInput } from '../internals/useChatController';

export type { UseChatSendMessageInput } from '../internals/useChatController';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface UseChatValue<Cursor = string> {
  messages: ChatMessage[];
  conversations: ChatConversation[];
  activeConversationId: string | undefined;
  isStreaming: boolean;
  hasMoreHistory: boolean;
  error: ChatError | null;
  /** Error that occurred while loading conversations. */
  conversationError: ChatError | null;
  /** Error that occurred while loading messages. */
  messageError: ChatError | null;
  /** Error that occurred with the realtime connection. */
  realtimeError: ChatError | null;
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
      conversationError: null,
      messageError: null,
      realtimeError: null,
      sendMessage: actions.sendMessage,
      stopStreaming: actions.stopStreaming,
      loadMoreHistory: actions.loadMoreHistory,
      setActiveConversation: actions.setActiveConversation,
      retry: actions.retry,
      setError: actions.setError,
      addToolApprovalResponse: actions.addToolApprovalResponse,
      reloadConversations: noopAsync,
      reloadMessages: noopAsyncWithArg,
      reconnectRealtime: noopAsync,
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
