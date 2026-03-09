'use client';
import * as React from 'react';
import type { ChatAdapter } from './adapters';
import { useChatInstance } from './internals/useChatInstance';
import {
  ChatRuntimeContext,
  type ChatRuntimeContextValue,
} from './internals/useChatRuntimeContext';
import type { ChatPartRendererMap } from './renderers';
import { type ChatStoreConstructor, type ChatStoreParameters } from './store';
import type { ChatOnData, ChatOnFinish, ChatOnToolCall } from './types';
import type { ChatError } from './types/chat-error';
import { ChatStoreContext } from './use-chat-store-context';

export interface ChatProviderProps<Cursor = string> extends ChatStoreParameters<Cursor> {
  children: React.ReactNode;
  adapter: ChatAdapter<Cursor>;
  onToolCall?: ChatOnToolCall;
  onFinish?: ChatOnFinish;
  onData?: ChatOnData;
  onError?: (error: ChatError) => void;
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
    partRenderers,
    storeClass,
    ...parameters
  } = props;
  const store = useChatInstance(parameters, storeClass);

  const runtimeContextValue = React.useMemo<ChatRuntimeContextValue<Cursor>>(
    () => ({
      adapter,
      onToolCall,
      onFinish,
      onData,
      onError,
      partRenderers,
    }),
    [adapter, onToolCall, onFinish, onData, onError, partRenderers],
  );

  return (
    <ChatStoreContext.Provider value={store}>
      <ChatRuntimeContext.Provider value={runtimeContextValue}>
        {children}
      </ChatRuntimeContext.Provider>
    </ChatStoreContext.Provider>
  );
}
