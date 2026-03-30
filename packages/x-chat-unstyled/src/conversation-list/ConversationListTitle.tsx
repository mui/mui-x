'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import type { ChatConversation } from '@mui/x-chat-headless';
import { type ConversationListTitleOwnerState } from './conversationList.types';

export interface ConversationListTitleSlots {
  root: React.ElementType;
}

export interface ConversationListTitleSlotProps {
  root?: SlotComponentProps<'div', {}, ConversationListTitleOwnerState>;
}

export interface ConversationListTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  conversation: ChatConversation;
  selected?: boolean;
  unread?: boolean;
  focused?: boolean;
  slots?: Partial<ConversationListTitleSlots>;
  slotProps?: ConversationListTitleSlotProps;
}

type ConversationListTitleComponent = ((
  props: ConversationListTitleProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationListTitle = React.forwardRef(function ConversationListTitle(
  props: ConversationListTitleProps,
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
  } = props as ConversationListTitleProps & {
    ownerState?: ConversationListTitleOwnerState;
  };
  const ownerState: ConversationListTitleOwnerState = {
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

  return <Root {...rootProps}>{conversation.title ?? conversation.id}</Root>;
}) as ConversationListTitleComponent;
