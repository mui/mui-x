'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { ChatProvider, type ChatProviderProps } from '@mui/x-chat-headless';
import type { ChatLocaleText } from './internals/chatLocaleText';
import { ChatLocaleProvider } from './internals/ChatLocaleContext';

export interface ChatRootSlots {
  root: React.ElementType;
}

export interface ChatRootOwnerState {}

export interface ChatRootSlotProps {
  root?: SlotComponentProps<'div', {}, ChatRootOwnerState>;
}

export interface ChatRootProps<Cursor = string>
  extends
    ChatProviderProps<Cursor>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onError'> {
  localeText?: Partial<ChatLocaleText>;
  slots?: Partial<ChatRootSlots>;
  slotProps?: ChatRootSlotProps;
}

type ChatRootComponent = (<Cursor = string>(
  props: ChatRootProps<Cursor> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ChatRoot = React.forwardRef(function ChatRoot<Cursor = string>(
  props: ChatRootProps<Cursor>,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    children,
    slots,
    slotProps,
    adapter,
    localeText,
    members,
    currentUser,
    messages,
    initialMessages,
    onMessagesChange,
    conversations,
    initialConversations,
    onConversationsChange,
    activeConversationId,
    initialActiveConversationId,
    onActiveConversationChange,
    composerValue,
    initialComposerValue,
    onComposerValueChange,
    onToolCall,
    onFinish,
    onData,
    onError,
    streamFlushInterval,
    partRenderers,
    storeClass,
    ...other
  } = props;

  const Root = slots?.root ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState: {},
    additionalProps: {
      ref,
    },
  });

  return (
    <ChatProvider
      adapter={adapter}
      members={members}
      currentUser={currentUser}
      messages={messages}
      initialMessages={initialMessages}
      onMessagesChange={onMessagesChange}
      conversations={conversations}
      initialConversations={initialConversations}
      onConversationsChange={onConversationsChange}
      activeConversationId={activeConversationId}
      initialActiveConversationId={initialActiveConversationId}
      onActiveConversationChange={onActiveConversationChange}
      composerValue={composerValue}
      initialComposerValue={initialComposerValue}
      onComposerValueChange={onComposerValueChange}
      onToolCall={onToolCall}
      onFinish={onFinish}
      onData={onData}
      onError={onError}
      streamFlushInterval={streamFlushInterval}
      partRenderers={partRenderers}
      storeClass={storeClass}
    >
      <ChatLocaleProvider localeText={localeText}>
        <Root {...rootProps}>{children}</Root>
      </ChatLocaleProvider>
    </ChatProvider>
  );
}) as ChatRootComponent;
