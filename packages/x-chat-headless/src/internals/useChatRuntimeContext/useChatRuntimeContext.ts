'use client';
import * as React from 'react';
import type { ChatAdapter } from '../../adapters';
import type { ChatPartRendererMap } from '../../renderers';
import type { ChatOnData, ChatOnError, ChatOnFinish, ChatOnToolCall } from '../../types';
import type { ChatRuntimeActions, UseChatSendMessageInput } from '../useChatController';

export interface ChatRuntimeContextValue<Cursor = string> {
  adapter: ChatAdapter<Cursor>;
  onToolCall?: ChatOnToolCall;
  onFinish?: ChatOnFinish;
  onData?: ChatOnData;
  onError?: ChatOnError;
  partRenderers: ChatPartRendererMap;
  actions: ChatRuntimeActions<Cursor>;
  /** Like `actions.sendMessage`, but returns `null` when a send is already in progress. */
  sendMessageIfIdle(input: UseChatSendMessageInput): Promise<void> | null;
}

export const ChatRuntimeContext = React.createContext<ChatRuntimeContextValue<any> | null>(null);

export function useChatRuntimeContext<Cursor = string>(
  optional: true,
): ChatRuntimeContextValue<Cursor> | null;
export function useChatRuntimeContext<Cursor = string>(
  optional?: false,
): ChatRuntimeContextValue<Cursor>;
export function useChatRuntimeContext<Cursor = string>(optional = false) {
  const context = React.useContext(ChatRuntimeContext);

  if (context == null && !optional) {
    throw new Error(
      'MUI X Chat: useChatRuntimeContext must be used within a <ChatProvider> component',
    );
  }

  return context as ChatRuntimeContextValue<Cursor> | null;
}
