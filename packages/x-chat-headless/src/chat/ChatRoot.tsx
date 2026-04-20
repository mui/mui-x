'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { ChatProvider, type ChatProviderProps } from '../ChatProvider';
import type { ChatLocaleText } from './internals/chatLocaleText';
import { ChatLocaleProvider } from './internals/ChatLocaleContext';
import { ChatVariantProvider, type ChatVariant } from './internals/ChatVariantContext';
import { ChatDensityProvider, type ChatDensity } from './internals/ChatDensityContext';

export interface ChatRootSlots {
  root: React.ElementType;
}

export interface ChatRootOwnerState {}

export interface ChatRootSlotProps {
  root?: SlotComponentPropsFromProps<'div', {}, ChatRootOwnerState>;
}

export interface ChatRootProps<Cursor = string>
  extends
    ChatProviderProps<Cursor>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onError'> {
  localeText?: Partial<ChatLocaleText>;
  /**
   * The visual layout variant of the chat.
   * When provided, wraps descendant components with `ChatVariantProvider`
   * so message and conversation components can respond to the variant.
   * - `'default'` – Standard layout with avatars, individual timestamps, and full spacing.
   * - `'compact'` – Messenger-style layout: no avatars, author + timestamp in group header, tighter spacing.
   */
  variant?: ChatVariant;
  /**
   * The vertical spacing density of chat messages.
   * When provided, wraps descendant components with `ChatDensityProvider`.
   * - `'compact'` – Reduced vertical spacing between messages.
   * - `'standard'` – Default spacing.
   * - `'comfortable'` – Increased vertical spacing between messages.
   */
  density?: ChatDensity;
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
    variant,
    density,
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
        {(() => {
          let content = <Root {...rootProps}>{children}</Root>;
          if (variant) {
            content = <ChatVariantProvider variant={variant}>{content}</ChatVariantProvider>;
          }
          if (density) {
            content = <ChatDensityProvider density={density}>{content}</ChatDensityProvider>;
          }
          return content;
        })()}
      </ChatLocaleProvider>
    </ChatProvider>
  );
}) as ChatRootComponent;
