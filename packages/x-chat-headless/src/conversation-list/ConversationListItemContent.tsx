'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import type { ChatConversation } from '../types/chat-entities';
import { type ConversationListItemContentOwnerState } from './conversationList.types';

export interface ConversationListItemContentSlots {
  root: React.ElementType;
}

export interface ConversationListItemContentSlotProps {
  root?: SlotComponentPropsFromProps<'div', {}, ConversationListItemContentOwnerState>;
}

export interface ConversationListItemContentProps extends React.HTMLAttributes<HTMLDivElement> {
  conversation: ChatConversation;
  selected?: boolean;
  unread?: boolean;
  focused?: boolean;
  slots?: Partial<ConversationListItemContentSlots>;
  slotProps?: ConversationListItemContentSlotProps;
}

type ConversationListItemContentComponent = ((
  props: ConversationListItemContentProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationListItemContent = React.forwardRef(function ConversationListItemContent(
  props: ConversationListItemContentProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    children,
    conversation,
    selected = false,
    unread = false,
    focused = false,
    ownerState: ownerStateProp,
    slots,
    slotProps,
    ...other
  } = props as ConversationListItemContentProps & {
    ownerState?: ConversationListItemContentOwnerState;
  };
  const ownerState: ConversationListItemContentOwnerState = {
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

  return <Root {...rootProps}>{children}</Root>;
}) as ConversationListItemContentComponent;
