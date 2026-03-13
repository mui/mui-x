'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import type { ChatConversation } from '@mui/x-chat-headless';
import { type ConversationListItemTextOwnerState } from './conversationList.types';

export interface ConversationListItemTextSlots {
  root: React.ElementType;
}

export interface ConversationListItemTextSlotProps {
  root?: SlotComponentProps<'div', {}, ConversationListItemTextOwnerState>;
}

export interface ConversationListItemTextProps extends React.HTMLAttributes<HTMLDivElement> {
  conversation: ChatConversation;
  selected?: boolean;
  unread?: boolean;
  focused?: boolean;
  slots?: Partial<ConversationListItemTextSlots>;
  slotProps?: ConversationListItemTextSlotProps;
}

type ConversationListItemTextComponent = ((
  props: ConversationListItemTextProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationListItemText = React.forwardRef(function ConversationListItemText(
  props: ConversationListItemTextProps,
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
  } = props as ConversationListItemTextProps & {
    ownerState?: ConversationListItemTextOwnerState;
  };
  const ownerState: ConversationListItemTextOwnerState = {
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
      {conversation.title ? <div>{conversation.title}</div> : null}
      {conversation.subtitle ? <div>{conversation.subtitle}</div> : null}
    </Root>
  );
}) as ConversationListItemTextComponent;
