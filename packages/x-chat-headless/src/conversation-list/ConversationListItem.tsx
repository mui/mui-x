'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import type { ChatConversation } from '../types/chat-entities';
import { getDataAttributes } from '../internals/getDataAttributes';
import type { ConversationListItemOwnerState } from './conversationList.types';

export interface ConversationListItemSlots {
  /**
   * The component that renders the root.
   */
  root: React.ElementType;
}

export interface ConversationListItemSlotProps {
  /**
   * The props used for the root slot.
   */
  root?: SlotComponentProps<'div', {}, ConversationListItemOwnerState>;
}

export interface ConversationListItemProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
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
  slots?: Partial<ConversationListItemSlots>;
  /**
   * The props used for each component slot.
   * @default {}
   */
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
      // Expose the conversation id as a stable hook for tests, automation,
      // and consumer styling without forcing them to bind a ref (Playwright
      // Bug D).
      'data-conversation-id': conversation.id,
      ...getDataAttributes({
        selected: ownerState.selected,
        unread: ownerState.unread,
        focused: ownerState.focused,
      }),
    },
  });

  return <Root {...rootProps}>{children}</Root>;
}) as ConversationListItemComponent;
