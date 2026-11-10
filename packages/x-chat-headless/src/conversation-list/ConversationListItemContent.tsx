'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import type { ChatConversation } from '../types/chat-entities';
import type { ConversationListItemContentOwnerState } from './conversationList.types';

export interface ConversationListItemContentSlots {
  /**
   * The component that renders the root.
   */
  root: React.ElementType;
}

export interface ConversationListItemContentSlotProps {
  /**
   * The props used for the root slot.
   */
  root?: SlotComponentProps<'div', {}, ConversationListItemContentOwnerState>;
}

export interface ConversationListItemContentProps extends React.HTMLAttributes<HTMLDivElement> {
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
  slots?: Partial<ConversationListItemContentSlots>;
  /**
   * The props used for each component slot.
   * @default {}
   */
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
