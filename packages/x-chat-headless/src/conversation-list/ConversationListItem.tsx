'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import type { ChatConversation } from '../types/chat-entities';
import { getDataAttributes } from '../internals/getDataAttributes';
import { type ConversationListItemOwnerState } from './conversationList.types';

export interface ConversationListItemSlots {
  root: React.ElementType;
}

export interface ConversationListItemSlotProps {
  root?: SlotComponentPropsFromProps<'div', {}, ConversationListItemOwnerState>;
}

export interface ConversationListItemProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  children?: React.ReactNode;
  conversation: ChatConversation;
  selected?: boolean;
  unread?: boolean;
  focused?: boolean;
  slots?: Partial<ConversationListItemSlots>;
  slotProps?: ConversationListItemSlotProps;
}

type ConversationListItemComponent = ((
  props: ConversationListItemProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationListItem = React.forwardRef(function ConversationListItem(
  props: ConversationListItemProps,
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
  } = props as ConversationListItemProps & {
    ownerState?: ConversationListItemOwnerState;
  };
  const ownerState: ConversationListItemOwnerState = {
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
      ...getDataAttributes({
        selected: ownerState.selected,
        unread: ownerState.unread,
        focused: ownerState.focused,
      }),
    },
  });

  return <Root {...rootProps}>{children}</Root>;
}) as ConversationListItemComponent;
