'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useChat, useConversations, type ChatConversation } from '@mui/x-chat-headless';
import { markChatLayoutPane } from '../chat/internals/chatLayoutPaneKind';
import { ConversationContextProvider } from './internals/ConversationContext';
import { type ConversationRootOwnerState } from './conversation.types';

export interface ConversationRootSlots {
  root: React.ElementType;
}

export interface ConversationRootSlotProps {
  root?: SlotComponentProps<'div', {}, ConversationRootOwnerState>;
}

export interface ConversationRootProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  children?: React.ReactNode;
  slots?: Partial<ConversationRootSlots>;
  slotProps?: ConversationRootSlotProps;
}

type ConversationRootComponent = ((
  props: ConversationRootProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

function getActiveConversation(
  conversations: ChatConversation[],
  activeConversationId: string | undefined,
) {
  if (activeConversationId == null) {
    return null;
  }

  return conversations.find((conversation) => conversation.id === activeConversationId) ?? null;
}

export const ConversationRoot = markChatLayoutPane(
  React.forwardRef(function ConversationRoot(
    props: ConversationRootProps,
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { children, slots, slotProps, ...other } = props;
    const { activeConversationId } = useChat();
    const conversations = useConversations();
    const conversation = React.useMemo(
      () => getActiveConversation(conversations, activeConversationId),
      [activeConversationId, conversations],
    );
    const ownerState: ConversationRootOwnerState = React.useMemo(
      () => ({
        conversationId: activeConversationId,
        hasConversation: conversation != null,
        conversation,
      }),
      [activeConversationId, conversation],
    );
    const Root = slots?.root ?? 'div';
    const rootProps = useSlotProps({
      elementType: Root,
      externalSlotProps: slotProps?.root,
      externalForwardedProps: other,
      ownerState,
      additionalProps: {
        ref,
      },
    });

    return (
      <ConversationContextProvider value={ownerState}>
        <Root {...rootProps}>{children}</Root>
      </ConversationContextProvider>
    );
  }) as ConversationRootComponent,
  'thread',
);
