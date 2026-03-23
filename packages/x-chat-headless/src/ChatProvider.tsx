'use client';
import * as React from 'react';
import type { ChatAdapter } from './adapters';
import { useChatController } from './internals/useChatController';
import { useChatInstance } from './internals/useChatInstance';
import {
  ChatRuntimeContext,
  type ChatRuntimeContextValue,
} from './internals/useChatRuntimeContext';
import type { ChatPartRendererMap } from './renderers';
import { defaultPartRenderers } from './renderers/defaultPartRenderers';
import { type ChatStoreConstructor, type ChatStoreParameters } from './store';
import type { ChatOnData, ChatOnFinish, ChatOnToolCall } from './types';
import type { ChatError } from './types/chat-error';
import { ChatStoreContext } from './internals/useChatStoreContext';

export interface ChatProviderProps<Cursor = string> extends ChatStoreParameters<Cursor> {
  children: React.ReactNode;
  adapter: ChatAdapter<Cursor>;
  onToolCall?: ChatOnToolCall;
  onFinish?: ChatOnFinish;
  onData?: ChatOnData;
  onError?: (error: ChatError) => void;
  /**
   * Flush interval in milliseconds for batching rapid streaming deltas before applying them to the store.
   * @default 16
   */
  streamFlushInterval?: number;
  partRenderers?: ChatPartRendererMap;
  /**
   * The store class to use for this provider.
   * @default ChatStore
   */
  storeClass?: ChatStoreConstructor<Cursor>;
}

export function ChatProvider<Cursor = string>(props: ChatProviderProps<Cursor>) {
  const {
    children,
    adapter,
    onToolCall,
    onFinish,
    onData,
    onError,
    streamFlushInterval,
    partRenderers,
    storeClass,
    members,
    currentUser,
    messages,
    defaultMessages,
    conversations,
    defaultConversations,
    activeConversationId,
    defaultActiveConversationId,
    composerValue,
    defaultComposerValue,
    onMessagesChange,
    onConversationsChange,
    onActiveConversationChange,
    onComposerValueChange,
  } = props;

  const parameters = React.useMemo(
    () => ({
      members,
      currentUser,
      messages,
      defaultMessages,
      conversations,
      defaultConversations,
      activeConversationId,
      defaultActiveConversationId,
      composerValue,
      defaultComposerValue,
      onMessagesChange,
      onConversationsChange,
      onActiveConversationChange,
      onComposerValueChange,
    }),
    [
      members,
      currentUser,
      messages,
      defaultMessages,
      conversations,
      defaultConversations,
      activeConversationId,
      defaultActiveConversationId,
      composerValue,
      defaultComposerValue,
      onMessagesChange,
      onConversationsChange,
      onActiveConversationChange,
      onComposerValueChange,
    ],
  );
  const store = useChatInstance(parameters, storeClass);
  const actions = useChatController({
    store,
    adapter,
    onToolCall,
    onFinish,
    onData,
    onError,
    streamFlushInterval,
  });
  const mergedPartRenderers = React.useMemo<ChatPartRendererMap>(
    () => ({
      ...defaultPartRenderers,
      ...partRenderers,
    }),
    [partRenderers],
  );

  const runtimeContextValue = React.useMemo<ChatRuntimeContextValue<Cursor>>(
    () => ({
      adapter,
      onToolCall,
      onFinish,
      onData,
      onError,
      partRenderers: mergedPartRenderers,
      actions,
    }),
    [actions, adapter, mergedPartRenderers, onToolCall, onFinish, onData, onError],
  );

  return (
    <ChatStoreContext.Provider value={store}>
      <ChatRuntimeContext.Provider value={runtimeContextValue}>
        {children}
      </ChatRuntimeContext.Provider>
    </ChatStoreContext.Provider>
  );
}
