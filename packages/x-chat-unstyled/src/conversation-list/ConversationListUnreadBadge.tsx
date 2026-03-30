'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import type { ChatConversation } from '@mui/x-chat-headless';
import { type ConversationListUnreadBadgeOwnerState } from './conversationList.types';

export interface ConversationListUnreadBadgeSlots {
  root: React.ElementType;
}

export interface ConversationListUnreadBadgeSlotProps {
  root?: SlotComponentProps<'span', {}, ConversationListUnreadBadgeOwnerState>;
}

export interface ConversationListUnreadBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  conversation: ChatConversation;
  selected?: boolean;
  unread?: boolean;
  focused?: boolean;
  slots?: Partial<ConversationListUnreadBadgeSlots>;
  slotProps?: ConversationListUnreadBadgeSlotProps;
}

type ConversationListUnreadBadgeComponent = ((
  props: ConversationListUnreadBadgeProps & React.RefAttributes<HTMLSpanElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const ConversationListUnreadBadge = React.forwardRef(function ConversationListUnreadBadge(
  props: ConversationListUnreadBadgeProps,
  ref: React.Ref<HTMLSpanElement>,
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
  } = props as ConversationListUnreadBadgeProps & {
    ownerState?: ConversationListUnreadBadgeOwnerState;
  };
  const ownerState: ConversationListUnreadBadgeOwnerState = {
    conversation,
    selected,
    unread,
    focused,
  };
  void ownerStateProp;

  const Root = slots?.root ?? 'span';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  });

  const unreadCount =
    conversation.unreadCount != null && conversation.unreadCount > 0
      ? conversation.unreadCount
      : null;

  if (!unreadCount) {
    return null;
  }

  return <Root {...rootProps}>{unreadCount > 99 ? '99+' : unreadCount}</Root>;
}) as ConversationListUnreadBadgeComponent;
