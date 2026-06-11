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

/**
 * Runtime feature flags for the headless chat controller.
 *
 * These flags toggle optional runtime behaviors (not rendering). The Material
 * `ChatBoxFeatures` vocabulary structurally includes these so the flag is
 * declared once and forwarded from `ChatBox` down to the controller.
 */
export interface ChatFeatures {
  /**
   * Whether the runtime sends outbound typing signals through `adapter.setTyping()`
   * automatically as the user composes a message.
   *
   * When enabled and the adapter implements `setTyping()`, the runtime calls it
   * for the active conversation: `{ isTyping: true }` when the composer value
   * changes from empty (`''`) to non-empty, and `{ isTyping: false }` when it
   * changes back to empty — including when a message is sent (sending clears the
   * composer). Switching conversations clears typing on the previous one and
   * re-signals on the new one if a draft is present; mounting with an initial
   * draft signals `true`; unmounting signals a final `false`. Keystrokes that
   * keep the composer non-empty produce no additional calls, there is no
   * built-in idle timeout, and failures are swallowed with a dev-only warning.
   *
   * When disabled (the default), the runtime never calls `setTyping()`; wire it
   * up manually (e.g. on composer `onChange`) instead. If you enable this flag,
   * remove any manual wiring to avoid double-firing.
   * @default false
   */
  typingSignal?: boolean;
}

export interface ChatProviderProps<Cursor = string> extends Omit<
  ChatStoreParameters<Cursor>,
  'activeConversationIdControlled'
> {
  children?: React.ReactNode;
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
  /**
   * Runtime feature flags for the chat controller (e.g. outbound typing signals).
   */
  features?: ChatFeatures;
}

export function ChatProvider<Cursor = string>(props: ChatProviderProps<Cursor>) {
  const isActiveConversationIdControlled = Object.prototype.hasOwnProperty.call(
    props,
    'activeConversationId',
  );
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
    features,
    members,
    currentUser,
    roleDisplayNames,
    getMessageAuthorId,
    getMessageAuthorDisplayName,
    getMessageAuthorAvatarUrl,
    messages,
    initialMessages,
    conversations,
    initialConversations,
    activeConversationId,
    initialActiveConversationId,
    composerValue,
    initialComposerValue,
    onMessagesChange,
    onConversationsChange,
    onActiveConversationChange,
    onComposerValueChange,
  } = props;

  const parameters = React.useMemo(
    () => ({
      members,
      currentUser,
      roleDisplayNames,
      getMessageAuthorId,
      getMessageAuthorDisplayName,
      getMessageAuthorAvatarUrl,
      messages,
      initialMessages,
      conversations,
      initialConversations,
      activeConversationId,
      activeConversationIdControlled: isActiveConversationIdControlled,
      initialActiveConversationId,
      composerValue,
      initialComposerValue,
      onMessagesChange,
      onConversationsChange,
      onActiveConversationChange,
      onComposerValueChange,
    }),
    [
      members,
      currentUser,
      roleDisplayNames,
      getMessageAuthorId,
      getMessageAuthorDisplayName,
      getMessageAuthorAvatarUrl,
      messages,
      initialMessages,
      conversations,
      initialConversations,
      activeConversationId,
      isActiveConversationIdControlled,
      initialActiveConversationId,
      composerValue,
      initialComposerValue,
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
    features,
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
