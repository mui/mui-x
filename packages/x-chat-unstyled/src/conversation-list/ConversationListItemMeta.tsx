'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import type { ChatConversation } from '@mui/x-chat-headless';
import { type ConversationListItemMetaOwnerState } from './conversationList.types';

export interface ConversationListItemMetaSlots {
  root: React.ElementType;
}

export interface ConversationListItemMetaSlotProps {
  root?: SlotComponentProps<'div', {}, ConversationListItemMetaOwnerState>;
}

export interface ConversationListItemMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  conversation: ChatConversation;
  selected?: boolean;
  unread?: boolean;
  focused?: boolean;
  slots?: Partial<ConversationListItemMetaSlots>;
  slotProps?: ConversationListItemMetaSlotProps;
}

type ConversationListItemMetaComponent = ((
  props: ConversationListItemMetaProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationListItemMeta = React.forwardRef(function ConversationListItemMeta(
  props: ConversationListItemMetaProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    conversation,
    selected = false,
    unread = false,
    focused = false,
    ownerState: ownerStateProp,
    slots,
    slotProps,
    ...other
  } = props as ConversationListItemMetaProps & {
    ownerState?: ConversationListItemMetaOwnerState;
  };
  const ownerState: ConversationListItemMetaOwnerState = {
    conversation,
    selected,
    unread,
    focused,
  };
  void ownerStateProp;
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
    <Root {...rootProps}>
      {conversation.lastMessageAt ? (
        <time dateTime={conversation.lastMessageAt}>{conversation.lastMessageAt}</time>
      ) : null}
      {conversation.unreadCount != null && conversation.unreadCount > 0 ? (
        <span>{conversation.unreadCount}</span>
      ) : null}
    </Root>
  );
}) as ConversationListItemMetaComponent;
