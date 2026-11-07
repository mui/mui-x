'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import type { ChatConversation } from '../types/chat-entities';
import type { ConversationListTitleOwnerState } from './conversationList.types';

export interface ConversationListTitleSlots {
  /**
   * The component that renders the root.
   */
  root: React.ElementType;
}

export interface ConversationListTitleSlotProps {
  /**
   * The props used for the root slot.
   */
  root?: SlotComponentProps<'div', {}, ConversationListTitleOwnerState>;
}

export interface ConversationListTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The conversation the item renders.
   */
  conversation: ChatConversation;
  /**
   * If `true`, the conversation is selected.
   */
  selected?: boolean;
  /**
   * If `true`, the conversation has unread messages.
   */
  unread?: boolean;
  /**
   * If `true`, the item has keyboard focus.
   */
  focused?: boolean;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: Partial<ConversationListTitleSlots>;
  /**
   * The props used for each component slot.
   * @default {}
   */
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
